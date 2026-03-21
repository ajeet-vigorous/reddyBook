import { useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { setSecureItem, getSecureItem } from "../../global/secureStorage";

const useSocketCacheManager = (matchDetailsByMarketId, setMatchScoreData, eventId, marketId) => {
  const socketRef = useRef(null);
  const pollingIntervalRef = useRef(null);

  const connectSocket = (socketUrl) => {
    // Always clean up old socket before creating new one
    disconnectSocket();

    socketRef.current = io(socketUrl, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      randomizationFactor: 0.5,
      timeout: 10000,
    });

    socketRef.current.on("connect", () => {
      socketRef.current.emit("marketByEvent", eventId);
      socketRef.current.emit("JoinRoom", marketId);
    });

    // Re-subscribe on reconnect
    socketRef.current.io.on("reconnect", () => {
      socketRef.current.emit("marketByEvent", eventId);
      socketRef.current.emit("JoinRoom", marketId);
    });

    socketRef.current.on(eventId, (data) => {
      const parsed = typeof data === "string" ? JSON.parse(data) : data;
      setSecureItem(`_cachedMatchOddsData`, { _eid: eventId, data: parsed });
      setMatchScoreData((prevData) => ({
        ...prevData,
        dataByEventId: parsed,
      }));
    });

    socketRef.current.on(marketId, (data) => {
      const parsed = typeof data === "string" ? JSON.parse(data) : data;
      setSecureItem(`_cachedBookmakerData`, { _mid: marketId, result: parsed.result });
      setMatchScoreData((prevData) => ({
        ...prevData,
        dataByMarketId: parsed.result,
      }));
    });
  };

  const disconnectSocket = () => {
    if (socketRef.current) {
      socketRef.current.removeAllListeners();
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  };

  const callCache = (cacheUrl, eventUrl) => {
    // Clear old interval first
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }
    // Fetch immediately for instant data on reconnect
    getMarketCacheUrl(cacheUrl);
    getMarketEventUrl(eventUrl);
    pollingIntervalRef.current = setInterval(() => {
      getMarketCacheUrl(cacheUrl);
    }, 1000);
  };

  const getMarketCacheUrl = async (cacheUrl) => {
    if (!cacheUrl) return;
    try {
      const response = await axios.get(cacheUrl);
      if (response?.data?.result) {
        setSecureItem(`_cachedBookmakerData`, { _mid: marketId, result: response.data.result });
        setMatchScoreData((prevData) => ({
          ...prevData,
          dataByMarketId: response.data.result,
        }));
      }
    } catch (error) {
      console.error("Error fetching market cache URL:", error);
    }
  };

  const getMarketEventUrl = async (eventUrl) => {
    if (!eventUrl) return;
    try {
      const response = await axios.get(eventUrl);

      if (response?.data?.data) {
        setSecureItem(`_cachedMatchOddsData`, { _eid: eventId, data: response.data.data });
        setMatchScoreData((prevData) => ({
          ...prevData,
          dataByEventId: response.data.data,
        }));
      }
    } catch (error) {
      setMatchScoreData((prevData) => ({
        ...prevData,
        dataByEventId: [],
      }));
      console.error("Error fetching market event URL:", error);
    }
  };

  // Reconnect fresh - used by all resume events
  const reconnect = () => {
    if (matchDetailsByMarketId) {
      if (matchDetailsByMarketId.socketPerm) {
        connectSocket(matchDetailsByMarketId.socketUrl);
      } else {
        callCache(
          matchDetailsByMarketId.cacheUrl,
          matchDetailsByMarketId.otherMarketCacheUrl
        );
      }
    }
  };

  const handleVisibilityChange = () => {
    if (document.visibilityState === "hidden") {
      disconnectSocket();
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    } else if (document.visibilityState === "visible") {
      reconnect();
    }
  };

  // When device comes back online after network loss
  const handleOnline = () => {
    reconnect();
  };

  // When window gets focus (mobile app resume, tab click)
  const handleFocus = () => {
    if (!socketRef.current?.connected) {
      reconnect();
    }
  };

  return {
    connectSocket,
    disconnectSocket,
    callCache,
    handleVisibilityChange,
    handleOnline,
    handleFocus,
  };
};

export default useSocketCacheManager;

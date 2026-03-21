import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { io } from "socket.io-client";
import BlinkingComponent from "./BlinkingComponent";
import GlobalLayout from "../../global_layouts/GlobalLayout/GlobalLayout";
import { decrypt } from "../../config/Encryption";
import { httpPost } from "../../config/http2";
import { BetPlaceDesktop } from "../../component/betPlaceDesktop/BetPlaceDesktop";
import { apiCall } from "../../config/Http";
import BetListComponent from "../../component/BetListComponent/BetListComponent";
import { BetPlaceMobile } from "../../component/betPlaceDesktop/BetPlaceMobile";
import Loader from "../../component/loader/Loader";
import RulesModal from "../../component/rulesModal/RulesModal";
import moment from "moment";
import { getActiveBetsCount, getUserBalance } from "../../redux/_reducers/_user_reducers";
import ScreenAwakeToggle from "../../component/keepDisplayOn/KeepDisplayOn";
import RaceCountdown from "./RaceCountdown";
import RaceInplay from "../../component/inplay/raceInplay";
import { message, Tooltip } from "antd";
import { NumberFormatterZero } from "../../component/convert/NumberConvert";
import FormateValueNumber from "./FormateNumberValue";
import OpenBetListComponent from "../../component/BetListComponent/OpenBetListComponent";

const RacingDetails = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [inplayMatch, setInplayMatch] = useState({});
  const [scoreShow, setScoreShow] = useState(true);
  const [tvShow, setTvShow] = useState(true);
  const [betShow, setBetShow] = useState(true);
  const [betShowM, setBetShowM] = useState(true);
  const [finalSocket, setFinalSocketDetails] = useState({});
  const [hiddenRows, setHiddenRows] = useState([]);
  const [openBetList, setOpenBetList] = useState([]);

  const [combinedOdds, setCombinedOddsDisplay] = useState(null);
  const [betSlipData, setBetSlipData] = useState({
    stake: '0',
    count: 0,
    teamname: '',
    teamData: null
  });
  const [fancyBetData, setFancyBetData] = useState([]);
  const [oddsBetData, setOddsBetData] = useState([]);
  const [returnDataObject, setReturnDataObject] = useState({});
  const [betLoading, setBetLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [combindedFlag, setCombindedFlag] = useState(false);


  const [socketState, setSocketState] = useState(null);
  const socketRef = useRef(null);
  const heartbeatRef = useRef(null);
  const inplayMatchRef = useRef(null);
  const [positionObj, setPositionObj] = useState({});
  const [positioBetData, setPositionBetData] = useState({});
  const [isMatchCoin, setIsMatchCoin] = useState({ max: null, min: null });
  const [activeTab, setActiveTab] = useState("all");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [matchOddsSelected, setMatchOddsSelected] = useState([]);

  const openRulesModal = () => setIsRulesOpen(true);
  const closeRulesModal = () => setIsRulesOpen(false);
  const { marketIdEnc, eventIdEnc, sportIdEnc } = useParams();
  const marketId = decrypt(marketIdEnc);
  const eventId = decrypt(eventIdEnc);
  const sportId = decrypt(sportIdEnc);
  const dispatch = useDispatch();
  document.title = `${inplayMatch?.matchName} | BPEXCH`;

  const setMatchDataFromLocalstorage = async () => {
    // data loads directly from socket/API
  };

  useEffect(() => {
    inplayMatchRef.current = inplayMatch;
  }, [inplayMatch]);

  useEffect(() => {
    setMatchDataFromLocalstorage();

    const handleReconnect = () => {
      const matchData = inplayMatchRef.current;
      if (!matchData?.socketUrl) return;
      cleanupWebSocket();
      callSocket(matchData?.socketUrl, matchData?.sportId);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        handleReconnect();
      } else if (document.visibilityState === 'hidden') {
        cleanupWebSocket();
      }
    };

    const handleFocus = () => {
      if (!socketRef.current?.connected) {
        handleReconnect();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('online', handleReconnect);

    setupAsyncActions(marketId);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('online', handleReconnect);
      cleanupWebSocket();
    };
  }, [eventId, marketId]);

  const [oddsbetdata, setOddsbetData] = useState();
  useEffect(() => {
    if (positioBetData) {
      const sortedOddsBetData = positioBetData?.oddsBetData
        ? positioBetData?.oddsBetData
          .slice()
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        : [];
      const finalPositionInfo = {};
      sortedOddsBetData &&
        sortedOddsBetData.forEach((item) => {
          const positionInfo = item.positionInfo;
          for (const key in positionInfo) {
            if (positionInfo.hasOwnProperty(key)) {
              if (!finalPositionInfo[key]) {
                finalPositionInfo[key] = 0;
              }
              finalPositionInfo[key] += positionInfo[key];
            }
          }
        });
      setPositionObj(finalPositionInfo);
      setOddsbetData(sortedOddsBetData);
    }
  }, [positioBetData]);

  const setupAsyncActions = async (marketId) => {
    await getMatchDataByMarketID(marketId);
    fetchBetLists();
  };

  const cleanupWebSocket = () => {
    if (socketRef.current) {
      socketRef.current.removeAllListeners();
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    if (heartbeatRef.current) {
      clearInterval(heartbeatRef.current);
      heartbeatRef.current = null;
    }
    if (socketState) {
      socketState.disconnect();
      setSocketState(null);
    }
  };


  const getOpenBets = async () => {
    const resData = {
      marketId: marketId,
    };
    const openBetResponse = await httpPost("sports/getOpenBetsBymarketId", resData);
    if (openBetResponse && openBetResponse.data) {
      setOpenBetList(openBetResponse.data)

    }
  }

  const getMatchDataByMarketID = async (marketId) => {
    try {
      const resData = {
        marketId: marketId,
      };
      const inplayMatchResponse = await httpPost("sports/sportByMarketId", resData);
      if (inplayMatchResponse && inplayMatchResponse.data) {
        setInplayMatch(inplayMatchResponse.data);
        const data = inplayMatchResponse?.data;
        if (inplayMatchResponse?.data?.socketPerm) {
          callSocket(inplayMatchResponse?.data?.socketUrl, inplayMatchResponse.data?.sportId);
        }
      }
    } catch (error) {
      console.error("Error fetching inplay data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (inplayMatch?.socketPerm != false) return;
    const UrlBaseMarket = inplayMatch?.otherMarketCacheUrl || `https://cache.10xbpexch.com/v2/api/dataByEventId?eventId=${marketId}`;
    const intervalId = setInterval(() => {
      axios.get(UrlBaseMarket).then((response) => {
        if (response?.data) {
          filterData(response?.data?.data);


        }
      })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [eventId, inplayMatch?.socketPerm]);


  const hasRedirectedRef = useRef(false);

  useEffect(() => {
    if (
      inplayMatch?.status === "COMPLETED" &&
      !hasRedirectedRef.current
    ) {
      hasRedirectedRef.current = true;
      window.location.href = "/admin/dashboard";
    }
  }, [inplayMatch?.status]);

  useEffect(() => {
    const maxCoinData = inplayMatch?.maxMinCoins
      ? JSON.parse(inplayMatch?.maxMinCoins)
      : {
        maximum_match_bet: null,
        minimum_match_bet: null,
        maximum_session_bet: null,
        minimum_session_bet: null,
      };

    setIsMatchCoin({
      max: maxCoinData?.maximum_matchOdds_coins > 0 ? maxCoinData?.maximum_matchOdds_coins : maxCoinData?.maximum_match_bet,
      min: maxCoinData?.minimum_match_bet,
    });
  }, [inplayMatch]);

  const callSocket = async (socketUrl, matchId) => {
    if (socketRef.current?.connected) {
      return;
    }
    try {
      if (socketRef.current) {
        socketRef.current.removeAllListeners();
        socketRef.current.disconnect();
      }

      const socket = io.connect(socketUrl, {
        transports: ["websocket", "polling"],
        upgrade: true,
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 10000,
        reconnectionAttempts: Infinity,
        timeout: 30000,
      });

      socketRef.current = socket;
      const idToUse = matchId == 7 || matchId == 4339 ? marketId : eventId;

      socket.on("connect", () => {
        socket.emit("marketByEvent", idToUse);
        setIsConnected(true);
      });

      socket.emit("marketByEvent", idToUse);
      socket.on(idToUse, (data) => {
        setIsConnected(true);
        filterData(JSON.parse(data));
      });

      socket.on('disconnect', () => {
        setIsConnected(false);
      });

      // Heartbeat to detect stale connections
      clearInterval(heartbeatRef.current);
      heartbeatRef.current = setInterval(() => {
        if (socket?.connected) {
          socket.emit("pingCheck");
          const timeout = setTimeout(() => {
            socket.disconnect();
            socket.connect();
          }, 20000);
          socket.once("pongCheck", () => {
            clearTimeout(timeout);
          });
        }
      }, 25000);

      setSocketState(socket);
    } catch (error) {
      console.error("Error in socket connection:", error);
    }
  };

  const filterData = (matchDetailsForSocketNew) => {
    try {
      if (!matchDetailsForSocketNew || matchDetailsForSocketNew.length === 0) {
        return;
      }
      const criteria = ["Tied Match", "Match Odds", "To Win the Toss"];
      const filteredData = Array.isArray(matchDetailsForSocketNew)
        ? matchDetailsForSocketNew.filter((item) => criteria.includes(item.marketType))
        : [];
      if (filteredData.length > 0) {
        const filteredDataObject = [];
        filteredData.forEach((item) => {
          filteredDataObject[item.marketType] = item;
        });
        setFinalSocketDetails(filteredDataObject);
      } else {
        console.error("No data matched the first criteria.");
      }
    } catch (error) {
      console.error("Error filtering data:", error);
    }
  };

  const handelTvModal = () => {
    setTvShow(!tvShow);
    setScoreShow(false);
  };

  const openBets = () => {
    setBetShow(true);
    setBetShowM(false);
    setErrorMessage("");
    setSuccessMessage("");
  };


  const handleBackOpen = (data, isCombined = false) => {



    if (data?.odds == 0) return null
    if ((inplayMatch?.countryCode !== 'GB' && inplayMatch?.countryCode !== 'IE') && inplayMatch?.sportId == 7 && data?.inplayCheck === true && data?.statusCheck === 'OPEN') {
      message.error("Inplay Bets are Not Allowed");
      return;
    }

    const matchDateStr = inplayMatch?.matchDate;
    if (moment(matchDateStr, 'YYYY-MM-DD HH:mm:ss').isValid()) {
      const matchTime = moment.tz(matchDateStr, 'YYYY-MM-DD HH:mm:ss', 'Asia/Kolkata').clone().tz('Asia/Karachi');
      const currentTime = moment().tz('Asia/Karachi');
      if (inplayMatch?.sportId == 4339 && currentTime.isSameOrAfter(matchTime)) {
        message.error("Bet Closed this time");
        return;
      }

      const diffInMinutes = matchTime.diff(currentTime, 'minutes');
      // 
      if (diffInMinutes <= 6) {
        setBetShow(false);
        setBetShowM(false);
        if (isCombined) {
          setCombindedFlag(true)
          // Handle combined bet
          const matchOddsData = finalSocket['Match Odds'];
          if (!matchOddsData || !matchOddsData.runners) {
            message.error("Invalid combined bet data");
            return;
          }

          const selectedRunners = matchOddsData.runners.filter((_, index) => matchOddsSelected.includes(index + 1));
          const selectionIds = selectedRunners.map(runner => runner.selectionId);
          const teamNames = selectedRunners.map(runner => runner.selectionName).join('+');

          setBetSlipData({
            stake: '0',
            count: data.odds,
            teamname: teamNames,
            teamData: data.odds,
            betFor: "matchOdds",
            oddsType: "Match Odds",
            betType: data.type === "Yes" ? "L" : "K",
            selectionId: selectionIds, // Array for combined bets
            betfairMarketId: matchOddsData.marketId,
            price: data.odds,
            size: data.size,
            position: returnDataObject,
            newPosition: returnDataObject,
            isCombined: true // Flag to indicate combined bet
          });
        } else {
          setCombindedFlag(false)
          // Handle single bet (existing logic)
          setBetSlipData({
            data: data.data,
            type: data.type,
            odds: data.odds,
            name: data.name,
            nameOther: data.nameOther,
            inplayCheck: data.inplayCheck,
            statusCheck: data.statusCheck,
            betFor: data.betFor,
            oddsType: data.oddsType,
            betType: data.betType,
            selectionId: data.selectionId,
            teamData: data.teamData,
            betfairMarketId: data.betfairMarketId,
            price: data.price,
            size: data.size,
            position: data.position,
            newPosition: data.newPosition,
            stake: '0',
            count: data.odds,
            teamname: data.name
          });
        }
      } else {
        message.error("Bets Not Accepted At This Time");
      }
    } else {
      console.log("Invalid match date");
    }
  };

  const toggleRowVisibility = (id) => {
    if (hiddenRows.includes(id)) {
      setHiddenRows(hiddenRows.filter(rowId => rowId !== id));
    } else {
      setHiddenRows([...hiddenRows, id]);
    }
  };

  const calculateCombinedOdds = (type = 'back') => {
    try {
      if (!Array.isArray(matchOddsSelected) || matchOddsSelected.length < 2) return null;

      const matchOddsData = finalSocket['Match Odds'];
      if (!matchOddsData || !matchOddsData.runners) return null;

      let totalInverse = 0;
      let odds = [];

      const selectedRunners = matchOddsData.runners.filter((_, index) => matchOddsSelected.includes(index + 1));

      selectedRunners.forEach((runner) => {
        const raceOdds = type === 'back' ? runner.ex?.availableToBack?.[0]?.price : runner.ex?.availableToLay?.[0]?.price;
        if (raceOdds && !isNaN(raceOdds)) {
          odds.push(raceOdds);
          totalInverse += 1 / raceOdds;
        }
      });

      if (totalInverse === 0) return null;
      const combinedOdds = (1 / totalInverse) - 1;
      const roundedOdds = Math.round(combinedOdds * 100) / 100;
      return {
        odds,
        combinedOdds: roundedOdds,
        totalInverse,
      };
    } catch (error) {
      console.error("Error calculating combined odds:", error);
      return null;
    }
  };



  const placeBetCombind = async () => {
    try {
      // Calculate combined odds
      const result = calculateCombinedOdds();
      if (!result) return message.error("Unable to calculate combined odds.");
      const { odds, totalInverse } = result;


      // Display combined odds
      // setCombinedOddsDisplay(totalInverse);

      // Calculate distributed stakes
      let stakePerRace = matchOddsSelected.map((raceIndex, i) => {
        return betSlipData.stake * (1 / odds[i]) / totalInverse;
      });

      setBetLoading(true);

     
      let finalOdds = null;

      if (Array.isArray(betSlipData?.odds)) {
        const validOdds = betSlipData.odds.filter(
          (odd) => odd !== null && odd !== undefined
        );
        finalOdds = validOdds.length > 0 ? validOdds[0] : null;
      } else {
        finalOdds = betSlipData?.odds ?? null;
      }

      const betObject = {
        odds: finalOdds,
        amount: betSlipData.stake,
        selectionId: betSlipData.isCombined
          ? betSlipData.selectionId
          : [betSlipData.selectionId],
        marketId: marketId + "",
        eventId: eventId,
        betFor: betSlipData.betFor + "",
        run: betSlipData.run ? betSlipData.run + "" : "0",
        oddsType:
          betSlipData.oddsType === "Match Odds"
            ? "matchOdds"
            : betSlipData.oddsType === "Tied Match"
              ? "tiedMatch"
              : betSlipData.oddsType + "",
        type: betSlipData.betType + "",
        isCombined: betSlipData.isCombined || false,
      };

      if (
        betSlipData.oddsType !== "bookmaker" &&
        betSlipData.oddsType !== "fancy"
      ) {
        betObject["betfairMarketId"] = betSlipData.betfairMarketId + "";
      }


      // Single API Call
      const response = await apiCall("POST", "sports/combinedBetPlaceOdds", betObject);
      if (!response?.error) {
        setBetLoading(false);
        setBetShow(false);
        setBetShowM(false);
        setSuccessMessage(response.message || "All bets placed successfully!");
        dispatch(getActiveBetsCount());
        openBets();
        dispatch(getUserBalance());
        await fetchBetLists();
        await matchOddsPos();
      }

      if (
        betSlipData.oddsType === "Match Odds" &&
        (inplayMatch.countryCode === "GB" ||
          inplayMatch.countryCode === "IE") &&
        inplayMatch.sportId === 7
      ) {
        await getOpenBets();
      }
    } catch (error) {
      setBetLoading(false);
      console.error("Error placing bet:", error);
      setErrorMessage(error?.data?.message || "Bet failed");
    }
  };


  const placeBet = async () => {

    // if(betSlipData?.isCombined) return message.error("odds expired");
    try {
      const betObject = {
        odds: betSlipData.count + "",
        amount: betSlipData.stake,
        selectionId: betSlipData.isCombined ? betSlipData.selectionId[0] : betSlipData.selectionId + "",
        marketId: marketId + "",
        eventId: eventId,
        betFor: betSlipData.betFor + "",
        run: betSlipData.run ? betSlipData.run + "" : "0",
        oddsType: betSlipData.oddsType === "Match Odds" ? "matchOdds" : betSlipData.oddsType === "Tied Match" ? "tiedMatch" : betSlipData.oddsType + "",
        type: betSlipData.betType + "",
        isCombined: betSlipData.isCombined || false
      };

      if (betSlipData.oddsType === "bookmaker" || betSlipData.oddsType === "fancy") {
        // Do something if needed
      } else {
        betObject["betfairMarketId"] = betSlipData.betfairMarketId + "";
      }

      setBetLoading(true);
      let saveBetOdds = await apiCall("POST", "sports/oddBetPlaced", betObject);
      setBetLoading(true);
      setBetShow(false);
      setBetShowM(false);
      setSuccessMessage(saveBetOdds?.message);
      dispatch(getActiveBetsCount());
      if (!saveBetOdds.error) {
        setMatchOddsSelected([])
        setBetLoading(false);
        openBets();
        dispatch(getUserBalance());
        await fetchBetLists();
        await matchOddsPos();
        if (betSlipData.oddsType == "Match Odds" && (inplayMatch.countryCode == 'GB' && inplayMatch?.countryCode == 'IE') && inplayMatch?.sportId == 7) {
          await getOpenBets();
        }
      } else {
        console.log("Sorry! your bet couldn't be placed.");
        setBetLoading(false);
      }
    } catch (error) {
      setBetLoading(false);
      console.error('Error placing bet:', error.data.message);
      setErrorMessage(error.data.message);
    }
  };

  //  const calculateCombinedOdds = (type = 'back') => {
  //   try {
  //     if (matchOddsSelected.length < 2) return null;

  //     const matchOddsData = finalSocket['Match Odds'];
  //     if (!matchOddsData || !matchOddsData.runners) return null;

  //     let totalProbability = 0;
  //     const selectedRunners = matchOddsData.runners.filter((_, index) => matchOddsSelected.includes(index + 1));

  //     selectedRunners.forEach((runner) => {
  //       const odds = type === 'back' ? runner.ex?.availableToBack?.[0]?.price : runner.ex?.availableToLay?.[0]?.price;
  //       if (odds && !isNaN(odds)) {
  //         totalProbability += 1 / odds;
  //       }
  //     });

  //     if (totalProbability === 0) return null;
  //     const combinedOdds = (1 / totalProbability) - 1;
  //     return Math.round(combinedOdds * 100) / 100;
  //   } catch (error) {
  //     console.error('Error calculating combined odds:', error);
  //     return null;
  //   }
  // };

  const fetchBetLists = async () => {
    try {
      const BetListData = {
        fancyBet: true,
        isDeclare: false,
        oddsBet: true,
        marketId: marketId,
      };

      const userBetHistory = await httpPost('sports/betsList', BetListData);
      if (userBetHistory && userBetHistory.data) {
        const { oddsBetData } = userBetHistory.data;
        const sortedOddsBetData = oddsBetData
          ? oddsBetData.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          : [];
        setOddsBetData(sortedOddsBetData);
        setPositionBetData(userBetHistory.data);
      }
    } catch (error) {
      console.error('Error fetching bet lists:', error);
      throw error;
    }
  };

  const matchOddsPos = async () => {
    await httpPost('reports/matchOddsRunningPos');
  };

  const closeRow = (id) => {
    setHiddenRows(hiddenRows.filter(rowId => rowId !== id));
  };

  const increaseCount = () => {
    try {
      if (betSlipData.oddsType == 'Match Odds') {
        setBetSlipData(prevData => {
          const newCount = parseFloat(prevData.count) + 0.01;
          return {
            ...prevData,
            count: newCount.toFixed(2)
          };
        });
      } else {
        console.log('Not Match Odds, count not increased');
      }
    } catch (error) {
      console.error('Error increasing count:', error);
    }
  };


  const decreaseCount = () => {
    try {
      if (betSlipData.oddsType == 'Match Odds') {
        setBetSlipData(prevData => {
          const newCount = parseFloat(prevData.count) - 0.01;
          return {
            ...prevData,
            count: newCount.toFixed(2)
          };
        })
      } else {
        console.log('Not Match Odds, count not decreased');
      }
    } catch (error) {
      console.error('Error decreasing count:', error);
    }
  };
  const handleCheckboxClick = (itemId) => {
    setMatchOddsSelected((prev) => {
      if (prev.includes(itemId)) {
        return prev.filter((id) => id !== itemId);
      } else {
        if (matchOddsSelected?.length >= 5) return [...prev];
        return [...prev, itemId];
      }
    });
  };

  const combinedBackResult = calculateCombinedOdds('back');
  const combinedLayResult = calculateCombinedOdds('lay');
  const combinedBackOdds = combinedBackResult?.combinedOdds ?? null;
  const combinedLayOdds = combinedLayResult?.combinedOdds ?? null;


  const trapColors = {
    1: { bg: '#FF0000', text: '#FFFFFF' },
    2: { bg: '#0000FF', text: '#FFFFFF' },
    3: { bg: '#FFFFFF', text: '#000000' },
    4: { bg: '#000000', text: '#FFFFFF' },
    5: { bg: '#FFA500', text: '#000000' },
    6: { bg: '#00FF00', text: '#000000' },
    7: { bg: '#008000', text: '#FFFFFF' },
    8: { bg: '#FFC0CB', text: '#000000' }
  };


  const trapColorsAU = {
    1: { bg: '#FF0000', text: '#FFFFFF' },
    2: { bg: '#000000', text: '#FFFFFF' },
    3: { bg: '#FFFFFF', text: '#000000' },
    4: { bg: '#0000FF', text: '#FFFFFF' },
    5: { bg: '#FFFF00', text: '#000000' },
    6: { bg: '#008000', text: '#FFFFFF' },
    7: { bg: '#8B4513', text: '#000000' },
    8: { bg: '#FFC0CB', text: '#000000' }
  };

  function getTrapColorAU(runnerName) {
    const trapMatch = runnerName.match(/^(\d+)\./);
    const trap = trapMatch ? parseInt(trapMatch[1]) : null;
    return trapColorsAU[trap] || { bg: '#CCCCCC', text: '#000000' };
  }

  function getTrapColor(runnerName) {
    const trapMatch = runnerName.match(/^(\d+)\./);
    const trap = trapMatch ? parseInt(trapMatch[1]) : null;
    return trapColors[trap] || { bg: '#CCCCCC', text: '#000000' };
  }


  return isLoading ? (
    <Loader loaderTrue={isLoading} />
  ) : (
    <GlobalLayout>
      {isRulesOpen && <RulesModal closeRulesModal={closeRulesModal} />}
      {inplayMatch && inplayMatch?.notification && (
        <span className="w-full flex-1 text-xs websiteThemeSoundColor text-black flex items-center">
          <marquee className="">{inplayMatch?.notification}</marquee>
        </span>
      )}
      <div className="md:flex justify-center w-100 gap-x-1">
        <div className="md:w-2/3 h-100">
          <div className="w-full py-1 websiteThemeColor">
            <div className="flex py-2 !sm:px-2 px-1">
              <div className="flex items-center">
                <div className="w-12 h-12 py-2 px-2 websiteThemeSoundColor sm:flex items-center justify-center hidden">
                  {sportId == 7 && <img src="/assest/images/horse.svg" alt="matchInplaY" />}
                  {sportId == 4339 && <img src="/assest/images/greyhound.svg" alt="matchInplaY" />}
                </div>
              </div>

              <div className="px-2 text-white">
                <div className="w-10 h-10 py-2 px-2 websiteThemeSoundColor sm:hidden items-center justify-center mb-1">
                  {sportId == 7 && <img src="/assest/images/horse.svg" alt="matchInplaY" />}
                  {sportId == 4339 && <img src="/assest/images/greyhound.svg" alt="matchInplaY" />}
                </div>

                <div className="sm:!text-xs text-[11px] text-white/90 font-medium flex justify-start items-center">
                  <img src="/assest/images/sidebar/clock-green.svg" alt="time" className="" width={15} height={15} />
                  &nbsp;
                  <span className="">
                    {moment(inplayMatch?.matchDate, 'YYYY-MM-DD HH:mm:ss').isValid()
                      ? moment()
                        .to(
                          moment
                            .tz(inplayMatch?.matchDate, 'YYYY-MM-DD HH:mm:ss', 'Asia/Kolkata')
                            .clone()
                            .tz('Asia/Karachi')
                        )
                      : '-'}
                  </span>
                  &nbsp;|&nbsp;
                  <span className="">
                    {moment(inplayMatch?.matchDate, 'YYYY-MM-DD HH:mm:ss').isValid()
                      ? moment
                        .tz(inplayMatch?.matchDate, 'YYYY-MM-DD HH:mm:ss', 'Asia/Kolkata')
                        .clone()
                        .tz('Asia/Karachi')
                        .format('MMM DD hh:mm A')
                      : '-'}
                  </span>
                  &nbsp; | Winners: 1
                </div>

                <div className="text-lg font-bold">
                  <span className="">
                    {moment(inplayMatch?.matchDate, 'YYYY-MM-DD HH:mm:ss').isValid()
                      ? moment
                        .tz(inplayMatch?.matchDate, 'YYYY-MM-DD HH:mm:ss', 'Asia/Kolkata')
                        .clone()
                        .tz('Asia/Karachi')
                        .format('hh:mm A')
                      : '-'}
                  </span>{' '}
                  {inplayMatch && inplayMatch?.sportName ? inplayMatch?.sportName : ""}
                </div>
                <div className="text-xs font-bold flex gap-x-2">
                  {<RaceCountdown matchDate={inplayMatch?.matchDate} />}
                </div>
                <div className="md:hidden block flex">
                  <ScreenAwakeToggle />
                </div>
              </div>
              <div className="text-[#00B181] ml-auto px-2 md:text-[26px] text-lg uppercase font-bold">
                {finalSocket && typeof finalSocket === "object" && Object.values(finalSocket).length > 0 ? (
                  Object.values(finalSocket).map((element, index) =>
                    element?.marketType === "Match Odds" ? (
                      <div key={index}>{element?.inplay && element?.status === 'OPEN' ? "InPlay" : element?.status}</div>
                    ) : null
                  )
                ) : null}
              </div>
            </div>
          </div>
          <div className="bg-[#fff]">
            {matchOddsSelected?.length > 1 && (
              <>
                <header className="mt-1">
                  <div className="items-center flex relative z-0">
                    <div className="d-flex align-items-center h-100 uppercase lg:w-[40%] xl:w-[55%] w-[65%]">
                      <span className="websiteThemeSoundColor px-0.5 py-1">
                        <img src="/assest/images/time.png" alt="time" className="" />
                      </span>
                      <div className="bg-black sm:text-xs text-[9px] py-1 px-1 font-semibold text-white whitespace-nowrap">
                        Combined &nbsp;(
                        <span className="">
                          MaxBet:
                          <span>
                            <NumberFormatterZero value={isMatchCoin?.max} />
                          </span>
                        </span>
                        )
                      </div>

                      <div className="px-0.5 text-sm font-bold">
                        <span className="py-1 px-1 bg-[#333333] text-white relative group flex cursor-pointer">
                          <i className="fa fa-info-circle"></i>
                          <span
                            onClick={openRulesModal}
                            className="absolute top-0 left-[22px] px-1 py-[3px] hidden text-xs bg-[#333333] text-white group-hover:block transition-all"
                          >
                            Rules
                          </span>
                        </span>
                      </div>
                    </div>

                    <div className="lg:w-[60%] xl:w-[45%] w-[35%]  flex flex-wrap justify-center items-center">
                      <div className="w-full uppercase text-white flex gap-x-1 items-center">
                        <div className="w-1/2 py-0.5 sm:text-sm text-[13px] sm:font-bold font-semibold sm:!text-right text-center px-2 bg-black">
                          Back
                        </div>
                        <div className="w-1/2 py-0.5 sm:text-sm text-[13px] sm:font-bold font-semibold sm:!text-left text-center px-2 bg-black">
                          Lay
                        </div>
                      </div>
                    </div>
                  </div>
                </header>
                <div className={`flex whitespace-normal max-w-full border-b border-gray-300`}>
                  <div className="lg:w-[40%] xl:w-[55%] w-[65%] flex px-2">
                    <div className="w-full py-1 leading-3 flex items-center text-[#333333]">
                      <span className="text-[16px] font-bold flex items-center gap-2">
                        <span>{matchOddsSelected?.join('+')}<br /></span>
                      </span>
                    </div>
                  </div>
                  <div className="lg:w-[60%] xl:w-[45%] w-[35%]  grid grid-cols-6 gap-x-1">
                    <span className="lg:col-span-1 col-span-3 rounded-md lg:block hidden">
                      <BlinkingComponent color={"bg-[#E6F2FC]"} blinkColor={"bg-[#00B2FF]"} hoverColor={"bg-sky-600"} />
                    </span>
                    <span className="lg:col-span-1 col-span-3 rounded-md lg:block hidden">
                      <BlinkingComponent color={"bg-[#E6F2FC]"} blinkColor={"bg-[#00B2FF]"} hoverColor={"bg-sky-600"} />
                    </span>

                    <span
                      className="md:col-span-3 sm:col-span-3 rounded-md col-span-3 lg:hidden block cursor-pointer"
                      onClick={() =>
                        handleBackOpen(
                          {
                            odds: combinedBackOdds < 0 ? 0 : combinedBackOdds,
                            type: "Yes",
                            betType: "L",
                            size: 100, // Default size, adjust as needed
                            betFor: "matchOdds",
                            oddsType: "Match Odds",
                            betfairMarketId: finalSocket['Match Odds']?.marketId
                          },
                          true
                        )
                      }
                    >
                      <BlinkingComponent
                        price={combinedBackOdds < 0 ? 0 : combinedBackOdds || '-'}
                        color={"bg-[#8DD2F0]"}
                        blinkColor={"bg-[#00B2FF]"}
                      />
                    </span>
                    <span
                      className="lg:col-span-1 col-span-3 rounded-md lg:block hidden cursor-pointer"
                      onClick={() =>
                        handleBackOpen(
                          {
                            odds: combinedBackOdds < 0 ? 0 : combinedBackOdds,
                            type: "Yes",
                            betType: "L",
                            size: 100, // Default size, adjust as needed
                            betFor: "matchOdds",
                            oddsType: "Match Odds",
                            betfairMarketId: finalSocket['Match Odds']?.marketId
                          },
                          true
                        )
                      }
                    >
                      <BlinkingComponent
                        price={combinedBackOdds < 0 ? 0 : combinedBackOdds || '-'}
                        color={"bg-[#8DD2F0]"}
                        blinkColor={"bg-[#00B2FF]"}
                      />
                    </span>
                    <span
                      // onClick={() => alert('Bet not accepted at this time')}
                      className="lg:col-span-1 col-span-3 rounded-md lg:hidden cursor-pointer"
                      onClick={() =>
                        handleBackOpen(
                          {
                            odds: combinedLayOdds < 0 ? 0 : combinedLayOdds,
                            type: "No",
                            betType: "K",
                            size: 100, // Default size, adjust as needed
                            betFor: "matchOdds",
                            oddsType: "Match Odds",
                            betfairMarketId: finalSocket['Match Odds']?.marketId
                          },
                          true
                        )
                      }
                    >
                      <BlinkingComponent
                        price={combinedLayOdds < 0 ? 0 : combinedLayOdds || '-'}
                        color={"bg-[#FEAFB2]"}
                        blinkColor={"bg-[#FE7A7F]"}
                      />
                    </span>
                    <span
                      // onClick={() => alert('Bet not accepted at this time')}
                      className="lg:col-span-1 col-span-3 rounded-md lg:block hidden cursor-pointer"
                      onClick={() =>
                        handleBackOpen(
                          {
                            odds: combinedLayOdds < 0 ? 0 : combinedLayOdds,
                            type: "No",
                            betType: "K",
                            size: 100, // Default size, adjust as needed
                            betFor: "matchOdds",
                            oddsType: "Match Odds",
                            betfairMarketId: finalSocket['Match Odds']?.marketId
                          },
                          true
                        )
                      }
                    >
                      <BlinkingComponent
                        price={combinedLayOdds < 0 ? 0 : combinedLayOdds || '-'}
                        color={"bg-[#FEAFB2]"}
                        blinkColor={"bg-[#FE7A7F]"}
                      />
                    </span>
                    <span className="lg:col-span-1 col-span-2 rounded-md lg:block hidden">
                      <BlinkingComponent color={"bg-[#FCE3E4]"} blinkColor={"bg-[#CDEBEB]"} />
                    </span>
                    <span className="lg:col-span-1 col-span-2 rounded-md lg:block hidden">
                      <BlinkingComponent color={"bg-[#FCE3E4]"} blinkColor={"bg-[#CDEBEB]"} />
                    </span>
                  </div>
                </div>
              </>
            )}
            {inplayMatch?.isMatchOdds && activeTab === "all" ? (
              <>
                {finalSocket && typeof finalSocket === "object" && Object.values(finalSocket).length > 0 ? (
                  Object.values(finalSocket)?.map((element, index) => {
                    if (element.marketType !== "Match Odds") {
                      return null;
                    }
                    return (
                      <div className="" key={index}>
                        <header className="mt-1">
                          <div className="items-center flex relative z-0">
                            <div className="d-flex align-items-center h-100 uppercase lg:w-[40%] xl:w-[55%] w-[65%]">
                              <span className="websiteThemeSoundColor px-0.5 py-1">
                                <img src="/assest/images/time.png" alt="time" className="" />
                              </span>
                              <div className="bg-black sm:text-xs text-[9px] py-1 px-1 font-semibold text-white whitespace-nowrap">
                                {inplayMatch && inplayMatch?.marketName ? inplayMatch?.marketName : ""}&nbsp;(
                                <span className="">
                                  MaxBet:
                                  <span>
                                    <NumberFormatterZero value={isMatchCoin?.max} />
                                  </span>
                                </span>
                                )
                              </div>

                              <div className="px-0.5 text-sm font-bold">
                                <span className="py-1 px-1 bg-[#333333] text-white relative group flex cursor-pointer">
                                  <i className="fa fa-info-circle"></i>
                                  <span
                                    onClick={openRulesModal}
                                    className="absolute top-0 left-[22px] px-1 py-[3px] hidden text-xs bg-[#333333] text-white group-hover:block transition-all"
                                  >
                                    Rules
                                  </span>
                                </span>
                              </div>
                            </div>

                            <div className="lg:w-[60%] xl:w-[45%] w-[35%]  flex flex-wrap justify-center items-center">
                              <div className="w-full uppercase text-white flex gap-x-1 items-center">
                                <div className="w-1/2 py-0.5 sm:text-sm text-[13px] sm:font-bold font-semibold sm:!text-right text-center px-2 bg-black">
                                  Back
                                </div>
                                <div className="w-1/2 py-0.5 sm:text-sm text-[13px] sm:font-bold font-semibold sm:!text-left text-center px-2 bg-black">
                                  Lay
                                </div>
                              </div>
                            </div>
                          </div>
                        </header>

                        {element &&
                          element.runners &&
                          element.runners.length > 0 &&
                          element.runners.map((elementtemp, index) => {

                            const matchingMarket = inplayMatch?.marketList?.find(
                              (mkt) => mkt?.marketId === element?.marketId
                            );



                            const selectionInfo = matchingMarket?.selectionIdData?.find(
                              (sel) => sel?.selectionId === elementtemp?.selectionId
                            );

                            const parsedMetaData = (() => {
                              try {
                                return typeof selectionInfo?.metadata === "string"
                                  ? JSON.parse(selectionInfo.metadata)
                                  : selectionInfo?.metadata || {};
                              } catch {
                                return {};
                              }
                            })();

                            function getTrapColorDogRace(runnerName) {
                              const trapMatch = runnerName.match(/^(\d+)\./);
                              const trap = trapMatch ? parseInt(trapMatch[1]) : null;

                              return trap
                            }


                            return (
                              <div
                                className={`relative flex whitespace-normal max-w-full ${element?.status === 'CLOSED' && elementtemp?.status === 'WINNER' ? 'bg-[#b7f776]' : ''
                                  }`}
                                key={index}
                              >
                                <div className="lg:w-[40%] xl:w-[55%] w-[65%] flex px-2">
                                  <div className="w-full py-1 leading-3 flex items-center text-[#2B2f35]">
                                    <div className="text-[14px] flex justify-between w-full font-bold">
                                      {sportId == 7 && (
                                        <div className="px-1">
                                          <span>
                                            <input
                                              checked={matchOddsSelected.includes(index + 1)}
                                              onClick={() => {
                                                handleCheckboxClick(index + 1);
                                              }}
                                              type="checkbox"
                                              className="!bg-white h-4 w-4"
                                            />
                                          </span>
                                        </div>
                                      )}

                                      <div className="w-full">
                                        <span className="inline-flex items-center gap-1">
                                          {inplayMatch?.countryCode != 'AU' && <span className="text-base w-4 font-bold">
                                            {parsedMetaData?.CLOTH_NUMBER
                                              ? `${parsedMetaData.CLOTH_NUMBER}.`
                                              : ""}
                                          </span>}


                                          {inplayMatch?.sportId === 7 && <span className="text-base font-bold">
                                            {inplayMatch?.countryCode === 'GB' ? <img src={`https://bp-silks.lhre.net/proxy/${parsedMetaData?.COLOURS_FILENAME}`} className="w-4 h-4" alt="" />
                                              : inplayMatch?.countryCode === 'US' ? inplayMatch?.countryCode === 'US' && <img src={`https://bp-silks.lhre.net/saddle/us/${parsedMetaData?.CLOTH_NUMBER}.svg`} className="w-4 h-4" alt="" />
                                                : <img src={`https://bp-silks.lhre.net/proxy/${parsedMetaData?.COLOURS_FILENAME}`} className="w-4 h-4" alt="" />
                                            }

                                          </span>}


                                          {inplayMatch?.sportId !== 7 && <span className="text-base font-bold">
                                            {inplayMatch?.countryCode === 'GB' ? <img src={`https://bp-silks.lhre.net/saddle/uk/${getTrapColorDogRace(selectionInfo?.runnerName)}.svg`} className="w-4 h-4" alt="" />
                                              : inplayMatch?.countryCode === 'AU' ? inplayMatch?.countryCode === 'AU' && <img src={`https://bp-silks.lhre.net/saddle/au/${getTrapColorDogRace(selectionInfo?.runnerName)}.svg`} className="w-4 h-4" alt={`${getTrapColorDogRace(selectionInfo?.runnerName)}`} />
                                                : <img src={`https://bp-silks.lhre.net/proxy/${parsedMetaData?.COLOURS_FILENAME}`} className="w-4 h-4" alt="" />
                                            }

                                          </span>}


                                          {/* 
                                                                   {inplayMatch?.countryCode === 'GB' && inplayMatch?.sportId !== 7 && <span
                                                                   style={{
                                                                    backgroundColor: getTrapColor(selectionInfo?.runnerName).bg,
                                                                    color: getTrapColor(selectionInfo?.runnerName).text,
                                                                    width: "14px",
                                                                    height: "14px"
                                                                    }}>

                                                                    </span>} */}




                                          {/* <span className="text-base font-bold">
                                                                      {inplayMatch?.countryCode === 'GB' ? <img src={`https://content.livetvapi.com/Horses/SilkColours/${parsedMetaData?.CLOTH_NUMBER}.svg`} className="w-4 h-4" alt=""/>
                                                                      : inplayMatch?.countryCode === 'US' ? inplayMatch?.countryCode === 'US' && <img src={`https://content.livetvapi.com/Horses/SilkColours/${parsedMetaData?.CLOTH_NUMBER}.svg`} className="w-4 h-4" alt=""/>
                                                                      : <img src={`https://content.livetvapi.com/Horses/SilkColours/${parsedMetaData?.COLOURS_FILENAME}`} className="w-4 h-4" alt=""/>
                                                                    }
                                                  
                                                                      
                                                                    </span> */}
                                        </span>
                                        &nbsp;
                                        <Tooltip
                                          placement="top"
                                          title={
                                            <>
                                              <div className="text-[12px] font-bold">
                                                Jockey: {selectionInfo?.jockeyName || parsedMetaData?.JOCKEY_NAME}
                                              </div>
                                              <div className="text-[12px] font-bold">
                                                Age: {selectionInfo?.age || parsedMetaData?.AGE}
                                              </div>
                                              <div className="text-[12px] font-bold">
                                                Trainer: {selectionInfo?.trainerName || parsedMetaData?.TRAINER_NAME}
                                              </div>
                                            </>
                                          }
                                        >
                                          <span className="inline-flex items-center gap-1">
                                            {selectionInfo?.runnerName}
                                          </span>
                                        </Tooltip>
                                        <p className="text-xs flex items-center font-normal text-black/75 py-1">
                                          {selectionInfo?.jockeyName || parsedMetaData?.JOCKEY_NAME}
                                        </p>
                                      </div>
                                      <div
                                        key={index}
                                        className={
                                          positionObj[elementtemp.selectionId] > 0
                                            ? 'text-[#00B181] !mt-2'
                                            : positionObj[elementtemp.selectionId] < 0
                                              ? 'text-red-500 !mt-2'
                                              : 'black'
                                        }
                                      >
                                        {positionObj[elementtemp.selectionId]
                                          ? (Math.floor(Number(positionObj[elementtemp.selectionId]) * 100) / 100).toFixed(0)
                                          : ''}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="lg:w-[60%] xl:w-[45%] w-[35%] grid grid-cols-6 gap-x-1">
                                  {/* {elementtemp && elementtemp.ex && elementtemp.ex.availableToBack && elementtemp.ex.availableToBack.length > 0 ? (
                                    <>
                                      {elementtemp.ex.availableToBack.slice(1).reverse().map((tempData, index) =>
                                      {
                                        const matchedTrade = elementtemp.ex.tradedVolume?.find(
                                                              (trade) => trade.price === tempData.price);
                                                              const displaySize = matchedTrade ? matchedTrade.size : tempData.size
                                        return (
                                        <span className="lg:col-span-1 col-span-2 rounded-md lg:block hidden">
                                          <BlinkingComponent
                                            price={tempData.price}
                                            size={FormateValueNumber(displaySize)}
                                            color={"bg-[#E6F2FC]"}
                                            blinkColor={"bg-[#00B2FF]"}
                                            hoverColor={"bg-sky-600"}
                                          />
                                        </span>
                                      )})}
                                    </>
                                  ) : (
                                    <BlinkingComponent
                                      price={0}
                                      size={0}
                                      color={"bg-[#E9F6FC]"}
                                      blinkColor={"bg-[#CDEBEB]" }
                                      textColors={"text-white"}
                                      boderColors={"border-black"}
                                      />
                                  )}

                                  {elementtemp && elementtemp.ex && elementtemp.ex.availableToBack && elementtemp.ex.availableToBack.length > 0 ? (
                                    <>
                                      {elementtemp.ex.availableToBack.slice(0, 1).map((tempData, index) =>{
                                        const matchedTrade = elementtemp.ex.tradedVolume?.find(
                                                              (trade) => trade.price === tempData.price);
                                                              const displaySize = matchedTrade ? matchedTrade.size : tempData.size
                                        return(
                                        <>
                                          <span
                                            className="md:col-span-2 sm:col-span-2 rounded-md col-span-3 md:col-start-2 lg:hidden block"
                                            onClick={() => {
                                              handleBackOpen({
                                                data: tempData,
                                                type: "Yes",
                                                odds: tempData.price,
                                                name: elementtemp.selectionName,
                                                nameOther: element.runners,
                                                inplayCheck: element.inplay,
                                                statusCheck: element.status,
                                                betFor: "matchOdds",
                                                oddsType: element.marketType,
                                                betType: "L",
                                                selectionId: elementtemp.selectionId,
                                                teamData: tempData.price,
                                                betfairMarketId: element.marketId,
                                                price: elementtemp.ex.availableToLay[0].price,
                                                size: elementtemp.ex.availableToLay[0].size,
                                                position: returnDataObject,
                                                newPosition: returnDataObject
                                              });
                                            }}
                                          >
                                            <BlinkingComponent
                                              price={tempData.price}
                                              size={FormateValueNumber(displaySize)}
                                              color={"bg-[#8DD2F0]"}
                                              blinkColor={"bg-[#00B2FF]"}
                                            />
                                          </span>
                                          <span
                                            className="lg:col-span-1 col-span-3 rounded-md lg:block hidden"
                                            onClick={() => {
                                              handleBackOpen({
                                                data: tempData,
                                                type: "Yes",
                                                odds: tempData.price,
                                                name: elementtemp.selectionName,
                                                nameOther: element.runners,
                                                inplayCheck: element.inplay,
                                                statusCheck: element.status,
                                                betFor: "matchOdds",
                                                oddsType: element.marketType,
                                                betType: "L",
                                                selectionId: elementtemp.selectionId,
                                                teamData: tempData.price,
                                                betfairMarketId: element.marketId,
                                                price: elementtemp.ex.availableToLay[0].price,
                                                size: elementtemp.ex.availableToLay[0].size,
                                                position: returnDataObject,
                                                newPosition: returnDataObject
                                              });
                                            }}
                                          >
                                            <BlinkingComponent
                                              price={tempData.price}
                                              size={FormateValueNumber(displaySize)}
                                              color={"bg-[#8DD2F0]"}
                                              blinkColor={"bg-[#00B2FF]"}
                                            />
                                          </span>
                                        </>
                                      )
                                      })}
                                    </>
                                  ) : <>
                                   <BlinkingComponent
                                      price={0}
                                      size={0}
                                      color={"bg-[#E9F6FC]"}
                                      blinkColor={"bg-[#CDEBEB]" }
                                      textColors={"text-white"}
                                      boderColors={"border-black"}
                                      /> 
                                      <BlinkingComponent
                                      price={0}
                                      size={0}
                                      color={"bg-[#E9F6FC]"}
                                      blinkColor={"bg-[#CDEBEB]" }
                                      textColors={"text-white"}
                                      boderColors={"border-black"}
                                      /></>} */}

                                  {(() => {
                                    const availableToBack = elementtemp.ex?.availableToBack || [];
                                    const paddedBack = [...availableToBack];
                                    while (paddedBack.length < 3) {
                                      paddedBack.push({ price: 0, size: 0 });
                                    }

                                    return (
                                      <>
                                        {/* Extra 2 Back items (index 1, 2) - reverse order, desktop only */}
                                        {paddedBack.slice(1).reverse().map((tempData, idx) => {
                                          const matchedTrade = elementtemp.ex.tradedVolume?.find(
                                            (trade) => trade.price === tempData.price
                                          );
                                          const displaySize = matchedTrade ? matchedTrade.size : tempData.size;

                                          return (
                                            <span
                                              key={`back-extra-${elementtemp.selectionId}-${idx}`}
                                              className="lg:col-span-1 col-span-2 rounded-md lg:block hidden"
                                            >
                                              <BlinkingComponent
                                                price={tempData.price || 0}
                                                size={FormateValueNumber(displaySize) || 0}
                                                color="bg-[#E6F2FC]"
                                                blinkColor="bg-[#00B2FF]"
                                                hoverColor="bg-sky-600"
                                              />
                                            </span>
                                          );
                                        })}

                                        {/* First Back item (index 0) - special, clickable */}
                                        {paddedBack.slice(0, 1).map((tempData, idx) => {
                                          const matchedTrade = elementtemp.ex.tradedVolume?.find(
                                            (trade) => trade.price === tempData.price
                                          );
                                          const displaySize = matchedTrade ? matchedTrade.size : tempData.size;

                                          return (
                                            <React.Fragment key={`back-main-${elementtemp.selectionId}`}>
                                              {/* Mobile View */}
                                              <span
                                                className="md:col-span-2 sm:col-span-2 rounded-md col-span-3 md:col-start-2 lg:hidden block"
                                                onClick={() => {
                                                  handleBackOpen({
                                                    data: tempData,
                                                    type: "Yes",
                                                    odds: tempData.price,
                                                    name: elementtemp.selectionName,
                                                    nameOther: element.runners,
                                                    inplayCheck: element.inplay,
                                                    statusCheck: element.status,
                                                    betFor: "matchOdds",
                                                    oddsType: element.marketType,
                                                    betType: "L",
                                                    selectionId: elementtemp.selectionId,
                                                    teamData: tempData.price,
                                                    betfairMarketId: element.marketId,
                                                    price: elementtemp.ex.availableToLay?.[0]?.price,
                                                    size: elementtemp.ex.availableToLay?.[0]?.size,
                                                    position: returnDataObject,
                                                    newPosition: returnDataObject,
                                                  });
                                                }}
                                              >
                                                <BlinkingComponent
                                                  price={tempData.price || 0}
                                                  size={FormateValueNumber(displaySize) || 0}
                                                  color="bg-[#8DD2F0]"
                                                  blinkColor="bg-[#00B2FF]"
                                                />
                                              </span>

                                              {/* Desktop View */}
                                              <span
                                                className="lg:col-span-1 col-span-3 rounded-md lg:block hidden"
                                                onClick={() => {
                                                  handleBackOpen({
                                                    data: tempData,
                                                    type: "Yes",
                                                    odds: tempData.price,
                                                    name: elementtemp.selectionName,
                                                    nameOther: element.runners,
                                                    inplayCheck: element.inplay,
                                                    statusCheck: element.status,
                                                    betFor: "matchOdds",
                                                    oddsType: element.marketType,
                                                    betType: "L",
                                                    selectionId: elementtemp.selectionId,
                                                    teamData: tempData.price,
                                                    betfairMarketId: element.marketId,
                                                    price: elementtemp.ex.availableToLay?.[0]?.price,
                                                    size: elementtemp.ex.availableToLay?.[0]?.size,
                                                    position: returnDataObject,
                                                    newPosition: returnDataObject,
                                                  });
                                                }}
                                              >
                                                <BlinkingComponent
                                                  price={tempData.price || 0}
                                                  size={FormateValueNumber(displaySize) || 0}
                                                  color="bg-[#8DD2F0]"
                                                  blinkColor="bg-[#00B2FF]"
                                                />
                                              </span>
                                            </React.Fragment>
                                          );
                                        })}
                                      </>
                                    );
                                  })()}







                                  {/* {elementtemp && elementtemp.ex && elementtemp.ex.availableToLay && elementtemp.ex.availableToLay.length > 0 ? (
                                    elementtemp.ex.availableToLay.map((tempData, index) => {
                                      const matchedTrade = elementtemp.ex.tradedVolume?.find(
                                        (trade) => trade.price === tempData.price);
                                      const displaySize = matchedTrade ? matchedTrade.size : tempData.size
                                      return (
                                        <>
                                          {index === 0 ? (
                                            <>
                                              <span
                                                className="md:col-span-2 sm:col-span-2 rounded-md md:col-start-4 col-span-3 lg:hidden block"
                                                onClick={() => {
                                                  toggleRowVisibility(elementtemp.selectionId);
                                                  handleBackOpen({
                                                    data: tempData,
                                                    type: "No",
                                                    odds: tempData.price,
                                                    name: elementtemp.selectionName,
                                                    inplayCheck: element.inplay,
                                                    statusCheck: element.status,
                                                    nameOther: element.runners,
                                                    betFor: "matchOdds",
                                                    oddsType: element.marketType,
                                                    betType: "K",
                                                    selectionId: elementtemp.selectionId,
                                                    teamData: tempData.price,
                                                    betfairMarketId: element.marketId,
                                                    price: elementtemp.ex.availableToBack[0].price,
                                                    size: elementtemp.ex.availableToBack[0].size,
                                                    position: returnDataObject,
                                                    newPosition: returnDataObject
                                                  });
                                                }}
                                              >
                                                <BlinkingComponent
                                                  price={tempData.price}
                                                  size={FormateValueNumber(displaySize)}
                                                  color={"bg-[#FEAFB2]"}
                                                  blinkColor={"bg-[#FE7A7F]"}
                                                />
                                              </span>

                                              <span
                                                className="lg:col-span-1 col-span-3 rounded-md lg:block hidden"
                                                onClick={() => {
                                                  handleBackOpen({
                                                    data: tempData,
                                                    type: "No",
                                                    odds: tempData.price,
                                                    name: elementtemp.selectionName,
                                                    inplayCheck: element.inplay,
                                                    statusCheck: element.status,
                                                    nameOther: element.runners,
                                                    betFor: "matchOdds",
                                                    oddsType: element.marketType,
                                                    betType: "K",
                                                    selectionId: elementtemp.selectionId,
                                                    teamData: tempData.price,
                                                    betfairMarketId: element.marketId,
                                                    price: elementtemp.ex.availableToBack[0].price,
                                                    size: elementtemp.ex.availableToBack[0].size,
                                                    position: returnDataObject,
                                                    newPosition: returnDataObject
                                                  });
                                                }}
                                              >
                                                <BlinkingComponent
                                                  price={tempData.price}
                                                  size={FormateValueNumber(displaySize)}
                                                  color={"bg-[#FEAFB2]"}
                                                  blinkColor={"bg-[#FE7A7F]"}
                                                />
                                              </span>
                                            </>
                                          ) : (
                                            <>
                                              <span className="lg:col-span-1 col-span-2 rounded-md lg:block hidden">
                                                <BlinkingComponent
                                                  price={tempData.price}
                                                  size={FormateValueNumber(displaySize)}
                                                  color={"bg-[#FCE3E4]"}
                                                  blinkColor={"bg-[#CDEBEB]"}
                                                />
                                              </span>
                                            </>
                                          )}
                                        </>
                                      )
                                    })
                                  ) : null} */}

                                  {(() => {
                                    const availableToLay = elementtemp.ex?.availableToLay || [];
                                    const paddedLay = [...availableToLay];
                                    while (paddedLay.length < 3) {
                                      paddedLay.push({ price: 0, size: 0 });
                                    }

                                    return (
                                      <>
                                        {paddedLay.map((tempData, layIdx) => {
                                          const matchedTrade = elementtemp.ex.tradedVolume?.find(
                                            (trade) => trade.price === tempData.price
                                          );
                                          const displaySize = matchedTrade ? matchedTrade.size : tempData.size;
                                          const isFirst = layIdx === 0;
                                          const key = `lay-${elementtemp.selectionId}-${layIdx}`;

                                          if (isFirst) {
                                            return (
                                              <React.Fragment key={key}>
                                                {/* Mobile: First Lay */}
                                                <span
                                                  className="md:col-span-2 sm:col-span-2 rounded-md md:col-start-4 col-span-3 lg:hidden block"
                                                  onClick={() => {
                                                    toggleRowVisibility(elementtemp.selectionId);
                                                    handleBackOpen({
                                                      data: tempData,
                                                      type: "No",
                                                      odds: tempData.price,
                                                      name: elementtemp.selectionName,
                                                      inplayCheck: element.inplay,
                                                      statusCheck: element.status,
                                                      nameOther: element.runners,
                                                      betFor: "matchOdds",
                                                      oddsType: element.marketType,
                                                      betType: "K",
                                                      selectionId: elementtemp.selectionId,
                                                      teamData: tempData.price,
                                                      betfairMarketId: element.marketId,
                                                      price: elementtemp.ex.availableToBack?.[0]?.price,
                                                      size: elementtemp.ex.availableToBack?.[0]?.size,
                                                      position: returnDataObject,
                                                      newPosition: returnDataObject,
                                                    });
                                                  }}
                                                >
                                                  <BlinkingComponent
                                                    price={tempData.price || 0}
                                                    size={FormateValueNumber(displaySize) || 0}
                                                    color="bg-[#FEAFB2]"
                                                    blinkColor="bg-[#FE7A7F]"
                                                  />
                                                </span>

                                                {/* Desktop: First Lay */}
                                                <span
                                                  className="lg:col-span-1 col-span-3 rounded-md lg:block hidden"
                                                  onClick={() => {
                                                    handleBackOpen({
                                                      data: tempData,
                                                      type: "No",
                                                      odds: tempData.price,
                                                      name: elementtemp.selectionName,
                                                      inplayCheck: element.inplay,
                                                      statusCheck: element.status,
                                                      nameOther: element.runners,
                                                      betFor: "matchOdds",
                                                      oddsType: element.marketType,
                                                      betType: "K",
                                                      selectionId: elementtemp.selectionId,
                                                      teamData: tempData.price,
                                                      betfairMarketId: element.marketId,
                                                      price: elementtemp.ex.availableToBack?.[0]?.price,
                                                      size: elementtemp.ex.availableToBack?.[0]?.size,
                                                      position: returnDataObject,
                                                      newPosition: returnDataObject,
                                                    });
                                                  }}
                                                >
                                                  <BlinkingComponent
                                                    price={tempData.price || 0}
                                                    size={FormateValueNumber(displaySize) || 0}
                                                    color="bg-[#FEAFB2]"
                                                    blinkColor="bg-[#FE7A7F]"
                                                  />
                                                </span>
                                              </React.Fragment>
                                            );
                                          }

                                          // Other Lay items (index 1, 2) - Desktop only
                                          return (
                                            <span
                                              key={key}
                                              className="lg:col-span-1 col-span-2 rounded-md lg:block hidden"
                                            >
                                              <BlinkingComponent
                                                price={tempData.price || 0}
                                                size={FormateValueNumber(displaySize) || 0}
                                                color="bg-[#FCE3E4]"
                                                blinkColor="bg-[#CDEBEB]"
                                              />
                                            </span>
                                          );
                                        })}
                                      </>
                                    );
                                  })()}


                                </div>

                                {(elementtemp.status == "REMOVED" || element.status === "SUSPENDED" || element.status === "CLOSED") && (
                                  <div className="lg:w-[60%] xl:w-[45%] w-[35%] right-0 h-11 absolute bg-[#ECECED] border-2 rounded px-1 flex justify-center items-center">
                                    <div className="2xl:px-8 lg:px-8 px-2 text-nowrap text-sm font-medium opacity-100 text-red-500">
                                      {elementtemp.status == "REMOVED" ? elementtemp.status : element.status}
                                    </div>
                                  </div>
                                )}
                              </div>)
                          }
                          )
                        }
                      </div>
                    )
                  }
                  )
                )


                  : (
                    inplayMatch?.marketList?.map(
                      (element, index) =>
                        element.marketType == "Match Odds" && (
                          <div className="" key={index}>
                            <header className="mt-1">
                              <div className="items-center flex relative z-0">
                                <div className="d-flex align-items-center h-100 uppercase w-[65%] xl:w-[65%] lg:w-1/2">
                                  <span className="websiteThemeSoundColor px-0.5 py-1">
                                    <img src="/assest/images/time.png" alt="time" className="" />
                                  </span>
                                  <div className="bg-black sm:text-xs text-[9px] py-1 px-1 font-semibold text-white whitespace-nowrap">
                                    {inplayMatch && inplayMatch?.marketName ? inplayMatch?.marketName : ""}&nbsp;(
                                    <span className="">
                                      MaxBet:
                                      <span>
                                        <NumberFormatterZero value={isMatchCoin?.max} />
                                      </span>
                                    </span>
                                    )
                                  </div>

                                  <div className="px-0.5 text-sm font-bold">
                                    <span className="py-1 px-1 bg-[#333333] text-white relative group flex cursor-pointer">
                                      <i className="fa fa-info-circle"></i>
                                      <span
                                        onClick={openRulesModal}
                                        className="absolute top-0 left-[22px] px-1 py-[3px] hidden text-xs bg-[#333333] text-white group-hover:block transition-all"
                                      >
                                        Rules
                                      </span>
                                    </span>
                                  </div>
                                </div>

                                <div className="w-[35%] lg:w-1/2 xl:w-[35%] flex flex-wrap justify-center items-center">
                                  <div className="w-full uppercase text-white flex gap-x-1 items-center">
                                    <div className="w-1/2 py-0.5 sm:text-sm text-[13px] sm:font-bold font-semibold sm:!text-right text-center px-2 bg-black">
                                      Back
                                    </div>
                                    <div className="w-1/2 py-0.5 sm:text-sm text-[13px] sm:font-bold font-semibold sm:!text-left text-center px-2 bg-black">
                                      Lay
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </header>

                            {element &&
                              element?.selectionIdData?.length > 0 &&
                              element?.selectionIdData?.map((elementtemp, index) => (
                                <div
                                  className={`relative flex whitespace-normal max-w-full ${element?.status === 'CLOSED' && elementtemp?.status === 'WINNER' ? 'bg-[#b7f776]' : ''
                                    }`}
                                  key={index}
                                >
                                  <div className="lg:w-1/2 xl:w-[65%] w-[65%] flex px-2">
                                    <div className="w-full py-1 leading-3 flex items-center text-[#2B2f35]">
                                      <div className="text-[14px] flex justify-between w-full font-bold">
                                        <div className="w-full">
                                          <Tooltip
                                            placement="top"
                                            title={
                                              <>
                                                <div className="text-[12px] font-bold">Jockey: {elementtemp?.jockeyName}</div>
                                                <div className="text-[12px] font-bold">Age: {elementtemp?.age}</div>
                                                <div className="text-[12px] font-bold">Trainer: {elementtemp?.trainerName}</div>
                                              </>
                                            }
                                          >
                                            <span className="inline-flex items-center gap-1">{elementtemp.runnerName}</span>
                                          </Tooltip>
                                          <p className="text-xs flex items-center font-normal text-black/75 py-1">
                                            {elementtemp?.jockeyName && <> {elementtemp.jockeyName}</>}
                                          </p>
                                        </div>
                                        <div
                                          key={index}
                                          className={
                                            positionObj[elementtemp.selectionId] > 0
                                              ? 'text-[#00B181] !mt-2'
                                              : positionObj[elementtemp.selectionId] < 0
                                                ? 'text-red-500 !mt-2'
                                                : 'black'
                                          }
                                        >
                                          {positionObj[elementtemp.selectionId]
                                            ? (Math.floor(Number(positionObj[elementtemp.selectionId]) * 100) / 100).toFixed(0)
                                            : ''}
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="lg:w-1/2 xl:w-[35%] w-[35%] grid grid-cols-6 gap-x-1">
                                    {elementtemp && elementtemp.ex && elementtemp.ex.availableToBack && elementtemp.ex.availableToBack.length > 0 ? (
                                      <>
                                        {elementtemp.ex.availableToBack.slice(1).reverse().map((tempData, index) => {
                                          const matchedTrade = elementtemp.ex.tradedVolume?.find(
                                            (trade) => trade.price === tempData.price);
                                          const displaySize = matchedTrade ? matchedTrade.size : tempData.size
                                          return (
                                            <span className="lg:col-span-1 col-span-2 rounded-md lg:block hidden">
                                              <BlinkingComponent
                                                price={tempData.price}
                                                size={FormateValueNumber(displaySize)}
                                                color={"bg-[#E6F2FC]"}
                                                blinkColor={"bg-[#00B2FF]"}
                                                hoverColor={"bg-sky-600"}
                                              />
                                            </span>
                                          )
                                        })}
                                      </>
                                    ) : (
                                      <div className="h-14"></div>
                                    )}

                                    {elementtemp && elementtemp.ex && elementtemp.ex.availableToBack && elementtemp.ex.availableToBack.length > 0 ? (
                                      <>
                                        {elementtemp.ex.availableToBack.slice(0, 1).map((tempData, index) => {
                                          const matchedTrade = elementtemp.ex.tradedVolume?.find(
                                            (trade) => trade.price === tempData.price);
                                          const displaySize = matchedTrade ? matchedTrade.size : tempData.size
                                          return (
                                            <>
                                              <span className="md:col-span-2 sm:col-span-2 rounded-md col-span-3 md:col-start-2 lg:hidden block">
                                                <BlinkingComponent
                                                  price={tempData.price}
                                                  size={FormateValueNumber(displaySize)}
                                                  color={"bg-[#8DD2F0]"}
                                                  blinkColor={"bg-[#00B2FF]"}
                                                />
                                              </span>
                                              <span className="lg:col-span-1 col-span-3 rounded-md lg:block hidden">
                                                <BlinkingComponent
                                                  price={tempData.price}
                                                  size={FormateValueNumber(displaySize)}
                                                  color={"bg-[#8DD2F0]"}
                                                  blinkColor={"bg-[#00B2FF]"}
                                                />
                                              </span>
                                            </>
                                          )
                                        })}
                                      </>
                                    ) : null}

                                    {elementtemp && elementtemp.ex && elementtemp.ex.availableToLay && elementtemp.ex.availableToLay.length > 0 ? (
                                      elementtemp.ex.availableToLay.map((tempData, index) => {
                                        const matchedTrade = elementtemp.ex.tradedVolume?.find(
                                          (trade) => trade.price === tempData.price);
                                        const displaySize = matchedTrade ? matchedTrade.size : tempData.size
                                        return (
                                          <>
                                            {index === 0 ? (
                                              <>
                                                <span className="md:col-span-2 sm:col-span-2 rounded-md md:col-start-4 col-span-3 lg:hidden block">
                                                  <BlinkingComponent
                                                    price={tempData.price}
                                                    size={FormateValueNumber(displaySize)}
                                                    color={"bg-[#FEAFB2]"}
                                                    blinkColor={"bg-[#FE7A7F]"}
                                                  />
                                                </span>

                                                <span className="lg:col-span-1 col-span-3 rounded-md lg:block hidden">
                                                  <BlinkingComponent
                                                    price={tempData.price}
                                                    size={FormateValueNumber(displaySize)}
                                                    color={"bg-[#FEAFB2]"}
                                                    blinkColor={"bg-[#FE7A7F]"}
                                                  />
                                                </span>
                                              </>
                                            ) : (
                                              <>
                                                <span className="lg:col-span-1 col-span-2 rounded-md lg:block hidden">
                                                  <BlinkingComponent
                                                    price={tempData.price}
                                                    size={FormateValueNumber(displaySize)}
                                                    color={"bg-[#FCE3E4]"}
                                                    blinkColor={"bg-[#CDEBEB]"}
                                                  />
                                                </span>
                                              </>
                                            )}
                                          </>
                                        )
                                      })
                                    ) : null}
                                  </div>

                                  <div className="w-[35%] lg:w-1/2 xl:w-[35%] right-0 h-12 absolute bg-[#ECECED] border-2 rounded px-1 flex justify-center items-center">
                                    <div className="2xl:px-8 lg:px-8 px-2 text-nowrap text-sm font-medium opacity-100 text-red-500">SUSPENDED</div>
                                  </div>
                                </div>
                              ))
                            }
                          </div>
                        )
                    )
                  )}
              </>
            ) : null}
          </div>
        </div>

        <div className="md:w-2/6 md:py-2 py-0 h-100">
          <div className="flex gap-x-0.5 py-0.5 w-full">
            <div
              className="cursor-pointer flex-1 flex items-center justify-center py-2 rounded hover:bg-[#4EBD74] text-white text-sm font-bold websiteThemeSoundColor text-center"
              onClick={() => handelTvModal()}
            >
              Tv
            </div>
          </div>
          <div className=" h-[225px]">
            {inplayMatch.isTv ? (
              <>
                {tvShow && (
                  <div className=" w-full h-60">
                    <div className="details">
                      <div className={`w-full relative md:text-sm text-[10px]`}>
                        <iframe
                          src={inplayMatch && inplayMatch.tvUrl ? inplayMatch.tvUrl : ""}
                          title=" "
                          loading="lazy"
                          className="w-[100%] h-[220px]"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : null}

            {/* {inplayMatch.isScore ? (
              <>
                {scoreShow && (
                  <div className="bg-white w-full h-[170px]">
                    <div className="details">
                      <div className={`w-full relative md:text-sm text-[10px]`}>
                        <iframe
                          src={inplayMatch && inplayMatch.scoreIframe ? inplayMatch.scoreIframe : ""}
                          title=" "
                          loading="lazy"
                          className="w-[100%] h-[170px]"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : null} */}
          </div>
          <div className="md:block hidden">
            {!betShow && (
              <BetPlaceDesktop
                openBets={openBets}
                closeRow={closeRow}
                matchName={inplayMatch?.matchName}
                betSlipData={betSlipData}
                placeBet={combindedFlag ? placeBetCombind : placeBet}
                errorMessage={errorMessage}
                successMessage={successMessage}
                count={betSlipData.count}
                betLoading={betLoading}
                increaseCount={increaseCount}
                decreaseCount={decreaseCount}
                matchOddsSelected={matchOddsSelected}
              />
            )}
          </div>

          <div className="" style={{ zIndex: 99999 }}>
            {!betShow && (
              <BetPlaceMobile
                openBets={openBets}
                closeRow={closeRow}
                matchName={inplayMatch?.matchName}
                betSlipData={betSlipData}
                placeBet={combindedFlag ? placeBetCombind : placeBet}
                errorMessage={errorMessage}
                successMessage={successMessage}
                count={betSlipData.count}
                betLoading={betLoading}
                increaseCount={increaseCount}
                decreaseCount={decreaseCount}
                betShowM={betShowM}
                matchOddsSelected={matchOddsSelected}
              />
            )}
          </div>

          <div>
            <OpenBetListComponent
              placeBet={placeBet} getOpenBets={getOpenBets} openBetList={openBetList} openBets={openBets} matchOddsPos={matchOddsPos} eventId={eventId} finalSocket={finalSocket} fetchBetLists={fetchBetLists} />
          </div>

          <div className="w-full">
            <BetListComponent oddsBetData={oddsBetData} fancyBetData={fancyBetData} matchName={inplayMatch?.matchName} />
          </div>
          <div className="py-2">
            <div className="bg-black text-white font-bold text-base py-2 px-2">Related Events</div>
            <RaceInplay sportIds={inplayMatch?.sportId} market={inplayMatch?.marketId} />
          </div>
        </div>
      </div>
    </GlobalLayout>
  );
};

export default RacingDetails;
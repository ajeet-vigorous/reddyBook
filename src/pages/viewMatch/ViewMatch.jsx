
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { io } from "socket.io-client";
import moment from "moment";
import { apiCall } from "../../config/HTTP";
import 'react-toastify/dist/ReactToastify.css';
import { FaTimes, FaTv } from "react-icons/fa";
import { message } from "antd";
import NormalFancyComponent from "./marketMatch/NormalFancy";
import OverByOverFancyComponent from "./marketMatch/OverByOverFancy";
import Fancy1FancyComponent from "./marketMatch/Fancy1Fancy";
import KhadoFancyComponent from "./marketMatch/KhadoFancy";
import MeterFancyComponent from "./marketMatch/MeterFancy";
import OddEvenFancyComponent from "./marketMatch/OddEvenFancy";
import GroupedFancyComponent from "./marketMatch/FancyGroupMarket";
import TossDataComponent from "./marketMatch/TossMarket";
import BookmakerComponent from "./marketMatch/BookmakerMarket";
import MatchOddsComponent from "./marketMatch/MatchOdssMarket";
import OtherMarketsComponent from "./marketMatch/OtherLineMarket";
import TiedOddsComponent from "./marketMatch/TiedOdssMarket ";
import CashOutSystemTesting from "./CashoutTesting copy";
import { BetPlaceDesktop } from "../../component/betPlaceDesktop/BetPlaceDesktop";
import PlaceBetMobile from "../../component/betplaceMobile/PlaceBetMobile";
import { MdScore } from "react-icons/md";
import { fancyTabs, premiumTabs } from "./matchconstants";



const ViewMatches = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [inplayMatch, setInplayMatch] = useState({});
    const [scoreShow, setScoreShow] = useState(true);
    const [tvShow, setTvShow] = useState(false);
    const [betShow, setBetShow] = useState(true);
    const [betShowM, setBetShowM] = useState(true);
    const [isBetListShow, setIsBetListShow] = useState(false);
    const [betShowMobile, setBetShowMobile] = useState(false);
    const [matchScoreDetails, setMatchScoreDetails] = useState({});
    const [matchDetailsForSocketNew, setMatchDetailsForSocketNew] = useState({});
    const [finalSocket, setFinalSocketDetails] = useState({});
    const [otherFinalSocket, setOtherFinalSocketDetails] = useState({});
    const [isOpenRightSidebar, setIsOpenRightSidebar] = useState(false);
    const [hiddenRows, setHiddenRows] = useState([]);
    const [active, setActive] = useState(false);
    const [isFixed, setIsFixed] = useState(false);
    const [buttonValue, setbuttonValue] = useState(false);
    const [betSlipData, setBetSlipData] = useState({
        stake: '0',
        count: 0,
        teamname: '',
        teamData: null
    });


    const [fancyBetData, setFancyBetData] = useState([])
    const [oddsBetData, setOddsBetData] = useState([])


    const [returnDataObject, setReturnDataObject] = useState({})
    const [returnDataFancyObject, setReturnDataFancyObject] = useState({})
    const [fancypositionModal, setFancypositionModal] = useState(false);
    const [positionData, setPositionData] = useState({});
    const [betLoading, setBetLoading] = useState(false)
    const scrollRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);
    const [socketState, setSocketState] = useState(null);

    const [positionObj, setPositionObj] = useState({});
    const [positioBetData, setPositionBetData] = useState({});

    const [fancyPositionObj, setFancyPositionObj] = useState({});
    const [fancybetData, setFancybetData] = useState({});

    const [minMaxCoins, setminMaxCoins] = useState({ max: null, min: null });
    const [sessionCoin, setSessionCoin] = useState({ max: null, min: null });
    const [isTieCoin, setIsTieCoin] = useState({ max: null, min: null });
    const [isTossCoin, setIsTossCoin] = useState({ max: null, min: null });
    const [isMatchCoin, setIsMatchCoin] = useState({ max: null, min: null });
    const [activeTab, setActiveTab] = useState("all");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const [isRulesOpen, setIsRulesOpen] = useState(false);
    const openRulesModal = () => setIsRulesOpen(true);
    const closeRulesModal = () => setIsRulesOpen(false);
    const [isScorecardOpen, setIsScorecardOpen] = useState(true);
    const [fullscreen, setFullScreen] = useState(false);


    // const [betPlaceModalMobile, setBetPlaceModalMobile] = useState(false);


    // let { marketId, eventId } = useParams();
    const { marketId, eventId, sportId } = useParams();

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { pathname } = useLocation();
    const gameDetailOtherPart = pathname.includes('viewMatchDetail');
    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };
    document.title = `${inplayMatch?.matchName} | BPEXCH`;


    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;

            const threshold = 100;
            setIsFixed(scrollPosition > threshold);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [])


    let data = localStorage.getItem(`${marketId}_BookmakerData`)
    const setDataFromLocalstorage = async (marketId) => {
        if (data) {
            setMatchScoreDetails(JSON.parse(data).result);
        } else {
            setMatchScoreDetails("");
        }
    }

    const setMatchDataFromLocalstorage = async () => {
        let data = localStorage.getItem(`${eventId}_MatchOddsData`)


        if (!data) {
            return null
        }
        else {
            setFinalSocketDetails(JSON.parse(data));
        }
    }


    useEffect(() => {
        setDataFromLocalstorage()
        setMatchDataFromLocalstorage()
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' && isConnected && inplayMatch?.data?.socketUrl) {
                callSocket(inplayMatch?.data?.socketUrl);
            } else if (document.visibilityState === 'hidden') {
                cleanupWebSocket();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        setupAsyncActions(marketId);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            cleanupWebSocket();
        };
    }, [eventId, marketId, isConnected]);

    const [oddsbetdata, setOddsbetData] = useState();
    const [incomletedFancy, setIncompletedFancy] = useState();
    const [compltedFancy, setCompletedFancy] = useState();



    useEffect(() => {
        if (positioBetData) {
            const sortedOddsBetData = positioBetData?.oddsBetData
                ? positioBetData?.oddsBetData
                    .slice()
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                : [];

            const filteredFancyBetData = positioBetData?.fancyBetData
                ? positioBetData?.fancyBetData.sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                )
                : [];

            const completeFancy =
                filteredFancyBetData && filteredFancyBetData.length > 0
                    ? filteredFancyBetData.filter((element) => element.isDeclare === 1)
                    : [];
            let showCompletedFancy = [];

            completeFancy.map((data, key) => {
                let pos = 0;
                if (data.decisionRun >= data.run && data.type === "Y") {
                    pos = Math.round(data.amount * data.odds);
                } else if (data.decisionRun >= data.run && data.type === "N") {
                    pos = Math.round(-1 * data.amount * data.odds);
                } else if (data.decisionRun < data.run && data.type === "Y") {
                    pos = Math.round(-1 * data.amount);
                } else if (data.decisionRun < data.run && data.type === "N") {
                    pos = Math.round(data.amount);
                }
                data.pos = pos;
                completeFancy[key].pos = pos

                showCompletedFancy.push(data);
            });


            const finalPositionInfo = {};
            sortedOddsBetData && sortedOddsBetData.forEach(item => {
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




            let finalPositionInfoFancy = {};

            filteredFancyBetData.forEach(item => {
                const selectionId = item.selectionId;
                const loss = item.loss;

                if (finalPositionInfoFancy[selectionId]) {
                    finalPositionInfoFancy[selectionId] += loss;
                } else {

                    finalPositionInfoFancy[selectionId] = loss;
                }
            });




            setFancyPositionObj(finalPositionInfoFancy)
            setFancybetData(filteredFancyBetData);


            setPositionObj(finalPositionInfo)
            setOddsbetData(sortedOddsBetData);
            setCompletedFancy(showCompletedFancy);
            setIncompletedFancy(
                filteredFancyBetData && filteredFancyBetData.length > 0
                    ? filteredFancyBetData.filter((element) => element.isDeclare === 0)
                    : []
            );
        }
    }, [positioBetData]);

    



    useEffect(() => {
        if (fancypositionModal) {
            document.body.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
        }
        return () => {

            document.body.classList.remove("overflow-hidden");
        };

    }, [fancypositionModal])






    const setupAsyncActions = async (marketId) => {
        await getMatchDataByMarketID(marketId);
        fetchBetLists();
    };

    const cleanupWebSocket = () => {
        if (socketState) {
            socketState.disconnect();
            setSocketState(null);
        }
    };



    const getMatchDataByMarketID = async (marketId) => {
        try {
            const resData = {
                marketId: marketId,
            };
            const inplayMatchResponse = await apiCall("POST", "sports/sportByMarketId", resData);
            if (inplayMatchResponse && inplayMatchResponse.data) {
                setInplayMatch(inplayMatchResponse.data);
                const data = inplayMatchResponse?.data;

                if (inplayMatchResponse?.data?.socketPerm) {
                    callSocket(inplayMatchResponse?.data?.socketUrl, inplayMatchResponse.data?.sportId);
                } else {
                    callCache(inplayMatchResponse?.data?.cacheUrl);
                }

                // callSocket(inplayMatchResponse?.data?.socketUrl, inplayMatchResponse?.data?.socketPerm, inplayMatchResponse?.data?.cacheUrl);

            }
        } catch (error) {
            console.error("Error fetching inplay data:", error);
        }
        finally {
            setIsLoading(false);

        }
    };


    useEffect(() => {

        const maxCoinData = inplayMatch?.maxMinCoins
            ? JSON.parse(inplayMatch?.maxMinCoins)
            : {
                maximum_match_bet: null,
                minimum_match_bet: null,
                maximum_session_bet: null,
                minimum_session_bet: null,
            };


        setminMaxCoins({
            max: maxCoinData?.maximum_match_bet,
            min: maxCoinData?.minimum_match_bet,
        });
        setSessionCoin({
            max: maxCoinData?.maximum_session_bet,
            min: maxCoinData?.minimum_session_bet,
        });


        setIsTieCoin({
            max: maxCoinData?.maximum_tie_coins > 0 ? maxCoinData?.maximum_tie_coins : maxCoinData?.maximum_match_bet,
            min: maxCoinData?.minimum_match_bet,
        });

        setIsTossCoin({
            max: maxCoinData?.maximum_toss_coins > 0 ? maxCoinData?.maximum_toss_coins : maxCoinData?.maximum_match_bet,
            min: maxCoinData?.minimum_match_bet,
        });

        setIsMatchCoin({
            max: maxCoinData?.maximum_matchOdds_coins > 0 ? maxCoinData?.maximum_matchOdds_coins : maxCoinData?.maximum_match_bet,
            min: maxCoinData?.minimum_match_bet,
        });



    }, [inplayMatch]);


    const callSocket = async (socketUrl, matchId) => {


        if (socketState && socketState.connected) {
            return;
        }
        try {
            const socket = io.connect(socketUrl, {
                transports: ["websocket"],
                reconnection: true,
                reconnectionDelay: 1000,
                reconnectionDelayMax: 5000,
                reconnectionAttempts: 99,
            });

            socket.emit(`marketByEvent`, eventId);
            socket.on(eventId, (data) => {
                localStorage.setItem(`${eventId}_MatchOddsData`, data)
                setMatchDetailsForSocketNew(JSON.parse(data));
                setIsConnected(true);
                filterData(JSON.parse(data));
            });

            if (matchId === 4 || matchId === 999) {
                socket.emit("JoinRoom", marketId);
                socket.on(marketId, (data) => {
                    localStorage.setItem(`${marketId}_BookmakerData`, data);
                    setMatchScoreDetails(JSON.parse(data).result);
                });
            }



            socket.on('disconnect', () => {
                setIsConnected(false);
            });

            setSocketState(socket);

        }

        catch (error) {
            console.error("Error in socket connection:", error);
        }
    };


    const callCache = async (cacheUrl) => {
        try {
            const interval = setInterval(async () => {
                await getMarketCacheUrl(cacheUrl);
            }, 1000);
            return () => clearInterval(interval);
        } catch (error) {
            console.error("Error calling cache:", error);
        }
    };

    const getMarketCacheUrl = async (cacheUrl) => {
        try {
            // if (!cacheUrl) {
            //   console.error("Cache URL is undefined or null");
            //   return; // Exit early if cacheUrl is undefin
            // }

            const response = await axios.get(cacheUrl);
            localStorage.setItem(`${marketId}_BookmakerData`, JSON.stringify(response.data))
            setMatchScoreDetails(response.data.result);


        } catch (error) {
            console.error("Error fetching cache data:", error);
        }
    };


    const filterData = (matchDetailsForSocketNew) => {

        try {
            if (!matchDetailsForSocketNew || matchDetailsForSocketNew.length === 0) {
                return;
            }
            const criteria = ["Tied Match", "Match Odds", "To Win the Toss"];

            const filteredData = Array.isArray(matchDetailsForSocketNew)
                ? matchDetailsForSocketNew.filter((item) =>
                    criteria.includes(item.marketType)
                )
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

            const otherData = Array.isArray(matchDetailsForSocketNew)
                ? matchDetailsForSocketNew.filter((item) =>
                    !criteria.includes(item.marketType)
                )
                : [];

            if (otherData.length > 0) {
                const OtherFilteredDataObject = [];
                otherData.forEach((item) => {
                    OtherFilteredDataObject[item.marketType] = item;
                });
                setOtherFinalSocketDetails(OtherFilteredDataObject);
            }

        } catch (error) {
            console.error("Error filtering data:", error);
        }
    };

    const handleScore = () => {
        setIsScorecardOpen((prev) => !prev);
    }

    const handleOnClick = () => {
        navigate("/");
    };

    // const handelScoreModal = () => {
    //   setScoreShow(!scoreShow);
    // };

    const handelScoreModal = () => {
        setScoreShow(true);
        setTvShow(false);
        setBetShowMobile(false)
    };
    const handelTvModal = () => {
        setTvShow(!tvShow);
        setScoreShow(false);
        setBetShowMobile(false)

    };

    const handelAllClossModal = () => {
        setTvShow(false);
        setScoreShow(!scoreShow);

    };


    const openBets = () => {
        setBetShow(true);
        setBetShowM(false);
        setErrorMessage("");
        setSuccessMessage("");
    };

    // const openBetsM = () => {

    //   setErrorMessage("");
    //   setSuccessMessage("");
    // };

    const openBetsClose = () => {
        setBetShow(false);
    };




    const toggleAccordion = (index) => {
        setActive((prevState) => ({
            ...prevState,
            [index]: !prevState[index],
        }));
    };



    // bets Palce Modal write 

    const handleBackOpen = (data) => {
        console.log(data, "cashout system design");
        if (data?.odds === 0) return;
        // setBetPlaceModalMobile(true)
        if (data) {
            setBetShow(false);
            setBetShowM(false);
            setBetSlipData({
                ...data,
                stake: data.stake != null ? data.stake : '0',
                count: data.odds,
                teamname: data.name,
                teamData: data.teamData
            });
        }
    };
    const handleBackclose = () => {
        setBetSlipData({
            stake: '0',
            count: 0,
            teamname: '',
            teamData: null,
            name: ""
        });

    };

    const toggleRowVisibility = (id) => {
        if (hiddenRows.includes(id)) {
            setHiddenRows(hiddenRows.filter(rowId => rowId !== id));
        } else {
            setHiddenRows([...hiddenRows, id]);
        }
    };


    const placeBet = async () => {
        if (betSlipData.stake <= 0) {
            return;
        }



        try {
            const betObject = {
                "odds": betSlipData.count + "",
                "amount": betSlipData.stake,
                "selectionId": betSlipData.selectionId + "",
                "marketId": marketId + "",
                "eventId": eventId,
                "betFor": betSlipData.betFor + "",
                "run": betSlipData.run ? betSlipData.run + "" : "0",
                "oddsType": betSlipData.oddsType === "Match Odds" ? "matchOdds" : betSlipData.oddsType === "Tied Match" ? "tiedMatch" : betSlipData.oddsType + "",
                "type": betSlipData.betType + "",
            };
            if (betSlipData.oddsType === "fancy") {
                const allowedFancyTypes = ['khado', 'fancy1', 'oddeven', 'meter', 'Over By Over'];
                betObject["fancyType"] = allowedFancyTypes.includes(betSlipData.fancyType)
                    ? betSlipData.fancyType + ""
                    : "Normal";
            } else if (betSlipData.oddsType === "bookmaker") {
                console.log("::--");

            } else {
                betObject["betfairMarketId"] = betSlipData.betfairMarketId + "";
            }

            // if (betSlipData.oddsType === "bookmaker" || betSlipData.oddsType === "fancy") {
            //     // Do something if needed
            //     console.log(betSlipData?.data?.fancyType, "betSlipData");
            // } else {
            //     betObject["betfairMarketId"] = betSlipData.betfairMarketId + "";
            // }
            setBetLoading(true)

            if (betSlipData.oddsType === "fancy") {
                let saveBetOdds = await apiCall("POST", "sports/sessionBetPlaced", betObject);
                setBetLoading(true)
                setBetShow(false)
                setBetShowM(false)
                if (!saveBetOdds.error) {

                    setSuccessMessage(saveBetOdds?.message)
                    message.success(saveBetOdds?.message, 2);

                    await fetchBetLists()
                    await matchOddsPos()
                    setBetLoading(false)

                } else {
                    setBetLoading(false)

                    message.error("Sorry, your bet couldn't be placed. " + saveBetOdds?.message, 2);
                }
            } else {
                let saveBetOdds = await apiCall("POST", "sports/oddBetPlaced", betObject);

                setBetLoading(true)
                setBetShow(false);
                setBetShowM(false);
                setSuccessMessage(saveBetOdds?.message);


                if (!saveBetOdds.error) {
                    setBetLoading(false)
                    message.success(saveBetOdds?.message, 2);

                    await fetchBetLists()
                    await matchOddsPos()

                } else {

                    setBetLoading(false)
                    message.error("Sorry, your bet couldn't be placed.", 2);
                }
            }

        } catch (error) {
            setBetLoading(false)
            console.error('Error placing bet:', error.data.message);
            setErrorMessage(error.data.message);
            message.error('Error placing bet: ' + error.data.message, 2);
        } finally {
            setBetLoading(false)
            handleBackclose()
            closeRow()
            openBets()
        }
    };



    const fetchBetLists = async () => {
        try {

            const BetListData = {
                fancyBet: true,
                isDeclare: false,
                oddsBet: true,
                marketId: marketId,
            };

            const userBetHistory = await apiCall("POST", 'sports/betsList', BetListData);
            if (userBetHistory && userBetHistory.data) {
                const { fancyBetData, oddsBetData } = userBetHistory.data;
                const filteredFancyBetData = fancyBetData ? fancyBetData.filter(element => element.isDeclare === 0).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : [];
                const sortedOddsBetData = oddsBetData ? oddsBetData.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : [];
                setFancyBetData(filteredFancyBetData)
                setOddsBetData(sortedOddsBetData)
                setPositionBetData(userBetHistory.data)
                // return { fancyBetData: filteredFancyBetData, oddsBetData: sortedOddsBetData };
            }
        } catch (error) {
            console.error('Error fetching bet lists:', error);
            throw error;
        }
    };


    const matchOddsPos = async () => {
        let matchOddsPos = await apiCall("POST", 'reports/matchOddsRunningPos');
        if (matchOddsPos) {
            localStorage.setItem('matchOddsRunningPos', JSON.stringify(matchOddsPos.data));
        }
    }



    const handleFancyPositionModal = (data) => {

        try {
            setFancypositionModal(!fancypositionModal);
            setPositionData(data);
        } catch (error) {
            console.error('Error handling fancy position modal:', error);
        }
    };

    const handleClose = () => {
        setFancypositionModal(false)
    };


    const closeRow = (id) => {
        setHiddenRows(hiddenRows.filter(rowId => rowId !== id));
    }



    const increaseCount = () => {
        try {
            setBetSlipData(prevData => {
                const newCount = parseFloat(prevData.count) + 0.01;
                return {
                    ...prevData,
                    count: newCount.toFixed(2)
                };
            });
        } catch (error) {
            console.error('Error increasing count:', error);
        }
    };
    const openBetInMobile = () => {
        setBetShowMobile(!betShowMobile)
        setTvShow(false);
        setScoreShow(false);
    }
    const decreaseCount = () => {
        try {
            setBetSlipData(prevData => {
                const newCount = parseFloat(prevData.count) - 0.01;
                return {
                    ...prevData,
                    count: newCount.toFixed(2)
                };
            });
        } catch (error) {
            console.error('Error decreasing count:', error);
        }
    };


    let domainSetting = JSON.parse(localStorage.getItem("clientdomainSetting"));

    function getMatchStatus(matchDate) {
        if (!matchDate) return '';
        const currentTime = moment();
        const matchTime = moment(matchDate, 'DD-MM-YYYY HH:mm:ss');

        if (!matchTime.isValid()) {
            console.error("Invalid match date format.");
            return 'Invalid Date';
        }

        if (currentTime.isBefore(matchTime)) {
            return 'OPEN';
        } else {
            return 'INPLAY';
        }
    }



    const handleButtonValues = (e) => {
        setbuttonValue((prev) => !prev);

        document.body.classList.toggle("StakeModalOpen");
       
    };



    const [matchTab, setMatchTab] = useState(1);


    const handleMatchClick = (tabNumber) => {
        setMatchTab(tabNumber);
    };


    const formatNumber = (number) => {
        if (!number) return;
        const digit = Number(number);

        if (digit >= 1000000) {
            return (digit / 1000000).toFixed(digit % 1000000 === 0 ? 0 : 1) + 'M';
        } else if (digit >= 100000) {
            return (digit / 100000).toFixed(digit % 100000 === 0 ? 0 : 1) + 'L';
        } else if (digit >= 1000) {
            return (digit / 1000).toFixed(digit % 1000 === 0 ? 0 : 1) + 'K';
        } else {
            return digit.toString();
        }
    };

    const NormalFancy = matchScoreDetails?.session?.filter(item => item?.fancyType === 'Normal')
    const KhadoFancy = matchScoreDetails?.meterKhadoSession?.filter(item => item?.fancyType === 'khado')
    const Fancy1Fancy = matchScoreDetails?.session?.filter(item => item?.fancyType === 'fancy1')
    const OddEvenFancy = matchScoreDetails?.meterKhadoSession?.filter(item => item?.fancyType === 'oddeven')
    const bookmaker2Fancy = matchScoreDetails?.meterKhadoSession?.filter(item => item?.fancyType === 'Bookmaker 2')
    const MeterFancy = matchScoreDetails?.meterKhadoSession?.filter(item => item?.fancyType === 'meter')
    const OverByOverFancy = matchScoreDetails?.session?.filter(item => item?.fancyType === 'Over By Over')
    const cCFilterData = matchScoreDetails?.meterKhadoSession?.filter(item => item.gtype === "cricketcasino");

    const groupedData = cCFilterData?.reduce((acc, item) => {
        const key = item.fancyType;
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(item);
        return acc;
    }, {});



    const [mainTab, setMainTab] = useState("fancy");
    const [subTab, setSubTab] = useState(fancyTabs[0].key);

    // Function to render Fancy components dynamically
    const renderFancyComponent = () => {
        switch (subTab) {
            case "all":
                return (
                    <NormalFancyComponent
                        inplayMatch={inplayMatch}
                        activeTab={activeTab}
                        NormalFancy={NormalFancy}
                        fancyPositionObj={fancyPositionObj}
                        toggleRowVisibility={toggleRowVisibility}
                        handleBackOpen={handleBackOpen}
                        marketId={marketId}
                        returnDataFancyObject={returnDataFancyObject}
                        formatNumber={formatNumber}
                        betplaceSection={betplaceDataThroughProps}
                    />
                );
            case "sessions":
                return (
                    <OverByOverFancyComponent
                        inplayMatch={inplayMatch}
                        activeTab={activeTab}
                        OverByOverFancy={OverByOverFancy}
                        fancyPositionObj={fancyPositionObj}
                        toggleRowVisibility={toggleRowVisibility}
                        handleBackOpen={handleBackOpen}
                        marketId={marketId}
                        returnDataFancyObject={returnDataFancyObject}
                        formatNumber={formatNumber}
                        handleFancyPositionModal={handleFancyPositionModal}
                        betplaceSection={betplaceDataThroughProps}
                    />
                );
            case "wpm":
                return (
                    <Fancy1FancyComponent
                        inplayMatch={inplayMatch}
                        activeTab={activeTab}
                        Fancy1Fancy={Fancy1Fancy}
                        fancyPositionObj={fancyPositionObj}
                        toggleRowVisibility={toggleRowVisibility}
                        handleBackOpen={handleBackOpen}
                        marketId={marketId}
                        returnDataFancyObject={returnDataFancyObject}
                        formatNumber={formatNumber}
                        handleFancyPositionModal={handleFancyPositionModal}
                    />
                );
            case "khadda":
                return (
                    <KhadoFancyComponent
                        inplayMatch={inplayMatch}
                        activeTab={activeTab}
                        KhadoFancy={KhadoFancy}
                        fancyPositionObj={fancyPositionObj}
                        toggleRowVisibility={toggleRowVisibility}
                        handleBackOpen={handleBackOpen}
                        marketId={marketId}
                        returnDataFancyObject={returnDataFancyObject}
                        formatNumber={formatNumber}
                        handleFancyPositionModal={handleFancyPositionModal}
                        betplaceSection={betplaceDataThroughProps}
                    />
                );
            case "meter":
                return (
                    <MeterFancyComponent
                    inplayMatch={inplayMatch}
                        activeTab={activeTab}
                        MeterFancy={MeterFancy}
                        fancyPositionObj={fancyPositionObj}
                        toggleRowVisibility={toggleRowVisibility}
                        handleBackOpen={handleBackOpen}
                        marketId={marketId}
                        returnDataFancyObject={returnDataFancyObject}
                        formatNumber={formatNumber}
                        handleFancyPositionModal={handleFancyPositionModal}
                       betplaceSection={betplaceDataThroughProps}
                    />
                );
            case "oddeven":
                return (
                    <OddEvenFancyComponent
                        inplayMatch={inplayMatch}
                        activeTab={activeTab}
                        OddEvenFancy={OddEvenFancy}
                        fancyPositionObj={fancyPositionObj}
                        toggleRowVisibility={toggleRowVisibility}
                        handleBackOpen={handleBackOpen}
                        marketId={marketId}
                        returnDataFancyObject={returnDataFancyObject}
                        formatNumber={formatNumber}
                        handleFancyPositionModal={handleFancyPositionModal}
                        betplaceSection={betplaceDataThroughProps}
                    />
                );
            case "xtra":
                return (
                    <GroupedFancyComponent
                        inplayMatch={inplayMatch}
                        activeTab={activeTab}
                        groupedData={groupedData}
                        toggleRowVisibility={toggleRowVisibility}
                        handleBackOpen={handleBackOpen}
                        marketId={marketId}
                        returnDataFancyObject={returnDataFancyObject}
                        betplaceSection={betplaceDataThroughProps}
                    />
                );
            default:
                return null;
        }
    };

    const betplaceDataThroughProps = {

        betSlipData,
        openBets,
        closeRow,
        placeBet,
        errorMessage,
        successMessage,
        betLoading,
        increaseCount,
        decreaseCount,
        handleBackclose,
        setBetSlipData,
        handleButtonValues
    }


    return (isLoading ? <span className="animate-spin h-5 w-5"></span> :
        <div>
            {isRulesOpen && <div>Rule</div>}
            {inplayMatch && inplayMatch?.notification && (
                <span className="w-full flex-1 text-xs websiteThemeSoundColor  text-black flex items-center">
                    <marquee className="">{inplayMatch?.notification}</marquee>
                </span>
            )}


            {/* {buttonValue && (
                <div
                    onClick={(e) => {
                        handleButtonValues();
                        e.stopPropagation();
                    }}
                    className="fixed top-0  bg-black bg-opacity-55 left-0 w-full h-full flex items-start justify-center z-50"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="lg:w-[28%] md:w-[50%] w-full lg:p-2   "
                    >
                        <ButtonValues />
                    </div>
                </div>
            )} */}

            {/* <div className="">
                {inplayMatch &&
                    inplayMatch?.matchName ? (
                    <div className="bg-[var(--secondary)] item-center px-2 py-1 flex justify-between">
                        <span className="text-white text-[12px] font-semibold">{inplayMatch?.matchName}fff</span>
                        <span className="text-white text-[12px] font-semibold"> {inplayMatch?.matchDate}ffffff</span>
                    </div>
                ) : null}
            </div> */}

            {/* <div className="flex justify-between items-center xl:hidden whitespace-nowrap w-full border-t-[1px] border-black/30 bg-[var(--primary)] text-white">

                <button
                    onClick={() => handleMatchClick(1)}
                    className={` ${matchTab === 1 ? "border-t-[1px]" : ""} border-white px-3 py-2 text-center uppercase shadow-xl w-1/2 text-[12px] font-bold  cursor-pointer`}>
                    <span>odds</span>
                </button>
                <button
                    onClick={() => handleMatchClick(2)}
                    className={`${matchTab === 2 ? "border-t-[1px]" : ""} border-white  border-l-[1px] pr-3 py-2 text-center uppercase shadow-xl w-1/2 text-[12px] font-bold  cursor-pointer`}>
                    <span className=''>Matched Bets</span>
                </button>
                <button
                    // onClick={() => handleMatchClick(3)}
                    onClick={() => {
                        handleMatchClick(3);
                        handelTvModal();
                    }}
                    className={`${matchTab === 3 ? "border-t-[1px]" : ""} border-white  border-l-[1px] pr-3 py-2 text-center uppercase flex justify-center items-center shadow-xl w-1/2 text-[12px] font-bold  cursor-pointer`}>
                    <span className=''><FaTv size={18} /></span>
                </button>

            </div> */}

            <div className="flex flex-col xl:flex-row text-black  h-full  w-100 gap-x-1">
                {/* {(matchTab === 1 || matchTab === 3) && ( */}
                <div className="w-full xl:w-2/3 overflow-y-auto p-0">
                    <div className="">
                        {/* {matchTab === 3 && ( */}
                        {/* <div className="xl:hidden block">
                            {inplayMatch?.isTv ? <>
                                {tvShow && <div className="bg-white w-full h-48">
                                    <div className="details">
                                        <div className={`w-full relative md:text-sm text-[10px]`}>
                                            <iframe src={inplayMatch && inplayMatch.tvUrl ? inplayMatch.tvUrl : ""} title=" " loading='lazy' className="w-[100%] h-[200px]" />
                                        </div>
                                    </div>
                                </div>}
                            </>
                                : null}
                        </div> */}
                        {/* )} */}

                        <div className="xl:block hidden">
                            {inplayMatch &&
                                inplayMatch?.matchName ? (
                                <div className="bg-[var(--darkcolor)] item-center px-2 py-1.5 flex justify-between">
                                    <span className="text-white text-[14px] font-semibold">{inplayMatch?.matchName}</span>
                                    <span className="text-white text-[14px] font-semibold">({inplayMatch?.matchDate})</span>
                                    <span
                                        onClick={() => handleScore()}
                                        className="text-white  font-semibold">
                                        <img src={"/scorecard-icon.webp"} className="w-[25px] h-[25px] invertimage" />
                                    </span>
                                </div>
                            ) : null}
                        </div>

                        <div className="xl:hidden block">
                            {inplayMatch &&
                                inplayMatch?.matchName ? (
                                <div className="bg-[var(--darkcolor)] item-center px-2 py-1 flex justify-between items-center">
                                    <div className="flex flex-col">
                                        <span className="text-white text-[14px] font-semibold">{inplayMatch?.matchName}</span>
                                        <span className="text-white text-[10px] font-semibold">({inplayMatch?.matchDate})</span>
                                    </div>
                                    <div className="flex justify-end items-center gap-1.5">

                                        <span
                                            onClick={() => handleScore()}
                                            className="text-white  font-semibold">
                                            <img src={"/scorecard-icon.webp"} className="w-[25px] h-[25px] invertimage" />
                                        </span>
                                        <span onClick={() => {
                                            handelTvModal();
                                        }} className='text-white'><FaTv size={18} /></span>
                                        <span className="bg-[var(--primary)] text-white px-1 py-[2px] rounded-sm uppercase text-[13px]" onClick={() => handleMatchClick(2)}>Bets</span>
                                    </div>
                                </div>
                            ) : null}
                            <div className="xl:hidden block">
                                {inplayMatch?.isTv ? <>
                                    {tvShow && <div className="bg-white w-full h-48">
                                        <div className="details">
                                            <div className={`w-full relative md:text-sm text-[10px]`}>
                                                <iframe src={inplayMatch && inplayMatch.tvUrl ? inplayMatch.tvUrl : ""} title=" " loading='lazy' className="w-[100%] h-[200px]" />
                                            </div>
                                        </div>
                                    </div>}
                                </>
                                    : null}
                            </div>
                        </div>
                        <div className=""
                        // style={{ background: 'linear-gradient(#060a2a, #521d31 160%)' }}
                        >
                            {isScorecardOpen && inplayMatch.isScore && (
                                <div className="border-2 border-secondary rounded-lg mt-2">
                                    <div className="flex justify-between items-center py-0 px-2 bg-[var(--primary)] ">
                                        <div
                                            onClick={() => setFullScreen((state) => !state)}
                                            className="text-white bg-button rounded-sm px-2 py-1 text-xs font-semibold"
                                        >
                                            {fullscreen ? "HS" : "FS"}
                                        </div>
                                        <div
                                            className="px-2 py-1 text-white text-xs"
                                            onClick={() => handleScore()}
                                        >
                                            <FaTimes size={13} />
                                        </div>
                                    </div>
                                    <div
                                        className={`bg-white w-full ${fullscreen ? "h-[220px]" : "h-[110px]"
                                            }`}
                                    >
                                        <div className="details">
                                            <div
                                                className={`w-full relative md:text-sm text-[10px]`}
                                            >
                                                <iframe
                                                    src={inplayMatch && inplayMatch.scoreIframe ? inplayMatch.scoreIframe : ""}
                                                    title=" "
                                                    loading="lazy"
                                                    className={`w-[100%] ${fullscreen ? "h-[220px]" : "h-[110px]"
                                                        }`}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>


                        <MatchOddsComponent
                            inplayMatch={inplayMatch}
                            activeTab={activeTab}
                            finalSocket={finalSocket}
                            isMatchCoin={isMatchCoin}
                            positionObj={positionObj}
                            returnDataObject={returnDataObject}
                            toggleRowVisibility={toggleRowVisibility}
                            handleBackOpen={handleBackOpen}
                            formatNumber={formatNumber}
                            betplaceSection={betplaceDataThroughProps}
                        />
                        <OtherMarketsComponent
                            activeTab={activeTab}
                            otherFinalSocket={otherFinalSocket}
                            isTieCoin={isTieCoin}
                            positionObj={positionObj}
                            returnDataObject={returnDataObject}
                            handleBackOpen={handleBackOpen}
                            formatNumber={formatNumber}
                            betplaceSection={betplaceDataThroughProps}
                        />


                        <BookmakerComponent
                            inplayMatch={inplayMatch}
                            activeTab={activeTab}
                            bookmaker2Fancy={bookmaker2Fancy}
                            matchScoreDetails={matchScoreDetails}
                            isMatchCoin={isMatchCoin}
                            positionObj={positionObj}
                            marketId={marketId}
                            returnDataObject={returnDataObject}
                            returnDataFancyObject={returnDataFancyObject}
                            toggleRowVisibility={toggleRowVisibility}
                            handleBackOpen={handleBackOpen}
                            formatNumber={formatNumber}
                            betplaceSection={betplaceDataThroughProps}
                        />

                        <TossDataComponent
                            inplayMatch={inplayMatch}
                            activeTab={activeTab}
                            matchScoreDetails={matchScoreDetails}
                            isTossCoin={isTossCoin}
                            positionObj={positionObj}
                            toggleRowVisibility={toggleRowVisibility}
                            handleBackOpen={handleBackOpen}
                            marketId={marketId}
                            returnDataObject={returnDataObject}
                            formatNumber={formatNumber}
                            betplaceSection={betplaceDataThroughProps}
                        />

                        <TiedOddsComponent
                            inplayMatch={inplayMatch}
                            activeTab={activeTab}
                            finalSocket={finalSocket}
                            isMatchCoin={isMatchCoin}
                            positionObj={positionObj}
                            returnDataObject={returnDataObject}
                            toggleRowVisibility={toggleRowVisibility}
                            handleBackOpen={handleBackOpen}
                            formatNumber={formatNumber}
                            betplaceSection={betplaceDataThroughProps}
                        />

                        <div className="fancy-premium-container mt-1">

                            <div className="flex gap-2 w-full">
                                <button
                                    className={`px-3 py-1.5  rounded-[5px] text-[12px] font-[700] hover:shadow-[inset_0px_-10px_20px_0px_#9f0101] hover:bg-[linear-gradient(180deg,#fa7e29_0%,#F6682F_80%,#F6682F_100%)] w-full border border-[var(--primary)] hover:text-white  ${mainTab === "fancy" ? "bg-[linear-gradient(180deg,#fa7e29_0%,#F6682F_80%,#F6682F_100%)] shadow-[inset_0px_-10px_20px_0px_#9f0101] text-white" : "bg-white text-red-500"
                                        }`}
                                    onClick={() => {
                                        setMainTab("fancy");
                                        setSubTab(fancyTabs[0].key);
                                    }}
                                >
                                    FANCY
                                </button>
                                <button
                                    className={`px-3 py-1.5  rounded-[5px] text-[12px] font-[700] hover:bg-[linear-gradient(180deg,#fa7e29_0%,#F6682F_80%,#F6682F_100%)] hover:shadow-[inset_0px_-10px_20px_0px_#9f0101] w-full border border-[var(--primary)] hover:text-white ${mainTab === "premium" ? "bg-[linear-gradient(180deg,#fa7e29_0%,#F6682F_80%,#F6682F_100%)] shadow-[inset_0px_-10px_20px_0px_#9f0101] text-white" : "bg-white text-red-500"
                                        }`}
                                    onClick={() => {
                                        setMainTab("premium");
                                        setSubTab(premiumTabs[0].key);
                                    }}
                                >
                                    PREMIUM <span className="text-xs">NEW</span>
                                </button>
                            </div>

                            {/* Sub Tabs */}
                            <div className="flex flex-nowrap gap-2 my-2 overflow-x-auto">
                                {mainTab === "fancy" &&
                                    fancyTabs.map((tab) => (
                                        <button
                                            key={tab.key}
                                            className={`mb-1 px-3 py-1.5 rounded-[5px] text-[12px] font-[700] hover:bg-[linear-gradient(180deg,#fa7e29_0%,#F6682F_80%,#F6682F_100%)] hover:shadow-[inset_0px_-10px_20px_0px_#9f0101]  min-w-[250px] max-w-[250px] border border-[var(--primary)] hover:text-white ${subTab === tab.key ? "bg-[linear-gradient(180deg,#fa7e29_0%,#F6682F_80%,#F6682F_100%)] shadow-[inset_0px_-10px_20px_0px_#9f0101] text-white" : "bg-white text-red-500"
                                                }`}
                                            onClick={() => setSubTab(tab.key)}
                                        >
                                            {tab.label}
                                        </button>
                                    ))}

                                {mainTab === "premium" &&
                                    premiumTabs.map((tab) => (
                                        <button
                                            key={tab.key}
                                            className={`px-5 py-1 border ${subTab === tab.key ? "bg-black text-white" : "bg-[var(--darkcolor)] text-white"
                                                }`}
                                            onClick={() => setSubTab(tab.key)}
                                        >
                                            {tab.label}
                                        </button>
                                    ))}
                            </div>

                            {/* Content */}
                            <div className="mb-2">
                                {mainTab === "fancy" && renderFancyComponent()}
                                {mainTab === "premium" && (
                                    <div className="p-4 bg-gray-100">No Premium market found.</div>
                                )}
                            </div>
                        </div>

                        {/* <CashOutSystemTesting /> */}
                    </div>
                </div>
                {/* // )} */}
                <div className="w-full xl:w-1/3 xl:block hidden ">
                    <div>
                        <div className="bg-[var(--darkcolor)] rounded-[5px] cursor-pointer flex justify-between items-center py-1.5 px-4 text-white text-sm font-semibold" onClick={() => handelTvModal()}>
                            <span>Live Match</span>
                            <button className="flex justify-end space-x-2 font-semibold" > </button>
                        </div>
                        {inplayMatch.isTv ? <>
                            {tvShow && <div className="bg-white w-full h-48">
                                <div className="details">
                                    <div className={`w-full relative md:text-sm text-[10px]`}>
                                        <iframe src={inplayMatch && inplayMatch.tvUrl ? inplayMatch.tvUrl : ""} title=" " loading='lazy' className="w-[100%] h-[200px]" />
                                    </div>
                                </div>
                            </div>}
                        </>
                            : null}
                    </div>
                    <div className="mt-1">
                        {!betShow && (
                            <>
                                <div className="bg-[var(--darkcolor)] rounded-t-md  flex justify-start items-center py-1.5 px-4 text-white text-sm font-semibold">
                                    <span>Place Bet </span>
                                </div>
                                <BetPlaceDesktop
                                    openBets={openBets}
                                    closeRow={closeRow}
                                    matchName={inplayMatch?.matchName}
                                    betSlipData={betSlipData}
                                    placeBet={placeBet}
                                    errorMessage={errorMessage}
                                    successMessage={successMessage}
                                    count={betSlipData.count}
                                    betLoading={betLoading}
                                    increaseCount={increaseCount}
                                    decreaseCount={decreaseCount}
                                    handleButtonValues={handleButtonValues}
                                />
                            </>
                        )}
                    </div>

                    <div className="mt-1">
                        <div className="bg-[var(--darkcolor)] rounded-t-md py-1.5 px-4 font-bold text-white text-sm">
                            <span>My Bets</span>
                        </div>
                        <div className="overflow-hidden w-full  border border-[#C6D2D8] !p-0 !m-0">
                            <div className="max-w-full overflow-auto ">
                                <div className="inline-block min-w-full ">
                                    <div className="overflow-hidden w-full ">
                                        <table className="min-w-full capitalize">
                                            <thead>
                                                <tr className="w-full text-black/80 text-[14px] font-[400] bg-[#ffffff] text-left">
                                                    <th className="px-[6px] py-1 whitespace-nowrap">
                                                        Selname
                                                    </th>
                                                    <th className="px-[6px] py-1 whitespace-nowrap">
                                                        Odds
                                                    </th>
                                                    <th className="px-[6px] py-1 whitespace-nowrap">
                                                        Stake
                                                    </th>
                                                    <th className="px-[6px] py-1 whitespace-nowrap">
                                                        Date/Time
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {oddsBetData && oddsBetData?.length > 0 ? (
                                                    oddsBetData?.map((element, index) => (
                                                        <tr
                                                            key={index}
                                                            className={`w-full text-[#333333]  text-[0.8125rem] border-b border-t divide-x divide-white text-left ${element?.type === "K"
                                                                ? "bg-[var(--matchKhai)]"
                                                                : "bg-[var(--matchLagai)]"
                                                                }`}
                                                        >
                                                            <td className="px-[6px] py-1 whitespace-nowrap">
                                                                <div>
                                                                    {element?.teamName} <br />
                                                                    <span className="font-bold">{element?.marketName}</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-[6px] py-1 whitespace-nowrap">
                                                                {element && element?.oddsType === "matchOdds"
                                                                    ? parseFloat(Number(element?.odds) + 1)
                                                                        .toFixed(2)
                                                                        .replace(/\.?0+$/, "")
                                                                    : element &&
                                                                        (element?.oddsType === "bookmaker" || element?.oddsType === "toss")
                                                                        ? parseFloat(element?.odds * 100)
                                                                            .toFixed(2)
                                                                            .replace(/\.?0+$/, "")
                                                                        : parseFloat(element?.odds)
                                                                            .toFixed(2)
                                                                            .replace(/\.?0+$/, "")}
                                                            </td>
                                                            <td className="px-[6px] py-1 whitespace-nowrap">
                                                                {element?.amount}
                                                            </td>
                                                            <td className="px-[6px] py-1 whitespace-nowrap">
                                                                {element?.date}
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : fancyBetData && fancyBetData?.length > 0 ? (
                                                    fancyBetData?.map((element, index) => (
                                                        <tr
                                                            key={index}
                                                            className={`w-full text-[#333333] text-[0.8125rem] border-b border-t text-left divide-x divide-white ${element?.type === "N"
                                                                ? "bg-[var(--matchKhai)]"
                                                                : "bg-[var(--matchLagai)]"
                                                                }`}
                                                        >
                                                            <td className="px-[6px] py-1 whitespace-nowrap">
                                                                <span className="font-medium text-xs">{element?.sessionName}</span>
                                                            </td>
                                                            <td className="px-[6px] py-1 whitespace-nowrap">
                                                                {element?.odds}
                                                            </td>
                                                            <td className="px-[6px] py-1 whitespace-nowrap">
                                                                {element?.amount}
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan={3} className="text-center py-2 text-sm">
                                                            No records found
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                            {/* <tbody>
                                                {oddsBetData && oddsBetData.length > 0 ? (
                                                    oddsBetData.map((element, index) => (
                                                        <tr
                                                            key={index}
                                                            className={`w-full text-black text-[0.8125rem] border-b border-t divide-x divide-white text-left ${element?.type === "K"
                                                                ? "bg-[var(--matchKhai)]"
                                                                : "bg-[var(--matchLagai)]"
                                                                }`}
                                                        >
                                                            <td className="px-[6px] py-1 whitespace-nowrap">
                                                                <div>
                                                                    {element.teamName} <br />
                                                                    <span className="font-bold">
                                                                        {element.marketName}
                                                                    </span>
                                                                </div>
                                                            </td>
                                                            <td className="px-[6px] py-1 whitespace-nowrap">
                                                                {element &&
                                                                    element.oddsType === "matchOdds"
                                                                    ? parseFloat(Number(element.odds) + 1)
                                                                        .toFixed(2)
                                                                        .replace(/\.?0+$/, "")
                                                                    : element &&
                                                                        (element.oddsType === "bookmaker" ||
                                                                            element.oddsType === "toss")
                                                                        ? parseFloat(element.odds * 100)
                                                                            .toFixed(2)
                                                                            .replace(/\.?0+$/, "")
                                                                        : parseFloat(element.odds)
                                                                            .toFixed(2)
                                                                            .replace(/\.?0+$/, "")}
                                                            </td>
                                                            <td className="px-[6px] py-1 whitespace-nowrap">
                                                                {element.amount}
                                                            </td>

                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr className="flex justify-center w-full text-sm">
                                                        <td>No records Found</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                            {fancyBetData && fancyBetData.length > 0 ? (
                                                <tbody>
                                                    {fancyBetData.map((element, index) => (
                                                        <tr
                                                            key={index}
                                                            className={`w-full text-black text-[0.8125rem] border-b border-t text-left divide-x-2 divide-white ${element?.type === "N"
                                                                ? "match_bg_pink_index-0"
                                                                : "match_bg_blue_index-0"
                                                                }`}
                                                        >
                                                            <td className="px-[6px] py-1 whitespace-nowrap">
                                                                <div>
                                                                    <span className="font-midume text-xs">
                                                                        {element.sessionName}
                                                                    </span>
                                                                </div>
                                                            </td>
                                                            <td className="px-[6px] py-1 whitespace-nowrap">
                                                                {element.odds}
                                                            </td>
                                                            <td className="px-[6px] py-1 whitespace-nowrap">
                                                                {element.amount}
                                                            </td>

                                                        </tr>
                                                    ))}
                                                </tbody>
                                            ) : null} */}
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            {/* {matchTab === 2 && (
                <div className="w-full fixed inset-0 z-10">
                    <div className="bg-[var(--darkcolor)] rounded-t-md mt-1 py-1.5 px-4 font-bold text-white text-sm">
                        <span> My Bets</span>
                    </div>
                    <div className="overflow-hidden w-full  border border-[#C6D2D8]">
                        <div className="max-w-full overflow-auto ">
                            <div className="inline-block min-w-full ">
                                <div className="overflow-hidden w-full ">
                                    <table className="min-w-full capitalize">
                                        <thead>
                                            <tr className="w-full text-black/80 text-[14px] font-semibold bg-[#CCCCCC] text-left">
                                                <th className="px-[6px] py-1 whitespace-nowrap">
                                                    Matched Bets
                                                </th>
                                                <th className="px-[6px] py-1 whitespace-nowrap">
                                                    Odds
                                                </th>
                                                <th className="px-[6px] py-1 whitespace-nowrap">
                                                    Stake
                                                </th>
                                                <th className="px-[6px] py-1 whitespace-nowrap">
                                                    Date/Time
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {oddsBetData && oddsBetData?.length > 0 ? (
                                                oddsBetData?.map((element, index) => (
                                                    <tr
                                                        key={index}
                                                        className={`w-full text-[#333333]  text-[0.8125rem] border-b border-t divide-x divide-white text-left ${element?.type === "K"
                                                            ? "bg-[var(--matchKhai)]"
                                                            : "bg-[var(--matchLagai)]"
                                                            }`}
                                                    >
                                                        <td className="px-[6px] py-1 whitespace-nowrap">
                                                            <div>
                                                                {element?.teamName} <br />
                                                                <span className="font-bold">{element?.marketName}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-[6px] py-1 whitespace-nowrap">
                                                            {element && element?.oddsType === "matchOdds"
                                                                ? parseFloat(Number(element?.odds) + 1)
                                                                    .toFixed(2)
                                                                    .replace(/\.?0+$/, "")
                                                                : element &&
                                                                    (element?.oddsType === "bookmaker" || element?.oddsType === "toss")
                                                                    ? parseFloat(element?.odds * 100)
                                                                        .toFixed(2)
                                                                        .replace(/\.?0+$/, "")
                                                                    : parseFloat(element?.odds)
                                                                        .toFixed(2)
                                                                        .replace(/\.?0+$/, "")}
                                                        </td>
                                                        <td className="px-[6px] py-1 whitespace-nowrap">
                                                            {element?.amount}
                                                        </td>
                                                        <td className="px-[6px] py-1 whitespace-nowrap">
                                                            {element?.date}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : fancyBetData && fancyBetData?.length > 0 ? (
                                                fancyBetData?.map((element, index) => (
                                                    <tr
                                                        key={index}
                                                        className={`w-full text-[#333333] text-[0.8125rem] border-b border-t text-left divide-x-2 divide-white ${element?.type === "N"
                                                            ? "bg-[var(--matchKhai)]"
                                                            : "bg-[var(--matchLagai)]"
                                                            }`}
                                                    >
                                                        <td className="px-[6px] py-1 whitespace-nowrap">
                                                            <span className="font-medium text-xs">{element?.sessionName}</span>
                                                        </td>
                                                        <td className="px-[6px] py-1 whitespace-nowrap">
                                                            {element?.odds}
                                                        </td>
                                                        <td className="px-[6px] py-1 whitespace-nowrap">
                                                            {element?.amount}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={3} className="text-center py-2 text-sm">
                                                        No records found
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )} */}
        </div >
    );
};

export default ViewMatches;
import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import { MdHowToVote, MdOutlineSportsEsports, MdSportsCricket } from "react-icons/md";
import { IoFootballSharp, IoTennisball } from "react-icons/io5";
import { FaFootballBall, FaHorseHead } from 'react-icons/fa';
import { IoIosColorWand } from 'react-icons/io';
import { FaTableTennisPaddleBall } from "react-icons/fa6";
import LiveMatches from "../../component/dashboard/LiveMatches";
import TopHeader from "../../component/dashboard/TopHeader";
import InplayMatches from "../../component/dashboard/InplayMatches";
import Trendring from "../../component/dashboard/groupCasino/Trending";
import PopularGame from "../../component/dashboard/groupCasino/PopularGame";
import LiveCasino from "../../component/dashboard/groupCasino/LiveGames";
import useGroupCasinoList from "../../component/IntGroupCasinoList/IntGroupCasinoList";


export const sportlistArray = [
  {
    sportId: 4,
    sportName: "Cricket",
    icon: <MdSportsCricket />
  },
  {
    sportId: 1,
    sportName: "Football",
    icon: <IoFootballSharp />
  },
  {
    sportId: 2,
    sportName: "Tennis",
    icon: <IoTennisball />
  },
  {
    sportId: 999,
    sportName: "Election",
    icon: <MdHowToVote />
  },

]


export const AllSportsArray = [
  {
    sportName: "Cricket",
    sportId: 4,
    icons: <FaFootballBall />
  },
  {
    sportName: "Football",
    sportId: 1,
    icons: <FaFootballBall />
  },
  {
    sportName: "Tennis",
    sportId: 2,
    icons: <FaTableTennisPaddleBall />
  },
  {
    sportName: "Esoccer",
    sportId: 46,
    icons: <MdOutlineSportsEsports />
  },
  {
    sportName: "Horse Racing",
    sportId: 7,
    icons: <FaHorseHead />
  },
  {
    sportName: "Greyhound Racing",
    sportId: 4339,
    icons: <FaHorseHead />
  },
  {
    sportName: "Table Tennis",
    sportId: 76544645,
    icons: <FaTableTennisPaddleBall />
  },
  {
    sportName: "Basketball",
    sportId: 6746546548,
    icons: <FaFootballBall />
  },
  {
    sportName: "Boxing",
    sportId: 974556455,
    icons: <FaFootballBall />
  },
  {
    sportName: "Mixed Martial Arts",
    sportId: 145450,
    icons: <FaFootballBall />
  },
  {
    sportName: "American Football",
    sportId: 15675651,
    icons: <FaFootballBall />
  },
  {
    sportName: "Volleyball",
    sportId: 1565672,
    icons: <IoIosColorWand />
  },
  {
    sportName: "Badminton",
    sportId: 156568453,
    icons: <FaFootballBall />
  },
  {
    sportName: "Snooker",
    sportId: 1578554,
    icons: <FaFootballBall />
  },
  {
    sportName: "Ice Hockey",
    sportId: 154585685,
    icons: <FaFootballBall />
  },
  {
    sportName: "E Games",
    sportId: 15656566,
    icons: <FaFootballBall />
  },
  {
    sportName: "Politics",
    sportId: 5656565617,
    icons: <FaFootballBall />
  },
  {
    sportName: "Futsal",
    sportId: 1565656688,
    icons: <FaFootballBall />
  },
  {
    sportName: "Handball",
    sportId: 156546559,
    icons: <FaFootballBall />
  },
  {
    sportName: "Motor Sports",
    sportId: 2055656767,
    icons: <FaFootballBall />
  },
  {
    sportName: "Kabaddi",
    sportId: 75677686721,
    icons: <FaFootballBall />
  }
];


const Dashboard = ({ }) => {


  const { sportMatchList } = useSelector((state) => state.sport);
  const [activeAllSporttab, setactiveAllSporttab] = useState(localStorage.getItem('dashboardActiveTabKey'))

  const matchlistLocal = localStorage.getItem("matchList")
    ? JSON.parse(localStorage.getItem("matchList"))
    : [];
  const groupCasinoList = useGroupCasinoList();

  const [matchData, setMatchData] = useState([]);

  useEffect(() => {
    let matchListData = matchlistLocal ? matchlistLocal : sportMatchList;
    setMatchData(matchListData);
  }, [sportMatchList]);



  return (
    <section className="overflow-hidden">
      <div className="lg:block hidden ">
        <div className="bg-white w-full flex justify-start items-center overflow-hidden">
          <div className="w-[2%] bg-[var(--secondary)] px-[3px] py-[2px] z-[50]">
            <img src='/subHeader/commentary.png' className="w-[18px] h-[18px]" />
          </div>
          <div className="w-[98%]">
            <div className='px-[2px] text-black bg-[var(--secondary)] '>
              <div className=" px-1 py-[2px] font-[700] tracking-wide animate-[marquee_40s_linear_infinite]  text-white text-[12px] whitespace-nowrap uppercase  ">
                🏏 THE HUNDRED WOMEN'S & MEN'S CUP WINNER🏆 AND FANCY MARKET STARTED IN OUR EXCHANGE 🏏 🎾 ATP TORONTO & WTA MONTREAL 🏆 CUP WINNER BETS STARTED IN OUR EXCHANGE 🎾 🏏 OUR EXCLUSIVE PREMIUM MARKET FOR (SRL) IS NOW STARTED IN OUR EXCHANGE 🏏 DREAM BIG WIN BIG
              </div>
              <style>
                {`  @keyframes marquee {
                       0% { transform: translateX(100%); }
                      100% { transform: translateX(-100%); }
                  }`}
              </style>
            </div>
          </div>
        </div>
      </div>
      <div className="">
        {/* <TopHeader activeAllSporttab={activeAllSporttab} setactiveAllSporttab={setactiveAllSporttab} matchList={matchData} /> */}
        <InplayMatches activeTab={activeAllSporttab} matchlistItems={matchData} />
        {/* <Trendring name={"Trending"} data={groupCasinoList?.trendingGames} />
        <PopularGame name={"Popular Games"} data={groupCasinoList.popularGames} />
        <LiveCasino filterSection={"liveCasino"} name={"Live Casino"} data={groupCasinoList?.liveGames} /> */}
      </div>
    </section>
  )
}

export default React.memo(Dashboard);
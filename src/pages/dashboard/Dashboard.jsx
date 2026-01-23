import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  MdHowToVote,
  MdOutlineSportsEsports,
  MdSportsCricket,
} from "react-icons/md";
import { IoFootballSharp, IoTennisball } from "react-icons/io5";
import { FaFootballBall, FaHorseHead } from "react-icons/fa";
import { IoIosColorWand } from "react-icons/io";
import { FaTableTennisPaddleBall } from "react-icons/fa6";
import LiveMatches from "../../component/dashboard/LiveMatches";
import TopHeader from "../../component/dashboard/TopHeader";
import InplayMatches from "../../component/dashboard/InplayMatches";
import PopularGame from "../../component/dashboard/groupCasino/PopularGame";
import LiveCasino from "../../component/dashboard/groupCasino/LiveGames";
import useGroupCasinoList from "../../component/IntGroupCasinoList/IntGroupCasinoList";
import MarqueeNotification from "../../component/marquee/MarqueeNotification";
import TrendingGames from "../../component/dashboard/groupCasino/Trending";
import Providers from "../../component/dashboard/Providers";
import DashboardInplay from "../../component/dashboard/DashboardInplay";
import DashboardUpcoming from "../../component/dashboard/DashboardUpcoming";
import CasinoGames from "../../component/CasinoJson/NewLunch.json";
import ReddybookCasino from "../../component/CasinoJson/Reddybook.json";
import GameSlider from "../../component/casinoSlider/GameSlider";
import { domainName } from "../../config/Auth";
import { apiCall } from "../../config/HTTP";

export const sportlistArray = [
  {
    sportId: 4,
    sportName: "Cricket",
    icon: <MdSportsCricket />,
  },
  {
    sportId: 1,
    sportName: "Football",
    icon: <IoFootballSharp />,
  },
  {
    sportId: 2,
    sportName: "Tennis",
    icon: <IoTennisball />,
  },
  {
    sportId: 999,
    sportName: "Election",
    icon: <MdHowToVote />,
  },
];

export const AllSportsArray = [
  {
    sportName: "Cricket",
    sportId: 4,
    icons: <FaFootballBall />,
  },
  {
    sportName: "Football",
    sportId: 1,
    icons: <FaFootballBall />,
  },
  {
    sportName: "Tennis",
    sportId: 2,
    icons: <FaTableTennisPaddleBall />,
  },
  {
    sportName: "Esoccer",
    sportId: 46,
    icons: <MdOutlineSportsEsports />,
  },
  {
    sportName: "Horse Racing",
    sportId: 7,
    icons: <FaHorseHead />,
  },
  {
    sportName: "Greyhound Racing",
    sportId: 4339,
    icons: <FaHorseHead />,
  },
  {
    sportName: "Table Tennis",
    sportId: 76544645,
    icons: <FaTableTennisPaddleBall />,
  },
  {
    sportName: "Basketball",
    sportId: 6746546548,
    icons: <FaFootballBall />,
  },
  {
    sportName: "Boxing",
    sportId: 974556455,
    icons: <FaFootballBall />,
  },
  {
    sportName: "Mixed Martial Arts",
    sportId: 145450,
    icons: <FaFootballBall />,
  },
  {
    sportName: "American Football",
    sportId: 15675651,
    icons: <FaFootballBall />,
  },
  {
    sportName: "Volleyball",
    sportId: 1565672,
    icons: <IoIosColorWand />,
  },
  {
    sportName: "Badminton",
    sportId: 156568453,
    icons: <FaFootballBall />,
  },
  {
    sportName: "Snooker",
    sportId: 1578554,
    icons: <FaFootballBall />,
  },
  {
    sportName: "Ice Hockey",
    sportId: 154585685,
    icons: <FaFootballBall />,
  },
  {
    sportName: "E Games",
    sportId: 15656566,
    icons: <FaFootballBall />,
  },
  {
    sportName: "Politics",
    sportId: 5656565617,
    icons: <FaFootballBall />,
  },
  {
    sportName: "Futsal",
    sportId: 1565656688,
    icons: <FaFootballBall />,
  },
  {
    sportName: "Handball",
    sportId: 156546559,
    icons: <FaFootballBall />,
  },
  {
    sportName: "Motor Sports",
    sportId: 2055656767,
    icons: <FaFootballBall />,
  },
  {
    sportName: "Kabaddi",
    sportId: 75677686721,
    icons: <FaFootballBall />,
  },
];

const Dashboard = ({}) => {
  const { sportMatchList } = useSelector((state) => state.sport);
  const [activeAllSporttab, setactiveAllSporttab] = useState(
    localStorage.getItem("dashboardActiveTabKey") || "1",
  );
  const groupCasinoList = useGroupCasinoList();
  // console.log(groupCasinoList, "groupCasinoList");

  const matchlistLocal = localStorage.getItem("matchList")
    ? JSON.parse(localStorage.getItem("matchList"))
    : [];

  const [matchData, setMatchData] = useState([]);
  let userID = JSON.parse(localStorage.getItem(`user_info_${domainName}`));
  const ContactDetails = (() => {
    const data = localStorage.getItem("contact_details");
    try {
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  })();

  const token = localStorage.getItem("token");
  useEffect(() => {
    const localData = localStorage.getItem("matchList");
    const parsedData = localData ? JSON.parse(localData) : sportMatchList;
    setMatchData(parsedData);
  }, [sportMatchList]);

  useEffect(() => {
    {
      !ContactDetails && token && fetchContactDetail();
    }
  }, []);

  const fetchContactDetail = async () => {
    try {
      let response = await apiCall(
        "POST",
        "website/getContactDetailsByCreatorId",
      );
      if (!response?.error) {
        localStorage.setItem("contact_details", JSON.stringify(response?.data));
      } else {
        message.error(response?.message);
      }
    } catch (error) {
      console.error("Error fetching contact details:", error);
    }
  };

  const highlightWithCDN = (CasinoGames?.highlight_casino || []).map(
    (game) => ({
      ...game,
      url_thumb: game.url_thumb?.startsWith("http")
        ? game.url_thumb
        : `https://speedcdn.io/${game.url_thumb}`,
    }),
  );
  const combinedGames = [...highlightWithCDN, ...(ReddybookCasino || [])];

  return (
    <>
      <div className="h-full overflow-y-auto ">
        <div className="md:hidden block">
          <GameSlider data={combinedGames} userInfo={userID} />
          <TrendingGames
            name={"New Launch"}
            data={CasinoGames?.new_launch}
            userInfo={userID}
          />
        </div>
        <div className="lg:block hidden ">
          <MarqueeNotification />
        </div>

        <div className="space-y-0">
          <DashboardInplay
            activeTab="4"
            matchlistItems={matchData}
            sportName="Cricket"
          />

          <DashboardInplay
            activeTab="1"
            matchlistItems={matchData}
            sportName="Soccer"
          />

          <DashboardInplay
            activeTab="2"
            matchlistItems={matchData}
            sportName="Tennis"
          />
        </div>
        <Providers
          filterSection={"providers"}
          name={"Casino Provider"}
          data={CasinoGames?.our_provider}
          userInfo={userID}
        />

        <div className="p-2 bg-[#008000]">
          <div className="flex space-x-2 items-center">
            <img
              src="/subHeader/menu-upcoming.png"
              className="w-[20px] h-[20px]"
              alt="menu"
            />
            <p className="text-white font-semibold text-[14px] tracking-wider">
              UPCOMING EVENTS
            </p>
          </div>
        </div>
        <div className="space-y-0">
          <DashboardUpcoming
            activeTab="4"
            matchlistItems={matchData}
            sportName="Cricket"
          />

          <DashboardUpcoming
            activeTab="1"
            matchlistItems={matchData}
            sportName="Soccer"
          />

          <DashboardUpcoming
            activeTab="2"
            matchlistItems={matchData}
            sportName="Tennis"
          />
        </div>
        {token && (
          <div className="mb-8">
            <div className="fixed md:bottom-6 bottom-4 md:right-8  z-30 right-2 mb-8 animate-pulse">
              <a
                passHref={true}
                href={`https://wa.me/${ContactDetails?.whatsappNumber}`}
                title="Whatsapp"
                className="bg-white rounded-full"
                target="_blank"
              >
                <img src="/wp_support.webp" alt="erer" width={80} height={80} />
              </a>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default React.memo(Dashboard);

import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaMinus, FaFire } from "react-icons/fa6";
import { SPORTSCONSTANT } from "../../config/global";
import settings from "../../domainConfig";
import { IoSearchSharp } from "react-icons/io5";
import useGroupCasinoList from "../IntGroupCasinoList/IntGroupCasinoList";
import moment from "moment";
import Login from "../login/Login";
import { CgClose } from "react-icons/cg";
import CasinoSlider from "../casinoSlider/CasinoSlider";
import { BiDownArrow, BiUpArrow } from "react-icons/bi";


const organizeData = (data, sportId) => {
  if (!data) return [];
  const isRacing = sportId === "7" || sportId === "4339";
  let grouped = {};
  data.forEach((item) => {
    if (item.sportId.toString() !== sportId) return;
    const key = isRacing ? item.countryCode : item.seriesName;
    if (!key) return;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(item);
  });
  return Object.keys(grouped).map((key) => ({
    key,
    data: grouped[key],
  }));
};

const AppSidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {

  const navigate = useNavigate();
  const { sportMatchList } = useSelector((state) => state.sport);
  const [openSport, setOpenSport] = useState(null);
  const [openSeries, setOpenSeries] = useState({});
  const [organizedData, setOrganizedData] = useState([]);
  const [open, setOpen] = useState(false);
  const [openPopular, setOpenPopular] = useState(false);
  const [openCasino, setOpenCasino] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
     const [sidebar, sidebartoggle] = useState(false);
       const [clickedOutside1, setClickedOutside1] = useState(true);

  const openModal = () => {
    setIsLoginOpen(true);
  }

  const closeModal = () => {
    setIsLoginOpen(false);
  };




    const groupCasinoList = useGroupCasinoList();

  const handleMatchClick = (item) => {

if(item?.sportId == 7 || item?.sportId == 4339){
window.location.href = `/sport-view-racing/${item.marketId}/${item.eventId}/${item.sportId}`;
}else{
window.location.href = `/sport-view/${item.marketId}/${item.eventId}/${item.sportId}`;
}
  };

  


const matchlistLocal = localStorage.getItem("matchList") ? JSON.parse(localStorage.getItem("matchList")) : sportMatchList;
  useEffect(() => {
    if (matchlistLocal) {
      setOrganizedData(matchlistLocal);
    }
  }, []);

const domainSetting = JSON.parse(localStorage.getItem('clientdomainSetting'));
let socialMediaLink = domainSetting?.socialMedia
const whastsAppNumber = localStorage.getItem("whatsapp");
const whatsapp = whastsAppNumber != null ? whastsAppNumber : domainSetting?.whatsappNumber;
const theamSettingFlag = domainSetting?.themeSetting
const aboutUsData = theamSettingFlag?.aboutUs;
const contactUsData = theamSettingFlag?.contactUs;

const sport4Data = matchlistLocal?.filter((item) => item.sportId == 4);
const inPlayMatch = sport4Data?.filter(match => {
  return moment().add(60, "minutes").isSameOrAfter(
    moment(match?.matchDate, "DD-MM-YYYY HH:mm:ss")
  );
});

const getTodayMatchesBySport = (data, sportId) => {
  if (!data) return [];

  return data.filter(item => {
    return (
      item.sportId.toString() == sportId &&
      moment(item.startTime).isSame(moment(), "day")
    );
  });
};


  return (
    <>
     <Login isOpen={isLoginOpen} closeModal={closeModal} setIsLoginOpen={setIsLoginOpen} />
   <div className="hidden lg:block">
          <div>
            <CgClose
              onClick={() => sidebartoggle(!sidebar)}
              className="absolute top-6 left-[250px] z-40 text-white text-[2rem] lg:hidden block"
            />
            <div className="relative flex flex-col w-full ">
              <div className="flex flex-col flex-1 overflow-x-hidden overflow-y-auto h-full">
                <div className="text-white md:relative ">
                  <div className="">
                    <div
                      onClick={(e) => {
                        if (localStorage.getItem("token")) {
                          navigate("/market-analysis");
                        } else {
                          openModal();
                          localStorage.setItem("unauthorized", true);
                        }
                      }}
                      className="border-b-[1px] border-[#eceaea] hover:bg-[#FFF6EE] hover:text-[var(--primary)] text-[var(--secondary)] font-[600] tracking-normal text-[12px] px-3 py-[10px] my-0 ml-0 w-full space-x-4 inline-flex justify-start bg-white items-center cursor-pointer "
                    >
                      <p>
                        <img
                          src={"/subHeader/menu-market.png"}
                          className="w-[18px] h-[18px]"
                        />
                      </p>
                      <span className="">Multi Market</span>
                    </div>

                      {SPORTSCONSTANT.map((sportItem, index) => {

  const isTodayAll = sportItem.todayAllSports === true;

  const filteredBySport = isTodayAll
    ? getTodayMatchesBySport(organizedData, sportItem.count)
    : organizeData(organizedData, sportItem.count);

  return (
    <div key={index}
    className={`text-[#343435]  py-0 my-0 transition-[max-height] duration-300 ease-in ${clickedOutside1 === true
                          ? "max-h-auto bg-[#fffff]"
                          : "max-h-0 bg-[#fffff]"
                          }`}
    >
      <div
         className="hover:bg-[#FFF6EE] hover:text-[var(--primary)] text-[var(--secondary)] font-[600] tracking-normal text-[12px] px-3 py-[10px] my-0 ml-0 w-full space-x-0.5 inline-flex justify-between bg-white items-center"
        onClick={() => setOpenSport(openSport === index ? null : index)}
      >
        <div className="flex items-center gap-2 text-sm font-[500]">
          <img src={sportItem.icon} width={20} alt="" />
          {sportItem.text}
        </div>
        {(sportItem.text === "Casino" || sportItem.text === "Sports Book") ? null : openSport === index ?  <BiUpArrow className="w-[10px] h-[10px]" /> :  <BiDownArrow className="w-[10px] h-[10px]" />}
      </div>

      {openSport === index && (
        <div className="pl-6 ">
          {isTodayAll ? (
            <ul className="text-xs  flex flex-col gap-1 text-black">
              {filteredBySport.map(match => (
                <li
                  key={match._id}
                  className="cursor-pointer hover:text-black py-0.5"
                  onClick={() => handleMatchClick(match)}
                >
                  {(match?.sportId == 7 || match?.sportId == 4339) ? <span>{match?.sportName} &nbsp; ({match?.countryCode})</span> : match.matchName}
                </li>
              ))}
            </ul>
          ) : (
            filteredBySport.map((series, sIdx) => {
              const seriesKey = `${index}-${sIdx}`;
              const isRace = sportItem.count === "7" || sportItem.count === "4339";

              return (
                <div key={sIdx}>
                  <div
                    className="flex justify-between px-2 py-1.5 cursor-pointer text-xs text-black"
                    onClick={() =>
                      setOpenSeries(prev => ({
                        ...prev,
                        [seriesKey]: !prev[seriesKey],
                      }))
                    }
                  >
                    <span>
                     {series.key}
                    </span>

                    {openSeries[seriesKey] ?  <BiUpArrow className="w-[10px] h-[10px]" /> :  <BiDownArrow className="w-[10px] h-[10px]" />}
                  </div>

                  {openSeries[seriesKey] && (
                    <ul className="ml-4 text-xs mb-3  flex flex-col gap-1 text-black">
                      {series.data.map(match => (
                        <li
                          key={match._id}
                          onClick={() => handleMatchClick(match)}
                          className="py-0.5"
                        >
                          {(match?.sportId == 7 || match?.sportId == 4339) ? <span>{match?.sportName} &nbsp; ({match?.countryCode})</span> : match.matchName}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })
          )}

        </div>
      )}
    </div>
  );
                      })}
                     <div className="hover:bg-[#FFF6EE] hover:text-[var(--primary)] text-[var(--secondary)] font-[600] tracking-normal text-[12px] px-3 py-[10px] my-0 ml-0 w-full space-x-4 inline-flex justify-start bg-white items-center cursor-pointer ">
                    <p>
                      <img
                        src={"/subHeader/wp.png"}
                        className="w-[18px] h-[18px]"
                      />
                    </p>
                    <span className="">Whatsapp Support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <CasinoSlider data={sidebarData} />
        </div>
    </div>
    </>
  );
};

export default AppSidebar;


const sidebarData = [
  { gameImg: "/login/ls_01.png" },
  { gameImg: "/login/ls_02.png" },
  { gameImg: "/login/ls_03.png" },
  { gameImg: "/login/ls_04.png" },
];

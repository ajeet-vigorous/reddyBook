/* eslint-disable no-unused-vars */
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { AiOutlineMinusSquare, AiOutlinePlusSquare } from "react-icons/ai";
import { CgClose } from "react-icons/cg";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { SPORTSCONSTANT } from "../../config/global";
const organizeData = (data) => {

  if (!data) return [];
  const organizedData = [];
  data?.forEach((item) => {
    const { sportId, seriesId, seriesName } = item;
    let sportIndex = organizedData.findIndex(
      (sport) => sport.sportId === sportId
    );
    if (sportIndex === -1) {
      sportIndex = organizedData.length;
      organizedData.push({ sportId, series: [] });
    }
    let seriesIndex = organizedData[sportIndex].series.findIndex(
      (series) => series.seriesId === seriesId
    );
    if (seriesIndex === -1) {
      seriesIndex = organizedData[sportIndex].series.length;
      organizedData[sportIndex].series.push({
        seriesId,
        seriesName,
        data: [item],
      });
    } else {
      organizedData[sportIndex].series[seriesIndex].data.push(item);
    }
  });

  return organizedData;
};
const AppSidebar = () => {
  const navigate = useNavigate();
  const [sidebar, sidebartoggle] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [racingData, setRacingData] = useState([]);
  const handleResponseGameotherDetails = (data) => { window.location.href = `/sport-view/${data.marketId}/${data.eventId}`; };
  const { sportMatchList } = useSelector((state) => state.sport);
  const modalRef = useRef();
  const handleClickInside = () => setClickedOutside(true);
  const handleClickInside1 = () => setClickedOutside1(true);
  const handleClickInside2 = () => setClickedOutside2(true);
  const [clickedOutside, setClickedOutside] = useState(true);
  const [clickedOutside1, setClickedOutside1] = useState(true);
  const [clickedOutside2, setClickedOutside2] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const [openKeys, setOpenKeys] = useState([]);
  const [openKeys1, setOpenKeys1] = useState({});
  const [matchData, setMatchData] = useState([]);
  const matchlistLocal = localStorage.getItem("matchList") ? JSON.parse(localStorage.getItem("matchList")) : null;
  const [raceId, setRaceId] = useState(null);
  useEffect(() => {
    // console.log(sportMatchList, matchlistLocal, "data?.forEach")
    let matchListData = matchlistLocal ? matchlistLocal : sportMatchList;
    setMatchData(matchListData);
  }, [sportMatchList]);

  useEffect(() => {
    if (matchData) {
      const organizedData = organizeData(matchData);
      setFilteredData(organizedData);
    } else {
      let localStorageData =
        JSON.parse(localStorage.getItem("matchList")) || [];
      const organizedData = organizeData(localStorageData?.data);
      setFilteredData(organizedData);
    }
  }, [matchData]);
  useEffect(() => {
    setRacingData(matchData.filter((race) => race.sportId == raceId));
  }, [raceId]);
  const handleClick = (index, e) => {
    e.stopPropagation();
    if (openKeys.includes(index)) {
      setOpenKeys(openKeys.filter((key) => key !== index));
    } else {
      setOpenKeys([...openKeys, index]);
    }
  };

  const handleClick1 = (sportIndex, seriesIndex, e) => {
    e.stopPropagation();
    const key = `${sportIndex}-${seriesIndex}`;
    setOpenKeys1((prevOpenKeys1) => ({
      ...prevOpenKeys1,
      [key]: !prevOpenKeys1[key],
    }));
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsModalOpen(false);
      }
    }
    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen, setIsModalOpen]);

  const handleRacing = (id) => {
    if (id == raceId) {
      setIsModalOpen((prev) => !prev)
    }
    else {
      setIsModalOpen(true)
    }
    setRaceId(id)
  }
  return (
    <div>
      <CgClose
        onClick={() => sidebartoggle(!sidebar)}
        className="absolute top-6 left-[250px] z-40 text-white text-[2rem] lg:hidden block"
      />
      <div className="relative flex flex-col w-full ">
        <div className="flex flex-col flex-1 overflow-x-hidden overflow-y-auto h-full scroll-md ">
          <div className="text-white md:relative ">
            <div>
              {
                <div
                  className="flex items-center justify-between space-x-2  py-1 px-1  cursor-pointer bg-[var(--primary)]"
                  onClick={() => {
                    handleClickInside2();
                    setClickedOutside2(!clickedOutside2);
                  }}
                >
                  <span className="select-none text-base pl-1 text-[#fff]">
                    Racing Sports
                  </span>
                  <MdOutlineKeyboardArrowDown
                    size={20}
                    className={`text-white transform duration-300 ease-linear " ${clickedOutside === true ? "rotate-180 " : "rotate-0 "
                      }`}
                  />
                </div>
              }
              {clickedOutside2 ? (
                <>
                  {
                    <div
                      className={`text-black text-base overflow-hidden transition-[max-height] duration-300 ease-in    ${clickedOutside2 === true
                          ? " bg-[#bbbbbb]"
                          : "max-h-0 bg-[#bbbbbb]"
                        } `}
                    >
                      <div className="py-0 divide-y divide-[#9e9e9e] scroll-md">
                        <div className="divide-y divide-[#9e9e9e] cursor-pointer">
                          <div
                            onClick={() => { handleRacing(7) }}
                            className="text-sm px-3 py-1 w-full flex  font-normal blink-soft"
                          >
                            Horse racing
                          </div>
                        </div>
                        <div className="divide-y divide-[#9e9e9e] cursor-pointer">
                          <div
                            onClick={() => { handleRacing(4339) }}
                            className="text-sm px-3 py-1 w-full flex  font-normal blink-soft"
                          >
                            Greyhound racing
                          </div>
                        </div>
                      </div>
                    </div>
                  }
                </>
              ) : null}
            </div>
            <div>
              {
                <div
                  className="flex items-center justify-between space-x-2  py-1 px-1  cursor-pointer bg-[var(--primary)]"
                  onClick={() => {
                    handleClickInside();
                    setClickedOutside(!clickedOutside);
                  }}
                >
                  <span className="select-none text-base pl-1 text-[#fff]">
                    Others
                  </span>
                  <MdOutlineKeyboardArrowDown
                    size={20}
                    className={`text-white transform duration-300 ease-linear " ${clickedOutside === true ? "rotate-180 " : "rotate-0 "
                      }`}
                  />
                </div>
              }
              {clickedOutside ? (
                <>
                  {
                    <div
                      className={`text-black text-base overflow-hidden transition-[max-height] duration-300 ease-in    ${clickedOutside === true
                          ? " bg-[#bbbbbb]"
                          : "max-h-0 bg-[#bbbbbb]"
                        } `}
                    >
                      <div className="py-0 divide-y divide-[#9e9e9e] scroll-md">
                        <div className="divide-y divide-[#9e9e9e] cursor-pointer">
                          <div
                            onClick={() =>
                              navigate("/casino-layout/our-casino")
                            }
                            className=" blinking-text text-sm px-3 py-1 w-full flex  font-normal blink-soft"
                          >
                            Our Casino
                          </div>
                          <div
                            onClick={() =>
                              navigate("/casino-layout/our-casino")
                            }
                            className=" blinking-text text-sm px-3 py-1 w-full flex  font-normal blink-soft"
                          >
                            Our Virtual
                          </div>

                          <div
                            onClick={() =>
                              navigate(`/live-casino/live-casino/tembo`)
                            }
                            className="text-sm px-3 py-1 w-full flex  font-normal"
                          >
                            Live Casino
                          </div>
                          <div
                            onClick={() =>
                              navigate(`/live-casino/slot-game/turbogames`)
                            }
                            className="text-sm px-3 py-1 w-full flex  font-normal"
                          >
                            Slot Game
                          </div>
                          <div
                            onClick={() =>
                              navigate("/casino-layout/our-casino")
                            }
                            className="text-sm px-3 py-1 w-full flex  font-normal"
                          >
                            Fantasy Game
                          </div>
                        </div>
                      </div>
                    </div>
                  }
                </>
              ) : null}
            </div>

            <div className="">
              <div
                className="flex items-center justify-between space-x-2 h-8 cursor-pointer bg-[var(--primary)]"
                onClick={() => {
                  handleClickInside1();
                  setClickedOutside1(!clickedOutside1);
                }}
              >
                <span className="select-none text-base pl-1 text-[#fff]">
                  All Sports
                </span>
                <MdOutlineKeyboardArrowDown
                  size={20}
                  className={`text-white transform duration-300 ease-linear ${clickedOutside1 === true ? "rotate-180" : "rotate-0"
                    }`}
                />
              </div>

              <div
                className={`text-black text-base overflow-hidden transition-[max-height] duration-300 ease-in ${clickedOutside1 === true
                    ? "max-h-96 bg-[#bbbbbb]"
                    : "max-h-0 bg-[#bbbbbb]"
                  }`}
              >
                <div className="">
                  <div className="cursor-pointer h-[90%] overflow-y-scroll"></div>
                </div>
              </div>

              {SPORTSCONSTANT?.map((menuItem, index) => {
                const sport = filteredData?.find(
                  (sport) => sport.sportId.toString() === menuItem.count
                );
                return (
                  <div
                    key={index}
                    className={`text-black overflow-hidden py-0 my-0 transition-[max-height] duration-300 ease-in ${clickedOutside1 === true
                        ? "max-h-96 bg-[#bbbbbb]"
                        : "max-h-0 bg-[#bbbbbb]"
                      }`}
                  >
                    <div className="cursor-pointer border-b border-[#9e9e9e]">
                      <div
                        className="text-sm px-3 py-[2px] my-0 ml-0 w-full space-x-0.5 font-normal inline-flex items-center"
                        onClick={(e) => handleClick(index, e)}
                      >
                        <span>
                          {openKeys.includes(index) ? (
                            <AiOutlineMinusSquare />
                          ) : (
                            <AiOutlinePlusSquare />
                          )}
                        </span>
                        <span>{menuItem.text}</span>
                      </div>
                      {sport && openKeys.includes(index) && (
                        <div className="py-0 my-0 divide-y divide-[#9e9e9e]">
                          {sport?.series.map((series, seriesIndex) => (
                            <div key={seriesIndex} className="divide-y divide-[#9e9e9e] w-full">
                                <div
                                  className="text-sm ml-4 relative px-0 text-black w-full py-0 my-0 space-x-0.5 font-normal inline-flex items-center cursor-pointer"
                                  onClick={(e) =>
                                    handleClick1(index, seriesIndex, e)
                                  }
                                >
                                  {openKeys1[`${index}-${seriesIndex}`] ? (
                                    <AiOutlineMinusSquare />
                                  ) : (
                                    <AiOutlinePlusSquare />
                                  )}
                                  <span className="px-2 py-0 my-0">
                                    {series.seriesName}
                                  </span>
                                </div>
                              {openKeys1[`${index}-${seriesIndex}`] && (
                                <div className="py-0 my-0">
                                  <ul className="list-disc py-0 my-0  divide-y divide-[#9e9e9e]">
                                    {series.data.map((item) => (
                                      <li
                                        key={item._id}
                                        className="text-sm relative py-0 my-0 pl-6 text-black border-black w-full space-x-0.5 font-normal inline-flex items-center cursor-pointer"
                                        onClick={(e) => {
                                          handleResponseGameotherDetails(item);
                                          sidebartoggle();
                                        }}
                                      >
                                        <span> {item.matchName}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <div
          ref={modalRef}
          className="absolute  top-[155px] lg:left-[200px] xl:left-[250px] 2xl:left-[280px]  w-[240px] overflow-auto  h-[600px] border bg-white  "
          style={{ zIndex: 99999 }}
        >
          <div className="text-[20px] px-2 py-2 border-b border-black">
            <span className="font-bold  ">
              {raceId == 7 ? "All Horse Racing" : "All GreyHound Racing"}
            </span>
          </div>
          {racingData?.map((race, index) => {
            return (
              <div onClick={() => {
                window.location.href = `/sport-view-racing/${race?.marketId}/${race?.eventId}/${race?.sportId}`
              }} key={index} className="flex gap-2 hover:underline px-5 py-2">
                <span>{moment(race?.matchDate).format("HH:mm")} </span>{" "}
                <span>{race?.matchName}</span>{" "}
                <span> ({race?.countryCode})</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AppSidebar;

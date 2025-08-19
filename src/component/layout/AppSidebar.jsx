/* eslint-disable no-unused-vars */
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { CgClose } from "react-icons/cg";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BiDownArrow, BiUpArrow } from "react-icons/bi";
import CasinoSlider from "../casinoSlider/CasinoSlider";
import { SPORTSCONSTANT } from "../../config/global";
import settings from "../../domainConfig";
import { FaTimes } from "react-icons/fa";

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

const AppSidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const navigate = useNavigate();
  const [sidebar, sidebartoggle] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleResponseGameotherDetails = (data) => {
    window.location.href = `/sport-view/${data.marketId}/${data.eventId}`;
  };
  const { sportMatchList } = useSelector((state) => state.sport);
  const modalRef = useRef();
  const [clickedOutside, setClickedOutside] = useState(true);
  const [clickedOutside1, setClickedOutside1] = useState(true);
  const [clickedOutside2, setClickedOutside2] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const [openKeys, setOpenKeys] = useState([]);
  const [openKeys1, setOpenKeys1] = useState({});
  const [matchData, setMatchData] = useState([]);
  const matchlistLocal = localStorage.getItem("matchList")
    ? JSON.parse(localStorage.getItem("matchList"))
    : null;
  const [raceId, setRaceId] = useState(null);

  const [openRaceId, setOpenRaceId] = useState(null);
  const [racingData, setRacingData] = useState([]);

  useEffect(() => {
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
    if (matchData && raceId != null) {
      setRacingData(matchData.filter((race) => race.sportId == Number(raceId)));
    }
  }, [matchData, raceId]);

  // const handleClick = (index, e) => {
  //   e.stopPropagation();

  //   const clickedItem = SPORTSCONSTANT[index];

  //   if (clickedItem?.text === "Casino") {
  //     navigate("/all-casino");
  //     return;
  //   }
  //   if (clickedItem?.text === "Sports Book") {
  //     navigate("/sport-sbook");
  //     return;
  //   }

  //   if (openKeys.includes(index)) {
  //     setOpenKeys(openKeys.filter((key) => key !== index));
  //   } else {
  //     setOpenKeys([...openKeys, index]);
  //   }
  // };
  // console.log("openKeys", openKeys);
 
  const handleClick = (index, e) => {
  
    e.stopPropagation();
    if (openKeys.includes(index)) {
      setOpenKeys(openKeys.filter((key) => key !== index));
    } else {
      setOpenKeys([...openKeys, index]);
    }
    const clickedItem = SPORTSCONSTANT[index];
  

    if (clickedItem?.text === "Casino") {
      navigate("/all-casino");
      return;
    }
    if (clickedItem?.text === "Sports Book") {
      navigate("/sports-book");
      return;
    }
    if (clickedItem?.text === "Horse Racing") {
      setOpenRaceId(7);
      return;
    }
    if (clickedItem?.text === "Greyhound Racing") {
      setOpenRaceId(Number(4339));
      return;
    }
    if (clickedItem?.id) {
      setOpenRaceId(clickedItem.id);
    } else {
      setOpenRaceId(null); // fallback
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

  const handleRacing = (id) => {
    setOpenRaceId((prevId) => (prevId === id ? null : id));
  };

  useEffect(() => {
    if (openRaceId) {
      setRacingData(matchData.filter((race) => race.sportId === openRaceId));
    } else {
      setRacingData([]);
    }
  }, [openRaceId, matchData]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsSidebarOpen(false);
      }
    }
    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen, setIsSidebarOpen]);

  return (
    <>
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
                    onClick={() => {
                      navigate("/market-analysis");
                    }}
                    className="border-b-[1px] border-[#eceaea] hover:bg-[#FFF6EE] hover:text-[var(--primary)] text-[var(--secondary)] font-[500] tracking-normal text-[13px] px-3 py-[10px] my-0 ml-0 w-full space-x-4 inline-flex justify-start bg-white items-center cursor-pointer "
                  >
                    <p>
                      <img
                        src={"/subHeader/menu-market.png"}
                        className="w-[18px] h-[18px]"
                      />
                    </p>
                    <span className="">Multi Market</span>
                  </div>

                  {SPORTSCONSTANT?.map((menuItem, index) => {
                    const sport = filteredData?.find(
                      (sport) => sport.sportId.toString() === menuItem.count
                    );
                    const racingDataSidebar =
                      menuItem.count == "7"
                        ? matchData?.filter(
                            (race) => race.sportId == Number(menuItem.count)
                          )
                        : [];
                    const greyhoundDataSidebar =
                      menuItem.count == "4339"
                        ? matchData?.filter(
                            (race) => race.sportId == Number(menuItem.count)
                          )
                        : [];
                        const recingGreyhopund = menuItem.count == "4339" ? greyhoundDataSidebar : menuItem.count == "7" ? racingDataSidebar : [];

                    return (
                      <div
                        key={index}
                        className={`text-[#343435]  py-0 my-0 transition-[max-height] duration-300 ease-in ${
                          clickedOutside1 === true
                            ? "max-h-96 bg-[#fffff]"
                            : "max-h-0 bg-[#fffff]"
                        }`}
                      >
                        <div className="cursor-pointer border-b-[1px] border-[#eceaea]">
                          <div
                            className="hover:bg-[#FFF6EE] hover:text-[var(--primary)] text-[var(--secondary)] font-[500] tracking-normal text-[13px] px-3 py-[10px] my-0 ml-0 w-full space-x-0.5 inline-flex justify-between bg-white items-center"
                            onClick={(e) => handleClick(index, e)}
                          >
                            <div className="flex justify-start items-center space-x-4">
                              <span>
                                <img
                                  src={menuItem.icon}
                                  alt={menuItem.text}
                                  className="w-[18px] h-[18px]"
                                />
                              </span>
                              <span className="">{menuItem.text}</span>
                            </div>
                            <span>
                              {!(
                                menuItem.text === "Casino" ||
                                menuItem.text === "Sports Book"
                              ) &&
                                (openKeys.includes(index) ? (
                                  <BiUpArrow className="w-[10px] h-[10px]" />
                                ) : (
                                  <BiDownArrow className="w-[10px] h-[10px]" />
                                ))}
                            </span>
                          </div>

                          {(menuItem?.count === "4339" || menuItem?.count === "7") &&
                            openKeys.includes(index) && (
                              <div className="bg-[#f6f9ff] divide-y divide-[#eceaea]">
                                {recingGreyhopund.length > 0 ? (
                                  recingGreyhopund?.map((item) => (
                                    <div
                                      key={item._id}
                                      className="bg-[#f6f9ff] text-xs font-[500] relative py-[8px] pl-8 text-[#343435] hover:text-[var(--primary)] cursor-pointer"
                                      onClick={() => {
                                        handleResponseGameotherDetails(item);
                                        sidebartoggle();
                                      }}
                                    >
                                      🎮 {item.matchName} {item.matchId}
                                    </div>
                                  ))
                                ) : (
                                  <div className="py-2 px-4 text-xs text-gray-500 italic">
                                    No Match available!
                                  </div>
                                )}
                              </div>
                            )}

                          {sport && menuItem?.count !== "4339" && menuItem?.count !== "7" && openKeys.includes(index) && (
                            <div className="py-0 my-0 divide-y-[1px] divide-[#f1f1f1] bg-[#f6f9ff]">
                              {sport?.series.length > 0 ? (
                                sport.series.map((series, seriesIndex) => (
                                  <div
                                    key={seriesIndex}
                                    className="cursor-pointer border-b-[1px] border-[#eceaea]"
                                  >
                                    <div
                                      className="hover:bg-[#FFF6EE] hover:text-[var(--primary)] text-[var(--secondary)] font-[500] tracking-normal text-[13px] px-3 py-[10px] my-0 ml-0 w-full space-x-0.5 inline-flex justify-between bg-white items-center"
                                      onClick={(e) =>
                                        handleClick1(index, seriesIndex, e)
                                      }
                                    >
                                      <span className="px-2 py-0 my-0">
                                        {series.seriesName}
                                      </span>
                                      <span>
                                        {openKeys1[
                                          `${index}-${seriesIndex}`
                                        ] ? (
                                          <BiUpArrow className="w-[10px] h-[10px]" />
                                        ) : (
                                          <BiDownArrow className="w-[10px] h-[10px]" />
                                        )}
                                      </span>
                                    </div>

                                    {openKeys1[`${index}-${seriesIndex}`] && (
                                      <div className="py-0 my-0">
                                        {series.data.length > 0 ? (
                                          <ul className="list-disc py-0 my-0 divide-y-[1px] divide-[#f1f1f1]">
                                            {series.data.map((item) => (
                                              <li
                                                key={item._id}
                                                className="bg-[#f6f9ff] text-xs font-[500] relative py-[8px] my-0 pl-8 text-[#343435] hover:text-[var(--primary)] w-full space-x-0.5 inline-flex items-center cursor-pointer"
                                                onClick={(e) => {
                                                  handleResponseGameotherDetails(
                                                    item
                                                  );
                                                  sidebartoggle();
                                                }}
                                              >
                                                <span className="flex items-center space-x-1">
                                                  <p>🎮</p>
                                                  <p>{item.matchName}</p>
                                                </span>
                                              </li>
                                            ))}
                                          </ul>
                                        ) : (
                                          <div className="py-2 px-4 text-xs text-gray-500 italic">
                                            No Match available!
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                ))
                              ) : (
                                <div className="py-2 px-4 text-xs text-gray-500 italic">
                                  No Match available!
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {/* <div className="text-[#343435] overflow-hidden py-0 my-0 transition-[max-height] duration-300 ease-in">
                    <div className="cursor-pointer divide-y-[1px] divide-[#f1f1f1] border-b-[1px] border-[#eceaea]">
                      <div
                        className="hover:bg-[#FFF6EE] hover:text-[var(--primary)] text-[var(--secondary)] font-[500] tracking-normal text-[13px] px-3 py-[10px] my-0 w-full inline-flex justify-between bg-white items-center"
                        onClick={() => handleRacing(7)}
                      >
                        <div className="flex justify-start items-center space-x-4">
                          <span>
                            <img
                              src="/subHeader/menu-7.png"
                              alt="Horse Racing"
                              className="w-[18px] h-[18px]"
                            />
                          </span>
                          <span>Horse Racing</span>
                        </div>
                        <span>
                          {openRaceId === 7 ? (
                            <BiUpArrow className="w-[10px] h-[10px]" />
                          ) : (
                            <BiDownArrow className="w-[10px] h-[10px]" />
                          )}
                        </span>
                      </div>
                      {openRaceId === 7 && (
                        <div className="bg-[#f6f9ff] divide-y divide-[#eceaea]">
                          {racingData.length > 0 ? (
                            racingData.map((item) => (
                              <div
                                key={item._id}
                                className="bg-[#f6f9ff] text-xs font-[500] relative py-[8px] pl-8 text-[#343435] hover:text-[var(--primary)] cursor-pointer"
                                onClick={() => {
                                  handleResponseGameotherDetails(item);
                                  sidebartoggle();
                                }}
                              >
                                🎮 {item.matchName}
                              </div>
                            ))
                          ) : (
                            <div className="py-2 px-4 text-xs text-gray-500 italic">
                              No Match available!
                            </div>
                          )}
                        </div>
                      )}

                      <div
                        className="hover:bg-[#FFF6EE] hover:text-[var(--primary)] text-[var(--secondary)] font-[500] tracking-normal text-[13px] px-3 py-[10px] my-0 w-full inline-flex justify-between bg-white items-center"
                        onClick={() => handleRacing(4339)}
                      >
                        <div className="flex justify-start items-center space-x-4">
                          <span>
                            <img
                              src="/subHeader/menu-4339.png"
                              alt="Greyhound Racing"
                              className="w-[18px] h-[18px]"
                            />
                          </span>
                          <span>Greyhound Racing</span>
                        </div>
                        <span>
                          {openRaceId === 4339 ? (
                            <BiUpArrow className="w-[10px] h-[10px]" />
                          ) : (
                            <BiDownArrow className="w-[10px] h-[10px]" />
                          )}
                        </span>
                      </div>
                      {openRaceId === 4339 && (
                        <div className="bg-[#f6f9ff] divide-y divide-[#eceaea]">
                          {racingData.length > 0 ? (
                            racingData.map((item) => (
                              <div
                                key={item._id}
                                className="bg-[#f6f9ff] text-xs font-[500] relative py-[8px] pl-8 text-[#343435] hover:text-[var(--primary)] cursor-pointer"
                                onClick={() => {
                                  handleResponseGameotherDetails(item);
                                  sidebartoggle();
                                }}
                              >
                                🎮 {item.matchName}
                              </div>
                            ))
                          ) : (
                            <div className="py-2 px-4 text-xs text-gray-500 italic">
                              No Match available!
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div> */}

                  <div className="hover:bg-[#FFF6EE] hover:text-[var(--primary)] text-[var(--secondary)] font-[500] tracking-normal text-[13px] px-3 py-[10px] my-0 ml-0 w-full space-x-4 inline-flex justify-start bg-white items-center cursor-pointer ">
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

      <div className="block lg:hidden shadow-[0_0_20px_rgba(1,41,112,0.1)]">
        <div className="flex justify-between items-center border-b-[1px] border-[#eceaea] py-1 px-2">
          <div></div>
          <div>
            <img src={settings.logo1} className="w-[70px] h-[24px]" />
          </div>
          <div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="block lg:hidden"
            >
              <FaTimes className="text-black/70" size={16} />
            </button>
          </div>
        </div>
        <div className="relative flex flex-col w-full ">
          <div className="flex flex-col flex-1 overflow-x-hidden overflow-y-auto h-full">
            <div className="text-white md:relative ">
              <div className="">
                <div
                  onClick={() => {
                    navigate("/market-analysis");
                  }}
                  className="border-b-[1px] border-[#eceaea] hover:bg-[#FFF6EE] hover:text-[var(--primary)] text-[var(--secondary)] font-[500] tracking-normal text-[13px] px-3 py-[10px] my-0 ml-0 w-full space-x-4 inline-flex justify-start bg-white items-center cursor-pointer "
                >
                  <p>
                    <img
                      src={"/subHeader/menu-market.png"}
                      className="w-[18px] h-[18px]"
                    />
                  </p>
                  <span className="">Multi Market</span>
                </div>
                {SPORTSCONSTANT?.map((menuItem, index) => {
                  const sport = filteredData?.find(
                    (sport) => sport.sportId.toString() === menuItem.count
                  );

                  // Special case: Racing category
                  const isRacingCategory = menuItem.text === "Racing"; // You can change this name to match your actual data

                  return (
                    <div
                      key={index}
                      className={`text-[#343435] overflow-hidden py-0 my-0 transition-[max-height] duration-300 ease-in ${
                        clickedOutside1 === true
                          ? "max-h-96 bg-[#fffff]"
                          : "max-h-0 bg-[#fffff]"
                      }`}
                    >
                      <div className="cursor-pointer border-b-[1px] border-[#eceaea]">
                        {/* Sport Header */}
                        <div
                          className="hover:bg-[#FFF6EE] hover:text-[var(--primary)] text-[var(--secondary)] font-[500] tracking-normal text-[13px] px-3 py-[10px] my-0 ml-0 w-full space-x-0.5 inline-flex justify-between bg-white items-center"
                          onClick={(e) => {
                            if (isRacingCategory) {
                              // If racing, just toggle
                              setClickedOutside2((prev) => !prev);
                            } else {
                              handleClick(index, e);
                            }
                          }}
                        >
                          <div className="flex justify-start items-center space-x-4">
                            <span>
                              <img
                                src={menuItem.icon}
                                alt={menuItem.text}
                                className="w-[18px] h-[18px]"
                              />
                            </span>
                            <span className="">{menuItem.text}</span>
                          </div>
                          <span>
                            {!(
                              menuItem.text === "Casino" ||
                              menuItem.text === "Sports Book"
                            ) &&
                              (openKeys.includes(index) ? (
                                <BiUpArrow className="w-[10px] h-[10px]" />
                              ) : (
                                <BiDownArrow className="w-[10px] h-[10px]" />
                              ))}
                          </span>
                        </div>

                        {/* If this is racing, show horse & greyhound options */}
                        {isRacingCategory && clickedOutside2 && (
                          <div className="bg-[#bbbbbb] py-0 divide-y divide-[#9e9e9e]">
                            <div
                              onClick={() => handleRacing(7)}
                              className="text-sm px-3 py-1 w-full flex font-normal cursor-pointer hover:bg-gray-200"
                            >
                              Horse Racing
                            </div>
                            <div
                              onClick={() => handleRacing(4339)}
                              className="text-sm px-3 py-1 w-full flex font-normal cursor-pointer hover:bg-gray-200"
                            >
                              Greyhound Racing
                            </div>
                          </div>
                        )}

                        {/* If this is NOT racing, render the normal sport series */}
                        {!isRacingCategory &&
                          sport &&
                          openKeys.includes(index) && (
                            <div className="py-0 my-0 divide-y-[1px] divide-[#f1f1f1] bg-[#f6f9ff]">
                              {sport?.series.length > 0 ? (
                                sport.series.map((series, seriesIndex) => (
                                  <div
                                    key={seriesIndex}
                                    className="cursor-pointer border-b-[1px] border-[#eceaea]"
                                  >
                                    <div
                                      className="hover:bg-[#FFF6EE] hover:text-[var(--primary)] text-[var(--secondary)] font-[500] tracking-normal text-[13px] px-3 py-[10px] my-0 ml-0 w-full space-x-0.5 inline-flex justify-between bg-white items-center"
                                      onClick={(e) =>
                                        handleClick1(index, seriesIndex, e)
                                      }
                                    >
                                      <span className="px-2 py-0 my-0">
                                        {series.seriesName}
                                      </span>
                                      <span>
                                        {openKeys1[
                                          `${index}-${seriesIndex}`
                                        ] ? (
                                          <BiUpArrow className="w-[10px] h-[10px]" />
                                        ) : (
                                          <BiDownArrow className="w-[10px] h-[10px]" />
                                        )}
                                      </span>
                                    </div>

                                    {openKeys1[`${index}-${seriesIndex}`] && (
                                      <div className="py-0 my-0">
                                        {series.data.length > 0 ? (
                                          <ul className="list-disc py-0 my-0 divide-y-[1px] divide-[#f1f1f1]">
                                            {series.data.map((item) => (
                                              <li
                                                key={item._id}
                                                className="bg-[#f6f9ff] text-xs font-[500] relative py-[8px] my-0 pl-8 text-[#343435] hover:text-[var(--primary)] w-full space-x-0.5 inline-flex items-center cursor-pointer"
                                                onClick={(e) => {
                                                  handleResponseGameotherDetails(
                                                    item
                                                  );
                                                  sidebartoggle();
                                                }}
                                              >
                                                <span className="flex items-center space-x-1">
                                                  <p>🎮</p>
                                                  <p>{item.matchName}</p>
                                                </span>
                                              </li>
                                            ))}
                                          </ul>
                                        ) : (
                                          <div className="py-2 px-4 text-xs text-gray-500 italic">
                                            No Match available!
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                ))
                              ) : (
                                <div className="py-2 px-4 text-xs text-gray-500 italic">
                                  No Match available!
                                </div>
                              )}
                            </div>
                          )}
                      </div>
                    </div>
                  );
                })}

                <div className="hover:bg-[#FFF6EE] hover:text-[var(--primary)] text-[var(--secondary)] font-[500] tracking-normal text-[13px] px-3 py-[10px] my-0 ml-0 w-full space-x-4 inline-flex justify-start bg-white items-center cursor-pointer ">
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

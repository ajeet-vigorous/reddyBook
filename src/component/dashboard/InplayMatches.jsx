/* eslint-disable react/prop-types */
import { LiaDesktopSolid } from "react-icons/lia";
import moment from "moment";
import { useEffect, useState } from "react";
import { TbDeviceTvOld } from "react-icons/tb";
import { useParams } from "react-router-dom";
import { FaTv } from "react-icons/fa";

function InplayMatches({ activeTab, matchlistItems, sportName }) {

  const [subTab, setSubTab] = useState('AU')
  const [isLive, setIsLive] = useState(false);
  const [isVirtual, setIsVirtual] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const { gameId } = useParams();

  const filteredMatches = matchlistItems?.filter(
    (element) => element.sportId == activeTab
  ).sort((a, b) => moment(a.matchDate, "DD-MM-YYYY HH:mm:ss").isBefore(moment(b.matchDate, "DD-MM-YYYY HH:mm:ss")) ? -1 : 1);


  const isInplayMatch = (match) => {
    const matchMoment = moment(match?.matchDate, "DD-MM-YYYY HH:mm:ss A");
    const currentMoment = moment().add(60, 'minutes');
    return currentMoment.isSameOrAfter(matchMoment);
  };

  const groupedBySeries = {};
  if (filteredMatches?.length > 0) {
    filteredMatches.forEach((match) => {
      const series = match.countryCode || "Other Series";
      if (!groupedBySeries[series]) {
        groupedBySeries[series] = [];
      }
      groupedBySeries[series].push(match);
    });
  }

  const functiongroupbyRacingmatch = (matchArray) => {
    const groupedByRacingMatch = {};
    if (matchArray?.length > 0) {
      matchArray.forEach((match) => {
        const matches = match.matchName || "Other Match";
        if (!groupedByRacingMatch[matches]) {
          groupedByRacingMatch[matches] = [];
        }
        groupedByRacingMatch[matches].push(match);

      });
    }
    return Object.entries(groupedByRacingMatch)?.map(([key, value]) => ({ key, value }))
  }

  let content;

  useEffect(() => {
    const seriesKeys = Object.keys(groupedBySeries);
    if (seriesKeys.length > 0 && !subTab) {
      setSubTab(seriesKeys[0]);
    }
  }, [groupedBySeries, subTab]);

  useEffect(() => {
    setSubTab()
  }, [activeTab]);


  if (activeTab == 4339 || activeTab == 7) {
    content = (
      <div className=" text-gray-700 text-[16px]">
        {gameId === "7" && (
          <>
            <div>
              <div className="relative uppercase tracking-wider text-sm bg-[var(--primary)] w-[200px] font-bold text-white py-1.5 px-3">
                <div className="flex space-x-2 items-center">
                  <img src="/subHeader/menu-7.png" className="w-[20px] h-[20px]" alt="menu" />
                  <p>Horse Racing</p>
                </div>
                <span className="absolute top-0 right-[-15px] w-0 h-0 border-t-[32px] border-t-[var(--primary)] border-r-[15px] border-r-transparent"></span>
              </div>
            </div>
          </>

        )}
        {gameId === "4339" && (
          <>
            <div>
              <div className="relative uppercase tracking-wider text-sm bg-[var(--primary)] w-[200px] font-bold text-white py-1.5 px-3">
                <div className="flex space-x-2 items-center">
                  <img src="/subHeader/menu-4339.png" className="w-[20px] h-[20px]" alt="menu" />
                  <p>Greyhound Racing</p>
                </div>
                <span className="absolute top-0 right-[-15px] w-0 h-0 border-t-[32px] border-t-[var(--primary)] border-r-[15px] border-r-transparent"></span>
              </div>
            </div>
          </>
        )}

        <div className="bg-[var(--darkcolor)] flex items-center p-0">
          {Object.keys(groupedBySeries)?.map((el, index) => {
            return (
              <>
                <div onClick={() => setSubTab(el)} className={`cursor-pointer text-[14px] hover:bg-[var(--secondary)] ${subTab === el ? "bg-[var(--secondary)] px-5 py-[4px] text-white" : "px-5 py-[4px] text-white"}`} key={index}>
                  {el}
                </div>
              </>
            )
          })}
        </div>
        <div className="bg-[#F2F2F2]">
          {groupedBySeries[subTab] && functiongroupbyRacingmatch(groupedBySeries[subTab])?.length > 0 ? (
            functiongroupbyRacingmatch(groupedBySeries[subTab])?.map((match, index) => (
              <div key={index} className="flex xl:items-center p-1.5 xl:justify-start md:grid md:grid-cols-[0.5fr_1.5fr]  xl:flex-row flex-col items-start justify-between gap-1 border-b border-gray-300">
                <div className="flex flex-row justify-start items-center gap-2">
                  <FaTv className="text-black" />
                  <div className="xl:min-w-[400px] text-[13px] min-w-full font-[600] uppercase">{match?.key}</div>
                </div>
                {<div className="xl:min-w-[400px]  min-w-full flex  flex-wrap justify-start items-center gap-1">

                  {match?.value?.map((allMatchTime, newindex) => (
                    <div onClick={() => {
                      window.location.href = `/sport-view-racing/${allMatchTime?.marketId}/${allMatchTime?.eventId}/${allMatchTime?.sportId}`
                    }} key={newindex} className="bg-[var(--darkcolor)] rounded-[4px] text-white px-2.5 py-[4px] text-[13px] text-center cursor-pointer">
                      {moment(allMatchTime?.matchDate, 'YYYY-MM-DD HH:mm:ss', true).isValid() ? (
                        moment(allMatchTime.matchDate, 'YYYY-MM-DD HH:mm:ss').format("HH:mm")
                      ) : null}

                    </div>
                  ))}
                </div>}
              </div>
            ))
          ) : (
            <>
              <div className="lg:flex hidden justify-between px-1.5 py-1 w-full border-b border-t border-[#C6D2D8]">
                <h2 className="text-sm font-bold text-black w-[60%] px-2">Game</h2>
                <p className="w-[40%] grid grid-cols-3 text-center text-sm font-bold">
                  <span>1</span>
                  <span>X</span>
                  <span>2</span>
                </p>
              </div>
              <div className="border-b px-2 py-1 text-[13px]">
                No Records found
              </div>
            </>)}
        </div>
      </div>
    );
  } else {
    if (!filteredMatches || filteredMatches.length === 0) {
      content = (
        <>
          <div className="flex items-center justify-between w-full bg-[#e9eff8] border-b border-t border-[#C6D2D8]">
            <div className="relative text-sm bg-[var(--primary)] w-[180px] font-bold text-white py-1.5 px-2">
              {sportName}
              <span className="absolute top-0 right-[-15px] w-0 h-0 border-t-[32px] border-t-[var(--primary)] border-r-[15px] border-r-transparent"></span>
            </div>
            <p className="w-[40%] grid grid-cols-3 text-center text-sm font-bold">
              <span>1</span>
              <span>X</span>
              <span>2</span>
            </p>
          </div>
          <div className="border-b px-3 py-1.5 font-[500] text-[#444444] text-[13px] bg-white text-center">
            No real-time records found!
          </div>
        </>
      );
    } else {
      content = (
        <div className="overflow-y-auto">
          <div className="flex justify-between items-center w-full bg-[#e9eff8] border-b border-t border-[#C6D2D8]">
            <div className="lg:w-[50%] w-full sm:flex items-center lg:space-x-24 lg:justify-start justify-between">
              <div className="relative text-sm bg-[var(--primary)] w-[180px] font-bold text-white py-1.5 px-2 flex justify-start items-center space-x-1">
                {sportName === "Cricket" && <img src='/subHeader/menu-4.png' className="w-4 h-4" />}
                {sportName === "Soccer" && <img src='/subHeader/menu-1.png' className="w-4 h-4" />}
                {sportName === "Tennis" && <img src='/subHeader/menu-2.png' className="w-4 h-4" />}
                <p>{sportName}</p>
                <span className="absolute top-0 right-[-15px] w-0 h-0 border-t-[32px] border-t-[var(--primary)] border-r-[15px] border-r-transparent"></span>
              </div>
              <div className="flex justify-end items-center gap-2 pr-1">
                <div
                  onClick={() => setIsLive(!isLive)}
                  className={`rounded-xl text-xs font-[600] tracking-wide md:px-3 px-2.5 py-[3px] cursor-pointer transition-colors duration-300
                  ${isLive ? "bg-green-600 text-white" : "bg-transparent border border-[var(--primary)]  text-[var(--primary)]"}`}
                >
                  {isLive ? "- LIVE" : "+ LIVE"}
                </div>

                <div
                  onClick={() => setIsVirtual(!isVirtual)}
                  className={`rounded-xl text-xs font-[600] tracking-wide md:px-3 px-2.5 py-[3px] cursor-pointer transition-colors duration-300
                  ${isVirtual ? "bg-green-600 text-white" : "bg-transparent border border-[var(--primary)]  text-[var(--primary)]"}`}
                >
                  {isVirtual ? "- VIRTUAL" : "+ VIRTUAL"}
                </div>

                <div
                  onClick={() => setIsPremium(!isPremium)}
                  className={`rounded-xl text-xs font-[600] tracking-wide md:px-3 px-2.5 py-[3px] cursor-pointer transition-colors duration-300
                  ${isPremium ? "bg-green-600 text-white" : "bg-transparent border border-[var(--primary)]  text-[var(--primary)]"}`}
                >
                  {isPremium ? "- Premium" : "+ Premium"}
                </div>

              </div>
            </div>
            <div className="w-[50%] lg:grid hidden grid-cols-3 text-center text-sm font-bold">
              <span>1</span>
              <span>X</span>
              <span>2</span>
            </div>
          </div>

          {filteredMatches?.map((element, index) => {
            const isInplay = isInplayMatch(element);
            return (
              <div
                className="divide-y divide-[#C6D2D8] border-b border-[#C6D2D8] md:pb-0 pb-1.5"
                key={index}
              >
                <div className="lg:flex w-full">
                  <div className="lg:w-[50%] w-full flex justify-between items-center bg-white">
                    <div className="flex items-center justify-start w-full bg-white">
                      <a
                        href={`/sport-view/${element?.marketId}/${element?.eventId}/${element?.sportId}`}
                        className="flex items-center justify-start py-1 space-x-1 w-full"
                      >
                        <div className="flex flex-col uppercase w-full sm:w-[32%] px-2">
                          <span className="text-[11px] font-semibold text-gray-900 hover:underline truncate">
                            {element?.matchName}
                          </span>
                          <span className="text-[9px] font-[500] text-[#838383] truncate">
                            ({element?.seriesName ? element?.seriesName : "No Series"})
                          </span>
                        </div>

                        {isInplay && (
                          <span className="w-full sm:w-[15%] flex flex-col items-center justify-center text-[#03B37F] font-bold text-[13px] tracking-wide">
                            <p className="pt-2">LIVE</p>
                            <span className="block w-8 h-[2px] bg-[#03B37F] mt-[4px] animate-marquee-left-to-right"></span>
                          </span>
                        )}
                        <div className="bg-[#E9EFF8] w-full sm:w-[10%] text-[#FF0000] text-xs font-normal px-2 py-1 rounded-sm text-center leading-tight">
                          {element?.matchDate && (
                            <>
                              <div>{moment(element.matchDate, "DD-MM-YYYY HH:mm:ss A").format('DD MMM')}</div>
                              <div className="text-[10px]">
                                {moment(element.matchDate, "DD-MM-YYYY HH:mm:ss A").format('hh:mm A')}
                              </div>
                            </>
                          )}
                        </div>
                      </a>
                    </div>

                    <div className="flex items-center space-x-1.5 cursor-pointer pr-3">
                      {element?.isTv && <LiaDesktopSolid size={16} />}
                      {element?.isFancy && <img src='/dashbaord/f-icon.png' className="w-[12px] h-[12px]" />}
                      {element?.isBookmaker && (<span className="font-bold bg-[var(--primary)] flex justify-center items-center text-white rounded-full text-center w-[19px] h-[19px] text-[9px] pt-[3px]">BM</span>)}
                    </div>
                  </div>

                  <div className="lg:w-[50%] w-full grid grid-cols-6 ">
                    {Array?.from({ length: 6 }).map((_, i) => {
                      const isLagai = i % 2 === 0;
                      return (
                        <div
                          key={i}
                          className={`relative w-full h-full `}
                        >
                          <div className={`${isLagai ? "bg-[var(--matchLagai)]" : "bg-[var(--matchKhai)]"} p-1 flex border-[1px] border-white/40 flex-col justify-center items-center text-center w-full h-full text-sm font-semibold text-gray-900`}>
                            <p> {(Math.random() * 100).toFixed()}</p>
                            <p className="text-[10px] lg:block hidden text-gray-600">
                              {(Math.random() * 100).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      );
    }
  }

  return (
    <div className="h-full overflow-y-auto md:px-0 m-auto md:max-h-none md:overflow-auto">
      {content}
    </div>
  );
}

export default InplayMatches;
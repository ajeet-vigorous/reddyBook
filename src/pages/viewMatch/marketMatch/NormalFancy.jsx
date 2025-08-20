import React, { useEffect, useState } from 'react';
import BlinkingComponent from '../BlinkingComponent';
import PlaceBetMobile from '../../../component/betplaceMobile/PlaceBetMobile';
import { FaRegBookmark, FaBookmark } from "react-icons/fa";


const NormalFancyComponent = ({
  inplayMatch,
  activeTab,
  NormalFancy,
  fancyPositionObj,
  toggleRowVisibility,
  handleBackOpen,
  marketId,
  returnDataFancyObject,
  formatNumber,
  betplaceSection,
  isMatchCoin,
  marketType,
}) => {
  const {
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
    handleButtonValues,
  } = betplaceSection;

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    setIsBookmarked(bookmarks.includes(marketType));
  }, [marketType]);

  const toggleBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    let updatedBookmarks;

    if (isBookmarked) {
      updatedBookmarks = bookmarks.filter(item => item !== marketType);
    } else {
      updatedBookmarks = [...bookmarks, marketType];
    }

    localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
    setIsBookmarked(!isBookmarked);
    showTempNotification();
  };

  // Show temporary notification
  const showTempNotification = () => {
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
  };


  return (
    inplayMatch?.isFancy && (activeTab === "fancy" || activeTab === "all") && (
      <div>
        {showNotification && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50 animate-fade-in-out">
            {isBookmarked ? 'Added to bookmarks!' : 'Removed from bookmarks!'}
          </div>
        )}

        {NormalFancy && NormalFancy?.length > 0 ? (
          <>
            {NormalFancy?.filter((commList) => commList.com_perm == "YES").length > 0 && (
              <>
                <header className="mt-1">
                  <div className="bg-slate-300 items-center flex justify-between relative z-0 ">
                    <div className="flex text-white align-items-center h-100 uppercase text-[14px] font-semibold bg-slate-300">
                      <span className="
              h-10 inline-flex items-center px-[10px] mr-[10px] relative 
              text-white text-[13px] font-semibold uppercase bg-[var(--primary)] 
              leading-none mobile:text-[11px] mobile:px-[5px] 
              before:content-[''] before:absolute before:right-[-17px] before:top-0 
              before:w-[18px] before:h-full 
              before:bg-[linear-gradient(180deg,var(--primary)_0,var(--primary))] 
              before:[clip-path:polygon(0_-1px,100%_-1px,1px_100%,0_100%)]
            ">
                        Normal
                      </span>
                    </div>
                  </div>
                </header>

                <div className="grid xl:grid-cols-1 grid-cols-1">
                  <div className={`border-b border-gray-200 bg-white relative flex decoration-none whitespace-normal max-w-full`}>
                    <div className="xl:w-[70%] bg-white w-[65%] flex px-2">
                      <div className="w-full leading-3 flex items-center">
                        <span className="lg:hidden flex z-20 pr-1">
                          <span className="text-black flex items-center justify-center"></span>
                        </span>
                        <span className="text-xs truncate">
                          <span className="text-sm truncate"></span>
                          <br />
                          <p></p>
                        </span>
                      </div>
                    </div>
                    <div className="xl:w-[30%] w-[35%] grid grid-cols-2 xl:grid-cols-4">
                      <span className="lg:block hidden bg-white">
                        <div className={`py-1.5 flex justify-center items-center bg-white`}>
                          <div className='text-center leading-3'>
                            <span className="text-xs uppercase text-gray-800 font-bold">No</span>
                          </div>
                        </div>
                      </span>
                      <span className="lg:hidden block">
                        <div className={`py-1.5 flex justify-center items-center bg-white`}>
                          <div className='text-center leading-3'>
                            <span className="text-xs uppercase text-gray-800 font-bold">No</span>
                          </div>
                        </div>
                      </span>
                      <span className="lg:block hidden bg-white">
                        <div className={`py-1.5 flex justify-center items-center bg-white`}>
                          <div className='text-center leading-3'>
                            <span className="text-xs uppercase text-gray-800 font-bold">Yes</span>
                          </div>
                        </div>
                      </span>
                      <span className="lg:hidden block">
                        <div className={`py-1.5 flex justify-center items-center bg-white`}>
                          <div className='text-center leading-3'>
                            <span className="text-xs uppercase text-gray-800 font-bold">yes</span>
                          </div>
                        </div>
                      </span>
                      <span className="xl:flex items-center bg-white text-end px-1 w-full justify-end hidden text-cyan-500 text-[9px] 2xl:text-[13px] overflow-hidden"></span>
                    </div>
                  </div>
                </div>

                <div className="grid xl:grid-cols- grid-cols-1">
                  {NormalFancy?.filter((commList) => commList.com_perm == "YES")
                    .sort((a, b) => {
                      const order = {
                        STRING: 100,
                        ONLY: 1,
                        OVER: 2,
                        "FALL OF": 3,
                        RUN: 4,
                        PSHIP: 5,
                        BOUNDARIES: 6,
                        HOW: 7,
                        BALLS: 8,
                      };

                      const getSessionType = (sessionName) => {
                        if (sessionName.includes("ONLY")) return "ONLY";
                        if (sessionName.includes("OVER")) return "OVER";
                        if (sessionName.includes("FALL OF")) return "FALL OF";
                        if (sessionName.includes("RUN")) return "RUN";
                        if (sessionName.includes("BOUNDARIES")) return "BOUNDARIES";
                        if (sessionName.includes("HOW")) return "HOW";
                        if (sessionName.includes("BALLS")) return "BALLS";
                        return "STRING";
                      };

                      const typeA = getSessionType(a.session_name);
                      const typeB = getSessionType(b.session_name);

                      let orderComparison = order[typeA] - order[typeB];

                      if (typeA === "OVER" && typeB === "OVER") {
                        const numberA = parseInt(a.session_name.split(" ")[0]) || 0;
                        const numberB = parseInt(b.session_name.split(" ")[0]) || 0;
                        return numberA - numberB;
                      }

                      return orderComparison;
                    })
                    .map((commList, index) => (
                      <div key={index}>
                        <div className={`border-b bg-white border-gray-200 relative flex decoration-none whitespace-normal max-w-full`}>
                          <div className="xl:w-[70%] w-[65%] flex px-2">
                            <div className="w-full leading-3 flex items-center space-x-1">
                              <span className="lg:hidden flex z-20 pr-1">
                                <span
                                  onClick={() => handleFancyPositionModal({ positionData: commList })}
                                  className="text-black flex items-center justify-center cursor-pointer"
                                ></span>
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // toggleBookmark();
                                }}
                                className="ml-2 focus:outline-none"
                                aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
                              >
                                {isBookmarked ? (
                                  <FaBookmark size={12} className='text-[var(--primary)]' />
                                ) : (
                                  <FaRegBookmark size={12} className='text-[var(--primary)]' />
                                )}
                              </button>
                              <span className="text-xs truncate">
                                <span className="text-[13px] truncate text-[#333333]">
                                  {commList.session_name}
                                </span>
                                <br />
                                <p
                                  key={index}
                                  className={
                                    isNaN(parseFloat(fancyPositionObj[commList?.session_id]))
                                      ? "text-[var(--success-color)]"
                                      : parseFloat(fancyPositionObj[commList?.session_id]) > 0
                                        ? "text-[var(--success-color)]"
                                        : parseFloat(fancyPositionObj[commList?.session_id]) < 0
                                          ? "text-red-500"
                                          : "text-[var(--success-color)]"
                                  }
                                >
                                  {fancyPositionObj[commList?.session_id]
                                    ? (Math.floor(Number(fancyPositionObj[commList?.session_id]) * 100) / 100).toFixed(2)
                                    : ''}
                                </p>
                              </span>
                            </div>
                          </div>
                          <div className="xl:w-[30%] w-[35%] grid grid-cols-2 xl:grid-cols-4">
                            <span
                              className="lg:block hidden cursor-pointer"
                              onClick={() => {
                                toggleRowVisibility(commList.session_id);
                                handleBackOpen({
                                  data: commList,
                                  type: "No",
                                  odds: commList.oddsNo,
                                  name: commList.session_name,
                                  nameSession: commList.session_name,
                                  betFor: "fancy",
                                  oddsType: "fancy",
                                  betType: "N",
                                  run: commList.runsNo,
                                  selectionId: commList.session_id,
                                  price: commList.runsNo,
                                  size: commList.oddsNo,
                                  position: returnDataFancyObject,
                                });
                              }}
                            >
                              <BlinkingComponent
                                price={commList.runsNo}
                                size={(commList.oddsNo * 100).toFixed(2).replace(/\.00$/, "")}
                                color={"bg-[#FEAFB2]"}
                                blinkColor={"bg-[#FE7A7F]"}
                                textColors={"text-black"}
                                boderColors={"border-[#f996ab]"}
                              />
                            </span>
                            <span
                              className="lg:hidden block cursor-pointer"
                              onClick={() => {
                                toggleRowVisibility(commList.session_id);
                                handleBackOpen({
                                  data: commList,
                                  type: "No",
                                  odds: commList.oddsNo,
                                  name: commList.session_name,
                                  nameSession: commList.session_name,
                                  betFor: "fancy",
                                  oddsType: "fancy",
                                  betType: "N",
                                  run: commList.runsNo,
                                  selectionId: commList.session_id,
                                  price: commList.runsNo,
                                  size: commList.oddsNo,
                                  position: returnDataFancyObject,
                                });
                              }}
                            >
                              <BlinkingComponent
                                price={commList.runsNo}
                                size={(commList.oddsNo * 100).toFixed(2).replace(/\.00$/, "")}
                                color={"bg-[#FEAFB2]"}
                                blinkColor={"bg-[#FE7A7F]"}
                                textColors={"text-black"}
                                boderColors={"border-[#f996ab]"}
                              />
                            </span>
                            <span
                              className="lg:block hidden cursor-pointer"
                              onClick={() => {
                                toggleRowVisibility(commList.session_id);
                                handleBackOpen({
                                  data: commList,
                                  type: "Yes",
                                  odds: commList.oddsYes,
                                  name: commList.session_name,
                                  nameSession: commList.session_name,
                                  betFor: "fancy",
                                  oddsType: "fancy",
                                  betType: "Y",
                                  run: commList.runsYes,
                                  selectionId: commList.session_id,
                                  betfairMarketId: marketId,
                                  price: commList.runsYes,
                                  size: commList.oddsYes,
                                  position: returnDataFancyObject,
                                });
                              }}
                            >
                              <BlinkingComponent
                                price={commList.runsYes}
                                size={(commList.oddsYes * 100).toFixed(2).replace(/\.00$/, "")}
                                color={"bg-[#8DD2F0]"}
                                blinkColor={"bg-[#00B2FF]"}
                                textColors={"text-black"}
                                boderColors={"border-[#489bbd]"}
                              />
                            </span>
                            <span
                              className="cursor-pointer lg:hidden block"
                              onClick={() => {
                                toggleRowVisibility(commList.session_id);
                                handleBackOpen({
                                  data: commList,
                                  type: "Yes",
                                  odds: commList.oddsYes,
                                  name: commList.session_name,
                                  nameSession: commList.session_name,
                                  betFor: "fancy",
                                  oddsType: "fancy",
                                  betType: "Y",
                                  run: commList.runsYes,
                                  selectionId: commList.session_id,
                                  betfairMarketId: marketId,
                                  price: commList.runsYes,
                                  size: commList.oddsYes,
                                  position: returnDataFancyObject,
                                });
                              }}
                            >
                              <BlinkingComponent
                                price={commList.runsYes}
                                size={(commList.oddsYes * 100).toFixed(2).replace(/\.00$/, "")}
                                color={"bg-[#8DD2F0]"}
                                blinkColor={"bg-[#00B2FF]"}
                                textColors={"text-black"}
                                boderColors={"border-[#489bbd]"}
                              />
                            </span>
                            <span className="col-span-2 xl:flex items-center bg-white text-end px-2 w-full justify-end hidden  text-[#000000]/75 font-[400] text-[12px] overflow-hidden ">
                              Min:100
                              <br />
                              Max:{formatNumber(commList?.max)}
                            </span>

                            {commList && commList.running_status &&
                              (commList.running_status === "SUSPENDED" ||
                                commList.running_status === "CLOSE" ||
                                commList.running_status === "Ball Running") ? (
                              <div className={`xl:w-[42%] lg:w-1/2 w-[35%] px-0.5 right-0 h-full absolute bg-white/80 border-l-red-500 border-[0.5px] border-r-red-500 flex justify-center items-center `}>
                                <div className="2xl:px-14 lg:px-14 py-2 px-2 text-nowrap rounded font-bold bg-transparent opacity-90">
                                  <span className="text-[#FF071B] xl:text-[16px] text-sm font-bold uppercase">
                                    {commList.running_status}
                                  </span>
                                </div>
                              </div>
                            ) : null}
                          </div>


                        </div>
                        {commList?.remark &&
                          <div className="px-1 text-[#097c93] text-left text-[11px] w-full">{commList?.remark}</div>
                        }
                        {betSlipData?.oddsType === "fancy" &&
                          commList?.Selection_id ===
                          betSlipData?.selectionId && (
                            <PlaceBetMobile
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
                              handleClose={handleBackclose}
                              setBetSlipData={setBetSlipData}
                              handleButtonValues={handleButtonValues}
                              isMatchCoin={isMatchCoin}
                            />
                          )}
                      </div>
                    ))}
                </div>
              </>
            )}
          </>
        ) : null}
      </div>
    )
  );
};

export default NormalFancyComponent;
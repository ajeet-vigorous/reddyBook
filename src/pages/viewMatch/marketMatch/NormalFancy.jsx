import React from 'react';
import BlinkingComponent from '../BlinkingComponent';


const NormalFancyComponent = ({
  inplayMatch,
  activeTab,
  NormalFancy,
  fancyPositionObj,
  toggleRowVisibility,
  handleBackOpen,
  marketId,
  returnDataFancyObject,
  formatNumber
}) => {
  return (
    inplayMatch?.isFancy && (activeTab === "fancy" || activeTab === "all") && (
      <div>
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

                <div className="grid xl:grid-cols-2 grid-cols-1">
                  <div className={`xl:flex hidden relative decoration-none border-b border-gray-300 whitespace-normal max-w-full`}>
                    <div className="xl:w-[58%] w-[65%] flex px-2">
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
                    <div className="xl:w-[42%] w-[35%] grid grid-cols-2 xl:grid-cols-3">
                      <span className="lg:block hidden bg-[#FEAFB2]">
                        <div className={`py-1 flex justify-center items-center bg-[#FEAFB2]`}>
                          <div className='text-center leading-3'>
                            <span className="text-xs uppercase text-gray-800 font-bold">No</span>
                          </div>
                        </div>
                      </span>
                      <span className="lg:hidden block">
                        <div className={`py-1 flex justify-center items-center bg-[#FEAFB2]`}>
                          <div className='text-center leading-3'>
                            <span className="text-xs uppercase text-gray-800 font-bold">No</span>
                          </div>
                        </div>
                      </span>
                      <span className="lg:block hidden bg-[#8DD2F0]">
                        <div className={`py-1 flex justify-center items-center bg-[#8DD2F0]`}>
                          <div className='text-center leading-3'>
                            <span className="text-xs uppercase text-gray-800 font-bold">Back</span>
                          </div>
                        </div>
                      </span>
                      <span className="lg:hidden block">
                        <div className={`py-1 flex justify-center items-center bg-[#8DD2F0]`}>
                          <div className='text-center leading-3'>
                            <span className="text-xs uppercase text-gray-800 font-bold">Back</span>
                          </div>
                        </div>
                      </span>
                      <span className="xl:flex items-center text-end px-1 w-full justify-end hidden z-20 text-cyan-500 text-[9px] 2xl:text-[13px] overflow-hidden"></span>
                    </div>
                  </div>
                  <div className={`border-b border-gray-300 relative flex decoration-none whitespace-normal max-w-full`}>
                    <div className="xl:w-[58%] w-[65%] flex px-2">
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
                    <div className="xl:w-[42%] w-[35%] grid grid-cols-2 xl:grid-cols-3">
                      <span className="lg:block hidden bg-[#FEAFB2]">
                        <div className={`py-1.5 flex justify-center items-center bg-[#FEAFB2]`}>
                          <div className='text-center leading-3'>
                            <span className="text-xs uppercase text-gray-800 font-bold">No</span>
                          </div>
                        </div>
                      </span>
                      <span className="lg:hidden block">
                        <div className={`py-1.5 flex justify-center items-center bg-[#FEAFB2]`}>
                          <div className='text-center leading-3'>
                            <span className="text-xs uppercase text-gray-800 font-bold">No</span>
                          </div>
                        </div>
                      </span>
                      <span className="lg:block hidden bg-[#8DD2F0]">
                        <div className={`py-1.5 flex justify-center items-center bg-[#8DD2F0]`}>
                          <div className='text-center leading-3'>
                            <span className="text-xs uppercase text-gray-800 font-bold">Back</span>
                          </div>
                        </div>
                      </span>
                      <span className="lg:hidden block">
                        <div className={`py-1.5 flex justify-center items-center bg-[#8DD2F0]`}>
                          <div className='text-center leading-3'>
                            <span className="text-xs uppercase text-gray-800 font-bold">Back</span>
                          </div>
                        </div>
                      </span>
                      <span className="xl:flex items-center text-end px-1 w-full justify-end hidden z-20 text-cyan-500 text-[9px] 2xl:text-[13px] overflow-hidden"></span>
                    </div>
                  </div>
                </div>

                <div className="grid xl:grid-cols-2 grid-cols-1">
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
                        <div className={`border-b border-gray-300 relative flex decoration-none whitespace-normal max-w-full`}>
                          <div className="xl:w-[58%] w-[65%] flex px-2">
                            <div className="w-full leading-3 flex items-center">
                              <span className="lg:hidden flex z-20 pr-1">
                                <span
                                  onClick={() => handleFancyPositionModal({ positionData: commList })}
                                  className="text-black flex items-center justify-center cursor-pointer"
                                ></span>
                              </span>
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
                          <div className="xl:w-[42%] w-[35%] grid grid-cols-2 xl:grid-cols-3">
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
                            <span className="xl:flex items-center text-end px-2 w-full justify-end hidden z-20 text-[#097C93] font-bold text-[9px] xl:text-[11px] 2xl:text-[13px] overflow-hidden bg-gray-200">
                              Min:100
                              <br />
                              Max:{formatNumber(commList?.max)}
                            </span>

                            {commList && commList.running_status &&
                              (commList.running_status === "SUSPENDED" ||
                                commList.running_status === "CLOSE" ||
                                commList.running_status === "Ball Running") ? (
                              <div className={`xl:w-[42%] lg:w-1/2 w-[35%] px-0.5 right-0 h-full absolute bg-[var(--suspended-color)] flex justify-center items-center z-30`}>
                                <div className="2xl:px-14 lg:px-14 py-2 px-2 text-nowrap rounded font-bold bg-transparent opacity-90">
                                  <span className="text-[#FF071B] xl:text-lg text-sm font-bold uppercase">
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
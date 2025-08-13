import React from 'react';
import BlinkingComponent from '../BlinkingComponent';

const OverByOverFancyComponent = ({
  inplayMatch,
  activeTab,
  OverByOverFancy,
  fancyPositionObj,
  toggleRowVisibility,
  handleBackOpen,
  marketId,
  returnDataFancyObject,
  formatNumber,
  handleFancyPositionModal
}) => {
  return (
    inplayMatch?.isFancy && (activeTab === "fancy" || activeTab === "all") && (
      <div>
        {OverByOverFancy && OverByOverFancy?.length > 0 ? (
          <>
            <header className="mt-1">
              <div className="bg-[var(--secondary)] items-center flex justify-between relative z-0 py-1 px-2">
                <div className="flex text-white align-items-center h-100 uppercase text-[14px] font-semibold">
                  Over By Over
                </div>
              </div>
            </header>

            <div className="grid xl:grid-cols-2 grid-cols-1">
              <div className="xl:flex hidden relative decoration-none border-b border-gray-300 whitespace-normal max-w-full">
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
                    <div className="py-1 flex justify-center items-center bg-[#FEAFB2]">
                      <div className="text-center leading-3">
                        <span className="2xl:text-[16px] lg:text-[16px] text-xs text-gray-800 font-bold">No</span>
                      </div>
                    </div>
                  </span>
                  <span className="lg:hidden block">
                    <div className="py-1 flex justify-center items-center bg-[#FEAFB2]">
                      <div className="text-center leading-3">
                        <span className="2xl:text-[16px] lg:text-[16px] text-xs text-gray-800 font-bold">No</span>
                      </div>
                    </div>
                  </span>
                  <span className="lg:block hidden bg-[#8DD2F0]">
                    <div className="py-1 flex justify-center items-center bg-[#8DD2F0]">
                      <div className="text-center leading-3">
                        <span className="2xl:text-[16px] lg:text-[16px] text-xs text-gray-800 font-bold">Back</span>
                      </div>
                    </div>
                  </span>
                  <span className="lg:hidden block">
                    <div className="py-1 flex justify-center items-center bg-[#8DD2F0]">
                      <div className="text-center leading-3">
                        <span className="2xl:text-[16px] lg:text-[16px] text-xs text-gray-800 font-bold">Back</span>
                      </div>
                    </div>
                  </span>
                  <span className="xl:flex items-center text-end px-1 w-full justify-end hidden z-20 text-cyan-500 text-[9px] 2xl:text-[13px] overflow-hidden"></span>
                </div>
              </div>
              <div className="border-b border-gray-300 relative flex decoration-none whitespace-normal max-w-full">
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
                    <div className="py-1 flex justify-center items-center bg-[#FEAFB2]">
                      <div className="text-center leading-3">
                        <span className="2xl:text-[16px] lg:text-[16px] text-xs text-gray-800 font-bold">No</span>
                      </div>
                    </div>
                  </span>
                  <span className="lg:hidden block">
                    <div className="py-1 flex justify-center items-center bg-[#FEAFB2]">
                      <div className="text-center leading-3">
                        <span className="2xl:text-[16px] lg:text-[16px] text-xs text-gray-800 font-bold">No</span>
                      </div>
                    </div>
                  </span>
                  <span className="lg:block hidden bg-[#8DD2F0]">
                    <div className="py-1 flex justify-center items-center bg-[#8DD2F0]">
                      <div className="text-center leading-3">
                        <span className="2xl:text-[16px] lg:text-[16px] text-xs text-gray-800 font-bold">Back</span>
                      </div>
                    </div>
                  </span>
                  <span className="lg:hidden block">
                    <div className="py-1 flex justify-center items-center bg-[#8DD2F0]">
                      <div className="text-center leading-3">
                        <span className="2xl:text-[16px] lg:text-[16px] text-xs text-gray-800 font-bold">Back</span>
                      </div>
                    </div>
                  </span>
                  <span className="xl:flex items-center text-end px-1 w-full justify-end hidden z-20 text-cyan-500 text-[9px] 2xl:text-[13px] overflow-hidden"></span>
                </div>
              </div>
            </div>

            <div className="grid xl:grid-cols-2 grid-cols-1">
              {OverByOverFancy?.map((commList, index) => (
                <div key={index}>
                  <div className="border-b border-gray-300 relative flex decoration-none whitespace-normal max-w-full">
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
                        <div className="xl:w-[42%] lg:w-1/2 w-[35%] px-0.5 right-0 h-full absolute bg-[var(--suspended-color)] flex justify-center items-center z-30">
                          <div className="2xl:px-14 lg:px-14 py-2 px-2 text-nowrap rounded font-bold bg-transparent opacity-90">
                            <span className="text-red-500 xl:text-lg text-sm font-bold uppercase">
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
        ) : null}
      </div>
    )
  );
};

export default OverByOverFancyComponent;
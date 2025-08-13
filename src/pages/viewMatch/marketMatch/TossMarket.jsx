import React from 'react';
import BlinkingComponent from '../BlinkingComponent';
import CashOutSystem from '../CashoutTesting';

const TossDataComponent = ({
  inplayMatch,
  activeTab,
  matchScoreDetails,
  isTossCoin,
  positionObj,
  toggleRowVisibility,
  handleBackOpen,
  marketId,
  returnDataObject,
  formatNumber
}) => {
  return (
    inplayMatch?.isToss && (activeTab === "other" || activeTab === "all") ? (
      <>
        <div>
          {matchScoreDetails &&
            matchScoreDetails.toss_data &&
            matchScoreDetails.toss_data.length > 0 ? (
            <>
              <header className="mt-1">
                <div className="bg-[var(--secondary)] items-center flex justify-between relative z-0 py-1 px-2">
                  <div className="flex text-white align-items-center h-100 uppercase text-[14px] font-semibold">
                    toss_data
                  </div>
                 <div >
                  <CashOutSystem
                    marketList={matchScoreDetails?.toss_data}
                    positionObj={positionObj}
                    handleBackOpen={handleBackOpen}
                    toggleRowVisibility={toggleRowVisibility}
                    marketId={marketId}
                    betFor={"toss"}
                    oddsType={"toss"}
                  />
                </div>
                </div>
              </header>
              
              <div className="flex whitespace-normal max-w-full border-b border-gray-300">
                <div className="lg:w-1/2 xl:w-[58%] w-[65%] flex px-2">
                  <div className="w-full py-1 leading-3 flex items-center text-xs text-[#097c93]">
                    <span className="text-[12px] font-bold">
                      Max: {formatNumber(isTossCoin?.max)}
                    </span>
                  </div>
                </div>
                <div className="lg:w-1/2 xl:w-[42%] w-[35%] grid grid-cols-6">
                  <span className="lg:col-span-1 col-span-2 rounded-md lg:block hidden"></span>
                  <span className="lg:col-span-1 col-span-2 rounded-md lg:block hidden"></span>
                  <span className="lg:col-span-1 col-span-3 rounded-md">
                    <div className="py-1 flex justify-center items-center bg-[#8DD2F0]">
                      <div className="text-center leading-3">
                        <span className="2xl:text-[16px] lg:text-[16px] text-xs text-gray-800 font-bold">Back</span>
                      </div>
                    </div>
                  </span>
                  <span className="lg:col-span-1 col-span-3 rounded-md">
                    <div className="py-1 flex justify-center items-center bg-[#FEAFB2]">
                      <div className="text-center leading-3">
                        <span className="2xl:text-[16px] lg:text-[16px] text-xs text-gray-800 font-bold">Lay</span>
                      </div>
                    </div>
                  </span>
                  <span className="lg:col-span-1 col-span-2 rounded-md lg:block hidden"></span>
                  <span className="lg:col-span-1 col-span-2 rounded-md lg:block hidden"></span>
                </div>
              </div>

              <>
                {matchScoreDetails &&
                  matchScoreDetails.toss_data &&
                  matchScoreDetails.toss_data.length > 0
                  ? matchScoreDetails.toss_data.map((commList, index) => (
                      <div
                        key={index}
                        className="relative border-b border-gray-300 flex decoration-none whitespace-normal max-w-full"
                      >
                        <div className="lg:w-1/2 xl:w-[58%] w-[65%] flex px-2">
                          <div className="w-full leading-3 flex items-center">
                            <span className="text-[13px] font-bold text-[#333333]">
                              <span>{commList.team_name}</span>
                              <br />
                              <span
                                key={index}
                                className={
                                  positionObj[commList?.selectionId] > 0
                                    ? "text-[var(--success-color)]"
                                    : positionObj[commList?.selectionId] < 0
                                      ? "text-red-500"
                                      : "text-[var(--success-color)]"
                                }
                              >
                                {positionObj[commList?.selectionId]
                                  ? (Math.floor(Number(positionObj[commList?.selectionId]) * 100) / 100).toFixed(2)
                                  : ''}
                              </span>
                            </span>
                          </div>
                        </div>

                        <div className="lg:w-1/2 xl:w-[42%] w-[35%] grid grid-cols-6">
                          <span className="lg:block hidden">
                            <BlinkingComponent
                              price={0}
                              size={0}
                              color={"bg-[#E9F6FC]"}
                              blinkColor={"bg-[#CDEBEB]"}
                              textColors={"text-black"}
                              boderColors={"border-black"}
                            />
                          </span>
                          <span className="lg:block hidden">
                            <BlinkingComponent
                              price={0}
                              size={0}
                              color={"bg-[#E9F6FC]"}
                              blinkColor={"bg-[#CDEBEB]"}
                              textColors={"text-black"}
                              boderColors={"border-black"}
                            />
                          </span>
                          <span
                            className="md:col-span-1 sm:col-span-2 col-span-3 md:col-start-3 lg:block hidden cursor-pointer"
                            onClick={() =>
                              handleBackOpen({
                                data: commList,
                                type: "Yes",
                                odds: commList.lgaai,
                                name: commList.team_name,
                                betFor: "toss",
                                oddsType: "toss",
                                betType: "L",
                                selectionId: commList.selectionid,
                                betfairMarketId: marketId,
                                price: commList.khaai * 100,
                                size: "100",
                                position: returnDataObject,
                                newPosition: returnDataObject,
                                nameOther: matchScoreDetails.toss_data,
                              })
                            }
                          >
                            <BlinkingComponent
                              price={parseFloat(commList.lgaai * 100).toFixed(2).replace(/\.?0+$/, "")}
                              size={100}
                              color={"bg-[#8DD2F0]"}
                              blinkColor={"bg-[#00B2FF]"}
                              textColors={"text-black"}
                              boderColors={"border-[#489bbd]"}
                            />
                          </span>

                          <span
                            className="col-span-3 lg:hidden block cursor-pointer"
                            onClick={() => {
                              toggleRowVisibility(commList.selectionid);
                              handleBackOpen({
                                data: commList,
                                type: "Yes",
                                odds: commList.lgaai,
                                name: commList.team_name,
                                betFor: "toss",
                                oddsType: "toss",
                                betType: "L",
                                selectionId: commList.selectionid,
                                betfairMarketId: marketId,
                                price: commList.khaai * 100,
                                size: "100",
                                position: returnDataObject,
                                newPosition: returnDataObject,
                                nameOther: matchScoreDetails.toss_data,
                              });
                            }}
                          >
                            <BlinkingComponent
                              price={parseFloat(commList.lgaai * 100).toFixed(2).replace(/\.?0+$/, "")}
                              size={100}
                              color={"bg-[#8DD2F0]"}
                              blinkColor={"bg-[#00B2FF]"}
                              textColors={"text-black"}
                              boderColors={"border-[#489bbd]"}
                            />
                          </span>
                          <span
                            className="md:col-span-1 sm:col-span-2 col-span-3 md:col-start-4 lg:block hidden cursor-pointer"
                            onClick={() =>
                              handleBackOpen({
                                data: commList,
                                type: "No",
                                odds: commList.khaai,
                                name: commList.team_name,
                                betFor: "toss",
                                oddsType: "toss",
                                betType: "K",
                                selectionId: commList.selectionid,
                                betfairMarketId: marketId,
                                price: commList.lgaai * 100,
                                size: "100",
                                position: returnDataObject,
                                newPosition: returnDataObject,
                                nameOther: matchScoreDetails.toss_data,
                              })
                            }
                          >
                            <BlinkingComponent
                              price={parseFloat(commList.khaai * 100).toFixed(2).replace(/\.?0+$/, "")}
                              size={100}
                              color={"bg-[#FEAFB2]"}
                              blinkColor={"bg-[#FE7A7F]"}
                              textColors={"text-black"}
                              boderColors={"border-[#f996ab]"}
                            />
                          </span>

                          <span
                            className="col-span-3 lg:hidden block cursor-pointer"
                            onClick={() => {
                              toggleRowVisibility(commList.selectionid);
                              handleBackOpen({
                                data: commList,
                                type: "No",
                                odds: commList.khaai,
                                name: commList.team_name,
                                betFor: "toss",
                                oddsType: "toss",
                                betType: "K",
                                selectionId: commList.selectionid,
                                betfairMarketId: marketId,
                                price: commList.lgaai * 100,
                                size: "100",
                                position: returnDataObject,
                                newPosition: returnDataObject,
                                nameOther: matchScoreDetails.toss_data,
                              });
                            }}
                          >
                            <BlinkingComponent
                              price={parseFloat(commList.khaai * 100).toFixed(2).replace(/\.?0+$/, "")}
                              size={100}
                              color={"bg-[#FEAFB2]"}
                              blinkColor={"bg-[#FE7A7F]"}
                              textColors={"text-black"}
                              boderColors={"border-[#f996ab]"}
                            />
                          </span>
                          <span className="lg:block hidden">
                            <BlinkingComponent
                              price={0}
                              size={0}
                              color={"bg-[#E9F6FC]"}
                              blinkColor={"bg-[#CDEBEB]"}
                              textColors={"text-black"}
                              boderColors={"border-black"}
                            />
                          </span>
                          <span className="lg:block hidden">
                            <BlinkingComponent
                              price={0}
                              size={0}
                              color={"bg-[#E9F6FC]"}
                              blinkColor={"bg-[#CDEBEB]"}
                              textColors={"text-black"}
                              boderColors={"border-black"}
                            />
                          </span>
                        </div>

                        {commList.lgaai === "0.00" || commList.lgaai === "0.000" ? (
                          <div className="xl:w-[42%] lg:w-1/2 w-[35%] px-0.5 right-0 h-full absolute bg-[var(--suspended-color)] flex justify-center items-center z-30">
                            <div className="2xl:px-14 lg:px-14 py-2 px-2 text-nowrap rounded font-bold bg-transparent opacity-90">
                              <span className="text-[#FF071B] xl:text-lg text-sm font-bold uppercase">
                                SUSPENDED
                              </span>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    ))
                  : null}
              </>
            </>
          ) : null}
        </div>
      </>
    ) : null
  );
};

export default TossDataComponent;
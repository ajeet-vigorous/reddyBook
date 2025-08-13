import React from 'react';
import BlinkingComponent from '../BlinkingComponent';
import CashOutSystem from '../CashoutTesting';
import MatchDetailsHeaderSection from '../../../component/matchDetailsHeaderSection/MatchDetailsHeaderSection';

const TiedOddsComponent = ({
  inplayMatch,
  activeTab,
  finalSocket,
  isMatchCoin,
  positionObj,
  returnDataObject,
  toggleRowVisibility,
  handleBackOpen,
  formatNumber
}) => {

  console.log("finalSocket", finalSocket);

  if (!inplayMatch?.isTieOdds && (activeTab === "all" || activeTab === "other")) {
    return null;
  }

  return (
    <>
      {Object.values(finalSocket)?.map((element, index) =>
        element.marketType === "Match Odds" && (
          element && element.runners && element.runners.length <= 2 ?
            <>
              {Object.values(finalSocket)?.map((element, index) =>
                element.marketType === "Tied Match" && (
                  <div className="bg-white" key={index}>
                     <MatchDetailsHeaderSection marketType={"Tied_Match"} minMax={{ min: 100, max: formatNumber(isMatchCoin?.max) }}> 
                    <div className="flex whitespace-normal max-w-full border-b border-gray-300">
                      <div className="lg:w-1/2 xl:w-[58%] w-[65%] flex px-2">
                        
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
                    {element?.runners?.length > 0 && element.runners.map((elementtemp, index) => (
                      <div className="flex whitespace-normal max-w-full border-b border-gray-300" key={index}>
                        <div className="lg:w-1/2 xl:w-[58%] w-[65%] flex px-2">
                          <div className="w-full py-1 leading-3 flex items-center text-[#333333]">
                            <span className="text-[13px] font-bold">
                              <span>
                                {elementtemp.selectionName} <br />
                                <div
                                  key={index}
                                  className={
                                    positionObj[elementtemp.selectionId] > 0
                                      ? 'text-[var(--success-color)] !mt-2'
                                      : positionObj[elementtemp.selectionId] < 0
                                        ? 'text-red-500 !mt-2'
                                        : 'black'
                                  }
                                >
                                  {positionObj[elementtemp.selectionId]
                                    ? (Math.floor(Number(positionObj[elementtemp.selectionId]) * 100) / 100).toFixed(2)
                                    : ''}
                                </div>
                              </span>
                            </span>
                          </div>
                        </div>

                        <div className="lg:w-1/2 xl:w-[42%] w-[35%] grid grid-cols-6">
                          {/* Available to Back (non-clickable) */}
                          {elementtemp?.ex?.availableToBack?.length > 0 &&
                            elementtemp.ex.availableToBack.slice(1).map((tempData, index) => (
                              <span key={index} className="lg:col-span-1 col-span-3 rounded-md lg:block hidden">
                                <BlinkingComponent
                                  price={tempData.price}
                                  size={tempData.size}
                                  color={"bg-[#E6F2FC]"}
                                  blinkColor={"bg-[#00B2FF]"}
                                  hoverColor={"bg-sky-600"}
                                />
                              </span>
                            ))
                          }

                          {/* First Available to Back (clickable) */}
                          {elementtemp?.ex?.availableToBack?.length > 0 &&
                            elementtemp.ex.availableToBack.slice(0, 1).map((tempData, index) => (
                              <React.Fragment key={index}>
                                <span
                                  className="md:col-span-3 sm:col-span-3 rounded-md col-span-3 lg:hidden block cursor-pointer"
                                  onClick={() => {
                                    handleBackOpen({
                                      data: tempData,
                                      type: "Yes",
                                      odds: tempData.price,
                                      name: elementtemp.selectionName,
                                      nameOther: element.runners,
                                      betFor: "tiedMatch",
                                      oddsType: element.marketType,
                                      betType: "L",
                                      selectionId: elementtemp.selectionId,
                                      teamData: tempData.price,
                                      betfairMarketId: element.marketId,
                                      price: elementtemp.ex.availableToLay[0].price,
                                      size: elementtemp.ex.availableToLay[0].size,
                                      position: returnDataObject,
                                      newPosition: returnDataObject
                                    });
                                  }}
                                >
                                  <BlinkingComponent
                                    price={tempData.price}
                                    size={tempData.size}
                                    color={"bg-[#8DD2F0]"}
                                    blinkColor={"bg-[#00B2FF]"}
                                  />
                                </span>

                                <span
                                  className="lg:col-span-1 col-span-3 rounded-md lg:block hidden cursor-pointer"
                                  onClick={() => {
                                    handleBackOpen({
                                      data: tempData,
                                      type: "Yes",
                                      odds: tempData.price,
                                      name: elementtemp.selectionName,
                                      nameOther: element.runners,
                                      betFor: "tiedMatch",
                                      oddsType: element.marketType,
                                      betType: "L",
                                      selectionId: elementtemp.selectionId,
                                      teamData: tempData.price,
                                      betfairMarketId: element.marketId,
                                      price: elementtemp.ex.availableToLay[0].price,
                                      size: elementtemp.ex.availableToLay[0].size,
                                      position: returnDataObject,
                                      newPosition: returnDataObject
                                    });
                                  }}
                                >
                                  <BlinkingComponent
                                    price={tempData.price}
                                    size={tempData.size}
                                    color={"bg-[#8DD2F0]"}
                                    blinkColor={"bg-[#00B2FF]"}
                                  />
                                </span>
                              </React.Fragment>
                            ))
                          }

                          {/* Available to Lay */}
                          {elementtemp?.ex?.availableToLay?.length > 0 &&
                            elementtemp.ex.availableToLay.map((tempData, index) => (
                              <React.Fragment key={index}>
                                {index === 0 ? (
                                  <>
                                    <span
                                      className="lg:col-span-1 col-span-3 rounded-md lg:hidden cursor-pointer"
                                      onClick={() => {
                                        toggleRowVisibility(elementtemp.selectionId);
                                        handleBackOpen({
                                          data: tempData,
                                          type: "No",
                                          odds: tempData.price,
                                          name: elementtemp.selectionName,
                                          nameOther: element.runners,
                                          betFor: "tiedMatch",
                                          oddsType: element.marketType,
                                          betType: "K",
                                          selectionId: elementtemp.selectionId,
                                          teamData: tempData.price,
                                          betfairMarketId: element.marketId,
                                          price: elementtemp.ex.availableToBack[0].price,
                                          size: elementtemp.ex.availableToBack[0].size,
                                          position: returnDataObject,
                                          newPosition: returnDataObject
                                        });
                                      }}
                                    >
                                      <BlinkingComponent
                                        price={tempData.price}
                                        size={tempData.size}
                                        color={"bg-[#FEAFB2]"}
                                        blinkColor={"bg-[#FE7A7F]"}
                                      />
                                    </span>

                                    <span
                                      className="lg:col-span-1 col-span-3 rounded-md lg:block hidden cursor-pointer"
                                      onClick={() => {
                                        handleBackOpen({
                                          data: tempData,
                                          type: "No",
                                          odds: tempData.price,
                                          name: elementtemp.selectionName,
                                          nameOther: element.runners,
                                          betFor: "tiedMatch",
                                          oddsType: element.marketType,
                                          betType: "K",
                                          selectionId: elementtemp.selectionId,
                                          teamData: tempData.price,
                                          betfairMarketId: element.marketId,
                                          price: elementtemp.ex.availableToBack[0].price,
                                          size: elementtemp.ex.availableToBack[0].size,
                                          position: returnDataObject,
                                          newPosition: returnDataObject
                                        });
                                      }}
                                    >
                                      <BlinkingComponent
                                        price={tempData.price}
                                        size={tempData.size}
                                        color={"bg-[#FEAFB2]"}
                                        blinkColor={"bg-[#FE7A7F]"}
                                      />
                                    </span>
                                  </>
                                ) : (
                                  <span className="lg:col-span-1 col-span-2 rounded-md lg:block hidden">
                                    <BlinkingComponent
                                      price={tempData.price}
                                      size={tempData.size}
                                      color={"bg-[#FCE3E4]"}
                                      blinkColor={"bg-[#CDEBEB]"}
                                    />
                                  </span>
                                )}
                              </React.Fragment>
                            ))
                          }
                        </div>
                      </div>
                    ))}
                    </MatchDetailsHeaderSection>
                  </div>
                )
              )}
            </> : null))}
    </>
  );
};

export default TiedOddsComponent;
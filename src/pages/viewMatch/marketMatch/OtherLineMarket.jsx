import React from 'react';
import BlinkingComponent from '../BlinkingComponent';
import MatchDetailsHeaderSection from '../../../component/matchDetailsHeaderSection/MatchDetailsHeaderSection';
import FormateValueNumber from '../../../component/FormateValueNumber/FormateValueNumber';

const OtherMarketsComponent = ({
  activeTab,
  otherFinalSocket,
  isTieCoin,
  positionObj,
  returnDataObject,
  handleBackOpen,
  formatNumber
}) => {
  if (activeTab !== "all" && activeTab !== "other") {
    return null;
  }

  return (
    <>
      {Object.values(otherFinalSocket).map((element, index) => 
        element.marketType !== "Tied Match" && 
        element.marketType !== "Match Odds" && 
        element.marketType !== "To Win the Toss" && 
        element.marketType !== "Completed Match" && (
          <div key={index}>
            <MatchDetailsHeaderSection marketType={element.marketType} minMax={{ min: 100, max: formatNumber(isTieCoin?.max) }}>
            
            <div className="flex whitespace-normal max-w-full border-b border-gray-200">
              <div className="lg:w-1/2 xl:w-[58%] w-[65%] flex px-2">
                
              </div>
              
              <div className="lg:w-1/2 xl:w-[42%] w-[35%] grid grid-cols-6">
                <span className="lg:col-span-1 col-span-2 rounded-md lg:block hidden"></span>
                <span className="lg:col-span-1 col-span-2 rounded-md lg:block hidden"></span>
                <span className="lg:col-span-1 col-span-2 rounded-md lg:block hidden">
                  <div className="py-1 flex justify-center items-center bg-[#8DD2F0]">
                    <div className="text-center leading-3">
                      <span className="2xl:text-[16px] lg:text-[16px] text-xs text-gray-800 font-bold">Back</span>
                    </div>
                  </div>
                </span>
                <span className="lg:col-span-1 col-span-2 rounded-md lg:block hidden">
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
              <div className="flex whitespace-normal max-w-full" key={index}>
                <div className="lg:w-1/2 xl:w-[58%] w-[65%] flex px-2">
                  <div className="w-full py-1 leading-3 flex items-center text-[#2B2f35]">
                    <span className="text-[14px] font-bold">
                      <span className="">
                        {elementtemp.selectionName}{" "}
                        <div
                          key={index}
                          className={
                            positionObj[elementtemp.selectionId] > 0
                              ? "text-[var(--success-color)]"
                              : positionObj[elementtemp.selectionId] < 0
                                ? "text-red-500 mt-2"
                                : "text-[var(--success-color)] mt-2"
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
                {(() => {
                                    const availableToBack = elementtemp.ex?.availableToBack || [];
                                    const paddedBack = [...availableToBack];
                                    while (paddedBack.length < 3) {
                                      paddedBack.push({ price: 0, size: 0 });
                                    }

                                    return (
                                      <>
                                        {/* Extra 2 Back items (index 1 and 2) - reverse order, desktop only */}
                                        {paddedBack.slice(1).reverse().map((tempData, idx) => {
                                          const matchedTrade = elementtemp.ex.tradedVolume?.find(
                                            (trade) => trade.price === tempData.price
                                          );
                                          const displaySize = matchedTrade ? matchedTrade.size : tempData.size;
                                          const backColors = [
                                            "bg-[#b2d6f0]",  // Box 1
                                            "bg-[#92c9f0]"   // Box 2
                                          ];
                                        
                                          const bgColor = backColors[idx] || "bg-[#E6F2FC]";
                                          return (
                                            <span
                                              key={`back-extra-${elementtemp.selectionId}-${idx}`}
                                              className="lg:col-span-1 col-span-2 rounded-md lg:block hidden"
                                               onClick={() => {
                                                toggleRowVisibility(elementtemp.selectionId);
                                               
                                                  handleBackOpen({
                                                    data: tempData,
                                                    type: "Yes",
                                                    odds: tempData.price,
                                                    name: elementtemp.selectionName,
                                                    nameOther: element.runners,
                                                    betFor: "matchOdds",
                                                    oddsType: element.marketType,
                                                    betType: "L",
                                                    selectionId: elementtemp.selectionId,
                                                    teamData: tempData.price,
                                                    betfairMarketId: element.marketId,
                                                    price: elementtemp.ex.availableToLay?.[0]?.price,
                                                    size: elementtemp.ex.availableToLay?.[0]?.size,
                                                    position: returnDataObject,
                                                    newPosition: returnDataObject,
                                                  })
                                                }
                                                }
                                            >
                                              <BlinkingComponent
                                                price={tempData.price || 0}
                                                size={FormateValueNumber(displaySize) || 0}
                                                color={bgColor}
                                                blinkColor="bg-[#00B2FF]"
                                                hoverColor="bg-sky-600"
                                              />
                                            </span>
                                          );
                                        })}

                                        {/* First Back item (index 0) - special, clickable */}
                                        {paddedBack.slice(0, 1).map((tempData, idx) => {
                                          const matchedTrade = elementtemp.ex.tradedVolume?.find(
                                            (trade) => trade.price === tempData.price
                                          );
                                          const displaySize = matchedTrade ? matchedTrade.size : tempData.size;
                                          const backColors = [
                                            "bg-[#b2d6f0]",  // Box 1
                                            "bg-[#92c9f0]"   // Box 2
                                          ];
                                        
                                          const bgColor = backColors[idx - 1] || "bg-[var(--matchLagai)]";

                                          return (
                                            <React.Fragment key={`back-main-${elementtemp.selectionId}`}>
                                              {/* Mobile View */}
                                              <span
                                                className=" rounded-md col-span-3 md:col-start2 lg:hidden block"
                                                onClick={() =>
                                                  handleBackOpen({
                                                    data: tempData,
                                                    type: "Yes",
                                                    odds: tempData.price,
                                                    name: elementtemp.selectionName,
                                                    nameOther: element.runners,
                                                    betFor: "matchOdds",
                                                    oddsType: element.marketType,
                                                    betType: "L",
                                                    selectionId: elementtemp.selectionId,
                                                    teamData: tempData.price,
                                                    betfairMarketId: element.marketId,
                                                    price: elementtemp.ex.availableToLay?.[0]?.price,
                                                    size: elementtemp.ex.availableToLay?.[0]?.size,
                                                    position: returnDataObject,
                                                    newPosition: returnDataObject,
                                                  })
                                                }
                                              >
                                                <BlinkingComponent
                                                  price={tempData.price || 0}
                                                  size={FormateValueNumber(displaySize) || 0}
                                                  color={bgColor}
                                                  blinkColor="bg-[#00B2FF]"
                                                />
                                              </span>

                                              {/* Desktop View */}
                                              <span
                                                className="lg:col-span-1 col-span-3 rounded-md lg:block hidden"
                                                onClick={() =>{
                                                  toggleRowVisibility(elementtemp.selectionId);
                                               
                                                  handleBackOpen({
                                                    data: tempData,
                                                    type: "Yes",
                                                    odds: tempData.price,
                                                    name: elementtemp.selectionName,
                                                    nameOther: element.runners,
                                                    betFor: "matchOdds",
                                                    oddsType: element.marketType,
                                                    betType: "L",
                                                    selectionId: elementtemp.selectionId,
                                                    teamData: tempData.price,
                                                    betfairMarketId: element.marketId,
                                                    price: elementtemp.ex.availableToLay?.[0]?.price,
                                                    size: elementtemp.ex.availableToLay?.[0]?.size,
                                                    position: returnDataObject,
                                                    newPosition: returnDataObject,
                                                  })
                                                }
                                                 }
                                              >
                                                <BlinkingComponent
                                                  price={tempData.price || 0}
                                                  size={FormateValueNumber(displaySize) || 0}
                                                  color="bg-[var(--matchLagai)]"
                                                  blinkColor="bg-[#00B2FF]"
                                                />
                                              </span>
                                            </React.Fragment>
                                          );
                                        })}
                                      </>
                                    );
                                  })()}
                                                  
                                                   {(() => {
                                    const availableToLay = elementtemp.ex?.availableToLay || [];
                                    const paddedLay = [...availableToLay];
                                    while (paddedLay.length < 3) {
                                      paddedLay.push({ price: 0, size: 0 });
                                    }

                                    return (
                                      <>
                                        {paddedLay.map((tempData, layIdx) => {
                                          const matchedTrade = elementtemp.ex.tradedVolume?.find(
                                            (trade) => trade.price === tempData.price
                                          );
                                          const displaySize = matchedTrade ? matchedTrade.size : tempData.size;
                                          const isFirst = layIdx === 0;
                                          const key = `lay-${elementtemp.selectionId}-${layIdx}`;
                                          const backColors = [
                                            "bg-[#f8bcc8]",  // Box 1
                                            "bg-[#f6cdd6]"   // Box 2
                                          ];
                                          const bgColor = backColors[layIdx - 1] || "bg-[#E6F2FC]";
                                          if (isFirst) {
                                            return (
                                              <React.Fragment key={key}>
                                                {/* Mobile: First Lay */}
                                                <span
                                                  className="rounded-md md:col-start-4 col-span-3 lg:hidden block"
                                                  onClick={() => {
                                                    handleBackOpen({
                                                      data: tempData,
                                                      type: "No",
                                                      odds: tempData.price,
                                                      name: elementtemp.selectionName,
                                                      nameOther: element.runners,
                                                      betFor: "matchOdds",
                                                      oddsType: element.marketType,
                                                      betType: "K",
                                                      selectionId: elementtemp.selectionId,
                                                      teamData: tempData.price,
                                                      betfairMarketId: element.marketId,
                                                      price: elementtemp.ex.availableToBack?.[0]?.price,
                                                      size: elementtemp.ex.availableToBack?.[0]?.size,
                                                      position: returnDataObject,
                                                      newPosition: returnDataObject,
                                                    });
                                                  }}
                                                >
                                                  <BlinkingComponent
                                                    price={tempData.price || 0}
                                                    size={FormateValueNumber(displaySize) || 0}
                                                    color="bg-[var(--matchKhai)]"
                                                    blinkColor="bg-[#FE7A7F]"
                                                  />
                                                </span>

                                                {/* Desktop: First Lay */}
                                                <span
                                                  className="lg:col-span-1 col-span-3 rounded-md lg:block hidden"
                                                  onClick={() => {
                                                    toggleRowVisibility(elementtemp.selectionId);
                                                    handleBackOpen({
                                                      data: tempData,
                                                      type: "No",
                                                      odds: tempData.price,
                                                      name: elementtemp.selectionName,
                                                      nameOther: element.runners,
                                                      betFor: "matchOdds",
                                                      oddsType: element.marketType,
                                                      betType: "K",
                                                      selectionId: elementtemp.selectionId,
                                                      teamData: tempData.price,
                                                      betfairMarketId: element.marketId,
                                                      price: elementtemp.ex.availableToBack?.[0]?.price,
                                                      size: elementtemp.ex.availableToBack?.[0]?.size,
                                                      position: returnDataObject,
                                                      newPosition: returnDataObject,
                                                    });
                                                  }}
                                                >
                                                  <BlinkingComponent
                                                    price={tempData.price || 0}
                                                    size={FormateValueNumber(displaySize) || 0}
                                                    color="bg-[var(--matchKhai)]"
                                                    blinkColor="bg-[#FE7A7F]"
                                                  />
                                                </span>
                                              </React.Fragment>
                                            );
                                          }

                                          // Other Lay items (index 1, 2) - Desktop only
                                          return (
                                            <span
                                              key={key}
                                              className="lg:col-span-1 col-span-2 rounded-md lg:block hidden"
                                              onClick={() => {
                                                toggleRowVisibility(elementtemp.selectionId);
                                                    handleBackOpen({
                                                      data: tempData,
                                                      type: "No",
                                                      odds: tempData.price,
                                                      name: elementtemp.selectionName,
                                                      nameOther: element.runners,
                                                      betFor: "matchOdds",
                                                      oddsType: element.marketType,
                                                      betType: "K",
                                                      selectionId: elementtemp.selectionId,
                                                      teamData: tempData.price,
                                                      betfairMarketId: element.marketId,
                                                      price: elementtemp.ex.availableToBack?.[0]?.price,
                                                      size: elementtemp.ex.availableToBack?.[0]?.size,
                                                      position: returnDataObject,
                                                      newPosition: returnDataObject,
                                                    });
                                                  }}
                                            >
                                              <BlinkingComponent
                                                price={tempData.price || 0}
                                                size={FormateValueNumber(displaySize) || 0}
                                                color={bgColor}
                                                blinkColor="bg-[#CDEBEB]"
                                              />
                                            </span>
                                          );
                                        })}
                                      </>
                                    );
                                  })()}
                </div>
              </div>
            ))}
            </MatchDetailsHeaderSection >
          </div>
        )
      )}
    </>
  );
};

export default OtherMarketsComponent;
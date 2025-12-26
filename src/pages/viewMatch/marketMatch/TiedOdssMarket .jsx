import React from 'react';
import BlinkingComponent from '../BlinkingComponent';
import CashOutSystem from '../CashoutTesting';
import MatchDetailsHeaderSection from '../../../component/matchDetailsHeaderSection/MatchDetailsHeaderSection';
import PlaceBetMobile from '../../../component/betplaceMobile/PlaceBetMobile';
import FormateValueNumber from '../../../component/FormateValueNumber/FormateValueNumber';

const TiedOddsComponent = ({
  inplayMatch,
  activeTab,
  finalSocket,
  isMatchCoin,
  positionObj,
  returnDataObject,
  toggleRowVisibility,
  handleBackOpen,
  formatNumber,
  betplaceSection
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
    handleButtonValues
  } = betplaceSection;

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
                    <MatchDetailsHeaderSection
                      cashOut={
                        element?.runners?.length > 0 && (
                          <CashOutSystem
                            marketList={element.runners.map(runner => ({
                              selectionid: runner.selectionId,
                              team_name: runner.selectionName,
                              lgaai: runner.ex?.availableToBack?.[0]?.price || 0,
                              khaai: runner.ex?.availableToLay?.[0]?.price || 0,
                              selectionName: runner.selectionName,
                              ex: {
                                availableToBack: runner.ex?.availableToBack || [],
                                availableToLay: runner.ex?.availableToLay || []
                              }
                            }))}
                            positionObj={positionObj}
                            handleBackOpen={handleBackOpen}
                            toggleRowVisibility={toggleRowVisibility}
                            marketId={element.marketId}
                            betFor={"tiedMatch"}
                            oddsType={element.marketType}
                          />
                        )}
                      marketType={"Tied_Match"} minMax={{ min: 100, max: formatNumber(isMatchCoin?.max) }}>
                      <div className="flex whitespace-normal max-w-full border-b border-gray-200">
                        <div className="lg:w-1/2 xl:w-[58%] w-[65%] flex px-2">

                        </div>

                        <div className="lg:w-1/2 xl:w-[42%] w-[35%] grid grid-cols-6">
                          <span className="lg:col-span-1 col-span-2 rounded-md lg:block hidden"></span>
                          <span className="lg:col-span-1 col-span-2 rounded-md lg:block hidden"></span>
                          <span className="lg:col-span-1 col-span-3 rounded-md">
                            <div className="py-1.5 flex justify-center items-center">
                              <div className="text-center leading-3">
                                <span className="text-xs uppercase text-gray-800 font-bold">Back</span>
                              </div>
                            </div>
                          </span>
                          <span className="lg:col-span-1 col-span-3 rounded-md">
                            <div className="py-1.5 flex justify-center items-center">
                              <div className="text-center leading-3">
                                <span className="text-xs uppercase text-gray-800 font-bold">Lay</span>
                              </div>
                            </div>
                          </span>
                          <span className="lg:col-span-1 col-span-2 rounded-md lg:block hidden"></span>
                          <span className="lg:col-span-1 col-span-2 rounded-md lg:block hidden"></span>
                        </div>
                      </div>
                      {element?.runners?.length > 0 && element.runners.map((elementtemp, index) => (
                        <>

                          <div className="flex whitespace-normal max-w-full border-b border-gray-200" key={index}>
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
                              {(() => {
                                    const availableToBack = elementtemp.ex?.availableToBack || [];
                                    const paddedBack = [...availableToBack];
                                    while (paddedBack.length < 3) {
                                      paddedBack.push({ price: 0, size: 0 });
                                    }

                                    return (
                                      <>
                                        {/* Extra 2 Back items (index 1, 2) - reverse order, desktop only */}
                                        {paddedBack.slice(1).reverse().map((tempData, idx) => {
                                          const matchedTrade = elementtemp.ex.tradedVolume?.find(
                                            (trade) => trade.price === tempData.price
                                          );
                                          const displaySize = matchedTrade ? matchedTrade.size : tempData.size;
                                          const backColors = [
                                            "bg-[#b2d6f0]",  // Box 1
                                            "bg-[#92c9f0]"   // Box 2
                                          ];
                                        
                                          const bgColor = backColors[idx] || "bg-[var(--matchLagai)]";
                                          return (
                                            <span
                                              key={`back-extra-${elementtemp.selectionId}-${idx}`}
                                              className="lg:col-span-1 col-span-2 rounded-md lg:block hidden"
                                              onClick={() =>  handleBackOpen({
                                              data: tempData,
                                              type: "Yes",
                                              odds: tempData.price,
                                              name: elementtemp.selectionName,
                                              nameOther: element.runners,
                                              betFor: "tiedMatch", // ← Confirm if this is correct
                                              oddsType: element.marketType,
                                              betType: "L",
                                              selectionId: elementtemp.selectionId,
                                              teamData: tempData.price,
                                              betfairMarketId: element.marketId,
                                              price: elementtemp.ex.availableToLay?.[0]?.price,
                                              size: elementtemp.ex.availableToLay?.[0]?.size,
                                              position: returnDataObject,
                                              newPosition: returnDataObject,
                                            })}
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
                                            "bg-[var(--matchLagai)]",  // Box 1
                                            "bg-[#9d2c9f0]"   // Box 2
                                          ];
                                        
                                          const bgColor = backColors[idx] || "bg-[var(--matchLagai)]";
                                          const handleClick = () => {
                                            handleBackOpen({
                                              data: tempData,
                                              type: "Yes",
                                              odds: tempData.price,
                                              name: elementtemp.selectionName,
                                              nameOther: element.runners,
                                              betFor: "tiedMatch", // ← Confirm if this is correct
                                              oddsType: element.marketType,
                                              betType: "L",
                                              selectionId: elementtemp.selectionId,
                                              teamData: tempData.price,
                                              betfairMarketId: element.marketId,
                                              price: elementtemp.ex.availableToLay?.[0]?.price,
                                              size: elementtemp.ex.availableToLay?.[0]?.size,
                                              position: returnDataObject,
                                              newPosition: returnDataObject,
                                            });
                                          };

                                          return (
                                            <React.Fragment key={`back-main-${elementtemp.selectionId}`}>
                                              {/* Mobile View */}
                                              <span
                                                className="col-span-3 lg:hidden block cursor-pointer"
                                                onClick={handleClick}
                                              >
                                                <BlinkingComponent
                                                  price={tempData.price || 0}
                                                  size={FormateValueNumber(displaySize) || 0}
                                                  color= {bgColor}
                                                  blinkColor="bg-[#00B2FF]"
                                                />
                                              </span>

                                              {/* Desktop View */}
                                              <span
                                                className="lg:col-span-1 col-span-3 rounded-md lg:block hidden"
                                                onClick={() => {
                                                  toggleRowVisibility(elementtemp.selectionId);
                                                  handleClick}}
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
                                        
                                          const bgColor = backColors[layIdx - 1] || "bg-[var(--matchLagai)]";
                                          const handleClick = () => {
                                            handleBackOpen({
                                              data: tempData,
                                              type: "No",
                                              odds: tempData.price,
                                              name: elementtemp.selectionName,
                                              nameOther: element.runners,
                                              betFor: "tiedMatch", // Confirm if correct
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
                                          };

                                          if (isFirst) {
                                            return (
                                              <React.Fragment key={key}>
                                                {/* Mobile: First Lay */}
                                                <span
                                                  className="rounded-md md:col-start-4 col-span-3 lg:hidden block"
                                                  onClick={() => {
                                                    
                                                    handleClick();
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
                                                    handleClick}}
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

                                          // Other Lay items (index 1, 2) – Desktop only
                                          return (
                                            <span
                                              key={key}
                                              className="lg:col-span-1 col-span-2 rounded-md lg:block hidden"
                                                onClick={handleClick}
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
                          {betSlipData?.oddsType === "Tied Match" && elementtemp?.selectionId === betSlipData?.selectionId && <PlaceBetMobile
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
                          />}
                        </>
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
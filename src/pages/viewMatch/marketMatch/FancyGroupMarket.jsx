import React from 'react';
import BlinkingComponent from '../BlinkingComponent';

const GroupedFancyComponent = ({
  inplayMatch,
  activeTab,
  groupedData,
  toggleRowVisibility,
  handleBackOpen,
  marketId,
  returnDataFancyObject
}) => {
  return (
    inplayMatch?.isFancy && (activeTab === "fancy" || activeTab === "all") && (
      <div className="grid xl:grid-cols-2 gap-0.5 grid-cols-1">
        {groupedData && Object.keys(groupedData).length > 0 &&
          Object.entries(groupedData).map(([sessionName, items], index) => (
            <div key={index} className="mb-4 overflow-hidden">
              {/* Header */}
              <div className="bg-[#763e3e] text-white p-2 text-sm font-bold uppercase">
                {sessionName}
              </div>

              {/* Min/Max */}
              <div className="grid grid-cols-[80%_20%] gap-2 border-t text-sm">
                <div className="text-[11px] text-[teal] px-2 py-1 font-medium">
                  Min: 100 Max: 1L
                </div>
                <div className={`py-1 flex justify-center items-center bg-[#8DD2F0]`}>
                  <div className='text-center leading-3'>
                    <span className="2xl:text-[16px] lg:text-[16px] text-xs text-gray-800 font-bold">Back</span>
                  </div>
                </div>
              </div>

              {/* Odds Rows */}
              {items.map((commList, i) => (
                <div
                  key={i}
                  className="grid grid-cols-[80%_20%] gap-2 border-t text-sm"
                >
                  <div className="px-2">{i} Number</div>
                  <div
                    className="text-center bg-red-900 text-black cursor-pointer"
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
                  </div>
                </div>
              ))}
            </div>
          ))}
      </div>
    )
  );
};

export default GroupedFancyComponent;
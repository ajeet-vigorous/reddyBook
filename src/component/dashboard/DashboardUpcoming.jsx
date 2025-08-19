import { LiaDesktopSolid } from "react-icons/lia";
import moment from "moment";
import { useParams } from "react-router-dom";

function DashboardUpcoming({ activeTab, matchlistItems, sportName }) {
  const { gameId } = useParams();

  // ✅ Filter only upcoming matches (match time is in the future)
  const filteredMatches = matchlistItems
    ?.filter((match) => match.sportId == activeTab)
    ?.filter((match) => {
      const matchTime = moment(match.matchDate, "DD-MM-YYYY HH:mm:ss A");
      return moment().isBefore(matchTime); // upcoming only
    })
    ?.sort((a, b) => {
      const aTime = moment(a.matchDate, "DD-MM-YYYY HH:mm:ss");
      const bTime = moment(b.matchDate, "DD-MM-YYYY HH:mm:ss");
      return aTime - bTime;
    });

  // ⛔ No upcoming matches
  if (!filteredMatches || filteredMatches.length === 0) {
    return (
      <>
        <div className="lg:flex hidden justify-between py-0 w-full border-b border-t border-[#f8f8f8]">
          <div className="relative text-sm bg-[var(--primary)] w-[180px] font-bold text-white py-1.5 px-2 flex justify-start items-center space-x-1">
            {sportName === "Cricket" && <img src='/subHeader/menu-4.png' className="w-4 h-4" />}
            {sportName === "Soccer" && <img src='/subHeader/menu-1.png' className="w-4 h-4" />}
            {sportName === "Tennis" && <img src='/subHeader/menu-2.png' className="w-4 h-4" />}
            <p>{sportName}</p>
            <span className="absolute top-0 right-[-15px] w-0 h-0 border-t-[32px] border-t-[var(--primary)] border-r-[15px] border-r-transparent"></span>
          </div>
          <p className="w-[50%] grid grid-cols-3 text-center text-sm font-bold">
            <span>1</span>
            <span>X</span>
            <span>2</span>
          </p>
        </div>
        <div className="border-b px-3 py-1 text-[13px] bg-white">No Upcoming Matches Found</div>
      </>
    );
  }

  return (
    <div className="overflow-y-auto">
      <div className="flex justify-between items-center w-full bg-[#e9eff8] border-b border-t border-[#f8f8f8]">
        <div className="lg:w-[50%] w-full sm:flex items-center lg:space-x-24 lg:justify-start justify-between">
          <div className="relative text-sm bg-[var(--primary)] w-[180px] font-bold text-white py-1.5 px-2 flex justify-start items-center space-x-1">
            {sportName === "Cricket" && <img src='/subHeader/menu-4.png' className="w-4 h-4" />}
            {sportName === "Soccer" && <img src='/subHeader/menu-1.png' className="w-4 h-4" />}
            {sportName === "Tennis" && <img src='/subHeader/menu-2.png' className="w-4 h-4" />}
            <p>{sportName}</p>
            <span className="absolute top-0 right-[-15px] w-0 h-0 border-t-[32px] border-t-[var(--primary)] border-r-[15px] border-r-transparent"></span>
          </div>
        </div>
        <div className="w-[50%] lg:grid hidden grid-cols-3 text-center text-sm font-bold">
          <span>1</span>
          <span>X</span>
          <span>2</span>
        </div>
      </div>

      {filteredMatches.map((element, index) => (
        <div className="divide-y divide-[#f8f8f8] border-b border-[#f8f8f8] md:pb-0 pb-1.5" key={index}>
          <div className="lg:flex w-full">
            <div className="lg:w-[50%] w-full flex justify-between items-center bg-white">
              <div className="flex items-center justify-start w-full bg-white">
                <a
                  href={`/sport-view/${element?.marketId}/${element?.eventId}/${element?.sportId}`}
                  className="flex items-center justify-start py-1 space-x-1 w-full"
                >
                  <div className="flex flex-col uppercase w-[60%] sm:w-[35%] px-2">
                    <span className="text-[12px] font-semibold text-gray-900 hover:underline">
                      {element?.matchName}
                    </span>
                    <span className="text-[10px] font-[500] text-[#838383]">
                      ({element?.seriesName || "No Series"})
                    </span>
                  </div>

                  <div className="bg-[#E9EFF8] w-[30%] sm:w-[10%] text-[#FF0000] sm:text-xs text-[10px] font-normal px-2 py-1 rounded-sm text-center leading-tight">
                    <div>{moment(element.matchDate, "DD-MM-YYYY HH:mm:ss A").format('DD MMM')}</div>
                    <div className="text-[10px]">
                      {moment(element.matchDate, "DD-MM-YYYY HH:mm:ss A").format('hh:mm A')}
                    </div>
                  </div>
                </a>
              </div>

              <div className="flex items-center space-x-1.5 cursor-pointer pr-3">
                {element?.isTv && <img src={"/dashbaord/score-tv-icon.svg"} className="w-[15px] h-[15px]" />}
                {element?.isFancy && <img src='/dashbaord/f-icon.png' className="w-[12px] h-[12px]" />}
                {element?.isToss && (
                  <span className="font-bold bg-[var(--primary)] flex justify-center items-center text-white rounded-full text-center w-[20px] h-[20px] text-[9px] p-2">
                    BM
                  </span>
                )} {element?.isBookmaker && (
                  <span className="font-bold bg-[var(--primary)] flex justify-center items-center text-white rounded-full text-center w-[20px] h-[20px] text-[9px] p-2">
                    T
                  </span>
                )}
              </div>
            </div>

            <div className="lg:w-[50%] w-full grid grid-cols-6">
              {Array.from({ length: 6 }).map((_, i) => {
                const isLagai = i % 2 === 0;
                return (
                  <div key={i} className="relative w-full h-full">
                    <div
                      className={`${isLagai ? "bg-[var(--matchLagai)]" : "bg-[var(--matchKhai)]"
                        } p-1 flex border-[1px] border-white/40 flex-col justify-center items-center text-center w-full h-full text-sm font-semibold text-gray-900`}
                    >
                      <p>{(Math.random() * 100).toFixed()}</p>
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
      ))}
    </div>
  );
}

export default DashboardUpcoming;

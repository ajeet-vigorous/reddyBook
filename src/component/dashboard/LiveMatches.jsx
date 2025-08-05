import moment from "moment";
import { sportlistArray } from "../../pages/dashboard/Dashboard";


/* eslint-disable react/prop-types */
function LiveMatches({ matchList }) {

    const handleResponseGameotherDetails = (data) => {
        window.location.href = `/sport-view/${data.marketId}/${data.eventId}`
    };

    return (
        <div className="flex gap-2 overflow-auto mx-auto w-[100%] px-2 xl:py-0 pt-1.5 xl:pt-0 pb-0 xl:pb-1  xl:px-0">

            {matchList?.filter(element => element.sportId === 4)?.map((element, index) => {
                const inputMoment = moment(element?.matchDate, "DD-MM-YYYY HH:mm:ss A");
                const currentMoment = moment().add(60, "minutes");
                return currentMoment.isSameOrAfter(inputMoment) ? (
                    <div onClick={() => { handleResponseGameotherDetails(element) }} key={index} className="  text-nowrap flex flex-nowrap justify-between items-center p-1.5 xl:p-1 xl:px-1.5 bg-[var(--secondary)] text-white min-w-[50%] w-full  rounded-none xl:min-w-[calc(20%+20px)] xl:w-auto xl:max-w-full xl:h-full">
                        <div className="blinking-text">{sportlistArray?.find((sport) => sport.sportId === element?.sportId)?.icon}</div>   <div className="blinking-text text-ellipsis text-sm xl:text-base ml-[5px] overflow-hidden max-w-[calc(100%-42px)]">{element?.matchName} </div> <div></div>
                    </div>
                ) : null;
            })}

            <div></div>

        </div>
    )
}

export default LiveMatches;
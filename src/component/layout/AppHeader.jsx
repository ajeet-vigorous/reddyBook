import { useEffect, useState } from "react";
import settings from "../../domainConfig";
import { useDispatch } from "react-redux";
import { getSportMatchList } from "../../redux/reducers/sport_reducer";
import RulesModal from "../rulesModal/RulesModal";


const AppHeader = () => {

  const dispatch = useDispatch()
  const [rulesModalOpen, setRulesModalOpen] = useState(false);

  useEffect(() => {
    const sportInterval = setInterval(() => {
      dispatch(getSportMatchList());
    }, 10000);

    return () => { clearInterval(sportInterval); }
  }, [dispatch])


  const setModalTrue = () => {
    setRulesModalOpen(true);
  };

  const setModalFalse = () => {
    setRulesModalOpen(false);
  };

  return (
    <>
      {rulesModalOpen ? <RulesModal setModalFalse={setModalFalse} /> : null}

      <div className="">
        <div className="mx-auto lg:w-[67%] md:w-[85%] w-full py-3">
          <div className="flex justify-between items-center lg:px-0 px-2">
            <div className="flex justify-start items-center lg:space-x-5 ">
              <img src={settings.logo} className="w-[107px] h-[37px] lg:block hidden" />
              <img src={settings.logo1} className="w-[107px] h-[37px] lg:hidden block" />
              <input
                placeholder="Search Events"
                className="w-full lg:block hidden text-sm text-[#012970] bg-white border-0 shadow-[0_0_10px_0_rgba(1,41,112,0.15)] px-2 pr-10 py-[7px] rounded-[2px] transition duration-300"
              />
              <div
                onClick={() => setModalTrue()}
                className="bg-[var(--primary)] lg:block hidden border-b-[4px] border-[var(--secondary)] hover:bg-[var(--secondary)] hover:border-[var(--primary)] mr-[5px] uppercase text-[12px] py-[5px] px-[15px] rounded-[5px] text-white flex items-center cursor-pointer">
                Rules
              </div>
            </div>
            <div className="uppercase flex space-x-1">
              <div className="bg-[var(--darkcolor)] hover:bg-[var(--secondary)] text-white rounded-[10px] border-b-[1px] border-[var(--primary)] text-[13px] uppercase px-[15px] py-[7px] font-semibold shadow-[inset_0_0_0_1px_#fff] transition-all duration-[900ms] tracking-[1px] cursor-pointer">
                signup
              </div>
              <div className="bg-[var(--darkcolor)] hover:bg-[var(--secondary)] text-white rounded-[10px] border-b-[1px] border-[var(--primary)] text-[13px] uppercase px-[15px] py-[7px] font-semibold shadow-[inset_0_0_0_1px_#fff] transition-all duration-[900ms] tracking-[1px] cursor-pointer">
                Login
              </div>
            </div>
          </div>
          {/* <div>
            <div className="bg-white/20  w-full mr-2  overflow-hidden">
              <div className=" px-1 font-[500] animate-[marquee_20s_linear_infinite]  text-white/90 text-[12px] whitespace-nowrap italic">
                Now live casinos, Everyday Live sports and Famous fantasy games available on most trusted and oldest exchange. Play to win big.
              </div>
              <style>
                {`
          @keyframes marquee {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
        `}
              </style>
            </div>
          </div> */}
          <div className="px-2 mt-2">
            <input
              placeholder="Search Events"
              className="w-full lg:hidden block text-sm text-[#012970] bg-transparent  border-[1px] border-grey-50 shadow-[0_0_10px_0_rgba(1,41,112,0.15)] px-2 pr-10 py-[5px] rounded-[2px] transition duration-300"
            />
          </div>
        </div>
      </div >
    </>
  );
};

export default AppHeader;
import { useEffect, useRef, useState } from "react";
import settings from "../../domainConfig";
import { useDispatch } from "react-redux";
import { getSportMatchList } from "../../redux/reducers/sport_reducer";
import RulesModal from "../rulesModal/RulesModal";
import { FaBullseye, FaSearch } from "react-icons/fa";
import { BiChevronDown, BiLockAlt } from "react-icons/bi";
import { IoPerson, IoPersonOutline } from "react-icons/io5";
import { BsBarChart, BsBarChartSteps, BsBoxArrowRight, BsCardText } from "react-icons/bs";
import BonusRules from "../bonusRules/BonusRules";
import { useNavigate } from "react-router-dom";
import LiveMatches from "../dashboard/LiveMatches";
import Login from "../login/Login";
import { domainName } from "../../config/Auth";
import { getClientExposure, getUserBalance } from "../../redux/reducers/user_reducer";
import { IoMdArrowDropdown } from "react-icons/io";
import moment from "moment";


const AppHeader = ({ setSidebarOpen }) => {

  const dispatch = useDispatch()
  const [rulesModalOpen, setRulesModalOpen] = useState(false);
  const [bonusModalOpen, setBonusModalOpen] = useState(false);
  const token = localStorage.getItem("token");

  const [clickedOutside, setClickedOutside] = useState(false);
  const user = JSON.parse(localStorage.getItem(`user_info_${domainName}`));
  const [balance, setBalance] = useState({
    coins: "",
    exposure: "",
  });
  const handleClickInside = () => setClickedOutside(true);
  const myRef = useRef();
  const navigate = useNavigate();

  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const openModal = () => {
    setIsLoginOpen(true);
  }

  const closeModal = () => {
    setIsLoginOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (myRef.current && !myRef.current.contains(event.target)) {
        setClickedOutside(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const sportInterval = setInterval(() => {
      dispatch(getSportMatchList());
    }, 10000);

    return () => { clearInterval(sportInterval); }
  }, [])


  const setModalTrue = () => {
    setRulesModalOpen(true);
  };

  const setModalFalse = () => {
    setRulesModalOpen(false);
  };

  const setBonusTrue = () => {
    setBonusModalOpen(true);
  };

  const setBonusFalse = () => {
    setBonusModalOpen(false);
  };
  const [matchData, setMatchData] = useState([]);

  useEffect(() => {
    const matchListLocal = localStorage.getItem("matchList");
    const parsedData = matchListLocal ? JSON.parse(matchListLocal) : [];
    setMatchData(parsedData);
  }, []);


  useEffect(() => {
    const interval = setInterval(() => {
      let Balance = JSON.parse(localStorage.getItem("clientBalance") || "0");
      let clientExposure = JSON.parse(localStorage.getItem("clientExposure") || "0");
      setBalance({
        coins: Balance,
        exposure: clientExposure,
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getExposureFunc();
      const intervalBalance = setInterval(() => {
        dispatch(getUserBalance());
      }, 3000);

      return () => {
        clearInterval(intervalBalance);
      }
    }
  }, [dispatch]);

  const getExposureFunc = async () => {
    const reqData = {
      fancyBet: true,
      oddsBet: true,
      isDeclare: false,
      diamondBet: true,
      isClientExposure: true,
    };
    dispatch(getClientExposure(reqData));
  };

  return (
    <>
      {rulesModalOpen ? <RulesModal setModalFalse={setModalFalse} /> : null}
      {bonusModalOpen ? <BonusRules setBonusFalse={setBonusFalse} /> : null}

      <div className="">
        <div className="">
          <div className="flex justify-between items-center lg:px-0 px-2 mx-auto 2xl:w-[67%] md:w-[90%] w-full py-0">
            <div className="flex justify-start items-center lg:space-x-5 py-3">
              <img onClick={() => {
                navigate("/dashboard");
              }}
                src={settings.logo} className="w-[107px] h-[37px] lg:block hidden" />
              <img
                onClick={() => {
                  navigate("/dashboard");
                }}
                src={settings.logo1} className="w-[107px] h-[37px] lg:hidden block" />
              <div className="relative w-full lg:block hidden">
                <input
                  placeholder="Search Events"
                  className="w-[320px] text-sm text-white bg-white border-0 shadow-[0_0_10px_0_rgba(1,41,112,0.15)] px-2 pr-10 py-[7px] rounded-[2px] transition duration-300"
                />
                <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#012970] text-sm" />
              </div>
              <div
                onClick={() => setModalTrue()}
                className="bg-[var(--primary)] lg:block hidden border-b-[4px] border-[var(--secondary)] hover:bg-[var(--secondary)] hover:border-[var(--primary)] mr-[5px] uppercase text-[12px] py-[5px] px-[15px] rounded-[5px] text-white  items-center cursor-pointer">
                Rules
              </div>

            </div>
            {token ? (
              <>
                <div className="uppercase flex md:space-x-3 sm:space-x-2 ">
                  <div className="text-center cursor-pointer">
                    <div className="flex justify-center items-center relative">
                      <img className="w-[30x] h-[30px] md:w-[35x] md:h-[35px] md:mt-0 -mt-1.5" src='/header/inner-balexpo-red.png' />
                      <span className="absolute lg:left-9 md:top-2 text-white md:text-[13px] text-[12px] tracking-wide font-semibold">BAL</span>
                    </div>
                    <span className="font-bold md:text-[13px] text-[12px] lg:text-black text-white">
                      {balance && balance.coins
                        ? Number(balance.coins).toFixed(2)
                        : "0"}
                    </span>
                  </div>
                  <div
                    onClick={() => {
                      navigate("/market-analysis");
                    }}
                    className="text-center cursor-pointer">
                    <div className="flex  justify-center items-center relative">
                      <img className="w-[30x] h-[30px] md:w-[35x] md:h-[35px] md:mt-0 -mt-1.5" src='/header/inner-balexpo-red.png' />
                      <span className="absolute lg:left-9 md:top-2 text-white md:text-[13px] text-[12px] tracking-wide font-semibold">EXP</span>
                    </div>
                    <span className="font-bold md:text-[13px] text-[12px] lg:text-black text-white">
                      {balance && balance.exposure ? Number(balance.exposure).toFixed(2) : "0"}
                    </span>
                  </div>
                  <div className="text-white  md:relative">
                    <div
                      ref={myRef}
                      onClick={() => {
                        handleClickInside();
                        setClickedOutside(!clickedOutside);
                      }}
                    >
                      <div className="flex items-center justify-center space-x-0 cursor-pointer lg:text-black font-semibold text-white text-[11.5px] tracking-wide mt-2">

                        <div className="flex  items-center justify-center space-x-2">
                          <IoPerson />
                          <p className="">
                            {user && user?.data && user?.data?.username}
                          </p>
                        </div>
                        <IoMdArrowDropdown size={18} />
                      </div>
                      {clickedOutside ? (
                        <div className="animate__animated animate__fadeIn animate__faster absolute right-1 top-12 shadow-2xl divide-y  bg-[#f1f5f8] w-[240px] md:mx-0 mr-[2%] ml-[2%] text-[16px] text-[#212529] transition duration-2000 border z-40">
                          <div className="">
                            <div className="bg-[var(--primary)] text-[13px] font-semibold tracking-wider text-white p-1.5 text-center">
                              <span className="uppercase ">
                                Hi,{user && user?.data && user?.data?.username}
                              </span>
                            </div>
                            <div className=" p-3 border-b text-[13px] border-black bg-white capitalize space-y-[2px]">

                              <div className="flex justify-start items-center space-x-8">
                                <p>Wallet Amount</p>
                                <p className="font-bold">
                                  {balance && balance.coins
                                    ? Number(balance.coins).toFixed(2)
                                    : "0"}
                                </p>
                              </div>
                              <p className="text-[11px]">(inclusive bonus)</p>
                              <div className="flex justify-start items-center space-x-8">
                                <p>Net Exposure</p>
                                <p className="font-bold">
                                  {balance && balance.exposure ? Number(balance.exposure).toFixed(2) : "0"}
                                </p>
                              </div>
                              <div className="flex justify-start items-center space-x-20">
                                <p>Bonus</p>
                                <p className="font-bold">
                                  {balance && balance.coins
                                    ? Number(balance.coins).toFixed(2)
                                    : "0.00"}
                                </p>
                              </div>
                              <div className="flex justify-start items-center space-x-16">
                                <p>Available</p>
                                <p className="font-bold">
                                  {balance && balance.coins
                                    ? Number(balance.coins).toFixed(2)
                                    : "0.00"}
                                </p>
                              </div>
                              <div className="flex justify-start items-center space-x-14">
                                <p>Withdrawal</p>
                                <p className="font-bold">
                                  {balance && balance.coins
                                    ? Number(balance.coins).toFixed(2)
                                    : "0.00"}
                                </p>
                              </div>
                            </div>
                            <div className="py-2 px-5 border-b text-[13px] border-black bg-white capitalize text-center space-y-[4px]">
                              <div className=" rounded-xl border p-[3px] border-[var(--primary)] text-[13px] text-[var(--primary)] cursor-pointer" >
                                AWAITING BONUS : 0.00
                              </div>
                              <div
                                onClick={() => navigate("/refer-and-earn")}
                                className=" rounded-xl border p-[3px] bg-[var(--primary)] text-[13px] text-white cursor-pointer">
                                REFER AND EARN
                              </div>

                            </div>
                            <div className=" bg-white cursor-pointer space-y-1 text-[#212529] text-[12px]">
                              <div
                                onClick={() => navigate("/dashboard")}
                                className="py-2 px-4 w-full flex justify-start items-center space-x-2 hover:bg-[#FFF6EE]"
                              >
                                <img src='/subHeader/menu-home.png' className="w-[16px] h-[16px]" />
                                <p>Home{" "}</p>
                              </div>
                              <div
                                onClick={() => navigate("/profile")}
                                className="py-2 px-4 w-full flex justify-start items-center space-x-2 hover:bg-[#FFF6EE]"
                              >
                                <IoPersonOutline />
                                <p>My Profile{" "}</p>
                              </div>
                              <div
                                onClick={() => navigate("/ac-statement")}
                                className="py-2 px-4 w-full flex justify-start items-center space-x-2 hover:bg-[#FFF6EE]"
                              >
                                <BsBarChartSteps />
                                <p>Account Statement{" "}</p>
                              </div>
                              <div
                                onClick={() => setBonusTrue()}
                                className="py-2 px-4 w-full flex justify-start items-center space-x-2 hover:bg-[#FFF6EE]"
                              >
                                <BsCardText />
                                <p>Bonus Rules{" "}</p>
                              </div>
                              <div
                                onClick={() => navigate("/profile/stacksettings")}
                                className="py-2 px-4 w-full flex justify-start items-center space-x-2 hover:bg-[#FFF6EE]"
                              >
                                <FaBullseye />
                                <p>Stake Settings{" "}</p>
                              </div>
                              <div
                                onClick={() => navigate("/profit-loss")}
                                className="py-2 px-4 w-full flex justify-start items-center space-x-2 hover:bg-[#FFF6EE]"
                              >
                                <BsBarChart />
                                <p>Profit & Loss{" "}</p>
                              </div>

                              <div
                                onClick={() => navigate("/unsettled-bets")}
                                className="py-2 px-4 w-full flex justify-start items-center space-x-2 hover:bg-[#FFF6EE]"
                              >
                                <BsBarChart />
                                <p>Unsettled Bets{" "}</p>
                              </div>
                              <div
                                onClick={() => navigate("/profile/changepassword")}
                                className="py-2 px-4 w-full flex justify-start items-center space-x-2 hover:bg-[#FFF6EE]"
                              >
                                <BiLockAlt />
                                <p>Change Password{" "}</p>
                              </div>
                            </div>
                          </div>
                          <div
                            onClick={() => {
                              navigate("/dasboard");
                              localStorage.clear();
                            }}
                            className="w-full flex justify-center items-center space-x-2 text-white text-[15px] font-black uppercase text-center cursor-pointer px-2 py-2"
                            style={{
                              background: 'linear-gradient(180deg, #fa7e29 0%, #F6682F 80%, #F6682F 100%)',
                              boxShadow: 'inset 0px -10px 20px 0px #9f0101',
                            }}
                          >
                            <BsBoxArrowRight />
                            <p>Signout</p>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="uppercase flex space-x-[2px]">
                  <div
                    onClick={() => {
                      navigate("/signup");
                    }}
                    className="bg-[var(--darkcolor)] hover:bg-[var(--secondary)] text-white/90 rounded-[10px] border-[1px] border-[var(--primary)] text-[13px] uppercase px-[15px] py-[7px] font-semibold shadow-[inset_0_0_0_1px_#fff] transition-all duration-[900ms] tracking-[1px] cursor-pointer">
                    signup
                  </div>
                  <div
                    onClick={openModal}
                    className="bg-[var(--darkcolor)] hover:bg-[var(--secondary)] text-white/90 rounded-[10px] border-[1px] border-[var(--primary)] text-[13px] uppercase px-[15px] py-[7px] font-semibold shadow-[inset_0_0_0_1px_#fff] transition-all duration-[900ms] tracking-[1px] cursor-pointer">
                    Login
                  </div>
                </div>
              </>
            )}
          </div>

          {matchData?.filter(element => {
            if (!element?.matchDate) return false;
            const inputMoment = moment(element.matchDate, "DD-MM-YYYY HH:mm:ss A");
            const currentMoment = moment().add(60, "minutes");
            return element?.sportId === 4 && currentMoment.isSameOrAfter(inputMoment);
          })?.length > 0 && (
              <div className="lg:hidden flex relative">
                <div className="absolute left-0 top-0 z-[50] bg-white px-[10px] py-[5px] rounded-tr-[20px] rounded-br-[20px]">
                  <img src="/header/play-icon.png" className="w-[28px] h-[28px]" />
                </div>
                <div className="bg-[url('/header/popular-img.png')] bg-cover bg-center w-full">
                  <LiveMatches matchList={matchData} />
                </div>
              </div>
            )}


          <div className="px-2 mt-1.5">
            <div className="relative lg:hidden block w-full">
              <input
                placeholder="Search Events"
                className="w-full text-sm text-white bg-transparent border border-grey-50 shadow-[0_0_10px_0_rgba(1,41,112,0.15)] px-2 pr-10 py-[5px] rounded-[2px] transition duration-300"
              />
              <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white text-sm" />
            </div>
          </div>
        </div>
      </div >

      <Login isOpen={isLoginOpen} closeModal={closeModal} setIsLoginOpen={setIsLoginOpen} />

    </>
  );
};

export default AppHeader;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useIntCasinoCategoryList from "../../hook/useIntCasinoCategoryList";
import { BsListNested } from "react-icons/bs";



const menuItems = [
  { id: 1, icon: "/subHeader/menu-home.png", label: "Home", url: "/", inplay: false },
  { id: 2, icon: "/subHeader/menu-inplay.png", label: "In-play", url: `in-play/4`, inplay: true },
  { id: 3, icon: "/subHeader/menu-4.png", label: "Cricket", url: `in-play/4`, inplay: true },
  { id: 4, icon: "/subHeader/menu-1.png", label: "Football", url: `in-play/1`, inplay: true },
  { id: 5, icon: "/subHeader/menu-2.png", label: "Tennis", url: `in-play/2`, inplay: true },
  { id: 6, icon: "/subHeader/menu-2378961.png", label: "Politics", url: `in-play/4`, inplay: true },

  { id: 7, icon: "/subHeader/menu-99998.png", label: "Casino", url: `in-play/4`, inplay: true },
  { id: 8, icon: "/subHeader/menu-99991.png", label: "Sports Book", url: `in-play/4`, inplay: true },

  { id: 9, icon: "/subHeader/menu-7.png", label: "Horse Racing", url: `in-play/7`, inplay: true },
  { id: 10, icon: "/subHeader/menu-4339.png", label: "Greyhound Racing", url: `in-play/4339`, inplay: true },
  // { id: 11, icon:"/subHeader/menu-99991.png",label: "Sports Book", url: `in-play/4`, inplay: true },

  { id: 12, icon: "/subHeader/menu-99990.png", label: "Binary", url: `in-play/4`, inplay: true },
  { id: 13, icon: "/subHeader/menu-99994.png", label: "Kabaddi", url: `in-play/4`, inplay: true },
  { id: 14, icon: "/subHeader/menu-7522.png", label: "Basketball", url: `in-play/4`, inplay: true },
  { id: 15, icon: "/subHeader/menu-7511.png", label: "Baseball", url: `in-play/4`, inplay: true },
  { id: 16, icon: "/subHeader/menu-20.png", label: "Table Tennis", url: "in-play/3232", inplay: true },

  { id: 17, icon: "/subHeader/menu-998917.png", label: "Volleyball", url: `in-play/4`, inplay: true },
  { id: 18, icon: "/subHeader/menu-7524.png", label: "Ice hockey", url: `in-play/4`, inplay: true },
  { id: 19, icon: "/subHeader/menu-5.png", label: "Rugby", url: `in-play/4`, inplay: true },
  { id: 20, icon: "/subHeader/menu-26420387.png", label: "Mixed Martial Arts", url: `in-play/4`, inplay: true },
  { id: 21, icon: "/subHeader/menu-3503.png", label: "Darts", url: `in-play/4`, inplay: true },
  { id: 22, icon: "/subHeader/menu-29.png", label: "Futsal", url: `in-play/4`, inplay: true },



  // { id: 2, icon:"/subHeader/menu-1.png",label: "Lottery", sportId: 2005, inplay: false },

  // { id: 11, icon:"/subHeader/menu-1.png",label: "Baccarat", url: "/casino-layout/Baccarat", inplay: false },
  // { id: 12, icon:"/subHeader/menu-1.png",label: "32 Cards", url: "/casino-layout/Card_32", inplay: false },
  // { id: 13, icon:"/subHeader/menu-1.png",label: "Teenpatti", url: "/casino-layout/TeenPatti", inplay: false },
  // { id: 14, icon:"/subHeader/menu-1.png",label: "Poker", url: "/casino-layout/Poker" },
  // { id: 15, icon:"/subHeader/menu-1.png",label: "Lucky 7", url: "/casino-layout/Lucky_7", inplay: false },
];

const SubHeader = () => {
  const [activeBar, setActiveBar] = useState(null);
  const [navbarOpen, setNavbarOpen] = useState(false);
  const navigate = useNavigate();
  // const sportData = JSON.parse(localStorage.getItem("matchList"));

  const onClickHomeMenu = (url) => {
    navigate(url);
    setNavbarOpen(!navbarOpen);
  };

  const onClickMenu = (pathName) => {
    // navigate.push(`/app/game-list/${sportId}`);
    navigate(pathName)
    setNavbarOpen(!navbarOpen);
  };



  return (
    <>
      <div className="lg:bg-[var(--darkcolor)] bg-white lg:text-white text-black flex font-normal text-[12px]">
        <div
          className="items-center flex overflow-x-auto whitespace-nowrap scrollbar-height-0 px-0"
          style={{ scrollbarWidth: "none" }}
        >
          {menuItems?.map((item) => {
            const isActive = activeBar === item.id;
            return (
              <div
                key={item.id}
                onClick={() => {

                  if (item.url) {
                    onClickHomeMenu(item.url);
                  }
                  setActiveBar(item.id);
                }}
                className={`group px-[18px] uppercase relative cursor-pointer flex flex-col justify-center items-center w-full h-[45px] ${isActive
                  ? "bg-[var(--secondary)] text-white transition-all duration-150 group"
                  : "bg-transparent cd"
                  } cursor-pointer lg:border-none border-l-[1px] border-[#eee]`}>
                <img className="w-[18px] h-[18px]" src={item.icon} />
                <span>{item.label}</span>
              </div>
            );
          })}
          <div className="w-14 h-6   hover:border-white hover:border-b-2 transition-all group duration-150 relative">
            <div className=" w-full text-center px-[4px] flex justify-center cursor-pointer items-center blinking-text" onClick={() => navigate("aviator-list")}><img src="/plane-0.svg" className="" /></div></div>
        </div>
        <div className="text-black px-3 bg-black/40 flex justify-end items-center lg:hidden z-50">
          <BsListNested size={18}/>
        </div>
      </div>
      <div className="lg:hidden block ">
        <div className="bg-white w-full flex justify-start items-center overflow-hidden">
          <div className="w-[10%] bg-white px-[2px] z-[50]">
            <img src='/subHeader/commentary.png' className="w-[22px] h-[22px]" />
          </div>
          <div className="w-[90%]">
            <div className=" px-1 py-[2px] font-[700] tracking-wide animate-[marquee_30s_linear_infinite]  text-black text-[12px] whitespace-nowrap uppercase  ">
              🏏 THE HUNDRED WOMEN'S & MEN'S CUP WINNER🏆 AND FANCY MARKET STARTED IN OUR EXCHANGE 🏏 🎾 ATP TORONTO & WTA MONTREAL 🏆 CUP WINNER BETS STARTED IN OUR EXCHANGE 🎾 🏏 OUR EXCLUSIVE PREMIUM MARKET FOR (SRL) IS NOW STARTED IN OUR EXCHANGE 🏏 DREAM BIG WIN BIG
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
        </div>
      </div>
    </>
  );
};

export default SubHeader;
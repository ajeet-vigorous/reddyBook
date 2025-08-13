import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useIntCasinoCategoryList from "../../hook/useIntCasinoCategoryList";
import { BsListNested } from "react-icons/bs";
import MarqueeNotification from "../marquee/MarqueeNotification";



const menuItems = [
  { id: 1, icon: "/subHeader/menu-home.png", label: "Home", url: "/", inplay: false },
  { id: 2, icon: "/subHeader/menu-inplay.png", label: "In-play", url: `in-play/4`, inplay: true },
  { id: 3, icon: "/subHeader/menu-4.png", label: "Cricket", url: `in-play/4`, inplay: true },
  { id: 4, icon: "/subHeader/menu-1.png", label: "Football", url: `in-play/1`, inplay: true },
  { id: 5, icon: "/subHeader/menu-2.png", label: "Tennis", url: `in-play/2`, inplay: true },
  { id: 6, icon: "/subHeader/menu-2378961.png", label: "Politics", url: `in-play/4`, inplay: false },
  { id: 7, icon: "/subHeader/menu-99998.png", label: "Casino", url: `in-play/4`, inplay: false },
  { id: 8, icon: "/subHeader/menu-99991.png", label: "Sports Book", url: `in-play/4`, inplay: false },
  { id: 9, icon: "/subHeader/menu-7.png", label: "Horse Racing", url: `in-play/7`, inplay: false },
  { id: 10, icon: "/subHeader/menu-4339.png", label: "Greyhound Racing", url: `in-play/4339`, inplay: false },
  { id: 12, icon: "/subHeader/menu-99990.png", label: "Binary", url: `in-play/4`, inplay: false },
  { id: 13, icon: "/subHeader/menu-99994.png", label: "Kabaddi", url: `in-play/4`, inplay: false },
  { id: 14, icon: "/subHeader/menu-7522.png", label: "Basketball", url: `in-play/4`, inplay: false },
  { id: 15, icon: "/subHeader/menu-7511.png", label: "Baseball", url: `in-play/4`, inplay: false },
  { id: 16, icon: "/subHeader/menu-20.png", label: "Table Tennis", url: "in-play/3232", inplay: false },
  { id: 17, icon: "/subHeader/menu-998917.png", label: "Volleyball", url: `in-play/4`, inplay: false },
  { id: 18, icon: "/subHeader/menu-7524.png", label: "Ice hockey", url: `in-play/4`, inplay: false },
  { id: 19, icon: "/subHeader/menu-5.png", label: "Rugby", url: `in-play/4`, inplay: false },
  { id: 20, icon: "/subHeader/menu-26420387.png", label: "Mixed Martial Arts", url: `in-play/4`, inplay: false },
  { id: 21, icon: "/subHeader/menu-3503.png", label: "Darts", url: `in-play/4`, inplay: false },
  { id: 22, icon: "/subHeader/menu-29.png", label: "Futsal", url: `in-play/4`, inplay: false },
];

const SubHeader = ({ setSidebarOpen }) => {
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
                className={`group px-[18px] uppercase relative cursor-pointer flex flex-col justify-center items-center w-full text-black ${isActive
                  ? "bg-[var(--secondary)] h-[45px] text-white transition-all duration-150 group"
                  : " h-[44px] lg:text-white text-black"
                  } cursor-pointer lg:border-none border-l-[1px] border-[#eee]`}>
                <img className="w-[18px] h-[18px]" src={item.icon} />
                <span>{item.label}</span>
              </div>
            );
          })}

        </div>
        <div
          onClick={() => setSidebarOpen(true)}
          className="text-black px-3 bg-white flex h-[45px] justify-end items-center lg:hidden z-0">
          <BsListNested size={18} />
        </div>
      </div>
      <div className="lg:hidden block ">
        <MarqueeNotification />
      </div>
    </>
  );
};

export default SubHeader;
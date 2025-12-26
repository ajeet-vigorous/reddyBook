import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import CasinoList from "../../component/CasinoJson/CasinoList.json";
import { FaSearch } from "react-icons/fa";
import Login from "../../component/login/Login";

const AllCasinoLists = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

    const [isLoginOpen, setIsLoginOpen] = useState(false);

  const openModal = () => {
    setIsLoginOpen(true);
  }

  const closeModal = () => {
    setIsLoginOpen(false);
  };


  const name = searchParams.get("name") || "all";
  const gameName = searchParams.get("gameName") || "all";


  const [searchText, setSearchText] = useState("");

const normalizeKey = (key) => {
  return key
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-");
};

 

  const handleLabel1 = (tableKey) => {
    const resolvedGame =
      tableKey === "all"
        ? Object.keys(CasinoList.allTables)[0]
        : "all";
    navigate(`/casino/99998?name=${tableKey}&gameName=${resolvedGame}`);
  };

  const handleLabel2 = (tableKey) => {
    navigate(`/casino/99998?name=${name}&gameName=${tableKey}`);
  };

  const resolvedNameKey = Object.keys(CasinoList.tables).find(
  (key) => normalizeKey(key) === normalizeKey(name)
);


  /* ---------------- LEVEL 2 KEYS ---------------- */

  const level2Keys =
  name === "all"
    ? Object.keys(CasinoList.allTables)
    : ["all", ...Object.keys(CasinoList.tables?.[resolvedNameKey] || {})];


  /* ---------------- GAMES DATA ---------------- */

  const allCategoryGames =
  name !== "all" && gameName === "all"
    ? Object.values(CasinoList.tables?.[resolvedNameKey] || {}).flat()
    : [];


const gamesToShow =
  name === "all"
    ? CasinoList.allTables?.[gameName] || []
    : gameName === "all"
    ? allCategoryGames
    : CasinoList.tables?.[resolvedNameKey]?.[gameName] || [];

const searchedGames = gamesToShow.filter((game) =>
  normalizeKey(game?.name).includes(normalizeKey(searchText))
);
  const finalGamesToShow = searchText ? searchedGames : gamesToShow;
 const matchlistLocal = localStorage.getItem("matchList")
    ? JSON.parse(localStorage.getItem("matchList"))
    : nul

  return (
    <div className="w-full">
         <Login isOpen={isLoginOpen} closeModal={closeModal} setIsLoginOpen={setIsLoginOpen} />

        <div className='bg-[#e9eff8] flex w-full  overflow-auto justify-between items-center'>
        
                        <div>
                            <div className="relative uppercase tracking-wider text-sm bg-[var(--primary)]  font-bold text-white py-1.5 px-3">
                                <div className="flex space-x-2">
                                    <img src={"/subHeader/menu-99998.png"} className="w-[20px] h-[20px]" />
                                    <p>CASINO</p></div>
                                <span className="absolute top-0 right-[-10px] w-0 h-0 border-t-[32px] border-t-[var(--primary)] border-r-[15px] border-r-transparent"></span>
                            </div>
                        </div>
                        <div className="flex items-center ">
                            <div className="flex   rounded overflow-hidden border border-[var(--secondary)]">
                                          <input
  placeholder="Search Game..."
  value={searchText}
  onChange={(e) => setSearchText(e.target.value)}
  className="p-1 text-black"
/>
                                <button className="bg-[var(--secondary)] px-2 flex items-center justify-center">
                                    <FaSearch className="text-white text-xs" />
                                </button>
                            </div>
                        </div>
        
                    </div>


      <div className="flex my-1 overflow-x-auto ">
                {["all", ...Object.keys(CasinoList.tables)].map((key) => (
  <button
    key={key}
    onClick={() => handleLabel1(key)}
    className={`px-4 py-1 text-sm font-normal  text-nowrap uppercase text-white
      ${normalizeKey(name) === normalizeKey(key)
        ? "bg-[var(--secondary)] "
        : "border-[var(--darkcolor)] bg-[var(--darkcolor)] "}`}
  >
    {key}
  </button>
))}

            </div>

       <div className="flex overflow-x-auto ">
                      {level2Keys.map((key) => (
                        <button
                            key={key}
                            onClick={() => handleLabel2(key)}
                            className={`gap-2 px-2  text-nowrap border border-[var(--darkcolor)]
                            ${normalizeKey(gameName) === normalizeKey(key)
                                    ? " bg-[var(--darkcolor)] text-white"
                                    : " text-black"}`}
                        >
                            <img
                                src={`/int_tab_icons/${normalizeKey(key)}.png`}
                                alt={key}
                                loading="lazy"     
                                className={`w-[25px] flex mx-auto 
          ${normalizeKey(gameName) === normalizeKey(key) ? "filter brightness-0 invert" : ""}`}
                            />
                            <span className="uppercase px-2 text-xs font-normal">
                                {key} 
                            </span>
                        </button>
                    ))}
                </div>
         <div className="grid grid-cols-3 md:grid-cols-6 py-2 gap-1">
        {finalGamesToShow?.map((game, idx) => (
          <div key={idx} className="cursor-pointer">
            <img
              src={game?.url_thumb}
              alt={game?.name}
              className="w-full md:h-[150px] h-[80px]"
               onClick={() => {
                    if (localStorage.getItem("token")) {
                      window.location.href = `/iframe-casino/${game.id}`;
                    } else {
                      openModal();
                      localStorage.setItem("unauthorized", true);
                    }
                  }}
          
            />
            <p className="text-white bg-[var(--darkcolor)] text-center md:text-xs text-[8px] font-bold py-1 md:py-0.5 truncate">
              {game?.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllCasinoLists;

import { useNavigate } from "react-router-dom";

const providers = [
  {
    "name": "EZUGI",
    "image": "/casino-providers/ezugi-casino.webp"
  },
  {
    "name": "DC",
    "image": "/casino-providers/dc-casino.webp"
  },
  {
    "name": "AWC",
    "image": "/casino-providers/awc-casino.webp"
  },
  {
    "name": "KINGMIDAS",
    "image": "/casino-providers/kingmidas-casino.webp"
  },
  {
    "name": "BETGAMES",
    "image": "/casino-providers/betgames-casino.webp"
  },
  {
    "name": "SUNO",
    "image": "/casino-providers/suno-casino.webp"
  },
  {
    "name": "CRASH88",
    "image": "/casino-providers/crash88-casino.webp"
  },
  {
    "name": "SAP",
    "image": "/casino-providers/sap-casino.webp"
  },
  {
    "name": "JiLi",
    "image": "/casino-providers/jili-casino.webp"
  },
  {
    "name": "EVOLUTION",
    "image": "/casino-providers/evolution-casino.webp"
  },
  {
    "name": "RG",
    "image": "/casino-providers/rg-casino.webp"
  }
];

function Providers({ filterSection, name, providersData }) {
  const navigate = useNavigate();
  
  const ProvidersList = providers || providersData;

  return (
    <div>
      <div className="bg-[#e9eff8] rounded-md py-2 border border-secondary">
        <div>
          <div className="relative uppercase tracking-wider text-sm bg-[var(--primary)] w-[200px] font-bold text-white py-1.5 px-3">
            <div className="flex space-x-2 items-center">
              <img src="/subHeader/menu-99998.png" className="w-[20px] h-[20px]" alt="menu" />
              <p>{name}</p>
            </div>
            <span className="absolute top-0 right-[-15px] w-0 h-0 border-t-[32px] border-t-[var(--primary)] border-r-[15px] border-r-transparent"></span>
          </div>
        </div>

        <div className="grid lg:grid-cols-7 md:grid-cols-6 sm:grid-cols-5 grid-cols-4 gap-0.5 mt-0.5">
          {ProvidersList?.map((item, idx) => (
            <div key={idx} className="!w-auto">
              <a href={`/casino-list-by-providername/${item.name}`} className="block">
                <div className="text-gray-300 font-bold text-xs">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="object-cover" 
                  />
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Providers;
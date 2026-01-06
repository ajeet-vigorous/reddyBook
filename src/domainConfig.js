const ReddyBookSettings = {
  title: "ReddyBook | India’s Most Trusted Online Cricket Betting Id Provider",
  favicon: "/favicon/favicon.ico",
  logo: "/logo/reddyBook-logo.png",
  logo1: "/logo/silver-reddyBook.png",
  SOCKET_URL: "https://api.criecbet99.club/",
  apiurl: 'https://api.criecbet99.club/v1/',
  domainName: "reddybook",
  colors: {
    "--primary": "#C10930",
    "--secondary": "#6D081D",
    "--darkcolor": "#343435",
    "--darkred": "#8b0000",
    "--backgroundmain": "#dfe8e9",
    "--matchLagai": "#94dfff",
    "--matchKhai": "#f9c8d3",

    "--result-color": "#355e3b",
    "--rule-bg": '#CCCCCC',
    "--sports-tab": '#266894',
    "--suspended-color": 'rgba(0,0,0,0.7)',
    "--blink-color": "#fdcf13",
    "--success-color": "#086f3f"
  },
  demoCredentials: {
    username: "demo",
    password: "1122",
    isClient: true,
    isDemoClient: true,
    host: window.location.host,
  }
};

const Reddywin888Settings = {
  title: "ReddyWin888 | India’s Most Trusted Online Cricket Betting Id Provider",
  favicon: "/favicon/favicon.ico",
  logo: "/logo/reddywin888.png",
  logo1: "/logo/reddywin888.png",
  SOCKET_URL: "https://api.criecbet99.club/",
  apiurl: 'https://api.criecbet99.club/v1/',
  domainName: "ReddyWin888",
  colors: {
    "--primary": "#C10930",
    "--secondary": "#6D081D",
    "--darkcolor": "#343435",
    "--darkred": "#8b0000",
    "--backgroundmain": "#dfe8e9",
    "--matchLagai": "#94dfff",
    "--matchKhai": "#f9c8d3",
    "--result-color": "#355e3b",
    "--rule-bg": '#CCCCCC',
    "--sports-tab": '#266894',
    "--suspended-color": 'rgba(0,0,0,0.7)',
    "--blink-color": "#fdcf13",
    "--success-color": "#086f3f"
  },
  demoCredentials: {
    username: "demo",
    password: "1122",
    isClient: true,
    isDemoClient: true,
    host: window.location.host,
  }
};


const domainSettings = {
  "reddyexch.co": ReddyBookSettings,
  "reddywin888.com": Reddywin888Settings,
  "localhost:3000": Reddywin888Settings,

};


const currentDomain = window.location.host;
const settings = domainSettings[currentDomain] || domainSettings["localhost:3000"];
// Object.entries(settings).forEach(([key, value]) => {
//   if (key.startsWith("--")) {
//     document.documentElement.style.setProperty(key, value);
//   }
// });
export default settings;
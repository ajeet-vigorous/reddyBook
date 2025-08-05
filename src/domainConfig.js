const GrandExchangeSettings = {
  title: "GRANDEXCH",
  favicon: "/favicon/fav-icon.png",
  logo: "/logo/grandexchange.png",
  SOCKET_URL: "https://socket.trovetown.co/",
  apiurl: "https://api.plx99.com/v1/",
  domainName: "GRANDEXCH",
  colors: {
    "--primary": "#9F4636",
    "--secondary": "#6C2D2C",
    "--matchLagai": "#72bbef",
    "--matchKhai": "#FAA9BA",
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
    host: window.location.host,
  }
};

const SaffronExchSettings = {
  title: "SAFFRRONEXCH",
  favicon: "/favicon/favicon-32x32.png",
  logo: "/logo/safronlogo.png",
  SOCKET_URL: "https://socket.trovetown.co/",
  apiurl: "https://api.plx99.com/v1/",
  domainName: "SAFFRRONEXCH",
  colors: {
    "--primary": "#AE4600",
    "--secondary": "#B97242",
    "--matchLagai": "#72bbef",
    "--matchKhai": "#FAA9BA",
    "--result-color": "#355e3b",
    "--rule-bg": '#CCCCCC',
    "--sports-tab": '#266894',
    "--suspended-color": 'rgba(0,0,0,0.7)',
    "--blink-color": "#fdcf13",
    "--success-color": "#086f3f"
  },
  demoCredentials: {
    username: "Demo1",
    password: "1122",
    isClient: true,
    host: window.location.host,
  }


};


const domainSettings = {
  "grandexchange.com": GrandExchangeSettings,
  "safffronexchange.com": SaffronExchSettings,

  "localhost:3000": GrandExchangeSettings,

};


const currentDomain = window.location.host;
const settings = domainSettings[currentDomain] || domainSettings["localhost:3000"];
// Object.entries(settings).forEach(([key, value]) => {
//   if (key.startsWith("--")) {
//     document.documentElement.style.setProperty(key, value);
//   }
// });
export default settings;
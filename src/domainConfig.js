const GrandExchangeSettings = {
  title: "ReddyBook | India’s Most Trusted Online Cricket Betting Id Provider",
  favicon: "/favicon/favicon.ico",
  logo: "/logo/reddyBook-logo.png",
  logo1: "/logo/silver-reddyBook.png",
  SOCKET_URL: "https://socket.trovetown.co/",
  apiurl: "https://apidiamond.trovetown.co/v1/",
  domainName: "reddybook",
  colors: {
    "--primary": "#C10930",
    "--secondary": "#6D081D",
    "--darkcolor": "#343435",
    "--darkred": "#8b0000",
    "--backgroundmain": "#dfe8e9",
    "--matchLagai": "#66d1ff",
    "--rule-bg": '#CCCCCC',
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

export default settings;
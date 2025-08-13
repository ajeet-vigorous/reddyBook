import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './layout/Layout'
import { ToastContainer } from 'react-toastify'
import { BalanceProvider } from './global/contextApi/BalanceContext'
import './App.css'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import settings from './domainConfig'
import { getDomainSettingData, getInternationalGroupCasinoList, getMatchList } from './redux/reducers/user_reducer'




function setMultipleRootCssVariables(colors) {
  for (const [variable, value] of Object.entries(colors)) {
    document.documentElement.style.setProperty(variable, value);
  }
}

function App() {
  const dispatch = useDispatch();

  const cosinoGroupList = JSON.parse(localStorage.getItem('cosinoGroupList'))

  useEffect(() => {
    dispatch(getMatchList());
    let domainSetting = {
      domainUrl: window.location.origin,
    };
    dispatch(getDomainSettingData(domainSetting));
    const interval = setInterval(() => {
      dispatch(getMatchList());
    }, 180000);
    casinoGroupWise()
    return () => clearInterval(interval);
  }, [dispatch]);

  const casinoGroupWise = () => {
    const ReqData = {
      "categoriesList": true,
      "providerList": true,
      "lobbygames": true,
      "trendingGames": true,
      "popularGames": true,
      "liveGames": true
    };
    {
      // !cosinoGroupList && (
        dispatch(getInternationalGroupCasinoList(ReqData))
      // )
    }

  }

  useEffect(() => {
    if (settings.title) {
      document.title = settings.title;
    }
    if (settings.favicon) {
      let link = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      link.href = settings.favicon;
    }
    if (settings.colors) {
      setMultipleRootCssVariables(settings.colors)
    }
    // return () => { clearInterval(sportInterval); }
  }, [dispatch])


  return (
    <>
      <ToastContainer />
      <BalanceProvider>
        <BrowserRouter>
          <Routes>

            <Route path="*" element={<Layout />} />
          </Routes>
        </BrowserRouter>
      </BalanceProvider>
    </>

  )
}

export default App

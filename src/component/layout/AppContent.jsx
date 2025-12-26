import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Dashboard from '../../pages/dashboard/Dashboard'
import InPlayMatch from '../../pages/in_play/InPlayMatch'
import Signup from '../../pages/signup/Signup'
import Profile from '../../pages/profile/Profile'
import AccountSatement from '../../pages/accountstatement/AccountStatement'
import MarketAnalysis from '../../pages/marketAnalysis/MarketAnalysis'
import ReferAndEarn from '../../pages/referAndEarn/ReferAndEarn'
import AllCasino from '../../pages/allCasino/AllCasino'
import SportsBook from '../../pages/sportsBook/SportsBook'
import ViewMatches from '../../pages/viewMatch/ViewMatch'
import InplaySport from '../../pages/inplay/InplaySport'
import UnsettledBets from '../../pages/unsettledBets/UnsettledBets'
import ProfitLoss from '../../pages/profitloss/ProfitLoss'
import ViewMatchRacing from '../../pages/viewMatch/ViewMatchRacing'
import BonusList from '../../pages/bonusList/BonusList'
import IframeCasino from '../../pages/IframeCasino/IframeCasino'
import IframeCasinonew from '../../pages/IframeCasino/IframeCasinonew'
import IframeQtech from '../../pages/IframeCasino/IframeQtech'
import CasinoListByProviderName from '../../pages/casinoListByProviderName/CasinoListByProviderName'
import AllCasinoLists from '../../pages/allCasino/AllCasinoList'


const AppContent = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path='/dashboard' element={<Dashboard />} />
      <Route path='/signup' element={<Signup />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/profile/:tab?" element={<Profile />} />
      <Route path='/ac-statement' element={<AccountSatement />} />
      <Route path='/all-casino' element={<AllCasino />} />
      <Route path='/sports-book' element={<SportsBook />} />
      <Route path='/market-analysis' element={<MarketAnalysis />} />
      <Route path='/refer-and-earn' element={<ReferAndEarn />} />
      <Route path='/bonus-list' element={<BonusList />} />
      <Route path='/in-play/:gameId?' element={<InPlayMatch />} />
      <Route path='/sports_book' element={<InplaySport />} />
      <Route path='/unsettled-bets' element={<UnsettledBets />} />
      <Route path='/profit-loss' element={<ProfitLoss />} />
      <Route path='/sport-view/:marketId?/:eventId?/:sportId?' element={<ViewMatches />} />
      <Route path='/sport-view-racing/:marketId?/:eventId?/:sportId?' element={<ViewMatchRacing />} />
      {/* <Route path="/iframe-casino/:gameId?" element={<IframeCasino />} />
      <Route path="/iframe-casino-new/:provider?/:gameId?"element={<IframeCasinonew />} />
      <Route path="/iframe-qtech-casino/:gameId?" element={<IframeQtech />} /> */}
      <Route path="/casino-list-by-providername/:providername?" element={<CasinoListByProviderName />} />
      <Route path="/casino/:eventTypeId" element={<AllCasinoLists />} />

    </Routes>

  )
}

export default React.memo(AppContent)
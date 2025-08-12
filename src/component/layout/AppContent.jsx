import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Dashboard from '../../pages/dashboard/Dashboard'
import InPlayMatch from '../../pages/in_play/InPlayMatch'
import Signup from '../../pages/signup/Signup'
import Profile from '../../pages/profile/Profile'
import Overview from '../profile/Overview'
import StakeSettings from '../profile/StakeSettings'
import ChangePassword from '../profile/ChangePassword'
import AccountSatement from '../../pages/accountstatement/AccountStatement'
import MarketAnalysis from '../../pages/marketAnalysis/MarketAnalysis'
import ReferAndEarn from '../../pages/referAndEarn/ReferAndEarn'
import AllCasino from '../../pages/allCasino/AllCasino'
import SportsBook from '../../pages/sportsBook/SportsBook'





const AppContent = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path='/dashboard' element={<Dashboard />} />
      <Route path='/signup' element={<Signup />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/profile/:tab" element={<Profile />} />
      {/* <Route path='/overview' element={<Overview />} />
      <Route path='/profile/stack-settings' element={<StakeSettings />} />
      <Route path='/profile/change-password' element={<ChangePassword />} /> */}
      <Route path='/ac-statement' element={<AccountSatement />} />
      <Route path='/all-casino' element={<AllCasino />} />
      <Route path='/sports-book' element={<SportsBook />} />
      <Route path='/market-analysis' element={<MarketAnalysis />} />
      <Route path='/refer-and-earn' element={<ReferAndEarn />} />
      <Route path='/in-play/:gameId?' element={<InPlayMatch />} />
    </Routes>

  )
}

export default React.memo(AppContent)
import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Dashboard from '../../pages/dashboard/Dashboard'
import InPlayMatch from '../../pages/in_play/InPlayMatch'
import Signup from '../../pages/signup/Signup'





const AppContent = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path='/dashboard' element={<Dashboard />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/in-play/:gameId?' element={<InPlayMatch />} />
    </Routes>

  )
}

export default React.memo(AppContent)
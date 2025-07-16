
import { Route, Routes } from 'react-router-dom'
import Home from './component/Home'
import ReraKyc from './component/ReraKyc'
import AdharKyc from './component/AdharKyc'
import SuspendUser from './component/SuspendUser'
import UserStatsDashboard from './component/UserStatsDashboard'
const App = () => {
  return (
    <div>
      
      <Routes>
      <Route path="/" element={<Home/>} />
      
        <Route path="/rera-kyc" element={<ReraKyc  />} />
        <Route path="/adhar-kyc" element={<AdharKyc />} />
        <Route path='/suspend-user' element={<SuspendUser />} />
        <Route path='/user-stats' element={<UserStatsDashboard />} />
       
      </Routes>
      
    </div>
   
  )
}

export default App
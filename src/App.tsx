
import { Route, Routes } from 'react-router-dom'
import Home from './component/Home'
import ReraKyc from './component/ReraKyc'
import AdharKyc from './component/AdharKyc'
import SuspendUser from './component/SuspendUser'
const App = () => {
  return (
    <div>
      
      <Routes>
      <Route path="/" element={<Home/>} />
      
        <Route path="/rera-kyc" element={<ReraKyc  />} />
        <Route path="/adhar-kyc" element={<AdharKyc />} />
        <Route path='/suspend-user' element={<SuspendUser />} />
      </Routes>
    </div>
   
  )
}

export default App
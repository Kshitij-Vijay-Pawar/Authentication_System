import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login.jsx'
import ResetPassword from './pages/ResetPassword'
import EmailVerify from './pages/EmailVerify'

import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  console.log('App component rendering');
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/email-verify" element={<EmailVerify />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </>
  )
}

export default App
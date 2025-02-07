import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import ResetPassword from './pages/ResetPassword'
import EmailVerify from './pages/EmailVerify'
import Login from './pages/Login'
import { ToastContainer } from 'react-toastify'
import { AppContextProvider } from "./contexts/appcontext.jsx";


const App = () => {
  return (
    <div >
    <AppContextProvider>

          <ToastContainer />
      <Routes>
        <Route path='/' element= {<Home/>}/>
        <Route path='/login' element= {<Login/>}/>
        <Route path='/reset-password' element= {<ResetPassword/>}/>
        <Route path='/verify-email' element= {<EmailVerify/>}/>
      </Routes>

    </AppContextProvider>
    </div>
  )
}

export default App
import React, { useEffect } from 'react';
import {Routes, Route, Navigate} from 'react-router-dom';
import Home from './pages/Home';
import Result from './pages/Result';
import BuyCredit from './pages/BuyCredit';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './components/Login';
import { useApp } from './context/AppContent';
import StripeContainer from './components/PaymentForm';
import isTokenValid from './utils/isValidToken.js';
import ProtectRoute from './utils/ProtectRoute.jsx';

const App = () => {
  const {showLogin,isPayment} = useApp();
  if(!isTokenValid()){
    localStorage.removeItem('token');
  }
  return (
    <div 
      className='px-4 sm:px-10 md:px-14 lg:px-28 min-h-screen bg-gradient-to-br from-teal-100 to-orange-100'
    >
      <Navbar/>
      <Routes>
        <Route path='/' element = {<Home/>} />
        <Route path='/results' element = { <ProtectRoute><Result/></ProtectRoute> } />
        <Route path='/buy' element = { <BuyCredit/> } />
        <Route 
          path='/payment' 
          element = { 
            isPayment ? 
            <ProtectRoute><StripeContainer/></ProtectRoute> : 
            <Navigate to='/buy' /> 
          } 
        />
        <Route path='*' element={<div>Hello</div>} />
      </Routes>
      <Footer/>
      {showLogin && <Login/>}
    </div>
  )
}

export default App
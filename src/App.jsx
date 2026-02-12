import { useState } from 'react';
import { BrowserRouter,Routes,Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { SignUp } from './pages/SignUp';
import { Login } from './pages/Login';
import { NotFound } from './pages/NotFound';
import { Client } from './pages/client';
import { Payments } from './pages/Payments';
import { ClientLogin } from './pages/clientLogin';
import { ClientSignup } from './pages/clientSignup';
import { ClientDashboard } from './pages/ClientDashboard';
import { TestPage } from './pages/TestPage';

function App() {

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route index element={<Home/>}  />
      <Route  path="/login" element={<Login/>} />
      <Route path="/signup" element={<SignUp/>} />
      <Route path="/client" element={<Client/>} />
      <Route path="/payments" element={<Payments/>} />
      <Route path="/client-login" element={<ClientLogin/>} />
      <Route path="/client-signup" element={<ClientSignup/>} />
      <Route path="/client-dashboard" element={<ClientDashboard/>} />
      <Route path="/test" element={<TestPage/>} />
      <Route element={<NotFound/>} />
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App

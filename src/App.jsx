import { useState } from 'react';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { SignUp } from './pages/SignUp';
import { Login } from './pages/Login';
import { NotFound } from './pages/NotFound';
import { Client } from './pages/client';

function App() {

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route index element={<Home/>}  />
      <Route  path="/login" element={<Login/>} />
      <Route path="/signup" element={<SignUp/>} />
      <Route path="/client" element={<Client/>} />
      <Route element={<NotFound/>} />
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App

import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import SPSNavbar from './New_Components/LoginRegistration/Navbar';

function App() {
  return (
    // <Routes>
    //   <Route path="/login" element={<LoginPage />} />
    //   <Route path="/dashboard" element={<DashboardPage />} />
    //   {/* <Route path="/register" element={<RegisterPage />} />  */}
    //   <Route path="/register" element={<RegistrationPage/>}/>
    //   <Route path="*" element={<Navigate to="/login" />} />
    // </Routes>
    <>
      <SPSNavbar/>
      <Outlet/>

      {/* <AdminDashboard/> */}
    </>
  );
}

export default App;

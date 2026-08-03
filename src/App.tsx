import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import "./App.css";

import Login from "./pages/auth/Login";
import VerifyOtp from "./pages/auth/VerifyOtp";

import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users"; // Import your Users page
import BikeBuyerRequest from "./pages/BikeBuyerRequest";
import AdminUserManagement from "./pages/AdminUserManagement";

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        reverseOrder={false}
      />

      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<Login />} />
        <Route
          path="/verify-otp"
          element={<VerifyOtp />}
        />

        {/* Dashboard Routes */}
        <Route element={<DashboardLayout />}>
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />
          <Route
            path="/admin-user-management"
            element={<AdminUserManagement />}
          />

          <Route
            path="/users"
            element={<Users />}
          />
          <Route
            path="/bike-buy-request"
            element={<BikeBuyerRequest />}
          />
        </Route>
      </Routes>  
    </BrowserRouter>
  );
}

export default App;
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useState } from "react";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:block lg:w-64">
        <Sidebar />
      </aside>

      {/* ================= MOBILE SIDEBAR OVERLAY ================= */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* ================= MOBILE SIDEBAR ================= */}
      <aside
        className={`
          fixed left-0 top-0 z-50 h-screen w-64
          transform bg-white shadow-xl
          transition-transform duration-300 ease-in-out
          lg:hidden
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <Sidebar />
      </aside>

      {/* ================= MAIN AREA ================= */}
      <div className="min-h-screen lg:pl-64">
        {/* Navbar */}
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        {/* Page Content */}
        <main className="p-3 sm:p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
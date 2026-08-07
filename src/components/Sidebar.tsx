import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Settings,
  User,
  LogOut,
} from "lucide-react";
import {  useDispatch } from "react-redux";
import { logout } from "../Redux/slices/authSlice";


const menuItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  
  {
    name: "Users",
    path: "/users",
    icon: Users,
  },
  {
    name: "Admin Users",
    path:"/admin-user-management",
    icon: Users,
  },
  {
    name: "Bike Buy Request",
    path: "/bike-buy-request",
    icon: User,
  },
  {
    name: "ContactUS",
    path: "/contact-us",
    icon: Users,
  },
  {
    name: "Settings",
    path: "/settings",
    icon: Settings,
  },
  
];

const Sidebar = () => {
  const navigate = useNavigate();
    const dispatch = useDispatch();
   const handleLogout = () => {
      dispatch(logout());
      localStorage.clear();
      sessionStorage.clear();
      navigate("/");
    };
  return (
    <div className="h-screen w-64 bg-slate-900 text-white p-5">
      <h1 className="text-2xl font-bold mb-10">
        Admin Panel
      </h1>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-lg transition ${
                  isActive
                    ? "bg-blue-600"
                    : "hover:bg-slate-800"
                }`
              }
            >
              <Icon size={20} />
              {item.name}
            </NavLink>
          );
        })}
        <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 cursor-pointer  transition group"
                      >
                        <LogOut className="w-4 h-4 text-red-500 group-hover:text-red-600 transition" />
                        <span className="text-sm text-red-600 dark:text-red-400 group-hover:text-red-700 transition">
                          Logout
                        </span>
                      </button>
      </nav>
    </div>
  );
};

export default Sidebar;
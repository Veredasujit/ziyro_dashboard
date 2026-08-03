import { Menu, ChevronDown, User, Settings, LogOut, Shield } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import type { RootState } from "../Redux/store";
import { logout } from "../Redux/slices/authSlice";

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);


  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.auth.user);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  

  const handleLogout = () => {
    dispatch(logout());
    localStorage.clear();
    sessionStorage.clear();
    navigate("/");
  };

  const getInitials = (name: string) => {
    return name
      ?.split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "super_admin":
        return "bg-gradient-to-r from-purple-500 to-pink-500";
      case "admin":
        return "bg-gradient-to-r from-blue-500 to-cyan-500";
      case "manager":
        return "bg-gradient-to-r from-emerald-500 to-teal-500";
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-600";
    }
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 h-16 flex items-center justify-between px-4 md:px-6 shadow-sm sticky top-0 z-30 transition-colors duration-200">
      {/* Mobile Menu Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="Toggle menu"
      >
        <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
      </motion.button>

      {/* Logo / Title Section */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
          <span className="text-white font-bold text-sm">D</span>
        </div>
        <h2 className="font-semibold text-xl bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
          Dashboard
        </h2>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 md:gap-3">
        

        

        {/* User Dropdown */}
        <div className="relative" ref={dropdownRef}>
          {user ? (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all group"
                aria-label="User menu"
              >
                <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${getRoleColor(user.role)} flex items-center justify-center text-white font-semibold text-sm shadow-md`}>
                  {getInitials(user.fullName)}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {user.fullName?.split(" ")[0]}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                    {user.role?.replace("_", " ") || "Admin"}
                  </p>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
              </motion.button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50"
                  >
                    {/* User Info Header */}
                    <div className="px-4 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800 border-b border-gray-100 dark:border-gray-700">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getRoleColor(user.role)} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                          {getInitials(user.fullName)}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {user.fullName}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {user.email}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            <Shield className="w-3 h-3 text-blue-500" />
                            <p className="text-xs text-blue-600 dark:text-blue-400 capitalize font-medium">
                              {user.role?.replace("_", " ") || "Admin"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <Link
                        to="/profile"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition group"
                      >
                        <User className="w-4 h-4 text-gray-500 group-hover:text-blue-500 transition" />
                        <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                          My Profile
                        </span>
                      </Link>

                      <Link
                        to="/settings"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition group"
                      >
                        <Settings className="w-4 h-4 text-gray-500 group-hover:text-blue-500 transition" />
                        <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                          Settings
                        </span>
                      </Link>

                      <div className="border-t border-gray-100 dark:border-gray-700 my-1" />

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 transition group"
                      >
                        <LogOut className="w-4 h-4 text-red-500 group-hover:text-red-600 transition" />
                        <span className="text-sm text-red-600 dark:text-red-400 group-hover:text-red-700 transition">
                          Logout
                        </span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          ) : (
            <div className="w-9 h-9 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
              <span className="text-gray-600 dark:text-gray-400 font-semibold text-sm">?</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
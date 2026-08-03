import { useState, useMemo, useEffect } from "react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Trash2,
  UserX,
  Shield,
  Mail,
  RefreshCw,
  Users as UsersIcon,
  AlertCircle,
  Phone,
} from "lucide-react";

import {
  useGetAllUsersQuery,
  useDeleteUserByAdminMutation,
} from "../Redux/api/userApi";



const Users = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"name" | "email" | "role" | "date">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const {
    data,
    isLoading,
    refetch,
    isFetching,
  } = useGetAllUsersQuery();

  const [deleteUser, { isLoading: deleting }] = useDeleteUserByAdminMutation();

  const filteredUsers = useMemo(() => {
  let users = [...(data?.users || [])];

  // Search
  if (searchTerm) {
    users = users.filter(
      (user) =>
        user.fullName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        user.email
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
  }

  // Role Filter
  if (roleFilter !== "all") {
    users = users.filter(
      (user) => user.role === roleFilter
    );
  }

  // Sort
  users.sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case "name":
        comparison = a.fullName.localeCompare(
          b.fullName
        );
        break;

      case "email":
        comparison = a.email.localeCompare(
          b.email
        );
        break;

      case "role":
        comparison = a.role.localeCompare(
          b.role
        );
        break;

      default:
        comparison = 0;
    }

    return sortOrder === "asc"
      ? comparison
      : -comparison;
  });

  return users;
}, [
  data?.users,
  searchTerm,
  roleFilter,
  sortBy,
  sortOrder,
]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  // Reset page when filters change
  useEffect(() => {
  setPage(1);
}, [searchTerm, roleFilter, itemsPerPage]);

  const handleDeleteClick = (userId: string) => {
    setUserToDelete(userId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    try {
      const res = await deleteUser(userToDelete).unwrap();
      toast.success(res.message);
      refetch();
      setShowDeleteModal(false);
      setUserToDelete(null);
      
      // Adjust page if last item on page is deleted
      if (currentUsers.length === 1 && page > 1) {
        setPage(page - 1);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete user");
    }
  };

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      service_partner: { color: "blue", icon: Shield, label: "Service Partner" },
      admin: { color: "blue", icon: Shield, label: "Admin" },
      user: { color: "gray", icon: UserX, label: "User" },
    };

    const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.user;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-${config.color}-100 text-${config.color}-700 dark:bg-${config.color}-900/30 dark:text-${config.color}-400`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
              User Management
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage and monitor all users in your platform
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 text-gray-600 dark:text-gray-400 ${isFetching ? "animate-spin" : ""}`} />
            </button>
            
            <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <UsersIcon className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Total: <span className="font-bold text-blue-600 dark:text-blue-400">{filteredUsers.length}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          {/* Role Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition appearance-none cursor-pointer"
            >
              <option value="all">All Roles</option>
              <option value="service_partner">Service Partner</option>
              <option value="admin">Admin</option>
              
              <option value="user">User</option>
            </select>
          </div>

          {/* Items Per Page */}
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition"
          >
            <option value={5}>5 / page</option>
            <option value={10}>10 / page</option>
            <option value={20}>20 / page</option>
            <option value={50}>50 / page</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
              <tr>
                {["name", "email","mobile", "role",].map((column) => (
                  <th key={column} className="text-left p-4">
                    <button
                      onClick={() => {
                        if (sortBy === column) {
                          setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                        } else {
                          setSortBy(column as any);
                          setSortOrder("asc");
                        }
                      }}
                      className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-300 transition"
                    >
                      {column === "name" && "User"}
                      {column === "email" && "Email"}
                      {column === "mobile" && "Mobile"}
                      {column === "role" && "Role"}

                      
                      {sortBy === column && (
                        <span className="text-blue-500">
                          {sortOrder === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </button>
                  </th>
                ))}
                <th className="text-center p-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              <AnimatePresence mode="wait">
                {currentUsers.length > 0 ? (
                  currentUsers.map((user, index) => (
                    <motion.tr
                      key={user.userId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition group"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold shadow-md">
                            {user.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {user.fullName}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              ID: {user.user_public_id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {user.email}
                           
                          </span>
                         
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            
                            {user.mobileNumber}
                          </span>
                        </div>
                      </td>

                      <td className="p-4">
                        {getRoleBadge(user.role)}
                      
                      </td>

                      

                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleDeleteClick(user.userId)}
                            disabled={deleting}
                            className="p-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition disabled:opacity-50 group"
                            title="Delete user"
                          >
                            <Trash2 className="w-4 h-4 group-hover:scale-110 transition" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <AlertCircle className="w-12 h-12 text-gray-400" />
                        <p className="text-gray-500 dark:text-gray-400">No users found</p>
                        <button
                          onClick={() => {
                            setSearchTerm("");
                            setRoleFilter("all");
                          }}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          Clear filters
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-gray-200 dark:border-gray-800">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(1)}
                disabled={page === 1}
                className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                <ChevronLeft className="w-4 h-4" />
                <ChevronLeft className="w-4 h-4 -ml-2" />
              </button>
              
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }
                  
                  if (pageNum > 0 && pageNum <= totalPages) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`w-10 h-10 rounded-lg font-medium transition ${
                          page === pageNum
                            ? "bg-blue-600 text-white shadow-md"
                            : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                  return null;
                })}
              </div>

              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setPage(totalPages)}
                disabled={page === totalPages}
                className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                <ChevronRight className="w-4 h-4" />
                <ChevronRight className="w-4 h-4 -ml-2" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Delete User
                </h3>
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Are you sure you want to delete this user?
              </p>
              <p className="text-sm text-red-600 dark:text-red-400 mb-6">
                This action cannot be undone.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deleting}
                  className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-50"
                >
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Users;
import { useState } from "react";
import toast from "react-hot-toast";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Lock, 
  MoreVertical,
  Search,
  Shield,
  Mail,
  User,
  Activity,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import {
  useGetAllAdminsQuery,
  useRegisterAdminMutation,
  useUpdateAdminMutation,
  useUpdateAdminPasswordMutation,
  useDeleteAdminMutation,
} from "../Redux/api/authApi";

const AdminUserManagement = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data, isLoading, refetch } = useGetAllAdminsQuery();
  const [registerAdmin, { isLoading: isRegistering }] = useRegisterAdminMutation();
  const [updateAdmin, { isLoading: isUpdating }] = useUpdateAdminMutation();
  const [updatePassword, { isLoading: isUpdatingPassword }] = useUpdateAdminPasswordMutation();
  const [deleteAdmin, { isLoading: isDeleting }] = useDeleteAdminMutation();

  const admins = data?.admins || [];

  // Filter admins based on search and status
  const filteredAdmins = admins.filter((admin) => {
    const matchesSearch = 
      admin.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || admin.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateAdmin = async (formData: any) => {
    try {
      const res = await registerAdmin({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      }).unwrap();
      
      toast.success(res.message || "Admin created successfully");
      setIsCreateModalOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create admin");
    }
  };

  const handleUpdateAdmin = async (formData: any) => {
    try {
      const res = await updateAdmin({
        adminId: selectedAdmin.adminId,
        fullName: formData.fullName,
        email: formData.email,
        status: formData.status,
      }).unwrap();
      
      toast.success(res.message || "Admin updated successfully");
      setIsEditModalOpen(false);
      setSelectedAdmin(null);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update admin");
    }
  };

  const handleUpdatePassword = async (formData: any) => {
    try {
      const res = await updatePassword({
        adminId: selectedAdmin.adminId,
        password: formData.password,
      }).unwrap();
      
      toast.success(res.message || "Password updated successfully");
      setIsPasswordModalOpen(false);
      setSelectedAdmin(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update password");
    }
  };

  const handleDeleteAdmin = async () => {
    try {
      const res = await deleteAdmin(selectedAdmin.adminId).unwrap();
      
      toast.success(res.message || "Admin deleted successfully");
      setIsDeleteModalOpen(false);
      setSelectedAdmin(null);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete admin");
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle },
      inactive: { bg: "bg-yellow-100", text: "text-yellow-700", icon: AlertCircle },
      blocked: { bg: "bg-red-100", text: "text-red-700", icon: XCircle }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    const Icon = config.icon;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${config.bg} ${config.text}`}>
        <Icon size={12} />
        {status}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admins...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Management</h1>
              <p className="text-sm text-gray-500 mt-1">Manage system administrators and their permissions</p>
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Plus size={18} />
              Add New Admin
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Admins Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAdmins.map((admin) => (
            <div key={admin.adminId} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                    {admin.fullName?.charAt(0).toUpperCase()}
                  </div>
                  <div className="relative group">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                      <MoreVertical size={18} className="text-gray-500" />
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 hidden group-hover:block z-10">
                      <button
                        onClick={() => {
                          setSelectedAdmin(admin);
                          setIsEditModalOpen(true);
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Edit size={14} /> Edit Admin
                      </button>
                      <button
                        onClick={() => {
                          setSelectedAdmin(admin);
                          setIsPasswordModalOpen(true);
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Lock size={14} /> Change Password
                      </button>
                      <button
                        onClick={() => {
                          setSelectedAdmin(admin);
                          setIsDeleteModalOpen(true);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <Trash2 size={14} /> Delete Admin
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{admin.fullName}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Mail size={14} className="text-gray-400" />
                      <p className="text-sm text-gray-600">{admin.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <Shield size={14} className="text-gray-400" />
                      <span className="text-sm text-gray-600 capitalize">{admin.role || "Admin"}</span>
                    </div>
                    {getStatusBadge(admin.status)}
                  </div>

                  {admin.lastLogin && (
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Activity size={12} />
                      Last login: {new Date(admin.lastLogin).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredAdmins.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User size={32} className="text-gray-400" />
            </div>
            <p className="text-gray-500">No admins found</p>
          </div>
        )}
      </div>

      {/* Create Admin Modal */}
      {isCreateModalOpen && (
        <CreateAdminModal
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateAdmin}
          isLoading={isRegistering}
        />
      )}

      {/* Edit Admin Modal */}
      {isEditModalOpen && selectedAdmin && (
        <EditAdminModal
          admin={selectedAdmin}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedAdmin(null);
          }}
          onSubmit={handleUpdateAdmin}
          isLoading={isUpdating}
        />
      )}

      {/* Change Password Modal */}
      {isPasswordModalOpen && selectedAdmin && (
        <PasswordModal
          admin={selectedAdmin}
          onClose={() => {
            setIsPasswordModalOpen(false);
            setSelectedAdmin(null);
          }}
          onSubmit={handleUpdatePassword}
          isLoading={isUpdatingPassword}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedAdmin && (
        <DeleteModal
          admin={selectedAdmin}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedAdmin(null);
          }}
          onConfirm={handleDeleteAdmin}
          isLoading={isDeleting}
        />
      )}
    </div>
  );
};

// Create Admin Modal Component
const CreateAdminModal = ({ onClose, onSubmit, isLoading }: any) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" onClick={onClose}>
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-blue-500/50 " onClick={onClose}></div>
        
        <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Add New Admin</h2>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
              <XCircle size={20} className="text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
              >
                {isLoading ? "Creating..." : "Create Admin"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Edit Admin Modal Component
const EditAdminModal = ({ admin, onClose, onSubmit, isLoading }: any) => {
  const [formData, setFormData] = useState({
    fullName: admin.fullName,
    email: admin.email,
    status: admin.status,
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" onClick={onClose}>
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-blue-500/50 " onClick={onClose}></div>
        
        <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Edit Admin</h2>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
              <XCircle size={20} className="text-gray-500" />
            </button>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
              >
                {isLoading ? "Updating..." : "Update Admin"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Change Password Modal Component
const PasswordModal = ({ admin, onClose, onSubmit, isLoading }: any) => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" onClick={onClose}>
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-blue-500/50 " onClick={onClose}></div>
        
        <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Change Password</h2>
              <p className="text-sm text-gray-500 mt-1">For: {admin.fullName}</p>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
              <XCircle size={20} className="text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
              >
                {isLoading ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Delete Confirmation Modal Component
const DeleteModal = ({ admin, onClose, onConfirm, isLoading }: any) => {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" onClick={onClose}>
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-blue-500/50 " onClick={onClose}></div>
        
        <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
          <div className="p-6">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 size={32} className="text-red-600" />
              </div>
            </div>
            
            <h2 className="text-xl font-bold text-center text-gray-900 mb-2">Delete Admin</h2>
            <p className="text-center text-gray-600 mb-6">
              Are you sure you want to delete <span className="font-semibold">{admin.fullName}</span>? <br />
              This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition"
              >
                {isLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserManagement;
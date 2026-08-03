import { useState } from "react";
import toast from "react-hot-toast";
import {
  useGetAllVehicleRequestsQuery,
  useUpdateRequestStatusMutation,
} from "../Redux/api/bikebuyerApi";
import { 
  Eye, 
  CheckCircle, 
  XCircle, 
  Phone, 
  Mail, 
  MapPin, 
  IndianRupee,
  Calendar,
  Fuel,
  Gauge,
  CalendarDays,
  CreditCard,
  Clock,
  Bike,
  User,
  DollarSign,
  MessageCircle,
  Smartphone,
  Building2
} from "lucide-react";

const BikeBuyerRequest = () => {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { data, isLoading, refetch } = useGetAllVehicleRequestsQuery();
  const [updateStatus, { isLoading: updating }] = useUpdateRequestStatusMutation();

  const requests = data?.requests || [];

  const handleStatusUpdate = async (requestId: string, status: "approved" | "rejected") => {
    try {
      const res = await updateStatus({ requestId, status }).unwrap();
      toast.success(res.message);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update status");
    }
  };

  const openModal = (request: any) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      approved: { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle },
      rejected: { bg: "bg-red-100", text: "text-red-700", icon: XCircle },
      pending: { bg: "bg-yellow-100", text: "text-yellow-700", icon: Clock }
    };
    const config = statusConfig[status.toLowerCase()] || statusConfig.pending;
    const Icon = config.icon;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${config.bg} ${config.text}`}>
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
          <p className="text-gray-600">Loading requests...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Purchase Requests</h1>
              <p className="text-sm text-gray-500 mt-1">Manage and respond to buyer inquiries</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 px-4 py-2 rounded-lg">
                <span className="text-sm text-blue-600 font-medium">
                  Total: {requests.length} requests
                </span>
              </div>
              <button
                onClick={() => refetch()}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Buyer Info</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Vehicle</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Offer</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Payment</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {requests.length > 0 ? (
                  requests.map((request) => (
                    <tr key={request.requestId} className="hover:bg-gray-50 transition cursor-pointer" onClick={() => openModal(request)}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {request.fullName?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{request.fullName}</p>
                            <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                              <MapPin size={12} />
                              {request.city}, {request.state}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail size={14} className="text-gray-400" />
                            <a href={`mailto:${request.email}`} className="text-gray-600 hover:text-blue-600">
                              {request.email}
                            </a>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Phone size={14} className="text-gray-400" />
                            <a href={`tel:${request.phoneNumber}`} className="text-gray-600 hover:text-blue-600">
                              {request.phoneNumber}
                            </a>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Bike size={16} className="text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900">{request.vehicle?.vehicleTitle || request.vehicle?.brand || "-"}</p>
                            <p className="text-xs text-gray-500">{request.vehicle?.modalNumber || "-"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <IndianRupee size={14} className="text-gray-400" />
                          <span className="font-semibold text-gray-900">
                            {request.offeredPrice ? Number(request.offeredPrice).toLocaleString() : "-"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <CreditCard size={14} className="text-gray-400" />
                          <span className="capitalize text-sm">{request.paymentMethod}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(request.status)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openModal(request);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          >
                            <Eye size={18} />
                          </button>
                          {request.status === "pending" && (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStatusUpdate(request.requestId, "approved");
                                }}
                                disabled={updating}
                                className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm font-medium"
                              >
                                Approve
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStatusUpdate(request.requestId, "rejected");
                                }}
                                disabled={updating}
                                className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 text-sm font-medium"
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                          <Bike size={32} className="text-gray-400" />
                        </div>
                        <p className="text-gray-500">No purchase requests found</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 overflow-y-auto" onClick={closeModal}>
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={closeModal}></div>
            
            <div className="relative bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Request Details</h2>
                  <p className="text-sm text-gray-500 mt-1">ID: {selectedRequest.requestId}</p>
                </div>
                <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg transition">
                  <XCircle size={20} className="text-gray-500" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Buyer & Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <User className="text-blue-600" size={24} />
                      <h3 className="font-semibold text-gray-900">Buyer Information</h3>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Full Name</p>
                        <p className="font-medium text-gray-900">{selectedRequest.fullName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Location</p>
                        <div className="flex items-center gap-2">
                          <MapPin size={14} className="text-gray-400" />
                          <p>{selectedRequest.city}, {selectedRequest.state}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Message</p>
                        <div className="flex items-start gap-2 mt-1">
                          <MessageCircle size={14} className="text-gray-400 mt-0.5" />
                          <p className="text-gray-700 italic">"{selectedRequest.message || "No message provided"}"</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <Smartphone className="text-green-600" size={24} />
                      <h3 className="font-semibold text-gray-900">Contact Details</h3>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Email</p>
                        <div className="flex items-center gap-2">
                          <Mail size={14} className="text-gray-400" />
                          <a href={`mailto:${selectedRequest.email}`} className="text-blue-600 hover:underline">
                            {selectedRequest.email}
                          </a>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Phone</p>
                        <div className="flex items-center gap-2">
                          <Phone size={14} className="text-gray-400" />
                          <a href={`tel:${selectedRequest.phoneNumber}`} className="text-blue-600 hover:underline">
                            {selectedRequest.phoneNumber}
                          </a>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Preferred Contact Time</p>
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-gray-400" />
                          <p>{selectedRequest.preferredContactTime || "Anytime"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vehicle Details */}
                {selectedRequest.vehicle && (
                  <div className="bg-white border border-gray-200 rounded-xl p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <Bike className="text-purple-600" size={24} />
                      <h3 className="font-semibold text-gray-900">Vehicle Details</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Title & Model</p>
                        <p className="font-medium">{selectedRequest.vehicle.vehicleTitle || "-"}</p>
                        <p className="text-sm text-gray-600">{selectedRequest.vehicle.version || "-"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Registration Number</p>
                        <p className="font-mono text-sm">{selectedRequest.vehicle.modalNumber || "-"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Color</p>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: selectedRequest.vehicle.vehicleColor }}></div>
                          <p className="capitalize">{selectedRequest.vehicle.vehicleColor || "-"}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Manufacturing Year</p>
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-gray-400" />
                          <p>{selectedRequest.vehicle.manufacturingYear || "-"}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Fuel Type</p>
                        <div className="flex items-center gap-2">
                          <Fuel size={14} className="text-gray-400" />
                          <p>{selectedRequest.vehicle.fuelType || "-"}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase">KMs Driven</p>
                        <div className="flex items-center gap-2">
                          <Gauge size={14} className="text-gray-400" />
                          <p>{Number(selectedRequest.vehicle.kmsDriven).toLocaleString()} km</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Owner Type</p>
                        <p>{selectedRequest.vehicle.ownerType || "-"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Last Service</p>
                        <div className="flex items-center gap-2">
                          <CalendarDays size={14} className="text-gray-400" />
                          <p>{new Date(selectedRequest.vehicle.lastServiceDate).toLocaleDateString() || "-"}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Asking Price</p>
                        <div className="flex items-center gap-1">
                          <IndianRupee size={14} className="text-gray-400" />
                          <p className="font-semibold">₹{Number(selectedRequest.vehicle.sellingPrice).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Offer Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-yellow-50 rounded-xl p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <DollarSign className="text-yellow-600" size={24} />
                      <h3 className="font-semibold text-gray-900">Offer Details</h3>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Offered Price</p>
                        <p className="text-2xl font-bold text-green-600">
                          ₹{Number(selectedRequest.offeredPrice).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Payment Method</p>
                        <div className="flex items-center gap-2">
                          <CreditCard size={14} className="text-gray-400" />
                          <p className="capitalize">{selectedRequest.paymentMethod}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Test Ride Requested</p>
                        <p className={selectedRequest.testRideRequired ? "text-green-600 font-medium" : "text-red-600"}>
                          {selectedRequest.testRideRequired ? "✓ Yes" : "✗ No"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <Building2 className="text-gray-600" size={24} />
                      <h3 className="font-semibold text-gray-900">Status Information</h3>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Current Status</p>
                        {getStatusBadge(selectedRequest.status)}
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Request Created</p>
                        <p>{new Date(selectedRequest.createdAt).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Last Updated</p>
                        <p>{new Date(selectedRequest.updatedAt).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons in Modal */}
                {selectedRequest.status === "pending" && (
                  <div className="border-t border-gray-200 pt-6 flex gap-3 justify-end">
                    <button
                      onClick={() => {
                        handleStatusUpdate(selectedRequest.requestId, "rejected");
                        closeModal();
                      }}
                      disabled={updating}
                      className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition font-medium"
                    >
                      Reject Request
                    </button>
                    <button
                      onClick={() => {
                        handleStatusUpdate(selectedRequest.requestId, "approved");
                        closeModal();
                      }}
                      disabled={updating}
                      className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition font-medium"
                    >
                      Approve Request
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BikeBuyerRequest;
// src/pages/admin/ContactManagementPage.tsx
import React, { useState } from 'react';
import {
  Search,
  ChevronDown,
  ChevronUp,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  Mail,
  Phone,
  User,
  Calendar,
  MessageSquare,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import {
  useGetAllContactsQuery,
  useGetContactStatsQuery,
  useUpdateContactStatusMutation,
  useDeleteContactMutation,
  useBulkUpdateStatusMutation,
} from '../Redux/api/contactApi';
import type { Contact } from '../Redux/api/contactApi';

// Status configuration
const STATUS_CONFIG = {
  new: {
    label: 'New',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: AlertCircle,
  },
  in_progress: {
    label: 'In Progress',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: Clock,
  },
  resolved: {
    label: 'Resolved',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: CheckCircle,
  },
  closed: {
    label: 'Closed',
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: XCircle,
  },
} as const;

const ContactManagementPage: React.FC = () => {
  // State
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'view' | 'edit' | 'delete'>('view');
  const [editStatus, setEditStatus] = useState('');
  const [editRemark, setEditRemark] = useState('');
  const [bulkStatus, setBulkStatus] = useState('');
const [selectedMessage, setSelectedMessage] = useState<{
  name: string;
  message: string;
} | null>(null);
  // Queries
  const {
    data: contactsData,
    isLoading,
    error,
    refetch,
  } = useGetAllContactsQuery({
    page: currentPage,
    limit: itemsPerPage,
    status: statusFilter || undefined,
    search: searchTerm || undefined,
    sortBy,
    sortOrder,
  });

  const { data: statsData, refetch: refetchStats } = useGetContactStatsQuery();

  // Mutations
  const [updateStatus, { isLoading: isUpdating }] = useUpdateContactStatusMutation();
  const [deleteContact, { isLoading: isDeleting }] = useDeleteContactMutation();
  const [bulkUpdate, { isLoading: isBulkUpdating }] = useBulkUpdateStatusMutation();

  // Handlers
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortBy(field);
      setSortOrder('DESC');
    }
  };

  const toggleSelection = (contactId: string) => {
    setSelectedContacts((prev) =>
      prev.includes(contactId)
        ? prev.filter((id) => id !== contactId)
        : [...prev, contactId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedContacts.length === contactsData?.data.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(contactsData?.data.map((c) => c.contactId) || []);
    }
  };

  const handleOpenModal = (contact: Contact, type: 'view' | 'edit' | 'delete') => {
    setSelectedContact(contact);
    setModalType(type);
    setEditStatus(contact.status);
    setEditRemark(contact.adminRemark || '');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedContact(null);
  };

  const handleUpdateStatus = async () => {
    if (!selectedContact) return;
    try {
      await updateStatus({
        id: selectedContact.contactId,
        data: { status: editStatus as any, adminRemark: editRemark },
      }).unwrap();
      handleCloseModal();
      refetch();
      refetchStats();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleDelete = async () => {
    if (!selectedContact) return;
    try {
      await deleteContact(selectedContact.contactId).unwrap();
      handleCloseModal();
      refetch();
      refetchStats();
    } catch (error) {
      console.error('Failed to delete contact:', error);
    }
  };

  const handleBulkUpdate = async () => {
    if (selectedContacts.length === 0 || !bulkStatus) return;
    try {
      await bulkUpdate({
        contactIds: selectedContacts,
        status: bulkStatus as any,
        adminRemark: `Bulk updated to ${bulkStatus}`,
      }).unwrap();
      setSelectedContacts([]);
      setBulkStatus('');
      refetch();
      refetchStats();
    } catch (error) {
      console.error('Failed to bulk update:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading contacts...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto" />
          <p className="mt-4 text-red-600">Failed to load contacts</p>
          <button
            onClick={() => refetch()}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const contacts = contactsData?.data || [];
  const pagination = contactsData?.pagination;
  const stats = statsData?.data;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Contact Messages</h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage all customer inquiries and support requests
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => refetch()}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            {stats.byStatus.map(({ status, count }) => {
              const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG];
              const Icon = config?.icon || AlertCircle;
              return (
                <div
                  key={status}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500 capitalize">
                      {status.replace('_', ' ')}
                    </p>
                    <Icon className="h-4 w-4 text-gray-400" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{count}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or message..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={statusFilter}
                onChange={handleStatusFilter}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
              >
                <option value="">All Status</option>
                <option value="new">New</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
              {selectedContacts.length > 0 && (
                <div className="flex gap-2">
                  <select
                    value={bulkStatus}
                    onChange={(e) => setBulkStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                  >
                    <option value="">Bulk Action</option>
                    <option value="in_progress">Mark as In Progress</option>
                    <option value="resolved">Mark as Resolved</option>
                    <option value="closed">Mark as Closed</option>
                  </select>
                  <button
                    onClick={handleBulkUpdate}
                    disabled={!bulkStatus || isBulkUpdating}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isBulkUpdating ? 'Updating...' : 'Apply'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedContacts.length === contacts.length && contacts.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                    onClick={() => handleSort('firstName')}
                  >
                    <div className="flex items-center gap-1">
                      Name
                      {sortBy === 'firstName' && (
                        sortOrder === 'ASC' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact Info
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Message
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center gap-1">
                      Status
                      {sortBy === 'status' && (
                        sortOrder === 'ASC' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                    onClick={() => handleSort('createdAt')}
                  >
                    <div className="flex items-center gap-1">
                      Created
                      {sortBy === 'createdAt' && (
                        sortOrder === 'ASC' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {contacts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-gray-500">
                      <MessageSquare className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                      <p>No contact messages found</p>
                    </td>
                  </tr>
                ) : (
                  contacts.map((contact) => {
                    const statusConfig = STATUS_CONFIG[contact.status as keyof typeof STATUS_CONFIG];
                    const StatusIcon = statusConfig?.icon || AlertCircle;
                    
                    return (
                      <tr key={contact.contactId} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedContacts.includes(contact.contactId)}
                            onChange={() => toggleSelection(contact.contactId)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                              <User className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {contact.firstName} {contact.lastName}
                              </p>
                              <p className="text-xs text-gray-500">
                                {contact.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Mail className="h-3 w-3" />
                              <a href={`mailto:${contact.email}`} className="hover:text-blue-600">
                                {contact.email}
                              </a>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Phone className="h-3 w-3" />
                              <a href={`tel:${contact.phoneNumber}`} className="hover:text-blue-600">
                                {contact.phoneNumber}
                              </a>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
  <div className="max-w-xs">
    <p className="text-sm text-gray-700">
  {contact.message.slice(0, 10)}
  {contact.message.length > 10 && "..."}
</p>

    {contact.message.length > 10 && (
      <button
        onClick={() =>
          setSelectedMessage({
            name: `${contact.firstName} ${contact.lastName}`,
            message: contact.message,
          })
        }
        className="mt-2 text-blue-600 hover:underline text-xs font-medium"
      >
        Read More
      </button>
    )}

    {contact.adminRemark && (
      <p className="text-xs text-gray-500 mt-1">
        Remark: {contact.adminRemark}
      </p>
    )}
  </div>
  {selectedMessage && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 mx-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">
          Message from {selectedMessage.name}
        </h2>

        <button
          onClick={() => setSelectedMessage(null)}
          className="text-gray-500 hover:text-black text-xl"
        >
          ✕
        </button>
      </div>

      <div className="max-h-96 overflow-y-auto">
        <p className="text-gray-700 whitespace-pre-wrap leading-7">
          {selectedMessage.message}
        </p>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={() => setSelectedMessage(null)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}
</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${statusConfig?.color || 'bg-gray-100 text-gray-800'}`}>
                            <StatusIcon className="h-3 w-3" />
                            {statusConfig?.label || contact.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Calendar className="h-3 w-3" />
                            {formatDate(contact.createdAt)}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            
                            <button
                              onClick={() => handleOpenModal(contact, 'delete')}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
            
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="px-4 py-3 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-500">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                {pagination.total} entries
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  const pageNum = i + Math.max(1, currentPage - 2);
                  if (pageNum > pagination.totalPages) return null;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 rounded-lg text-sm transition ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
                  disabled={currentPage === pagination.totalPages}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedContact && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={handleCloseModal}
            ></div>

            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  {modalType === 'view' && 'Contact Details'}
                  {modalType === 'edit' && 'Update Contact'}
                  {modalType === 'delete' && 'Delete Contact'}
                </h3>
              </div>

              <div className="px-6 py-4">
                {modalType === 'view' && (
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase">Name</p>
                      <p className="text-sm text-gray-900 mt-1">
                        {selectedContact.firstName} {selectedContact.lastName}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase">Email</p>
                      <p className="text-sm text-gray-900 mt-1">{selectedContact.email}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase">Phone</p>
                      <p className="text-sm text-gray-900 mt-1">{selectedContact.phoneNumber}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase">Message</p>
                      <p className="text-sm text-gray-900 mt-1 whitespace-pre-wrap">
                        {selectedContact.message}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase">Status</p>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border mt-1 ${
                        STATUS_CONFIG[selectedContact.status as keyof typeof STATUS_CONFIG]?.color
                      }`}>
                        {STATUS_CONFIG[selectedContact.status as keyof typeof STATUS_CONFIG]?.label}
                      </span>
                    </div>
                    {selectedContact.adminRemark && (
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase">Admin Remark</p>
                        <p className="text-sm text-gray-900 mt-1">{selectedContact.adminRemark}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase">Created At</p>
                      <p className="text-sm text-gray-900 mt-1">
                        {formatDate(selectedContact.createdAt)}
                      </p>
                    </div>
                  </div>
                )}

                {modalType === 'edit' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      >
                        <option value="new">New</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Admin Remark
                      </label>
                      <textarea
                        value={editRemark}
                        onChange={(e) => setEditRemark(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                        placeholder="Add a remark..."
                      />
                    </div>
                  </div>
                )}

                {modalType === 'delete' && (
                  <div className="text-center py-4">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <p className="text-gray-700">
                      Are you sure you want to delete this contact message from{' '}
                      <strong>{selectedContact.firstName} {selectedContact.lastName}</strong>?
                    </p>
                    <p className="text-sm text-gray-500 mt-2">This action cannot be undone.</p>
                  </div>
                )}
              </div>

              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                {modalType === 'edit' && (
                  <button
                    onClick={handleUpdateStatus}
                    disabled={isUpdating}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUpdating ? 'Updating...' : 'Update'}
                  </button>
                )}
                {modalType === 'delete' && (
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactManagementPage;
import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Users,
  Building2,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Eye,
  Edit2,
  Trash2,
  DollarSign,
  ShoppingCart,
  Calendar,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { DataTable } from '../components/common/DataTable';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { SearchBar } from '../components/common/SearchBar';
import { StatCard } from '../components/common/StatCard';
import { StatusBadge } from '../components/common/StatusBadge';

export const Customers = () => {
  const navigate = useNavigate();
  const { customers, orders, addCustomer, updateCustomer, deleteCustomer } = useApp();

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [viewingCustomer, setViewingCustomer] = useState(null);
  const [customerToDelete, setCustomerToDelete] = useState(null);

  // Form State
  const initialFormData = {
    id: '',
    name: '',
    company: '',
    industry: 'Industrial Automation',
    email: '',
    phone: '',
    address: '',
    status: 'Active'
  };

  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});

  // Industries list
  const industries = [
    'Aerospace & Defense',
    'Industrial Automation',
    'Heavy Equipment',
    'Medical Devices',
    'Renewable Energy & EV',
    'Photonics & Research',
    'Consumer Electronics',
    'General Manufacturing'
  ];

  // Filtered Customers
  const filteredCustomers = useMemo(() => {
    return customers.filter((cust) => {
      const q = searchTerm.toLowerCase();
      return (
        cust.company.toLowerCase().includes(q) ||
        cust.name.toLowerCase().includes(q) ||
        cust.email.toLowerCase().includes(q) ||
        cust.id.toLowerCase().includes(q)
      );
    });
  }, [customers, searchTerm]);

  // Customer Orders lookup
  const getCustomerOrders = (customerId) => {
    return orders.filter((o) => o.customerId === customerId);
  };

  // Top Customer
  const topCustomer = useMemo(() => {
    if (!customers.length) return null;
    return [...customers].sort((a, b) => (b.totalSpent || 0) - (a.totalSpent || 0))[0];
  }, [customers]);

  const totalClientsCount = customers.length;
  const totalOrdersPlaced = customers.reduce((sum, c) => sum + (c.ordersCount || 0), 0);
  const cumulativeClientValue = customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0);

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingCustomer(null);
    const nextNum = 107 + customers.length;
    setFormData({
      ...initialFormData,
      id: `CUST-${nextNum}`
    });
    setFormErrors({});
    setIsAddEditModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (cust) => {
    setEditingCustomer(cust);
    setFormData({ ...cust });
    setFormErrors({});
    setIsAddEditModalOpen(true);
  };

  // Validation
  const validateForm = () => {
    const errors = {};
    if (!formData.company.trim()) errors.company = 'Company name is required.';
    if (!formData.name.trim()) errors.name = 'Contact representative name is required.';
    if (!formData.email.trim() || !formData.email.includes('@')) {
      errors.email = 'Valid email address is required.';
    }
    if (!formData.phone.trim()) errors.phone = 'Phone number is required.';
    if (!formData.address.trim()) errors.address = 'Company plant/office address is required.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingCustomer) {
      updateCustomer(editingCustomer.id, formData);
    } else {
      addCustomer(formData);
    }
    setIsAddEditModalOpen(false);
  };

  // Table Columns
  const columns = [
    {
      key: 'id',
      header: 'Account ID',
      width: '110px',
      render: (row) => (
        <span className="font-mono font-bold text-orange-600 text-xs">
          {row.id}
        </span>
      )
    },
    {
      key: 'company',
      header: 'Company & Representative',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 border border-orange-200 flex items-center justify-center font-bold text-xs shrink-0">
            {row.company.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-slate-900 text-xs sm:text-sm">{row.company}</p>
            <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
              <span>{row.name}</span>
              <span>•</span>
              <span className="text-slate-400">{row.industry}</span>
            </p>
          </div>
        </div>
      )
    },
    {
      key: 'contact',
      header: 'Contact Info',
      render: (row) => (
        <div className="text-xs space-y-0.5">
          <div className="flex items-center gap-1.5 text-slate-700">
            <Mail className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="truncate max-w-[170px]">{row.email}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
            <Phone className="w-3 h-3 text-slate-400 shrink-0" />
            <span>{row.phone}</span>
          </div>
        </div>
      )
    },
    {
      key: 'address',
      header: 'Location',
      render: (row) => (
        <div className="flex items-center gap-1 text-xs text-slate-600 max-w-[180px] truncate" title={row.address}>
          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
          <span className="truncate">{row.address}</span>
        </div>
      )
    },
    {
      key: 'ordersCount',
      header: 'Orders',
      align: 'center',
      width: '90px',
      render: (row) => (
        <span className="inline-flex items-center justify-center font-mono font-bold text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800">
          {row.ordersCount || 0}
        </span>
      )
    },
    {
      key: 'totalSpent',
      header: 'Total Spent',
      align: 'right',
      width: '120px',
      render: (row) => (
        <span className="font-mono font-bold text-slate-900 text-xs sm:text-sm">
          ${(row.totalSpent || 0).toLocaleString()}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      width: '140px',
      render: (row) => (
        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => setViewingCustomer(row)}
            className="p-1.5 text-slate-500 hover:text-orange-600 hover:bg-orange-50 rounded-md transition-colors"
            title="View Profile & Orders"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleOpenEdit(row)}
            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            title="Edit Customer"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setCustomerToDelete(row)}
            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
            title="Delete Customer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Customer Directory
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage commercial accounts, client procurement contacts, and historical order portfolios.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-semibold text-sm rounded-xl shadow-xs transition-all duration-150 focus:ring-2 focus:ring-orange-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Customer</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Accounts"
          value={totalClientsCount}
          icon={Building2}
          trend="100% Active"
          trendType="up"
          description="B2B Manufacturing clients"
          accentColor="blue"
        />
        <StatCard
          title="Total Orders Placed"
          value={totalOrdersPlaced}
          icon={ShoppingCart}
          trend="Recurring orders"
          trendType="up"
          description="Across all accounts"
          accentColor="orange"
        />
        <StatCard
          title="Client Revenue"
          value={`$${cumulativeClientValue.toLocaleString()}`}
          icon={DollarSign}
          trend="Total billings"
          trendType="up"
          description="Lifetime contracted volume"
          accentColor="emerald"
        />
        <StatCard
          title="Top Customer"
          value={topCustomer ? topCustomer.company.split(' ')[0] : 'Apex'}
          icon={Briefcase}
          trend={`$${(topCustomer?.totalSpent || 0).toLocaleString()}`}
          trendType="neutral"
          description={topCustomer?.company || 'Primary account'}
          accentColor="amber"
        />
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div className="max-w-md w-full">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search by company name, contact person, or email..."
          />
        </div>
      </div>

      {/* Customers Data Table */}
      <DataTable
        columns={columns}
        data={filteredCustomers}
        onRowClick={(row) => setViewingCustomer(row)}
        defaultItemsPerPage={8}
      />

      {/* VIEW CUSTOMER & ORDER HISTORY MODAL */}
      {viewingCustomer && (
        <Modal
          isOpen={!!viewingCustomer}
          onClose={() => setViewingCustomer(null)}
          title={`Customer Profile: ${viewingCustomer.company}`}
          subtitle={`Primary Representative: ${viewingCustomer.name} (${viewingCustomer.id})`}
          size="xl"
        >
          <div className="space-y-6">
            {/* Top Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <span className="text-slate-400 block mb-1">Contact Email &amp; Phone:</span>
                <p className="font-semibold text-slate-800">{viewingCustomer.email}</p>
                <p className="text-slate-600 font-mono mt-0.5">{viewingCustomer.phone}</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <span className="text-slate-400 block mb-1">Plant Location / Shipping:</span>
                <p className="font-semibold text-slate-800">{viewingCustomer.address}</p>
                <p className="text-slate-500 mt-0.5">Industry: {viewingCustomer.industry}</p>
              </div>

              <div className="p-3.5 bg-orange-50/70 rounded-xl border border-orange-200/80 text-xs">
                <span className="text-orange-600 font-bold block mb-1">Commercial Summary:</span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-slate-600">Total Orders:</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {getCustomerOrders(viewingCustomer.id).length || viewingCustomer.ordersCount}
                  </span>
                </div>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-slate-600">Total Invoiced:</span>
                  <span className="font-mono font-extrabold text-orange-600 text-sm">
                    ${(viewingCustomer.totalSpent || 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Order History Table */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <ShoppingCart className="w-3.5 h-3.5 text-orange-500" />
                  <span>Customer Purchase Order History</span>
                </h4>
                <button
                  type="button"
                  onClick={() => {
                    setViewingCustomer(null);
                    navigate('/orders');
                  }}
                  className="text-xs font-semibold text-orange-600 hover:text-orange-700"
                >
                  Create New Order for Client &rarr;
                </button>
              </div>

              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-slate-700 font-semibold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="px-3.5 py-2.5">Order ID</th>
                      <th className="px-3.5 py-2.5">Product</th>
                      <th className="px-3.5 py-2.5">Quantity</th>
                      <th className="px-3.5 py-2.5">Order Date</th>
                      <th className="px-3.5 py-2.5">Status</th>
                      <th className="px-3.5 py-2.5 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {getCustomerOrders(viewingCustomer.id).length > 0 ? (
                      getCustomerOrders(viewingCustomer.id).map((ord) => (
                        <tr key={ord.id} className="hover:bg-slate-50">
                          <td className="px-3.5 py-2.5 font-mono font-bold text-orange-600">
                            {ord.id}
                          </td>
                          <td className="px-3.5 py-2.5 font-medium text-slate-900">
                            {ord.productName}
                          </td>
                          <td className="px-3.5 py-2.5 font-mono">{ord.quantity} units</td>
                          <td className="px-3.5 py-2.5 text-slate-500">{ord.orderDate}</td>
                          <td className="px-3.5 py-2.5">
                            <StatusBadge status={ord.status} />
                          </td>
                          <td className="px-3.5 py-2.5 text-right font-mono font-bold text-slate-900">
                            ${ord.totalAmount.toLocaleString()}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                          No order history linked to this customer yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setViewingCustomer(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Close Profile
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ADD / EDIT CUSTOMER MODAL */}
      <Modal
        isOpen={isAddEditModalOpen}
        onClose={() => setIsAddEditModalOpen(false)}
        title={editingCustomer ? `Edit Customer: ${editingCustomer.company}` : 'Register New Commercial Customer'}
        subtitle="Record company information and primary procurement liaison."
        size="lg"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Account ID
              </label>
              <input
                type="text"
                value={formData.id}
                readOnly
                className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-600 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Industry Sector
              </label>
              <select
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              >
                {industries.map((ind) => (
                  <option key={ind} value={ind}>
                    {ind}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Company Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="e.g. Apex Aerospace Ltd."
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
              {formErrors.company && (
                <p className="text-rose-500 text-[11px] mt-1">{formErrors.company}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Contact Representative <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Sarah Jenkins"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
              {formErrors.name && (
                <p className="text-rose-500 text-[11px] mt-1">{formErrors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Official Email <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g. s.jenkins@apexaero.com"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
              {formErrors.email && (
                <p className="text-rose-500 text-[11px] mt-1">{formErrors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="e.g. +1 (555) 234-8901"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
              {formErrors.phone && (
                <p className="text-rose-500 text-[11px] mt-1">{formErrors.phone}</p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Facility / Delivery Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="e.g. 400 Skyward Way, Seattle, WA"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
              {formErrors.address && (
                <p className="text-rose-500 text-[11px] mt-1">{formErrors.address}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddEditModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-500 rounded-lg shadow-sm transition-colors"
            >
              {editingCustomer ? 'Save Profile Changes' : 'Register Customer'}
            </button>
          </div>
        </form>
      </Modal>

      {/* DELETE CONFIRMATION DIALOG */}
      <ConfirmDialog
        isOpen={!!customerToDelete}
        onClose={() => setCustomerToDelete(null)}
        onConfirm={() => {
          if (customerToDelete) deleteCustomer(customerToDelete.id);
        }}
        title="Delete Customer Account"
        message={`Are you sure you want to remove ${customerToDelete?.company} (${customerToDelete?.id})? This will detach client metadata.`}
        confirmText="Delete Account"
        type="danger"
      />
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Filter,
  Eye,
  Edit2,
  Trash2,
  Calendar,
  AlertCircle,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  Printer,
  ChevronDown,
  ArrowUpDown,
  Building2,
  Cpu,
  Package
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { DataTable } from '../components/common/DataTable';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { SearchBar } from '../components/common/SearchBar';

export const Orders = () => {
  const {
    orders,
    customers,
    addOrder,
    updateOrder,
    deleteOrder,
    updateOrderStatus,
    addProductionRun,
    globalSearch,
    setGlobalSearch
  } = useApp();

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState(globalSearch || '');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [dateFilter, setDateFilter] = useState('');

  // Modals state
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [viewingOrder, setViewingOrder] = useState(null);
  const [orderToDelete, setOrderToDelete] = useState(null);

  // Form State
  const initialFormData = {
    id: '',
    customerId: '',
    customerName: '',
    productName: '',
    quantity: 50,
    unitPrice: 150,
    orderDate: new Date().toISOString().split('T')[0],
    deliveryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    priority: 'Medium',
    status: 'Pending',
    notes: '',
    assignedLine: 'Unassigned'
  };

  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.productName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = selectedStatus === 'All' || order.status === selectedStatus;
      const matchesPriority = selectedPriority === 'All' || order.priority === selectedPriority;
      const matchesDate = !dateFilter || order.orderDate >= dateFilter;

      return matchesSearch && matchesStatus && matchesPriority && matchesDate;
    });
  }, [orders, searchTerm, selectedStatus, selectedPriority, dateFilter]);

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingOrder(null);
    const nextNum = 1051 + orders.length;
    setFormData({
      ...initialFormData,
      id: `ORD-${nextNum}`,
      orderDate: new Date().toISOString().split('T')[0],
      deliveryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
    setFormErrors({});
    setIsAddEditModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (order) => {
    setEditingOrder(order);
    setFormData({
      ...order,
      quantity: Number(order.quantity),
      unitPrice: Number(order.unitPrice)
    });
    setFormErrors({});
    setIsAddEditModalOpen(true);
  };

  // Customer dropdown selection sync
  const handleCustomerSelect = (e) => {
    const custId = e.target.value;
    const selectedCust = customers.find((c) => c.id === custId);
    if (selectedCust) {
      setFormData((prev) => ({
        ...prev,
        customerId: selectedCust.id,
        customerName: selectedCust.company
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        customerId: '',
        customerName: ''
      }));
    }
  };

  // Form Validation & Submission
  const validateForm = () => {
    const errors = {};
    if (!formData.customerName.trim()) errors.customerName = 'Customer is required.';
    if (!formData.productName.trim()) errors.productName = 'Product name is required.';
    if (!formData.quantity || formData.quantity <= 0) errors.quantity = 'Quantity must be greater than 0.';
    if (!formData.unitPrice || formData.unitPrice <= 0) errors.unitPrice = 'Unit price must be positive.';
    if (!formData.orderDate) errors.orderDate = 'Order date is required.';
    if (!formData.deliveryDate) errors.deliveryDate = 'Delivery date is required.';
    if (new Date(formData.deliveryDate) < new Date(formData.orderDate)) {
      errors.deliveryDate = 'Delivery date cannot be before order date.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingOrder) {
      updateOrder(editingOrder.id, formData);
    } else {
      addOrder(formData);
    }
    setIsAddEditModalOpen(false);
  };

  // Quick Action to send order into Production Run
  const handleSendToProduction = (order) => {
    addProductionRun({
      orderId: order.id,
      productName: order.productName,
      quantity: order.quantity,
      startDate: new Date().toISOString().split('T')[0],
      completionDate: order.deliveryDate,
      supervisor: 'Elena Rostova',
      workstation: 'Line 1 - 5-Axis CNC Milling',
      status: 'In Progress',
      progress: 15,
      priority: order.priority,
      stage: 'Workpiece Fixturing',
      notes: `Batch initiated directly from Order #${order.id}. ${order.notes || ''}`
    });
    setViewingOrder(null);
  };

  // Table Columns Definition
  const columns = [
    {
      key: 'id',
      header: 'Order ID',
      width: '120px',
      render: (row) => (
        <span className="font-mono font-bold text-orange-600 text-xs sm:text-sm">
          {row.id}
        </span>
      )
    },
    {
      key: 'customerName',
      header: 'Customer',
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
            {row.customerName ? row.customerName.charAt(0) : 'C'}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-slate-900 truncate max-w-[160px] sm:max-w-[200px]">
              {row.customerName}
            </p>
            <span className="text-[11px] text-slate-400">{row.customerId || 'Direct Client'}</span>
          </div>
        </div>
      )
    },
    {
      key: 'productName',
      header: 'Product & Qty',
      render: (row) => (
        <div>
          <p className="font-medium text-slate-800 line-clamp-1">{row.productName}</p>
          <span className="text-xs text-slate-500 font-mono font-medium">
            {row.quantity} units @ ${row.unitPrice}
          </span>
        </div>
      )
    },
    {
      key: 'orderDate',
      header: 'Dates',
      render: (row) => (
        <div className="text-xs">
          <p className="text-slate-700">Ordered: {row.orderDate}</p>
          <p className="text-slate-400 text-[11px]">Due: {row.deliveryDate}</p>
        </div>
      )
    },
    {
      key: 'priority',
      header: 'Priority',
      width: '100px',
      render: (row) => <StatusBadge status={row.priority} />
    },
    {
      key: 'status',
      header: 'Status',
      width: '130px',
      render: (row) => <StatusBadge status={row.status} />
    },
    {
      key: 'totalAmount',
      header: 'Total Value',
      align: 'right',
      render: (row) => (
        <span className="font-mono font-bold text-slate-900">
          ${Number(row.totalAmount).toLocaleString()}
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
            onClick={() => setViewingOrder(row)}
            className="p-1.5 text-slate-500 hover:text-orange-600 hover:bg-orange-50 rounded-md transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleOpenEdit(row)}
            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            title="Edit Order"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setOrderToDelete(row)}
            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
            title="Delete Order"
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
            Customer Orders
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage incoming purchase orders, manufacturing specifications, and delivery schedules.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-semibold text-sm rounded-xl shadow-xs transition-all duration-150 focus:ring-2 focus:ring-orange-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Order</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <SearchBar
            value={searchTerm}
            onChange={(val) => {
              setSearchTerm(val);
              setGlobalSearch(val);
            }}
            placeholder="Search by Order ID, customer, or product..."
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="font-semibold text-slate-500">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            >
              <option value="All">All Statuses ({orders.length})</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="In Production">In Production</option>
              <option value="Completed">Completed</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="font-semibold text-slate-500">Priority:</span>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            >
              <option value="All">All Priorities</option>
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Date Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="font-semibold text-slate-500">Since:</span>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="py-1 px-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            />
          </div>

          {(searchTerm || selectedStatus !== 'All' || selectedPriority !== 'All' || dateFilter) && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setSelectedStatus('All');
                setSelectedPriority('All');
                setDateFilter('');
                setGlobalSearch('');
              }}
              className="text-xs font-semibold text-orange-600 hover:text-orange-700 underline px-1"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Orders Data Table */}
      <DataTable
        columns={columns}
        data={filteredOrders}
        onRowClick={(row) => setViewingOrder(row)}
        defaultItemsPerPage={8}
      />

      {/* ADD / EDIT ORDER MODAL */}
      <Modal
        isOpen={isAddEditModalOpen}
        onClose={() => setIsAddEditModalOpen(false)}
        title={editingOrder ? `Edit Order #${editingOrder.id}` : 'Create New Customer Order'}
        subtitle="Provide complete fabrication specifications and delivery expectations."
        size="lg"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Auto-generated Order ID */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Order ID
              </label>
              <input
                type="text"
                value={formData.id}
                readOnly
                className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-600 cursor-not-allowed"
              />
              <span className="text-[10px] text-slate-400">Generated automatically by system</span>
            </div>

            {/* Customer Dropdown */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Select Customer <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.customerId}
                onChange={handleCustomerSelect}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              >
                <option value="">-- Choose Existing Client --</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.company} ({c.name})
                  </option>
                ))}
              </select>
              {formErrors.customerName && (
                <p className="text-rose-500 text-[11px] mt-1">{formErrors.customerName}</p>
              )}
            </div>

            {/* Custom Customer Name fallback */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Customer Name / Account Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                placeholder="e.g. Apex Aerospace Ltd."
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            {/* Product Name */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Product / Part Description <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.productName}
                onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                placeholder="e.g. CNC Anodized Turbine Housings"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
              {formErrors.productName && (
                <p className="text-rose-500 text-[11px] mt-1">{formErrors.productName}</p>
              )}
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Quantity <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: Math.max(1, parseInt(e.target.value) || 1) })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
              {formErrors.quantity && (
                <p className="text-rose-500 text-[11px] mt-1">{formErrors.quantity}</p>
              )}
            </div>

            {/* Unit Price */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Unit Price ($) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="0.1"
                step="0.5"
                value={formData.unitPrice}
                onChange={(e) => setFormData({ ...formData, unitPrice: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
              {formErrors.unitPrice && (
                <p className="text-rose-500 text-[11px] mt-1">{formErrors.unitPrice}</p>
              )}
            </div>

            {/* Total Value Readout */}
            <div className="sm:col-span-2 p-3 bg-orange-50/60 border border-orange-200/60 rounded-xl flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">Computed Order Total:</span>
              <span className="text-base font-extrabold font-mono text-orange-600">
                ${(Number(formData.quantity || 0) * Number(formData.unitPrice || 0)).toLocaleString()}
              </span>
            </div>

            {/* Order Date */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Order Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={formData.orderDate}
                onChange={(e) => setFormData({ ...formData, orderDate: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
              {formErrors.orderDate && (
                <p className="text-rose-500 text-[11px] mt-1">{formErrors.orderDate}</p>
              )}
            </div>

            {/* Expected Delivery Date */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Expected Delivery Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={formData.deliveryDate}
                onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
              {formErrors.deliveryDate && (
                <p className="text-rose-500 text-[11px] mt-1">{formErrors.deliveryDate}</p>
              )}
            </div>

            {/* Priority */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Priority Level
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            {/* Order Status */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Order Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              >
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="In Production">In Production</option>
                <option value="Completed">Completed</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {/* Additional Notes / Specs */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Engineering Specifications &amp; Notes
              </label>
              <textarea
                rows="3"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Tolerances, surface finish, inspection requirements, packaging instructions..."
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
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
              {editingOrder ? 'Save Changes' : 'Create Order'}
            </button>
          </div>
        </form>
      </Modal>

      {/* VIEW ORDER DETAILS MODAL */}
      {viewingOrder && (
        <Modal
          isOpen={!!viewingOrder}
          onClose={() => setViewingOrder(null)}
          title={`Order Specification: ${viewingOrder.id}`}
          subtitle={`Placed by ${viewingOrder.customerName}`}
          size="lg"
        >
          <div className="space-y-6 text-xs sm:text-sm">
            {/* Top Stepper for Order Status Progress */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-3">
                Lifecycle Progression
              </p>
              <div className="grid grid-cols-5 gap-1 text-center">
                {['Pending', 'Confirmed', 'In Production', 'Completed', 'Delivered'].map((step, idx) => {
                  const stepIndex = ['Pending', 'Confirmed', 'In Production', 'Completed', 'Delivered'].indexOf(
                    viewingOrder.status
                  );
                  const isDone = stepIndex >= idx;
                  const isCurrent = viewingOrder.status === step;

                  return (
                    <div key={step} className="flex flex-col items-center">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs mb-1 ${
                          isCurrent
                            ? 'bg-orange-500 text-white ring-4 ring-orange-100'
                            : isDone
                            ? 'bg-emerald-500 text-white'
                            : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {isDone ? '✓' : idx + 1}
                      </div>
                      <span
                        className={`text-[10px] sm:text-xs truncate max-w-full ${
                          isCurrent ? 'font-bold text-orange-600' : 'text-slate-500'
                        }`}
                      >
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Status Updater */}
            <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-700">Current Status:</span>
                <StatusBadge status={viewingOrder.status} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Update to:</span>
                <select
                  value={viewingOrder.status}
                  onChange={(e) => {
                    updateOrderStatus(viewingOrder.id, e.target.value);
                    setViewingOrder({ ...viewingOrder, status: e.target.value });
                  }}
                  className="px-2.5 py-1 text-xs border border-slate-200 rounded-lg bg-slate-50 font-medium"
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="In Production">In Production</option>
                  <option value="Completed">Completed</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Detailed Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-orange-500" />
                  <span>Customer &amp; Account</span>
                </h4>
                <div className="space-y-1 text-xs">
                  <p><span className="text-slate-400">Account:</span> <span className="font-semibold text-slate-800">{viewingOrder.customerName}</span></p>
                  <p><span className="text-slate-400">Account ID:</span> <span className="font-mono text-slate-700">{viewingOrder.customerId || 'CUST-DIRECT'}</span></p>
                  <p><span className="text-slate-400">Assigned Line:</span> <span className="text-slate-800">{viewingOrder.assignedLine || 'Workstation Pool'}</span></p>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Package className="w-3.5 h-3.5 text-blue-500" />
                  <span>Fabrication Specs</span>
                </h4>
                <div className="space-y-1 text-xs">
                  <p><span className="text-slate-400">Product:</span> <span className="font-semibold text-slate-800">{viewingOrder.productName}</span></p>
                  <p><span className="text-slate-400">Batch Qty:</span> <span className="font-mono font-bold text-slate-900">{viewingOrder.quantity} units</span></p>
                  <p><span className="text-slate-400">Unit Cost:</span> <span className="font-mono text-slate-700">${viewingOrder.unitPrice}</span></p>
                  <p><span className="text-slate-400">Total Value:</span> <span className="font-mono font-bold text-orange-600 text-sm">${viewingOrder.totalAmount?.toLocaleString()}</span></p>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="p-4 rounded-xl bg-orange-50/40 border border-orange-100 text-xs">
              <span className="font-bold text-slate-800 block mb-1">Manufacturing Quality Instructions:</span>
              <p className="text-slate-600 leading-relaxed">
                {viewingOrder.notes || 'Standard manufacturing tolerance applies. No custom engineering notes recorded.'}
              </p>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-medium"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Order Slip</span>
              </button>

              <div className="flex items-center gap-2">
                {viewingOrder.status !== 'In Production' && viewingOrder.status !== 'Completed' && (
                  <button
                    type="button"
                    onClick={() => handleSendToProduction(viewingOrder)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs"
                  >
                    <Cpu className="w-3.5 h-3.5" />
                    <span>Send to Production</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setViewingOrder(null)}
                  className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      <ConfirmDialog
        isOpen={!!orderToDelete}
        onClose={() => setOrderToDelete(null)}
        onConfirm={() => {
          if (orderToDelete) deleteOrder(orderToDelete.id);
        }}
        title="Delete Order Record"
        message={`Are you sure you want to permanently delete order ${orderToDelete?.id} for ${orderToDelete?.customerName}? This action cannot be undone.`}
        confirmText="Delete Order"
        type="danger"
      />
    </div>
  );
};

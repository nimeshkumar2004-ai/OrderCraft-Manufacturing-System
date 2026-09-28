import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Filter,
  Boxes,
  AlertTriangle,
  PackagePlus,
  Edit2,
  Trash2,
  PackageCheck,
  PackageX,
  DollarSign,
  TrendingDown,
  Warehouse,
  CheckCircle2,
  Layers
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { DataTable } from '../components/common/DataTable';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { SearchBar } from '../components/common/SearchBar';
import { StatCard } from '../components/common/StatCard';

export const Inventory = () => {
  const {
    inventory,
    addInventoryItem,
    updateInventoryItem,
    adjustStock,
    deleteInventoryItem,
    metrics
  } = useApp();

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStockStatus, setSelectedStockStatus] = useState('All');

  // Modals
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [restockModalItem, setRestockModalItem] = useState(null);
  const [restockQty, setRestockQty] = useState(50);

  // Form State
  const initialFormData = {
    id: '',
    name: '',
    category: 'Raw Metals',
    availableQty: 100,
    unit: 'pcs',
    minStock: 25,
    unitCost: 45,
    supplier: 'AlloyCraft Corp',
    location: 'Bay A - Shelf 01'
  };

  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});

  // Categories list
  const categories = [
    'Raw Metals',
    'Fasteners',
    'Electronics',
    'Hydraulics',
    'Composites',
    'Fluids & Chem',
    'Tooling',
    'Finishing',
    'Mechanical',
    'Packaging'
  ];

  // Filtered inventory
  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesStatus = selectedStockStatus === 'All' || item.stockStatus === selectedStockStatus;

      return matchesSearch && matchesCat && matchesStatus;
    });
  }, [inventory, searchTerm, selectedCategory, selectedStockStatus]);

  // Inventory KPI calculations
  const totalItemsCount = inventory.length;
  const lowStockCount = inventory.filter((i) => i.stockStatus === 'Low Stock').length;
  const outOfStockCount = inventory.filter((i) => i.stockStatus === 'Out of Stock').length;
  const inStockCount = inventory.filter((i) => i.stockStatus === 'In Stock').length;

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingItem(null);
    const nextNum = 113 + inventory.length;
    setFormData({
      ...initialFormData,
      id: `INV-${nextNum}`
    });
    setFormErrors({});
    setIsAddEditModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({ ...item });
    setFormErrors({});
    setIsAddEditModalOpen(true);
  };

  // Form submit
  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Item name is required.';
    if (formData.availableQty === undefined || formData.availableQty < 0) {
      errors.availableQty = 'Available quantity cannot be negative.';
    }
    if (formData.minStock === undefined || formData.minStock < 0) {
      errors.minStock = 'Minimum stock level cannot be negative.';
    }
    if (!formData.unitCost || formData.unitCost <= 0) {
      errors.unitCost = 'Unit cost must be greater than 0.';
    }
    if (!formData.supplier.trim()) errors.supplier = 'Supplier name is required.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingItem) {
      updateInventoryItem(editingItem.id, formData);
    } else {
      addInventoryItem(formData);
    }
    setIsAddEditModalOpen(false);
  };

  // Restock action
  const handleOpenRestockModal = (item) => {
    setRestockModalItem(item);
    setRestockQty(item.minStock ? item.minStock * 2 : 50);
  };

  const handleExecuteRestock = () => {
    if (restockModalItem && restockQty > 0) {
      adjustStock(restockModalItem.id, Number(restockQty));
      setRestockModalItem(null);
    }
  };

  // Table Columns
  const columns = [
    {
      key: 'id',
      header: 'Item ID',
      width: '100px',
      render: (row) => (
        <span className="font-mono font-bold text-orange-600 text-xs">
          {row.id}
        </span>
      )
    },
    {
      key: 'name',
      header: 'Item Name & Category',
      render: (row) => (
        <div>
          <p className="font-semibold text-slate-900 text-xs sm:text-sm">{row.name}</p>
          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
            <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">
              {row.category}
            </span>
            <span>•</span>
            <span className="text-slate-400 font-mono">{row.location || 'Warehouse'}</span>
          </div>
        </div>
      )
    },
    {
      key: 'quantity',
      header: 'Stock Level & Safety Ratio',
      width: '200px',
      render: (row) => {
        const ratio = row.minStock > 0 ? (row.availableQty / row.minStock) * 100 : 100;
        return (
          <div className="space-y-1">
            <div className="flex items-baseline justify-between text-xs">
              <span className="font-mono font-bold text-slate-900 text-sm">
                {row.availableQty} <span className="text-xs font-normal text-slate-500">{row.unit}</span>
              </span>
              <span className="text-[11px] text-slate-400">Min: {row.minStock}</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  row.availableQty === 0
                    ? 'bg-rose-500'
                    : row.availableQty <= row.minStock
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, Math.max(8, ratio))}%` }}
              />
            </div>
          </div>
        );
      }
    },
    {
      key: 'unitCost',
      header: 'Unit Cost / Total',
      width: '130px',
      render: (row) => (
        <div className="text-xs">
          <p className="font-mono text-slate-700">${row.unitCost} / {row.unit}</p>
          <p className="text-[11px] font-mono font-semibold text-slate-900">
            Total: ${(row.availableQty * row.unitCost).toLocaleString()}
          </p>
        </div>
      )
    },
    {
      key: 'supplier',
      header: 'Supplier',
      width: '160px',
      render: (row) => (
        <span className="text-xs text-slate-700 truncate max-w-[150px] block" title={row.supplier}>
          {row.supplier}
        </span>
      )
    },
    {
      key: 'stockStatus',
      header: 'Stock Status',
      width: '130px',
      render: (row) => <StatusBadge status={row.stockStatus} />
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      width: '140px',
      render: (row) => (
        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
          {/* Quick Restock Action Button */}
          <button
            type="button"
            onClick={() => handleOpenRestockModal(row)}
            className="p-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-md transition-colors"
            title="Restock Material"
          >
            <PackagePlus className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleOpenEdit(row)}
            className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
            title="Edit SKU"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setItemToDelete(row)}
            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
            title="Delete SKU"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header and Add Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Inventory &amp; Materials Catalog
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Track raw metals, fasteners, electronics, safety stock thresholds, and supplier replenishment.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-semibold text-sm rounded-xl shadow-xs transition-all duration-150 focus:ring-2 focus:ring-orange-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Inventory Item</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total SKUs"
          value={totalItemsCount}
          icon={Boxes}
          trend={`${inStockCount} In Stock`}
          trendType="up"
          description="Cataloged raw items"
          accentColor="blue"
        />
        <StatCard
          title="Low Stock Items"
          value={lowStockCount}
          icon={AlertTriangle}
          trend={lowStockCount > 0 ? "Requires restock" : "Safe"}
          trendType={lowStockCount > 0 ? "warning" : "up"}
          description="At/below minimum safety"
          accentColor="amber"
        />
        <StatCard
          title="Out of Stock"
          value={outOfStockCount}
          icon={PackageX}
          trend={outOfStockCount > 0 ? "Immediate PO needed" : "Zero depleted"}
          trendType={outOfStockCount > 0 ? "down" : "up"}
          description="Zero inventory balance"
          accentColor={outOfStockCount > 0 ? "rose" : "emerald"}
        />
        <StatCard
          title="Total Stock Value"
          value={`$${Math.round(metrics.totalInventoryValue).toLocaleString()}`}
          icon={DollarSign}
          trend="Valuation"
          trendType="neutral"
          description="Current warehouse assets"
          accentColor="emerald"
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex-1 max-w-md">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search by SKU, item name, supplier, bin location..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Category Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="font-semibold text-slate-500">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            >
              <option value="All">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Stock Status Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="font-semibold text-slate-500">Status:</span>
            <select
              value={selectedStockStatus}
              onChange={(e) => setSelectedStockStatus(e.target.value)}
              className="py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            >
              <option value="All">All Statuses ({inventory.length})</option>
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>

          {(searchTerm || selectedCategory !== 'All' || selectedStockStatus !== 'All') && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
                setSelectedStockStatus('All');
              }}
              className="text-xs font-semibold text-orange-600 hover:text-orange-700 underline px-1"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Inventory Data Table */}
      <DataTable
        columns={columns}
        data={filteredInventory}
        defaultItemsPerPage={8}
      />

      {/* ADD / EDIT INVENTORY ITEM MODAL */}
      <Modal
        isOpen={isAddEditModalOpen}
        onClose={() => setIsAddEditModalOpen(false)}
        title={editingItem ? `Edit SKU #${editingItem.id}` : 'Add New Inventory SKU'}
        subtitle="Specify material properties, safety thresholds, and supplier details."
        size="lg"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Item SKU / ID
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
                Material Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Item Description / Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Titanium Grade 5 Rod (Dia 50mm)"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
              {formErrors.name && (
                <p className="text-rose-500 text-[11px] mt-1">{formErrors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Available Quantity <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                value={formData.availableQty}
                onChange={(e) => setFormData({ ...formData, availableQty: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
              {formErrors.availableQty && (
                <p className="text-rose-500 text-[11px] mt-1">{formErrors.availableQty}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Measurement Unit <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                placeholder="pcs, kg, meters, rolls, drums..."
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Minimum Safety Stock <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                value={formData.minStock}
                onChange={(e) => setFormData({ ...formData, minStock: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
              {formErrors.minStock && (
                <p className="text-rose-500 text-[11px] mt-1">{formErrors.minStock}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Unit Cost ($) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="0.01"
                step="0.5"
                value={formData.unitCost}
                onChange={(e) => setFormData({ ...formData, unitCost: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
              {formErrors.unitCost && (
                <p className="text-rose-500 text-[11px] mt-1">{formErrors.unitCost}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Supplier Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                placeholder="e.g. Titan Metals Global"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
              {formErrors.supplier && (
                <p className="text-rose-500 text-[11px] mt-1">{formErrors.supplier}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Storage Bin / Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Bay A - Rack 05"
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
              {editingItem ? 'Save SKU Changes' : 'Add Item'}
            </button>
          </div>
        </form>
      </Modal>

      {/* QUICK RESTOCK MODAL */}
      {restockModalItem && (
        <Modal
          isOpen={!!restockModalItem}
          onClose={() => setRestockModalItem(null)}
          title={`Restock Material: ${restockModalItem.name}`}
          subtitle={`Current stock: ${restockModalItem.availableQty} ${restockModalItem.unit} (Min: ${restockModalItem.minStock})`}
          size="sm"
        >
          <div className="space-y-4 py-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Quantity to Add ({restockModalItem.unit})
              </label>
              <input
                type="number"
                min="1"
                value={restockQty}
                onChange={(e) => setRestockQty(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div className="flex items-center gap-2">
              {[10, 25, 50, 100].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setRestockQty(num)}
                  className="px-2.5 py-1 text-xs rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono font-medium transition-colors"
                >
                  +{num}
                </button>
              ))}
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs flex items-center justify-between">
              <span className="text-emerald-800 font-medium">New Projected Balance:</span>
              <span className="font-mono font-bold text-emerald-700 text-sm">
                {restockModalItem.availableQty + Number(restockQty)} {restockModalItem.unit}
              </span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setRestockModalItem(null)}
                className="px-4 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteRestock}
                className="px-5 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm"
              >
                Confirm Restock
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      <ConfirmDialog
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={() => {
          if (itemToDelete) deleteInventoryItem(itemToDelete.id);
        }}
        title="Delete Inventory SKU"
        message={`Are you sure you want to permanently remove SKU #${itemToDelete?.id} (${itemToDelete?.name})? This will affect material tracking.`}
        confirmText="Delete SKU"
        type="danger"
      />
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Filter,
  Cpu,
  Play,
  CheckCircle2,
  Clock,
  UserCheck,
  AlertTriangle,
  Edit2,
  Trash2,
  Calendar,
  Layers,
  ChevronRight,
  TrendingUp,
  Sliders,
  Check,
  Pause
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { DataTable } from '../components/common/DataTable';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { SearchBar } from '../components/common/SearchBar';
import { StatCard } from '../components/common/StatCard';

export const Production = () => {
  const {
    production,
    orders,
    addProductionRun,
    updateProductionRun,
    updateProductionProgress,
    updateProductionStatus,
    deleteProductionRun
  } = useApp();

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedSupervisor, setSelectedSupervisor] = useState('All');

  // Modals
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingRun, setEditingRun] = useState(null);
  const [runToDelete, setRunToDelete] = useState(null);
  const [progressEditRun, setProgressEditRun] = useState(null);
  const [tempProgress, setTempProgress] = useState(0);

  // Form State
  const initialFormData = {
    id: '',
    orderId: '',
    productName: '',
    quantity: 100,
    startDate: new Date().toISOString().split('T')[0],
    completionDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    supervisor: 'Elena Rostova',
    workstation: 'Line 1 - 5-Axis CNC Milling',
    status: 'Scheduled',
    progress: 0,
    priority: 'Medium',
    stage: 'Material Preparation',
    notes: ''
  };

  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});

  // Supervisors list for filter & select
  const supervisors = ['Elena Rostova', 'Marcus Chen', 'David Miller', 'Rachel Adams'];
  const workstations = [
    'Line 1 - 5-Axis CNC Milling',
    'Line 2 - Precision Laser Cutting',
    'Line 3 - Automated Robotic Assembly',
    'Line 4 - Autoclave & Curing',
    'Line 5 - Heat Treatment & Anodizing'
  ];

  // Filtered Production Records
  const filteredProduction = useMemo(() => {
    return production.filter((item) => {
      const matchesSearch =
        item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.supervisor.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = selectedStatus === 'All' || item.status === selectedStatus;
      const matchesSupervisor = selectedSupervisor === 'All' || item.supervisor === selectedSupervisor;

      return matchesSearch && matchesStatus && matchesSupervisor;
    });
  }, [production, searchTerm, selectedStatus, selectedSupervisor]);

  // Production Metrics
  const activeRunsCount = production.filter((p) => p.status === 'In Progress').length;
  const qcRunsCount = production.filter((p) => p.status === 'Quality Check').length;
  const completedRunsCount = production.filter((p) => p.status === 'Completed').length;
  const avgProgress = Math.round(
    production.reduce((acc, p) => acc + (Number(p.progress) || 0), 0) / (production.length || 1)
  );

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingRun(null);
    const nextNum = 809 + production.length;
    setFormData({
      ...initialFormData,
      id: `PRD-${nextNum}`,
      orderId: orders[0]?.id || '',
      productName: orders[0]?.productName || 'Precision CNC Machined Component',
      quantity: orders[0]?.quantity || 100
    });
    setFormErrors({});
    setIsAddEditModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (run) => {
    setEditingRun(run);
    setFormData({ ...run });
    setFormErrors({});
    setIsAddEditModalOpen(true);
  };

  // Sync when picking order
  const handleOrderSelect = (e) => {
    const selectedOrderId = e.target.value;
    const selectedOrder = orders.find((o) => o.id === selectedOrderId);
    if (selectedOrder) {
      setFormData((prev) => ({
        ...prev,
        orderId: selectedOrder.id,
        productName: selectedOrder.productName,
        quantity: selectedOrder.quantity,
        priority: selectedOrder.priority,
        completionDate: selectedOrder.deliveryDate
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        orderId: selectedOrderId
      }));
    }
  };

  // Form submit
  const validateForm = () => {
    const errors = {};
    if (!formData.productName.trim()) errors.productName = 'Product name is required.';
    if (!formData.quantity || formData.quantity <= 0) errors.quantity = 'Quantity must be > 0.';
    if (!formData.startDate) errors.startDate = 'Start date is required.';
    if (!formData.completionDate) errors.completionDate = 'Completion date is required.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingRun) {
      updateProductionRun(editingRun.id, formData);
    } else {
      addProductionRun(formData);
    }
    setIsAddEditModalOpen(false);
  };

  // Quick Action: Start Production
  const handleStartProduction = (run) => {
    updateProductionRun(run.id, {
      status: 'In Progress',
      progress: Math.max(run.progress, 15),
      stage: 'In Active Machining/Assembly'
    });
  };

  // Quick Action: Complete Production
  const handleCompleteProduction = (run) => {
    updateProductionRun(run.id, {
      status: 'Completed',
      progress: 100,
      stage: 'Final Inspection Passed'
    });
  };

  // Quick Progress Adjustment
  const handleOpenProgressModal = (run) => {
    setProgressEditRun(run);
    setTempProgress(run.progress);
  };

  const handleSaveProgress = () => {
    if (progressEditRun) {
      updateProductionProgress(progressEditRun.id, tempProgress);
      setProgressEditRun(null);
    }
  };

  // Columns for DataTable
  const columns = [
    {
      key: 'id',
      header: 'Batch ID',
      width: '110px',
      render: (row) => (
        <span className="font-mono font-bold text-orange-600 text-xs">
          {row.id}
        </span>
      )
    },
    {
      key: 'orderId',
      header: 'Linked Order',
      width: '120px',
      render: (row) => (
        <span className="font-mono text-xs text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
          {row.orderId || 'Unlinked'}
        </span>
      )
    },
    {
      key: 'productName',
      header: 'Product & Workstation',
      render: (row) => (
        <div>
          <p className="font-semibold text-slate-900 text-xs line-clamp-1">{row.productName}</p>
          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
            <span className="font-medium text-slate-700">{row.workstation}</span>
            <span>•</span>
            <span className="font-mono font-semibold">{row.quantity} units</span>
          </div>
        </div>
      )
    },
    {
      key: 'supervisor',
      header: 'Supervisor',
      width: '140px',
      render: (row) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
          <div className="w-5 h-5 rounded-full bg-orange-100 text-orange-700 font-bold flex items-center justify-center text-[10px]">
            {row.supervisor.charAt(0)}
          </div>
          <span className="truncate">{row.supervisor}</span>
        </div>
      )
    },
    {
      key: 'progress',
      header: 'Floor Progress',
      width: '210px',
      render: (row) => (
        <div className="w-full space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[11px] text-slate-500 truncate max-w-[120px]">
              {row.stage || 'In Progress'}
            </span>
            <span className="font-mono font-bold text-slate-800 text-xs">
              {row.progress}%
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex items-center">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                row.progress === 100
                  ? 'bg-emerald-500'
                  : row.progress >= 70
                  ? 'bg-blue-600'
                  : row.progress >= 30
                  ? 'bg-orange-500'
                  : 'bg-amber-500'
              }`}
              style={{ width: `${row.progress}%` }}
            />
          </div>
        </div>
      )
    },
    {
      key: 'dates',
      header: 'Timeline',
      width: '130px',
      render: (row) => (
        <div className="text-[11px] text-slate-600">
          <p>Start: {row.startDate}</p>
          <p className="text-slate-400">Target: {row.completionDate}</p>
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      width: '120px',
      render: (row) => <StatusBadge status={row.status} />
    },
    {
      key: 'actions',
      header: 'Controls',
      align: 'right',
      width: '170px',
      render: (row) => (
        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
          {/* Quick Start if Scheduled */}
          {row.status === 'Scheduled' && (
            <button
              type="button"
              onClick={() => handleStartProduction(row)}
              className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
              title="Start Production"
            >
              <Play className="w-4 h-4 fill-blue-600" />
            </button>
          )}

          {/* Quick Complete if in progress */}
          {row.status !== 'Completed' && (
            <button
              type="button"
              onClick={() => handleCompleteProduction(row)}
              className="p-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-md transition-colors"
              title="Mark Complete"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
            </button>
          )}

          {/* Progress Slider modal */}
          <button
            type="button"
            onClick={() => handleOpenProgressModal(row)}
            className="p-1.5 text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-md transition-colors"
            title="Adjust Progress %"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {/* Edit */}
          <button
            type="button"
            onClick={() => handleOpenEdit(row)}
            className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
            title="Edit Batch"
          >
            <Edit2 className="w-4 h-4" />
          </button>

          {/* Delete */}
          <button
            type="button"
            onClick={() => setRunToDelete(row)}
            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
            title="Delete Batch"
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
            Production Floor &amp; Workstations
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Monitor machining cycles, allocate workcells, track batch yields, and advance production stages.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-semibold text-sm rounded-xl shadow-xs transition-all duration-150 focus:ring-2 focus:ring-orange-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Production Run</span>
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Batches"
          value={activeRunsCount}
          icon={Play}
          trend="In machining"
          trendType="up"
          description="Active on shopfloor"
          accentColor="blue"
        />
        <StatCard
          title="In Quality Check"
          value={qcRunsCount}
          icon={CheckCircle2}
          trend="CMM / Inspection"
          trendType="neutral"
          description="Tolerance verification"
          accentColor="orange"
        />
        <StatCard
          title="Batches Completed"
          value={completedRunsCount}
          icon={Layers}
          trend="Yield passed"
          trendType="up"
          description="Ready for packing/dispatch"
          accentColor="emerald"
        />
        <StatCard
          title="Avg Floor Completion"
          value={`${avgProgress}%`}
          icon={TrendingUp}
          trend="Plant throughput"
          trendType="up"
          description="Across all running jobs"
          accentColor="amber"
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex-1 max-w-md">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search by batch ID, order, product, supervisor..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="font-semibold text-slate-500">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            >
              <option value="All">All Statuses ({production.length})</option>
              <option value="Scheduled">Scheduled</option>
              <option value="In Progress">In Progress</option>
              <option value="Quality Check">Quality Check</option>
              <option value="Completed">Completed</option>
              <option value="On Hold">On Hold</option>
            </select>
          </div>

          {/* Supervisor Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="font-semibold text-slate-500">Supervisor:</span>
            <select
              value={selectedSupervisor}
              onChange={(e) => setSelectedSupervisor(e.target.value)}
              className="py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            >
              <option value="All">All Supervisors</option>
              {supervisors.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {(searchTerm || selectedStatus !== 'All' || selectedSupervisor !== 'All') && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setSelectedStatus('All');
                setSelectedSupervisor('All');
              }}
              className="text-xs font-semibold text-orange-600 hover:text-orange-700 underline px-1"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Production Table */}
      <DataTable
        columns={columns}
        data={filteredProduction}
        defaultItemsPerPage={8}
      />

      {/* ADD / EDIT PRODUCTION RUN MODAL */}
      <Modal
        isOpen={isAddEditModalOpen}
        onClose={() => setIsAddEditModalOpen(false)}
        title={editingRun ? `Modify Production Run #${editingRun.id}` : 'Schedule New Production Batch'}
        subtitle="Assign machine workstations, supervisors, and schedule manufacturing runs."
        size="lg"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Batch Run ID
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
                Linked Customer Order
              </label>
              <select
                value={formData.orderId}
                onChange={handleOrderSelect}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              >
                <option value="">-- Standalone Stock Run --</option>
                {orders.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.id} - {o.customerName} ({o.productName})
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Product / Part Description <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.productName}
                onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
              {formErrors.productName && (
                <p className="text-rose-500 text-[11px] mt-1">{formErrors.productName}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Batch Quantity <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
              {formErrors.quantity && (
                <p className="text-rose-500 text-[11px] mt-1">{formErrors.quantity}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Assigned Supervisor <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.supervisor}
                onChange={(e) => setFormData({ ...formData, supervisor: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              >
                {supervisors.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Manufacturing Workstation / Line <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.workstation}
                onChange={(e) => setFormData({ ...formData, workstation: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              >
                {workstations.map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Start Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Target Completion <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={formData.completionDate}
                onChange={(e) => setFormData({ ...formData, completionDate: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Production Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              >
                <option value="Scheduled">Scheduled</option>
                <option value="In Progress">In Progress</option>
                <option value="Quality Check">Quality Check</option>
                <option value="Completed">Completed</option>
                <option value="On Hold">On Hold</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Progress: <span className="font-mono text-orange-600">{formData.progress}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={formData.progress}
                onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) || 0 })}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500 mt-2"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Current Manufacturing Stage Description
              </label>
              <input
                type="text"
                value={formData.stage}
                onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                placeholder="e.g. Rough Milling, Fine Grinding, Heat Treatment, Final Inspection..."
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Shopfloor Notes &amp; Observations
              </label>
              <textarea
                rows="2"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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
              {editingRun ? 'Save Changes' : 'Schedule Batch'}
            </button>
          </div>
        </form>
      </Modal>

      {/* QUICK PROGRESS SLIDER MODAL */}
      {progressEditRun && (
        <Modal
          isOpen={!!progressEditRun}
          onClose={() => setProgressEditRun(null)}
          title={`Update Progress: ${progressEditRun.id}`}
          subtitle={progressEditRun.productName}
          size="sm"
        >
          <div className="space-y-5 text-center py-2">
            <div className="text-4xl font-extrabold font-mono text-orange-600">
              {tempProgress}%
            </div>

            <p className="text-xs text-slate-500">
              Drag slider or use quick increment buttons below:
            </p>

            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={tempProgress}
              onChange={(e) => setTempProgress(parseInt(e.target.value))}
              className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />

            <div className="flex items-center justify-center gap-2">
              {[0, 25, 50, 75, 100].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setTempProgress(val)}
                  className={`px-2.5 py-1 text-xs rounded-md border font-mono font-semibold transition-colors ${
                    tempProgress === val
                      ? 'bg-orange-500 text-white border-orange-500'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
                  }`}
                >
                  {val}%
                </button>
              ))}
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setProgressEditRun(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveProgress}
                className="px-5 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-500 rounded-lg shadow-sm"
              >
                Apply Progress
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      <ConfirmDialog
        isOpen={!!runToDelete}
        onClose={() => setRunToDelete(null)}
        onConfirm={() => {
          if (runToDelete) deleteProductionRun(runToDelete.id);
        }}
        title="Delete Production Batch"
        message={`Are you sure you want to remove Batch #${runToDelete?.id} (${runToDelete?.productName})? This will remove the run from scheduling.`}
        confirmText="Delete Batch"
        type="danger"
      />
    </div>
  );
};

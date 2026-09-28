import React, { useState, useMemo } from 'react';
import {
  Download,
  Calendar,
  Filter,
  BarChart3,
  TrendingUp,
  DollarSign,
  PieChart as PieIcon,
  Cpu,
  Boxes,
  Users,
  CheckCircle2,
  FileSpreadsheet,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useApp } from '../context/AppContext';
import { StatCard } from '../components/common/StatCard';

export const Reports = () => {
  const { orders, production, inventory, customers, monthlyTrends, addToast } = useApp();

  const [dateRange, setDateRange] = useState('12m'); // '12m' | '6m' | '3m'
  const [reportType, setReportType] = useState('orders'); // 'orders' | 'production' | 'inventory'

  // Filtered monthly data based on dateRange
  const filteredTrends = useMemo(() => {
    if (dateRange === '3m') return monthlyTrends.slice(-3);
    if (dateRange === '6m') return monthlyTrends.slice(-6);
    return monthlyTrends;
  }, [monthlyTrends, dateRange]);

  // Status breakdown for orders
  const orderStatusBreakdown = useMemo(() => {
    const counts = orders.reduce((acc, o) => {
      acc[o.status] = (acc[o.status] || 0) + 1;
      return acc;
    }, {});
    return [
      { name: 'Completed / Delivered', count: (counts['Completed'] || 0) + (counts['Delivered'] || 0), fill: '#10b981' },
      { name: 'In Production', count: counts['In Production'] || 0, fill: '#3b82f6' },
      { name: 'Pending / Confirmed', count: (counts['Pending'] || 0) + (counts['Confirmed'] || 0), fill: '#f59e0b' },
      { name: 'Cancelled', count: counts['Cancelled'] || 0, fill: '#f43f5e' }
    ].filter((d) => d.count > 0);
  }, [orders]);

  // Inventory breakdown by category
  const inventoryCategoryBreakdown = useMemo(() => {
    const catMap = inventory.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = { category: item.category, itemsCount: 0, totalValue: 0 };
      }
      acc[item.category].itemsCount += 1;
      acc[item.category].totalValue += (Number(item.availableQty) || 0) * (Number(item.unitCost) || 0);
      return acc;
    }, {});
    return Object.values(catMap).sort((a, b) => b.totalValue - a.totalValue);
  }, [inventory]);

  // Export to CSV Function
  const exportToCSV = (type) => {
    let csvContent = '';
    let filename = '';

    if (type === 'orders') {
      filename = `OrderCraft_Orders_Report_${new Date().toISOString().split('T')[0]}.csv`;
      const headers = ['Order ID', 'Customer Name', 'Product Name', 'Quantity', 'Unit Price ($)', 'Total Amount ($)', 'Order Date', 'Delivery Date', 'Priority', 'Status'];
      const rows = orders.map((o) => [
        o.id,
        `"${o.customerName}"`,
        `"${o.productName}"`,
        o.quantity,
        o.unitPrice,
        o.totalAmount,
        o.orderDate,
        o.deliveryDate,
        o.priority,
        o.status
      ]);
      csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    } else if (type === 'production') {
      filename = `OrderCraft_Production_Report_${new Date().toISOString().split('T')[0]}.csv`;
      const headers = ['Batch ID', 'Linked Order ID', 'Product Name', 'Quantity', 'Supervisor', 'Workstation', 'Status', 'Progress (%)', 'Start Date', 'Completion Date'];
      const rows = production.map((p) => [
        p.id,
        p.orderId || 'N/A',
        `"${p.productName}"`,
        p.quantity,
        `"${p.supervisor}"`,
        `"${p.workstation}"`,
        p.status,
        p.progress,
        p.startDate,
        p.completionDate
      ]);
      csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    } else if (type === 'inventory') {
      filename = `OrderCraft_Inventory_Report_${new Date().toISOString().split('T')[0]}.csv`;
      const headers = ['SKU ID', 'Item Name', 'Category', 'Available Qty', 'Unit', 'Min Stock', 'Unit Cost ($)', 'Stock Status', 'Supplier', 'Location'];
      const rows = inventory.map((i) => [
        i.id,
        `"${i.name}"`,
        `"${i.category}"`,
        i.availableQty,
        i.unit,
        i.minStock,
        i.unitCost,
        i.stockStatus,
        `"${i.supplier}"`,
        `"${i.location || ''}"`
      ]);
      csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    }

    // Trigger browser file download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    addToast({
      type: 'success',
      title: 'Report Downloaded',
      message: `${filename} was generated and downloaded successfully.`
    });
  };

  // KPIs
  const totalVolume = orders.reduce((sum, o) => sum + (Number(o.quantity) || 0), 0);
  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
  const fulfillmentRate = Math.round(
    (orders.filter((o) => o.status === 'Completed' || o.status === 'Delivered').length /
      (orders.length || 1)) *
      100
  );

  return (
    <div className="space-y-6">
      {/* Header and Export Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Manufacturing Intelligence &amp; Reports
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Operational analytics, order fulfillment rates, capacity utilization, and downloadable CSV audits.
          </p>
        </div>

        {/* Export to CSV Dropdown & Buttons */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-xs text-xs">
            <button
              type="button"
              onClick={() => setDateRange('3m')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                dateRange === '3m' ? 'bg-orange-500 text-white font-semibold' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              3 Months
            </button>
            <button
              type="button"
              onClick={() => setDateRange('6m')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                dateRange === '6m' ? 'bg-orange-500 text-white font-semibold' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              6 Months
            </button>
            <button
              type="button"
              onClick={() => setDateRange('12m')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                dateRange === '12m' ? 'bg-orange-500 text-white font-semibold' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Full Year
            </button>
          </div>

          <div className="relative group">
            <button
              type="button"
              onClick={() => exportToCSV(reportType)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition-colors"
            >
              <Download className="w-4 h-4 text-orange-400" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Fulfillment Rate"
          value={`${fulfillmentRate}%`}
          icon={CheckCircle2}
          trend="+3.2%"
          trendType="up"
          description="Orders delivered on schedule"
          accentColor="emerald"
        />
        <StatCard
          title="Total Units Ordered"
          value={totalVolume.toLocaleString()}
          icon={Boxes}
          trend="Fab volume"
          trendType="up"
          description="Sum of all ordered parts"
          accentColor="blue"
        />
        <StatCard
          title="Cumulative Billings"
          value={`$${totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          trend="Invoiced"
          trendType="up"
          description="Total pipeline revenue"
          accentColor="orange"
        />
        <StatCard
          title="Avg Production Batch"
          value={`${Math.round(totalVolume / (production.length || 1))} units`}
          icon={Cpu}
          trend="Workcell capacity"
          trendType="neutral"
          description="Units per scheduled run"
          accentColor="amber"
        />
      </div>

      {/* Charts Section: Monthly Orders & Revenue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Total Orders by Month (Bar + Area chart) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-orange-500" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Total Orders by Month &amp; Production Output
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Monthly order count vs factory production batch completions
              </p>
            </div>

            <button
              type="button"
              onClick={() => exportToCSV('orders')}
              className="inline-flex items-center gap-1.5 text-xs text-orange-600 hover:text-orange-700 font-semibold"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Download Orders Data</span>
            </button>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="orders" name="Customer Orders" fill="#f97316" radius={[4, 4, 0, 0]} />
                <Bar dataKey="production" name="Units Produced" fill="#0f172a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Completed vs Pending Orders Doughnut */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Order Status Ratio
                </h3>
              </div>
            </div>
            <p className="text-xs text-slate-500">Completed vs Pending vs Active orders</p>

            <div className="h-52 relative mt-2 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderStatusBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="count"
                  >
                    {orderStatusBreakdown.map((entry, index) => (
                      <Cell key={`status-cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute text-center pointer-events-none">
                <span className="text-2xl font-extrabold text-slate-900 font-mono">
                  {orders.length}
                </span>
                <p className="text-[10px] uppercase font-bold text-slate-400">Total</p>
              </div>
            </div>
          </div>

          <div className="space-y-1.5 pt-3 border-t border-slate-100 text-xs">
            {orderStatusBreakdown.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.fill }} />
                  <span className="text-slate-600">{item.name}</span>
                </div>
                <span className="font-mono font-bold text-slate-900">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Second Charts Section: Inventory Valuation & Customer Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inventory Stock Summary by Category */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <Boxes className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Inventory Stock Valuation by Category
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Total warehouse valuation across material categories
              </p>
            </div>
            <button
              type="button"
              onClick={() => exportToCSV('inventory')}
              className="text-xs text-orange-600 hover:text-orange-700 font-semibold"
            >
              CSV &rarr;
            </button>
          </div>

          <div className="h-64 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={inventoryCategoryBreakdown.slice(0, 6)}
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" stroke="#94a3b8" fontSize={11} tickFormatter={(val) => `$${val}`} />
                <YAxis dataKey="category" type="category" stroke="#64748b" fontSize={11} width={80} />
                <Tooltip
                  formatter={(val) => [`$${val.toLocaleString()}`, 'Stock Value']}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="totalValue" fill="#0f1f33" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Customer Order Statistics */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-orange-500" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Top Commercial Accounts
                </h3>
              </div>
              <span className="text-xs text-slate-500">By Total Contract Spend</span>
            </div>

            <div className="space-y-3">
              {[...customers]
                .sort((a, b) => (b.totalSpent || 0) - (a.totalSpent || 0))
                .slice(0, 5)
                .map((cust, idx) => {
                  const maxSpend = 120000;
                  const pct = Math.min(100, Math.round(((cust.totalSpent || 0) / maxSpend) * 100));

                  return (
                    <div key={cust.id} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 font-medium text-slate-900">
                          <span className="font-mono text-slate-400 font-bold w-4">{idx + 1}.</span>
                          <span className="truncate max-w-[200px]">{cust.company}</span>
                        </div>
                        <span className="font-mono font-bold text-slate-900">
                          ${(cust.totalSpent || 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-orange-500 h-full rounded-full transition-all duration-300"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Aggregated from live client order history</span>
            <button
              type="button"
              onClick={() => exportToCSV('production')}
              className="text-orange-600 font-semibold hover:text-orange-700"
            >
              Export Production Report CSV &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Clock,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Plus,
  Boxes,
  TrendingUp,
  Activity,
  Factory,
  ArrowUpRight,
  ShieldCheck,
  PackagePlus
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useApp } from '../context/AppContext';
import { StatCard } from '../components/common/StatCard';
import { StatusBadge } from '../components/common/StatusBadge';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { orders, production, inventory, metrics, activities, monthlyTrends, adjustStock } = useApp();

  // Pie chart data for Production Status Distribution
  const productionStatusCounts = production.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {});

  const pieData = [
    { name: 'In Progress', value: productionStatusCounts['In Progress'] || 0, color: '#3b82f6' },
    { name: 'Scheduled', value: productionStatusCounts['Scheduled'] || 0, color: '#f59e0b' },
    { name: 'Quality Check', value: productionStatusCounts['Quality Check'] || 0, color: '#f97316' },
    { name: 'Completed', value: productionStatusCounts['Completed'] || 0, color: '#10b981' }
  ].filter((d) => d.value > 0);

  // Critical Low Stock items
  const criticalStockItems = inventory
    .filter((item) => item.stockStatus === 'Low Stock' || item.stockStatus === 'Out of Stock')
    .slice(0, 4);

  // Top 5 recent orders
  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome Banner / Floor Status Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-navy-900 to-slate-900 text-white rounded-2xl p-6 shadow-md relative overflow-hidden border border-slate-800">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-orange-500/10 to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-orange-500/20 text-orange-300 text-xs font-semibold border border-orange-500/30 mb-2">
              <Factory className="w-3.5 h-3.5" />
              <span>Plant Operations Live Overview</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              OrderCraft Manufacturing Control
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
              Real-time synchronization across precision workcells, active fabrication runs, supply chain inventory, and client deliveries.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => navigate('/orders')}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-orange-600 hover:bg-orange-500 rounded-lg shadow-sm transition-all focus:ring-2 focus:ring-orange-400"
            >
              <Plus className="w-4 h-4" />
              <span>New Order</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/production')}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg shadow-sm transition-all"
            >
              <Cpu className="w-4 h-4" />
              <span>Floor Schedule</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5 Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Orders"
          value={metrics.totalOrders}
          icon={ShoppingCart}
          trend="+14.2%"
          trendType="up"
          description="vs. last month"
          accentColor="orange"
          onClick={() => navigate('/orders')}
        />
        <StatCard
          title="Pending Orders"
          value={metrics.pendingOrders}
          icon={Clock}
          trend={metrics.pendingOrders > 0 ? "Requires slot" : "On schedule"}
          trendType={metrics.pendingOrders > 0 ? "warning" : "neutral"}
          description="Awaiting scheduling"
          accentColor="amber"
          onClick={() => navigate('/orders')}
        />
        <StatCard
          title="Active Production"
          value={metrics.activeProduction}
          icon={Cpu}
          trend="8 Workstations"
          trendType="up"
          description="Active batch jobs"
          accentColor="blue"
          onClick={() => navigate('/production')}
        />
        <StatCard
          title="Completed Orders"
          value={metrics.completedOrders}
          icon={CheckCircle2}
          trend="96.4%"
          trendType="up"
          description="On-time delivery rate"
          accentColor="emerald"
          onClick={() => navigate('/orders')}
        />
        <StatCard
          title="Low Stock Items"
          value={metrics.lowStockCount}
          icon={AlertTriangle}
          trend={metrics.lowStockCount > 0 ? "Action needed" : "Healthy"}
          trendType={metrics.lowStockCount > 0 ? "down" : "neutral"}
          description="Below safety threshold"
          accentColor={metrics.lowStockCount > 0 ? "rose" : "emerald"}
          onClick={() => navigate('/inventory')}
        />
      </div>

      {/* Visualizations Section: Line Chart & Doughnut Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Order Trends Area/Line Chart (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-orange-500" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Monthly Order Trends &amp; Output
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Comparison of actual customer orders vs monthly production targets
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-3 h-3 rounded-sm bg-orange-500" /> Actual Orders
              </span>
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-3 h-3 rounded-sm bg-slate-300" /> Production Target
              </span>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="orderGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  itemStyle={{ color: '#fed7aa' }}
                />
                <Area
                  type="monotone"
                  dataKey="orders"
                  name="Orders Placed"
                  stroke="#ea580c"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#orderGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="target"
                  name="Target Quota"
                  stroke="#cbd5e1"
                  strokeDasharray="4 4"
                  strokeWidth={2}
                  fillOpacity={0}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Production Status Donut Chart (1 Col) */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Production Distribution
                </h3>
              </div>
              <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                {production.length} Total Runs
              </span>
            </div>
            <p className="text-xs text-slate-500">Live operational status across all floor lines</p>

            <div className="h-52 relative mt-2 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
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
                  {metrics.activeProduction}
                </span>
                <p className="text-[10px] uppercase font-bold text-slate-400">Active</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 text-xs">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-slate-600 truncate">{item.name}:</span>
                <span className="font-bold text-slate-900 font-mono">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lower Section: Recent Orders Table & (Activities + Low Stock alerts) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Recent Orders
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Latest customer manufacturing orders in pipeline
              </p>
            </div>
            <Link
              to="/orders"
              className="inline-flex items-center gap-1 text-xs font-semibold text-orange-600 hover:text-orange-700 group"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-700 text-xs font-semibold uppercase tracking-wider border-b border-slate-200/70">
                <tr>
                  <th className="px-4 py-3">Order ID</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Product / Qty</th>
                  <th className="px-4 py-3">Delivery Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-normal text-xs">
                {recentOrders.map((ord) => (
                  <tr
                    key={ord.id}
                    onClick={() => navigate('/orders')}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3 font-mono font-bold text-orange-600">{ord.id}</td>
                    <td className="px-4 py-3 font-medium text-slate-900">{ord.customerName}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-800 truncate max-w-[180px]">
                        {ord.productName}
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">{ord.quantity} units</span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{ord.deliveryDate}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={ord.status} />
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">
                      ${ord.totalAmount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Col: Inventory Alerts + Floor Activities Feed */}
        <div className="space-y-6">
          {/* Inventory Alerts Card */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Critical Stock Alerts
                </h3>
              </div>
              <Link
                to="/inventory"
                className="text-xs font-semibold text-orange-600 hover:text-orange-700"
              >
                Catalog &rarr;
              </Link>
            </div>

            {criticalStockItems.length > 0 ? (
              <div className="space-y-3">
                {criticalStockItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-lg border border-slate-200/80 bg-slate-50/50 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900 truncate">{item.name}</p>
                      <div className="flex items-center gap-2 text-slate-500 text-[11px] mt-0.5">
                        <span className="font-mono text-rose-600 font-bold">
                          {item.availableQty} {item.unit}
                        </span>
                        <span>(Min: {item.minStock})</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => adjustStock(item.id, 25)}
                      className="px-2.5 py-1 text-xs font-semibold bg-white border border-slate-200 hover:border-orange-500 hover:text-orange-600 text-slate-700 rounded-md shadow-2xs transition-colors shrink-0 flex items-center gap-1"
                      title="Quick restock +25 units"
                    >
                      <PackagePlus className="w-3.5 h-3.5 text-orange-500" />
                      <span>+25</span>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-slate-500 flex flex-col items-center gap-2">
                <ShieldCheck className="w-8 h-8 text-emerald-500" />
                <p className="font-semibold text-slate-700">All materials safely stocked</p>
                <p className="text-[11px] text-slate-400">No items below minimum safety threshold.</p>
              </div>
            )}
          </div>

          {/* Recent Floor Activity Feed */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Shop Floor Stream
              </h3>
            </div>

            <div className="relative pl-4 space-y-4 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {activities.slice(0, 4).map((act) => (
                <div key={act.id} className="relative text-xs group">
                  <span className="absolute -left-4 top-1 w-2.5 h-2.5 rounded-full bg-orange-500 ring-4 ring-white" />
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-slate-900">{act.title}</p>
                    <span className="text-[10px] text-slate-400">{act.time}</span>
                  </div>
                  <p className="text-slate-500 text-[11px] mt-0.5">{act.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

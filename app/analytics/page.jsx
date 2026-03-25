'use client';
import { useState, useEffect, useCallback } from 'react';
import api from '../../lib/axios';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  FaDollarSign, FaShoppingCart, FaUsers, FaTruck,
  FaStore, FaArrowUp, FaArrowDown, FaWallet,
  FaChartLine, FaBoxOpen, FaMoneyBillWave
} from 'react-icons/fa';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// ─── Colors ───
const COLORS = ['#16a34a', '#2563eb', '#d97706', '#dc2626', '#7c3aed', '#0891b2'];

const STATUS_COLORS = {
  pending: '#d97706',
  delivered: '#16a34a',
  cancelled: '#dc2626',
  confirmed: '#2563eb',
  picked_up: '#7c3aed',
};

const PAYMENT_COLORS = {
  wallet: '#16a34a',
  cash: '#d97706',
  card: '#2563eb',
};

// ─── Helpers ───
const fmt = (n) => `$${parseFloat(n || 0).toFixed(2)}`;
const num = (n) => parseInt(n || 0).toLocaleString();

// ─────────────────────────────────────────────
//  Sub-components
// ─────────────────────────────────────────────

const StatCard = ({ title, value, subtitle, icon, trend, color = 'green' }) => {
  const colorMap = {
    green: 'bg-green-50 text-green-600 border-green-200',
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
    red: 'bg-red-50 text-red-600 border-red-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    teal: 'bg-teal-50 text-teal-600 border-teal-200',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`w-10 h-10 rounded-lg border flex items-center justify-center text-lg ${colorMap[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

const SectionHeader = ({ title, subtitle }) => (
  <div className="mb-4">
    <h2 className="text-lg font-bold text-gray-900">{title}</h2>
    {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
  </div>
);

const RangeSelector = ({ value, onChange }) => (
  <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
    {['week', 'month', 'year'].map((r) => (
      <button
        key={r}
        onClick={() => onChange(r)}
        className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
          value === r ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        {r.charAt(0).toUpperCase() + r.slice(1)}
      </button>
    ))}
  </div>
);

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-40">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" />
  </div>
);

// ─────────────────────────────────────────────
//  Main Page
// ─────────────────────────────────────────────

export default function AnalyticsPage() {
  const [range, setRange] = useState('month');
  const [loading, setLoading] = useState(true);
  const [sectionLoading, setSectionLoading] = useState({});

  // Data state
  const [overview, setOverview] = useState(null);
  const [revenue, setRevenue] = useState([]);
  const [ordersBreakdown, setOrdersBreakdown] = useState({ byStatus: [], byPayment: [] });
  const [topVendors, setTopVendors] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [deliverymen, setDeliverymen] = useState([]);
  const [walletStats, setWalletStats] = useState({ transactions: [], withdrawals: [] });

  // ─── Fetch all ───
  const fetchAll = useCallback(async (r) => {
    setLoading(true);
    try {
     // In app/analytics/page.jsx
      const [ovRes, revRes, ordRes, vendRes, prodRes, delRes, walRes] = await Promise.all([
        api.get(`${BACKEND_URL}/api/admin/dashboard/overview`),
        api.get(`${BACKEND_URL}/api/admin/dashboard/revenue?range=${r}`),
        api.get(`${BACKEND_URL}/api/admin/dashboard/orders?range=${r}`),
        api.get(`${BACKEND_URL}/api/admin/dashboard/top-vendors?range=${r}&limit=10`),
        api.get(`${BACKEND_URL}/api/admin/dashboard/top-products?range=${r}&limit=10`),
        api.get(`${BACKEND_URL}/api/admin/dashboard/deliverymen?range=${r}&limit=10`),
        api.get(`${BACKEND_URL}/api/admin/dashboard/wallet?range=${r}`),
      ]);

      setOverview(ovRes.data.data);
      setRevenue(revRes.data.data || []);
      setOrdersBreakdown(ordRes.data.data || { byStatus: [], byPayment: [] });
      setTopVendors(vendRes.data.data || []);
      setTopProducts(prodRes.data.data || []);
      setDeliverymen(delRes.data.data || []);
      setWalletStats(walRes.data.data || { transactions: [], withdrawals: [] });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll(range);
  }, [range]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Loading analytics...</p>
        </div>
      </div>
    );
  }

  // ─── Computed data ───
  const totalWalletIn = walletStats.transactions
    .filter(t => t.direction === 'incoming')
    .reduce((sum, t) => sum + parseFloat(t.totalAmount || 0), 0);

  const totalWalletOut = walletStats.transactions
    .filter(t => t.direction === 'outcoming')
    .reduce((sum, t) => sum + parseFloat(t.totalAmount || 0), 0);

  // ─────────────────────────────────────────────
  //  Render
  // ─────────────────────────────────────────────

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">Real-time platform performance data</p>
        </div>
        <RangeSelector value={range} onChange={setRange} />
      </div>

      {/* ── Section 1: Overview Stats ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <StatCard
          title="Total Revenue"
          value={fmt(overview?.revenue?.totalRevenue)}
          subtitle="Delivered orders"
          icon={<FaDollarSign />}
          color="green"
        />
        <StatCard
          title="Service Fees"
          value={fmt(overview?.revenue?.totalServiceFees)}
          subtitle="Platform earnings"
          icon={<FaMoneyBillWave />}
          color="teal"
        />
        <StatCard
          title="Total Orders"
          value={num(overview?.orders?.total)}
          subtitle={`${num(overview?.orders?.delivered)} delivered`}
          icon={<FaShoppingCart />}
          color="blue"
        />
        <StatCard
          title="Customers"
          value={num(overview?.users?.totalCustomers)}
          icon={<FaUsers />}
          color="purple"
        />
        <StatCard
          title="Vendors"
          value={num(overview?.users?.totalVendors)}
          icon={<FaStore />}
          color="orange"
        />
        <StatCard
          title="Deliverymen"
          value={num(overview?.users?.totalDeliverymen)}
          icon={<FaTruck />}
          color="red"
        />
      </div>

      {/* ── Section 2: Revenue Over Time ── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <SectionHeader
          title="Revenue Over Time"
          subtitle={`Total revenue and service fees — ${range}`}
        />
        {revenue.length === 0 ? (
          <div className="h-40 flex items-center justify-center text-gray-400 text-sm">No data for this period</div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={revenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => `$${parseFloat(v).toFixed(2)}`} />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={2} dot={false} name="Revenue" />
              <Line type="monotone" dataKey="serviceFees" stroke="#0891b2" strokeWidth={2} dot={false} name="Service Fees" />
            </LineChart>
          </ResponsiveContainer>
        )}

        {/* Revenue table */}
        {revenue.length > 0 && (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                <tr>
                  <th className="px-3 py-2 text-left">Date</th>
                  <th className="px-3 py-2 text-right">Orders</th>
                  <th className="px-3 py-2 text-right">Revenue</th>
                  <th className="px-3 py-2 text-right">Service Fees</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {revenue.slice(-10).reverse().map((r, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-3 py-2 text-gray-700">{r.date}</td>
                    <td className="px-3 py-2 text-right text-gray-600">{r.orderCount}</td>
                    <td className="px-3 py-2 text-right font-medium text-gray-900">{fmt(r.revenue)}</td>
                    <td className="px-3 py-2 text-right text-teal-600">{fmt(r.serviceFees)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Section 3: Orders Breakdown ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* By Status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <SectionHeader title="Orders by Status" subtitle={`Distribution — ${range}`} />
          {ordersBreakdown.byStatus.length === 0 ? (
            <div className="h-40 flex items-center justify-center text-gray-400 text-sm">No data</div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={ordersBreakdown.byStatus}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ status, count }) => `${status}: ${count}`}
                    labelLine={false}
                  >
                    {ordersBreakdown.byStatus.map((entry, i) => (
                      <Cell key={i} fill={STATUS_COLORS[entry.status] || COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-3 space-y-2">
                {ordersBreakdown.byStatus.map((s, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ background: STATUS_COLORS[s.status] || COLORS[i] }} />
                      <span className="capitalize text-gray-700">{s.status}</span>
                    </div>
                    <span className="font-semibold text-gray-900">{s.count.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* By Payment */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <SectionHeader title="Orders by Payment Method" subtitle={`Distribution — ${range}`} />
          {ordersBreakdown.byPayment.length === 0 ? (
            <div className="h-40 flex items-center justify-center text-gray-400 text-sm">No data</div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={ordersBreakdown.byPayment}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="method" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" name="Orders" radius={[4, 4, 0, 0]}>
                    {ordersBreakdown.byPayment.map((entry, i) => (
                      <Cell key={i} fill={PAYMENT_COLORS[entry.method] || COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-3 space-y-2">
                {ordersBreakdown.byPayment.map((p, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ background: PAYMENT_COLORS[p.method] || COLORS[i] }} />
                      <span className="capitalize text-gray-700">{p.method || 'Unknown'}</span>
                    </div>
                    <span className="font-semibold text-gray-900">{p.count.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Section 4: Top Vendors ── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <SectionHeader title="Top Vendors by Sales" subtitle={`Top 10 vendors — ${range}`} />
        {topVendors.length === 0 ? (
          <div className="h-20 flex items-center justify-center text-gray-400 text-sm">No data for this period</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={topVendors} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={(v) => `$${v}`} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={100} />
                <Tooltip formatter={(v) => `$${parseFloat(v).toFixed(2)}`} />
                <Bar dataKey="totalEarnings" fill="#16a34a" radius={[0, 4, 4, 0]} name="Earnings" />
              </BarChart>
            </ResponsiveContainer>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                  <tr>
                    <th className="px-3 py-2 text-left">#</th>
                    <th className="px-3 py-2 text-left">Vendor</th>
                    <th className="px-3 py-2 text-right">Orders</th>
                    <th className="px-3 py-2 text-right">Earnings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {topVendors.map((v, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-3 py-2 text-gray-400 font-medium">#{i + 1}</td>
                      <td className="px-3 py-2">
                        <p className="font-medium text-gray-900">{v.name}</p>
                        <p className="text-xs text-gray-400">{v.email}</p>
                      </td>
                      <td className="px-3 py-2 text-right text-gray-600">{v.orderCount}</td>
                      <td className="px-3 py-2 text-right font-semibold text-green-600">{fmt(v.totalEarnings)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ── Section 5: Top Products ── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <SectionHeader title="Top Products by Sales" subtitle={`Top 10 products — ${range}`} />
        {topProducts.length === 0 ? (
          <div className="h-20 flex items-center justify-center text-gray-400 text-sm">No data for this period</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                <tr>
                  <th className="px-3 py-2 text-left">#</th>
                  <th className="px-3 py-2 text-left">Product</th>
                  <th className="px-3 py-2 text-right">Unit Price</th>
                  <th className="px-3 py-2 text-right">Qty Sold</th>
                  <th className="px-3 py-2 text-right">Total Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {topProducts.map((p, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-3 py-2 text-gray-400 font-medium">#{i + 1}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-3">
                        {p.image ? (
                          <img src={p.image} alt={p.name} className="w-8 h-8 rounded object-cover" />
                        ) : (
                          <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
                            <FaBoxOpen className="text-gray-300 text-xs" />
                          </div>
                        )}
                        <span className="font-medium text-gray-900">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-right text-gray-600">{fmt(p.price)}</td>
                    <td className="px-3 py-2 text-right text-gray-600">{p.totalQuantity.toLocaleString()}</td>
                    <td className="px-3 py-2 text-right font-semibold text-green-600">{fmt(p.totalRevenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Section 6: Deliveryman Performance ── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <SectionHeader title="Deliveryman Performance" subtitle={`Top 10 deliverymen — ${range}`} />
        {deliverymen.length === 0 ? (
          <div className="h-20 flex items-center justify-center text-gray-400 text-sm">No data for this period</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                <tr>
                  <th className="px-3 py-2 text-left">#</th>
                  <th className="px-3 py-2 text-left">Deliveryman</th>
                  <th className="px-3 py-2 text-center">Rating</th>
                  <th className="px-3 py-2 text-right">Total</th>
                  <th className="px-3 py-2 text-right">Completed</th>
                  <th className="px-3 py-2 text-right">Cancelled</th>
                  <th className="px-3 py-2 text-right">Success Rate</th>
                  <th className="px-3 py-2 text-right">Earnings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {deliverymen.map((d, i) => {
                  const successRate = d.totalDeliveries > 0
                    ? ((d.completedDeliveries / d.totalDeliveries) * 100).toFixed(0)
                    : 0;
                  return (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-3 py-2 text-gray-400 font-medium">#{i + 1}</td>
                      <td className="px-3 py-2">
                        <p className="font-medium text-gray-900">{d.name}</p>
                        <p className="text-xs text-gray-400">{d.phone}</p>
                      </td>
                      <td className="px-3 py-2 text-center">
                        <span className="text-yellow-500">★</span>
                        <span className="text-gray-700 ml-1">{d.rating}</span>
                      </td>
                      <td className="px-3 py-2 text-right text-gray-600">{d.totalDeliveries}</td>
                      <td className="px-3 py-2 text-right text-green-600">{d.completedDeliveries}</td>
                      <td className="px-3 py-2 text-right text-red-500">{d.cancelledDeliveries}</td>
                      <td className="px-3 py-2 text-right">
                        <span className={`font-medium ${parseInt(successRate) >= 80 ? 'text-green-600' : parseInt(successRate) >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {successRate}%
                        </span>
                      </td>
                      <td className="px-3 py-2 text-right font-semibold text-green-600">{fmt(d.totalEarnings)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Section 7: Wallet & Withdrawal Stats ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Wallet overview cards */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <SectionHeader title="Wallet Overview" subtitle="Current platform wallet status" />
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-xs text-gray-500">Total Wallet Balance</p>
              <p className="text-xl font-bold text-green-700">{fmt(overview?.wallets?.totalBalance)}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-xs text-gray-500">Total COD Debt</p>
              <p className="text-xl font-bold text-red-600">{fmt(overview?.wallets?.totalDebt)}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-xs text-gray-500">Wallet Flow In</p>
              <p className="text-xl font-bold text-blue-700">{fmt(totalWalletIn)}</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <p className="text-xs text-gray-500">Wallet Flow Out</p>
              <p className="text-xl font-bold text-orange-600">{fmt(totalWalletOut)}</p>
            </div>
          </div>

          {/* Transactions by category */}
          <p className="text-sm font-semibold text-gray-700 mb-2">Transactions by Category</p>
          <div className="space-y-2">
            {walletStats.transactions.map((t, i) => (
              <div key={i} className="flex items-center justify-between text-sm py-1 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                  <span className="capitalize text-gray-700">{t.category}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded ${t.direction === 'incoming' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {t.direction === 'incoming' ? '+' : '-'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-medium text-gray-900">{fmt(t.totalAmount)}</span>
                  <span className="text-gray-400 text-xs ml-2">({t.count})</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Withdrawal requests */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <SectionHeader title="Withdrawal Requests" subtitle={`Summary — ${range}`} />
          <div className="mb-4">
            <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg mb-3">
              <FaWallet className="text-yellow-600" />
              <div>
                <p className="text-xs text-gray-500">Pending Requests</p>
                <p className="font-bold text-gray-900">
                  {overview?.withdrawals?.pendingCount} requests — {fmt(overview?.withdrawals?.pendingAmount)}
                </p>
              </div>
            </div>
          </div>

          {walletStats.withdrawals.length === 0 ? (
            <div className="h-20 flex items-center justify-center text-gray-400 text-sm">No withdrawals this period</div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={walletStats.withdrawals}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="status" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v}`} />
                  <Tooltip formatter={(v) => `$${parseFloat(v).toFixed(2)}`} />
                  <Bar dataKey="totalAmount" name="Amount" radius={[4, 4, 0, 0]}>
                    {walletStats.withdrawals.map((entry, i) => (
                      <Cell key={i} fill={
                        entry.status === 'approved' ? '#16a34a' :
                        entry.status === 'pending' ? '#d97706' :
                        entry.status === 'rejected' ? '#dc2626' : COLORS[i]
                      } />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              <div className="mt-4 space-y-2">
                {walletStats.withdrawals.map((w, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        w.status === 'approved' ? 'bg-green-100 text-green-700' :
                        w.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {w.status}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-medium text-gray-900">{fmt(w.totalAmount)}</span>
                      <span className="text-gray-400 text-xs ml-2">({w.count} requests)</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
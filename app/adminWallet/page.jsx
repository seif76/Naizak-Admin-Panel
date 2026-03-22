'use client';
import React, { useState, useEffect } from 'react';
import api from '../../lib/axios';
import {
  FaWallet,
  FaTruck,
  FaExchangeAlt,
  FaMoneyBillWave,
  FaArrowUp,
  FaArrowDown,
  FaEye,
} from 'react-icons/fa';
import { useRouter } from 'next/navigation';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// ─────────────────────────────────────────────
//  Helpers
// ─────────────────────────────────────────────

const formatDate = (dateString) => {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatAmount = (amount) => `$${parseFloat(amount || 0).toFixed(2)}`;

const categoryColors = {
  payment: 'bg-red-100 text-red-700',
  earning: 'bg-green-100 text-green-700',
  refund: 'bg-blue-100 text-blue-700',
  topup: 'bg-purple-100 text-purple-700',
  adjustment: 'bg-yellow-100 text-yellow-700',
  withdrawal: 'bg-orange-100 text-orange-700',
};

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  settled: 'bg-green-100 text-green-700',
  completed: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
};

// ─────────────────────────────────────────────
//  Sub-components
// ─────────────────────────────────────────────

const StatCard = ({ title, value, icon, subtitle, color = 'green' }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </div>
      <div className={`text-3xl text-${color}-500`}>{icon}</div>
    </div>
  </div>
);

const Badge = ({ label, colorClass }) => (
  <span className={`px-2 py-1 rounded text-xs font-medium ${colorClass}`}>{label}</span>
);

const Pagination = ({ currentPage, totalPages, onPageChange }) => (
  <div className="flex items-center justify-between mt-4">
    <p className="text-sm text-gray-600">
      Page {currentPage} of {totalPages}
    </p>
    <div className="flex gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-40 text-sm"
      >
        Previous
      </button>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-40 text-sm"
      >
        Next
      </button>
    </div>
  </div>
);

// ─────────────────────────────────────────────
//  Main Page
// ─────────────────────────────────────────────

export default function WalletDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  // Admin wallet
  const [adminWallet, setAdminWallet] = useState(null);

  // Wallet transactions
  const [transactions, setTransactions] = useState([]);
  const [txPage, setTxPage] = useState(1);
  const [txTotalPages, setTxTotalPages] = useState(1);
  const [txTotal, setTxTotal] = useState(0);
  const [txCategory, setTxCategory] = useState('');

  // COD debts overview
  const [debtSummary, setDebtSummary] = useState([]);
  const [codDebts, setCodDebts] = useState([]);
  const [codPage, setCodPage] = useState(1);
  const [codTotalPages, setCodTotalPages] = useState(1);
  const [codTotal, setCodTotal] = useState(0);
  const [codStatus, setCodStatus] = useState('');

  // ─── Fetch functions ───

  const fetchAdminWallet = async () => {
    try {
      const res = await api.get(`${BACKEND_URL}/api/admin/wallet/balance`);
      setAdminWallet(res.data.data);
    } catch (error) {
      console.error('Error fetching admin wallet:', error);
    }
  };

  const fetchTransactions = async (page = 1, category = '') => {
    try {
      const params = new URLSearchParams({ page, limit: 20 });
      if (category) params.append('category', category);
      const res = await api.get(`${BACKEND_URL}/api/admin/wallet/transactions?${params}`);
      const data = res.data.data;
      setTransactions(data.transactions);
      setTxTotalPages(data.totalPages);
      setTxTotal(data.totalTransactions);
      setTxPage(page);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const fetchDebtSummary = async () => {
    try {
      const res = await api.get(`${BACKEND_URL}/api/admin/wallet/cod-debts/summary`);
      setDebtSummary(res.data.data);
    } catch (error) {
      console.error('Error fetching debt summary:', error);
    }
  };

  const fetchCodDebts = async (page = 1, status = '') => {
    try {
      const params = new URLSearchParams({ page, limit: 20 });
      if (status) params.append('status', status);
      const res = await api.get(`${BACKEND_URL}/api/admin/wallet/cod-debts?${params}`);
      const data = res.data.data;
      setCodDebts(data.debts);
      setCodTotalPages(data.totalPages);
      setCodTotal(data.totalDebts);
      setCodPage(page);
    } catch (error) {
      console.error('Error fetching COD debts:', error);
    }
  };



  // ─── Initial load ───

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([
        fetchAdminWallet(),
        fetchTransactions(),
        fetchDebtSummary(),
        fetchCodDebts(),
      ]);
      setLoading(false);
    };
    init();
  }, []);

  // ─── Tab change handlers ───

  useEffect(() => {
    if (activeTab === 'transactions') fetchTransactions(1, txCategory);
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'cod') fetchCodDebts(1, codStatus);
  }, [activeTab]);

  // ─── Navigate to deliveryman detail page ───

  const handleViewDetails = (deliverymanId) => {
    router.push(`/adminWallet/${deliverymanId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // ─────────────────────────────────────────────
  //  Render
  // ─────────────────────────────────────────────

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Wallet Dashboard</h1>
        <p className="text-gray-600">Monitor platform earnings, transactions, and deliveryman COD debts</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Service Fees Collected"
          value={formatAmount(adminWallet?.balance)}
          icon={<FaWallet />}
          subtitle="Total platform earnings"
          color="green"
        />
        <StatCard
          title="Total Transactions"
          value={txTotal.toLocaleString()}
          icon={<FaExchangeAlt />}
          subtitle="All wallet movements"
          color="blue"
        />
        <StatCard
          title="Total COD Debts"
          value={codTotal.toLocaleString()}
          icon={<FaMoneyBillWave />}
          subtitle="Across all deliverymen"
          color="orange"
        />
        <StatCard
          title="Active Deliverymen"
          value={debtSummary.length}
          icon={<FaTruck />}
          subtitle="With wallet accounts"
          color="purple"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {[
          { key: 'overview', label: 'Deliveryman Debts Overview' },
          { key: 'transactions', label: 'All Transactions' },
          { key: 'cod', label: 'COD Debt Records' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab: Deliveryman Debts Overview ── */}
      {activeTab === 'overview' && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Deliveryman Debt Summary</h3>
            <p className="text-sm text-gray-500 mt-1">Click a row to see individual order debts</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3 text-left">Deliveryman</th>
                  <th className="px-4 py-3 text-left">Phone</th>
                  <th className="px-4 py-3 text-right">Wallet Balance</th>
                  <th className="px-4 py-3 text-right">Outstanding Debt</th>
                  <th className="px-4 py-3 text-center">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {debtSummary.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                      No deliverymen found
                    </td>
                  </tr>
                ) : (
                  debtSummary.map((d) => (
                    <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{d.name}</p>
                        <p className="text-xs text-gray-500">{d.email}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{d.phone_number}</td>
                      <td className="px-4 py-3 text-right font-semibold text-gray-900">
                        {formatAmount(d.balance)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={`font-semibold ${parseFloat(d.debt) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {formatAmount(d.debt)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleViewDetails(d.id)}
                          className="flex items-center gap-1 mx-auto px-3 py-1.5 bg-primary text-white text-xs rounded hover:bg-green-700 transition-colors"
                        >
                          <FaEye size={12} />
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Tab: All Transactions ── */}
      {activeTab === 'transactions' && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">All Wallet Transactions</h3>
            <select
              value={txCategory}
              onChange={(e) => {
                setTxCategory(e.target.value);
                fetchTransactions(1, e.target.value);
              }}
              className="border border-gray-200 rounded px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">All Categories</option>
              <option value="payment">Payment</option>
              <option value="earning">Earning</option>
              <option value="refund">Refund</option>
              <option value="topup">Top-up</option>
              <option value="adjustment">Adjustment</option>
              <option value="withdrawal">Withdrawal</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3 text-left">User</th>
                  <th className="px-4 py-3 text-left">Category</th>
                  <th className="px-4 py-3 text-left">Direction</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                  <th className="px-4 py-3 text-right">Balance After</th>
                  <th className="px-4 py-3 text-left">Description</th>
                  <th className="px-4 py-3 text-left">Reference</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-gray-400">
                      No transactions found
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{tx.wallet?.user?.name || '—'}</p>
                        <p className="text-xs text-gray-500">{tx.wallet?.user?.email || '—'}</p>
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          label={tx.category}
                          colorClass={categoryColors[tx.category] || 'bg-gray-100 text-gray-600'}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <span className={`flex items-center gap-1 text-xs font-medium ${
                          tx.direction === 'incoming' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {tx.direction === 'incoming' ? <FaArrowDown /> : <FaArrowUp />}
                          {tx.direction}
                        </span>
                      </td>
                      <td className={`px-4 py-3 text-right font-semibold ${
                        tx.direction === 'incoming' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {tx.direction === 'incoming' ? '+' : '-'}{formatAmount(tx.amount)}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-600">
                        {formatAmount(tx.balance_after)}
                      </td>
                      <td className="px-4 py-3 text-gray-600 max-w-xs truncate">
                        {tx.description || '—'}
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {tx.reference_type && (
                          <span className="capitalize">{tx.reference_type}</span>
                        )}
                        {tx.reference_id && ` #${tx.reference_id}`}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge
                          label={tx.status}
                          colorClass={statusColors[tx.status] || 'bg-gray-100 text-gray-600'}
                        />
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                        {formatDate(tx.createdAt)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="px-4 pb-4">
            <Pagination
              currentPage={txPage}
              totalPages={txTotalPages}
              onPageChange={(p) => fetchTransactions(p, txCategory)}
            />
          </div>
        </div>
      )}

      {/* ── Tab: COD Debt Records ── */}
      {activeTab === 'cod' && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">COD Debt Records</h3>
            <select
              value={codStatus}
              onChange={(e) => {
                setCodStatus(e.target.value);
                fetchCodDebts(1, e.target.value);
              }}
              className="border border-gray-200 rounded px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="settled">Settled</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3 text-left">Deliveryman</th>
                  <th className="px-4 py-3 text-left">Order #</th>
                  <th className="px-4 py-3 text-right">Debt Amount</th>
                  <th className="px-4 py-3 text-right">Debt Before</th>
                  <th className="px-4 py-3 text-right">Debt After</th>
                  <th className="px-4 py-3 text-right">Current Debt</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-left">Settled At</th>
                  <th className="px-4 py-3 text-left">Created At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {codDebts.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-gray-400">
                      No COD debt records found
                    </td>
                  </tr>
                ) : (
                  codDebts.map((debt) => (
                    <tr key={debt.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{debt.deliveryman?.name || '—'}</p>
                        <p className="text-xs text-gray-500">{debt.deliveryman?.phone_number || '—'}</p>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        #{debt.order_id}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-red-600">
                        {formatAmount(debt.amount)}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-500">
                        {formatAmount(debt.debt_before)}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-500">
                        {formatAmount(debt.debt_after)}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold">
                        <span className={parseFloat(debt.wallet?.debt) > 0 ? 'text-red-600' : 'text-green-600'}>
                          {formatAmount(debt.wallet?.debt)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge
                          label={debt.status}
                          colorClass={statusColors[debt.status] || 'bg-gray-100 text-gray-600'}
                        />
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {formatDate(debt.settled_at)}
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                        {formatDate(debt.createdAt)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="px-4 pb-4">
            <Pagination
              currentPage={codPage}
              totalPages={codTotalPages}
              onPageChange={(p) => fetchCodDebts(p, codStatus)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
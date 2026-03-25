'use client';
import React, { useState, useEffect } from 'react';
//import axios from 'axios';
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

  // Wallets management
  const [wallets, setWallets] = useState([]);
  const [walletsPage, setWalletsPage] = useState(1);
  const [walletsTotalPages, setWalletsTotalPages] = useState(1);
  const [walletsTotal, setWalletsTotal] = useState(0);
  const [walletsFrozenFilter, setWalletsFrozenFilter] = useState('');
  const [freezingId, setFreezingId] = useState(null);

  // Withdrawal requests
  const [withdrawals, setWithdrawals] = useState([]);
  const [withdrawalPage, setWithdrawalPage] = useState(1);
  const [withdrawalTotalPages, setWithdrawalTotalPages] = useState(1);
  const [withdrawalTotal, setWithdrawalTotal] = useState(0);
  const [withdrawalStatus, setWithdrawalStatus] = useState('');
  const [processingId, setProcessingId] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

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



  const fetchWallets = async (page = 1, isFrozen = '') => {
    try {
      const params = new URLSearchParams({ page, limit: 20 });
      if (isFrozen !== '') params.append('is_frozen', isFrozen);
      const res = await api.get(`${BACKEND_URL}/api/admin/wallet/wallets?${params}`);
      const data = res.data.data;
      setWallets(data.wallets);
      setWalletsTotalPages(data.totalPages);
      setWalletsTotal(data.totalWallets);
      setWalletsPage(page);
    } catch (error) {
      console.error('Error fetching wallets:', error);
    }
  };

  const handleFreezeToggle = async (userId, isFrozen) => {
    try {
      setFreezingId(userId);
      const action = isFrozen ? 'unfreeze' : 'freeze';
      await api.post(`${BACKEND_URL}/api/admin/wallet/wallets/${userId}/${action}`);
      fetchWallets(walletsPage, walletsFrozenFilter);
    } catch (error) {
      alert(error.response?.data?.error || `Failed to ${isFrozen ? 'unfreeze' : 'freeze'} wallet`);
    } finally {
      setFreezingId(null);
    }
  };

  const fetchWithdrawals = async (page = 1, status = '') => {
    try {
      const params = new URLSearchParams({ page, limit: 20 });
      if (status) params.append('status', status);
      const res = await api.get(`${BACKEND_URL}/api/admin/wallet/withdrawals?${params}`);
      const data = res.data.data;
      setWithdrawals(data.withdrawalRequests || []);
      setWithdrawalTotalPages(data.totalPages || 1);
      setWithdrawalTotal(data.totalRequests || 0);
      setWithdrawalPage(page);
    } catch (error) {
      console.error('Error fetching withdrawals:', error);
    }
  };

  const handleApprove = async (id) => {
    if (!id) return;
    if (!confirm('Approve this withdrawal? The amount will be deducted from the user wallet.')) return;
    alert(id);
    try {
      setProcessingId(id);
      await api.post(`${BACKEND_URL}/api/admin/wallet/withdrawals/${id}/approve`);
      fetchWithdrawals(withdrawalPage, withdrawalStatus);
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to approve withdrawal');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert('Please enter a rejection reason');
      return;
    }
    try {
      setProcessingId(rejectingId);
      await api.post(`${BACKEND_URL}/api/admin/wallet/withdrawals/${rejectingId}/reject`, {
        rejection_reason: rejectionReason,
      });
      setShowRejectModal(false);
      setRejectionReason('');
      setRejectingId(null);
      fetchWithdrawals(withdrawalPage, withdrawalStatus);
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to reject withdrawal');
    } finally {
      setProcessingId(null);
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
        fetchWallets(),
        //fetchWithdrawals(),
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

  useEffect(() => {
    if (activeTab === 'withdrawals') fetchWithdrawals(1, withdrawalStatus);
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'wallets') fetchWallets(1, walletsFrozenFilter);
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
          { key: 'wallets', label: 'Wallet Management' },
          { key: 'withdrawals', label: 'Withdrawal Requests' },

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
      {/* ── Tab: Wallet Management ── */}
      {activeTab === 'wallets' && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">All Wallets</h3>
              <p className="text-sm text-gray-500 mt-1">{walletsTotal} total wallets</p>
            </div>
            <select
              value={walletsFrozenFilter}
              onChange={(e) => {
                setWalletsFrozenFilter(e.target.value);
                fetchWallets(1, e.target.value);
              }}
              className="border border-gray-200 rounded px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">All Wallets</option>
              <option value="false">Active</option>
              <option value="true">Frozen</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3 text-left">User</th>
                  <th className="px-4 py-3 text-left">Role</th>
                  <th className="px-4 py-3 text-right">Balance</th>
                  <th className="px-4 py-3 text-right">Debt</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {wallets.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                      No wallets found
                    </td>
                  </tr>
                ) : (
                  wallets.map((w) => {
                    const user = w.user;
                    const role = user?.vendor_status !== 'none'
                      ? 'Vendor'
                      : user?.deliveryman_status !== 'none'
                      ? 'Deliveryman'
                      : 'Customer';

                    return (
                      <tr key={w.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-900">{user?.name || '—'}</p>
                          <p className="text-xs text-gray-500">{user?.email || '—'}</p>
                          <p className="text-xs text-gray-400">{user?.phone_number || '—'}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            role === 'Vendor' ? 'bg-blue-100 text-blue-700' :
                            role === 'Deliveryman' ? 'bg-orange-100 text-orange-700' :
                            'bg-purple-100 text-purple-700'
                          }`}>
                            {role}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-gray-900">
                          {formatAmount(w.balance)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className={`font-semibold ${parseFloat(w.debt) > 0 ? 'text-red-600' : 'text-gray-400'}`}>
                            {formatAmount(w.debt)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            w.is_frozen ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                          }`}>
                            {w.is_frozen ? '❄️ Frozen' : '✅ Active'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => handleFreezeToggle(user?.id, w.is_frozen)}
                            disabled={freezingId === user?.id}
                            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors disabled:opacity-50 ${
                              w.is_frozen
                                ? 'bg-green-600 text-white hover:bg-green-700'
                                : 'bg-red-600 text-white hover:bg-red-700'
                            }`}
                          >
                            {freezingId === user?.id
                              ? '...'
                              : w.is_frozen
                              ? 'Unfreeze'
                              : 'Freeze'}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="px-4 pb-4">
            <Pagination
              currentPage={walletsPage}
              totalPages={walletsTotalPages}
              onPageChange={(p) => fetchWallets(p, walletsFrozenFilter)}
            />
          </div>
        </div>
      )}
      {/* ── Tab: Withdrawal Requests ── */}
      {activeTab === 'withdrawals' && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Withdrawal Requests</h3>
              <p className="text-sm text-gray-500 mt-1">{withdrawalTotal} total requests</p>
            </div>
            <select
              value={withdrawalStatus}
              onChange={(e) => {
                setWithdrawalStatus(e.target.value);
                fetchWithdrawals(1, e.target.value);
              }}
              className="border border-gray-200 rounded px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3 text-left">User</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                  <th className="px-4 py-3 text-left">Bank Account</th>
                  <th className="px-4 py-3 text-left">Bank Name</th>
                  <th className="px-4 py-3 text-left">Account Holder</th>
                  <th className="px-4 py-3 text-left">IBAN</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-left">Requested At</th>
                  <th className="px-4 py-3 text-left">Processed At</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {withdrawals.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-8 text-center text-gray-400">
                      No withdrawal requests found
                    </td>
                  </tr>
                ) : (
                  withdrawals.filter(w => w && w.id).map((w) => (
                    <tr key={w.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{w.wallet?.user?.name || '—'}</p>
                        <p className="text-xs text-gray-500">{w.wallet?.user?.email || '—'}</p>
                        <p className="text-xs text-gray-400">{w.wallet?.user?.phone_number || '—'}</p>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-gray-900">
                        {formatAmount(w.amount)}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{w.bank_account || '—'}</td>
                      <td className="px-4 py-3 text-gray-600">{w.bank_name || '—'}</td>
                      <td className="px-4 py-3 text-gray-600">{w.account_holder_name || '—'}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{w.iban || '—'}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          w.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          w.status === 'approved' ? 'bg-green-100 text-green-700' :
                          w.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {w.status}
                        </span>
                        {w.status === 'rejected' && w.rejection_reason && (
                          <p className="text-xs text-red-500 mt-1 max-w-xs truncate" title={w.rejection_reason}>
                            {w.rejection_reason}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                        {formatDate(w.createdAt)}
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                        {w.processed_at ? formatDate(w.processed_at) : '—'}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {w.status === 'pending' ? (
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleApprove(w.id)}
                              disabled={processingId === w.id}
                              className="px-3 py-1.5 bg-green-600 text-white text-xs rounded hover:bg-green-700 disabled:opacity-50 transition-colors"
                            >
                              {processingId === w.id ? '...' : 'Approve'}
                            </button>
                            <button
                              onClick={() => { setRejectingId(w.id); setShowRejectModal(true); }}
                              disabled={processingId === w.id}
                              className="px-3 py-1.5 bg-red-600 text-white text-xs rounded hover:bg-red-700 disabled:opacity-50 transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">
                            {w.status === 'approved' ? '✅ Approved' : '❌ Rejected'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="px-4 pb-4">
            <Pagination
              currentPage={withdrawalPage}
              totalPages={withdrawalTotalPages}
              onPageChange={(p) => fetchWithdrawals(p, withdrawalStatus)}
            />
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Reject Withdrawal</h3>
            <p className="text-sm text-gray-600 mb-4">
              Please provide a reason for rejecting this withdrawal request.
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 mb-4 resize-none"
            />
            <div className="flex gap-3">
              <button
                onClick={() => { setShowRejectModal(false); setRejectionReason(''); setRejectingId(null); }}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={processingId === rejectingId}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 font-medium"
              >
                {processingId === rejectingId ? 'Rejecting...' : 'Confirm Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
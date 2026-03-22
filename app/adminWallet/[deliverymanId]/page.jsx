'use client';
import React, { useState, useEffect } from 'react';
import api from '../../../lib/axios';
import { useParams, useRouter } from 'next/navigation';

import {
  FaArrowLeft,
  FaWallet,
  FaMoneyBillWave,
  FaCheckCircle,
  FaClock,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaTimes,
} from 'react-icons/fa';

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

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  settled: 'bg-green-100 text-green-700',
};

// ─────────────────────────────────────────────
//  Sub-components
// ─────────────────────────────────────────────

const StatCard = ({ title, value, icon, color = 'green', subtitle }) => (
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

export default function DeliverymanDebtDetailsPage() {
  const { deliverymanId } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');

  // Settle state
  const [showSettleModal, setShowSettleModal] = useState(false);
  const [settleAmount, setSettleAmount] = useState('');
  const [settling, setSettling] = useState(false);
  const [settleError, setSettleError] = useState('');

  const fetchDetails = async (p = 1, status = '') => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ page: p, limit: 20 });
      if (status) params.append('status', status);
      const res = await api.get(
        `${BACKEND_URL}/api/admin/wallet/cod-debts/${deliverymanId}?${params}`
      );
      setData(res.data.data);
      setPage(p);
    } catch (error) {
      console.error('Full error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error message:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (deliverymanId) fetchDetails();
  }, [deliverymanId]);

  const handleSettleByAmount = async () => {
    if (!settleAmount || parseFloat(settleAmount) <= 0) {
      setSettleError('Please enter a valid amount');
      return;
    }
    try {
      setSettling(true);
      setSettleError('');
      await api.post(
        `${BACKEND_URL}/api/admin/wallet/cod-debts/${deliverymanId}/settle-amount`,
        { amount: parseFloat(settleAmount) }
      );
      setShowSettleModal(false);
      setSettleAmount('');
      fetchDetails(1, statusFilter); // Refresh data
    } catch (error) {
      setSettleError(error.response?.data?.error || 'Failed to settle debt');
    } finally {
      setSettling(false);
    }
  };

  const handleSettleAll = async () => {
    if (!confirm('Are you sure you want to settle ALL debt for this deliveryman?')) return;
    try {
      setSettling(true);
      await api.post(
        `${BACKEND_URL}/api/admin/wallet/cod-debts/${deliverymanId}/settle-all`
      );
      fetchDetails(1, statusFilter); // Refresh data
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to settle all debt');
    } finally {
      setSettling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6">
        <p className="text-gray-500">No data found for this deliveryman.</p>
      </div>
    );
  }

  const { deliveryman, wallet, debts, totalPages, totalDebts, totalPending, totalSettled } = data;

  // Filter debts client-side for the status tabs
  const filteredDebts = statusFilter
    ? debts.filter((d) => d.status === statusFilter)
    : debts;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <FaArrowLeft />
          <span className="text-sm">Back to Wallet Dashboard</span>
        </button>
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Deliveryman Debt Details</h1>
        <p className="text-gray-600">Full COD debt history and wallet information</p>
      </div>

      {/* Deliveryman Info Card */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Deliveryman Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <FaUser className="text-white" size={16} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Name</p>
              <p className="font-semibold text-gray-900">{deliveryman?.name || '—'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <FaEnvelope className="text-white" size={16} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p className="font-semibold text-gray-900">{deliveryman?.email || '—'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <FaPhone className="text-white" size={16} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Phone</p>
              <p className="font-semibold text-gray-900">{deliveryman?.phone_number || '—'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Wallet Balance"
          value={formatAmount(wallet?.balance)}
          icon={<FaWallet />}
          subtitle="Current available balance"
          color="green"
        />
        <StatCard
          title="Outstanding Debt"
          value={formatAmount(wallet?.debt)}
          icon={<FaMoneyBillWave />}
          subtitle="Total owed to platform"
          color="red"
        />
        <StatCard
          title="Pending Debt"
          value={formatAmount(totalPending)}
          icon={<FaClock />}
          subtitle="Not yet settled"
          color="orange"
        />
        <StatCard
          title="Total Settled"
          value={formatAmount(totalSettled)}
          icon={<FaCheckCircle />}
          subtitle="Successfully submitted"
          color="blue"
        />
      </div>

      {/* Settle Actions */}
      {parseFloat(wallet?.debt) > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Settle Debt</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setShowSettleModal(true)}
              disabled={settling}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 font-medium"
            >
              <FaMoneyBillWave />
              Settle by Amount
            </button>
            <button
              onClick={handleSettleAll}
              disabled={settling}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 font-medium"
            >
              <FaCheckCircle />
              Settle All Debt ({formatAmount(wallet?.debt)})
            </button>
          </div>
        </div>
      )}

      {/* Debt Records Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Debt Records</h3>
            <p className="text-sm text-gray-500 mt-1">{totalDebts} total records</p>
          </div>

          {/* Status filter tabs */}
          <div className="flex gap-2">
            {[
              { value: '', label: 'All' },
              { value: 'pending', label: 'Pending' },
              { value: 'settled', label: 'Settled' },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => {
                  setStatusFilter(tab.value);
                  fetchDetails(1, tab.value);
                }}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  statusFilter === tab.value
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 text-left">Order #</th>
                <th className="px-4 py-3 text-right">Order Total</th>
                <th className="px-4 py-3 text-right">Vendor Fee</th>
                <th className="px-4 py-3 text-right">Debt Amount</th>
                <th className="px-4 py-3 text-right">Debt Before</th>
                <th className="px-4 py-3 text-right">Debt After</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-left">Created At</th>
                <th className="px-4 py-3 text-left">Settled At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredDebts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-gray-400">
                    No debt records found
                  </td>
                </tr>
              ) : (
                filteredDebts.map((debt) => (
                  <tr key={debt.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      #{debt.order_id}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600">
                      {formatAmount(debt.order?.total_price)}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600">
                      {formatAmount(debt.order?.vendor_fee)}
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
                    <td className="px-4 py-3 text-center">
                      <Badge
                        label={debt.status}
                        colorClass={statusColors[debt.status] || 'bg-gray-100 text-gray-600'}
                      />
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                      {formatDate(debt.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                      {formatDate(debt.settled_at)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 pb-4">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(p) => fetchDetails(p, statusFilter)}
          />
        </div>
      </div>
      {/* Settle by Amount Modal */}
      {showSettleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Settle Debt by Amount</h3>
              <button
                onClick={() => { setShowSettleModal(false); setSettleError(''); setSettleAmount(''); }}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Outstanding Debt</span>
                <span className="font-bold text-red-600">{formatAmount(wallet?.debt)}</span>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount Paid by Deliveryman
              </label>
              <input
                type="number"
                value={settleAmount}
                onChange={(e) => { setSettleAmount(e.target.value); setSettleError(''); }}
                placeholder="Enter amount"
                min="0"
                max={wallet?.debt}
                step="0.01"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {settleError && (
                <p className="text-red-500 text-sm mt-2">{settleError}</p>
              )}
            </div>

            {settleAmount && parseFloat(settleAmount) > 0 && (
              <div className="mb-4 p-3 bg-green-50 rounded-lg text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Remaining after settlement</span>
                  <span className="font-semibold text-gray-800">
                    {formatAmount(Math.max(0, parseFloat(wallet?.debt || 0) - parseFloat(settleAmount || 0)))}
                  </span>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => { setShowSettleModal(false); setSettleError(''); setSettleAmount(''); }}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSettleByAmount}
                disabled={settling || !settleAmount}
                className="flex-1 px-4 py-3 bg-primary text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 font-medium"
              >
                {settling ? 'Settling...' : 'Confirm Settlement'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
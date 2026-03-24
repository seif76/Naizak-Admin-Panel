'use client';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import api from '../../../lib/axios';
import { CustomersRoute } from '../../../components/auth/ProtectedRoute';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Star, 
  Calendar,
  ShoppingBag,
  DollarSign,
  Activity,
  Edit,
  Trash2,
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
  Snowflake,
  CheckCircle,
} from 'lucide-react';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

function CustomerDetailsPage() {
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');
  const searchParams = useSearchParams();
  const router = useRouter();
  const customerId = searchParams.get('id');

  // ─── Wallet state ───
  const [walletData, setWalletData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [txPage, setTxPage] = useState(1);
  const [txTotalPages, setTxTotalPages] = useState(1);
  const [txTotal, setTxTotal] = useState(0);
  const [walletLoading, setWalletLoading] = useState(false);
  const [freezing, setFreezing] = useState(false);

  // ─────────────────────────────────────────────
  //  Fetch functions
  // ─────────────────────────────────────────────

  const fetchCustomerDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/admin/customers/${customerId}`);
      setCustomer(response.data);

      const ordersResponse = await api.get(`/api/admin/customers/${customerId}/orders`);
      setOrders(ordersResponse.data.orders || []);
    } catch (error) {
      console.error('Error fetching customer details:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWalletData = async (page = 1) => {
    try {
      setWalletLoading(true);

      // Fetch wallet info + transactions
      const [walletRes, txRes] = await Promise.all([
        api.get(`/api/wallet/user/${customerId}`),
        api.get(`/api/wallet/user/${customerId}/transactions?page=${page}&limit=10`),
      ]);

      setWalletData(walletRes.data?.data?.wallet || walletRes.data?.wallet || null);
      const txData = txRes.data?.data || txRes.data || {};
      setTransactions(txData.transactions || []);
      setTxTotalPages(txData.totalPages || 1);
      setTxTotal(txData.totalTransactions || 0);
      setTxPage(page);
    } catch (error) {
      console.error('Error fetching wallet data:', error);
    } finally {
      setWalletLoading(false);
    }
  };

  const handleFreezeToggle = async () => {
    if (!walletData) return;
    try {
      setFreezing(true);
      const action = walletData.is_frozen ? 'unfreeze' : 'freeze';
      await api.post(`/api/admin/wallet/wallets/${customerId}/${action}`);
      await fetchWalletData(txPage);
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to update wallet status');
    } finally {
      setFreezing(false);
    }
  };

  const updateCustomerStatus = async (newStatus) => {
    try {
      await api.put(`/api/admin/customers/${customerId}/status`, {
        customer_status: newStatus,
      });
      fetchCustomerDetails();
    } catch (error) {
      console.error('Error updating customer status:', error);
    }
  };

  useEffect(() => {
    if (customerId) fetchCustomerDetails();
  }, [customerId]);

  useEffect(() => {
    if (activeTab === 'wallet' && customerId) fetchWalletData();
  }, [activeTab, customerId]);

  // ─────────────────────────────────────────────
  //  Helpers
  // ─────────────────────────────────────────────

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Deactivated': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOrderStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const categoryColors = {
    payment: 'bg-red-100 text-red-700',
    earning: 'bg-green-100 text-green-700',
    refund: 'bg-blue-100 text-blue-700',
    topup: 'bg-purple-100 text-purple-700',
    adjustment: 'bg-yellow-100 text-yellow-700',
    withdrawal: 'bg-orange-100 text-orange-700',
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatAmount = (amount) => `$${parseFloat(amount || 0).toFixed(2)}`;

  // ─────────────────────────────────────────────
  //  Loading / not found states
  // ─────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <User className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-xl font-semibold text-gray-600">Customer not found</h2>
          <button
            onClick={() => router.push('/customers/list')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Customers
          </button>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────
  //  Render
  // ─────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/customers/list')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Customer Details</h1>
                <p className="text-gray-600">ID: {customer.id}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => updateCustomerStatus(customer.customer_status === 'Active' ? 'Deactivated' : 'Active')}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  customer.customer_status === 'Active'
                    ? 'border-red-300 text-red-700 hover:bg-red-50'
                    : 'border-green-300 text-green-700 hover:bg-green-50'
                }`}
              >
                {customer.customer_status === 'Active' ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Customer Overview */}
        <div className="bg-white rounded-lg shadow-sm border mb-8">
          <div className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden">
                  <img
                    className="w-full h-full object-cover rounded-full"
                    src={customer.profile_photo}
                    alt="Customer Profile"
                    width={80}
                    height={80}
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{customer.name}</h2>
                  <p className="text-gray-600">{customer.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(customer.customer_status)}`}>
                      {customer.customer_status}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm text-gray-600">{customer.rating || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Phone Number</p>
                  <p className="font-medium">{customer.phone_number}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{customer.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Gender</p>
                  <p className="font-medium capitalize">{customer.gender || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Joined</p>
                  <p className="font-medium">{formatDate(customer.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { key: 'details', label: 'Details' },
                { key: 'orders', label: `Orders (${orders.length})` },
                { key: 'wallet', label: 'Wallet' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* ── Details Tab ── */}
            {activeTab === 'details' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Full Name</span>
                        <span className="font-medium">{customer.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email</span>
                        <span className="font-medium">{customer.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phone</span>
                        <span className="font-medium">{customer.phone_number}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Gender</span>
                        <span className="font-medium capitalize">{customer.gender || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Account Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status</span>
                        <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(customer.customer_status)}`}>
                          {customer.customer_status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Rating</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span>{customer.rating || 0}</span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Member Since</span>
                        <span className="font-medium">{formatDate(customer.createdAt)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Updated</span>
                        <span className="font-medium">{formatDate(customer.updatedAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Orders Tab ── */}
            {activeTab === 'orders' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Order History</h3>
                {orders.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500">No orders found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <ShoppingBag className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-medium">Order #{order.id}</h4>
                              <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getOrderStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                            <span className="font-semibold text-lg">
                              ${order.total_amount || order.total_price || 0}
                            </span>
                          </div>
                        </div>
                        {order.items && order.items.length > 0 && (
                          <div className="mt-3 pt-3 border-t">
                            <p className="text-sm text-gray-600 mb-2">Items:</p>
                            <div className="space-y-1">
                              {order.items.slice(0, 3).map((item, index) => (
                                <div key={index} className="flex justify-between text-sm">
                                  <span>{item.product?.name || item.name || `Item ${index + 1}`}</span>
                                  <span>${item.price || 0}</span>
                                </div>
                              ))}
                              {order.items.length > 3 && (
                                <p className="text-sm text-gray-500">+{order.items.length - 3} more items</p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── Wallet Tab ── */}
            {activeTab === 'wallet' && (
              <div>
                {walletLoading && !walletData ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                  </div>
                ) : !walletData ? (
                  <div className="text-center py-8">
                    <Wallet className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500">No wallet found for this customer</p>
                  </div>
                ) : (
                  <div className="space-y-6">

                    {/* Wallet summary cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white border rounded-lg p-4 shadow-sm">
                        <p className="text-sm text-gray-500">Current Balance</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">
                          {formatAmount(walletData.balance)}
                        </p>
                      </div>
                      <div className="bg-white border rounded-lg p-4 shadow-sm">
                        <p className="text-sm text-gray-500">Total Transactions</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{txTotal}</p>
                      </div>
                      <div className="bg-white border rounded-lg p-4 shadow-sm">
                        <p className="text-sm text-gray-500">Wallet Status</p>
                        <div className="flex items-center gap-2 mt-1">
                          {walletData.is_frozen ? (
                            <>
                              <Snowflake className="w-5 h-5 text-blue-500" />
                              <span className="text-lg font-bold text-blue-600">Frozen</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-5 h-5 text-green-500" />
                              <span className="text-lg font-bold text-green-600">Active</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Freeze / Unfreeze button */}
                    <div className="flex items-center gap-4">
                      <button
                        onClick={handleFreezeToggle}
                        disabled={freezing}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 ${
                          walletData.is_frozen
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-red-600 text-white hover:bg-red-700'
                        }`}
                      >
                        {walletData.is_frozen ? (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            {freezing ? 'Unfreezing...' : 'Unfreeze Wallet'}
                          </>
                        ) : (
                          <>
                            <Snowflake className="w-4 h-4" />
                            {freezing ? 'Freezing...' : 'Freeze Wallet'}
                          </>
                        )}
                      </button>
                      {walletData.is_frozen && (
                        <p className="text-sm text-blue-600">
                          ❄️ This wallet is currently frozen — payments and withdrawals are blocked.
                        </p>
                      )}
                    </div>

                    {/* Transactions table */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">
                        Transaction History
                        {walletLoading && (
                          <span className="ml-2 inline-block w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin align-middle" />
                        )}
                      </h3>

                      {transactions.length === 0 ? (
                        <div className="text-center py-8 border rounded-lg">
                          <DollarSign className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                          <p className="text-gray-500">No transactions yet</p>
                        </div>
                      ) : (
                        <div className="border rounded-lg overflow-hidden">
                          <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                              <tr>
                                <th className="px-4 py-3 text-left">Type</th>
                                <th className="px-4 py-3 text-left">Direction</th>
                                <th className="px-4 py-3 text-right">Amount</th>
                                <th className="px-4 py-3 text-right">Balance After</th>
                                <th className="px-4 py-3 text-left">Description</th>
                                <th className="px-4 py-3 text-left">Date</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {transactions.map((tx) => (
                                <tr key={tx.id} className="hover:bg-gray-50">
                                  <td className="px-4 py-3">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${categoryColors[tx.category] || 'bg-gray-100 text-gray-600'}`}>
                                      {tx.category}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3">
                                    <span className={`flex items-center gap-1 text-xs font-medium ${tx.direction === 'incoming' ? 'text-green-600' : 'text-red-600'}`}>
                                      {tx.direction === 'incoming'
                                        ? <ArrowDownCircle className="w-4 h-4" />
                                        : <ArrowUpCircle className="w-4 h-4" />}
                                      {tx.direction}
                                    </span>
                                  </td>
                                  <td className={`px-4 py-3 text-right font-semibold ${tx.direction === 'incoming' ? 'text-green-600' : 'text-red-600'}`}>
                                    {tx.direction === 'incoming' ? '+' : '-'}{formatAmount(tx.amount)}
                                  </td>
                                  <td className="px-4 py-3 text-right text-gray-600">
                                    {formatAmount(tx.balance_after)}
                                  </td>
                                  <td className="px-4 py-3 text-gray-600 max-w-xs truncate">
                                    {tx.description || '—'}
                                  </td>
                                  <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                                    {formatDate(tx.createdAt)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>

                          {/* Pagination */}
                          {txTotalPages > 1 && (
                            <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50">
                              <p className="text-sm text-gray-600">
                                Page {txPage} of {txTotalPages}
                              </p>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => fetchWalletData(txPage - 1)}
                                  disabled={txPage === 1}
                                  className="px-3 py-1 rounded bg-white border text-gray-600 hover:bg-gray-100 disabled:opacity-40 text-sm"
                                >
                                  Previous
                                </button>
                                <button
                                  onClick={() => fetchWalletData(txPage + 1)}
                                  disabled={txPage === txTotalPages}
                                  className="px-3 py-1 rounded bg-white border text-gray-600 hover:bg-gray-100 disabled:opacity-40 text-sm"
                                >
                                  Next
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProtectedCustomerDetailsPage() {
  return (
    <CustomersRoute>
      <CustomerDetailsPage />
    </CustomersRoute>
  );
}
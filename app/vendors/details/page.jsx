'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
//import axios from 'axios';
import api from '../../../lib/axios';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Star,
  Calendar,
  Store,
  Package,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  ShoppingBag,
  Wallet,
  Snowflake,
  ArrowDownCircle,
  ArrowUpCircle,
  Image,
  Edit,
} from 'lucide-react';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function VendorDetailsPage() {
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [editForm, setEditForm] = useState({});
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone_number = searchParams.get('phone_number');

  // ─── Orders state ───
  const [orders, setOrders] = useState([]);
  const [ordersPage, setOrdersPage] = useState(1);
  const [ordersTotalPages, setOrdersTotalPages] = useState(1);
  const [ordersTotal, setOrdersTotal] = useState(0);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [orderIdSearch, setOrderIdSearch] = useState('');
  const [orderStats, setOrderStats] = useState(null);

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

  const fetchVendorDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`${BACKEND_URL}/api/admin/vendors/details?phone_number=${phone_number}`);
      setVendor(res.data);
      setEditForm({
        name: res.data.name,
        email: res.data.email,
        phone_number: res.data.phone_number,
        gender: res.data.gender,
        vendor_status: res.data.vendor_status,
        shop_name: res.data.vendor_info?.shop_name || '',
        shop_location: res.data.vendor_info?.shop_location || '',
        owner_name: res.data.vendor_info?.owner_name || '',
      });
    } catch (error) {
      console.error('Error fetching vendor details:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async (page = 1, orderId = '') => {
    if (!vendor?.id) return;
    try {
      setOrdersLoading(true);
      const params = new URLSearchParams({ page, limit: 10 });
      if (orderId) params.append('orderId', orderId);
      const res = await api.get(`${BACKEND_URL}/api/admin/vendors/${vendor.id}/orders?${params}`);
      const data = res.data;
      setOrders(data.orders || []);
      setOrdersTotalPages(data.totalPages || 1);
      setOrdersTotal(data.totalOrders || 0);
      setOrdersPage(page);
      setOrderStats(data.orderStats || null);
    } catch (error) {
      console.error('Error fetching vendor orders:', error);
    } finally {
      setOrdersLoading(false);
    }
  };

  const fetchWalletData = async (page = 1) => {
    try {
      setWalletLoading(true);
      const [walletRes, txRes] = await Promise.all([
        api.get(`/api/wallet/user/${vendor?.id}`),
        api.get(`/api/wallet/user/${vendor?.id}/transactions?page=${page}&limit=10`),
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
      await api.post(`${BACKEND_URL}/api/admin/wallet/wallets/${vendor?.id}/${action}`);
      await fetchWalletData(txPage);
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to update wallet status');
    } finally {
      setFreezing(false);
    }
  };

  const updateVendorStatus = async (status) => {
    try {
      setUpdating(true);
      await api.put(`${BACKEND_URL}/api/admin/vendors/status`, { phone_number, vendor_status: status });
      await fetchVendorDetails();
    } catch (error) {
      console.error('Error updating vendor status:', error);
    } finally {
      setUpdating(false);
    }
  };

  const updateVendorDetails = async () => {
    try {
      setUpdating(true);
      await api.put(`${BACKEND_URL}/api/admin/vendors/update`, { phone_number, ...editForm });
      await fetchVendorDetails();
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating vendor details:', error);
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    if (phone_number) fetchVendorDetails();
  }, [phone_number]);

  useEffect(() => {
    if (activeTab === 'wallet' && vendor?.id) fetchWalletData();
    if (activeTab === 'orders' && vendor?.id) fetchOrders();
  }, [activeTab, vendor?.id]);

  // ─────────────────────────────────────────────
  //  Helpers
  // ─────────────────────────────────────────────

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  const formatAmount = (amount) => `$${parseFloat(amount || 0).toFixed(2)}`;

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
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

  // ─────────────────────────────────────────────
  //  Loading / not found
  // ─────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Store className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-xl font-semibold text-gray-600">Vendor not found</h2>
          <button onClick={() => router.push('/vendors/list')} className="mt-4 px-4 py-2 bg-primary text-white rounded-lg">
            Back to Vendors
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
              <button onClick={() => router.push('/vendors/list')} className="p-2 hover:bg-gray-100 rounded-lg">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Vendor Details</h1>
                <p className="text-gray-600">ID: {vendor.id}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowEditModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                <Edit className="w-4 h-4" /> Edit
              </button>
              <button
                onClick={() => updateVendorStatus(vendor.vendor_status === 'Active' ? 'Deactivated' : 'Active')}
                disabled={updating}
                className={`px-4 py-2 rounded-lg border transition-colors disabled:opacity-50 ${
                  vendor.vendor_status === 'Active'
                    ? 'border-red-300 text-red-700 hover:bg-red-50'
                    : 'border-green-300 text-green-700 hover:bg-green-50'
                }`}
              >
                {vendor.vendor_status === 'Active' ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Vendor Overview Card */}
        <div className="bg-white rounded-lg shadow-sm border mb-8">
          <div className="p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden">
                {vendor.profile_photo ? (
                  <img src={vendor.profile_photo} alt="Vendor" className="w-full h-full object-cover" />
                ) : (
                  <Store className="w-10 h-10 text-blue-600" />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{vendor.name}</h2>
                <p className="text-gray-600">{vendor.vendor_info?.shop_name || 'No shop name'}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(vendor.vendor_status)}`}>
                    {vendor.vendor_status}
                  </span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm text-gray-600">{vendor.rating || 0}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{vendor.phone_number}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{vendor.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Store className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Shop Location</p>
                  <p className="font-medium">{vendor.vendor_info?.shop_location || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Joined</p>
                  <p className="font-medium">{formatDate(vendor.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6 overflow-x-auto">
              {[
                { key: 'overview', label: 'Overview' },
                { key: 'products', label: `Products (${vendor.products_count || 0})` },
                { key: 'orders', label: `Orders (${vendor.orderStats?.total || 0})` },
                { key: 'images', label: 'Images' },
                { key: 'wallet', label: 'Wallet' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
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

            {/* ── Overview Tab ── */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Sales & Order Stats */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <DollarSign className="w-5 h-5" /> Sales Overview
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Total Sales</p>
                      <p className="text-2xl font-bold text-green-600 mt-1">
                        {formatAmount(vendor.orderStats?.totalSales)}
                      </p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Total Orders</p>
                      <p className="text-2xl font-bold text-blue-600 mt-1">{vendor.orderStats?.total || 0}</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Completed</p>
                      <p className="text-2xl font-bold text-purple-600 mt-1">{vendor.orderStats?.completed || 0}</p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Pending</p>
                      <p className="text-2xl font-bold text-yellow-600 mt-1">{vendor.orderStats?.pending || 0}</p>
                    </div>
                  </div>
                </div>

                {/* Personal & Shop Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Full Name</span>
                        <span className="font-medium">{vendor.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email</span>
                        <span className="font-medium">{vendor.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phone</span>
                        <span className="font-medium">{vendor.phone_number}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Gender</span>
                        <span className="font-medium capitalize">{vendor.gender || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Member Since</span>
                        <span className="font-medium">{formatDate(vendor.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Shop Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shop Name</span>
                        <span className="font-medium">{vendor.vendor_info?.shop_name || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Owner Name</span>
                        <span className="font-medium">{vendor.vendor_info?.owner_name || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shop Location</span>
                        <span className="font-medium">{vendor.vendor_info?.shop_location || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(vendor.vendor_status)}`}>
                          {vendor.vendor_status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Rating</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span>{vendor.rating || 0}/5</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Products Tab ── */}
            {activeTab === 'products' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Products ({vendor.products_count || 0})</h3>
                {vendor.products && vendor.products.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {vendor.products.map((product) => (
                      <div key={product.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3">
                          {product.image ? (
                            <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-lg" />
                          ) : (
                            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                              <Package className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{product.name}</h4>
                            <p className="text-sm text-gray-600 truncate">{product.description}</p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-green-600 font-semibold">${product.price}</span>
                              <span className={`px-2 py-1 rounded text-xs ${
                                product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {product.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500">No products found</p>
                  </div>
                )}
              </div>
            )}

            {/* ── Orders Tab ── */}
            {activeTab === 'orders' && (
              <div>
                {/* Order summary cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-600">Total Sales</p>
                    <p className="text-xl font-bold text-green-600">{formatAmount(orderStats?.totalSales || vendor.orderStats?.totalSales)}</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-600">Total Orders</p>
                    <p className="text-xl font-bold text-blue-600">{orderStats?.total || vendor.orderStats?.total || 0}</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-600">Completed</p>
                    <p className="text-xl font-bold text-purple-600">{orderStats?.completed || vendor.orderStats?.completed || 0}</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-600">Cancelled</p>
                    <p className="text-xl font-bold text-red-600">{orderStats?.cancelled || vendor.orderStats?.cancelled || 0}</p>
                  </div>
                </div>

                {/* Search bar */}
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-lg font-semibold">All Orders</h3>
                  <div className="flex items-center gap-2 ml-auto">
                    <input
                      type="number"
                      value={orderIdSearch}
                      onChange={(e) => {
                        setOrderIdSearch(e.target.value);
                        setOrdersPage(1);
                        fetchOrders(1, e.target.value);
                      }}
                      placeholder="Search by Order ID..."
                      className="border rounded-lg px-3 py-1.5 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {orderIdSearch && (
                      <button
                        onClick={() => { setOrderIdSearch(''); fetchOrders(1, ''); }}
                        className="text-sm text-red-500 hover:text-red-700"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                {ordersLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500">No orders found</p>
                  </div>
                ) : (
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                        <tr>
                          <th className="px-4 py-3 text-left">Order #</th>
                          <th className="px-4 py-3 text-left">Customer</th>
                          <th className="px-4 py-3 text-left">Payment</th>
                          <th className="px-4 py-3 text-right">Total</th>
                          <th className="px-4 py-3 text-right">Vendor Earned</th>
                          <th className="px-4 py-3 text-center">Status</th>
                          <th className="px-4 py-3 text-left">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {orders.map((order) => (
                          <tr key={order.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-900">#{order.id}</td>
                            <td className="px-4 py-3">
                              <p className="font-medium text-gray-900">{order.customer?.name || '—'}</p>
                              <p className="text-xs text-gray-500">{order.customer?.phone_number || '—'}</p>
                            </td>
                            <td className="px-4 py-3">
                              <span className="capitalize text-gray-600">{order.payment_method}</span>
                            </td>
                            <td className="px-4 py-3 text-right font-semibold text-gray-900">
                              {formatAmount(order.total_price)}
                            </td>
                            <td className="px-4 py-3 text-right font-semibold text-green-600">
                              {formatAmount(order.vendor_fee)}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getOrderStatusColor(order.status)}`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                              {formatDate(order.createdAt)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Pagination */}
                    {ordersTotalPages > 1 && (
                      <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50">
                        <p className="text-sm text-gray-600">
                          Page {ordersPage} of {ordersTotalPages} — {ordersTotal} total orders
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => fetchOrders(ordersPage - 1, orderIdSearch)}
                            disabled={ordersPage === 1}
                            className="px-3 py-1 rounded bg-white border text-gray-600 hover:bg-gray-100 disabled:opacity-40 text-sm"
                          >
                            Previous
                          </button>
                          <button
                            onClick={() => fetchOrders(ordersPage + 1, orderIdSearch)}
                            disabled={ordersPage === ordersTotalPages}
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
            )}

            {/* ── Images Tab ── */}
            {activeTab === 'images' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Vendor Images</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { url: vendor.profile_photo, title: 'Profile Photo' },
                    { url: vendor.vendor_info?.shop_front_photo, title: 'Shop Front' },
                    { url: vendor.vendor_info?.logo, title: 'Shop Logo' },
                    { url: vendor.vendor_info?.passport_photo, title: 'Passport Photo' },
                    { url: vendor.vendor_info?.license_photo, title: 'License Photo' },
                  ].map((img, i) => (
                    <div key={i} className="bg-white border rounded-lg overflow-hidden shadow-sm">
                      {img.url ? (
                        <img
                          src={img.url}
                          alt={img.title}
                          className="w-full h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => { setSelectedImage(img); setShowImageModal(true); }}
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                          <div className="text-center">
                            <Image className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                            <p className="text-xs text-gray-400">Not uploaded</p>
                          </div>
                        </div>
                      )}
                      <div className="p-3">
                        <p className="font-medium text-sm text-gray-800">{img.title}</p>
                        <p className="text-xs text-gray-500">{img.url ? 'Uploaded ✅' : 'Missing ❌'}</p>
                      </div>
                    </div>
                  ))}
                </div>
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
                    <p className="text-gray-500">No wallet found for this vendor</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Wallet summary */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white border rounded-lg p-4 shadow-sm">
                        <p className="text-sm text-gray-500">Current Balance</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{formatAmount(walletData.balance)}</p>
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

                    {/* Freeze / Unfreeze */}
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
                          <><CheckCircle className="w-4 h-4" />{freezing ? 'Unfreezing...' : 'Unfreeze Wallet'}</>
                        ) : (
                          <><Snowflake className="w-4 h-4" />{freezing ? 'Freezing...' : 'Freeze Wallet'}</>
                        )}
                      </button>
                      {walletData.is_frozen && (
                        <p className="text-sm text-blue-600">❄️ This wallet is currently frozen — payments and withdrawals are blocked.</p>
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
                                      {tx.direction === 'incoming' ? <ArrowDownCircle className="w-4 h-4" /> : <ArrowUpCircle className="w-4 h-4" />}
                                      {tx.direction}
                                    </span>
                                  </td>
                                  <td className={`px-4 py-3 text-right font-semibold ${tx.direction === 'incoming' ? 'text-green-600' : 'text-red-600'}`}>
                                    {tx.direction === 'incoming' ? '+' : '-'}{formatAmount(tx.amount)}
                                  </td>
                                  <td className="px-4 py-3 text-right text-gray-600">{formatAmount(tx.balance_after)}</td>
                                  <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{tx.description || '—'}</td>
                                  <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{formatDate(tx.createdAt)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>

                          {txTotalPages > 1 && (
                            <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50">
                              <p className="text-sm text-gray-600">Page {txPage} of {txTotalPages}</p>
                              <div className="flex gap-2">
                                <button onClick={() => fetchWalletData(txPage - 1)} disabled={txPage === 1}
                                  className="px-3 py-1 rounded bg-white border text-gray-600 hover:bg-gray-100 disabled:opacity-40 text-sm">
                                  Previous
                                </button>
                                <button onClick={() => fetchWalletData(txPage + 1)} disabled={txPage === txTotalPages}
                                  className="px-3 py-1 rounded bg-white border text-gray-600 hover:bg-gray-100 disabled:opacity-40 text-sm">
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

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Edit Vendor Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: 'Name', key: 'name', type: 'text' },
                { label: 'Email', key: 'email', type: 'email' },
                { label: 'Phone Number', key: 'phone_number', type: 'text' },
                { label: 'Shop Name', key: 'shop_name', type: 'text' },
                { label: 'Owner Name', key: 'owner_name', type: 'text' },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                  <input type={field.type} value={editForm[field.key] || ''} onChange={(e) => setEditForm({ ...editForm, [field.key]: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select value={editForm.gender || ''} onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select value={editForm.vendor_status || ''} onChange={(e) => setEditForm({ ...editForm, vendor_status: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="Active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="Deactivated">Deactivated</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Shop Location</label>
                <input type="text" value={editForm.shop_location || ''} onChange={(e) => setEditForm({ ...editForm, shop_location: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={updateVendorDetails} disabled={updating}
                className="flex-1 bg-blue-500 text-white px-4 py-2.5 rounded-lg hover:bg-blue-600 disabled:opacity-50 font-medium">
                {updating ? 'Saving...' : 'Save Changes'}
              </button>
              <button onClick={() => setShowEditModal(false)}
                className="flex-1 bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-200 font-medium">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && selectedImage && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-4 max-w-3xl w-full mx-4 max-h-[90vh] overflow-auto shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{selectedImage.title}</h3>
              <button onClick={() => setShowImageModal(false)} className="text-gray-500 hover:text-gray-700 text-sm px-3 py-1 border rounded">
                Close
              </button>
            </div>
            <img src={selectedImage.url} alt={selectedImage.title} className="w-full h-auto max-h-[70vh] object-contain rounded" />
          </div>
        </div>
      )}
    </div>
  );
}
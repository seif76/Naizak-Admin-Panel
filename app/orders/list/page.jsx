'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FaShoppingCart, FaSpinner, FaCheck, FaTimes, FaEye, FaTruck, FaUser, FaStore, FaFilter } from 'react-icons/fa';

export default function OrdersListPage() {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const router = useRouter();
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const fetchStats = async () => {
    try {
      // This would need to be implemented in the backend
      const res = await axios.get(`${BACKEND_URL}/api/admin/orders/stats`);
      setStats(res.data);
    } catch (error) {
      console.error('Error fetching order stats:', error);
      // Fallback stats
      setStats({
        total: 0,
        pending: 0,
        confirmed: 0,
        completed: 0,
        cancelled: 0
      });
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BACKEND_URL}/api/admin/orders`, {
        params: { page, limit: 10, status: statusFilter || undefined },
      });
      setOrders(res.data.orders || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
    setLoading(false);
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await axios.put(`${BACKEND_URL}/api/admin/orders/${orderId}/status`, {
        status: status
      });
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const navigateToDetails = (orderId) => {
    router.push(`/orders/details?id=${orderId}`);
  };

  const navigateToStatusPage = (status) => {
    router.push(`/orders/${status}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <FaSpinner className="animate-spin" />;
      case 'confirmed': return <FaCheck />;
      case 'completed': return <FaCheck />;
      case 'cancelled': return <FaTimes />;
      default: return <FaShoppingCart />;
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Order Management</h1>

      {/* Stats with Navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-6">
        <div 
          className="bg-blue-100 p-4 rounded shadow cursor-pointer hover:bg-blue-200 transition-colors"
          onClick={() => navigateToStatusPage('list')}
        >
          <div className="flex items-center gap-2 text-blue-600">
            <FaShoppingCart /> <span className="text-lg">Total: {stats.total || 0}</span>
          </div>
        </div>
        <div 
          className="bg-yellow-100 p-4 rounded shadow cursor-pointer hover:bg-yellow-200 transition-colors"
          onClick={() => navigateToStatusPage('pending')}
        >
          <div className="flex items-center gap-2 text-yellow-600">
            <FaSpinner /> <span className="text-lg">Pending: {stats.pending || 0}</span>
          </div>
        </div>
        <div 
          className="bg-blue-100 p-4 rounded shadow cursor-pointer hover:bg-blue-200 transition-colors"
          onClick={() => navigateToStatusPage('confirmed')}
        >
          <div className="flex items-center gap-2 text-blue-600">
            <FaCheck /> <span className="text-lg">Confirmed: {stats.confirmed || 0}</span>
          </div>
        </div>
        <div 
          className="bg-green-100 p-4 rounded shadow cursor-pointer hover:bg-green-200 transition-colors"
          onClick={() => navigateToStatusPage('completed')}
        >
          <div className="flex items-center gap-2 text-green-600">
            <FaCheck /> <span className="text-lg">Completed: {stats.completed || 0}</span>
          </div>
        </div>
        <div 
          className="bg-red-100 p-4 rounded shadow cursor-pointer hover:bg-red-200 transition-colors"
          onClick={() => navigateToStatusPage('cancelled')}
        >
          <div className="flex items-center gap-2 text-red-600">
            <FaTimes /> <span className="text-lg">Cancelled: {stats.cancelled || 0}</span>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="mb-4 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <FaFilter className="text-gray-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div className="text-sm text-gray-600">
          Showing {orders.length} orders
        </div>
      </div>

      {/* Table */}
      <div className="overflow-auto bg-white shadow rounded">
        <table className="w-full text-left min-w-[900px]">
          <thead>
            <tr className="bg-gray-100 text-sm">
              <th className="p-3">#</th>
              <th className="p-3">Order ID</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Vendor</th>
              <th className="p-3">Items</th>
              <th className="p-3">Total</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date</th>
              <th className="px-3 p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={9} className="text-center p-5">Loading...</td></tr>
            ) : orders?.length === 0 ? (
              <tr><td colSpan={9} className="text-center p-5">No data</td></tr>
            ) : (
              orders?.map((order, idx) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{(page - 1) * 10 + idx + 1}</td>
                  <td className="p-3 font-mono text-sm">#{order.id}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <FaUser className="text-gray-400" />
                      <span>{order.customer_name}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <FaStore className="text-gray-400" />
                      <span>{order.vendor_name}</span>
                    </div>
                  </td>
                  <td className="p-3">{order.items_count || 0} items</td>
                  <td className="p-3 font-semibold">${order.total_amount || 0}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs flex items-center gap-1 ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </span>
                  </td>
                  <td className="p-3 text-sm text-gray-600">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    <button 
                      onClick={() => navigateToDetails(order.id)}
                      className="text-primary hover:text-blue-700" 
                      title="View Details"
                    >
                      <FaEye />
                    </button>
                    {order.status === 'pending' && (
                      <>
                        <button 
                          onClick={() => updateOrderStatus(order.id, 'confirmed')}
                          className="text-green-500 hover:text-green-700"
                          title="Confirm Order"
                        >
                          <FaCheck />
                        </button>
                        <button 
                          onClick={() => updateOrderStatus(order.id, 'cancelled')}
                          className="text-red-500 hover:text-red-700"
                          title="Cancel Order"
                        >
                          <FaTimes />
                        </button>
                      </>
                    )}
                    {order.status === 'confirmed' && (
                      <button 
                        onClick={() => updateOrderStatus(order.id, 'completed')}
                        className="text-blue-500 hover:text-blue-700"
                        title="Mark as Completed"
                      >
                        <FaTruck />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-center gap-2">
        {[...Array(totalPages).keys()].map((num) => (
          <button
            key={num + 1}
            className={`px-3 py-1 rounded border ${page === num + 1 ? 'bg-green-500 text-white' : 'bg-white text-gray-800'}`}
            onClick={() => setPage(num + 1)}
          >
            {num + 1}
          </button>
        ))}
      </div>
    </div>
  );
} 
'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaShoppingCart, FaSpinner, FaCheck, FaTimes, FaEye, FaTruck, FaUser, FaStore, FaArrowLeft } from 'react-icons/fa';
import api from '../../../lib/axios';
import { OrdersRoute } from '../../../components/auth/ProtectedRoute';

function CompletedOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/admin/orders', {
        params: { page, limit: 10, status: 'delivered' },
      });
      setOrders(res.data.orders || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching completed orders:', error);
    }
    setLoading(false);
  };

  const navigateToDetails = (orderId) => {
    router.push(`/orders/details?id=${orderId}`);
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
    fetchOrders();
  }, [page]);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => router.back()}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <FaArrowLeft className="text-xl" />
        </button>
        <div>
          <h1 className="text-2xl font-bold">Completed Orders</h1>
          <p className="text-gray-600">Successfully delivered orders</p>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 text-green-700">
          <FaCheck />
          <span className="text-lg font-semibold">{orders.length} Completed Orders</span>
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
              <tr><td colSpan={9} className="text-center p-5">No completed orders found</td></tr>
            ) : (
              orders.map((order, index) => (
                <tr key={order.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3 font-medium">#{order.id}</td>
                  <td className="p-3 flex items-center gap-2">
                    <FaUser className="text-gray-400" />
                    {order.customer?.name || 'N/A'}
                  </td>
                  <td className="p-3 flex items-center gap-2">
                    <FaStore className="text-gray-400" />
                    {order.vendor?.name || 'N/A'}
                  </td>
                  <td className="p-3">{order.items?.length || 0} items</td>
                  <td className="p-3 font-medium">${order.total_amount || 0}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1">{order.status}</span>
                    </span>
                  </td>
                  <td className="p-3 text-sm text-gray-600">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => navigateToDetails(order.id)}
                      className="bg-primary text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      <FaEye className="inline mr-1" />
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="flex gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-3 py-2 border rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-3 py-2">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-3 py-2 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProtectedCompletedOrdersPage() {
  return (
    <OrdersRoute>
      <CompletedOrdersPage />
    </OrdersRoute>
  );
} 
'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FaShoppingCart, FaSpinner, FaCheck, FaTimes, FaEye, FaTruck, FaUser, FaStore, FaArrowLeft } from 'react-icons/fa';

export default function CancelledOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BACKEND_URL}/api/admin/orders`, {
        params: { page, limit: 10, status: 'cancelled' },
      });
      setOrders(res.data.orders || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching cancelled orders:', error);
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
          <h1 className="text-2xl font-bold">Cancelled Orders</h1>
          <p className="text-gray-600">Cancelled and refunded orders</p>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 text-red-700">
          <FaTimes />
          <span className="text-lg font-semibold">{orders.length} Cancelled Orders</span>
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
              <tr><td colSpan={9} className="text-center p-5">No cancelled orders found</td></tr>
            ) : (
              orders?.map((order, idx) => (
                <tr key={order.id} className="border-b">
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
            className={`px-3 py-1 rounded border ${page === num + 1 ? 'bg-red-500 text-white' : 'bg-white text-gray-800'}`}
            onClick={() => setPage(num + 1)}
          >
            {num + 1}
          </button>
        ))}
      </div>
    </div>
  );
} 
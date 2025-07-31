'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { 
  FaArrowLeft, 
  FaUser, 
  FaStore, 
  FaShoppingCart, 
  FaCheck, 
  FaTimes, 
  FaTruck, 
  FaSpinner,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCalendar,
  FaDollarSign,
  FaBox,
  FaEye,
  FaDownload
} from 'react-icons/fa';

export default function OrderDetailsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BACKEND_URL}/api/admin/orders/${orderId}`);
      setOrder(res.data);
    } catch (error) {
      console.error('Error fetching order details:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (status) => {
    try {
      setUpdating(true);
      await axios.put(`${BACKEND_URL}/api/admin/orders/${orderId}/status`, { status });
      await fetchOrderDetails(); // Refresh data
    } catch (error) {
      console.error('Error updating order status:', error);
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <FaSpinner className="animate-spin" />;
      case 'confirmed': return <FaCheck />;
      case 'shipped': return <FaTruck />;
      case 'delivered': return <FaCheck />;
      case 'cancelled': return <FaTimes />;
      default: return <FaShoppingCart />;
    }
  };

  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case 'pending': return 'confirmed';
      case 'confirmed': return 'shipped';
      case 'shipped': return 'delivered';
      default: return null;
    }
  };

  const canUpdateStatus = (currentStatus) => {
    return ['pending', 'confirmed', 'shipped'].includes(currentStatus);
  };

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <FaSpinner className="animate-spin text-4xl text-blue-500" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-600">Order not found</h2>
          <button 
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <FaArrowLeft className="text-xl" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Order #{order.id}</h1>
            <p className="text-gray-600">Order Details</p>
          </div>
        </div>
        
        {/* Status Badge */}
        <div className={`px-4 py-2 rounded-full flex items-center gap-2 ${getStatusColor(order.status)}`}>
          {getStatusIcon(order.status)}
          <span className="font-semibold capitalize">{order.status}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FaShoppingCart className="text-blue-600" />
              Order Information
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Order ID</label>
                <p className="text-lg font-mono">#{order.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Date</label>
                <p className="text-lg">{new Date(order.created_at).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Total Amount</label>
                <p className="text-2xl font-bold text-green-600">${order.total_amount}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Payment Method</label>
                <p className="text-lg">{order.payment_method || 'Not specified'}</p>
              </div>
            </div>

            {order.address && (
              <div className="mt-4">
                <label className="text-sm font-medium text-gray-600">Delivery Address</label>
                <p className="text-lg flex items-center gap-2">
                  <FaMapMarkerAlt className="text-red-500" />
                  {order.address}
                </p>
              </div>
            )}
          </div>

          {/* Customer Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FaUser className="text-green-600" />
              Customer Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Name</label>
                <p className="text-lg font-semibold">{order.customer_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Phone</label>
                <p className="text-lg flex items-center gap-2">
                  <FaPhone className="text-gray-400" />
                  {order.customer?.phone_number || 'N/A'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <p className="text-lg flex items-center gap-2">
                  <FaEnvelope className="text-gray-400" />
                  {order.customer?.email || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Vendor Information */}
          {order.vendors && order.vendors.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FaStore className="text-orange-600" />
                Vendor Information
              </h2>
              
              {order.vendors.map((vendor, index) => (
                <div key={vendor.id} className="border-b pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Vendor Name</label>
                      <p className="text-lg font-semibold">{vendor.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Phone</label>
                      <p className="text-lg flex items-center gap-2">
                        <FaPhone className="text-gray-400" />
                        {vendor.phone_number}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Email</label>
                      <p className="text-lg flex items-center gap-2">
                        <FaEnvelope className="text-gray-400" />
                        {vendor.email}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Shop Name</label>
                      <p className="text-lg">{vendor.vendor_info?.shop_name || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FaBox className="text-purple-600" />
              Order Items ({order.items_count})
            </h2>
            
            {order.items && order.items.length > 0 ? (
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center gap-4">
                      {item.product?.image && (
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded"
                          onError={(e) => {
                            e.target.src = '/placeholder-image.jpg';
                          }}
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{item.product?.name || 'Unknown Product'}</h3>
                        <p className="text-gray-600">{item.product?.description || 'No description'}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm text-gray-500">Quantity: {item.quantity}</span>
                          <span className="text-sm text-gray-500">Price: ${item.price}</span>
                          <span className="font-semibold text-green-600">Total: ${(item.quantity * item.price).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FaBox className="text-4xl mx-auto mb-4 text-gray-300" />
                <p>No items found for this order</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Management */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Status Management</h2>
            
            <div className="space-y-3">
              {canUpdateStatus(order.status) && (
                <button
                  onClick={() => updateOrderStatus(getNextStatus(order.status))}
                  disabled={updating}
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {updating ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <>
                      {order.status === 'pending' && <FaCheck />}
                      {order.status === 'confirmed' && <FaTruck />}
                      {order.status === 'shipped' && <FaCheck />}
                    </>
                  )}
                  {order.status === 'pending' && 'Confirm Order'}
                  {order.status === 'confirmed' && 'Mark as Shipped'}
                  {order.status === 'shipped' && 'Mark as Delivered'}
                </button>
              )}

              {order.status === 'pending' && (
                <button
                  onClick={() => updateOrderStatus('cancelled')}
                  disabled={updating}
                  className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {updating ? <FaSpinner className="animate-spin" /> : <FaTimes />}
                  Cancel Order
                </button>
              )}
            </div>

            <div className="mt-4 pt-4 border-t">
              <h3 className="font-semibold mb-2">Status History</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Order Created</span>
                  <span className="text-xs text-gray-500 ml-auto">
                    {new Date(order.created_at).toLocaleDateString()}
                  </span>
                </div>
                {order.status !== 'pending' && (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">Order Confirmed</span>
                  </div>
                )}
                {['shipped', 'delivered'].includes(order.status) && (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="text-sm">Order Shipped</span>
                  </div>
                )}
                {order.status === 'delivered' && (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Order Delivered</span>
                  </div>
                )}
                {order.status === 'cancelled' && (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm">Order Cancelled</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            
            <div className="space-y-3">
              <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded hover:bg-gray-200 flex items-center justify-center gap-2">
                <FaEye />
                View Invoice
              </button>
              <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded hover:bg-gray-200 flex items-center justify-center gap-2">
                <FaDownload />
                Download Receipt
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-2xl max-h-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Product Image</h3>
              <button
                onClick={() => setShowImageModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            <img
              src={selectedImage}
              alt="Product"
              className="max-w-full max-h-96 object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
} 
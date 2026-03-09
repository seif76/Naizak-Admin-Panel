// 'use client';
// import React, { useEffect, useState } from 'react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import axios from 'axios';
// import { 
//   FaArrowLeft, 
//   FaUser, 
//   FaStore, 
//   FaShoppingCart, 
//   FaCheck, 
//   FaTimes, 
//   FaTruck, 
//   FaSpinner,
//   FaPhone,
//   FaEnvelope,
//   FaMapMarkerAlt,
//   FaCalendar,
//   FaDollarSign,
//   FaBox,
//   FaEye,
//   FaDownload
// } from 'react-icons/fa';
// import api from '../../../lib/axios';
// export default function OrderDetailsPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const orderId = searchParams.get('id');
//   const [order, setOrder] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [updating, setUpdating] = useState(false);
//   const [showImageModal, setShowImageModal] = useState(false);
//   const [selectedImage, setSelectedImage] = useState('');
  

//   const fetchOrderDetails = async () => {
//     try {
//       setLoading(true);
//       const res = await api.get(`/api/admin/orders/${orderId}`);
//       setOrder(res.data);
//     } catch (error) {
//       console.error('Error fetching order details:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateOrderStatus = async (status) => {
//     try {
//       setUpdating(true);
//       await api.put(`/api/admin/orders/${orderId}/status`, { status });
//       await fetchOrderDetails(); // Refresh data
//     } catch (error) {
//       console.error('Error updating order status:', error);
//     } finally {
//       setUpdating(false);
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'pending': return 'bg-yellow-100 text-yellow-800';
//       case 'confirmed': return 'bg-blue-100 text-blue-800';
//       case 'shipped': return 'bg-purple-100 text-purple-800';
//       case 'delivered': return 'bg-green-100 text-green-800';
//       case 'cancelled': return 'bg-red-100 text-red-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case 'pending': return <FaSpinner className="animate-spin" />;
//       case 'confirmed': return <FaCheck />;
//       case 'shipped': return <FaTruck />;
//       case 'delivered': return <FaCheck />;
//       case 'cancelled': return <FaTimes />;
//       default: return <FaShoppingCart />;
//     }
//   };

//   const getNextStatus = (currentStatus) => {
//     switch (currentStatus) {
//       case 'pending': return 'confirmed';
//       case 'confirmed': return 'shipped';
//       case 'shipped': return 'delivered';
//       default: return null;
//     }
//   };

//   const canUpdateStatus = (currentStatus) => {
//     return ['pending', 'confirmed', 'shipped'].includes(currentStatus);
//   };

//   useEffect(() => {
//     if (orderId) {
//       fetchOrderDetails();
//     }
//   }, [orderId]);

//   if (loading) {
//     return (
//       <div className="p-6">
//         <div className="flex items-center justify-center h-64">
//           <FaSpinner className="animate-spin text-4xl text-blue-500" />
//         </div>
//       </div>
//     );
//   }

//   if (!order) {
//     return (
//       <div className="p-6">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold text-gray-600">Order not found</h2>
//           <button 
//             onClick={() => router.back()}
//             className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//           >
//             Go Back
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <div className="flex items-center gap-4">
//           <button 
//             onClick={() => router.back()}
//             className="p-2 rounded-full hover:bg-gray-100"
//           >
//             <FaArrowLeft className="text-xl" />
//           </button>
//           <div>
//             <h1 className="text-2xl font-bold">Order #{order.id}</h1>
//             <p className="text-gray-600">Order Details</p>
//           </div>
//         </div>
        
//         {/* Status Badge */}
//         <div className={`px-4 py-2 rounded-full flex items-center gap-2 ${getStatusColor(order.status)}`}>
//           {getStatusIcon(order.status)}
//           <span className="font-semibold capitalize">{order.status}</span>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Main Content */}
//         <div className="lg:col-span-2 space-y-6">
//           {/* Order Information */}
//           <div className="bg-white rounded-lg shadow-md p-6">
//             <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
//               <FaShoppingCart className="text-blue-600" />
//               Order Information
//             </h2>
            
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="text-sm font-medium text-gray-600">Order ID</label>
//                 <p className="text-lg font-mono">#{order.id}</p>
//               </div>
//               <div>
//                 <label className="text-sm font-medium text-gray-600">Date</label>
//                 <p className="text-lg">{new Date(order.created_at).toLocaleDateString()}</p>
//               </div>
//               <div>
//                 <label className="text-sm font-medium text-gray-600">Total Amount</label>
//                 <p className="text-2xl font-bold text-green-600">${order.total_amount}</p>
//               </div>
//               <div>
//                 <label className="text-sm font-medium text-gray-600">Payment Method</label>
//                 <p className="text-lg">{order.payment_method || 'Not specified'}</p>
//               </div>
//             </div>

//             {order.address && (
//               <div className="mt-4">
//                 <label className="text-sm font-medium text-gray-600">Delivery Address</label>
//                 <p className="text-lg flex items-center gap-2">
//                   <FaMapMarkerAlt className="text-red-500" />
//                   {order.address}
//                 </p>
//               </div>
//             )}
//           </div>

//           {/* Customer Information */}
//           <div className="bg-white rounded-lg shadow-md p-6">
//             <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
//               <FaUser className="text-green-600" />
//               Customer Information
//             </h2>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="text-sm font-medium text-gray-600">Name</label>
//                 <p className="text-lg font-semibold">{order.customer_name}</p>
//               </div>
//               <div>
//                 <label className="text-sm font-medium text-gray-600">Phone</label>
//                 <p className="text-lg flex items-center gap-2">
//                   <FaPhone className="text-gray-400" />
//                   {order.customer?.phone_number || 'N/A'}
//                 </p>
//               </div>
//               <div>
//                 <label className="text-sm font-medium text-gray-600">Email</label>
//                 <p className="text-lg flex items-center gap-2">
//                   <FaEnvelope className="text-gray-400" />
//                   {order.customer?.email || 'N/A'}
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Vendor Information */}
//           {order.vendors && order.vendors.length > 0 && (
//             <div className="bg-white rounded-lg shadow-md p-6">
//               <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
//                 <FaStore className="text-orange-600" />
//                 Vendor Information
//               </h2>
              
//               {order.vendors.map((vendor, index) => (
//                 <div key={vendor.id} className="border-b pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <label className="text-sm font-medium text-gray-600">Vendor Name</label>
//                       <p className="text-lg font-semibold">{vendor.name}</p>
//                     </div>
//                     <div>
//                       <label className="text-sm font-medium text-gray-600">Phone</label>
//                       <p className="text-lg flex items-center gap-2">
//                         <FaPhone className="text-gray-400" />
//                         {vendor.phone_number}
//                       </p>
//                     </div>
//                     <div>
//                       <label className="text-sm font-medium text-gray-600">Email</label>
//                       <p className="text-lg flex items-center gap-2">
//                         <FaEnvelope className="text-gray-400" />
//                         {vendor.email}
//                       </p>
//                     </div>
//                     <div>
//                       <label className="text-sm font-medium text-gray-600">Shop Name</label>
//                       <p className="text-lg">{vendor.vendor_info?.shop_name || 'N/A'}</p>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* Order Items */}
//           <div className="bg-white rounded-lg shadow-md p-6">
//             <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
//               <FaBox className="text-purple-600" />
//               Order Items ({order.items_count})
//             </h2>
            
//             {order.items && order.items.length > 0 ? (
//               <div className="space-y-4">
//                 {order.items.map((item, index) => (
//                   <div key={index} className="border rounded-lg p-4">
//                     <div className="flex items-center gap-4">
//                       {item.product?.image && (
//                         <img
//                           src={item.product.image}
//                           alt={item.product.name}
//                           className="w-16 h-16 object-cover rounded"
//                           onError={(e) => {
//                             e.target.src = '/placeholder-image.jpg';
//                           }}
//                         />
//                       )}
//                       <div className="flex-1">
//                         <h3 className="font-semibold text-lg">{item.product?.name || 'Unknown Product'}</h3>
//                         <p className="text-gray-600">{item.product?.description || 'No description'}</p>
//                         <div className="flex items-center justify-between mt-2">
//                           <span className="text-sm text-gray-500">Quantity: {item.quantity}</span>
//                           <span className="text-sm text-gray-500">Price: ${item.price}</span>
//                           <span className="font-semibold text-green-600">Total: ${(item.quantity * item.price).toFixed(2)}</span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="text-center py-8 text-gray-500">
//                 <FaBox className="text-4xl mx-auto mb-4 text-gray-300" />
//                 <p>No items found for this order</p>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Sidebar */}
//         <div className="space-y-6">
//           {/* Status Management */}
//           <div className="bg-white rounded-lg shadow-md p-6">
//             <h2 className="text-xl font-semibold mb-4">Status Management</h2>
            
//             <div className="space-y-3">
//               {canUpdateStatus(order.status) && (
//                 <button
//                   onClick={() => updateOrderStatus(getNextStatus(order.status))}
//                   disabled={updating}
//                   className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//                 >
//                   {updating ? (
//                     <FaSpinner className="animate-spin" />
//                   ) : (
//                     <>
//                       {order.status === 'pending' && <FaCheck />}
//                       {order.status === 'confirmed' && <FaTruck />}
//                       {order.status === 'shipped' && <FaCheck />}
//                     </>
//                   )}
//                   {order.status === 'pending' && 'Confirm Order'}
//                   {order.status === 'confirmed' && 'Mark as Shipped'}
//                   {order.status === 'shipped' && 'Mark as Delivered'}
//                 </button>
//               )}

//               {order.status === 'pending' && (
//                 <button
//                   onClick={() => updateOrderStatus('cancelled')}
//                   disabled={updating}
//                   className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//                 >
//                   {updating ? <FaSpinner className="animate-spin" /> : <FaTimes />}
//                   Cancel Order
//                 </button>
//               )}
//             </div>

//             <div className="mt-4 pt-4 border-t">
//               <h3 className="font-semibold mb-2">Status History</h3>
//               <div className="space-y-2">
//                 <div className="flex items-center gap-2">
//                   <div className="w-3 h-3 bg-green-500 rounded-full"></div>
//                   <span className="text-sm">Order Created</span>
//                   <span className="text-xs text-gray-500 ml-auto">
//                     {new Date(order.created_at).toLocaleDateString()}
//                   </span>
//                 </div>
//                 {order.status !== 'pending' && (
//                   <div className="flex items-center gap-2">
//                     <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
//                     <span className="text-sm">Order Confirmed</span>
//                   </div>
//                 )}
//                 {['shipped', 'delivered'].includes(order.status) && (
//                   <div className="flex items-center gap-2">
//                     <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
//                     <span className="text-sm">Order Shipped</span>
//                   </div>
//                 )}
//                 {order.status === 'delivered' && (
//                   <div className="flex items-center gap-2">
//                     <div className="w-3 h-3 bg-green-500 rounded-full"></div>
//                     <span className="text-sm">Order Delivered</span>
//                   </div>
//                 )}
//                 {order.status === 'cancelled' && (
//                   <div className="flex items-center gap-2">
//                     <div className="w-3 h-3 bg-red-500 rounded-full"></div>
//                     <span className="text-sm">Order Cancelled</span>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Quick Actions */}
//           <div className="bg-white rounded-lg shadow-md p-6">
//             <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            
//             <div className="space-y-3">
//               <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded hover:bg-gray-200 flex items-center justify-center gap-2">
//                 <FaEye />
//                 View Invoice
//               </button>
//               <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded hover:bg-gray-200 flex items-center justify-center gap-2">
//                 <FaDownload />
//                 Download Receipt
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Image Modal */}
//       {showImageModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-4 rounded-lg max-w-2xl max-h-2xl">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-lg font-semibold">Product Image</h3>
//               <button
//                 onClick={() => setShowImageModal(false)}
//                 className="text-gray-500 hover:text-gray-700"
//               >
//                 <FaTimes />
//               </button>
//             </div>
//             <img
//               src={selectedImage}
//               alt="Product"
//               className="max-w-full max-h-96 object-contain"
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// } 



'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  FaArrowLeft, FaUser, FaStore, FaShoppingCart, FaCheck,
  FaTimes, FaTruck, FaSpinner, FaPhone, FaEnvelope,
  FaMapMarkerAlt, FaBox, FaMotorcycle, FaStar, FaHashtag,
  FaCalendarAlt, FaMoneyBillWave, FaCreditCard , FaEye
} from 'react-icons/fa';
import api from '../../../lib/axios';

const STATUS_CONFIG = {
  pending:   { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200', dot: 'bg-yellow-400' },
  confirmed: { bg: 'bg-blue-100',   text: 'text-blue-700',   border: 'border-blue-200',   dot: 'bg-blue-400'   },
  ready:     { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200', dot: 'bg-orange-400' },
  shipped:   { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200', dot: 'bg-purple-400' },
  delivered: { bg: 'bg-green-100',  text: 'text-green-700',  border: 'border-green-200',  dot: 'bg-green-400'  },
  cancelled: { bg: 'bg-red-100',    text: 'text-red-700',    border: 'border-red-200',    dot: 'bg-red-400'    },
};

const STATUS_STEPS = ['pending', 'confirmed', 'ready', 'shipped', 'delivered'];

export default function OrderDetailsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/admin/orders/${orderId}`);
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
      await api.put(`/api/admin/orders/${orderId}/status`, { status });
      await fetchOrderDetails();
    } catch (error) {
      console.error('Error updating order status:', error);
    } finally {
      setUpdating(false);
    }
  };

  const getNextStatus = (s) => ({ 
    pending: 'confirmed', 
    confirmed: 'ready', 
    ready: 'shipped', 
    shipped: 'delivered' 
  }[s] || null);
  
  const canUpdate = (s) => ['pending', 'confirmed', 'ready', 'shipped'].includes(s);

  useEffect(() => { if (orderId) fetchOrderDetails(); }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <FaSpinner className="animate-spin text-3xl text-primary" />
          <p className="text-sm">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-10 text-center">
          <FaBox className="text-4xl text-gray-300 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-gray-600 mb-4">Order not found</h2>
          <button onClick={() => router.back()} className="px-5 py-2 bg-primary text-white rounded-lg text-sm">Go Back</button>
        </div>
      </div>
    );
  }

  const statusCfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
  const currentStep = STATUS_STEPS.indexOf(order.status);

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* ── Header ── */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-gray-200 text-gray-500 transition-colors">
            <FaArrowLeft />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <FaHashtag className="text-primary text-lg" />Order {order.id}
            </h1>
            <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-0.5">
              <FaCalendarAlt className="text-xs" />
              {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>

        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}`}>
          <span className={`w-2 h-2 rounded-full ${statusCfg.dot} ${order.status === 'pending' ? 'animate-pulse' : ''}`} />
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </span>
      </div>

      {/* ── Progress Bar (hidden if cancelled) ── */}
      {order.status !== 'cancelled' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-6 py-5 mb-6">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 right-0 top-4 h-0.5 bg-gray-100 z-0" />
            <div
              className="absolute left-0 top-4 h-0.5 bg-primary z-0 transition-all duration-500"
              style={{ width: `${(currentStep / (STATUS_STEPS.length - 1)) * 100}%` }}
            />
            {STATUS_STEPS.map((step, i) => {
              const done = i <= currentStep;
              return (
                <div key={step} className="flex flex-col items-center gap-2 z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                    done ? 'bg-primary border-primary text-white' : 'bg-white border-gray-200 text-gray-400'
                  }`}>
                    {done ? <FaCheck /> : i + 1}
                  </div>
                  <span className={`text-xs font-medium capitalize ${done ? 'text-primary' : 'text-gray-400'}`}>{step}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Left: Main Content ── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Order Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/60 flex items-center gap-2">
              <FaShoppingCart className="text-primary text-sm" />
              <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Order Summary</h2>
            </div>
            <div className="p-5 grid grid-cols-2 sm:grid-cols-3 gap-4">
              <InfoTile icon={<FaMoneyBillWave className="text-green-500" />} label="Total Amount" value={`$${order.total_amount}`} valueClass="text-green-600 font-bold text-xl" />
              <InfoTile icon={<FaCreditCard className="text-blue-500" />} label="Payment Method" value={order.payment_method || 'Not specified'} />
              <InfoTile icon={<FaBox className="text-purple-500" />} label="Items" value={`${order.items_count} item${order.items_count !== 1 ? 's' : ''}`} />
              {order.address && (
                <div className="col-span-2 sm:col-span-3">
                  <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><FaMapMarkerAlt className="text-red-400" /> Delivery Address</p>
                  <p className="text-sm font-medium text-gray-700">{order.address}</p>
                </div>
              )}
            </div>
          </div>

          {/* Customer */}
<div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
  <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/60 flex items-center gap-2">
    <FaUser className="text-primary text-sm" />
    <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Customer</h2>
  </div>
  <div className="p-5">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-4">
      {order.customer.profile_photo ? (
            <img
              src={order.customer.profile_photo}
              alt={order.customer_name}
              className="w-12 h-12 rounded-full object-cover border border-gray-200"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
            {order.customer_name?.charAt(0).toUpperCase()}
          </div>
          )}
       
        <div>
          <p className="font-semibold text-gray-800">{order.customer_name}</p>
          <p className="text-xs text-gray-500">Customer</p>
        </div>
      </div>
      <button
        onClick={() => router.push(`/customers/details?id=${order.customer_id}`)}
        className="flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-lg transition-colors"
      >
        <FaEye /> View Details
      </button>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <ContactRow icon={<FaPhone />} value={order.customer?.phone_number} />
      <ContactRow icon={<FaEnvelope />} value={order.customer?.email} />
    </div>
  </div>
</div>

{/* Vendor(s) */}
{order.vendors?.length > 0 && (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
    <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/60 flex items-center gap-2">
      <FaStore className="text-primary text-sm" />
      <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
        Vendor{order.vendors.length > 1 ? 's' : ''}
      </h2>
    </div>
    <div className="divide-y divide-gray-50">
      {order.vendors.map((vendor) => (
        <div key={vendor.id} className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
            {vendor.vendor_info.logo ? (
            <img
              src={vendor.vendor_info.logo}
              alt={vendor.logo}
              className="w-12 h-12 rounded-full object-cover border border-gray-200"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 font-bold">
            {vendor.name?.charAt(0).toUpperCase()}
          </div>
          )}

              <div>
                <p className="font-semibold text-gray-800">{vendor.name}</p>
                <p className="text-xs text-gray-500">
                  {vendor.vendor_info?.shop_name || 'N/A'} · {vendor.vendor_info?.shop_location || ''}
                </p>
              </div>
            </div>
            <button
              onClick={() => router.push(`/vendors/details?phone_number=${vendor.phone_number}`)}
              className="flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-lg transition-colors"
            >
              <FaEye /> View Details
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ContactRow icon={<FaPhone />} value={vendor.phone_number} />
            <ContactRow icon={<FaEnvelope />} value={vendor.email} />
          </div>
        </div>
      ))}
    </div>
  </div>
)}

{/* Deliveryman */}
<div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
  <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/60 flex items-center gap-2">
    <FaMotorcycle className="text-primary text-sm" />
    <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Deliveryman</h2>
  </div>
  {order.deliveryman ? (
    <div className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          {order.deliveryman.profile_photo ? (
            <img
              src={order.deliveryman.profile_photo}
              alt={order.deliveryman.name}
              className="w-12 h-12 rounded-full object-cover border border-gray-200"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 font-bold text-lg">
              {order.deliveryman.name?.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p className="font-semibold text-gray-800">{order.deliveryman.name}</p>
            <div className="flex items-center gap-1 text-yellow-500 text-xs mt-0.5">
              <FaStar />
              <span className="font-medium text-gray-600">
                {order.deliveryman.rating?.toFixed(1) || 'N/A'}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={() => router.push(`/deliverymen/details?id=${order.deliveryman_id}`)}
          className="flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-lg transition-colors"
        >
          <FaEye /> View Details
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <ContactRow icon={<FaPhone />} value={order.deliveryman.phone_number} />
        <ContactRow icon={<FaEnvelope />} value={order.deliveryman.email} />
      </div>
    </div>
  ) : (
    <div className="p-5 flex items-center gap-3 text-gray-400">
      <FaMotorcycle className="text-2xl text-gray-300" />
      <div>
        <p className="text-sm font-medium text-gray-500">No deliveryman assigned yet</p>
        <p className="text-xs text-gray-400">Will be assigned once the order is confirmed</p>
      </div>
    </div>
  )}
</div>

          {/* Order Items */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/60 flex items-center gap-2">
              <FaBox className="text-primary text-sm" />
              <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
                Order Items <span className="text-gray-400 font-normal normal-case ml-1">({order.items_count})</span>
              </h2>
            </div>
            {order.items?.length > 0 ? (
              <div className="divide-y divide-gray-50">
                {order.items.map((item, index) => (
                  <div key={index} className="p-4 flex items-center gap-4 hover:bg-gray-50/50 transition-colors">
                    {item.product?.image ? (
                      <img src={item.product.image} alt={item.product.name} className="w-14 h-14 rounded-lg object-cover border border-gray-100" onError={(e) => { e.target.src = '/placeholder-image.jpg'; }} />
                    ) : (
                      <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center">
                        <FaBox className="text-gray-300" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 truncate">{item.product?.name || 'Unknown Product'}</p>
                      <p className="text-xs text-gray-400 mt-0.5 truncate">{item.product?.description || 'No description'}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-gray-800">${(item.quantity * item.price).toFixed(2)}</p>
                      <p className="text-xs text-gray-400">{item.quantity} × ${item.price}</p>
                    </div>
                  </div>
                ))}
                <div className="px-4 py-3 bg-gray-50/60 flex justify-end">
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Total</p>
                    <p className="text-lg font-bold text-green-600">${order.total_amount}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-10 text-center text-gray-400">
                <FaBox className="text-3xl mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No items found for this order</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Right: Sidebar ── */}
        <div className="space-y-6">

          {/* Status Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/60 flex items-center gap-2">
              <FaTruck className="text-primary text-sm" />
              <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Actions</h2>
            </div>
            <div className="p-5 space-y-3">
              {canUpdate(order.status) && (
                <button
                  onClick={() => updateOrderStatus(getNextStatus(order.status))}
                  disabled={updating}
                  className="w-full bg-primary text-white py-2.5 px-4 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {updating ? <FaSpinner className="animate-spin" /> : (
                    <>
                      {order.status === 'pending'   && <><FaCheck />   Confirm Order</>}
                      {order.status === 'confirmed' && <><FaBox />      Mark as Ready</>}
                      {order.status === 'ready'     && <><FaTruck />    Mark as Shipped</>}
                      {order.status === 'shipped'   && <><FaCheck />    Mark as Delivered</>}
                    </>
                  )}
                </button>
              )}
              {order.status === 'pending' && (
                <button
                  onClick={() => updateOrderStatus('cancelled')}
                  disabled={updating}
                  className="w-full bg-red-500 text-white py-2.5 px-4 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {updating ? <FaSpinner className="animate-spin" /> : <><FaTimes /> Cancel Order</>}
                </button>
              )}
              {!canUpdate(order.status) && order.status !== 'pending' && (
                <div className={`text-center py-3 rounded-lg text-sm font-medium ${statusCfg.bg} ${statusCfg.text}`}>
                  Order is {order.status}
                </div>
              )}
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/60">
              <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Timeline</h2>
            </div>
            <div className="p-5">
              <div className="space-y-4">
                <TimelineItem color="bg-green-400" label="Order Created" date={new Date(order.created_at).toLocaleDateString()} active />
                {['confirmed', 'shipped', 'delivered'].map((step) => {
                  const reached = currentStep >= STATUS_STEPS.indexOf(step);
                  return (
                    <TimelineItem
                      key={step}
                      color={reached ? STATUS_CONFIG[step].dot : 'bg-gray-200'}
                      label={`Order ${step.charAt(0).toUpperCase() + step.slice(1)}`}
                      active={reached}
                    />
                  );
                })}
                {order.status === 'cancelled' && (
                  <TimelineItem color="bg-red-400" label="Order Cancelled" active />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Reusable Components ──

function InfoTile({ icon, label, value, valueClass = 'text-gray-800 font-semibold text-sm' }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
        {icon} {label}
      </div>
      <p className={valueClass}>{value}</p>
    </div>
  );
}

function ContactRow({ icon, value }) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
      <span className="text-gray-400 text-xs">{icon}</span>
      {value || 'N/A'}
    </div>
  );
}

function TimelineItem({ color, label, date, active }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${color}`} />
      <span className={`text-sm flex-1 ${active ? 'text-gray-700 font-medium' : 'text-gray-400'}`}>{label}</span>
      {date && <span className="text-xs text-gray-400">{date}</span>}
    </div>
  );
}
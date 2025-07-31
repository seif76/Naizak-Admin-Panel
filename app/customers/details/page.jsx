'use client';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
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
  Trash2
} from 'lucide-react';
import Image from 'next/image';

export default function CustomerDetailsPage() {
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');
  const searchParams = useSearchParams();
  const router = useRouter();
  const customerId = searchParams.get('id');

  const fetchCustomerDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/customers/${customerId}`);
      setCustomer(response.data);
      
      // Fetch customer orders
      const ordersResponse = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/customers/${customerId}/orders`);
      setOrders(ordersResponse.data.orders || []);
    } catch (error) {
      console.error('Error fetching customer details:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateCustomerStatus = async (newStatus) => {
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/customers/${customerId}/status`, {
        status: newStatus
      });
      fetchCustomerDetails(); // Refresh data
    } catch (error) {
      console.error('Error updating customer status:', error);
    }
  };

  const deleteCustomer = async () => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/customers/${customerId}`);
        router.push('/customers/list');
      } catch (error) {
        console.error('Error deleting customer:', error);
      }
    }
  };

  useEffect(() => {
    if (customerId) {
      fetchCustomerDetails();
    }
  }, [customerId]);

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

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Deactivated':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getOrderStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
              <button
                onClick={deleteCustomer}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
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
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                    <img className='w-full h-full object-cover rounded-full' src={customer.profile_photo} alt="Customer Profile" width={80} height={80} />
                  {/* <User className="w-10 h-10 text-blue-600" /> */}
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
              <button
                onClick={() => setActiveTab('details')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'details'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Details
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'orders'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Orders ({orders.length})
              </button>
              <button
                onClick={() => setActiveTab('activity')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'activity'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Activity
              </button>
            </nav>
          </div>

          <div className="p-6">
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

            {activeTab === 'activity' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <div className="text-center py-8">
                  <Activity className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500">No recent activity</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 
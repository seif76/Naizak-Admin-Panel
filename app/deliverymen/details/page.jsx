'use client';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import api from '../../../lib/axios';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Star, 
  Calendar,
  Truck,
  MapPin,
  DollarSign,
  Activity,
  Edit,
  Trash2,
  Award,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Package
} from 'lucide-react';

export default function DeliverymanDetailsPage() {
  const [deliveryman, setDeliveryman] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const searchParams = useSearchParams();
  const router = useRouter();
  const deliverymanId = searchParams.get('id');

  const fetchDeliverymanDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/admin/deliverymen/details/${deliverymanId}`);
      setDeliveryman(response.data); 
    } catch (error) {
      console.error('Error fetching deliveryman details:', error)
    } finally {
      setLoading(false);
    }
  };

  const updateDeliverymanStatus = async (newStatus) => {
    try {
      await api.put(`/api/admin/deliverymen/${deliverymanId}/status`, {
        status: newStatus
      });
      fetchDeliverymanDetails(); // Refresh data
    } catch (error) {
      console.error('Error updating deliveryman status:', error);
    }
  };

  const deleteDeliveryman = async () => {
    if (window.confirm('Are you sure you want to delete this deliveryman? This will also delete their vehicle information.')) {
      try {
        await api.delete(`/api/admin/deliverymen/${deliverymanId}`);
        router.push('/deliverymen/list');
      } catch (error) {
        console.error('Error deleting deliveryman:', error);
      }
    }
  };

  useEffect(() => {
    if (deliverymanId) {
      fetchDeliverymanDetails();
    }
  }, [deliverymanId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!deliveryman) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <User className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-xl font-semibold text-gray-600">Deliveryman not found</h2>
          <button
            onClick={() => router.push('/deliverymen/list')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Deliverymen
          </button>
        </div>
      </div>
    );
  }

  // Assuming your DB field is either 'deliveryman_status' or just 'status' 
  // Adjust this variable if your backend uses a different exact field name!
  const currentStatus = deliveryman.deliveryman_status || deliveryman.status;

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Deactivated':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Active':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'Deactivated':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getDeliveryStatusColor = (status) => {
    switch (status) {
      case 'completed':
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'active':
      case 'in_progress':
      case 'picked_up':
        return 'bg-blue-100 text-blue-800';
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
                onClick={() => router.push('/deliverymen/list')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Deliveryman Details</h1>
                <p className="text-gray-600">ID: {deliveryman.id}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => updateDeliverymanStatus(currentStatus === 'Active' ? 'Deactivated' : 'Active')}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  currentStatus === 'Active' 
                    ? 'border-red-300 text-red-700 hover:bg-red-50' 
                    : 'border-green-300 text-green-700 hover:bg-green-50'
                }`}
              >
                {currentStatus === 'Active' ? 'Deactivate' : 'Activate'}
              </button>
              <button
                onClick={deleteDeliveryman}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Deliveryman Overview */}
        <div className="bg-white rounded-lg shadow-sm border mb-8">
          <div className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden">
                  {deliveryman.profile_photo ? (
                    <img 
                      src={deliveryman.profile_photo} 
                      alt="Deliveryman Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-10 h-10 text-blue-600" />
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{deliveryman.name}</h2>
                  <p className="text-gray-600">{deliveryman.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getStatusColor(currentStatus)}`}>
                      {getStatusIcon(currentStatus)}
                      {currentStatus}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm text-gray-600">{deliveryman.rating || 0}</span>
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
                  <p className="font-medium">{deliveryman.phone_number}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{deliveryman.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Gender</p>
                  <p className="font-medium capitalize">{deliveryman.gender || 'N/A'}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Joined</p>
                  <p className="font-medium">{formatDate(deliveryman.createdAt)}</p>
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
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('vehicle')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'vehicle'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Vehicle
              </button>
              <button
                onClick={() => setActiveTab('deliveries')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'deliveries'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Deliveries ({deliveryman.recentDeliveries?.length || 0})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Delivery Statistics */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Delivery Statistics
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-blue-600" />
                        <span className="text-sm text-gray-600">Total Deliveries</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-600 mt-1">{deliveryman.deliveryStats?.total || 0}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-sm text-gray-600">Completed</span>
                      </div>
                      <p className="text-2xl font-bold text-green-600 mt-1">{deliveryman.deliveryStats?.completed || 0}</p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-yellow-600" />
                        <span className="text-sm text-gray-600">Active</span>
                      </div>
                      <p className="text-2xl font-bold text-yellow-600 mt-1">{deliveryman.deliveryStats?.active || 0}</p>
                    </div>
                  </div>
                </div>

                {/* Account Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Account Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status</span>
                          <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(currentStatus)}`}>
                            {currentStatus}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Rating</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span>{deliveryman.rating || 0}</span>
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Member Since</span>
                          <span className="font-medium">{formatDate(deliveryman.createdAt)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Last Updated</span>
                          <span className="font-medium">{formatDate(deliveryman.updatedAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'vehicle' && (
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  Vehicle Information
                </h3>
                {deliveryman.vehicle ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-4">Vehicle Details</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Make</span>
                            <span className="font-medium">{deliveryman.vehicle.make}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Model</span>
                            <span className="font-medium">{deliveryman.vehicle.model}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Year</span>
                            <span className="font-medium">{deliveryman.vehicle.year}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">License Plate</span>
                            <span className="font-medium">{deliveryman.vehicle.license_plate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Vehicle Type</span>
                            <span className="font-medium capitalize">{deliveryman.vehicle.vehicle_type}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Color</span>
                            <span className="font-medium capitalize">{deliveryman.vehicle.color || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-4">Documents</h4>
                        <div className="space-y-3">
                          {deliveryman.vehicle.driver_license_photo && (
                            <div>
                              <p className="text-sm text-gray-600 mb-2">Driver License</p>
                              <img 
                                src={deliveryman.vehicle.driver_license_photo} 
                                alt="Driver License" 
                                className="w-full max-w-xs rounded-lg border"
                              />
                            </div>
                          )}
                          {deliveryman.vehicle.national_id_photo && (
                            <div>
                              <p className="text-sm text-gray-600 mb-2">National ID</p>
                              <img 
                                src={deliveryman.vehicle.national_id_photo} 
                                alt="National ID" 
                                className="w-full max-w-xs rounded-lg border"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Truck className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500">No vehicle information available</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'deliveries' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Recent Deliveries</h3>
                {deliveryman.recentDeliveries && deliveryman.recentDeliveries.length > 0 ? (
                  <div className="space-y-4">
                    {deliveryman.recentDeliveries.map((delivery) => (
                      <div key={delivery.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <Package className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-medium">Order #{delivery.id}</h4>
                              <p className="text-sm text-gray-600">{formatDate(delivery.createdAt)}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDeliveryStatusColor(delivery.status)}`}>
                              {delivery.status}
                            </span>
                            <span className="font-semibold text-lg">
                              ${delivery.total_amount || 0}
                            </span>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Pickup:</span>
                            <p className="font-medium">{delivery.pickup_location}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Dropoff:</span>
                            <p className="font-medium">{delivery.dropoff_location}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Activity className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500">No deliveries found</p>
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
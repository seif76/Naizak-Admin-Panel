'use client';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Star, 
  Calendar,
  Car,
  MapPin,
  DollarSign,
  Activity,
  Edit,
  Trash2,
  Award,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

export default function CaptainDetailsPage() {
  const [captain, setCaptain] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const searchParams = useSearchParams();
  const router = useRouter();
  const captainId = searchParams.get('id');

  const fetchCaptainDetails = async () => {
    try {
      setLoading(true);
      const response = await  axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/captains/details/${captainId}` );
      setCaptain(response.data); 
    } catch (error) {
      console.error('Error fetching captain details:', error)
    } finally {
      setLoading(false);
    }
  };

  const updateCaptainStatus = async (newStatus) => {
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/captains/${captainId}/status`, {
        status: newStatus
      });
      fetchCaptainDetails(); // Refresh data
    } catch (error) {
      console.error('Error updating captain status:', error);
    }
  };

  const deleteCaptain = async () => {
    if (window.confirm('Are you sure you want to delete this captain? This will also delete their vehicle information.')) {
      try {
        await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/captains/${captainId}`);
        router.push('/captains/list');
      } catch (error) {
        console.error('Error deleting captain:', error);
      }
    }
  };

  useEffect(() => {
    if (captainId) {
      fetchCaptainDetails();
    }
  }, [captainId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!captain) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <User className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-xl font-semibold text-gray-600">Captain not found</h2>
          <button
            onClick={() => router.push('/captains/list')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Captains
          </button>
        </div>
      </div>
    );
  }

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

  const getRideStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'active':
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
                onClick={() => router.push('/captains/list')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Captain Details</h1>
                <p className="text-gray-600">ID: {captain.id}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => updateCaptainStatus(captain.captain_status === 'Active' ? 'Deactivated' : 'Active')}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  captain.captain_status === 'Active' 
                    ? 'border-red-300 text-red-700 hover:bg-red-50' 
                    : 'border-green-300 text-green-700 hover:bg-green-50'
                }`}
              >
                {captain.captain_status === 'Active' ? 'Deactivate' : 'Activate'}
              </button>
              <button
                onClick={deleteCaptain}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Captain Overview */}
        <div className="bg-white rounded-lg shadow-sm border mb-8">
          <div className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden">
                  {captain.profile_photo ? (
                    <img 
                      src={captain.profile_photo} 
                      alt="Captain Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-10 h-10 text-blue-600" />
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{captain.name}</h2>
                  <p className="text-gray-600">{captain.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getStatusColor(captain.captain_status)}`}>
                      {getStatusIcon(captain.captain_status)}
                      {captain.captain_status}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm text-gray-600">{captain.rating || 0}</span>
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
                  <p className="font-medium">{captain.phone_number}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{captain.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Gender</p>
                  <p className="font-medium capitalize">{captain.gender || 'N/A'}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Joined</p>
                  <p className="font-medium">{formatDate(captain.createdAt)}</p>
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
                onClick={() => setActiveTab('rides')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'rides'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Rides ({captain.recentRides?.length || 0})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Ride Statistics */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Ride Statistics
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-blue-600" />
                        <span className="text-sm text-gray-600">Total Rides</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-600 mt-1">{captain.rideStats?.total || 0}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-sm text-gray-600">Completed</span>
                      </div>
                      <p className="text-2xl font-bold text-green-600 mt-1">{captain.rideStats?.completed || 0}</p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-yellow-600" />
                        <span className="text-sm text-gray-600">Active</span>
                      </div>
                      <p className="text-2xl font-bold text-yellow-600 mt-1">{captain.rideStats?.active || 0}</p>
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
                          <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(captain.captain_status)}`}>
                            {captain.captain_status}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Rating</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span>{captain.rating || 0}</span>
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Member Since</span>
                          <span className="font-medium">{formatDate(captain.createdAt)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Last Updated</span>
                          <span className="font-medium">{formatDate(captain.updatedAt)}</span>
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
                  <Car className="w-5 h-5" />
                  Vehicle Information
                </h3>
                {captain.vehicle ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-4">Vehicle Details</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Make</span>
                            <span className="font-medium">{captain.vehicle.make}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Model</span>
                            <span className="font-medium">{captain.vehicle.model}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Year</span>
                            <span className="font-medium">{captain.vehicle.year}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">License Plate</span>
                            <span className="font-medium">{captain.vehicle.license_plate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Vehicle Type</span>
                            <span className="font-medium capitalize">{captain.vehicle.vehicle_type}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Color</span>
                            <span className="font-medium capitalize">{captain.vehicle.color || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-4">Documents</h4>
                        <div className="space-y-3">
                          {captain.vehicle.driver_license_photo && (
                            <div>
                              <p className="text-sm text-gray-600 mb-2">Driver License</p>
                              <img 
                                src={captain.vehicle.driver_license_photo} 
                                alt="Driver License" 
                                className="w-full max-w-xs rounded-lg border"
                              />
                            </div>
                          )}
                          {captain.vehicle.national_id_photo && (
                            <div>
                              <p className="text-sm text-gray-600 mb-2">National ID</p>
                              <img 
                                src={captain.vehicle.national_id_photo} 
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
                    <Car className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500">No vehicle information available</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'rides' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Recent Rides</h3>
                {captain.recentRides && captain.recentRides.length > 0 ? (
                  <div className="space-y-4">
                    {captain.recentRides.map((ride) => (
                      <div key={ride.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <MapPin className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-medium">Ride #{ride.id}</h4>
                              <p className="text-sm text-gray-600">{formatDate(ride.createdAt)}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRideStatusColor(ride.status)}`}>
                              {ride.status}
                            </span>
                            <span className="font-semibold text-lg">
                              ${ride.total_amount || 0}
                            </span>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Pickup:</span>
                            <p className="font-medium">{ride.pickup_location}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Dropoff:</span>
                            <p className="font-medium">{ride.dropoff_location}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Activity className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500">No rides found</p>
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

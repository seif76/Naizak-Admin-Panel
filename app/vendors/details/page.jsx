'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  FaStore, 
  FaUser, 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaSpinner, 
  FaCheck, 
  FaTimes, 
  FaEdit, 
  FaTrash, 
  FaArrowLeft,
  FaImage,
  FaStar,
  FaCalendarAlt,
  FaBox,
  FaDollarSign,
  FaShieldAlt,
  FaClock,
  FaCamera,
  FaEye
} from 'react-icons/fa';
import api from '../../../lib/axios';

export default function VendorDetailsPage() {
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [editForm, setEditForm] = useState({});
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone_number = searchParams.get('phone_number');
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const fetchVendorDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/admin/vendors/details?phone_number=${phone_number}`);
      setVendor(res.data);
      setEditForm({
        name: res.data.name,
        email: res.data.email,
        phone_number: res.data.phone_number,
        gender: res.data.gender,
        vendor_status: res.data.vendor_status,
        shop_name: res.data.vendor_info?.shop_name || '',
        shop_location: res.data.vendor_info?.shop_location || '',
        owner_name: res.data.vendor_info?.owner_name || ''
      });
    } catch (error) {
      console.error('Error fetching vendor details:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateVendorStatus = async (status) => {
    try {
      setUpdating(true);
      await api.put(`/api/admin/vendors/status`, {
        phone_number,
        vendor_status: status
      });
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
      await api.put(`/api/admin/vendors/update`, {
        phone_number,
        ...editForm
      });
      await fetchVendorDetails();
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating vendor details:', error);
    } finally {
      setUpdating(false);
    }
  };



  const openImageModal = (imageUrl, title) => {
    setSelectedImage({ url: imageUrl, title });
    setShowImageModal(true);
  };


  useEffect(() => {
    if (phone_number) {
      fetchVendorDetails();
    }
  }, [phone_number]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Vendor Not Found</h1>
          <p className="text-gray-600 mb-4">The vendor you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/vendors/list')}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Back to Vendors List
          </button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Deactivated': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Active': return <FaCheck className="text-green-600" />;
      case 'pending': return <FaClock className="text-yellow-600" />;
      case 'Deactivated': return <FaTimes className="text-red-600" />;
      default: return <FaSpinner className="text-gray-600" />;
    }
  };

  const ImageCard = ({ imageUrl, title, subtitle,  }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative group">
        <img
          src={imageUrl || '/placeholder-image.jpg'}
          alt={title}
          className="w-full h-48 object-cover cursor-pointer transition-transform group-hover:scale-105"
          onClick={() => openImageModal(imageUrl, title)}
          onError={(e) => {
            e.target.src = '/placeholder-image.jpg';
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
            <button
              onClick={() => openImageModal(imageUrl, title)}
              className="bg-white bg-opacity-90 p-2 rounded-full hover:bg-opacity-100"
              title="View Full Size"
            >
              <FaEye className="text-gray-700" />
            </button>
           
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/vendors/list')}
            className="text-gray-600 hover:text-gray-800"
          >
            <FaArrowLeft size={20} />
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Vendor Details</h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowEditModal(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2"
            disabled={updating}
          >
            <FaEdit /> Edit
          </button>
     
        </div>
      </div>

      {/* Status Banner */}
      <div className={`mb-6 p-4 rounded-lg border ${getStatusColor(vendor.vendor_status)}`}>
        <div className="flex items-center gap-3">
          {getStatusIcon(vendor.vendor_status)}
          <div>
            <h2 className="font-semibold">Status: {vendor.vendor_status}</h2>
            <p className="text-sm opacity-75">
              {vendor.vendor_status === 'Active' && 'This vendor is active and can receive orders'}
              {vendor.vendor_status === 'pending' && 'This vendor is waiting for approval'}
              {vendor.vendor_status === 'Deactivated' && 'This vendor is deactivated and cannot receive orders'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info Cards */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile and Images Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FaCamera className="text-purple-600" />
              Profile & Images
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <ImageCard
                imageUrl={vendor.profile_photo}
                title="Profile Photo"
                subtitle="Vendor's profile picture"
              />
              
              <ImageCard
                imageUrl={vendor.vendor_info?.shop_front_photo}
                title="Shop Front"
                subtitle="Shop front view"
              
              />
              
              <ImageCard
                imageUrl={vendor.vendor_info?.logo}
                title="Shop Logo"
                subtitle="Vendor's shop logo"
              />
              
              <ImageCard
                imageUrl={vendor.vendor_info?.passport_photo}
                title="Passport Photo"
                subtitle="Owner's passport photo"
              />
              
              <ImageCard
                imageUrl={vendor.vendor_info?.license_photo}
                title="License Photo"
                subtitle="Business license"
              />
            </div>
          </div>

          {/* Shop Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FaStore className="text-blue-600" />
              Shop Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Shop Name</label>
                <p className="text-gray-900 font-medium">{vendor.vendor_info?.shop_name || 'N/A'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Owner Name</label>
                <p className="text-gray-900 font-medium">{vendor.vendor_info?.owner_name || 'N/A'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Shop Location</label>
                <p className="text-gray-900">{vendor.vendor_info?.shop_location || 'N/A'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <p className="text-gray-900">{vendor.vendor_info?.phone_number || vendor.phone_number}</p>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FaUser className="text-green-600" />
              Personal Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <p className="text-gray-900 font-medium">{vendor.name}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <p className="text-gray-900">{vendor.email}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <p className="text-gray-900">{vendor.phone_number}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <p className="text-gray-900 capitalize">{vendor.gender || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FaShieldAlt className="text-purple-600" />
              Additional Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                <div className="flex items-center gap-1">
                  <FaStar className="text-yellow-500" />
                  <span className="text-gray-900">{vendor.rating || 0}/5</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
                <div className="flex items-center gap-1">
                  <FaCalendarAlt className="text-blue-500" />
                  <span className="text-gray-900">
                    {vendor.createdAt ? new Date(vendor.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Profile Photo</label>
                <div className="flex items-center gap-1">
                  <FaImage className="text-gray-500" />
                  <span className="text-gray-900">{vendor.profile_photo ? 'Available' : 'Not uploaded'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FaBox className="text-orange-600" />
              Products ({vendor.products_count || 0})
            </h2>
            
            {vendor.products && vendor.products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {vendor.products.map((product) => (
                  <div key={product.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                      {product.image && (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded"
                          onError={(e) => {
                            e.target.src = '/placeholder-image.jpg';
                          }}
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{product.name}</h3>
                        <p className="text-sm text-gray-600">{product.description}</p>
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
              <div className="text-center py-8 text-gray-500">
                <FaBox className="text-4xl mx-auto mb-4 text-gray-300" />
                <p>No products found for this vendor</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Management */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Status Management</h3>
            
            <div className="space-y-3">
              <button
                onClick={() => updateVendorStatus('Active')}
                disabled={vendor.vendor_status === 'Active' || updating}
                className={`w-full p-3 rounded-lg border-2 transition-colors ${
                  vendor.vendor_status === 'Active'
                    ? 'bg-green-100 border-green-300 text-green-800'
                    : 'border-green-300 text-green-700 hover:bg-green-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FaCheck />
                  <span>Activate</span>
                </div>
              </button>
              
              <button
                onClick={() => updateVendorStatus('pending')}
                disabled={vendor.vendor_status === 'pending' || updating}
                className={`w-full p-3 rounded-lg border-2 transition-colors ${
                  vendor.vendor_status === 'pending'
                    ? 'bg-yellow-100 border-yellow-300 text-yellow-800'
                    : 'border-yellow-300 text-yellow-700 hover:bg-yellow-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FaClock />
                  <span>Set Pending</span>
                </div>
              </button>
              
              <button
                onClick={() => updateVendorStatus('Deactivated')}
                disabled={vendor.vendor_status === 'Deactivated' || updating}
                className={`w-full p-3 rounded-lg border-2 transition-colors ${
                  vendor.vendor_status === 'Deactivated'
                    ? 'bg-red-100 border-red-300 text-red-800'
                    : 'border-red-300 text-red-700 hover:bg-red-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FaTimes />
                  <span>Deactivate</span>
                </div>
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Products</span>
                <div className="flex items-center gap-1">
                  <FaBox className="text-blue-500" />
                  <span className="font-semibold">{vendor.products_count || 0}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Rating</span>
                <div className="flex items-center gap-1">
                  <FaStar className="text-yellow-500" />
                  <span className="font-semibold">{vendor.rating || 0}/5</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Member Since</span>
                <div className="flex items-center gap-1">
                  <FaCalendarAlt className="text-green-500" />
                  <span className="font-semibold">
                    {vendor.createdAt ? new Date(vendor.createdAt).getFullYear() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Image Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Images Summary</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Profile Photo</span>
                <div className="flex items-center gap-1">
                  <FaImage className={vendor.profile_photo ? "text-green-500" : "text-red-500"} />
                  <span className="text-sm">{vendor.profile_photo ? 'Uploaded' : 'Missing'}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Shop Front</span>
                <div className="flex items-center gap-1">
                  <FaImage className={vendor.vendor_info?.shop_front_photo ? "text-green-500" : "text-red-500"} />
                  <span className="text-sm">{vendor.vendor_info?.shop_front_photo ? 'Uploaded' : 'Missing'}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Shop Logo</span>
                <div className="flex items-center gap-1">
                  <FaImage className={vendor.vendor_info?.logo ? "text-green-500" : "text-red-500"} />
                  <span className="text-sm">{vendor.vendor_info?.logo ? 'Uploaded' : 'Missing'}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Passport Photo</span>
                <div className="flex items-center gap-1">
                  <FaImage className={vendor.vendor_info?.passport_photo ? "text-green-500" : "text-red-500"} />
                  <span className="text-sm">{vendor.vendor_info?.passport_photo ? 'Uploaded' : 'Missing'}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">License Photo</span>
                <div className="flex items-center gap-1">
                  <FaImage className={vendor.vendor_info?.license_photo ? "text-green-500" : "text-red-500"} />
                  <span className="text-sm">{vendor.vendor_info?.license_photo ? 'Uploaded' : 'Optional'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Edit Vendor Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={editForm.phone_number}
                  onChange={(e) => setEditForm({...editForm, phone_number: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select
                  value={editForm.gender}
                  onChange={(e) => setEditForm({...editForm, gender: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Shop Name</label>
                <input
                  type="text"
                  value={editForm.shop_name}
                  onChange={(e) => setEditForm({...editForm, shop_name: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Owner Name</label>
                <input
                  type="text"
                  value={editForm.owner_name}
                  onChange={(e) => setEditForm({...editForm, owner_name: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Shop Location</label>
                <input
                  type="text"
                  value={editForm.shop_location}
                  onChange={(e) => setEditForm({...editForm, shop_location: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={editForm.vendor_status}
                  onChange={(e) => setEditForm({...editForm, vendor_status: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="Active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="Deactivated">Deactivated</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={updateVendorDetails}
                disabled={updating}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                {updating ? 'Updating...' : 'Save Changes'}
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 max-w-4xl max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{selectedImage.title}</h3>
              <div className="flex gap-2">
              
                <button
                  onClick={() => setShowImageModal(false)}
                  className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                >
                  Close
                </button>
              </div>
            </div>
            <img
              src={selectedImage.url}
              alt={selectedImage.title}
              className="w-full h-auto max-h-[70vh] object-contain"
              onError={(e) => {
                e.target.src = '/placeholder-image.jpg';
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
} 
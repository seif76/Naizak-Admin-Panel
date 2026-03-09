'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  FaStore, FaUser, FaEnvelope, FaPhone, FaLock,
  FaMapMarkerAlt, FaIdCard, FaCheckCircle,
  FaArrowLeft, FaUpload, FaVenusMars, FaTag, FaImage
} from 'react-icons/fa';
import api from '../../../lib/axios';

const initialForm = {
  name: '',
  email: '',
  password: '',
  phone_number: '',
  address: '',
  gender: '',
  shop_name: '',
  shop_location: '',
  owner_name: '',
  category: '',
};

export default function AddVendorPage() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [categories, setCategories] = useState([]);
  const [files, setFiles] = useState({
    profile_photo: null,
    passport_photo: null,
    license_photo: null,
    shop_front_photo: null,
    logo: null,
  });
  const [previews, setPreviews] = useState({
    profile_photo: null,
    passport_photo: null,
    license_photo: null,
    shop_front_photo: null,
    logo: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
        try {
          const res = await api.get('/api/admin/category');
          // handle both plain array and wrapped responses
          const data = res.data;
          setCategories(Array.isArray(data) ? data : (data.categories || data.data || []));
        } catch (err) {
          console.error('Failed to fetch categories', err);
        }
      };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    const { name, files: selected } = e.target;
    if (!selected[0]) return;
    setFiles((prev) => ({ ...prev, [name]: selected[0] }));
    setPreviews((prev) => ({ ...prev, [name]: URL.createObjectURL(selected[0]) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formData = new FormData();

      // User fields
      formData.append('name', form.name);
      formData.append('email', form.email);
      formData.append('password', form.password);
      formData.append('phone_number', form.phone_number);
      if (form.address) formData.append('address', form.address);
      if (form.gender) formData.append('gender', form.gender);

      // Vendor info fields
      formData.append('shop_name', form.shop_name);
      formData.append('shop_location', form.shop_location);
      formData.append('owner_name', form.owner_name);
      formData.append('category', form.category);

      // Files
      
      if (files.passport_photo) formData.append('passport_photo', files.passport_photo);
      if (files.license_photo) formData.append('license_photo', files.license_photo);
      if (files.shop_front_photo) formData.append('shop_front_photo', files.shop_front_photo);
      if (files.logo) formData.append('logo', files.logo);

      await api.post('/api/vendor/auth/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSuccess(true);
      setTimeout(() => router.push('/vendors/pendingVendors'), 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to register vendor');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-md p-10 flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <FaCheckCircle className="text-green-500 text-3xl" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Vendor Registered!</h2>
          <p className="text-sm text-gray-500">Redirecting to pending requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-lg hover:bg-gray-200 text-gray-500 transition-colors"
        >
          <FaArrowLeft />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
            <FaStore /> Add New Vendor
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Fill in all required fields to register a new vendor</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* ── Personal Info Card ── */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/60 flex items-center gap-2">
            <FaUser className="text-primary text-sm" />
            <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Personal Information</h2>
          </div>

          <div className="p-5 space-y-4">
            {/* Profile Photo */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden bg-gray-50 flex-shrink-0">
                {previews.profile_photo ? (
                  <img src={previews.profile_photo} alt="preview" className="w-full h-full object-cover" />
                ) : (
                  <FaUser className="text-gray-300 text-xl" />
                )}
              </div>
              <div>
                <label className="cursor-pointer inline-flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-medium px-3 py-2 rounded-lg transition-colors">
                  <FaUpload /> Upload Photo
                  <input type="file" name="profile_photo" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
                <p className="text-xs text-gray-400 mt-1">Optional · JPG, PNG</p>
              </div>
            </div>

            <InputField icon={<FaUser />} label="Full Name" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Ahmed Hassan" required />
            <InputField icon={<FaEnvelope />} label="Email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="e.g. ahmed@email.com" required />
            <InputField icon={<FaLock />} label="Password" name="password" type="password" value={form.password} onChange={handleChange} placeholder="Min. 8 characters" required />
            <InputField icon={<FaPhone />} label="Phone Number" name="phone_number" value={form.phone_number} onChange={handleChange} placeholder="e.g. +20123456789" required />
            <InputField icon={<FaMapMarkerAlt />} label="Address" name="address" value={form.address} onChange={handleChange} placeholder="e.g. 12 Nile St, Cairo" />

            {/* Gender */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5 flex items-center gap-1.5">
                <FaVenusMars className="text-gray-400" /> Gender
              </label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>
        </div>

        {/* ── Shop Info Card ── */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/60 flex items-center gap-2">
            <FaStore className="text-primary text-sm" />
            <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Shop Information</h2>
          </div>

          <div className="p-5 space-y-4">
            <InputField icon={<FaStore />} label="Shop Name" name="shop_name" value={form.shop_name} onChange={handleChange} placeholder="e.g. Fresh Mart" required />
            <InputField icon={<FaMapMarkerAlt />} label="Shop Location" name="shop_location" value={form.shop_location} onChange={handleChange} placeholder="e.g. 5 Market St, Cairo" required />
            <InputField icon={<FaUser />} label="Owner Name" name="owner_name" value={form.owner_name} onChange={handleChange} placeholder="e.g. Ahmed Hassan" required />

            {/* Category Dropdown */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5 flex items-center gap-1.5">
                <FaTag className="text-gray-400" /> Category <span className="text-red-400">*</span>
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
              >
                <option value="">Select a category</option>
                {categories?.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Documents */}
            <div className="pt-2 border-t border-gray-100">
              <p className="text-xs font-medium text-gray-600 mb-3 flex items-center gap-1.5 uppercase tracking-wide">
                <FaIdCard className="text-gray-400" /> Documents & Photos
              </p>
              <div className="space-y-3">
                <FileUploadField
                  label="Logo"
                  name="logo"
                  preview={previews.logo}
                  onChange={handleFileChange}
                  required
                />
                <FileUploadField
                  label="Passport Photo"
                  name="passport_photo"
                  preview={previews.passport_photo}
                  onChange={handleFileChange}
                  required
                />
                <FileUploadField
                  label="Shop Front Photo"
                  name="shop_front_photo"
                  preview={previews.shop_front_photo}
                  onChange={handleFileChange}
                  required
                />
                <FileUploadField
                  label="License Photo"
                  name="license_photo"
                  preview={previews.license_photo}
                  onChange={handleFileChange}
                  required={false}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Footer Actions ── */}
        <div className="xl:col-span-2 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-xl shadow-sm border border-gray-100 px-5 py-4">
          {error && (
            <p className="text-sm text-red-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-400 inline-block" /> {error}
            </p>
          )}
          {!error && <div />}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-5 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Registering...
                </>
              ) : (
                <><FaCheckCircle /> Register Vendor</>
              )}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}

// ── Reusable Components ──

function InputField({ icon, label, name, value, onChange, placeholder, type = 'text', required }) {
  return (
    <div>
      {label && (
        <label className="block text-xs font-medium text-gray-600 mb-1.5">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">{icon}</span>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full border border-gray-200 rounded-lg py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${icon ? 'pl-8 pr-3' : 'px-3'}`}
        />
      </div>
    </div>
  );
}

function FileUploadField({ label, name, preview, onChange, required }) {
  return (
    <div className="flex items-center justify-between p-3 border border-dashed border-gray-200 rounded-lg hover:border-primary/50 transition-colors">
      <div className="flex items-center gap-3">
        {preview ? (
          <img src={preview} alt={label} className="w-10 h-10 rounded object-cover border border-gray-200" />
        ) : (
          <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center">
            <FaImage className="text-gray-300" />
          </div>
        )}
        <div>
          <p className="text-xs font-medium text-gray-700">{label} {required && <span className="text-red-400">*</span>}</p>
          <p className="text-xs text-gray-400">{preview ? 'Uploaded ✓' : 'No file chosen'}</p>
        </div>
      </div>
      <label className="cursor-pointer inline-flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-lg transition-colors">
        <FaUpload className="text-xs" /> Upload
        <input type="file" name={name} accept="image/*" onChange={onChange} className="hidden" />
      </label>
    </div>
  );
}
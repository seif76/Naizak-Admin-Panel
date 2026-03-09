'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  FaMotorcycle, FaUser, FaEnvelope, FaPhone, FaLock,
  FaMapMarkerAlt, FaIdCard, FaCar, FaCheckCircle,
  FaArrowLeft, FaUpload, FaVenusMars
} from 'react-icons/fa';
import api from '../../../lib/axios';

const VEHICLE_TYPES = ['motorcycle', 'bicycle', 'car', 'van'];

const initialForm = {
  name: '',
  email: '',
  password: '',
  phone_number: '',
  address: '',
  gender: '',
  make: '',
  model: '',
  year: '',
  license_plate: '',
  vehicle_type: 'motorcycle',
  color: '',
};

export default function AddDeliverymanPage() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [files, setFiles] = useState({
    profile_photo: null,
    driver_license_photo: null,
    national_id_photo: null,
  });
  const [previews, setPreviews] = useState({
    profile_photo: null,
    driver_license_photo: null,
    national_id_photo: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const isBicycle = form.vehicle_type === 'bicycle';

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
      formData.append('address', form.address);
      formData.append('gender', form.gender);

      // Vehicle data as nested object keys (matching backend req.body.vehicleData)
      formData.append('vehicleData[make]', form.make);
      formData.append('vehicleData[model]', form.model);
      formData.append('vehicleData[vehicle_type]', form.vehicle_type);
      formData.append('vehicleData[color]', form.color);
      if (!isBicycle) {
        formData.append('vehicleData[year]', form.year);
        formData.append('vehicleData[license_plate]', form.license_plate);
      }

      // Files
      if (files.profile_photo) formData.append('profile_photo', files.profile_photo);
      if (files.driver_license_photo) formData.append('driver_license_photo', files.driver_license_photo);
      if (files.national_id_photo) formData.append('national_id_photo', files.national_id_photo);

      await api.post('/api/deliveryman/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSuccess(true);
      setTimeout(() => router.push('/deliverymen/pendingdeliverymen'), 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to register deliveryman');
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
          <h2 className="text-xl font-bold text-gray-800">Deliveryman Registered!</h2>
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
            <FaMotorcycle /> Add New Deliveryman
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Fill in all required fields to register a new deliveryman</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* ── Personal Info Card ── */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-4">
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

            {/* Name */}
            <InputField icon={<FaUser />} label="Full Name" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Ahmed Hassan" required />

            {/* Email */}
            <InputField icon={<FaEnvelope />} label="Email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="e.g. ahmed@email.com" required />

            {/* Password */}
            <InputField icon={<FaLock />} label="Password" name="password" type="password" value={form.password} onChange={handleChange} placeholder="Min. 8 characters" required />

            {/* Phone */}
            <InputField icon={<FaPhone />} label="Phone Number" name="phone_number" value={form.phone_number} onChange={handleChange} placeholder="e.g. +20123456789" required />

            {/* Address */}
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

        {/* ── Vehicle Info Card ── */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/60 flex items-center gap-2">
            <FaCar className="text-primary text-sm" />
            <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Vehicle Information</h2>
          </div>

          <div className="p-5 space-y-4">
            {/* Vehicle Type */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Vehicle Type <span className="text-red-400">*</span></label>
              <div className="grid grid-cols-2 gap-2">
                {VEHICLE_TYPES.map((type) => (
                  <button
                    type="button"
                    key={type}
                    onClick={() => setForm((prev) => ({ ...prev, vehicle_type: type }))}
                    className={`py-2 px-3 rounded-lg text-xs font-medium border capitalize transition-all ${
                      form.vehicle_type === type
                        ? 'bg-primary text-white border-primary shadow-sm'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Make & Model */}
            <div className="grid grid-cols-2 gap-3">
              <InputField label="Make" name="make" value={form.make} onChange={handleChange} placeholder="e.g. Honda" required />
              <InputField label="Model" name="model" value={form.model} onChange={handleChange} placeholder="e.g. CB150" required />
            </div>

            {/* Year & Plate — hidden for bicycle */}
            {!isBicycle && (
              <div className="grid grid-cols-2 gap-3">
                <InputField label="Year" name="year" type="number" value={form.year} onChange={handleChange} placeholder="e.g. 2022" required />
                <InputField label="License Plate" name="license_plate" value={form.license_plate} onChange={handleChange} placeholder="e.g. ABC-1234" required />
              </div>
            )}

            {/* Color */}
            <InputField label="Color" name="color" value={form.color} onChange={handleChange} placeholder="e.g. Red" required />

            {/* Documents */}
            <div className="pt-2 border-t border-gray-100">
              <p className="text-xs font-medium text-gray-600 mb-3 flex items-center gap-1.5 uppercase tracking-wide">
                <FaIdCard className="text-gray-400" /> Documents
              </p>
              <div className="space-y-3">
                <FileUploadField
                  label="National ID Photo"
                  name="national_id_photo"
                  preview={previews.national_id_photo}
                  onChange={handleFileChange}
                  required
                />
                {!isBicycle && (
                  <FileUploadField
                    label="Driver License Photo"
                    name="driver_license_photo"
                    preview={previews.driver_license_photo}
                    onChange={handleFileChange}
                    required
                  />
                )}
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
                <><FaCheckCircle /> Register Deliveryman</>
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
            <FaIdCard className="text-gray-300" />
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
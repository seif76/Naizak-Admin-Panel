'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { FaPlusCircle } from 'react-icons/fa';

export default function AddCustomerPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone_number: '',
    gender: 'male',
    profile_photo: ''
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/customers/register', formData);
      setMessage(res.data.message);
      setFormData({ name: '', email: '', password: '', phone_number: '', gender: 'male', profile_photo: '' });
    } catch (err) {
        setError(err.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <div className="p-8 w-full">
      <h1 className="text-2xl font-bold text-green-700 flex items-center gap-2 mb-6">
        <FaPlusCircle /> Add New Customer
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid md:grid-cols-2 gap-6 bg-white p-6 rounded shadow-md w-full"
      >
        <div>
          <label className="block text-gray-700 mb-1">Full Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-4 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Email</label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-4 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Phone Number</label>
          <input
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-4 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Password</label>
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-4 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-4 py-2"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Profile Photo URL</label>
          <input
            name="profile_photo"
            value={formData.profile_photo}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-4 py-2"
          />
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded font-semibold"
          >
            Add Customer
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-4 text-center text-sm text-red-600 font-medium">
          {error}
        </div>
      )}
      {message && (
        <div className="mt-4 text-center text-sm text-primary font-medium">
          {message}
        </div>
      )}
    </div>
  );
}

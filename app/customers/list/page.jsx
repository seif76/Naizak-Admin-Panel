'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUserTie, FaSpinner, FaUserSlash , FaEye, FaTrash } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function CustomerListPage() {
  const [customers, setCustomers] = useState([]);
  const [stats, setStats] = useState({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const BACKEND_URL=  process.env.NEXT_PUBLIC_BACKEND_URL;
  const router = useRouter();
  

  const fetchStats = async () => {
    const res = await axios.get(`${BACKEND_URL}/api/admin/customers/stats`);
    setStats(res.data);
  };

  const fetchCustomers = async () => {
    setLoading(true);
    const res = await axios.get(`${BACKEND_URL}/api/admin/customers`, {
      params: { page, limit: 10, status: statusFilter || undefined },
    });
    //alert(JSON.stringify(res.data.Customers));
    setCustomers(res.data.customers);
    setTotalPages(res.data.totalPages);
    setLoading(false);
  };

  const deleteCustomer = async (customerId) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await axios.delete(`${BACKEND_URL}/api/admin/customers/${customerId}`);
        fetchCustomers();
      } catch (error) {
        console.error('Error deleting customer:', error);
      }
    }
  };
  const searchwithphoneorname = async (searchTerm) => {
    if(searchTerm.length > 0){
    const filteredCustomers = customers.filter(customer => 
      customer.phone_number.includes(searchTerm) || customer.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setCustomers(filteredCustomers);
  }else{
    fetchCustomers();
  }
  };

  const navigateToCustomerDetails = (customerId) => {
    router.push(`/customers/details?id=${customerId}`);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [page, statusFilter]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Customer Management</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-100 p-4 rounded shadow">
          <div className="flex items-center gap-2 text-blue-600">
            <FaUserTie /> <span className="text-lg">Active: {stats.active || 0}</span>
          </div>
        </div>
        
        <div className="bg-red-100 p-4 rounded shadow">
          <div className="flex items-center gap-2 text-red-600">
            <FaUserSlash /> <span className="text-lg">Deactivated: {stats.deactivated || 0}</span>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="mb-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Deactivated">Deactivated</option>
        </select>
        <input
          type="text"
          placeholder="Search by phone or name"
          onChange={(e) => searchwithphoneorname(e.target.value)}
          className="border border-gray-300 ml-2 rounded px-3 py-2"
        />
      </div>

      {/* Table */}
      <div className="overflow-auto bg-white shadow rounded">
        <table className="w-full text-left min-w-[700px]">
          <thead>
            <tr className="bg-gray-100 text-sm">
              <th className="p-3">#</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Gender</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Status</th>
              <th className="p-3">Rating</th>
              <th className="px-3 p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="text-center p-5">Loading...</td></tr>
            ) : customers?.length === 0 ? (
              <tr><td colSpan={8} className="text-center p-5">No data</td></tr>
            ) : (
              customers?.map((customer, idx) => (
                <tr key={customer.id} className="border-b">
                  <td className="p-3">{(page - 1) * 10 + idx + 1}</td>
                  <td className="p-3">{customer.name}</td>
                  <td className="p-3">{customer.email}</td>
                  <td className="p-3">{customer.gender}</td>
                  <td className="p-3">{customer.phone_number}</td>
                  <td className="p-3">{customer.customer_status}</td>
                  <td className="p-3">{customer.rating}</td>
                  <td className="px-4 py-2 space-x-2">
                   <button 
                     onClick={() => navigateToCustomerDetails(customer.id)}
                     className="text-primary hover:text-blue-700"
                   >
                     <FaEye />
                   </button>
                   <button onClick={() => deleteCustomer(customer.id)} className="text-red-500 hover:text-red-700">
                     <FaTrash />
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
            className={`px-3 py-1 rounded border ${page === num + 1 ? 'bg-green-500 text-white' : 'bg-white text-gray-800'}`}
            onClick={() => setPage(num + 1)}
          >
            {num + 1}
          </button>
        ))}
      </div>
    </div>
  );
}







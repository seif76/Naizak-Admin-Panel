'use client';
import { useState, useEffect } from 'react';
import {
  FaUsers,
  FaUserTie,
  FaStore,
  FaCar,
  FaShoppingCart,
  FaComments,
  FaChartLine,
  FaCog,
  FaCheckCircle
} from 'react-icons/fa';
import Link from 'next/link';
import api from '../lib/axios';

export default function Dashboard() {
  const [stats, setStats] = useState({
    customers: { active: 0, deactivated: 0 },
    deliverymen: { active: 0, pending: 0, deactivated: 0 },
    vendors: { active: 0, pending: 0, deactivated: 0 },
    orders: { total: 0, pending: 0, completed: 0 },
    rides: { total: 0, active: 0, completed: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all stats in parallel
      const [customersRes, deliverymenRes, vendorsRes] = await Promise.all([
        api.get('/api/admin/customers/stats'),
        api.get('/api/admin/deliverymen/stats'),
        api.get('/api/admin/vendors/stats')
      ]);

      setStats({
        customers: customersRes.data,
        deliverymen: deliverymenRes.data,
        vendors: vendorsRes.data,
        orders: { total: 0, pending: 0, completed: 0 }, // TODO: Add order stats
        rides: { total: 0, active: 0, completed: 0 } // TODO: Add ride stats
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      console.error('Error details:', error.response?.data);
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <div className={`bg-white p-6 rounded-lg shadow-md border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
        <div className={`text-3xl ${color.replace('border-l-', 'text-')}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  const QuickActionCard = ({ title, description, icon, color, href }) => (
    <Link href={href} className={`bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border-l-4 ${color}`}>
      <div className="flex items-center gap-4">
        <div className={`text-2xl ${color.replace('border-l-', 'text-')}`}>
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </Link>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome to your admin dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Customers"
          value={stats.customers.active + stats.customers.deactivated}
          icon={<FaUsers />}
          color="border-l-blue-500"
          subtitle={`${stats.customers.active} active`}
        />
        <StatCard
          title="Total deliverymen"
          value={stats.deliverymen.active + stats.deliverymen.pending + stats.deliverymen.deactivated}
          icon={<FaCar />}
          color="border-l-green-500"
          subtitle={`${stats.deliverymen.pending} pending`}
        />
        <StatCard
          title="Total Vendors"
          value={stats.vendors.active + stats.vendors.pending + stats.vendors.deactivated}
          icon={<FaStore />}
          color="border-l-purple-500"
          subtitle={`${stats.vendors.pending} pending`}
        />
        <StatCard
          title="Active Rides"
          value={stats.rides.active}
          icon={<FaCar />}
          color="border-l-orange-500"
          subtitle="Currently running"
        />
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <QuickActionCard
            title="Manage Customers"
            description="View and manage customer accounts"
            icon={<FaUsers />}
            color="border-l-blue-500"
            href="/customers/list"
          />
          <QuickActionCard
            title="Manage deliverymen"
            description="View and manage deliverymen accounts"
            icon={<FaUserTie />}
            color="border-l-green-500"
            href="/deliverymen/list"
          />
          <QuickActionCard
            title="Manage Vendors"
            description="View and manage vendor accounts"
            icon={<FaStore />}
            color="border-l-purple-500"
            href="/vendors/list"
          />
          <QuickActionCard
            title="View Orders"
            description="Monitor and manage orders"
            icon={<FaShoppingCart />}
            color="border-l-orange-500"
            href="/orders/list"
          />
          <QuickActionCard
            title="Support Chat"
            description="Handle customer support requests"
            icon={<FaComments />}
            color="border-l-red-500"
            href="/support/chat"
          />
          <QuickActionCard
            title="Analytics"
            description="View platform analytics and reports"
            icon={<FaChartLine />}
            color="border-l-indigo-500"
            href="/analytics"
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded">
            <FaCheckCircle className="text-green-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">New customer registered</p>
              <p className="text-xs text-gray-500">2 minutes ago</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded">
            <FaCheckCircle className="text-green-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">Captain approved</p>
              <p className="text-xs text-gray-500">5 minutes ago</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded">
            <FaCheckCircle className="text-green-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">New order received</p>
              <p className="text-xs text-gray-500">10 minutes ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


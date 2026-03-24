'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  FaTicketAlt, FaSearch, FaFilter,
  FaEye, FaUser, FaMotorcycle, FaStore
} from 'react-icons/fa';
import api from '../../../lib/axios';

const STATUS_CONFIG = {
  open:        { bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-400' },
  in_progress: { bg: 'bg-blue-100',   text: 'text-blue-700',   dot: 'bg-blue-400'   },
  resolved:    { bg: 'bg-green-100',  text: 'text-green-700',  dot: 'bg-green-400'  },
  closed:      { bg: 'bg-gray-100',   text: 'text-gray-500',   dot: 'bg-gray-400'   },
};

const ROLE_CONFIG = {
  customer:    { icon: <FaUser className="text-blue-500" />,   label: 'Customer',    bg: 'bg-blue-50',   text: 'text-blue-700'   },
  vendor:      { icon: <FaStore className="text-orange-500" />, label: 'Vendor',     bg: 'bg-orange-50', text: 'text-orange-700' },
  deliveryman: { icon: <FaMotorcycle className="text-green-500" />, label: 'Deliveryman', bg: 'bg-green-50', text: 'text-green-700' },
};

const ROLES      = ['all', 'customer', 'vendor', 'deliveryman'];
const STATUSES   = ['all', 'open', 'in_progress', 'resolved', 'closed'];
const CATEGORIES = [
  'all', 'order_issue', 'payment_issue', 'delivery_issue',
  'account_issue', 'payout_issue', 'product_issue',
  'order_management', 'vehicle_issue', 'other'
];

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;
  const router = useRouter();

  const fetchTickets = async (currentPage = 1) => {
    setLoading(true);
    try {
      const params = { page: currentPage, limit };
      if (roleFilter !== 'all')     params.role     = roleFilter;
      if (statusFilter !== 'all')   params.status   = statusFilter;
      if (categoryFilter !== 'all') params.category = categoryFilter;

      const res = await api.get('/api/admin/tickets', { params });
      setTickets(res.data.tickets || []);
      setTotal(res.data.total || 0);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error('Failed to fetch tickets', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchTickets(1);
  }, [roleFilter, statusFilter, categoryFilter]);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
    fetchTickets(newPage);
  };

  const filtered = tickets.filter(t =>
    t.subject?.toLowerCase().includes(search.toLowerCase()) ||
    t.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    t.user?.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 min-h-screen bg-gray-50">

      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
            <FaTicketAlt className="text-yellow-500" /> Support Tickets
          </h1>
          <p className="text-sm text-gray-500 mt-1">{total} ticket{total !== 1 ? 's' : ''} total</p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Search by subject or user..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6 flex flex-wrap gap-4">
        {/* Role filter */}
        <div>
          <p className="text-xs text-gray-500 mb-1.5 font-medium uppercase tracking-wide">Role</p>
          <div className="flex gap-2 flex-wrap">
            {ROLES.map(r => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                  roleFilter === r ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {r === 'all' ? 'All Roles' : r}
              </button>
            ))}
          </div>
        </div>

        {/* Status filter */}
        <div >
          <p className="text-xs  text-gray-500 mb-1.5 font-medium uppercase tracking-wide">Status</p>
          <div className="flex gap-2 flex-wrap">
            {STATUSES.map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                  statusFilter === s ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {s === 'all' ? 'All Statuses' : s.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Category filter */}
        <div>
          <p className="text-xs text-gray-500 mb-1.5 font-medium uppercase tracking-wide">Category</p>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(c => (
              <button
                key={c}
                onClick={() => setCategoryFilter(c)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                  categoryFilter === c ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {c === 'all' ? 'All Categories' : c.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <FaTicketAlt className="text-4xl mb-3 animate-bounce text-primary" />
            <p className="text-sm">Loading tickets...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <FaTicketAlt className="text-4xl mb-3" />
            <p className="text-sm font-medium">No tickets found</p>
          </div>
        ) : (
          <>
            <div className="overflow-auto">
              <table className="w-full min-w-[900px] text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase text-xs tracking-wide">
                    <th className="px-4 py-3 text-left w-10">#</th>
                    <th className="px-4 py-3 text-left">User</th>
                    <th className="px-4 py-3 text-left">Role</th>
                    <th className="px-4 py-3 text-left">Subject</th>
                    <th className="px-4 py-3 text-left">Category</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Date</th>
                    <th className="px-4 py-3 text-left">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((ticket, idx) => {
                    const statusCfg = STATUS_CONFIG[ticket.status] || STATUS_CONFIG.open;
                    const roleCfg   = ROLE_CONFIG[ticket.role]     || ROLE_CONFIG.customer;
                    return (
                      <tr key={ticket.id} className="hover:bg-blue-50/30 transition-colors">
                        <td className="px-4 py-3 text-gray-400 font-mono text-xs">
                          {(page - 1) * limit + idx + 1}
                        </td>

                        {/* User */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {ticket.user?.profile_photo ? (
                              <img src={ticket.user.profile_photo} alt="" className="w-8 h-8 rounded-full object-cover border border-gray-200" />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                                {ticket.user?.name?.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-gray-800 text-sm">{ticket.user?.name}</p>
                              <p className="text-xs text-gray-400">{ticket.user?.phone_number}</p>
                            </div>
                          </div>
                        </td>

                        {/* Role */}
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${roleCfg.bg} ${roleCfg.text}`}>
                            {roleCfg.icon} {roleCfg.label}
                          </span>
                        </td>

                        {/* Subject */}
                        <td className="px-4 py-3 text-gray-700 max-w-[200px] truncate">{ticket.subject}</td>

                        {/* Category */}
                        <td className="px-4 py-3 text-gray-500 capitalize text-xs">
                          {ticket.category.replace(/_/g, ' ')}
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusCfg.bg} ${statusCfg.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot} ${ticket.status === 'open' ? 'animate-pulse' : ''}`} />
                            {ticket.status.replace('_', ' ')}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="px-4 py-3 text-gray-400 text-xs">
                          {new Date(ticket.createdAt).toLocaleDateString()}
                        </td>

                        {/* Action */}
                        <td className="px-4 py-3">
                          <button
                            onClick={() => router.push(`/support/tickets/${ticket.id}`)}
                            className="flex items-center gap-1.5 bg-primary hover:opacity-90 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-opacity"
                          >
                            <FaEye /> View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-gray-100 bg-gray-50/50">
              <p className="text-xs text-gray-500">
                Showing <span className="font-semibold text-gray-700">{(page - 1) * limit + 1}</span>
                {' – '}
                <span className="font-semibold text-gray-700">{Math.min(page * limit, total)}</span>
                {' of '}
                <span className="font-semibold text-gray-700">{total}</span> results
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="p-2 rounded-lg text-gray-500 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  ‹
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .reduce((acc, p, i, arr) => {
                    if (i > 0 && p - arr[i - 1] > 1) acc.push('...');
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((item, i) =>
                    item === '...' ? (
                      <span key={`e-${i}`} className="px-2 text-gray-400 text-xs">...</span>
                    ) : (
                      <button
                        key={item}
                        onClick={() => handlePageChange(item)}
                        className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                          page === item ? 'bg-primary text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {item}
                      </button>
                    )
                  )}
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className="p-2 rounded-lg text-gray-500 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  ›
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
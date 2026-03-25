'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  FaArrowLeft, FaUser, FaMotorcycle, FaStore,
  FaTicketAlt, FaCheckCircle, FaClock, FaPhone, FaEnvelope
} from 'react-icons/fa';
import api from '../../../../lib/axios';

const STATUS_CONFIG = {
  open:        { bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-400' },
  in_progress: { bg: 'bg-blue-100',   text: 'text-blue-700',   dot: 'bg-blue-400'   },
  resolved:    { bg: 'bg-green-100',  text: 'text-green-700',  dot: 'bg-green-400'  },
  closed:      { bg: 'bg-gray-100',   text: 'text-gray-500',   dot: 'bg-gray-400'   },
};

const ROLE_CONFIG = {
  customer:    { icon: <FaUser />,       label: 'Customer',    color: 'text-blue-500'   },
  vendor:      { icon: <FaStore />,      label: 'Vendor',      color: 'text-orange-500' },
  deliveryman: { icon: <FaMotorcycle />, label: 'Deliveryman', color: 'text-green-500'  },
};

const STATUSES = ['open', 'in_progress', 'resolved', 'closed'];

export default function AdminTicketDetailPage() {
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adminNote, setAdminNote] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [updating, setUpdating] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const { id } = useParams();

  const fetchTicket = async () => {
    try {
      const res = await api.get(`/api/admin/tickets/${id}`);
      setTicket(res.data);
      setAdminNote(res.data.admin_note || '');
      setSelectedStatus(res.data.status);
    } catch (err) {
      console.error('Failed to fetch ticket', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTicket(); }, [id]);

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      await api.put(`/api/admin/tickets/${id}`, {
        status: selectedStatus,
        admin_note: adminNote,
      });
      setSuccess(true);
      await fetchTicket();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to update ticket', err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 min-h-screen bg-gray-50 flex items-center justify-center">
        <FaTicketAlt className="text-4xl animate-bounce text-primary" />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="p-6 min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <p className="text-gray-500 mb-4">Ticket not found</p>
        <button onClick={() => router.back()} className="px-4 py-2 bg-primary text-white rounded-lg text-sm">Go Back</button>
      </div>
    );
  }

  const statusCfg = STATUS_CONFIG[ticket.status] || STATUS_CONFIG.open;
  const roleCfg   = ROLE_CONFIG[ticket.role]     || ROLE_CONFIG.customer;

  return (
    <div className="p-6 min-h-screen bg-gray-50">

      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-gray-200 text-gray-500 transition-colors">
          <FaArrowLeft />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaTicketAlt className="text-primary" /> Ticket #{ticket.id}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {new Date(ticket.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* ── Left: Ticket Details ── */}
        <div className="xl:col-span-2 space-y-6">

          {/* Status + Role */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${statusCfg.bg} ${statusCfg.text}`}>
              <span className={`w-2 h-2 rounded-full ${statusCfg.dot} ${ticket.status === 'open' ? 'animate-pulse' : ''}`} />
              {ticket.status.replace('_', ' ')}
            </span>
            <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${roleCfg.color}`}>
              {roleCfg.icon} {roleCfg.label}
            </span>
            <span className="text-xs text-gray-400 ml-auto capitalize">
              {ticket.category.replace(/_/g, ' ')}
            </span>
          </div>

          {/* Subject + Message */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/60">
              <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Ticket Message</h2>
            </div>
            <div className="p-5">
              <h3 className="text-lg font-bold text-gray-800 mb-3">{ticket.subject}</h3>
              <p className="text-gray-600 leading-relaxed text-sm">{ticket.message}</p>
            </div>
          </div>

          {/* User Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/60">
              <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Submitted By</h2>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-4 mb-4">
                {ticket.user?.profile_photo ? (
                  <img src={ticket.user.profile_photo} alt="" className="w-12 h-12 rounded-full object-cover border border-gray-200" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                    {ticket.user?.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-gray-800">{ticket.user?.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{ticket.role}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
                  <FaPhone className="text-gray-400 text-xs" />
                  {ticket.user?.phone_number || 'N/A'}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
                  <FaEnvelope className="text-gray-400 text-xs" />
                  {ticket.user?.email || 'N/A'}
                </div>
              </div>
            </div>
          </div>

          {/* Existing admin note display */}
          {ticket.admin_note && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-5">
              <p className="text-sm font-bold text-green-700 mb-2 flex items-center gap-2">
                <FaCheckCircle /> Previous Response
              </p>
              <p className="text-sm text-green-800">{ticket.admin_note}</p>
            </div>
          )}
        </div>

        {/* ── Right: Admin Actions ── */}
        <div className="space-y-6">

          {/* Update Status */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/60">
              <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Update Status</h2>
            </div>
            <div className="p-5 space-y-2">
              {STATUSES.map(s => {
                const cfg = STATUS_CONFIG[s];
                return (
                  <button
                    key={s}
                    onClick={() => setSelectedStatus(s)}
                    className={`w-full flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium capitalize transition-all ${
                      selectedStatus === s
                        ? `${cfg.bg} ${cfg.text} border-transparent`
                        : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                    {s.replace('_', ' ')}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Admin Note */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/60">
              <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Response Note</h2>
            </div>
            <div className="p-5">
              <textarea
                value={adminNote}
                onChange={e => setAdminNote(e.target.value)}
                placeholder="Write a response to the user..."
                rows={5}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleUpdate}
            disabled={updating}
            className="w-full bg-primary text-white py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {updating ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <FaCheckCircle />
            )}
            {updating ? 'Saving...' : 'Save Changes'}
          </button>

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
              <p className="text-green-700 text-sm font-medium">✅ Ticket updated successfully</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
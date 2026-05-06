import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { motion } from 'framer-motion';
import { Search, Save, X, Loader2, CheckCircle2, User, Mail, Calendar } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { toast } from '../../hooks/useToast';
import StatusDropdown from '../../components/admin/StatusDropdown';

interface Request {
  _id: string;
  userName: string;
  userEmail: string;
  serviceType: string;
  description: string;
  status: string;
  deadline: string;
  adminNotes?: string;
  createdAt: string;
}

const RequestManagement = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [updating, setUpdating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [notes, setNotes] = useState('');

  const fetchRequests = async () => {
    try {
      const { data } = await api.get('/api/requests/all');
      setRequests(data);
    } catch (err) {
      toast('Failed to load tickets', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await api.put(`/api/requests/${id}`, { status: newStatus });
      toast('Status updated successfully', 'success');
      fetchRequests();
    } catch (err) {
      toast('Failed to update status', 'error');
    }
  };

  const handleFullUpdate = async () => {
    if (!selectedRequest) return;
    setUpdating(true);
    try {
      await api.put(`/api/requests/${selectedRequest._id}`, {
        adminNotes: notes
      });
      toast('Notes updated successfully', 'success');
      setSelectedRequest(null);
      fetchRequests();
    } catch (err) {
      toast('Failed to update ticket', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const filteredRequests = requests.filter(req =>
    req.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.serviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req._id.includes(searchTerm)
  );

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8 lg:p-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2 tracking-tight">Manage Requests</h1>
              <p className="text-slate-500 font-medium">Simplify your workflow with the new 3-stage tracking system.</p>
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredRequests.map((request) => (
              <motion.div
                key={request._id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:shadow-md transition-all group"
              >
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg flex-shrink-0">
                    {request.userName?.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-slate-800">{request.userName}</h3>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">#{request._id.slice(-6)}</span>
                    </div>
                    <div className="flex flex-wrap gap-x-6 gap-y-2">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                        <Tag size={14} className="text-slate-300" /> {request.serviceType}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                        <Calendar size={14} className="text-slate-300" /> Updated: {new Date(request.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <p className="text-slate-500 text-sm mt-3 line-clamp-1 max-w-xl">{request.description}</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 border-t lg:border-t-0 pt-4 lg:pt-0">
                  {request.status === 'Completed' ? (
                    <div className="w-full sm:w-48 px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 text-sm font-bold text-center flex items-center justify-center gap-2">
                      <CheckCircle2 size={16} /> Completed
                    </div>
                  ) : request.status === 'In Progress' ? (
                    <button
                      onClick={() => handleUpdateStatus(request._id, 'Completed')}
                      className="w-full sm:w-48 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100/50 active:scale-95 flex items-center justify-center gap-2"
                    >
                      <Save size={16} /> Mark Completed
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUpdateStatus(request._id, 'In Progress')}
                      className="w-full sm:w-48 px-4 py-2 bg-amber-500 text-white rounded-xl font-bold text-sm hover:bg-amber-600 transition-all shadow-lg shadow-amber-100/50 active:scale-95 flex items-center justify-center gap-2"
                    >
                      <Loader2 size={16} /> Start Work
                    </button>
                  )}


                </div>
              </motion.div>
            ))}

            {filteredRequests.length === 0 && !loading && (
              <div className="py-24 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-slate-800 font-bold mb-1">No requests found</h3>
                <p className="text-slate-400 text-sm font-medium">Try adjusting your search criteria.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Details Modal (for Admin Notes) */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl"
          >
            <div className="p-6 border-b border-slate-50 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">Request Details</h2>
              <button onClick={() => setSelectedRequest(null)} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-all">
                <X size={20} />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">User</label>
                  <p className="font-bold text-slate-800 flex items-center gap-2"><User size={14} className="text-indigo-500" /> {selectedRequest.userName}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Email</label>
                  <p className="font-bold text-slate-800 flex items-center gap-2"><Mail size={14} className="text-indigo-500" /> {selectedRequest.userEmail}</p>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Description</label>
                <p className="text-slate-600 text-sm leading-relaxed">{selectedRequest.description}</p>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1 ml-1">Admin Feedback / Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium text-slate-700 min-h-[150px] text-sm"
                  placeholder="Share updates or feedback with the user..."
                />
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="flex-1 py-3 bg-slate-50 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-100 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFullUpdate}
                  className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 active:scale-95 flex items-center justify-center gap-2"
                >
                  {updating ? <Loader2 className="animate-spin" size={18} /> : <><Save size={18} /> Save Changes</>}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

const Tag = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l4.58-4.58c.94-.94.94-2.48 0-3.42L12 2Z"></path><path d="M7 7h.01"></path></svg>
);

export default RequestManagement;

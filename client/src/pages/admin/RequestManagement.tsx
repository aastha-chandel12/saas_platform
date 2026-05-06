import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { motion } from 'framer-motion';
import { Search, Save, X, Loader2, CheckCircle2, User, Mail, Calendar, Tag as TagIcon, ExternalLink } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { toast } from '../../hooks/useToast';

interface Request {
  _id: string;
  userName: string;
  userEmail: string;
  serviceType: string;
  description: string;
  status: string;
  deadline: string;
  adminNotes?: string;
  attachments?: { name: string; url: string }[];
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
      toast('Status synchronized', 'success');
      fetchRequests();
    } catch (err) {
      toast('Provisioning failed', 'error');
    }
  };

  const handleFullUpdate = async () => {
    if (!selectedRequest) return;
    setUpdating(true);
    try {
      await api.put(`/api/requests/${selectedRequest._id}`, {
        adminNotes: notes
      });
      toast('Internal notes saved', 'success');
      setSelectedRequest(null);
      fetchRequests();
    } catch (err) {
      toast('Storage error', 'error');
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
    <div className="flex flex-col lg:flex-row bg-[#F8FAFC] min-h-screen font-sans">
      <AdminSidebar />
      <main className="flex-1 p-4 lg:p-10 pt-20 lg:pt-10">
        <div className="max-w-6xl mx-auto">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Request Queue</h1>
              <p className="text-[13px] font-medium text-slate-500">Manage operational workflow and service delivery.</p>
            </div>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input
                type="text"
                placeholder="Search across all fields..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 transition-all shadow-sm"
              />
            </div>
          </header>

          <div className="space-y-3">
            {filteredRequests.map((request) => (
              <motion.div
                key={request._id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:border-slate-300 transition-all group"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center font-black text-xs flex-shrink-0 shadow-sm">
                    {request.userName?.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-[13px] font-black text-slate-900 truncate">{request.userName}</h3>
                      <div className="px-2 py-0.5 bg-slate-100 rounded text-[9px] font-bold text-slate-500 uppercase tracking-tight flex-shrink-0">
                        ID-{request._id.slice(-4)}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1">
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-bold truncate">
                        <TagIcon size={12} className="text-slate-300 flex-shrink-0" /> {request.serviceType}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-bold flex-shrink-0">
                        <Calendar size={12} className="text-slate-300 flex-shrink-0" /> {new Date(request.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between lg:justify-end gap-2 lg:pl-4 lg:border-l border-slate-100 pt-3 lg:pt-0 border-t lg:border-t-0">
                  <div className="flex-1 lg:flex-none">
                    {request.status === 'Completed' ? (
                      <div className="w-full lg:w-36 px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 text-[11px] font-black uppercase tracking-wider text-center flex items-center justify-center gap-2">
                        <CheckCircle2 size={12} /> Verified
                      </div>
                    ) : request.status === 'In Progress' ? (
                      <button
                        onClick={() => handleUpdateStatus(request._id, 'Completed')}
                        className="w-full lg:w-36 px-3 py-2 bg-slate-900 text-white rounded-lg font-black text-[11px] uppercase tracking-wider hover:bg-slate-800 transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2"
                      >
                        <Save size={12} /> Finalize
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUpdateStatus(request._id, 'In Progress')}
                        className="w-full lg:w-36 px-3 py-2 bg-indigo-600 text-white rounded-lg font-black text-[11px] uppercase tracking-wider hover:bg-indigo-700 transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2"
                      >
                        <Loader2 size={12} className="animate-spin" /> Provision
                      </button>
                    )}
                  </div>

                  {/* <button
                    onClick={() => { 
                      setSelectedRequest(request); 
                      setNotes(request.adminNotes || ''); 
                    }}
                    className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all flex-shrink-0"
                    title="Audit Logs"
                  >
                    <ExternalLink size={16} />
                  </button> */}
                </div>
              </motion.div>
            ))}

            {filteredRequests.length === 0 && !loading && (
              <div className="py-24 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300 mb-4 border border-slate-100">
                  <Search size={20} />
                </div>
                <h3 className="text-slate-900 font-black text-sm uppercase tracking-tight">Null Result</h3>
                <p className="text-slate-400 text-xs font-medium px-4">No matching requests found in the current buffer.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Audit Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]"
          >
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-xs font-black text-slate-900 uppercase tracking-widest">Administrative Audit</h2>
              <button onClick={() => setSelectedRequest(null)} className="p-1.5 text-slate-400 hover:text-slate-900 rounded-lg transition-all">
                <X size={16} />
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Subject</label>
                  <p className="text-xs font-bold text-slate-800 flex items-center gap-2 truncate"><User size={12} className="text-slate-400" /> {selectedRequest.userName}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Identifier</label>
                  <p className="text-xs font-bold text-slate-800 flex items-center gap-2 truncate"><Mail size={12} className="text-slate-400" /> {selectedRequest.userEmail}</p>
                </div>
              </div>

              <div>
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Requirement Manifesto</label>
                <div className="p-4 bg-slate-900 text-slate-300 rounded-xl text-[13px] leading-relaxed font-medium shadow-inner overflow-hidden">
                  {selectedRequest.description}
                </div>
              </div>

              {/* Technical Assets / Attachments Section */}
              {selectedRequest.attachments && selectedRequest.attachments.length > 0 && (
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Technical Assets</label>
                  <div className="grid grid-cols-1 gap-2">
                    {selectedRequest.attachments.map((file, idx) => (
                      <a
                        key={idx}
                        href={`${api.defaults.baseURL}${file.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                            <TagIcon size={14} />
                          </div>
                          <span className="text-xs font-bold text-slate-700">{file.name}</span>
                        </div>
                        <ExternalLink size={14} className="text-slate-300 group-hover:text-slate-900 transition-colors" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1 ml-1">Internal Provisions / Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 outline-none transition-all font-bold text-slate-700 min-h-[120px] text-xs leading-relaxed"
                  placeholder="Append internal logs or deployment updates..."
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="order-2 sm:order-1 flex-1 py-3 text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-all"
                >
                  Dismiss
                </button>
                <button
                  onClick={handleFullUpdate}
                  className="order-1 sm:order-2 flex-1 py-3 bg-slate-900 text-white rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                >
                  {updating ? <Loader2 className="animate-spin" size={14} /> : <><Save size={14} /> Commit Changes</>}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default RequestManagement;

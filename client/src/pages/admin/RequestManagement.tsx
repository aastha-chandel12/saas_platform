import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { motion } from 'framer-motion';
import { Search, Save, X, Loader2, CheckCircle2 } from 'lucide-react';
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
  createdAt: string;
}

const steps = ['Request Submitted', 'Work Started', 'Under Review', 'Completed'];

const RequestManagement = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [updating, setUpdating] = useState(false);

  const [updateStatus, setUpdateStatus] = useState('');
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

  const handleUpdate = async () => {
    if (!selectedRequest) return;
    setUpdating(true);

    try {
      await api.put(`/api/requests/${selectedRequest._id}`, {
        status: updateStatus,
        adminNotes: notes
      });
      toast('Ticket updated successfully', 'success');
      setSelectedRequest(null);
      fetchRequests();
    } catch (err) {
      toast('Failed to update ticket', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Request Submitted': return 'bg-slate-50 text-slate-600 border-slate-100';
      case 'Work Started': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      case 'Under Review': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Completed': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8 lg:p-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2 tracking-tight">Service Requests</h1>
              <p className="text-slate-500 font-medium">Manage and process incoming service tickets.</p>
            </div>

          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">User</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Service</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Deadline</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {requests.map((request) => (
                    <tr key={request._id} className="hover:bg-slate-50/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                            {request.userName?.charAt(0)}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-800">{request.userName}</div>
                            <div className="text-[10px] text-slate-400">{request.userEmail}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-slate-700">{request.serviceType}</div>
                        <div className="text-[10px] text-slate-400 line-clamp-1 max-w-[200px]">{request.description}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusStyle(request.status)}`}>
                          {request.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-slate-700">{new Date(request.deadline).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => { setSelectedRequest(request); setUpdateStatus(request.status); setNotes(request.adminNotes || ''); }}
                          className="px-4 py-2 bg-slate-50 text-slate-600 hover:bg-indigo-600 hover:text-white rounded-lg font-bold text-xs transition-all active:scale-95 border border-slate-100 group-hover:border-indigo-200"
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {requests.length === 0 && !loading && (
              <div className="py-32 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-slate-800 font-bold mb-1">No service requests</h3>
                <p className="text-slate-400 text-sm font-medium">New tickets will appear here once users submit them.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Update Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-100"
          >
            <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Update Management</h2>
                <p className="text-xs text-slate-400 font-medium">#{selectedRequest._id}</p>
              </div>
              <button onClick={() => setSelectedRequest(null)} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-all">
                <X size={20} />
              </button>
            </div>

            <div className="p-8">
              <div className="mb-10">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-6">Service Timeline Workflow</label>
                <div className="relative">
                  <div className="absolute top-4 left-0 w-full h-0.5 bg-slate-100" />
                  <div className="relative flex justify-between">
                    {steps.map((step, idx) => {
                      const currentStepIdx = steps.indexOf(selectedRequest.status);
                      const isNext = idx === currentStepIdx + 1;
                      const isCompleted = idx < currentStepIdx;
                      const isClickable = step === selectedRequest.status || isNext;

                      return (
                        <button
                          key={step}
                          type="button"
                          disabled={!isClickable}
                          onClick={() => setUpdateStatus(step)}
                          className={`group flex flex-col items-center gap-3 relative z-10 outline-none transition-all ${!isClickable ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all border-2 ${updateStatus === step
                              ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                              : isCompleted
                                ? 'bg-emerald-500 border-emerald-500 text-white'
                                : 'bg-white border-slate-200 text-slate-300 group-hover:border-indigo-400'
                            }`}>
                            {isCompleted ? <CheckCircle2 size={16} /> : <span className="text-[10px] font-bold">{idx + 1}</span>}
                          </div>
                          <span className={`text-[10px] font-bold uppercase tracking-wider ${updateStatus === step ? 'text-indigo-600' : 'text-slate-400'}`}>
                            {step}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Admin Notes</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium text-slate-700 min-h-[100px] text-sm"
                    placeholder="Add progress details, next steps, or internal notes..."
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setSelectedRequest(null)}
                    className="flex-1 py-3 bg-slate-50 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-100 transition-all active:scale-95"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdate}
                    className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                  >
                    {updating ? <Loader2 className="animate-spin" size={18} /> : <><Save size={18} /> Update Status</>}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default RequestManagement;

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Calendar, ShieldCheck, MessageSquare, Loader2, Hash, ExternalLink, Clock } from 'lucide-react';
import Timeline from '../components/requests/Timeline';

interface ServiceRequest {
  _id: string;
  serviceType: string;
  description: string;
  status: string;
  deadline: string;
  createdAt: string;
  adminNotes?: string;
}

const RequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState<ServiceRequest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const { data } = await api.get(`/api/requests`);
        const found = data.find((r: any) => r._id === id);
        setRequest(found);
      } catch (err) {
        console.error('Failed to fetch request');
      } finally {
        setLoading(false);
      }
    };
    fetchRequest();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <Loader2 className="animate-spin" size={32} strokeWidth={2.5} />
          <p className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-500">Querying Ledger...</p>
        </div>
      </div>
    );
  }

  if (!request) return <div className="text-center py-20 text-2xl font-black text-slate-900">404: Request Context Invalid</div>;

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-10 px-4 font-sans">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <button
              onClick={() => navigate('/requests')}
              className="flex items-center gap-2 text-slate-400 hover:text-slate-900 mb-4 transition-all font-black text-[10px] uppercase tracking-[0.2em]"
            >
              <ArrowLeft size={14} strokeWidth={2.5} /> Back to Repository
            </button>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">{request.serviceType}</h1>
              <div className="px-2 py-1 bg-slate-900 text-white rounded font-black text-[9px] uppercase tracking-widest shadow-sm">
                Ticket #{request._id.slice(-6).toUpperCase()}
              </div>
            </div>
            <p className="text-[13px] font-medium text-slate-500">Documenting service delivery and operational milestones.</p>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[11px] font-black text-slate-700 uppercase tracking-widest">Live Status: {request.status}</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-slate-200 p-6 lg:p-8 shadow-sm"
            >
              <div className="space-y-6">
                <div>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <ShieldCheck size={14} className="text-indigo-500" /> Service Manifesto
                  </h3>
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-6 text-[15px] text-slate-700 leading-relaxed font-medium">
                    {request.description}
                  </div>
                </div>

                {request.adminNotes && (
                  <div className="pt-6 border-t border-slate-100">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                      <MessageSquare size={14} className="text-indigo-500" /> Internal Provisions
                    </h3>
                    <div className="bg-indigo-50/50 border border-indigo-100/50 rounded-xl p-6 text-[14px] text-slate-800 leading-relaxed font-bold italic">
                      "{request.adminNotes}"
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl border border-slate-200 p-6 lg:p-8 shadow-sm"
            >
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-10">Deployment Timeline</h3>
              <Timeline status={request.status} />
            </motion.div>
          </div>

          <aside className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-slate-900 rounded-2xl p-6 text-white shadow-2xl shadow-slate-200"
            >
              <h3 className="text-[10px] font-black text-slate-400 mb-6 uppercase tracking-[0.2em]">Metadata</h3>
              <div className="space-y-5">
                <div className="flex justify-between items-center py-3 border-b border-white/10">
                  <span className="text-slate-400 font-bold text-[11px] uppercase">State</span>
                  <span className="font-black text-indigo-400 text-xs tracking-wide">{request.status}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-white/10">
                  <span className="text-slate-400 font-bold text-[11px] uppercase">Deadline</span>
                  <span className="text-white font-black text-xs">{new Date(request.deadline).toLocaleDateString()}</span>
                </div>

                <div className="pt-4">
                  <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4">Assigned Resource</h4>
                  <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center font-black text-xs">A1</div>
                      <div className="min-w-0">
                        <div className="text-[11px] font-black text-white truncate">Operational Lead</div>
                        <div className="text-[10px] text-slate-500 font-bold">Node #42</div>
                      </div>
                    </div>
                    <a
                      href={`https://wa.me/911234567890?text=${encodeURIComponent(`Query: Ticket #${request._id.slice(-6).toUpperCase()}`)}`}
                      className="p-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-400 transition-all shadow-lg"
                    >
                      <MessageSquare size={14} strokeWidth={2.5} />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

          </aside>
        </div>
      </div>
    </div>
  );
};

export default RequestDetail;

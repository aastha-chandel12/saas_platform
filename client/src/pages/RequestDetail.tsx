import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Calendar, ShieldAlert, MessageCircle, Loader2 } from 'lucide-react';
import Timeline from '../components/requests/Timeline';

interface ServiceRequest {
  _id: string;
  serviceType: string;
  description: string;
  status: string;
  deadline: string;
  createdAt: string;
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
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-slate-300" size={40} />
      </div>
    );
  }
  
  if (!request) return <div className="text-center py-20 text-2xl font-bold">Request not found</div>;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-400 hover:text-slate-800 mb-8 transition-colors font-bold text-xs uppercase tracking-widest"
      >
        <ArrowLeft size={16} /> Back to My Requests
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 space-y-8"
        >
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Request ID: #{request._id.slice(-6)}</span>
              <span className="px-2.5 py-0.5 bg-indigo-50 border border-indigo-100 rounded-full text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                {request.serviceType}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight mb-6">{request.serviceType}</h1>
            
            <div className="space-y-4 pt-6 border-t border-slate-50">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Requirement Details</h3>
              <p className="text-lg text-slate-700 leading-relaxed font-medium">
                {request.description}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <h3 className="text-xs font-bold text-slate-900 mb-8 uppercase tracking-widest">Service Timeline</h3>
            <Timeline status={request.status} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl shadow-indigo-100/20">
            <h3 className="text-xs font-bold text-slate-400 mb-6 flex items-center gap-2 uppercase tracking-widest">
              <ShieldAlert className="text-indigo-400" size={16} /> Information
            </h3>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-medium text-sm">Status</span>
                <span className="font-bold text-white text-sm bg-indigo-500/20 px-3 py-1 rounded-lg">
                  {request.status}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-medium text-sm">Deadline</span>
                <span className="text-white font-bold text-sm">{new Date(request.deadline).toLocaleDateString()}</span>
              </div>
              <div className="pt-6 border-t border-slate-800">
                <span className="text-slate-400 font-medium text-xs uppercase tracking-widest">Support Agent Assigned</span>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-indigo-400 border border-slate-700">
                      <User size={18} />
                    </div>
                    <div>
                      <div className="text-white font-bold text-sm">Support #42</div>
                      <div className="text-xs text-slate-500">Online</div>
                    </div>
                  </div>
                  <a 
                    href={`https://wa.me/911234567890?text=${encodeURIComponent(`Hello, I have a query regarding my request #${request._id.slice(-6)} (${request.serviceType}).`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20"
                  >
                    <MessageCircle size={18} />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
             <div className="flex items-start gap-4">
                <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                   <Calendar size={20} />
                </div>
                <div>
                   <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Submitted On</div>
                   <div className="text-lg font-bold text-slate-800">{new Date(request.createdAt).toLocaleDateString()}</div>
                </div>
             </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RequestDetail;

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { motion } from 'framer-motion';
import { Plus, Search, Clock, CheckCircle2, AlertCircle, ChevronRight, Filter } from 'lucide-react';

interface ServiceRequest {
  _id: string;
  serviceType: string;
  description: string;
  status: string;
  deadline: string;
  createdAt: string;
}

const MyRequests = () => {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const { data } = await api.get('/api/requests');
        setRequests(data);
      } catch (err) {
        console.error('Failed to fetch requests');
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Request Submitted': return 'bg-slate-50 text-slate-600 border-slate-100';
      case 'Work Started': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      case 'Under Review': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Completed': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Request Submitted': return <Plus size={14} />;
      case 'Work Started': return <Clock size={14} />;
      case 'Under Review': return <Search size={14} />;
      case 'Completed': return <CheckCircle2 size={14} />;
      default: return null;
    }
  };

  if (loading) return null;

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2 tracking-tight">My Requests</h1>
          <p className="text-slate-500 font-medium">Track and manage your service tickets in real-time.</p>
        </div>
        <button 
          onClick={() => navigate('/services')}
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-md flex items-center gap-2 active:scale-95"
        >
          <Plus size={18} /> New Request
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-md overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search by description or ID..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-slate-600 font-bold text-sm hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-100">
            <Filter size={16} /> Filter
          </button>
        </div>

        <div className="divide-y divide-slate-50">
          {requests.map((request) => (
            <div 
              key={request._id}
              onClick={() => navigate(`/request/${request._id}`)}
              className="p-6 hover:bg-slate-50/50 transition-all cursor-pointer group flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">#{request._id.slice(-6)}</span>
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusStyle(request.status)}`}>
                    {getStatusIcon(request.status)}
                    {request.status}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors">{request.serviceType}</h3>
                  <p className="text-slate-500 text-sm font-medium line-clamp-1">{request.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="hidden lg:block text-right">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Deadline</div>
                  <div className="font-bold text-indigo-600 text-sm">{new Date(request.deadline).toLocaleDateString()}</div>
                </div>
                <div className="hidden lg:block text-right">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Created</div>
                  <div className="font-semibold text-slate-600 text-sm">{new Date(request.createdAt).toLocaleDateString()}</div>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg text-slate-300 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                  <ChevronRight size={20} />
                </div>
              </div>
            </div>
          ))}
          {requests.length === 0 && (
            <div className="py-32 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-slate-800 font-bold mb-1">No requests yet</h3>
              <p className="text-slate-400 text-sm font-medium">You haven't submitted any service requests yet.</p>
              <button 
                onClick={() => navigate('/services')}
                className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold text-sm hover:bg-indigo-700 transition-all shadow-md active:scale-95"
              >
                Browse Services
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyRequests;

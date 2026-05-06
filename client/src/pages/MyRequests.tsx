import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { motion } from 'framer-motion';
import { Plus, Search, Loader2, Inbox, ArrowLeft } from 'lucide-react';
import RequestCard from '../components/requests/RequestCard';

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
  const [searchTerm, setSearchTerm] = useState('');
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

  const filteredRequests = requests.filter(req => 
    req.serviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req._id.includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <Loader2 className="animate-spin" size={32} strokeWidth={2.5} />
          <p className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-500">Syncing Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <button onClick={() => navigate('/')} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 transition-all">
                <ArrowLeft size={16} />
              </button>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">User Dashboard</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Active Requests</h1>
            <p className="text-[13px] font-medium text-slate-500">Real-time tracking of your service tickets and deployment status.</p>
          </div>
          <button 
            onClick={() => navigate('/services')}
            className="w-full md:w-auto px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2 active:scale-95"
          >
            <Plus size={16} /> New Provision
          </button>
        </header>

        <div className="space-y-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input 
              type="text" 
              placeholder="Search across active buffer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 transition-all shadow-sm"
            />
          </div>

          {filteredRequests.length > 0 ? (
            <div className="grid grid-cols-1 gap-3">
              {filteredRequests.map((request, idx) => (
                <motion.div
                  key={request._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.03 }}
                >
                  <RequestCard request={request} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="py-24 flex flex-col items-center justify-center text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300 mb-5 border border-slate-100">
                <Inbox size={24} />
              </div>
              <h3 className="text-slate-900 font-black text-sm uppercase tracking-tight mb-1">Queue Empty</h3>
              <p className="text-slate-400 text-xs font-medium max-w-xs mx-auto leading-relaxed">
                {searchTerm ? `No matches found for "${searchTerm}" in our current database records.` : "You haven't initiated any service provisions yet. Start your first one today."}
              </p>
              {!searchTerm && (
                <button 
                  onClick={() => navigate('/services')}
                  className="mt-6 px-6 py-2.5 bg-slate-100 text-slate-900 rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all"
                >
                  Initiate First Request
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyRequests;

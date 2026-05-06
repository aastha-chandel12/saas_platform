import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { motion } from 'framer-motion';
import { Plus, Search, Loader2, Inbox } from 'lucide-react';
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
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-slate-400">
          <Loader2 className="animate-spin" size={40} />
          <p className="font-bold text-sm uppercase tracking-widest">Loading Requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
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

      <div className="space-y-6">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search your requests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm"
          />
        </div>

        {filteredRequests.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {filteredRequests.map((request, idx) => (
              <motion.div
                key={request._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <RequestCard request={request} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-32 flex flex-col items-center justify-center text-center bg-white rounded-3xl border border-slate-100 shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6">
              <Inbox size={40} />
            </div>
            <h3 className="text-slate-800 text-xl font-bold mb-2">No requests found</h3>
            <p className="text-slate-500 text-sm font-medium max-w-xs mx-auto">
              {searchTerm ? `We couldn't find any requests matching "${searchTerm}"` : "You haven't submitted any service requests yet."}
            </p>
            {!searchTerm && (
              <button 
                onClick={() => navigate('/services')}
                className="mt-8 px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-md"
              >
                Get Started
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRequests;

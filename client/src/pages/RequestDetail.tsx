import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, CheckCircle2, User, Calendar, Tag, ShieldAlert, MessageCircle } from 'lucide-react';

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

  if (loading) return null;
  if (!request) return <div className="text-center py-20 text-2xl font-bold">Request not found</div>;

  const steps = ['Request Submitted', 'Work Started', 'Under Review', 'Completed'];
  const currentStepIndex = steps.indexOf(request.status);

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-400 hover:text-slate-800 mb-6 transition-colors font-bold text-sm"
      >
        <ArrowLeft size={18} /> Back to My Requests
      </button>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl border border-slate-100 shadow-md overflow-hidden"
      >
        {/* Header Section */}
        <div className="p-8 bg-slate-50/50 border-b border-slate-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Request ID: #{request._id.slice(-6)}</span>
                <span className="px-2.5 py-0.5 bg-white border border-slate-200 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  {request.serviceType}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-slate-800 tracking-tight">{request.serviceType}</h1>
            </div>
            <div className="flex items-center gap-3">
               <div className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg font-bold text-xs border border-indigo-100 shadow-sm flex items-center gap-2">
                 <Calendar size={14} /> {new Date(request.deadline).toLocaleDateString()}
               </div>
            </div>
          </div>
        </div>

        {/* Progress Tracker Section */}
        <div className="px-8 py-10">
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2" />
            <div 
              className="absolute top-1/2 left-0 h-0.5 bg-indigo-600 -translate-y-1/2 transition-all duration-700"
              style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
            />
            <div className="relative flex justify-between">
              {steps.map((step, idx) => (
                <div key={step} className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 transition-colors duration-500 text-xs border-2 ${
                    idx <= currentStepIndex ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm' : 'bg-white border-slate-200 text-slate-300'
                  }`}>
                    {idx < currentStepIndex ? <CheckCircle2 size={16} /> : <span className="font-bold">{idx + 1}</span>}
                  </div>
                  <span className={`mt-3 font-bold text-[10px] uppercase tracking-wider ${
                    idx <= currentStepIndex ? 'text-indigo-600' : 'text-slate-400'
                  }`}>
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-slate-50">
          <div className="md:col-span-2 space-y-6">
            <div className="space-y-2">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Requirement Details</h3>
              <p className="text-lg text-slate-700 leading-relaxed font-medium">
                {request.description}
              </p>
            </div>
            <div className="flex flex-wrap gap-8 pt-4 border-t border-slate-50">
              <InfoItem icon={<Calendar size={16} />} label="Submitted" value={new Date(request.createdAt).toLocaleDateString()} />
              <InfoItem icon={<Tag size={16} />} label="Service" value={request.serviceType} />
            </div>
          </div>

          <div className="bg-slate-50/50 rounded-xl p-6 border border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 mb-4 flex items-center gap-2">
              <ShieldAlert className="text-indigo-600" size={16} /> Information
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium text-sm">Status</span>
                <span className="font-bold text-indigo-600 text-sm">
                  {request.status}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium text-sm">Deadline</span>
                <span className="text-slate-700 font-bold text-sm">{new Date(request.deadline).toLocaleDateString()}</span>
              </div>
              <div className="pt-4 border-t border-slate-100">
                <span className="text-slate-500 font-medium text-xs">Support Agent Assigned</span>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                      <User size={12} />
                    </div>
                    <span className="text-slate-700 font-bold text-sm">Support #42</span>
                  </div>
                  <a 
                    href={`https://wa.me/911234567890?text=${encodeURIComponent(`Hello, I have a query regarding my request #${request._id.slice(-6)} (${request.serviceType}).`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-all shadow-sm border border-emerald-100"
                    title="Chat on WhatsApp"
                  >
                    <MessageCircle size={16} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const InfoItem = ({ icon, label, value }: { icon: any, label: string, value: string }) => (
  <div className="flex items-start gap-3">
    <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 text-indigo-600">
      {icon}
    </div>
    <div>
      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</div>
      <div className="font-bold text-slate-700 text-lg">{value}</div>
    </div>
  </div>
);


export default RequestDetail;

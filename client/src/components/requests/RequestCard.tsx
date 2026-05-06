import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, ChevronRight, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface RequestCardProps {
  request: {
    _id: string;
    serviceType: string;
    status: string;
    updatedAt?: string;
    createdAt: string;
  };
}

const RequestCard: React.FC<RequestCardProps> = ({ request }) => {
  const navigate = useNavigate();

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'Requested':
      case 'Request Submitted':
        return { label: 'Requested', color: 'bg-slate-100 text-slate-600 border-slate-200', icon: <AlertCircle size={14} /> };
      case 'In Progress':
      case 'Work Started':
      case 'Under Review':
        return { label: 'In Progress', color: 'bg-amber-100 text-amber-600 border-amber-200', icon: <Clock size={14} /> };
      case 'Completed':
        return { label: 'Completed', color: 'bg-green-100 text-green-600 border-green-200', icon: <CheckCircle2 size={14} /> };
      default:
        return { label: status, color: 'bg-slate-100 text-slate-600 border-slate-200', icon: null };
    }
  };

  const config = getStatusConfig(request.status);
  const date = request.updatedAt || request.createdAt;

  return (
    <div 
      onClick={() => navigate(`/request/${request._id}`)}
      className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all cursor-pointer group flex items-center justify-between gap-4"
    >
      <div className="flex-1 space-y-3">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">#{request._id.slice(-6)}</span>
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${config.color}`}>
            {config.icon}
            {config.label}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
            {request.serviceType}
          </h3>
          <div className="flex items-center gap-2 mt-1 text-slate-400">
            <Calendar size={14} />
            <span className="text-xs font-medium">Last updated: {new Date(date).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="p-2 bg-slate-50 rounded-xl text-slate-300 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
        <ChevronRight size={20} />
      </div>
    </div>
  );
};

export default RequestCard;

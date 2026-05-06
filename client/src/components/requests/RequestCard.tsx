import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, ChevronRight, Clock, CheckCircle2, AlertCircle, Hash } from 'lucide-react';

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
        return { label: 'Requested', color: 'bg-slate-50 text-slate-500 border-slate-100', icon: <AlertCircle size={12} /> };
      case 'In Progress':
      case 'Work Started':
      case 'Under Review':
        return { label: 'In Progress', color: 'bg-amber-50 text-amber-600 border-amber-100', icon: <Clock size={12} /> };
      case 'Completed':
        return { label: 'Completed', color: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: <CheckCircle2 size={12} /> };
      default:
        return { label: status, color: 'bg-slate-50 text-slate-500 border-slate-100', icon: null };
    }
  };

  const config = getStatusConfig(request.status);
  const date = request.updatedAt || request.createdAt;

  return (
    <div 
      onClick={() => navigate(`/request/${request._id}`)}
      className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-900/10 transition-all cursor-pointer group flex items-center justify-between gap-4"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2.5 mb-2">
          <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border ${config.color}`}>
            {config.icon}
            {config.label}
          </div>
          <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
            <Hash size={10} />
            {request._id.slice(-6).toUpperCase()}
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
            {request.serviceType}
          </h3>
          <div className="flex items-center gap-1.5 mt-1 text-slate-400">
            <Calendar size={12} className="text-slate-300" />
            <span className="text-[11px] font-bold">Modified {new Date(date).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="w-8 h-8 flex items-center justify-center bg-slate-50 rounded-lg text-slate-300 group-hover:bg-slate-900 group-hover:text-white transition-all shadow-inner">
        <ChevronRight size={16} />
      </div>
    </div>
  );
};

export default RequestCard;

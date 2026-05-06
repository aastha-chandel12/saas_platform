import React from 'react';
import { Loader2 } from 'lucide-react';

interface StatusDropdownProps {
  currentStatus: string;
  onStatusChange: (newStatus: string) => void;
  loading?: boolean;
}

const statuses = ['Requested', 'In Progress', 'Completed'];

const StatusDropdown: React.FC<StatusDropdownProps> = ({ currentStatus, onStatusChange, loading }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Requested': return 'text-slate-600 bg-slate-50 border-slate-200';
      case 'In Progress': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'Completed': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="relative inline-block w-full sm:w-48">
      <select
        value={currentStatus}
        disabled={loading}
        onChange={(e) => onStatusChange(e.target.value)}
        className={`w-full appearance-none px-4 py-2 rounded-xl border text-sm font-bold cursor-pointer transition-all outline-none focus:ring-2 focus:ring-indigo-500/20 ${getStatusColor(currentStatus)}`}
      >
        {statuses.map((status) => (
          <option key={status} value={status} className="bg-white text-slate-800">
            {status}
          </option>
        ))}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-current opacity-50">
        {loading ? <Loader2 size={14} className="animate-spin" /> : (
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
    </div>
  );
};

export default StatusDropdown;

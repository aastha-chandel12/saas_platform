import React from 'react';

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStyles = () => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'In Progress':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Resolved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Cancelled':
        return 'bg-slate-50 text-slate-500 border-slate-100';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStyles()}`}>
      {status}
    </span>
  );
};

export default StatusBadge;

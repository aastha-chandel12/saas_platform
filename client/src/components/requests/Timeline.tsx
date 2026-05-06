import React from 'react';
import { CheckCircle2, Circle, Clock, Send, ShieldCheck, Flag } from 'lucide-react';

interface TimelineProps {
  status: string;
}

const steps = [
  { title: 'Initialization', description: 'Request received and queued for processing.', icon: <Send size={14} /> },
  { title: 'Provisioning', description: 'Technical resources assigned and work in progress.', icon: <Clock size={14} /> },
  { title: 'Verification', description: 'Quality assurance and deployment validation.', icon: <ShieldCheck size={14} /> },
  { title: 'Finalized', description: 'Operational handover complete.', icon: <Flag size={14} /> },
];

const Timeline: React.FC<TimelineProps> = ({ status }) => {
  const getCompletionStatus = (idx: number) => {
    if (status === 'Completed') return true;
    if (status === 'In Progress' && idx <= 1) return true;
    if (status === 'Requested' && idx <= 0) return true;
    return false;
  };

  return (
    <div className="space-y-10 relative">
      {steps.map((step, idx) => {
        const isCompleted = getCompletionStatus(idx);
        const isCurrent = (status === 'In Progress' && idx === 1) || (status === 'Requested' && idx === 0);
        const isLast = idx === steps.length - 1;

        return (
          <div key={idx} className="relative flex gap-5">
            {!isLast && (
              <div 
                className={`absolute left-[13px] top-[30px] w-[2px] h-[calc(100%+40px)] ${
                  isCompleted && getCompletionStatus(idx + 1) ? 'bg-slate-900' : 'bg-slate-100'
                }`}
              />
            )}
            
            <div className="relative z-10">
              <div className={`w-[28px] h-[28px] rounded-lg border-2 flex items-center justify-center transition-all shadow-sm ${
                isCompleted 
                  ? 'bg-slate-900 border-slate-900 text-white' 
                  : isCurrent 
                    ? 'bg-white border-slate-900 text-slate-900 animate-pulse'
                    : 'bg-white border-slate-100 text-slate-200'
              }`}>
                {isCompleted ? <CheckCircle2 size={14} strokeWidth={3} /> : step.icon}
              </div>
            </div>

            <div className="flex flex-col">
              <h3 className={`text-[11px] font-black uppercase tracking-[0.15em] ${isCompleted || isCurrent ? 'text-slate-900' : 'text-slate-400'}`}>
                {step.title}
                {isCurrent && <span className="ml-2 text-[9px] text-indigo-500 font-black animate-pulse">• LIVE</span>}
              </h3>
              <p className="text-[12px] text-slate-500 mt-1.5 font-medium leading-relaxed max-w-sm">
                {step.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Timeline;

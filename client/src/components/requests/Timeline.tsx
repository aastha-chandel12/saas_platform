import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

interface TimelineProps {
  status: string;
}

const steps = [
  { title: 'Request Submitted', description: 'Your request has been received.' },
  { title: 'Work Started', description: 'Our team has begun working on your service.' },
  { title: 'Under Review', description: 'The work is being reviewed for quality.' },
  { title: 'Completed', description: 'Your service request is finished.' },
];

const Timeline: React.FC<TimelineProps> = ({ status }) => {
  // Mapping logic:
  // IF Requested: Step 1 completed
  // IF In Progress: Step 1 + Step 2 completed
  // IF Completed: All steps completed
  
  const getCompletionStatus = (idx: number) => {
    if (status === 'Completed') return true;
    if (status === 'In Progress' && idx <= 1) return true;
    if (status === 'Requested' && idx <= 0) return true;
    return false;
  };

  return (
    <div className="space-y-8">
      {steps.map((step, idx) => {
        const isCompleted = getCompletionStatus(idx);
        const isLast = idx === steps.length - 1;

        return (
          <div key={idx} className="relative flex gap-4">
            {!isLast && (
              <div 
                className={`absolute left-4 top-8 w-0.5 h-full -translate-x-1/2 ${
                  isCompleted && getCompletionStatus(idx + 1) ? 'bg-green-500' : 'bg-slate-100'
                }`}
              />
            )}
            
            <div className="relative z-10">
              {isCompleted ? (
                <div className="bg-white rounded-full">
                  <CheckCircle2 className="text-green-500 bg-white rounded-full" size={32} />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full border-2 border-slate-200 bg-white flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-slate-200" />
                </div>
              )}
            </div>

            <div className="flex flex-col pt-1">
              <h3 className={`text-sm font-bold uppercase tracking-wider ${isCompleted ? 'text-slate-800' : 'text-slate-400'}`}>
                {step.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">
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

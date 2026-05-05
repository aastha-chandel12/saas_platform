import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const PageLoader = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="relative">
        {/* Decorative background circle */}
        <div className="absolute inset-0 scale-150 blur-2xl bg-indigo-500/10 rounded-full animate-pulse" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100 flex flex-col items-center gap-4 relative z-10"
        >
          <div className="relative">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" strokeWidth={3} />
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border-2 border-indigo-100 rounded-full border-t-transparent"
            />
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm font-bold text-slate-800 tracking-tight">Processing</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest animate-pulse">Please wait</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PageLoader;

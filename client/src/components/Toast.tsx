import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useToast } from '../hooks/useToast';

const ToastContainer = () => {
  const { toasts } = useToast();

  return (
    <div className="fixed bottom-8 right-8 z-[200] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={`pointer-events-auto flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border min-w-[320px] bg-white ${
              t.type === 'success' ? 'border-emerald-100 text-emerald-800' : 
              t.type === 'error' ? 'border-rose-100 text-rose-800' : 
              'border-indigo-100 text-indigo-800'
            }`}
          >
            <div className={`p-2 rounded-xl ${
              t.type === 'success' ? 'bg-emerald-50 text-emerald-500' : 
              t.type === 'error' ? 'bg-rose-50 text-rose-500' : 
              'bg-indigo-50 text-indigo-500'
            }`}>
              {t.type === 'success' ? <CheckCircle size={20} /> : 
               t.type === 'error' ? <AlertCircle size={20} /> : 
               <Info size={20} />}
            </div>
            <p className="font-bold flex-1">{t.message}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;

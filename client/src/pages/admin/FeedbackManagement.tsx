import { useState, useEffect } from 'react';
import api from '../../services/api';
import { motion } from 'framer-motion';
import { Star, MessageSquare, User, Calendar, Trash2 } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { toast } from '../../hooks/useToast';

interface Feedback {
  _id: string;
  userId: {
    name: string;
    email: string;
  };
  rating: number;
  message: string;
  createdAt: string;
}

const FeedbackManagement = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const { data } = await api.get('/api/feedback');
        setFeedbacks(data);
      } catch (err) {
        toast('Failed to load feedback', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchFeedback();
  }, []);

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8 lg:p-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-slate-800 mb-2 tracking-tight">Customer Feedback</h1>
            <p className="text-slate-500 font-medium">Monitor user satisfaction and read platform reviews.</p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {feedbacks.length > 0 ? feedbacks.map((item, idx) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white p-6 rounded-2xl border border-slate-100 shadow-md relative group"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
                      {item.userId?.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 text-sm">{item.userId?.name}</div>
                      <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                        <Calendar size={12} /> {new Date(item.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={14}
                        fill={star <= item.rating ? "#f59e0b" : "none"}
                        className={star <= item.rating ? "text-amber-500" : "text-slate-100"}
                      />
                    ))}
                  </div>
                </div>

                <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-50 mb-4">
                  <div className="text-slate-600 text-sm leading-relaxed font-medium italic">
                    "{item.message}"
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                    <MessageSquare size={12} /> ID: {item._id.slice(-6)}
                  </div>
                </div>
              </motion.div>
            )) : !loading && (
               <div className="col-span-full py-32 bg-white rounded-2xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
                    <MessageSquare size={32} />
                  </div>
                  <h3 className="text-slate-800 font-bold mb-1">No feedback found</h3>
                  <p className="text-slate-400 text-sm font-medium">Customer reviews will appear here once submitted.</p>
               </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default FeedbackManagement;

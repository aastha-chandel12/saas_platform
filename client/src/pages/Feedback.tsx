import { useState } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';
import { Star, MessageSquare, Loader2, CheckCircle } from 'lucide-react';
import { toast } from '../hooks/useToast';

const Feedback = () => {
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return toast('Please select a rating', 'error');
    
    setLoading(true);
    try {
      await api.post('/api/feedback', { rating, message });
      setSubmitted(true);
      toast('Feedback received. Thank you!', 'success');
    } catch (err) {
      toast('Failed to submit feedback', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto py-24 px-4 text-center">
        <motion.div
          initial={{ scale: 0.98, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="p-12 bg-white rounded-2xl shadow-md border border-slate-100"
        >
          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-emerald-100">
            <CheckCircle size={40} />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-4 tracking-tight">Thank You!</h1>
          <p className="text-slate-600 mb-10 font-medium">
            Your feedback is invaluable to us. We use it to improve our services and your overall experience.
          </p>
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-md active:scale-95"
          >
            Back to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-16 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-800 mb-4 tracking-tight">How are we doing?</h1>
        <p className="text-slate-500 font-medium max-w-xl mx-auto">
          We value your input. Share your thoughts on our platform and help us serve you better.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 md:p-12 rounded-2xl border border-slate-100 shadow-md"
      >
        <form onSubmit={handleSubmit} className="space-y-12">
          <div className="space-y-6 text-center">
            <label className="text-xl font-bold text-slate-800 block tracking-tight">Rate your experience</label>
            <div className="flex justify-center gap-3 sm:gap-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                  className="transition-all hover:scale-110 active:scale-90 duration-200 focus:outline-none"
                >
                  <Star
                    size={48}
                    fill={star <= (hoveredRating || rating) ? "#6366f1" : "none"}
                    className={star <= (hoveredRating || rating) ? "text-indigo-600" : "text-slate-100"}
                  />
                </button>
              ))}
            </div>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
              {rating ? `Rating: ${rating}/5` : "Select a star rating"}
            </p>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
              <MessageSquare size={14} className="text-indigo-600" /> 
              Your Message
            </label>
            <textarea
              required
              rows={5}
              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium text-slate-700 placeholder:text-slate-300 shadow-inner text-sm"
              placeholder="Tell us what you loved or what we could do better..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading || rating === 0}
            className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-md flex justify-center items-center gap-2 disabled:opacity-50 active:scale-[0.98]"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Submit Feedback"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Feedback;

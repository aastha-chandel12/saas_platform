import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Send, AlertCircle, CheckCircle2, User, Mail, Calendar } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const CreateRequest = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const serviceTypeParam = searchParams.get('type') || '';

  const [formData, setFormData] = useState({
    serviceType: serviceTypeParam || 'Other',
    description: '',
    deadline: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/api/requests', formData);
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-2xl shadow-slate-200/50"
      >
        <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Request a Service</h2>
        <p className="text-slate-500 mb-8">Tell us what you need and our experts will get back to you shortly.</p>

        {success ? (
          <div className="flex flex-col items-center py-12 space-y-4">
            <div className="p-4 bg-emerald-50 rounded-full">
              <CheckCircle2 className="text-emerald-500" size={48} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Request Submitted!</h3>
            <p className="text-slate-600">Redirecting to your dashboard...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 border border-red-100 animate-shake">
                <AlertCircle size={20} />
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    readOnly
                    value={user?.name || ''}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-slate-500 font-medium cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="email"
                    readOnly
                    value={user?.email || ''}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-slate-500 font-medium cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Service Type</label>
                <select
                  value={formData.serviceType}
                  onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-slate-700"
                  required
                >
                  <option value="Profile Optimization">Profile Optimization</option>
                  <option value="ATS Resume">ATS Resume</option>
                  <option value="Website Development">Website Development</option>
                  <option value="Portfolio Creation">Portfolio Creation</option>
                  <option value="Career Guidance">Career Guidance</option>
                  <option value="Social Growth Strategy">Social Growth Strategy</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Deadline</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                  <input
                    type="date"
                    required
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-slate-700"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Description of requirement</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-slate-700 min-h-[120px]"
                placeholder="Briefly describe your requirements..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? 'Submitting...' : (
                <>
                  Send Request <Send size={20} />
                </>
              )}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default CreateRequest;

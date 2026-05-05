import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import { motion } from 'framer-motion';
import { Send, ArrowLeft, Loader2, Calendar, User, Mail, CheckCircle2, AlertCircle, Upload, Paperclip, Trash2 } from 'lucide-react';
import { toast } from '../hooks/useToast';
import { useAuth } from '../context/AuthContext';

const RequestService = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const queryParams = new URLSearchParams(location.search);
  const initialType = queryParams.get('type') || 'Other';

  const [formData, setFormData] = useState({
    serviceType: initialType,
    description: '',
    deadline: ''
  });
  const [attachments, setAttachments] = useState<{name: string, url: string}[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      return toast('File size exceeds 5MB limit', 'error');
    }

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      const { data } = await api.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setAttachments([...attachments, { name: data.name, url: data.url }]);
      toast('File uploaded successfully', 'success');
    } catch (err) {
      toast('File upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/api/requests', { ...formData, attachments });
      setSuccess(true);
      toast('Request submitted successfully!', 'success');
      setTimeout(() => navigate('/my-requests'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit request');
      toast('Failed to submit request', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-400 hover:text-slate-900 mb-8 transition-colors font-bold uppercase tracking-widest text-xs"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl border border-slate-100 p-8 shadow-md"
      >
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Service Request</h2>
        <p className="text-slate-500 mb-8 font-medium">Please provide the details below to start your service journey.</p>

        {success ? (
          <div className="flex flex-col items-center py-10 space-y-4 text-center">
            <div className="p-3 bg-emerald-50 rounded-full">
              <CheckCircle2 className="text-emerald-500" size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Request Received!</h3>
            <p className="text-slate-500">We've sent a confirmation email. Redirecting...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-xl flex items-center gap-2 border border-red-100 text-sm font-medium">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    readOnly
                    value={user?.name || ''}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-transparent rounded-xl text-slate-500 font-medium cursor-not-allowed outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="email"
                    readOnly
                    value={user?.email || ''}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-transparent rounded-xl text-slate-500 font-medium cursor-not-allowed outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Service Type</label>
                <select
                  value={formData.serviceType}
                  onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium text-slate-700"
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

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Expected Deadline</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                  <input
                    type="date"
                    required
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium text-slate-700"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Description of requirement</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-5 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium text-slate-700 min-h-[120px]"
                placeholder="Briefly describe what you're looking for..."
                required
              />
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Attachments (Resume/Portfolio)</label>
              <div className="flex flex-col gap-3">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-100 rounded-xl cursor-pointer hover:bg-slate-50 transition-all group">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-3 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                    <p className="mb-2 text-sm text-slate-500 font-bold">Click to upload or drag and drop</p>
                    <p className="text-xs text-slate-400 font-medium tracking-tight">PDF, DOC, DOCX, PNG, JPG (MAX. 5MB)</p>
                  </div>
                  <input type="file" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                </label>

                {attachments.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {attachments.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <Paperclip size={14} className="text-indigo-600 flex-shrink-0" />
                          <span className="text-xs font-bold text-slate-700 truncate">{file.name}</span>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => setAttachments(attachments.filter((_, i) => i !== idx))}
                          className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-white rounded-lg transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {uploading && (
                  <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs animate-pulse">
                    <Loader2 size={14} className="animate-spin" /> Uploading file...
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-md flex justify-center items-center gap-2 active:scale-[0.98] disabled:opacity-70"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <><Send size={18} /> Submit Request</>}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default RequestService;

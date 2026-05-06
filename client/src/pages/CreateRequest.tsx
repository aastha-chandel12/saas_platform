import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Send, AlertCircle, CheckCircle2, User, Mail, Calendar, Upload, X, FileText, Globe } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from '../hooks/useToast';

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
  const [attachments, setAttachments] = useState<{ name: string, url: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('file', file);

    setUploading(true);
    try {
      const { data } = await api.post('/api/upload', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setAttachments([...attachments, { name: data.name, url: data.url }]);
      toast('File synchronized successfully', 'success');
    } catch (err) {
      toast('Upload failed. Please check file type.', 'error');
    } finally {
      setUploading(false);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/api/requests', {
        ...formData,
        attachments
      });
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
        className="bg-white rounded-[2rem] border border-slate-100 p-8 lg:p-12 shadow-2xl shadow-slate-200/50"
      >
        <div className="mb-10">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Service Provisioning</h2>
          <p className="text-slate-500 font-medium">Define your requirements and technical infrastructure.</p>
        </div>

        {success ? (
          <div className="flex flex-col items-center py-12 space-y-4 text-center">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 shadow-inner">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Request Transmitted</h3>
            <p className="text-slate-500 font-medium max-w-xs">Your request has been queued for administrative review. Redirecting to terminal...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 border border-red-100">
                <AlertCircle size={20} />
                <span className="text-xs font-bold uppercase tracking-tight">{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Identity</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    readOnly
                    value={user?.name || ''}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-400 font-bold text-xs cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Terminal Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="email"
                    readOnly
                    value={user?.email || ''}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-400 font-bold text-xs cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Module Type</label>
                <select
                  value={formData.serviceType}
                  onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                  className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 transition-all font-bold text-xs text-slate-700 outline-none shadow-sm"
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
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Deployment Deadline</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                  <input
                    type="date"
                    required
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 transition-all font-bold text-xs text-slate-700 outline-none shadow-sm"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Requirement Manifesto</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-5 py-4 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 transition-all font-bold text-xs text-slate-700 outline-none shadow-sm min-h-[140px] leading-relaxed"
                placeholder="Briefly describe your requirements..."
                required
              />
            </div>

            {/* Technical Assets / File Upload Zone */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Technical Assets (Portfolio / Resume)</label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="relative flex flex-col items-center justify-center p-6 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl hover:bg-white hover:border-slate-900 transition-all cursor-pointer group">
                  <input type="file" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                  <Upload size={24} className="text-slate-300 mb-2 group-hover:text-slate-900 transition-colors" />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Upload Resource</span>
                  {uploading && <div className="absolute inset-0 bg-white/80 rounded-2xl flex items-center justify-center"><Loader2 className="animate-spin text-slate-900" size={24} /></div>}
                </label>

                <div className="space-y-2">
                  {attachments.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl shadow-sm animate-in fade-in slide-in-from-right-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                          <FileText size={14} />
                        </div>
                        <span className="text-[11px] font-bold text-slate-700 truncate max-w-[120px]">{file.name}</span>
                      </div>
                      <button type="button" onClick={() => removeAttachment(idx)} className="p-1.5 text-slate-300 hover:text-red-500 rounded-lg transition-colors">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  {attachments.length === 0 && (
                    <div className="h-full flex items-center justify-center p-4 bg-slate-50 rounded-xl border border-slate-100 border-dashed">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">No assets provisioned</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || uploading}
              className="w-full py-5 bg-slate-950 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3 disabled:opacity-50 active:scale-[0.98]"
            >
              {loading ? 'Transmitting...' : (
                <>
                  Send Provisioning Request <Send size={16} />
                </>
              )}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

const Loader2 = ({ className, size }: { className?: string, size?: number }) => (
  <svg className={`animate-spin ${className}`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

export default CreateRequest;

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader2, Layout, ShieldCheck, ChevronRight } from 'lucide-react';
import { toast } from '../hooks/useToast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await api.post('/api/users/auth', { email, password });
      login(data);
      toast('Authentication Successful', 'success');
      if (data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      toast(err.response?.data?.message || 'Invalid Credentials', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-88px)] flex bg-white font-sans text-slate-900">
      {/* Left Panel: Brand & Info */}
      <div className="hidden lg:flex w-1/2 bg-slate-950 p-16 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-white rounded flex items-center justify-center text-slate-950 shadow-lg">
              <Layout size={24} strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold tracking-tighter text-white uppercase italic">Nextstep Careers <span className="not-italic text-slate-500 font-medium">OS</span></span>
          </div>

          <div className="max-w-md">
            <h2 className="text-4xl font-bold text-white tracking-tight leading-tight mb-6">
              The Central Nervous System for your Operations.
            </h2>
            <div className="space-y-4">
              <FeatureItem text="Automated Workflow Provisioning" />
              <FeatureItem text="Real-time Operational Health Tracking" />
              <FeatureItem text="Enterprise Grade Audit Compliance" />
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-6 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
          <span>© 2026 Nextstep Careers</span>
          <span className="w-1 h-1 bg-slate-800 rounded-full" />
          <span>V 4.0.2-STABLE</span>
        </div>
      </div>

      {/* Right Panel: Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 bg-white">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-[380px]"
        >
          <div className="mb-10">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">Operator Login</h1>
            <p className="text-sm font-medium text-slate-500">Initialize your administrative session.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs lg:text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Identification</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input
                  type="email"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-md focus:border-slate-900 outline-none transition-all font-medium text-base lg:text-sm text-slate-700 placeholder:text-slate-300 shadow-sm"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs lg:text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Passkey</label>
                <Link to="#" className="text-xs lg:text-[10px] font-bold text-slate-400 hover:text-slate-900 transition-colors">FORGOT?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input
                  type="password"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-md focus:border-slate-900 outline-none transition-all font-medium text-base lg:text-sm text-slate-700 placeholder:text-slate-300 shadow-sm"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 lg:py-3 bg-slate-950 text-white rounded-md font-bold text-xs uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-md flex justify-center items-center gap-2 active:scale-[0.98] disabled:opacity-70 group"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : (
                <>
                  Connect to System
                  <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-slate-100">
            <p className="text-xs lg:text-[11px] font-medium text-slate-500">
              New entity?{' '}
              <Link to="/signup" className="text-slate-950 font-bold hover:underline underline-offset-4">
                Initialize Account
              </Link>
            </p>
          </div>

          <div className="mt-8 flex items-center gap-2 text-slate-300">
            <ShieldCheck size={14} />
            <span className="text-[10px] lg:text-[9px] font-bold uppercase tracking-[0.1em]">256-Bit Encrypted Data Channel</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const FeatureItem = ({ text }: { text: string }) => (
  <div className="flex items-center gap-3 text-slate-400">
    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
    <span className="text-sm font-medium tracking-tight">{text}</span>
  </div>
);

export default Login;

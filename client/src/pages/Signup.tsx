import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Loader2, Layout, ChevronRight, ShieldCheck, Sparkles } from 'lucide-react';
import { toast } from '../hooks/useToast';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data } = await api.post('/api/users', { name, email, password });
      login(data);
      toast('Registration Successful', 'success');
      navigate('/dashboard');
    } catch (err: any) {
      toast(err.response?.data?.message || 'Initialization Failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-88px)] flex bg-white font-sans text-slate-900 overflow-hidden">
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
            <span className="text-xl font-bold tracking-tighter text-white uppercase italic">Servicely <span className="not-italic text-slate-500 font-medium">OS</span></span>
          </div>
          
          <div className="max-w-md">
            <h2 className="text-4xl font-bold text-white tracking-tight leading-tight mb-6">
              Join the future of Operational Intelligence.
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-400">
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                <span className="text-sm font-medium tracking-tight">Zero-Config Infrastructure Integration</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400">
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                <span className="text-sm font-medium tracking-tight">Full-Stack Resource Monitoring</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400">
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                <span className="text-sm font-medium tracking-tight">Advanced Service Orchestration</span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-6 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
          <span>© 2026 SERVICELY INC.</span>
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
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">New Entity Registration</h1>
            <p className="text-sm font-medium text-slate-500">Provision your administrative identity.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Full Legal Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input
                  type="text"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-md focus:border-slate-900 outline-none transition-all font-medium text-sm text-slate-700 placeholder:text-slate-300 shadow-sm"
                  placeholder="Johnathan Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Professional Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input
                  type="email"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-md focus:border-slate-900 outline-none transition-all font-medium text-sm text-slate-700 placeholder:text-slate-300 shadow-sm"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Primary Passkey</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input
                  type="password"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-md focus:border-slate-900 outline-none transition-all font-medium text-sm text-slate-700 placeholder:text-slate-300 shadow-sm"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-slate-950 text-white rounded-md font-bold text-xs uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-md flex justify-center items-center gap-2 active:scale-[0.98] disabled:opacity-70 group"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : (
                <>
                  Initialize Provisioning
                  <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-slate-100">
            <p className="text-[11px] font-medium text-slate-500">
              Existing operator?{' '}
              <Link to="/login" className="text-slate-950 font-bold hover:underline underline-offset-4">
                Sign In
              </Link>
            </p>
          </div>

          <div className="mt-8 flex items-center gap-2 text-slate-300">
             <ShieldCheck size={14} />
             <span className="text-[9px] font-bold uppercase tracking-[0.1em]">SOC2 Type II Compliant Infrastructure</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;

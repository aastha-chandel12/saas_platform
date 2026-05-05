import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { motion } from 'framer-motion';
import { Plus, List, Star, Activity, ArrowUpRight, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ServiceRequest {
  _id: string;
  status: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const { data } = await api.get('/api/requests');
        setRequests(data);
      } catch (err) {
        console.error('Failed to fetch requests');
      }
    };
    fetchRequests();
  }, []);

  const stats = [
    { label: 'Total Requests', value: requests.length, color: 'indigo', icon: <Activity size={20} /> },
    { label: 'In Review', value: requests.filter(r => r.status === 'Under Review').length, color: 'amber', icon: <Clock size={20} /> },
    { label: 'Active', value: requests.filter(r => r.status === 'Work Started').length, color: 'blue', icon: <AlertCircle size={20} /> },
    { label: 'Completed', value: requests.filter(r => r.status === 'Completed').length, color: 'emerald', icon: <CheckCircle size={20} /> },
  ];

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-800 mb-2 tracking-tight">Welcome back, {user?.name}!</h1>
        <p className="text-slate-500 font-medium">Here's a quick overview of your service activity.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-md"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 bg-slate-50 text-${stat.color}-600 border border-slate-50 shadow-sm`}>
              {stat.icon}
            </div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</div>
            <div className="text-3xl font-bold text-slate-800">{stat.value}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ActionCard 
          title="Request a Service"
          description="Need help with something? Submit a new service ticket and our team will get on it."
          icon={<Plus size={24} />}
          to="/request-service"
          color="indigo"
        />
        <ActionCard 
          title="Manage Requests"
          description="Track the progress of your active tickets, view details, and history."
          icon={<List size={24} />}
          to="/my-requests"
          color="slate"
        />
        <ActionCard 
          title="Share Feedback"
          description="How are we doing? Tell us about your experience with our services."
          icon={<Star size={24} />}
          to="/feedback"
          color="emerald"
        />
        <ActionCard 
          title="Explore Services"
          description="Browse our catalog of professional services tailored for your needs."
          icon={<Activity size={24} />}
          to="/services"
          color="amber"
        />
      </div>
    </div>
  );
};

const ActionCard = ({ title, description, icon, to, color }: { title: string, description: string, icon: any, to: string, color: string }) => (
  <Link to={to} className="group">
    <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 h-full relative overflow-hidden flex flex-col">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-slate-50 border border-slate-50 shadow-sm text-${color}-600 relative z-10 transition-colors group-hover:bg-indigo-600 group-hover:text-white`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-indigo-600 transition-colors">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed mb-6 font-medium flex-1">{description}</p>
      <div className="flex items-center gap-2 font-bold text-indigo-600 text-sm">
        Get Started <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
      </div>
    </div>
  </Link>
);

export default Dashboard;

import { useState, useEffect } from 'react';
import api from '../../services/api';
import { MessageSquare, Users, Clock, Activity, ArrowUpRight, TrendingUp } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { motion } from 'framer-motion';

const StatCard = ({ label, value, icon, subtext, color }: any) => (
  <div className="bg-white p-4 lg:p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
    <div className="flex justify-between items-start mb-3">
      <div className={`p-2 rounded-lg bg-${color}-50 text-${color}-600 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <div className="flex items-center gap-1 text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
        <ArrowUpRight size={10} /> 12%
      </div>
    </div>
    <div className="text-2xl font-black text-slate-900 tracking-tight mb-1">{value}</div>
    <div className="flex items-center justify-between">
      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</div>
      <div className="text-[9px] font-bold text-slate-400 italic">{subtext}</div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRequests: 0,
    pendingRequests: 0,
    completedRequests: 0,
    successRate: 0,
    recentRequests: [],
    popularServices: [] as { name: string, count: number, percentage: number }[]
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, requestsRes] = await Promise.all([
          api.get('/api/users'),
          api.get('/api/requests/all')
        ]);

        const requests = requestsRes.data;
        const users = usersRes.data;

        const completed = requests.filter((r: any) => r.status === 'Completed').length;
        const requested = requests.filter((r: any) => r.status === 'Requested' || r.status === 'Request Submitted').length;
        
        const operationalHealth = requests.length ? Math.round(((requests.length - requested) / requests.length) * 100) : 100;

        const serviceCounts = requests.reduce((acc: any, r: any) => {
          acc[r.serviceType] = (acc[r.serviceType] || 0) + 1;
          return acc;
        }, {});

        const popular = Object.entries(serviceCounts)
          .map(([name, count]: any) => ({
            name,
            count,
            percentage: Math.round((count / requests.length) * 100)
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 3);

        setStats({
          totalUsers: users.length,
          totalRequests: requests.length,
          pendingRequests: requests.filter((r: any) => r.status !== 'Completed').length,
          completedRequests: completed,
          successRate: operationalHealth,
          recentRequests: [...requests].sort((a: any, b: any) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA;
          }).slice(0, 5),
          popularServices: popular
        });
      } catch (err) {
        console.error('Failed to fetch admin stats');
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col lg:flex-row bg-[#F8FAFC] min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-4 lg:p-10 pt-20 lg:pt-10">
        <div className="max-w-6xl mx-auto space-y-6">
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">System Performance</h1>
              <p className="text-[13px] font-medium text-slate-500">Live operational data and user engagement metrics.</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-sm">
               <TrendingUp size={14} className="text-indigo-600" />
               <span className="text-[11px] font-bold text-slate-700">Real-time Feed</span>
            </div>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total Requests" value={stats.totalRequests.toString()} icon={<MessageSquare size={18} />} subtext="Lifetime" color="indigo" />
            <StatCard label="Active Users" value={stats.totalUsers.toString()} icon={<Users size={18} />} subtext="Authenticated" color="emerald" />
            <StatCard label="Active Tickets" value={stats.pendingRequests.toString()} icon={<Clock size={18} />} subtext="In Production" color="amber" />
            <StatCard label="Op. Health" value={`${stats.successRate}%`} icon={<Activity size={18} />} subtext="Coverage" color="rose" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 lg:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h2 className="text-xs font-black text-slate-900 uppercase tracking-widest">Recent Request Feed</h2>
                <button className="text-[10px] font-bold text-indigo-600 hover:underline">View All</button>
              </div>
              <div className="divide-y divide-slate-100">
                {stats.recentRequests.length > 0 ? stats.recentRequests.map((request: any) => (
                  <div key={request._id} className="p-4 hover:bg-slate-50 transition-colors flex items-center gap-4">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 flex-shrink-0">
                      <Clock size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-bold text-slate-800 truncate">{request.serviceType}</div>
                      <div className="text-[11px] text-slate-500 font-medium truncate">{request.userId?.name} • {new Date(request.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div className={`px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider flex-shrink-0 ${
                      request.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {request.status?.split(' ')[0]}
                    </div>
                  </div>
                )) : (
                  <div className="py-20 text-center text-slate-400 font-bold text-xs italic">No operational data</div>
                )}
              </div>
            </div>

            <div className="bg-white p-5 lg:p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
              <h2 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6">Service Distribution</h2>
              <div className="space-y-5 flex-1">
                {stats.popularServices.length > 0 ? stats.popularServices.map((service) => (
                  <div key={service.name} className="space-y-2">
                    <div className="flex justify-between text-[11px] font-bold text-slate-600">
                      <span className="truncate pr-2">{service.name}</span>
                      <span className="text-slate-400">{service.percentage}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${service.percentage}%` }}
                        transition={{ duration: 1 }}
                        className="h-full bg-slate-900 rounded-full"
                      />
                    </div>
                  </div>
                )) : (
                  <div className="h-full min-h-[150px] flex items-center justify-center text-slate-400 font-bold text-xs italic">Insufficient data</div>
                )}
              </div>
              <div className="mt-6 pt-6 border-t border-slate-100">
                 <p className="text-[10px] text-slate-400 leading-relaxed">Service distribution is calculated based on lifetime requests submitted across all authenticated user accounts.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;

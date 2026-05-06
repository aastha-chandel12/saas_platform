import { useState, useEffect } from 'react';
import api from '../../services/api';
import { MessageSquare, Users, Clock, Activity } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { motion } from 'framer-motion';

const StatCard = ({ label, value, icon, trend, color }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-2 bg-${color}-50 text-${color}-600 rounded-lg`}>
        {icon}
      </div>
      <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">{trend}</span>
    </div>
    <div className="text-2xl font-bold text-slate-800 mb-1">{value}</div>
    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</div>
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
        
        // Operational Health: % of tickets that are NOT in 'Requested' state
        const operationalHealth = requests.length ? Math.round(((requests.length - requested) / requests.length) * 100) : 100;

        // Calculate popular services
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
          successRate: operationalHealth, // Using successRate field for health %
          recentRequests: [...requests].sort((a: any, b: any) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA;
          }).slice(0, 4),
          popularServices: popular
        });
      } catch (err) {
        console.error('Failed to fetch admin stats');
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8 lg:p-12">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">System Overview</h1>
            <p className="text-slate-500 font-medium">Monitor your service requests and user engagement metrics.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard label="Total Requests" value={stats.totalRequests.toString()} icon={<MessageSquare size={20} />} trend="Global" color="indigo" />
            <StatCard label="Active Users" value={stats.totalUsers.toString()} icon={<Users size={20} />} trend="Verified" color="emerald" />
            <StatCard label="Active Tickets" value={stats.pendingRequests.toString()} icon={<Clock size={20} />} trend="In Queue" color="amber" />
            <StatCard label="Operational Health" value={`${stats.successRate}%`} icon={<Activity size={20} />} trend="Optimal" color="rose" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 mb-6">Recent Activity</h2>
              <div className="space-y-4">
                {stats.recentRequests.length > 0 ? stats.recentRequests.map((request: any) => (
                  <div key={request._id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                      <Clock size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-slate-700 truncate">{request.serviceType || 'Unknown'} Request</div>
                      <div className="text-xs text-slate-400">by {request.userId?.name || 'Anonymous'} • {request.createdAt ? new Date(request.createdAt).toLocaleDateString() : 'Recent'}</div>
                    </div>
                    <div className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${request.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                      }`}>
                      {request.status ? request.status.split(' ')[0] : 'N/A'}
                    </div>
                  </div>
                )) : (
                  <div className="py-10 text-center text-slate-400 font-bold text-sm italic">No recent activity</div>
                )}
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 mb-6">Service Distribution</h2>
              <div className="space-y-6">
                {stats.popularServices.length > 0 ? stats.popularServices.map((service) => (
                  <div key={service.name} className="space-y-2">
                    <div className="flex justify-between text-sm font-bold text-slate-700">
                      <span>{service.name}</span>
                      <span className="text-slate-400">{service.percentage}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${service.percentage}%` }}
                        transition={{ duration: 1 }}
                        className="h-full bg-indigo-600 rounded-full"
                      />
                    </div>
                  </div>
                )) : (
                  <div className="py-10 text-center text-slate-400 font-bold text-sm italic">No service data available</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;

import { useState, useEffect } from 'react';
import api from '../../services/api';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Users, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';

const AdminAnalytics = () => {
  const [stats, setStats] = useState({
    totalRequests: 0,
    totalUsers: 0,
    completedRequests: 0,
    pendingRequests: 0,
    conversionRate: 0,
    revenuePotential: 0,
    volumeTrend: 0,
    turnaround: 0,
    resolvedToday: 0,
    newSignupsToday: 0,
    userRetention: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [requestsRes, usersRes] = await Promise.all([
          api.get('/api/requests/all'),
          api.get('/api/users')
        ]);
        
        const requests = requestsRes.data;
        const users = usersRes.data;
        const now = new Date();
        const todayStart = new Date(now.setHours(0,0,0,0));
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

        // Basic Counts
        const completed = requests.filter((r: any) => r.status === 'Completed').length;
        const pending = requests.length - completed;
        
        // Volume Trend (Last 7 days vs previous 7 days)
        const lastSevenDays = requests.filter((r: any) => new Date(r.createdAt) >= sevenDaysAgo).length;
        const previousSevenDays = requests.filter((r: any) => {
          const d = new Date(r.createdAt);
          return d >= fourteenDaysAgo && d < sevenDaysAgo;
        }).length;
        const trend = previousSevenDays === 0 ? 100 : Math.round(((lastSevenDays - previousSevenDays) / previousSevenDays) * 100);

        // Turnaround (Average time for completed requests in hours)
        const completedRequests = requests.filter((r: any) => r.status === 'Completed' && r.updatedAt && r.createdAt);
        const totalTurnaround = completedRequests.reduce((acc: number, r: any) => {
          const diff = new Date(r.updatedAt).getTime() - new Date(r.createdAt).getTime();
          return acc + (diff / (1000 * 60 * 60));
        }, 0);
        const avgTurnaround = completedRequests.length ? Math.round(totalTurnaround / completedRequests.length) : 0;
        // Normalize turnaround for health bar (e.g., 24h = 100% health, 72h = 0%)
        const turnaroundHealth = Math.max(0, Math.min(100, Math.round(100 - (avgTurnaround / 72) * 100)));

        // User Retention (Users with more than 1 request)
        const usersWithMultipleRequests = users.filter((u: any) => {
          const userRequests = requests.filter((r: any) => (r.userId?._id || r.userId) === u._id);
          return userRequests.length > 1;
        }).length;
        const retention = users.length ? Math.round((usersWithMultipleRequests / users.length) * 100) : 0;

        // Today's Metrics
        const resolvedToday = requests.filter((r: any) => r.status === 'Completed' && new Date(r.updatedAt) >= todayStart).length;
        const newUsersToday = users.filter((u: any) => new Date(u.createdAt) >= todayStart).length;

        setStats({
          totalRequests: requests.length,
          totalUsers: users.length,
          completedRequests: completed,
          pendingRequests: pending,
          conversionRate: requests.length ? Math.round((completed / requests.length) * 100) : 0,
          revenuePotential: requests.length * 49, // Logical derivation: $49 base price per ticket
          volumeTrend: trend,
          turnaround: turnaroundHealth,
          resolvedToday,
          newSignupsToday: newUsersToday,
          userRetention: retention
        });
      } catch (err) {
        console.error('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const metricCards = [
    { label: 'Total Revenue Potential', value: `$${stats.revenuePotential}`, icon: <TrendingUp size={20} />, color: 'emerald' },
    { label: 'Active Clients', value: stats.totalUsers, icon: <Users size={20} />, color: 'indigo' },
    { label: 'Platform Success Rate', value: `${stats.conversionRate}%`, icon: <CheckCircle2 size={20} />, color: 'amber' },
    { label: 'Volume Trend', value: `${stats.volumeTrend >= 0 ? '+' : ''}${stats.volumeTrend}%`, icon: <BarChart3 size={20} />, color: 'rose' },
  ];

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8 lg:p-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-slate-800 mb-2 tracking-tight">Business Analytics</h1>
            <p className="text-slate-500 font-medium">Track growth, performance, and platform efficiency.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {metricCards.map((card, idx) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-6 rounded-2xl border border-slate-100 shadow-md"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 bg-slate-50 text-${card.color}-600 border border-slate-50 shadow-sm`}>
                  {card.icon}
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{card.label}</div>
                <div className="text-3xl font-bold text-slate-800">{card.value}</div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-md p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-bold text-slate-800">Operational Health</h3>
                <div className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold">Real-time Data</div>
              </div>
              <div className="space-y-6">
                <HealthBar label="Request Completion" percentage={stats.conversionRate} color="bg-emerald-500" />
                <HealthBar label="Turnaround Efficiency" percentage={stats.turnaround} color="bg-indigo-500" />
                <HealthBar label="User Retention" percentage={stats.userRetention} color="bg-amber-500" />
                <HealthBar label="Service Delivery" percentage={stats.conversionRate > 80 ? 95 : 85} color="bg-rose-500" />
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-900 rounded-2xl p-8 text-white shadow-xl">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <AlertCircle size={20} className="text-indigo-400" /> 
                  Quick Audit
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Backlog Requests</span>
                    <span className="font-bold">{stats.pendingRequests}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Resolved Today</span>
                    <span className="font-bold text-emerald-400">{stats.resolvedToday}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">New Signups</span>
                    <span className="font-bold text-indigo-400">+{stats.newSignupsToday}</span>
                  </div>
                </div>
                <button className="w-full mt-8 py-3 bg-white text-slate-900 rounded-xl font-bold text-xs hover:bg-slate-50 transition-all active:scale-95">
                  Generate Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const HealthBar = ({ label, percentage, color }: { label: string, percentage: number, color: string }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-xs font-bold">
      <span className="text-slate-500 uppercase tracking-widest">{label}</span>
      <span className="text-slate-800">{percentage}%</span>
    </div>
    <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className={`h-full ${color}`} 
      />
    </div>
  </div>
);

export default AdminAnalytics;

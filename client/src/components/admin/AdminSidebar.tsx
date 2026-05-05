import { Link, useLocation } from 'react-router-dom';
import { Layout, Users, MessageSquare, LogOut, LayoutDashboard, MessageSquareHeart, BarChart3 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="w-full lg:w-72 bg-white border-r border-slate-100 p-6 flex flex-col min-h-screen sticky top-0">
      <div className="flex items-center gap-2 text-xl font-bold text-slate-800 mb-10 px-2">
        <div className="p-1.5 bg-indigo-600 rounded-lg text-white">
          <Layout size={18} />
        </div>
        Admin Portal
      </div>

      <nav className="flex-1 space-y-1">
        <SidebarLink to="/admin" label="Overview" icon={<LayoutDashboard size={18} />} active={isActive('/admin')} />
        <SidebarLink to="/admin/requests" label="Tickets" icon={<MessageSquare size={18} />} active={isActive('/admin/requests')} />
        <SidebarLink to="/admin/analytics" label="Analytics" icon={<BarChart3 size={18} />} active={isActive('/admin/analytics')} />
        <SidebarLink to="/admin/users" label="Users" icon={<Users size={18} />} active={isActive('/admin/users')} />
        <SidebarLink to="/admin/feedback" label="Feedback" icon={<MessageSquareHeart size={18} />} active={isActive('/admin/feedback')} />
      </nav>

      <div className="mt-auto pt-6 border-t border-slate-50 space-y-4">
        <div className="px-4 py-3 bg-slate-50 rounded-xl">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1.5">System Status</div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-xs font-bold text-slate-600">All Systems Operational</span>
          </div>
        </div>
        
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all font-bold text-sm"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </aside>
  );
};

const SidebarLink = ({ to, label, icon, active }: any) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${
      active 
        ? 'bg-indigo-50 text-indigo-600 shadow-sm' 
        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
    }`}
  >
    {icon} {label}
  </Link>
);

export default AdminSidebar;

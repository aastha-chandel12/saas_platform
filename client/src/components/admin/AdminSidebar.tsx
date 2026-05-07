import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Layout, Users, MessageSquare, LogOut, LayoutDashboard, MessageSquareHeart, BarChart3, Settings, Menu, X as CloseIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const AdminSidebar = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const isActive = (path: string) => location.pathname === path;

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r border-slate-200">
      <div className="h-16 flex items-center gap-2.5 px-6 border-b border-slate-100">
        <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white shadow-sm">
          <Layout size={16} strokeWidth={2.5} />
        </div>
        <span className="text-sm font-extrabold text-slate-900 uppercase tracking-tight">Nextstep Careers <span className="text-indigo-600">Admin</span></span>
      </div>

      <div className="flex-1 py-6 px-3 space-y-8 overflow-y-auto">
        <div>
          <h3 className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Main Menu</h3>
          <nav className="space-y-0.5">
            <SidebarLink to="/admin" label="Overview" icon={<LayoutDashboard size={18} />} active={isActive('/admin')} onClick={() => setIsOpen(false)} />
            <SidebarLink to="/admin/requests" label="Tickets" icon={<MessageSquare size={18} />} active={isActive('/admin/requests')} onClick={() => setIsOpen(false)} />
            <SidebarLink to="/admin/analytics" label="Analytics" icon={<BarChart3 size={18} />} active={isActive('/admin/analytics')} onClick={() => setIsOpen(false)} />
          </nav>
        </div>

        <div>
          <h3 className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Management</h3>
          <nav className="space-y-0.5">
            <SidebarLink to="/admin/users" label="Users" icon={<Users size={18} />} active={isActive('/admin/users')} onClick={() => setIsOpen(false)} />
            <SidebarLink to="/admin/feedback" label="Feedback" icon={<MessageSquareHeart size={18} />} active={isActive('/admin/feedback')} onClick={() => setIsOpen(false)} />
          </nav>
        </div>
      </div>

      <div className="p-4 border-t border-slate-100 bg-slate-50/30">
        <div className="mb-4 px-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Status: Active</span>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-500 hover:text-slate-900 hover:bg-white border border-transparent hover:border-slate-200 rounded-lg transition-all font-bold text-xs"
        >
          <LogOut size={16} /> Logout System
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 px-4 flex items-center justify-between z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white">
            <Layout size={16} strokeWidth={2.5} />
          </div>
          <span className="text-sm font-extrabold text-slate-900 uppercase">Admin</span>
        </div>
        <button onClick={() => setIsOpen(true)} className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg">
          <Menu size={24} />
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col min-h-screen sticky top-0 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 z-[60] lg:hidden"
            >
              <SidebarContent />
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-[-48px] p-2 bg-white rounded-lg shadow-lg text-slate-500 lg:hidden"
              >
                <CloseIcon size={20} />
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

const SidebarLink = ({ to, label, icon, active, onClick }: any) => (
  <Link
    to={to}
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all font-bold text-[13px] ${active
        ? 'bg-slate-900 text-white shadow-md shadow-slate-200'
        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
      }`}
  >
    <span className={active ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-600'}>{icon}</span>
    {label}
  </Link>
);

export default AdminSidebar;

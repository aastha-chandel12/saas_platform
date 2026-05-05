import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Layout, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="px-4">
      <nav className="glass sticky top-0 z-50 px-6 py-3 flex items-center justify-between max-w-7xl mx-auto mt-4 rounded-2xl shadow-sm border border-slate-100">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-slate-800 transition-transform hover:scale-105 active:scale-95">
          <div className="p-1.5 bg-indigo-600 rounded-lg text-white">
            <Layout size={20} />
          </div>
          Servicely
        </Link>

        <div className="flex items-center gap-8">
          <div className="hidden md:flex items-center gap-6">
            <NavLink to="/" label="Home" active={isActive('/')} />
            <NavLink to="/services" label="Services" active={isActive('/services')} />
            {user && (
              <>
                {user.role === 'admin' && <NavLink to="/admin" label="Admin Panel" active={isActive('/admin')} />}
                <NavLink to="/dashboard" label="Dashboard" active={isActive('/dashboard')} />
                <NavLink to="/my-requests" label="My Requests" active={isActive('/my-requests')} />
              </>
            )}
          </div>

          <div className="flex items-center gap-4 pl-6 border-l border-slate-100">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden lg:block text-right">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Signed in as</div>
                  <div className="text-xs font-bold text-slate-700 leading-none">{user.name}</div>
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all duration-300 active:scale-90"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="px-4 py-2 text-slate-600 font-semibold text-sm hover:text-indigo-600 transition-colors">
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-5 py-2 bg-indigo-600 text-white rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-all shadow-sm active:scale-95"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

const NavLink = ({ to, label, active }: { to: string, label: string, active: boolean }) => (
  <Link 
    to={to} 
    className={`relative py-1 font-bold text-lg transition-colors ${
      active ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-400'
    }`}
  >
    {label}
    {active && (
      <motion.div 
        layoutId="activeTab"
        className="absolute -bottom-1 left-0 right-0 h-1 bg-indigo-600 rounded-full"
      />
    )}
  </Link>
);

export default Navbar;

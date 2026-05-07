import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Layout, LogOut, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="px-4 pt-4 lg:pt-6 sticky top-0 z-[100] max-w-7xl mx-auto w-full">
      <nav className="bg-white/80 backdrop-blur-xl px-4 lg:px-8 py-3 flex items-center justify-between rounded-2xl shadow-sm border border-slate-200">
        <Link to="/" className="flex items-center gap-2.5 transition-transform hover:scale-105 active:scale-95">
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white shadow-sm">
            <Layout size={16} strokeWidth={2.5} />
          </div>
          <span className="text-sm font-black text-slate-900 uppercase tracking-tight">Nextstep Careers</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
          <div className="flex items-center gap-6">
            <NavLink to="/" label="Home" active={isActive('/')} />
            <NavLink to="/services" label="Services" active={isActive('/services')} />
            {user && (
              <>
                {user.role === 'admin' && <NavLink to="/admin" label="Admin" active={isActive('/admin')} />}
                <NavLink to="/my-requests" label="Tickets" active={isActive('/my-requests')} />
              </>
            )}
          </div>

          <div className="flex items-center gap-4 pl-8 border-l border-slate-100">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-xs lg:text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Authenticated</div>
                  <div className="text-xs lg:text-[11px] font-black text-slate-900 leading-none">{user.name}</div>
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="px-4 py-2 text-slate-500 font-black text-[11px] uppercase tracking-widest hover:text-slate-900 transition-all">
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-5 py-2 bg-slate-900 text-white rounded-lg font-black text-[11px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg active:scale-95"
                >
                  Join
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-all">
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile Nav Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden absolute top-full left-4 right-4 mt-2 p-6 bg-white rounded-2xl shadow-2xl border border-slate-200 z-[110]"
          >
            <div className="flex flex-col gap-6">
              <MobileNavLink to="/" label="Home" active={isActive('/')} onClick={() => setIsOpen(false)} />
              <MobileNavLink to="/services" label="Services" active={isActive('/services')} onClick={() => setIsOpen(false)} />
              {user && (
                <>
                  {user.role === 'admin' && <MobileNavLink to="/admin" label="Admin Portal" active={isActive('/admin')} onClick={() => setIsOpen(false)} />}
                  <MobileNavLink to="/my-requests" label="My Tickets" active={isActive('/my-requests')} onClick={() => setIsOpen(false)} />
                </>
              )}

              <div className="pt-6 border-t border-slate-100">
                {user ? (
                  <button onClick={logout} className="flex items-center gap-2 text-rose-600 font-black text-[11px] uppercase tracking-widest">
                    <LogOut size={16} /> Terminate Session
                  </button>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Link to="/login" onClick={() => setIsOpen(false)} className="w-full py-3 bg-slate-50 text-slate-900 rounded-xl font-black text-[11px] uppercase tracking-widest text-center">Login</Link>
                    <Link to="/signup" onClick={() => setIsOpen(false)} className="w-full py-3 bg-slate-900 text-white rounded-xl font-black text-[11px] uppercase tracking-widest text-center shadow-lg">Sign Up</Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const NavLink = ({ to, label, active }: { to: string, label: string, active: boolean }) => (
  <Link
    to={to}
    className={`relative py-1 font-black text-[11px] uppercase tracking-[0.15em] transition-colors ${active ? 'text-slate-900' : 'text-slate-400 hover:text-slate-900'
      }`}
  >
    {label}
    {active && (
      <motion.div
        layoutId="activeTab"
        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-slate-900 rounded-full"
      />
    )}
  </Link>
);

const MobileNavLink = ({ to, label, active, onClick }: { to: string, label: string, active: boolean, onClick: () => void }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`text-sm font-black uppercase tracking-widest ${active ? 'text-slate-900' : 'text-slate-400'}`}
  >
    {label}
  </Link>
);

export default Navbar;

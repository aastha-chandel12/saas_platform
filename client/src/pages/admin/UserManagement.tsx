import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Mail, Search, Trash2, ShieldAlert, User, X, AlertTriangle } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { toast } from '../../hooks/useToast';
import { motion, AnimatePresence } from 'framer-motion';

interface UserData {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

const UserManagement = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [userToDelete, setUserToDelete] = useState<UserData | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/api/users');
      setUsers(data);
    } catch (err) {
      toast('Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    setDeleting(true);
    
    try {
      // In a real app, you'd call api.delete(`/api/users/${userToDelete._id}`)
      setUsers(users.filter(u => u._id !== userToDelete._id));
      toast('User removed from system', 'success');
      setUserToDelete(null);
    } catch (err) {
      toast('Delete failed', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8 lg:p-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2 tracking-tight">User Administration</h1>
              <p className="text-slate-500 font-medium">Manage platform users, roles, and system access.</p>
            </div>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search users..."
                className="pl-12 pr-6 py-3 bg-white border border-slate-100 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none w-full md:w-80 font-bold text-sm"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Identity</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Access Role</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Created At</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-slate-50/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm shadow-sm">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-800 text-sm">{user.name}</div>
                            <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                              <Mail size={12} /> {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          user.role === 'admin' 
                            ? 'bg-rose-50 text-rose-600 border-rose-100' 
                            : 'bg-indigo-50 text-indigo-600 border-indigo-100'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 font-bold text-xs">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {user.role !== 'admin' && (
                            <button 
                              onClick={() => setUserToDelete(user)}
                              className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                          <button className="p-2 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                            <ShieldAlert size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {users.length === 0 && !loading && (
              <div className="py-32 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
                  <User size={32} />
                </div>
                <h3 className="text-slate-800 font-bold mb-1">No users directory</h3>
                <p className="text-slate-400 text-sm font-medium">There are currently no registered users on the platform.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {userToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-100"
            >
              <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                <div className="flex items-center gap-2 text-rose-600">
                  <AlertTriangle size={20} />
                  <h2 className="text-lg font-bold">Confirm Deletion</h2>
                </div>
                <button 
                  onClick={() => setUserToDelete(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Delete User?</h3>
                <p className="text-slate-500 font-medium mb-8">
                  Are you sure you want to delete <span className="text-slate-800 font-bold">{userToDelete.name}</span>? This action will permanently remove their access and cannot be undone.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setUserToDelete(null)}
                    className="flex-1 py-3 bg-slate-50 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-100 transition-all active:scale-95"
                  >
                    No, Cancel
                  </button>
                  <button
                    onClick={handleDeleteUser}
                    disabled={deleting}
                    className="flex-1 py-3 bg-rose-600 text-white rounded-xl font-bold text-sm hover:bg-rose-700 transition-all shadow-md shadow-rose-200 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {deleting ? 'Deleting...' : 'Yes, Delete'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserManagement;

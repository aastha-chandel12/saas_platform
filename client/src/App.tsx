import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoadingProvider } from './context/LoadingContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Services from './pages/Services';
import MyRequests from './pages/MyRequests';
import RequestService from './pages/RequestService';
import RequestDetail from './pages/RequestDetail';
import Feedback from './pages/Feedback';
import ToastContainer from './components/Toast';
import ScrollToTop from './components/ScrollToTop';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import RequestManagement from './pages/admin/RequestManagement';
import UserManagement from './pages/admin/UserManagement';
import FeedbackManagement from './pages/admin/FeedbackManagement';
import AdminAnalytics from './pages/admin/AdminAnalytics';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="flex h-screen w-full items-center justify-center bg-slate-50">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
    </div>
  );
  if (!user) return <Navigate to="/login" />;
  return <>{children}</>;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user || user.role !== 'admin') return <Navigate to="/dashboard" />;
  return <>{children}</>;
};

function App() {
  return (
    <LoadingProvider>
      <AuthProvider>
        <Router>
        <ScrollToTop />
        <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900 transition-colors duration-300">
          <ToastContainer />
          <Routes>
            {/* Admin Routes (No Global Navbar) */}
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/requests" element={<AdminRoute><RequestManagement /></AdminRoute>} />
            <Route path="/admin/analytics" element={<AdminRoute><AdminAnalytics /></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><UserManagement /></AdminRoute>} />
            <Route path="/admin/feedback" element={<AdminRoute><FeedbackManagement /></AdminRoute>} />

            {/* Public/User Routes (With Global Navbar) */}
            <Route path="*" element={
              <>
                <Navbar />
                <main className="flex-grow container mx-auto px-4">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/services" element={<Services />} />
                    
                    <Route
                      path="/dashboard"
                      element={
                        <ProtectedRoute>
                          <Dashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/my-requests"
                      element={
                        <ProtectedRoute>
                          <MyRequests />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/request-service"
                      element={
                        <ProtectedRoute>
                          <RequestService />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/request/:id"
                      element={
                        <ProtectedRoute>
                          <RequestDetail />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/feedback"
                      element={
                        <ProtectedRoute>
                          <Feedback />
                        </ProtectedRoute>
                      }
                    />
                  </Routes>
                </main>
                <footer className="py-12 border-t border-slate-100 bg-white mt-12">
                  <div className="container mx-auto px-6 text-center">
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
                      © 2026 Servicely Platform • All Rights Reserved
                    </p>
                  </div>
                </footer>
              </>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  </LoadingProvider>
);
}

export default App;

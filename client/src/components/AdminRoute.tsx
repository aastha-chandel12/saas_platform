import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (user && user.role === 'admin') {
    return <>{children}</>;
  } else {
    return <Navigate to="/login" replace />;
  }
};

export default AdminRoute;

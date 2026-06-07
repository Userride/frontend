import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AnalysisDetail from './pages/AnalysisDetail';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>Loading...</div>;
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Landing />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route
          path="dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="analysis/:id"
          element={
            <PrivateRoute>
              <AnalysisDetail />
            </PrivateRoute>
          }
        />
      </Route>
    </Routes>
  );
}

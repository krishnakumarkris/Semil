import { Navigate, Route, Routes } from 'react-router-dom';
import AuthLayout from './components/AuthLayout';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import SendMoney from './pages/SendMoney';
import Transactions from './pages/Transactions';
import CheckBalance from './pages/CheckBalance';
import Profile from './pages/Profile';
import DashboardLayout from './components/DashboardLayout';
import { useAuth } from './context/AuthContext';

function App() {
  const { loading } = useAuth();
  if (loading) return <LoadingSpinner fullPage />;

  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/send-money" element={<SendMoney />} />
          <Route path="/check-balance" element={<CheckBalance />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>
      <Route path="/" element={<Navigate replace to="/dashboard" />} />
      <Route path="*" element={<Navigate replace to="/dashboard" />} />
    </Routes>
  );
}

export default App;

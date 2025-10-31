
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
// Fix: Changed alias imports to relative paths for clarity and to resolve build issues.
import { User } from './types';
import LoginClient from './pages/LoginClient';
import LoginAdmin from './pages/LoginAdmin';
import Signup from './pages/Signup';
import ClientDashboard from './pages/ClientDashboard';
import AdminDashboard from './pages/AdminDashboard';
import FeedbackExplorer from './pages/FeedbackExplorer';
import Products from './pages/Products';
import Alerts from './pages/Alerts';
import Settings from './pages/Settings';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import { getStoredAuthData, clearAuthData } from './utils/authService';
import LoadingSpinner from './components/LoadingSpinner';


const LoadingScreen = () => (
    <div className="flex-1 flex flex-col items-center justify-center bg-violet-900/50 text-white">
        <svg className="animate-spin h-8 w-8 text-white mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-lg">Loading dashboard data...</p>
    </div>
);


const ProtectedApp: React.FC<{ user: User; onLogout: () => void }> = ({ user, onLogout }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500); // Simulate data fetch
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-violet-950/90">
      <Sidebar userRole={user.role} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar user={user} onLogout={onLogout} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8">
          {isLoading ? <LoadingScreen /> : (
            <Routes>
              <Route path="/" element={user.role === 'admin' ? <AdminDashboard /> : <ClientDashboard />} />
              <Route path="/feedback" element={<FeedbackExplorer />} />
              <Route path="/products" element={<Products />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          )}
        </main>
      </div>
    </div>
  );
};

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const authData = getStoredAuthData();
    if (authData) {
      setUser(authData.user);
    }
    setAuthChecked(true);
  }, []);

  const handleLogout = () => {
    clearAuthData();
    setUser(null);
  };
  
  if (!authChecked) {
    return (
        <div className="min-h-screen bg-violet-950 flex justify-center items-center">
            <LoadingSpinner />
        </div>
      );
  }

  return (
    <HashRouter>
      <Routes>
        <Route path="/login-client" element={user ? <Navigate to="/" /> : <LoginClient setUser={setUser} />} />
        <Route path="/login-admin" element={user ? <Navigate to="/" /> : <LoginAdmin setUser={setUser} />} />
        <Route path="/signup" element={user ? <Navigate to="/" /> : <Signup />} />
        <Route
          path="/*"
          element={
            user ? (
              <ProtectedApp user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login-client" />
            )
          }
        />
      </Routes>
    </HashRouter>
  );
}

export default App;

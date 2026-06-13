import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import { ToastContainer } from './components/Toast';
import Login from './pages/Login';
import Register from './pages/Register';
import VolunteerDashboard from './components/VolunteerDashboard';
import AdminDashboard from './components/AdminDashboard';

// Helper route mapping "/" to the correct panel based on auth & role
const RootRedirect = () => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return user.role === 'admin' ? (
    <Navigate to="/admin" replace />
  ) : (
    <Navigate to="/dashboard" replace />
  );
};

// Component preventing access to auth pages if logged in
const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  
  if (user) {
    return user.role === 'admin' ? (
      <Navigate to="/admin" replace />
    ) : (
      <Navigate to="/dashboard" replace />
    );
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-slate-50">
          <Navbar />
          <main className="flex-1 w-full">
            <Routes>
              {/* Public Authentications */}
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                }
              />

              {/* Protected Volunteer Space */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <VolunteerDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Protected Admin Command Center */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Root Catch & Redirects */}
              <Route path="/" element={<RootRedirect />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <ToastContainer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

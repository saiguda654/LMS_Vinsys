import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginForm } from './components/auth/LoginForm';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { TrainerDashboard } from './pages/trainer/TrainerDashboard';
import { LoadingSpinner } from './components/ui/LoadingSpinner';

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      {/* Admin Routes */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Routes>
              <Route index element={<AdminDashboard />} />
              {/* Add more admin routes here */}
            </Routes>
          </ProtectedRoute>
        }
      />

      {/* Trainer Routes */}
      <Route
        path="/trainer/*"
        element={
          <ProtectedRoute allowedRoles={['trainer']}>
            <Routes>
              <Route index element={<TrainerDashboard />} />
              {/* Add more trainer routes here */}
            </Routes>
          </ProtectedRoute>
        }
      />

      {/* Learner Routes */}
      <Route
        path="/learner/*"
        element={
          <ProtectedRoute allowedRoles={['learner']}>
            <Routes>
              <Route index element={<div>Learner Dashboard - Coming Soon</div>} />
              {/* Add more learner routes here */}
            </Routes>
          </ProtectedRoute>
        }
      />

      {/* Default redirects based on role */}
      <Route
        path="/"
        element={
          user.role === 'admin' ? (
            <Navigate to="/admin" replace />
          ) : user.role === 'trainer' ? (
            <Navigate to="/trainer" replace />
          ) : (
            <Navigate to="/learner" replace />
          )
        }
      />

      {/* Unauthorized page */}
      <Route
        path="/unauthorized"
        element={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Unauthorized</h1>
              <p className="text-gray-600">You don't have permission to access this page.</p>
            </div>
          </div>
        }
      />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
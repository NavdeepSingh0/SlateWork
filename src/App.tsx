import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/store/AuthContext';
import { AppProvider } from '@/store/AppContext';
import { Layout } from '@/components/layout/Layout';
import { LandingPage } from '@/pages/Landing';
import { Dashboard } from '@/pages/Dashboard';
import { ArticlesPage } from '@/pages/Articles';
import { ArticleView } from '@/pages/ArticleView';
import { Discussions } from '@/pages/Discussions';
import { ArchivePage } from '@/pages/Archive';
import { SettingsPage } from '@/pages/Settings';
import { LoginPage } from '@/pages/Login';
import './App.css';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-text-muted border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Protected app routes */}
      <Route
        element={
          <ProtectedRoute>
            <AppProvider>
              <Layout />
            </AppProvider>
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/articles" element={<ArticlesPage />} />
        <Route path="/articles/:id" element={<ArticleView />} />
        <Route path="/discussions" element={<Discussions />} />
        <Route path="/archive" element={<ArchivePage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

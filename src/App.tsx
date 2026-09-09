import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { api } from './services/api';
import { SiteSettings } from './types';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/Toast';

// Páginas Públicas
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { WorkDetailPage } from './pages/WorkDetailPage';
import { AboutPage } from './pages/AboutPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Páginas Administrativas
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminWorkEditorPage } from './pages/admin/AdminWorkEditorPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

// Rola suavemente ao topo ao navegar
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);
  return null;
};

// Rota Protegida do Administrador
const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-xs text-ink-muted">
        Verificando credenciais...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

// Layout Geral da Aplicação
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    api.getSettings().then(setSettings).catch(console.error);
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-amber-marker selection:text-ink">
      <Header siteName={settings?.site_name || 'Entrelinhas'} />
      <main className="flex-1">
        {children}
      </main>
      <Footer
        siteName={settings?.site_name || 'Entrelinhas'}
        authorName={settings?.author_name || 'Ademir'}
      />
      <ToastContainer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <AppLayout>
          <Routes>
            {/* Rotas Públicas */}
            <Route path="/" element={<HomePage />} />
            <Route path="/trabalhos" element={<CatalogPage />} />
            <Route path="/trabalhos/:slug" element={<WorkDetailPage />} />
            <Route path="/sobre" element={<AboutPage />} />

            {/* Rotas Administrativas */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route
              path="/admin"
              element={
                <ProtectedAdminRoute>
                  <AdminDashboardPage />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/trabalhos/novo"
              element={
                <ProtectedAdminRoute>
                  <AdminWorkEditorPage />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/trabalhos/editar/:id"
              element={
                <ProtectedAdminRoute>
                  <AdminWorkEditorPage />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/categorias"
              element={
                <ProtectedAdminRoute>
                  <AdminCategoriesPage />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/configuracoes"
              element={
                <ProtectedAdminRoute>
                  <AdminSettingsPage />
                </ProtectedAdminRoute>
              }
            />

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </AuthProvider>
  );
};
export default App;

import { Routes, Route } from 'react-router-dom';
import { adminRoutes } from './Routes';
import { ProtectedRoute } from './ProtectedRoute';
import NotFoundPage from '@/components/common/NotFoundPage';
import Layout from '@/features/admin/components/AdminLayout';

export const AdminRoutes = () => {
  return (
    <Routes>
      {adminRoutes.map(({ path, element: Element, roles, permission }) => (
        <Route
          key={path}
          path={path}
          element={
            <ProtectedRoute roles={roles} permission={permission}>
              <Layout>
                <Element />
              </Layout>
            </ProtectedRoute>
          }
        />
      ))}
      <Route
        path="*"
        element={
          <Layout>
            <NotFoundPage />
          </Layout>
        }
      />
    </Routes>
  );
};

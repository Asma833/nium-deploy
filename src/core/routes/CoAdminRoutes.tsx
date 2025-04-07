import { Routes, Route } from 'react-router-dom';
import { coAdminRoutes } from './RoutesConfig';
import { ProtectedRoute } from './ProtectedRoute';
import NotFoundPage from '@/components/common/NotFoundPage';
import Layout from '@/features/co-admin/components/CoAdminLayout';

export const CoAdminRoutes = () => {
  return (
    <Routes>
      {coAdminRoutes.map(({ path, element: Element, roles, permission }) => (
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

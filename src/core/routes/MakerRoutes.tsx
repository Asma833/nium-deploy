import { Routes, Route } from 'react-router-dom';
import { makerRoutes } from './Routes';
import { ProtectedRoute } from './ProtectedRoute';
import NotFoundPage from '@/components/common/NotFoundPage';
import SidebarLayout from '@/components/layout/SidebarLayout';

export const MakerRoutes = () => {
  return (
    <Routes>
      {makerRoutes.map(({ path, element: Element, roles, permission }) => (
        <Route
          key={path}
          path={path}
          element={
            <ProtectedRoute roles={roles} permission={permission}>
              <SidebarLayout>
                <Element />
              </SidebarLayout>
            </ProtectedRoute>
          }
        />
      ))}
      <Route
        path="*"
        element={
          <SidebarLayout>
            <NotFoundPage />
          </SidebarLayout>
        }
      />
    </Routes>
  );
};

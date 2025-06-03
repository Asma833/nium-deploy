import { Routes, Route } from 'react-router-dom';
import { checkerRoutes } from './Routes';
import { ProtectedRoute } from './ProtectedRoute';
import CheckerLayout from '@/components/layout/SidebarLayout';
import NotFoundPage from '@/components/common/NotFoundPage';

export const MakerRoutes = () => {
  return (
    <Routes>
      {checkerRoutes.map(({ path, element: Element, roles, permission }) => (
        <Route
          key={path}
          path={path}
          element={
            <ProtectedRoute roles={roles} permission={permission}>
              <CheckerLayout>
                <Element />
              </CheckerLayout>
            </ProtectedRoute>
          }
        />
      ))}
      <Route
        path="*"
        element={
          <CheckerLayout>
            <NotFoundPage />
          </CheckerLayout>
        }
      />
    </Routes>
  );
};

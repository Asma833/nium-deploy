import { Routes, Route } from 'react-router-dom';
import { adminRoutes } from './Routes';
import { ProtectedRoute } from './ProtectedRoute';
import NotFoundPage from '@/components/common/NotFoundPage';
import SidebarLayout from '@/components/layout/SidebarLayout';

export const AdminRoutes = () => {
  return (
    <Routes>
      {adminRoutes.map(({ path, element: Element, roles, permission }) => (
        <Route
          key={path}
          path={path}
          element={
            <ProtectedRoute roles={roles} permission={permission}>
              <SidebarLayout>
                <Element setDialogTitle={() => {}} rowData={null} refetch={() => {}} setIsModalOpen={() => {}} />
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

import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { TableTabsLayoutProps } from '../../types/admin.types';

const TableTabsLayout = (props: TableTabsLayoutProps) => {
  const { children, tabs, customNavigate } = props;
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  // Default tabs if none provided
  const defaultTabs = [
    { label: 'List', path: '/admin/users'},
    { label: 'Create User', path: '/admin/users/create-user'},
    { label: 'List', path: '/admin/maker'},
    { label: 'Create User', path: '/admin/maker/create-maker'},
  ];

  const navigationTabs = tabs || defaultTabs;

  // Function to handle navigation
  const handleNavigation = (path: string) => {
    if (customNavigate) {
      customNavigate(path);
    } else {
      navigate(path);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-4 flex gap-4">
        {navigationTabs.map((tab, index) => (
          <button
            key={index}
            className={cn(
              'px-4 py-2 rounded-md transition-colors min-w-[150px]',
              currentPath === tab.path ? 'bg-primary text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            )}
            onClick={() => handleNavigation(tab.path)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {children}
    </div>
  );
};

export default TableTabsLayout;

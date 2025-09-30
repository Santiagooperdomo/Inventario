import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const Breadcrumb = ({ items = [] }) => {
  const location = useLocation();

  // Auto-generate breadcrumbs if no items provided
  const generateBreadcrumbs = () => {
    const pathMap = {
      '/inventory-management-dashboard': { label: 'Dashboard', icon: 'LayoutDashboard' },
      '/product-management-interface': { label: 'Products', icon: 'Package' },
      '/category-management-system': { label: 'Categories', icon: 'FolderTree', parent: '/product-management-interface' },
      '/inventory-tracking-console': { label: 'Inventory Tracking', icon: 'Warehouse' },
      '/reporting-and-analytics-center': { label: 'Reports & Analytics', icon: 'BarChart3' },
    };

    const currentPath = location?.pathname;
    const currentPage = pathMap?.[currentPath];
    
    if (!currentPage) return [];

    const breadcrumbs = [];
    
    // Add parent if exists
    if (currentPage?.parent) {
      const parent = pathMap?.[currentPage?.parent];
      if (parent) {
        breadcrumbs?.push({
          label: parent?.label,
          path: currentPage?.parent,
          icon: parent?.icon
        });
      }
    }
    
    // Add current page
    breadcrumbs?.push({
      label: currentPage?.label,
      path: currentPath,
      icon: currentPage?.icon,
      current: true
    });

    return breadcrumbs;
  };

  const breadcrumbItems = items?.length > 0 ? items : generateBreadcrumbs();

  if (breadcrumbItems?.length <= 1) return null;

  return (
    <nav className="flex items-center space-x-2 text-sm mb-6" aria-label="Breadcrumb">
      <div className="flex items-center space-x-2">
        <Icon name="Home" size={16} className="text-muted-foreground" />
        <Link
          to="/inventory-management-dashboard"
          className="text-muted-foreground hover:text-foreground transition-micro"
        >
          Home
        </Link>
      </div>
      {breadcrumbItems?.map((item, index) => (
        <div key={item?.path || index} className="flex items-center space-x-2">
          <Icon name="ChevronRight" size={14} className="text-muted-foreground" />
          
          {item?.current ? (
            <div className="flex items-center space-x-2">
              {item?.icon && <Icon name={item?.icon} size={16} className="text-foreground" />}
              <span className="font-medium text-foreground" aria-current="page">
                {item?.label}
              </span>
            </div>
          ) : (
            <Link
              to={item?.path}
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-micro"
            >
              {item?.icon && <Icon name={item?.icon} size={16} />}
              <span>{item?.label}</span>
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumb;
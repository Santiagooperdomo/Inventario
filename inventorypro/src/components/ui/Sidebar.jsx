import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Sidebar = ({ isCollapsed = false, onToggleCollapse, user }) => {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/inventory-management-dashboard',
      icon: 'LayoutDashboard',
      description: 'Overview & KPIs'
    },
    {
      label: 'Products',
      path: '/product-management-interface',
      icon: 'Package',
      description: 'Manage inventory items',
      children: [
        { label: 'All Products', path: '/product-management-interface' },
        { label: 'Categories', path: '/category-management-system' }
      ]
    },
    {
      label: 'Inventory',
      path: '/inventory-tracking-console',
      icon: 'Warehouse',
      description: 'Stock levels & tracking'
    },
    {
      label: 'Reports',
      path: '/reporting-and-analytics-center',
      icon: 'BarChart3',
      description: 'Analytics & insights'
    }
  ];

  const handleMobileToggle = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const closeMobile = () => {
    setIsMobileOpen(false);
  };

  const isActiveRoute = (path) => {
    if (path === '/product-management-interface') {
      return location?.pathname === path || location?.pathname === '/category-management-system';
    }
    return location?.pathname === path;
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo Section */}
      <div className={`flex items-center px-6 py-4 border-b border-border ${isCollapsed ? 'justify-center px-4' : ''}`}>
        <Link to="/inventory-management-dashboard" className="flex items-center space-x-3" onClick={closeMobile}>
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon name="Package" size={20} color="white" />
          </div>
          {!isCollapsed && (
            <span className="text-xl font-semibold text-foreground">InventoryPro</span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigationItems?.map((item) => {
          const isActive = isActiveRoute(item?.path);
          const hasChildren = item?.children && item?.children?.length > 0;

          return (
            <div key={item?.path}>
              <Link
                to={item?.path}
                onClick={closeMobile}
                className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-micro group ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
                title={isCollapsed ? item?.label : ''}
              >
                <Icon 
                  name={item?.icon} 
                  size={20} 
                  className="flex-shrink-0"
                />
                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">{item?.label}</div>
                    <div className={`text-xs mt-0.5 ${
                      isActive ? 'text-primary-foreground/80' : 'text-muted-foreground'
                    }`}>
                      {item?.description}
                    </div>
                  </div>
                )}
                {!isCollapsed && hasChildren && (
                  <Icon 
                    name="ChevronRight" 
                    size={16} 
                    className={`transition-transform ${isActive ? 'rotate-90' : ''}`}
                  />
                )}
              </Link>
              {/* Sub-navigation for Products */}
              {!isCollapsed && hasChildren && isActive && (
                <div className="ml-6 mt-2 space-y-1">
                  {item?.children?.map((child) => (
                    <Link
                      key={child?.path}
                      to={child?.path}
                      onClick={closeMobile}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm transition-micro ${
                        location?.pathname === child?.path
                          ? 'bg-primary/10 text-primary font-medium' :'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                      }`}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
                      <span>{child?.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* System Status */}
      {!isCollapsed && (
        <div className="px-4 py-4 border-t border-border">
          <div className="bg-muted rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-success rounded-full" />
              <span className="text-sm font-medium text-foreground">System Status</span>
            </div>
            <div className="space-y-1 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>ERP Connection</span>
                <span className="text-success">Online</span>
              </div>
              <div className="flex justify-between">
                <span>Last Sync</span>
                <span>2 min ago</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Collapse Toggle */}
      <div className="px-4 py-4 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className={`w-full ${isCollapsed ? 'px-2' : ''}`}
        >
          <Icon 
            name={isCollapsed ? "ChevronRight" : "ChevronLeft"} 
            size={16} 
          />
          {!isCollapsed && <span className="ml-2">Collapse</span>}
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex lg:fixed lg:inset-y-0 lg:left-0 lg:z-100 lg:flex-col bg-card border-r border-border transition-all duration-300 ${
        isCollapsed ? 'lg:w-20' : 'lg:w-80'
      }`}>
        <SidebarContent />
      </aside>
      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-100 bg-background/80 backdrop-blur-sm" onClick={closeMobile}>
          <aside className="fixed inset-y-0 left-0 w-80 bg-card border-r border-border animate-slide-in" onClick={(e) => e?.stopPropagation()}>
            <SidebarContent />
          </aside>
        </div>
      )}
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={handleMobileToggle}
        className="lg:hidden fixed top-4 left-4 z-90 bg-card border border-border"
      >
        <Icon name="Menu" size={20} />
      </Button>
    </>
  );
};

export default Sidebar;
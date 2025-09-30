import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = ({ user, onLogout, notifications = [] }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { label: 'Dashboard', path: '/inventory-management-dashboard', icon: 'LayoutDashboard' },
    { label: 'Products', path: '/product-management-interface', icon: 'Package' },
    { label: 'Inventory', path: '/inventory-tracking-console', icon: 'Warehouse' },
    { label: 'Reports', path: '/reporting-and-analytics-center', icon: 'BarChart3' },
  ];

  const handleProfileToggle = () => {
    setIsProfileOpen(!isProfileOpen);
    setIsNotificationsOpen(false);
  };

  const handleNotificationsToggle = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    setIsProfileOpen(false);
  };

  const handleLogout = () => {
    setIsProfileOpen(false);
    onLogout?.();
  };

  const unreadCount = notifications?.filter(n => !n?.read)?.length;

  return (
    <header className="bg-card border-b border-border h-16 flex items-center justify-between px-6 fixed top-0 left-0 right-0 z-50">
      {/* Logo */}
      <div className="flex items-center">
        <Link to="/inventory-management-dashboard" className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Icon name="Package" size={20} color="white" />
          </div>
          <span className="text-xl font-semibold text-foreground">InventoryPro</span>
        </Link>
      </div>
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center space-x-1">
        {navigationItems?.map((item) => {
          const isActive = location?.pathname === item?.path;
          return (
            <Link
              key={item?.path}
              to={item?.path}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-micro ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon name={item?.icon} size={18} />
              <span className="font-medium">{item?.label}</span>
            </Link>
          );
        })}
      </nav>
      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNotificationsToggle}
            className="relative"
          >
            <Icon name="Bell" size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-error text-error-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Button>

          {isNotificationsOpen && (
            <div className="absolute right-0 top-12 w-80 bg-popover border border-border rounded-lg elevation-2 z-60">
              <div className="p-4 border-b border-border">
                <h3 className="font-semibold text-foreground">Notifications</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications?.length > 0 ? (
                  notifications?.slice(0, 5)?.map((notification, index) => (
                    <div
                      key={index}
                      className={`p-4 border-b border-border last:border-b-0 ${
                        !notification?.read ? 'bg-accent/5' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          notification?.type === 'warning' ? 'bg-warning' :
                          notification?.type === 'error'? 'bg-error' : 'bg-success'
                        }`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">{notification?.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">{notification?.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">{notification?.time}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <Icon name="Bell" size={32} className="mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No notifications</p>
                  </div>
                )}
              </div>
              {notifications?.length > 5 && (
                <div className="p-3 border-t border-border">
                  <Button variant="ghost" size="sm" className="w-full">
                    View all notifications
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative">
          <Button
            variant="ghost"
            onClick={handleProfileToggle}
            className="flex items-center space-x-2 px-3"
          >
            <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
              <Icon name="User" size={16} color="white" />
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-foreground">{user?.name || 'User'}</p>
              <p className="text-xs text-muted-foreground">{user?.role || 'Manager'}</p>
            </div>
            <Icon name="ChevronDown" size={16} className="text-muted-foreground" />
          </Button>

          {isProfileOpen && (
            <div className="absolute right-0 top-12 w-56 bg-popover border border-border rounded-lg elevation-2 z-60">
              <div className="p-3 border-b border-border">
                <p className="font-medium text-foreground">{user?.name || 'User Name'}</p>
                <p className="text-sm text-muted-foreground">{user?.email || 'user@company.com'}</p>
                <p className="text-xs text-muted-foreground mt-1">{user?.role || 'Inventory Manager'}</p>
              </div>
              <div className="py-2">
                <button className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted transition-micro flex items-center space-x-2">
                  <Icon name="User" size={16} />
                  <span>Profile Settings</span>
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted transition-micro flex items-center space-x-2">
                  <Icon name="Settings" size={16} />
                  <span>Preferences</span>
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted transition-micro flex items-center space-x-2">
                  <Icon name="HelpCircle" size={16} />
                  <span>Help & Support</span>
                </button>
                <div className="border-t border-border mt-2 pt-2">
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-error hover:bg-muted transition-micro flex items-center space-x-2"
                  >
                    <Icon name="LogOut" size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => {/* Mobile menu toggle logic */}}
        >
          <Icon name="Menu" size={20} />
        </Button>
      </div>
    </header>
  );
};

export default Header;
import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import ReportingAndAnalyticsCenter from './pages/reporting-and-analytics-center';
import InventoryManagementDashboard from './pages/inventory-management-dashboard';
import InventoryTrackingConsole from './pages/inventory-tracking-console';
import ProductManagementInterface from './pages/product-management-interface';
import LoginAndAuthentication from './pages/login-and-authentication';
import CategoryManagementSystem from './pages/category-management-system';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<CategoryManagementSystem />} />
        <Route path="/reporting-and-analytics-center" element={<ReportingAndAnalyticsCenter />} />
        <Route path="/inventory-management-dashboard" element={<InventoryManagementDashboard />} />
        <Route path="/inventory-tracking-console" element={<InventoryTrackingConsole />} />
        <Route path="/product-management-interface" element={<ProductManagementInterface />} />
        <Route path="/login-and-authentication" element={<LoginAndAuthentication />} />
        <Route path="/category-management-system" element={<CategoryManagementSystem />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;

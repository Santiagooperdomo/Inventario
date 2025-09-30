import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import AlertNotificationBar, { sampleAlerts } from '../../components/ui/AlertNotificationBar';

// Import dashboard components
import KPICard from './components/KPICard';
import StockMovementChart from './components/StockMovementChart';
import LocationSummary from './components/LocationSummary';
import ActivityFeed from './components/ActivityFeed';
import CategoryTree from './components/CategoryTree';
import QuickActions from './components/QuickActions';
import SystemStatus from './components/SystemStatus';

const InventoryManagementDashboard = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [alerts, setAlerts] = useState(sampleAlerts);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Mock user data
  const user = {
    name: 'María González',
    email: 'maria.gonzalez@inventorypro.com',
    role: 'Gerente de Inventario',
    avatar: 'https://randomuser.me/api/portraits/women/32.jpg'
  };

  // Mock notifications
  const notifications = [
    {
      id: 1,
      type: 'warning',
      title: 'Stock Bajo',
      message: '15 productos requieren reposición inmediata',
      time: 'hace 5 min',
      read: false
    },
    {
      id: 2,
      type: 'success',
      title: 'Sincronización Completada',
      message: 'Datos actualizados con el sistema ERP',
      time: 'hace 10 min',
      read: false
    },
    {
      id: 3,
      type: 'info',
      title: 'Nuevo Pedido',
      message: 'Orden #ORD-2024-0157 recibida',
      time: 'hace 15 min',
      read: true
    }
  ];

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e?.ctrlKey) {
        switch (e?.key) {
          case '1':
            e?.preventDefault();
            setSelectedLocation('warehouse-1');
            break;
          case '2':
            e?.preventDefault();
            setSelectedLocation('store-1');
            break;
          case 'f':
            e?.preventDefault();
            // Focus search (would implement search functionality)
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handleLogout = () => {
    navigate('/login-and-authentication');
  };

  const handleDismissAlert = (alertId) => {
    setAlerts(prev => prev?.map(alert => 
      alert?.id === alertId ? { ...alert, dismissed: true } : alert
    ));
  };

  const locations = [
    { value: 'all', label: 'Todas las Ubicaciones' },
    { value: 'warehouse-1', label: 'Almacén Central' },
    { value: 'store-1', label: 'Tienda Norte' },
    { value: 'store-2', label: 'Tienda Sur' },
    { value: 'warehouse-2', label: 'Almacén Secundario' }
  ];

  // KPI data
  const kpiData = [
    {
      title: 'Valor Total del Inventario',
      value: '€2.8M',
      change: '+5.2%',
      changeType: 'increase',
      icon: 'TrendingUp',
      color: 'primary'
    },
    {
      title: 'Productos con Stock Bajo',
      value: '23',
      change: '-12%',
      changeType: 'decrease',
      icon: 'AlertTriangle',
      color: 'warning'
    },
    {
      title: 'Órdenes Pendientes',
      value: '156',
      change: '+8.1%',
      changeType: 'increase',
      icon: 'ShoppingCart',
      color: 'success'
    },
    {
      title: 'Productos Sin Stock',
      value: '5',
      change: '-60%',
      changeType: 'decrease',
      icon: 'Package',
      color: 'error'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header 
        user={user} 
        onLogout={handleLogout}
        notifications={notifications}
      />
      {/* Sidebar */}
      <Sidebar 
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        user={user}
      />
      {/* Main Content */}
      <main className={`transition-all duration-300 ${
        sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-80'
      } pt-16`}>
        <div className="p-6">
          {/* Breadcrumb */}
          <Breadcrumb />

          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Panel de Control de Inventario
              </h1>
              <p className="text-muted-foreground">
                Gestión centralizada de inventario y análisis en tiempo real
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Location Selector */}
              <div className="flex items-center space-x-2">
                <Icon name="MapPin" size={16} className="text-muted-foreground" />
                <select 
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e?.target?.value)}
                  className="bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {locations?.map(location => (
                    <option key={location?.value} value={location?.value}>
                      {location?.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Current Time */}
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Icon name="Clock" size={16} />
                <span>
                  {currentTime?.toLocaleTimeString('es-ES', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>

              {/* Refresh Button */}
              <Button variant="outline" size="sm">
                <Icon name="RefreshCw" size={16} className="mr-2" />
                Actualizar
              </Button>
            </div>
          </div>

          {/* Alert Notifications */}
          <AlertNotificationBar 
            alerts={alerts}
            onDismiss={handleDismissAlert}
          />

          {/* Dashboard Grid */}
          <div className="grid grid-cols-12 gap-6">
            {/* Left Sidebar - Category Tree */}
            <div className="col-span-12 lg:col-span-3">
              <CategoryTree isCollapsed={false} />
            </div>

            {/* Main Content Area */}
            <div className="col-span-12 lg:col-span-9">
              {/* KPI Cards Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
                {kpiData?.map((kpi, index) => (
                  <KPICard
                    key={index}
                    title={kpi?.title}
                    value={kpi?.value}
                    change={kpi?.change}
                    changeType={kpi?.changeType}
                    icon={kpi?.icon}
                    color={kpi?.color}
                  />
                ))}
              </div>

              {/* Charts and Analytics Row */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
                <StockMovementChart 
                  title="Movimiento de Stock (7 días)"
                  type="line"
                  height={350}
                  data={[]} // Add this missing required prop
                />
                <LocationSummary />
              </div>

              {/* Activity and Actions Row */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
                <ActivityFeed />
                <div className="space-y-6">
                  <QuickActions />
                  <SystemStatus />
                </div>
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-8 pt-6 border-t border-border">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center space-x-4">
                <span>Última sincronización: hace 2 min</span>
                <span>•</span>
                <span>Sistema operativo al 99.8%</span>
                <span>•</span>
                <span>5,247 productos activos</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>© {new Date()?.getFullYear()} InventoryPro</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InventoryManagementDashboard;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import AlertNotificationBar from '../../components/ui/AlertNotificationBar';

// Import components
import StockLevelsTab from './components/StockLevelsTab';
import MovementHistoryTab from './components/MovementHistoryTab';
import AlertsTab from './components/AlertsTab';
import FilterSidebar from './components/FilterSidebar';
import LocationSelector from './components/LocationSelector';
import AlertSummary from './components/AlertSummary';

const InventoryTrackingConsole = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('stock-levels');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [filterSidebarOpen, setFilterSidebarOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('warehouse-a');
  const [filters, setFilters] = useState({
    locations: [],
    categories: [],
    stockStatuses: [],
    dateRange: { start: '', end: '' },
    stockRange: { min: '', max: '' }
  });
  const [savedPresets, setSavedPresets] = useState([]);

  // Mock user data
  const user = {
    name: "María García",
    email: "maria.garcia@inventorypro.com",
    role: "manager",
    avatar: "https://randomuser.me/api/portraits/women/32.jpg"
  };

  // Mock notifications
  const notifications = [
    {
      id: 1,
      type: 'warning',
      title: 'Stock Bajo Detectado',
      message: '15 productos están por debajo del punto de reorden',
      time: 'hace 5 min',
      read: false
    },
    {
      id: 2,
      type: 'error',
      title: 'Error de Sincronización',
      message: 'Fallo en la conexión con el sistema ERP',
      time: 'hace 12 min',
      read: false
    },
    {
      id: 3,
      type: 'success',
      title: 'Inventario Actualizado',
      message: 'Sincronización completada exitosamente',
      time: 'hace 1 hora',
      read: true
    }
  ];

  // Mock locations data
  const locations = [
    {
      id: 'warehouse-a',
      name: 'Almacén Principal A',
      address: 'Calle Industrial 123, Madrid',
      totalProducts: 1247,
      totalStock: 45678,
      totalValue: 892340,
      lowStockItems: 23,
      activeProducts: 1200,
      inactiveProducts: 47,
      avgTurnover: 45,
      accuracy: 98.5
    },
    {
      id: 'warehouse-b',
      name: 'Almacén Secundario B',
      address: 'Avenida Logística 456, Barcelona',
      totalProducts: 856,
      totalStock: 32145,
      totalValue: 567890,
      lowStockItems: 12,
      activeProducts: 820,
      inactiveProducts: 36,
      avgTurnover: 52,
      accuracy: 97.2
    },
    {
      id: 'store-central',
      name: 'Tienda Central',
      address: 'Plaza Mayor 789, Madrid',
      totalProducts: 432,
      totalStock: 8765,
      totalValue: 234567,
      lowStockItems: 8,
      activeProducts: 425,
      inactiveProducts: 7,
      avgTurnover: 28,
      accuracy: 99.1
    }
  ];

  // Mock sync status
  const syncStatus = {
    status: 'online',
    lastSync: 'hace 2 minutos'
  };

  // Mock stock data
  const stockData = [
    {
      id: 1,
      sku: 'ELEC-001',
      productName: 'iPhone 15 Pro 128GB',
      category: 'Smartphones',
      currentStock: 45,
      reservedQuantity: 8,
      availableStock: 37,
      reorderPoint: 20,
      location: 'warehouse-a',
      unitCost: 899.99,
      lastUpdated: new Date(Date.now() - 300000)
    },
    {
      id: 2,
      sku: 'ELEC-002',
      productName: 'Samsung Galaxy S24 256GB',
      category: 'Smartphones',
      currentStock: 12,
      reservedQuantity: 3,
      availableStock: 9,
      reorderPoint: 15,
      location: 'warehouse-a',
      unitCost: 749.99,
      lastUpdated: new Date(Date.now() - 600000)
    },
    {
      id: 3,
      sku: 'CLOTH-001',
      productName: 'Camiseta Básica Algodón',
      category: 'Ropa',
      currentStock: 0,
      reservedQuantity: 0,
      availableStock: 0,
      reorderPoint: 50,
      location: 'store-central',
      unitCost: 19.99,
      lastUpdated: new Date(Date.now() - 900000)
    },
    {
      id: 4,
      sku: 'HOME-001',
      productName: 'Mesa de Comedor Roble',
      category: 'Muebles',
      currentStock: 150,
      reservedQuantity: 5,
      availableStock: 145,
      reorderPoint: 10,
      location: 'warehouse-b',
      unitCost: 299.99,
      lastUpdated: new Date(Date.now() - 1200000)
    },
    {
      id: 5,
      sku: 'ELEC-003',
      productName: 'MacBook Air M3 13"',
      category: 'Laptops',
      currentStock: 28,
      reservedQuantity: 12,
      availableStock: 16,
      reorderPoint: 25,
      location: 'warehouse-a',
      unitCost: 1199.99,
      lastUpdated: new Date(Date.now() - 1500000)
    }
  ];

  // Mock movement history data
  const movementData = [
    {
      id: 1,
      timestamp: new Date(Date.now() - 1800000),
      type: 'sale',
      sku: 'ELEC-001',
      productName: 'iPhone 15 Pro 128GB',
      category: 'Smartphones',
      quantity: -2,
      previousStock: 47,
      newStock: 45,
      location: 'Almacén A',
      user: 'maria.garcia',
      userName: 'María García',
      reference: 'VTA-2024-001234',
      notes: 'Venta online - Pedido #12345'
    },
    {
      id: 2,
      timestamp: new Date(Date.now() - 3600000),
      type: 'purchase',
      sku: 'CLOTH-001',
      productName: 'Camiseta Básica Algodón',
      category: 'Ropa',
      quantity: 100,
      previousStock: 0,
      newStock: 100,
      location: 'Tienda Central',
      user: 'carlos.lopez',
      userName: 'Carlos López',
      reference: 'COM-2024-005678',
      notes: 'Reposición de stock - Proveedor TextilMax'
    },
    {
      id: 3,
      timestamp: new Date(Date.now() - 5400000),
      type: 'adjustment',
      sku: 'HOME-001',
      productName: 'Mesa de Comedor Roble',
      category: 'Muebles',
      quantity: -2,
      previousStock: 152,
      newStock: 150,
      location: 'Almacén B',
      user: 'ana.martinez',
      userName: 'Ana Martínez',
      reference: 'AJU-2024-000123',
      notes: 'Ajuste por daño en transporte'
    },
    {
      id: 4,
      timestamp: new Date(Date.now() - 7200000),
      type: 'transfer',
      sku: 'ELEC-003',
      productName: 'MacBook Air M3 13"',
      category: 'Laptops',
      quantity: 5,
      previousStock: 23,
      newStock: 28,
      location: 'Almacén A',
      user: 'system',
      userName: 'Sistema Automático',
      reference: 'TRA-2024-000456',
      notes: 'Transferencia desde Almacén B'
    }
  ];

  // Mock alerts data
  const alertsData = [
    {
      id: 1,
      type: 'low-stock',
      severity: 'high',
      status: 'active',
      title: 'Stock Bajo - Samsung Galaxy S24',
      description: 'El producto está por debajo del punto de reorden (15 unidades)',
      sku: 'ELEC-002',
      productName: 'Samsung Galaxy S24 256GB',
      location: 'Almacén A',
      createdAt: new Date(Date.now() - 1800000),
      acknowledgedAt: null,
      resolvedAt: null
    },
    {
      id: 2,
      type: 'out-of-stock',
      severity: 'critical',
      status: 'active',
      title: 'Sin Stock - Camiseta Básica',
      description: 'El producto se ha agotado completamente',
      sku: 'CLOTH-001',
      productName: 'Camiseta Básica Algodón',
      location: 'Tienda Central',
      createdAt: new Date(Date.now() - 3600000),
      acknowledgedAt: null,
      resolvedAt: null
    },
    {
      id: 3,
      type: 'discrepancy',
      severity: 'medium',
      status: 'acknowledged',
      title: 'Discrepancia de Inventario',
      description: 'Diferencia detectada entre stock físico y sistema',
      sku: 'HOME-001',
      productName: 'Mesa de Comedor Roble',
      location: 'Almacén B',
      createdAt: new Date(Date.now() - 5400000),
      acknowledgedAt: new Date(Date.now() - 3600000),
      resolvedAt: null
    }
  ];

  // Mock alerts summary
  const alertsSummary = {
    critical: 1,
    lowStock: 1,
    outOfStock: 1,
    discrepancies: 1,
    recent: [
      {
        id: 1,
        severity: 'critical',
        title: 'Sin Stock - Camiseta Básica',
        description: 'El producto se ha agotado completamente',
        timeAgo: 'hace 1 hora'
      },
      {
        id: 2,
        severity: 'high',
        title: 'Stock Bajo - Samsung Galaxy S24',
        description: 'Por debajo del punto de reorden',
        timeAgo: 'hace 30 min'
      }
    ]
  };

  const tabs = [
    {
      id: 'stock-levels',
      label: 'Niveles de Stock',
      icon: 'Package',
      count: stockData?.length
    },
    {
      id: 'movement-history',
      label: 'Historial de Movimientos',
      icon: 'Activity',
      count: movementData?.length
    },
    {
      id: 'alerts',
      label: 'Alertas',
      icon: 'Bell',
      count: alertsData?.filter(alert => alert?.status === 'active')?.length
    }
  ];

  // Handlers
  const handleLogout = () => {
    navigate('/login-and-authentication');
  };

  const handleStockUpdate = (itemId, newStock) => {
    console.log(`Updating stock for item ${itemId} to ${newStock}`);
    // Stock update logic would go here
  };

  const handleBulkTransfer = (selectedItems) => {
    console.log('Bulk transfer for items:', selectedItems);
    // Bulk transfer logic would go here
  };

  const handleExportHistory = (format) => {
    console.log(`Exporting movement history as ${format}`);
    // Export logic would go here
  };

  const handleAcknowledgeAlert = (alertId) => {
    console.log(`Acknowledging alert ${alertId}`);
    // Alert acknowledgment logic would go here
  };

  const handleBulkAcknowledge = (alertIds) => {
    console.log('Bulk acknowledging alerts:', alertIds);
    // Bulk acknowledgment logic would go here
  };

  const handleResolveAlert = (alertId) => {
    console.log(`Resolving alert ${alertId}`);
    // Alert resolution logic would go here
  };

  const handleSavePreset = (name, filterData) => {
    const newPreset = {
      id: Date.now(),
      name,
      filters: filterData,
      createdAt: new Date()
    };
    setSavedPresets(prev => [...prev, newPreset]);
    console.log('Saved filter preset:', newPreset);
  };

  const handleLoadPreset = (preset) => {
    setFilters(preset?.filters);
    console.log('Loaded filter preset:', preset);
  };

  const handleAlertQuickAction = (action, data) => {
    console.log(`Quick action: ${action}`, data);
    switch (action) {
      case 'filter': setActiveTab('alerts');
        break;
      case 'view': setActiveTab('alerts');
        break;
      case 'acknowledge':
        handleAcknowledgeAlert(data);
        break;
      case 'acknowledgeAll':
        const activeAlerts = alertsData?.filter(alert => alert?.status === 'active')?.map(alert => alert?.id);
        handleBulkAcknowledge(activeAlerts);
        break;
      case 'export':
        console.log('Exporting alerts');
        break;
      default:
        break;
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e?.ctrlKey || e?.metaKey) {
        switch (e?.key) {
          case '1':
            e?.preventDefault();
            setActiveTab('stock-levels');
            break;
          case '2':
            e?.preventDefault();
            setActiveTab('movement-history');
            break;
          case '3':
            e?.preventDefault();
            setActiveTab('alerts');
            break;
          case 'f':
            e?.preventDefault();
            setFilterSidebarOpen(true);
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'stock-levels':
        return (
          <StockLevelsTab
            stockData={stockData}
            onStockUpdate={handleStockUpdate}
            onBulkTransfer={handleBulkTransfer}
            userRole={user?.role}
          />
        );
      case 'movement-history':
        return (
          <MovementHistoryTab
            movementData={movementData}
            onExportHistory={handleExportHistory}
          />
        );
      case 'alerts':
        return (
          <AlertsTab
            alertsData={alertsData}
            onAcknowledgeAlert={handleAcknowledgeAlert}
            onBulkAcknowledge={handleBulkAcknowledge}
            onResolveAlert={handleResolveAlert}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header user={user} onLogout={handleLogout} notifications={notifications} />
      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          user={user}
        />

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${
          sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-80'
        } pt-16`}>
          <div className="p-6">
            {/* Breadcrumb */}
            <Breadcrumb />

            {/* Alert Notifications */}
            <AlertNotificationBar
              alerts={[
                {
                  id: 'sync-warning',
                  type: 'warning',
                  title: 'Sincronización Pendiente',
                  message: 'Hay cambios pendientes de sincronizar con el sistema ERP',
                  action: {
                    label: 'Sincronizar Ahora',
                    onClick: () => console.log('Sync now')
                  }
                }
              ]}
              onDismiss={(alertId) => console.log('Dismiss alert:', alertId)}
            />

            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Consola de Seguimiento de Inventario
                </h1>
                <p className="text-muted-foreground">
                  Monitoreo en tiempo real del stock, movimientos y alertas del inventario
                </p>
              </div>
              <div className="flex items-center space-x-3 mt-4 lg:mt-0">
                <Button
                  variant="outline"
                  iconName="Filter"
                  onClick={() => setFilterSidebarOpen(true)}
                >
                  Filtros
                </Button>
                <Button
                  variant="outline"
                  iconName="Download"
                >
                  Exportar
                </Button>
                <Button
                  variant="outline"
                  iconName="RefreshCw"
                >
                  Actualizar
                </Button>
              </div>
            </div>

            {/* Top Section - Location & Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2">
                <LocationSelector
                  selectedLocation={selectedLocation}
                  onLocationChange={setSelectedLocation}
                  locations={locations}
                  syncStatus={syncStatus}
                />
              </div>
              <div>
                <AlertSummary
                  alertsSummary={alertsSummary}
                  onViewAllAlerts={() => setActiveTab('alerts')}
                  onQuickAction={handleAlertQuickAction}
                />
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex gap-6">
              {/* Content */}
              <div className="flex-1">
                {/* Tabs */}
                <div className="bg-card border border-border rounded-lg">
                  <div className="border-b border-border">
                    <nav className="flex space-x-8 px-6">
                      {tabs?.map((tab) => (
                        <button
                          key={tab?.id}
                          onClick={() => setActiveTab(tab?.id)}
                          className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-micro ${
                            activeTab === tab?.id
                              ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                          }`}
                        >
                          <Icon name={tab?.icon} size={18} />
                          <span>{tab?.label}</span>
                          {tab?.count > 0 && (
                            <span className={`inline-flex items-center justify-center px-2 py-1 text-xs font-bold rounded-full ${
                              activeTab === tab?.id
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-muted-foreground'
                            }`}>
                              {tab?.count}
                            </span>
                          )}
                        </button>
                      ))}
                    </nav>
                  </div>

                  {/* Tab Content */}
                  <div className="p-6">
                    {renderTabContent()}
                  </div>
                </div>
              </div>

              {/* Filter Sidebar */}
              <FilterSidebar
                isOpen={filterSidebarOpen}
                onClose={() => setFilterSidebarOpen(false)}
                filters={filters}
                onFiltersChange={setFilters}
                onSavePreset={handleSavePreset}
                onLoadPreset={handleLoadPreset}
                savedPresets={savedPresets}
              />
            </div>

            {/* Keyboard Shortcuts Help */}
            <div className="mt-8 p-4 bg-muted/30 rounded-lg">
              <h4 className="font-medium text-foreground mb-2">Atajos de Teclado</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-muted-foreground">
                <div>Ctrl+1: Niveles de Stock</div>
                <div>Ctrl+2: Historial</div>
                <div>Ctrl+3: Alertas</div>
                <div>Ctrl+F: Abrir Filtros</div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default InventoryTrackingConsole;
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import AlertNotificationBar, { sampleAlerts } from '../../components/ui/AlertNotificationBar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

// Import components
import ReportSidebar from './components/ReportSidebar';
import DashboardTab from './components/DashboardTab';
import CustomReportsTab from './components/CustomReportsTab';
import ScheduledReportsTab from './components/ScheduledReportsTab';
import ReportTemplates from './components/ReportTemplates';

const ReportingAndAnalyticsCenter = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedCategory, setSelectedCategory] = useState('dashboard');
  const [alerts, setAlerts] = useState(sampleAlerts);
  const [currentLanguage, setCurrentLanguage] = useState('es');

  // Mock user data
  const user = {
    name: 'Ana García',
    email: 'ana.garcia@empresa.com',
    role: 'Analista de Reportes'
  };

  // Mock notifications
  const notifications = [
    {
      title: 'Reporte Programado Completado',
      message: 'El reporte semanal de inventario se ha generado exitosamente',
      time: 'hace 5 min',
      type: 'success',
      read: false
    },
    {
      title: 'Error en Sincronización',
      message: 'Fallo en la conexión con el sistema ERP',
      time: 'hace 15 min',
      type: 'error',
      read: false
    },
    {
      title: 'Nuevo Template Disponible',
      message: 'Se ha agregado el template "Análisis de Rentabilidad"',
      time: 'hace 1 hora',
      type: 'info',
      read: true
    }
  ];

  // Mock saved reports
  const savedReports = [
    {
      id: 'saved-1',
      name: 'Análisis ABC Mensual',
      lastModified: 'hace 2 días',
      type: 'abc-analysis'
    },
    {
      id: 'saved-2',
      name: 'Rotación por Categoría',
      lastModified: 'hace 1 semana',
      type: 'turnover-analysis'
    },
    {
      id: 'saved-3',
      name: 'Stock Crítico Q4',
      lastModified: 'hace 3 días',
      type: 'low-stock'
    },
    {
      id: 'saved-4',
      name: 'Rendimiento Proveedores',
      lastModified: 'hace 5 días',
      type: 'supplier-performance'
    },
    {
      id: 'saved-5',
      name: 'Valoración Inventario',
      lastModified: 'hace 1 día',
      type: 'financial-valuation'
    }
  ];

  // Mock scheduled reports
  const scheduledReports = [
    {
      id: 'sched-1',
      name: 'Reporte Semanal Inventario',
      nextRun: 'Lun 09:00',
      status: 'active'
    },
    {
      id: 'sched-2',
      name: 'Análisis Mensual ABC',
      nextRun: 'Día 1 08:00',
      status: 'active'
    },
    {
      id: 'sched-3',
      name: 'Alerta Stock Bajo',
      nextRun: 'Diario 07:30',
      status: 'paused'
    }
  ];

  const tabs = [
    { id: 'dashboard', label: 'Panel de Control', icon: 'LayoutDashboard' },
    { id: 'custom', label: 'Reportes Personalizados', icon: 'Settings' },
    { id: 'scheduled', label: 'Reportes Programados', icon: 'Calendar' },
    { id: 'templates', label: 'Plantillas', icon: 'FileText' }
  ];

  useEffect(() => {
    // Check for saved language preference
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const handleLogout = () => {
    console.log('Cerrando sesión...');
  };

  const handleDismissAlert = (alertId) => {
    setAlerts(prev => prev?.map(alert => 
      alert?.id === alertId ? { ...alert, dismissed: true } : alert
    ));
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    if (categoryId !== 'dashboard') {
      setActiveTab('custom');
    }
  };

  const handleReportSelect = (report) => {
    console.log('Reporte seleccionado:', report);
    setActiveTab('custom');
  };

  const handleDrillDown = (data) => {
    console.log('Drill down data:', data);
  };

  const handleSaveReport = (reportConfig) => {
    console.log('Guardando reporte:', reportConfig);
  };

  const handlePreviewReport = (reportConfig) => {
    console.log('Vista previa del reporte:', reportConfig);
  };

  const handleScheduleReport = (scheduleConfig) => {
    console.log('Programando reporte:', scheduleConfig);
  };

  const handleUpdateSchedule = (reportId, updates) => {
    console.log('Actualizando programa:', reportId, updates);
  };

  const handleSelectTemplate = (template) => {
    console.log('Template seleccionado:', template);
    setActiveTab('custom');
  };

  const handleCreateFromTemplate = (template) => {
    console.log('Creando desde template:', template);
    setActiveTab('custom');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardTab onDrillDown={handleDrillDown} />;
      case 'custom':
        return (
          <CustomReportsTab
            onSaveReport={handleSaveReport}
            onPreviewReport={handlePreviewReport}
          />
        );
      case 'scheduled':
        return (
          <ScheduledReportsTab
            onScheduleReport={handleScheduleReport}
            onUpdateSchedule={handleUpdateSchedule}
          />
        );
      case 'templates':
        return (
          <ReportTemplates
            onSelectTemplate={handleSelectTemplate}
            onCreateFromTemplate={handleCreateFromTemplate}
          />
        );
      default:
        return <DashboardTab onDrillDown={handleDrillDown} />;
    }
  };

  return (
    <>
      <Helmet>
        <title>Centro de Reportes y Análisis - InventoryPro</title>
        <meta name="description" content="Centro integral de reportes y análisis para gestión de inventario con dashboards interactivos y generación automatizada de reportes" />
      </Helmet>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <Header
          user={user}
          onLogout={handleLogout}
          notifications={notifications}
        />

        <div className="flex pt-16">
          {/* Sidebar */}
          <ReportSidebar
            isCollapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
            savedReports={savedReports}
            scheduledReports={scheduledReports}
            onReportSelect={handleReportSelect}
          />

          {/* Main Content */}
          <main className={`flex-1 transition-all duration-300 ${
            sidebarCollapsed ? 'ml-16' : 'ml-80'
          }`}>
            <div className="p-6">
              {/* Breadcrumb */}
              <Breadcrumb />

              {/* Alert Notifications */}
              <AlertNotificationBar
                alerts={alerts}
                onDismiss={handleDismissAlert}
                maxVisible={2}
              />

              {/* Page Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    Centro de Reportes y Análisis
                  </h1>
                  <p className="text-muted-foreground">
                    Insights inteligentes y reportes automatizados para optimizar tu inventario
                  </p>
                </div>

                <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                  <Button
                    variant="outline"
                    iconName="Download"
                    iconPosition="left"
                  >
                    Exportar Datos
                  </Button>
                  <Button
                    variant="outline"
                    iconName="Settings"
                    iconPosition="left"
                  >
                    Configuración
                  </Button>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="border-b border-border mb-8">
                <nav className="flex space-x-8 overflow-x-auto">
                  {tabs?.map((tab) => (
                    <button
                      key={tab?.id}
                      onClick={() => setActiveTab(tab?.id)}
                      className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                        activeTab === tab?.id
                          ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                      }`}
                    >
                      <Icon name={tab?.icon} size={18} />
                      <span>{tab?.label}</span>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="min-h-[600px]">
                {renderTabContent()}
              </div>
            </div>
          </main>
        </div>

        {/* Keyboard Shortcuts Help */}
        <div className="fixed bottom-4 right-4 z-40">
          <Button
            variant="outline"
            size="icon"
            className="bg-card shadow-lg"
            title="Atajos de teclado (Ctrl+K)"
          >
            <Icon name="Keyboard" size={16} />
          </Button>
        </div>
      </div>
    </>
  );
};

export default ReportingAndAnalyticsCenter;
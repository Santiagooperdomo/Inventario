import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ReportSidebar = ({ 
  isCollapsed, 
  onToggleCollapse, 
  selectedCategory, 
  onCategorySelect,
  savedReports,
  scheduledReports,
  onReportSelect 
}) => {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    saved: true,
    scheduled: true
  });

  const reportCategories = [
    { id: 'dashboard', label: 'Panel de Control', icon: 'LayoutDashboard', count: 8 },
    { id: 'inventory', label: 'Análisis de Inventario', icon: 'Package', count: 12 },
    { id: 'financial', label: 'Reportes Financieros', icon: 'DollarSign', count: 6 },
    { id: 'supplier', label: 'Rendimiento Proveedores', icon: 'Truck', count: 4 },
    { id: 'location', label: 'Comparación Ubicaciones', icon: 'MapPin', count: 3 },
    { id: 'forecast', label: 'Pronósticos', icon: 'TrendingUp', count: 5 }
  ];

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev?.[section]
    }));
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-card">
      {/* Header */}
      <div className={`flex items-center justify-between p-4 border-b border-border ${isCollapsed ? 'px-2' : ''}`}>
        {!isCollapsed && (
          <h2 className="text-lg font-semibold text-foreground">Reportes</h2>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="flex-shrink-0"
        >
          <Icon name={isCollapsed ? "ChevronRight" : "ChevronLeft"} size={16} />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Report Categories */}
        <div className="p-2">
          <div className="flex items-center justify-between px-2 py-2">
            {!isCollapsed && (
              <h3 className="text-sm font-medium text-muted-foreground">CATEGORÍAS</h3>
            )}
            {!isCollapsed && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleSection('categories')}
                className="h-6 w-6"
              >
                <Icon 
                  name={expandedSections?.categories ? "ChevronDown" : "ChevronRight"} 
                  size={14} 
                />
              </Button>
            )}
          </div>

          {(isCollapsed || expandedSections?.categories) && (
            <div className="space-y-1">
              {reportCategories?.map((category) => (
                <button
                  key={category?.id}
                  onClick={() => onCategorySelect(category?.id)}
                  className={`w-full flex items-center space-x-3 px-2 py-2 rounded-lg transition-micro text-left ${
                    selectedCategory === category?.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                  title={isCollapsed ? category?.label : ''}
                >
                  <Icon name={category?.icon} size={18} className="flex-shrink-0" />
                  {!isCollapsed && (
                    <>
                      <span className="flex-1 text-sm font-medium">{category?.label}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        selectedCategory === category?.id
                          ? 'bg-primary-foreground/20 text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {category?.count}
                      </span>
                    </>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Saved Reports */}
        {!isCollapsed && (
          <div className="p-2 border-t border-border">
            <div className="flex items-center justify-between px-2 py-2">
              <h3 className="text-sm font-medium text-muted-foreground">GUARDADOS</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleSection('saved')}
                className="h-6 w-6"
              >
                <Icon 
                  name={expandedSections?.saved ? "ChevronDown" : "ChevronRight"} 
                  size={14} 
                />
              </Button>
            </div>

            {expandedSections?.saved && (
              <div className="space-y-1">
                {savedReports?.slice(0, 5)?.map((report) => (
                  <button
                    key={report?.id}
                    onClick={() => onReportSelect(report)}
                    className="w-full flex items-center space-x-2 px-2 py-2 rounded-lg text-left text-muted-foreground hover:text-foreground hover:bg-muted transition-micro"
                  >
                    <Icon name="FileText" size={16} className="flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{report?.name}</p>
                      <p className="text-xs text-muted-foreground">{report?.lastModified}</p>
                    </div>
                  </button>
                ))}
                {savedReports?.length > 5 && (
                  <button className="w-full px-2 py-2 text-xs text-accent hover:text-accent/80 transition-micro">
                    Ver todos ({savedReports?.length})
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Scheduled Reports */}
        {!isCollapsed && (
          <div className="p-2 border-t border-border">
            <div className="flex items-center justify-between px-2 py-2">
              <h3 className="text-sm font-medium text-muted-foreground">PROGRAMADOS</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleSection('scheduled')}
                className="h-6 w-6"
              >
                <Icon 
                  name={expandedSections?.scheduled ? "ChevronDown" : "ChevronRight"} 
                  size={14} 
                />
              </Button>
            </div>

            {expandedSections?.scheduled && (
              <div className="space-y-1">
                {scheduledReports?.slice(0, 3)?.map((report) => (
                  <div
                    key={report?.id}
                    className="flex items-center space-x-2 px-2 py-2 rounded-lg"
                  >
                    <div className={`w-2 h-2 rounded-full ${
                      report?.status === 'active' ? 'bg-success' : 
                      report?.status === 'pending' ? 'bg-warning' : 'bg-muted'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{report?.name}</p>
                      <p className="text-xs text-muted-foreground">{report?.nextRun}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Data Source Status */}
      {!isCollapsed && (
        <div className="p-4 border-t border-border">
          <div className="bg-muted rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-success rounded-full" />
              <span className="text-sm font-medium text-foreground">Fuentes de Datos</span>
            </div>
            <div className="space-y-1 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>ERP Sistema</span>
                <span className="text-success">Conectado</span>
              </div>
              <div className="flex justify-between">
                <span>POS Sistema</span>
                <span className="text-success">Conectado</span>
              </div>
              <div className="flex justify-between">
                <span>Última Sync</span>
                <span>hace 5 min</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <aside className={`bg-card border-r border-border transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-80'
    }`}>
      <SidebarContent />
    </aside>
  );
};

export default ReportSidebar;
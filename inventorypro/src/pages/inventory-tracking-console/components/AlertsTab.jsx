import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const AlertsTab = ({ alertsData, onAcknowledgeAlert, onBulkAcknowledge, onResolveAlert }) => {
  const [selectedAlerts, setSelectedAlerts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('active');
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });

  const severityOptions = [
    { value: 'all', label: 'Todas las Severidades' },
    { value: 'critical', label: 'Crítico' },
    { value: 'high', label: 'Alto' },
    { value: 'medium', label: 'Medio' },
    { value: 'low', label: 'Bajo' }
  ];

  const statusOptions = [
    { value: 'all', label: 'Todos los Estados' },
    { value: 'active', label: 'Activas' },
    { value: 'acknowledged', label: 'Reconocidas' },
    { value: 'resolved', label: 'Resueltas' }
  ];

  const getSeverityColor = (severity) => {
    const colors = {
      critical: 'text-error bg-error/10 border-error/20',
      high: 'text-warning bg-warning/10 border-warning/20',
      medium: 'text-accent bg-accent/10 border-accent/20',
      low: 'text-success bg-success/10 border-success/20'
    };
    return colors?.[severity] || colors?.medium;
  };

  const getSeverityIcon = (severity) => {
    const icons = {
      critical: 'AlertCircle',
      high: 'AlertTriangle',
      medium: 'Info',
      low: 'CheckCircle'
    };
    return icons?.[severity] || 'Info';
  };

  const getAlertTypeIcon = (type) => {
    const icons = {
      'low-stock': 'Package',
      'out-of-stock': 'PackageX',
      'overstock': 'PackagePlus',
      'discrepancy': 'AlertTriangle',
      'expiry': 'Clock',
      'system': 'Settings'
    };
    return icons?.[type] || 'Bell';
  };

  const filteredAndSortedAlerts = useMemo(() => {
    let filtered = alertsData?.filter(alert => {
      const matchesSearch = alert?.title?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                           alert?.description?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                           alert?.sku?.toLowerCase()?.includes(searchTerm?.toLowerCase());
      
      const matchesSeverity = severityFilter === 'all' || alert?.severity === severityFilter;
      const matchesStatus = statusFilter === 'all' || alert?.status === statusFilter;

      return matchesSearch && matchesSeverity && matchesStatus;
    });

    if (sortConfig?.key) {
      filtered?.sort((a, b) => {
        let aValue = a?.[sortConfig?.key];
        let bValue = b?.[sortConfig?.key];
        
        if (sortConfig?.key === 'createdAt') {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        }
        
        if (typeof aValue === 'string') {
          aValue = aValue?.toLowerCase();
          bValue = bValue?.toLowerCase();
        }
        
        if (aValue < bValue) return sortConfig?.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig?.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [alertsData, searchTerm, severityFilter, statusFilter, sortConfig]);

  const handleSelectAll = () => {
    if (selectedAlerts?.length === filteredAndSortedAlerts?.length) {
      setSelectedAlerts([]);
    } else {
      setSelectedAlerts(filteredAndSortedAlerts?.map(alert => alert?.id));
    }
  };

  const handleAlertSelect = (alertId) => {
    setSelectedAlerts(prev => 
      prev?.includes(alertId) 
        ? prev?.filter(id => id !== alertId)
        : [...prev, alertId]
    );
  };

  const handleBulkAcknowledge = () => {
    onBulkAcknowledge(selectedAlerts);
    setSelectedAlerts([]);
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: { label: 'Activa', color: 'bg-error/10 text-error' },
      acknowledged: { label: 'Reconocida', color: 'bg-warning/10 text-warning' },
      resolved: { label: 'Resuelta', color: 'bg-success/10 text-success' }
    };
    const badge = badges?.[status] || badges?.active;
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${badge?.color}`}>
        {badge?.label}
      </span>
    );
  };

  const activeAlertsCount = alertsData?.filter(alert => alert?.status === 'active')?.length;
  const criticalAlertsCount = alertsData?.filter(alert => alert?.severity === 'critical' && alert?.status === 'active')?.length;

  return (
    <div className="space-y-4">
      {/* Alert Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-error/10 rounded-lg flex items-center justify-center">
              <Icon name="AlertCircle" size={20} className="text-error" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{activeAlertsCount}</div>
              <div className="text-sm text-muted-foreground">Alertas Activas</div>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-error/10 rounded-lg flex items-center justify-center">
              <Icon name="AlertTriangle" size={20} className="text-error" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{criticalAlertsCount}</div>
              <div className="text-sm text-muted-foreground">Críticas</div>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
              <Icon name="Package" size={20} className="text-warning" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">
                {alertsData?.filter(a => a?.type === 'low-stock' && a?.status === 'active')?.length}
              </div>
              <div className="text-sm text-muted-foreground">Stock Bajo</div>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-error/10 rounded-lg flex items-center justify-center">
              <Icon name="PackageX" size={20} className="text-error" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">
                {alertsData?.filter(a => a?.type === 'out-of-stock' && a?.status === 'active')?.length}
              </div>
              <div className="text-sm text-muted-foreground">Sin Stock</div>
            </div>
          </div>
        </div>
      </div>
      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 p-4 bg-muted/30 rounded-lg">
        <div className="flex-1">
          <Input
            type="search"
            placeholder="Buscar alertas por título, descripción o SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e?.target?.value)}
            className="w-full"
          />
        </div>
        <div className="flex gap-3">
          <Select
            options={severityOptions}
            value={severityFilter}
            onChange={setSeverityFilter}
            placeholder="Severidad"
            className="w-48"
          />
          <Select
            options={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="Estado"
            className="w-48"
          />
        </div>
      </div>
      {/* Bulk Actions */}
      {selectedAlerts?.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-accent/10 border border-accent/20 rounded-lg">
          <span className="text-sm font-medium text-foreground">
            {selectedAlerts?.length} alertas seleccionadas
          </span>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              iconName="Check"
              onClick={handleBulkAcknowledge}
            >
              Reconocer Todas
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              iconName="X"
              onClick={() => setSelectedAlerts([])}
            >
              Cancelar
            </Button>
          </div>
        </div>
      )}
      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAndSortedAlerts?.map((alert) => (
          <div
            key={alert?.id}
            className={`bg-card border rounded-lg p-4 transition-micro hover:shadow-sm ${
              selectedAlerts?.includes(alert?.id) ? 'border-accent bg-accent/5' : 'border-border'
            }`}
          >
            <div className="flex items-start space-x-4">
              <input
                type="checkbox"
                checked={selectedAlerts?.includes(alert?.id)}
                onChange={() => handleAlertSelect(alert?.id)}
                className="mt-1 rounded border-border"
              />
              
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${getSeverityColor(alert?.severity)}`}>
                <Icon name={getSeverityIcon(alert?.severity)} size={20} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-foreground">{alert?.title}</h3>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(alert?.severity)}`}>
                        {alert?.severity?.toUpperCase()}
                      </span>
                      {getStatusBadge(alert?.status)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{alert?.description}</p>
                    
                    {alert?.sku && (
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground mb-2">
                        <span>SKU: <span className="font-mono">{alert?.sku}</span></span>
                        <span>Producto: {alert?.productName}</span>
                        <span>Ubicación: {alert?.location}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span>Creada: {new Date(alert.createdAt)?.toLocaleString('es-ES')}</span>
                      {alert?.acknowledgedAt && (
                        <span>Reconocida: {new Date(alert.acknowledgedAt)?.toLocaleString('es-ES')}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    {alert?.status === 'active' && (
                      <Button
                        variant="outline"
                        size="sm"
                        iconName="Check"
                        onClick={() => onAcknowledgeAlert(alert?.id)}
                      >
                        Reconocer
                      </Button>
                    )}
                    {alert?.status === 'acknowledged' && (
                      <Button
                        variant="outline"
                        size="sm"
                        iconName="CheckCircle"
                        onClick={() => onResolveAlert(alert?.id)}
                      >
                        Resolver
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                    >
                      <Icon name="MoreHorizontal" size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {filteredAndSortedAlerts?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Bell" size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No hay alertas</h3>
          <p className="text-muted-foreground">No se encontraron alertas que coincidan con los filtros seleccionados.</p>
        </div>
      )}
    </div>
  );
};

export default AlertsTab;
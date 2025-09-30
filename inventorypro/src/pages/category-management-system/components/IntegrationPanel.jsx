import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const IntegrationPanel = ({ 
  integrations = [],
  onSync,
  onConfigureIntegration,
  onToggleIntegration
}) => {
  const [syncingIntegrations, setSyncingIntegrations] = useState(new Set());

  const mockIntegrations = [
    {
      id: 'erp-sap',
      name: 'SAP ERP',
      type: 'erp',
      status: 'connected',
      lastSync: '2025-01-16T17:30:00Z',
      categoriesCount: 1247,
      icon: 'Database',
      description: 'Sistema ERP principal para gestión de inventario',
      syncFrequency: 'hourly',
      errors: 0
    },
    {
      id: 'ecommerce-shopify',
      name: 'Shopify Store',
      type: 'ecommerce',
      status: 'connected',
      lastSync: '2025-01-16T18:45:00Z',
      categoriesCount: 89,
      icon: 'ShoppingCart',
      description: 'Tienda en línea principal',
      syncFrequency: 'realtime',
      errors: 0
    },
    {
      id: 'marketplace-amazon',
      name: 'Amazon Marketplace',
      type: 'marketplace',
      status: 'warning',
      lastSync: '2025-01-16T16:20:00Z',
      categoriesCount: 156,
      icon: 'Package',
      description: 'Marketplace de Amazon',
      syncFrequency: 'daily',
      errors: 3
    },
    {
      id: 'pos-square',
      name: 'Square POS',
      type: 'pos',
      status: 'disconnected',
      lastSync: '2025-01-15T14:30:00Z',
      categoriesCount: 45,
      icon: 'CreditCard',
      description: 'Sistema de punto de venta',
      syncFrequency: 'manual',
      errors: 1
    },
    {
      id: 'warehouse-wms',
      name: 'WMS System',
      type: 'warehouse',
      status: 'connected',
      lastSync: '2025-01-16T19:15:00Z',
      categoriesCount: 234,
      icon: 'Warehouse',
      description: 'Sistema de gestión de almacén',
      syncFrequency: 'every-15-min',
      errors: 0
    }
  ];

  const allIntegrations = integrations?.length > 0 ? integrations : mockIntegrations;

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return 'text-success';
      case 'warning': return 'text-warning';
      case 'disconnected': return 'text-error';
      case 'syncing': return 'text-accent';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'connected': return 'bg-success/10';
      case 'warning': return 'bg-warning/10';
      case 'disconnected': return 'bg-error/10';
      case 'syncing': return 'bg-accent/10';
      default: return 'bg-muted';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'connected': return 'Conectado';
      case 'warning': return 'Advertencia';
      case 'disconnected': return 'Desconectado';
      case 'syncing': return 'Sincronizando';
      default: return 'Desconocido';
    }
  };

  const getFrequencyLabel = (frequency) => {
    switch (frequency) {
      case 'realtime': return 'Tiempo real';
      case 'every-15-min': return 'Cada 15 min';
      case 'hourly': return 'Cada hora';
      case 'daily': return 'Diario';
      case 'manual': return 'Manual';
      default: return frequency;
    }
  };

  const formatLastSync = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 1) return 'Hace menos de 1 min';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours} hora${diffHours !== 1 ? 's' : ''}`;
    return date?.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSync = async (integrationId) => {
    setSyncingIntegrations(prev => new Set([...prev, integrationId]));
    
    try {
      await onSync?.(integrationId);
      // Simulate sync delay
      setTimeout(() => {
        setSyncingIntegrations(prev => {
          const newSet = new Set(prev);
          newSet?.delete(integrationId);
          return newSet;
        });
      }, 2000);
    } catch (error) {
      setSyncingIntegrations(prev => {
        const newSet = new Set(prev);
        newSet?.delete(integrationId);
        return newSet;
      });
    }
  };

  const isSyncing = (integrationId) => {
    return syncingIntegrations?.has(integrationId);
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Icon name="Plug" size={24} className="text-primary" />
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Integraciones externas
              </h3>
              <p className="text-sm text-muted-foreground">
                Estado de sincronización con sistemas externos
              </p>
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            iconName="RefreshCw"
            onClick={() => {
              allIntegrations?.forEach(integration => {
                if (integration?.status === 'connected') {
                  handleSync(integration?.id);
                }
              });
            }}
          >
            Sincronizar todo
          </Button>
        </div>
      </div>
      {/* Integration List */}
      <div className="p-4 space-y-4">
        {allIntegrations?.map((integration) => {
          const isCurrentlySyncing = isSyncing(integration?.id);
          const currentStatus = isCurrentlySyncing ? 'syncing' : integration?.status;
          
          return (
            <div
              key={integration?.id}
              className="p-4 border border-border rounded-lg hover:shadow-sm transition-micro"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getStatusBg(currentStatus)}`}>
                    <Icon 
                      name={isCurrentlySyncing ? 'RefreshCw' : integration?.icon} 
                      size={20} 
                      className={`${getStatusColor(currentStatus)} ${isCurrentlySyncing ? 'animate-spin' : ''}`}
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-foreground">
                        {integration?.name}
                      </h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusBg(currentStatus)} ${getStatusColor(currentStatus)}`}>
                        {getStatusLabel(currentStatus)}
                      </span>
                      {integration?.errors > 0 && (
                        <span className="px-2 py-1 text-xs rounded-full bg-error/10 text-error">
                          {integration?.errors} error{integration?.errors !== 1 ? 'es' : ''}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">
                      {integration?.description}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Última sincronización:</span>
                        <p className="font-medium text-foreground">
                          {formatLastSync(integration?.lastSync)}
                        </p>
                      </div>
                      
                      <div>
                        <span className="text-muted-foreground">Categorías:</span>
                        <p className="font-medium text-foreground">
                          {integration?.categoriesCount?.toLocaleString()}
                        </p>
                      </div>
                      
                      <div>
                        <span className="text-muted-foreground">Frecuencia:</span>
                        <p className="font-medium text-foreground">
                          {getFrequencyLabel(integration?.syncFrequency)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 ml-4">
                  {integration?.status === 'connected' && (
                    <Button
                      variant="outline"
                      size="sm"
                      iconName={isCurrentlySyncing ? 'RefreshCw' : 'RefreshCw'}
                      onClick={() => handleSync(integration?.id)}
                      disabled={isCurrentlySyncing}
                      className={isCurrentlySyncing ? 'animate-spin' : ''}
                    >
                      {isCurrentlySyncing ? 'Sincronizando...' : 'Sincronizar'}
                    </Button>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="Settings"
                    onClick={() => onConfigureIntegration?.(integration?.id)}
                  >
                    Configurar
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName={integration?.status === 'connected' ? 'ToggleRight' : 'ToggleLeft'}
                    onClick={() => onToggleIntegration?.(integration?.id)}
                    className={integration?.status === 'connected' ? 'text-success' : 'text-muted-foreground'}
                  />
                </div>
              </div>
              {/* Error Details */}
              {integration?.errors > 0 && (
                <div className="mt-3 p-3 bg-error/5 border border-error/20 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Icon name="AlertTriangle" size={16} className="text-error mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-error mb-1">
                        Errores de sincronización detectados
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Algunas categorías no pudieron sincronizarse correctamente. 
                        Revisa los logs para más detalles.
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-error hover:bg-error/10"
                    >
                      Ver detalles
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {/* Summary */}
      <div className="p-4 border-t border-border bg-muted/30">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-success">
              {allIntegrations?.filter(i => i?.status === 'connected')?.length}
            </p>
            <p className="text-sm text-muted-foreground">Conectadas</p>
          </div>
          
          <div>
            <p className="text-2xl font-bold text-warning">
              {allIntegrations?.filter(i => i?.status === 'warning')?.length}
            </p>
            <p className="text-sm text-muted-foreground">Con advertencias</p>
          </div>
          
          <div>
            <p className="text-2xl font-bold text-error">
              {allIntegrations?.filter(i => i?.status === 'disconnected')?.length}
            </p>
            <p className="text-sm text-muted-foreground">Desconectadas</p>
          </div>
          
          <div>
            <p className="text-2xl font-bold text-foreground">
              {allIntegrations?.reduce((sum, i) => sum + i?.categoriesCount, 0)?.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">Total categorías</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationPanel;
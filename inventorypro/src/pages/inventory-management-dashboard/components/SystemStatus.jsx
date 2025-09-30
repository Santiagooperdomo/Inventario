import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SystemStatus = () => {
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const systems = [
    {
      id: 'erp',
      name: 'Sistema ERP',
      status: 'online',
      lastSync: new Date(Date.now() - 120000), // 2 minutes ago
      description: 'Sincronización automática activa',
      icon: 'Database'
    },
    {
      id: 'pos',
      name: 'Punto de Venta',
      status: 'online',
      lastSync: new Date(Date.now() - 60000), // 1 minute ago
      description: 'Todas las terminales conectadas',
      icon: 'CreditCard'
    },
    {
      id: 'warehouse',
      name: 'Sistema de Almacén',
      status: 'warning',
      lastSync: new Date(Date.now() - 900000), // 15 minutes ago
      description: 'Conexión intermitente detectada',
      icon: 'Warehouse'
    },
    {
      id: 'suppliers',
      name: 'Portal Proveedores',
      status: 'online',
      lastSync: new Date(Date.now() - 300000), // 5 minutes ago
      description: 'API funcionando correctamente',
      icon: 'Truck'
    },
    {
      id: 'backup',
      name: 'Sistema de Respaldo',
      status: 'online',
      lastSync: new Date(Date.now() - 3600000), // 1 hour ago
      description: 'Último respaldo completado',
      icon: 'HardDrive'
    }
  ];

  const getStatusColor = (status) => {
    const colors = {
      online: 'text-success',
      warning: 'text-warning',
      error: 'text-error',
      offline: 'text-muted-foreground'
    };
    return colors?.[status] || 'text-muted-foreground';
  };

  const getStatusBg = (status) => {
    const colors = {
      online: 'bg-success',
      warning: 'bg-warning',
      error: 'bg-error',
      offline: 'bg-muted-foreground'
    };
    return colors?.[status] || 'bg-muted-foreground';
  };

  const getStatusText = (status) => {
    const texts = {
      online: 'En Línea',
      warning: 'Advertencia',
      error: 'Error',
      offline: 'Desconectado'
    };
    return texts?.[status] || 'Desconocido';
  };

  const formatLastSync = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 60) {
      return `hace ${minutes} min`;
    } else if (hours < 24) {
      return `hace ${hours}h`;
    } else {
      return date?.toLocaleDateString('es-ES', { 
        day: '2-digit', 
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const overallStatus = systems?.every(s => s?.status === 'online') ? 'online' : 
                       systems?.some(s => s?.status === 'error') ? 'error' : 'warning';

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <h3 className="text-lg font-semibold text-foreground">Estado del Sistema</h3>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${getStatusBg(overallStatus)}`} />
            <span className={`text-sm font-medium ${getStatusColor(overallStatus)}`}>
              {getStatusText(overallStatus)}
            </span>
          </div>
        </div>
        <Button variant="ghost" size="sm">
          <Icon name="RefreshCw" size={16} className="mr-2" />
          Actualizar
        </Button>
      </div>
      <div className="space-y-4">
        {systems?.map((system) => (
          <div 
            key={system?.id}
            className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-micro"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                <Icon name={system?.icon} size={16} className="text-muted-foreground" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="font-medium text-foreground text-sm">{system?.name}</h4>
                  <div className={`w-2 h-2 rounded-full ${getStatusBg(system?.status)}`} />
                </div>
                <p className="text-xs text-muted-foreground">{system?.description}</p>
              </div>
            </div>
            
            <div className="text-right">
              <p className={`text-sm font-medium ${getStatusColor(system?.status)}`}>
                {getStatusText(system?.status)}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatLastSync(system?.lastSync)}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Última actualización: {lastUpdate?.toLocaleTimeString('es-ES', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
          <Button variant="ghost" size="sm">
            <Icon name="Settings" size={14} className="mr-2" />
            Configurar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SystemStatus;
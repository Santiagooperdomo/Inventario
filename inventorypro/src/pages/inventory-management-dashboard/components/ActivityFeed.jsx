import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ActivityFeed = () => {
  const [filter, setFilter] = useState('all');

  const activities = [
    {
      id: 1,
      type: 'stock_adjustment',
      title: 'Ajuste de Inventario',
      description: 'Stock ajustado para Laptop Dell XPS 13',
      user: 'María González',
      location: 'Almacén Central',
      timestamp: new Date(Date.now() - 300000),
      details: '+15 unidades',
      icon: 'Package',
      color: 'primary'
    },
    {
      id: 2,
      type: 'low_stock_alert',
      title: 'Alerta de Stock Bajo',
      description: 'iPhone 14 Pro por debajo del mínimo',
      user: 'Sistema',
      location: 'Tienda Norte',
      timestamp: new Date(Date.now() - 600000),
      details: '3 unidades restantes',
      icon: 'AlertTriangle',
      color: 'warning'
    },
    {
      id: 3,
      type: 'transfer',
      title: 'Transferencia Completada',
      description: 'Productos transferidos entre ubicaciones',
      user: 'Carlos Ruiz',
      location: 'Almacén Central → Tienda Sur',
      timestamp: new Date(Date.now() - 900000),
      details: '25 productos',
      icon: 'ArrowRightLeft',
      color: 'success'
    },
    {
      id: 4,
      type: 'reorder',
      title: 'Orden de Reposición',
      description: 'Nueva orden generada automáticamente',
      user: 'Sistema',
      location: 'Proveedor TechSupply',
      timestamp: new Date(Date.now() - 1200000),
      details: 'Orden #ORD-2024-0156',
      icon: 'ShoppingCart',
      color: 'primary'
    },
    {
      id: 5,
      type: 'sync_error',
      title: 'Error de Sincronización',
      description: 'Fallo en sincronización con ERP',
      user: 'Sistema',
      location: 'Tienda Sur',
      timestamp: new Date(Date.now() - 1800000),
      details: 'Reintento en 5 min',
      icon: 'AlertCircle',
      color: 'error'
    },
    {
      id: 6,
      type: 'receipt',
      title: 'Recepción de Mercancía',
      description: 'Productos recibidos del proveedor',
      user: 'Ana López',
      location: 'Almacén Central',
      timestamp: new Date(Date.now() - 2400000),
      details: '150 unidades',
      icon: 'Truck',
      color: 'success'
    }
  ];

  const getIconColor = (color) => {
    const colors = {
      primary: 'text-primary',
      success: 'text-success',
      warning: 'text-warning',
      error: 'text-error'
    };
    return colors?.[color] || 'text-muted-foreground';
  };

  const getBgColor = (color) => {
    const colors = {
      primary: 'bg-primary/10',
      success: 'bg-success/10',
      warning: 'bg-warning/10',
      error: 'bg-error/10'
    };
    return colors?.[color] || 'bg-muted';
  };

  const formatTime = (date) => {
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

  const filterOptions = [
    { value: 'all', label: 'Todas', icon: 'List' },
    { value: 'stock_adjustment', label: 'Ajustes', icon: 'Package' },
    { value: 'transfer', label: 'Transferencias', icon: 'ArrowRightLeft' },
    { value: 'low_stock_alert', label: 'Alertas', icon: 'AlertTriangle' },
    { value: 'sync_error', label: 'Errores', icon: 'AlertCircle' }
  ];

  const filteredActivities = filter === 'all' 
    ? activities 
    : activities?.filter(activity => activity?.type === filter);

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Actividad Reciente</h3>
        <div className="flex items-center space-x-2">
          {filterOptions?.slice(0, 3)?.map((option) => (
            <Button
              key={option?.value}
              variant={filter === option?.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(option?.value)}
            >
              <Icon name={option?.icon} size={14} className="mr-1" />
              {option?.label}
            </Button>
          ))}
        </div>
      </div>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {filteredActivities?.map((activity) => (
          <div 
            key={activity?.id}
            className="flex items-start space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-micro"
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getBgColor(activity?.color)}`}>
              <Icon name={activity?.icon} size={18} className={getIconColor(activity?.color)} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-medium text-foreground text-sm">{activity?.title}</h4>
                <span className="text-xs text-muted-foreground flex-shrink-0">
                  {formatTime(activity?.timestamp)}
                </span>
              </div>
              
              <p className="text-sm text-muted-foreground mb-1">{activity?.description}</p>
              
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Icon name="User" size={12} />
                  <span>{activity?.user}</span>
                  <span>•</span>
                  <Icon name="MapPin" size={12} />
                  <span>{activity?.location}</span>
                </div>
                <span className={`font-medium ${getIconColor(activity?.color)}`}>
                  {activity?.details}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <Button variant="outline" className="w-full">
          <Icon name="Clock" size={16} className="mr-2" />
          Ver Historial Completo
        </Button>
      </div>
    </div>
  );
};

export default ActivityFeed;
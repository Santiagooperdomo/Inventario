import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LocationSummary = () => {
  const [selectedLocation, setSelectedLocation] = useState('all');

  const locations = [
    {
      id: 'warehouse-1',
      name: 'Almacén Central',
      type: 'warehouse',
      totalProducts: 2847,
      lowStock: 23,
      outOfStock: 5,
      value: 1250000,
      status: 'active',
      lastSync: '2 min'
    },
    {
      id: 'store-1',
      name: 'Tienda Norte',
      type: 'retail',
      totalProducts: 1205,
      lowStock: 8,
      outOfStock: 2,
      value: 450000,
      status: 'active',
      lastSync: '5 min'
    },
    {
      id: 'store-2',
      name: 'Tienda Sur',
      type: 'retail',
      totalProducts: 980,
      lowStock: 12,
      outOfStock: 3,
      value: 380000,
      status: 'warning',
      lastSync: '15 min'
    },
    {
      id: 'warehouse-2',
      name: 'Almacén Secundario',
      type: 'warehouse',
      totalProducts: 1560,
      lowStock: 18,
      outOfStock: 1,
      value: 720000,
      status: 'active',
      lastSync: '1 min'
    }
  ];

  const getLocationIcon = (type) => {
    return type === 'warehouse' ? 'Warehouse' : 'Store';
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'text-success',
      warning: 'text-warning',
      error: 'text-error'
    };
    return colors?.[status] || 'text-muted-foreground';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0
    })?.format(amount);
  };

  const filteredLocations = selectedLocation === 'all' 
    ? locations 
    : locations?.filter(loc => loc?.type === selectedLocation);

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Resumen por Ubicación</h3>
        <div className="flex items-center space-x-2">
          <Button
            variant={selectedLocation === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedLocation('all')}
          >
            Todas
          </Button>
          <Button
            variant={selectedLocation === 'warehouse' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedLocation('warehouse')}
          >
            Almacenes
          </Button>
          <Button
            variant={selectedLocation === 'retail' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedLocation('retail')}
          >
            Tiendas
          </Button>
        </div>
      </div>
      <div className="space-y-4">
        {filteredLocations?.map((location) => (
          <div 
            key={location?.id}
            className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-micro"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name={getLocationIcon(location?.type)} size={20} className="text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">{location?.name}</h4>
                  <div className="flex items-center space-x-2 text-sm">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(location?.status)?.replace('text-', 'bg-')}`} />
                    <span className="text-muted-foreground">
                      Última sincronización: {location?.lastSync}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-foreground">
                  {formatCurrency(location?.value)}
                </p>
                <p className="text-sm text-muted-foreground">Valor total</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-xl font-bold text-foreground">{location?.totalProducts?.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Total Productos</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-warning">{location?.lowStock}</p>
                <p className="text-xs text-muted-foreground">Stock Bajo</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-error">{location?.outOfStock}</p>
                <p className="text-xs text-muted-foreground">Sin Stock</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <Button variant="outline" className="w-full">
          <Icon name="MapPin" size={16} className="mr-2" />
          Ver Todas las Ubicaciones
        </Button>
      </div>
    </div>
  );
};

export default LocationSummary;
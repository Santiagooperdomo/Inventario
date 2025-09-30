import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const LocationSelector = ({ selectedLocation, onLocationChange, locations, syncStatus }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const locationOptions = locations?.map(location => ({
    value: location?.id,
    label: location?.name,
    description: `${location?.totalProducts} productos • ${location?.totalStock} unidades`
  }));

  const currentLocation = locations?.find(loc => loc?.id === selectedLocation);

  const getSyncStatusColor = (status) => {
    const colors = {
      online: 'text-success bg-success/10',
      syncing: 'text-warning bg-warning/10',
      offline: 'text-error bg-error/10',
      error: 'text-error bg-error/10'
    };
    return colors?.[status] || colors?.offline;
  };

  const getSyncStatusIcon = (status) => {
    const icons = {
      online: 'CheckCircle',
      syncing: 'RefreshCw',
      offline: 'XCircle',
      error: 'AlertTriangle'
    };
    return icons?.[status] || 'XCircle';
  };

  const getSyncStatusText = (status) => {
    const texts = {
      online: 'En Línea',
      syncing: 'Sincronizando',
      offline: 'Desconectado',
      error: 'Error de Conexión'
    };
    return texts?.[status] || 'Desconocido';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Ubicación Actual</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          iconName={isExpanded ? 'ChevronUp' : 'ChevronDown'}
        >
          {isExpanded ? 'Contraer' : 'Expandir'}
        </Button>
      </div>
      <div className="space-y-4">
        {/* Location Selector */}
        <Select
          options={locationOptions}
          value={selectedLocation}
          onChange={onLocationChange}
          placeholder="Seleccionar ubicación..."
          className="w-full"
        />

        {/* Current Location Info */}
        {currentLocation && (
          <div className="bg-muted/30 rounded-lg p-3">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name="MapPin" size={20} className="text-primary" />
              </div>
              <div>
                <div className="font-medium text-foreground">{currentLocation?.name}</div>
                <div className="text-sm text-muted-foreground">{currentLocation?.address}</div>
              </div>
            </div>

            {isExpanded && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{currentLocation?.totalProducts}</div>
                  <div className="text-xs text-muted-foreground">Productos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">
                    {currentLocation?.totalStock?.toLocaleString('es-ES')}
                  </div>
                  <div className="text-xs text-muted-foreground">Unidades</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">
                    €{currentLocation?.totalValue?.toLocaleString('es-ES')}
                  </div>
                  <div className="text-xs text-muted-foreground">Valor Total</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{currentLocation?.lowStockItems}</div>
                  <div className="text-xs text-muted-foreground">Stock Bajo</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Sync Status */}
        <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getSyncStatusColor(syncStatus?.status)}`}>
              <Icon 
                name={getSyncStatusIcon(syncStatus?.status)} 
                size={16}
                className={syncStatus?.status === 'syncing' ? 'animate-spin' : ''}
              />
            </div>
            <div>
              <div className="font-medium text-foreground">{getSyncStatusText(syncStatus?.status)}</div>
              <div className="text-xs text-muted-foreground">
                Última sincronización: {syncStatus?.lastSync}
              </div>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            iconName="RefreshCw"
            disabled={syncStatus?.status === 'syncing'}
          >
            Sincronizar
          </Button>
        </div>

        {/* Quick Stats */}
        {isExpanded && currentLocation && (
          <div className="space-y-2">
            <h4 className="font-medium text-foreground text-sm">Estadísticas Rápidas</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Productos activos:</span>
                <span className="font-medium text-foreground">{currentLocation?.activeProducts}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Productos inactivos:</span>
                <span className="font-medium text-foreground">{currentLocation?.inactiveProducts}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Rotación promedio:</span>
                <span className="font-medium text-foreground">{currentLocation?.avgTurnover} días</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Precisión inventario:</span>
                <span className="font-medium text-success">{currentLocation?.accuracy}%</span>
              </div>
            </div>
          </div>
        )}

        {/* System Integration Status */}
        {isExpanded && (
          <div className="space-y-2">
            <h4 className="font-medium text-foreground text-sm">Estado de Integración</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <Icon name="Scan" size={14} className="text-muted-foreground" />
                  <span className="text-muted-foreground">Escáner de códigos</span>
                </div>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
                  Conectado
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <Icon name="CreditCard" size={14} className="text-muted-foreground" />
                  <span className="text-muted-foreground">Sistema POS</span>
                </div>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
                  Sincronizado
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <Icon name="Database" size={14} className="text-muted-foreground" />
                  <span className="text-muted-foreground">ERP Principal</span>
                </div>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-warning/10 text-warning">
                  Sincronizando
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationSelector;
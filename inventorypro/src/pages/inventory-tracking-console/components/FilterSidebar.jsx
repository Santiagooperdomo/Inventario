import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

import { Checkbox } from '../../../components/ui/Checkbox';

const FilterSidebar = ({ 
  isOpen, 
  onClose, 
  filters, 
  onFiltersChange, 
  onSavePreset, 
  onLoadPreset,
  savedPresets = []
}) => {
  const [presetName, setPresetName] = useState('');
  const [showSavePreset, setShowSavePreset] = useState(false);

  const locationOptions = [
    { value: 'warehouse-a', label: 'Almacén A' },
    { value: 'warehouse-b', label: 'Almacén B' },
    { value: 'store-central', label: 'Tienda Central' },
    { value: 'store-norte', label: 'Tienda Norte' },
    { value: 'store-sur', label: 'Tienda Sur' }
  ];

  const categoryTree = [
    {
      id: 'electronics',
      label: 'Electrónicos',
      children: [
        { id: 'smartphones', label: 'Smartphones' },
        { id: 'laptops', label: 'Laptops' },
        { id: 'accessories', label: 'Accesorios' }
      ]
    },
    {
      id: 'clothing',
      label: 'Ropa',
      children: [
        { id: 'mens', label: 'Hombre' },
        { id: 'womens', label: 'Mujer' },
        { id: 'kids', label: 'Niños' }
      ]
    },
    {
      id: 'home',
      label: 'Hogar',
      children: [
        { id: 'furniture', label: 'Muebles' },
        { id: 'decor', label: 'Decoración' },
        { id: 'kitchen', label: 'Cocina' }
      ]
    }
  ];

  const stockStatusOptions = [
    { id: 'in-stock', label: 'En Stock', color: 'success' },
    { id: 'low-stock', label: 'Stock Bajo', color: 'warning' },
    { id: 'out-of-stock', label: 'Sin Stock', color: 'error' },
    { id: 'overstock', label: 'Exceso', color: 'accent' }
  ];

  const handleLocationChange = (locationId, checked) => {
    const newLocations = checked 
      ? [...(filters?.locations || []), locationId]
      : (filters?.locations || [])?.filter(id => id !== locationId);
    
    onFiltersChange({ ...filters, locations: newLocations });
  };

  const handleCategoryChange = (categoryId, checked) => {
    const newCategories = checked 
      ? [...(filters?.categories || []), categoryId]
      : (filters?.categories || [])?.filter(id => id !== categoryId);
    
    onFiltersChange({ ...filters, categories: newCategories });
  };

  const handleStatusChange = (statusId, checked) => {
    const newStatuses = checked 
      ? [...(filters?.stockStatuses || []), statusId]
      : (filters?.stockStatuses || [])?.filter(id => id !== statusId);
    
    onFiltersChange({ ...filters, stockStatuses: newStatuses });
  };

  const handleSavePreset = () => {
    if (presetName?.trim()) {
      onSavePreset(presetName?.trim(), filters);
      setPresetName('');
      setShowSavePreset(false);
    }
  };

  const clearAllFilters = () => {
    onFiltersChange({
      locations: [],
      categories: [],
      stockStatuses: [],
      dateRange: { start: '', end: '' },
      stockRange: { min: '', max: '' }
    });
  };

  const hasActiveFilters = () => {
    return (filters?.locations?.length > 0) ||
           (filters?.categories?.length > 0) ||
           (filters?.stockStatuses?.length > 0) ||
           filters?.dateRange?.start ||
           filters?.dateRange?.end ||
           filters?.stockRange?.min ||
           filters?.stockRange?.max;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:relative lg:inset-auto">
      {/* Mobile Overlay */}
      <div className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      {/* Sidebar Content */}
      <div className="fixed right-0 top-0 h-full w-80 bg-card border-l border-border shadow-lg lg:relative lg:w-full lg:shadow-none lg:border lg:rounded-lg overflow-y-auto">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Filtros Avanzados</h3>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <Icon name="X" size={20} />
            </Button>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Saved Presets */}
          {savedPresets?.length > 0 && (
            <div>
              <h4 className="font-medium text-foreground mb-3">Filtros Guardados</h4>
              <div className="space-y-2">
                {savedPresets?.map((preset) => (
                  <Button
                    key={preset?.id}
                    variant="outline"
                    size="sm"
                    onClick={() => onLoadPreset(preset)}
                    className="w-full justify-start"
                  >
                    <Icon name="Filter" size={16} className="mr-2" />
                    {preset?.name}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Location Filter */}
          <div>
            <h4 className="font-medium text-foreground mb-3">Ubicaciones</h4>
            <div className="space-y-2">
              {locationOptions?.map((location) => (
                <Checkbox
                  key={location?.value}
                  label={location?.label}
                  checked={(filters?.locations || [])?.includes(location?.value)}
                  onChange={(e) => handleLocationChange(location?.value, e?.target?.checked)}
                />
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <h4 className="font-medium text-foreground mb-3">Categorías</h4>
            <div className="space-y-2">
              {categoryTree?.map((category) => (
                <div key={category?.id}>
                  <Checkbox
                    label={category?.label}
                    checked={(filters?.categories || [])?.includes(category?.id)}
                    onChange={(e) => handleCategoryChange(category?.id, e?.target?.checked)}
                  />
                  {category?.children && (
                    <div className="ml-6 mt-2 space-y-1">
                      {category?.children?.map((child) => (
                        <Checkbox
                          key={child?.id}
                          label={child?.label}
                          size="sm"
                          checked={(filters?.categories || [])?.includes(child?.id)}
                          onChange={(e) => handleCategoryChange(child?.id, e?.target?.checked)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Stock Status Filter */}
          <div>
            <h4 className="font-medium text-foreground mb-3">Estado del Stock</h4>
            <div className="space-y-2">
              {stockStatusOptions?.map((status) => (
                <Checkbox
                  key={status?.id}
                  label={
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full bg-${status?.color}`} />
                      <span>{status?.label}</span>
                    </div>
                  }
                  checked={(filters?.stockStatuses || [])?.includes(status?.id)}
                  onChange={(e) => handleStatusChange(status?.id, e?.target?.checked)}
                />
              ))}
            </div>
          </div>

          {/* Date Range Filter */}
          <div>
            <h4 className="font-medium text-foreground mb-3">Rango de Fechas</h4>
            <div className="space-y-3">
              <Input
                type="date"
                label="Fecha Inicio"
                value={filters?.dateRange?.start || ''}
                onChange={(e) => onFiltersChange({
                  ...filters,
                  dateRange: { ...filters?.dateRange, start: e?.target?.value }
                })}
              />
              <Input
                type="date"
                label="Fecha Fin"
                value={filters?.dateRange?.end || ''}
                onChange={(e) => onFiltersChange({
                  ...filters,
                  dateRange: { ...filters?.dateRange, end: e?.target?.value }
                })}
              />
            </div>
          </div>

          {/* Stock Range Filter */}
          <div>
            <h4 className="font-medium text-foreground mb-3">Rango de Stock</h4>
            <div className="space-y-3">
              <Input
                type="number"
                label="Stock Mínimo"
                placeholder="0"
                value={filters?.stockRange?.min || ''}
                onChange={(e) => onFiltersChange({
                  ...filters,
                  stockRange: { ...filters?.stockRange, min: e?.target?.value }
                })}
              />
              <Input
                type="number"
                label="Stock Máximo"
                placeholder="1000"
                value={filters?.stockRange?.max || ''}
                onChange={(e) => onFiltersChange({
                  ...filters,
                  stockRange: { ...filters?.stockRange, max: e?.target?.value }
                })}
              />
            </div>
          </div>

          {/* Save Preset */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-foreground">Guardar Filtro</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSavePreset(!showSavePreset)}
              >
                <Icon name="Plus" size={16} />
              </Button>
            </div>
            
            {showSavePreset && (
              <div className="space-y-3">
                <Input
                  placeholder="Nombre del filtro..."
                  value={presetName}
                  onChange={(e) => setPresetName(e?.target?.value)}
                />
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSavePreset}
                    disabled={!presetName?.trim()}
                    className="flex-1"
                  >
                    Guardar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowSavePreset(false);
                      setPresetName('');
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Clear Filters */}
          {hasActiveFilters() && (
            <div className="pt-4 border-t border-border">
              <Button
                variant="outline"
                onClick={clearAllFilters}
                className="w-full"
                iconName="X"
              >
                Limpiar Todos los Filtros
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
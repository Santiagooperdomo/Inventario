import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const FilterBar = ({ onFilterChange, onAddProduct, onBarcodeSearch }) => {
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    status: '',
    supplier: '',
    priceRange: { min: '', max: '' }
  });
  const [showAdvanced, setShowAdvanced] = useState(false);

  const categoryOptions = [
    { value: '', label: 'Todas las categorías' },
    { value: 'electronics', label: 'Electrónicos' },
    { value: 'clothing', label: 'Ropa' },
    { value: 'home', label: 'Hogar' },
    { value: 'sports', label: 'Deportes' },
    { value: 'books', label: 'Libros' }
  ];

  const statusOptions = [
    { value: '', label: 'Todos los estados' },
    { value: 'active', label: 'Activo' },
    { value: 'inactive', label: 'Inactivo' },
    { value: 'low-stock', label: 'Stock Bajo' },
    { value: 'out-of-stock', label: 'Sin Stock' }
  ];

  const supplierOptions = [
    { value: '', label: 'Todos los proveedores' },
    { value: 'techsupply', label: 'TechSupply S.A.' },
    { value: 'globalparts', label: 'Global Parts Ltd.' },
    { value: 'quickship', label: 'QuickShip Express' },
    { value: 'reliablegoods', label: 'Reliable Goods Co.' }
  ];

  const handleFilterUpdate = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePriceRangeUpdate = (type, value) => {
    const newPriceRange = { ...filters?.priceRange, [type]: value };
    const newFilters = { ...filters, priceRange: newPriceRange };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: '',
      category: '',
      status: '',
      supplier: '',
      priceRange: { min: '', max: '' }
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const activeFiltersCount = Object.values(filters)?.filter(value => {
    if (typeof value === 'object') {
      return value?.min || value?.max;
    }
    return value;
  })?.length;

  return (
    <div className="bg-card border-b border-border p-4 space-y-4">
      {/* Main Filter Row */}
      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar productos, SKU, código de barras..."
              value={filters?.search}
              onChange={(e) => handleFilterUpdate('search', e?.target?.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Quick Filters */}
        <Select
          options={categoryOptions}
          value={filters?.category}
          onChange={(value) => handleFilterUpdate('category', value)}
          placeholder="Categoría"
          className="w-48"
        />

        <Select
          options={statusOptions}
          value={filters?.status}
          onChange={(value) => handleFilterUpdate('status', value)}
          placeholder="Estado"
          className="w-40"
        />

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            iconName="ScanLine"
            iconPosition="left"
            onClick={onBarcodeSearch}
          >
            Escanear
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            iconName="Filter"
            iconPosition="left"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            Filtros {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </Button>

          <Button
            variant="default"
            size="sm"
            iconName="Plus"
            iconPosition="left"
            onClick={onAddProduct}
          >
            Nuevo Producto
          </Button>
        </div>
      </div>
      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="bg-muted rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-foreground">Filtros Avanzados</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              disabled={activeFiltersCount === 0}
            >
              Limpiar Filtros
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Supplier Filter */}
            <Select
              label="Proveedor"
              options={supplierOptions}
              value={filters?.supplier}
              onChange={(value) => handleFilterUpdate('supplier', value)}
              placeholder="Seleccionar proveedor"
            />

            {/* Price Range */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Rango de Precios</label>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  placeholder="Mín"
                  value={filters?.priceRange?.min}
                  onChange={(e) => handlePriceRangeUpdate('min', e?.target?.value)}
                  className="flex-1"
                />
                <span className="text-muted-foreground">-</span>
                <Input
                  type="number"
                  placeholder="Máx"
                  value={filters?.priceRange?.max}
                  onChange={(e) => handlePriceRangeUpdate('max', e?.target?.value)}
                  className="flex-1"
                />
              </div>
            </div>

            {/* Stock Status Chips */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Estado de Stock</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'in-stock', label: 'En Stock', color: 'success' },
                  { id: 'low-stock', label: 'Stock Bajo', color: 'warning' },
                  { id: 'out-of-stock', label: 'Sin Stock', color: 'error' }
                ]?.map((chip) => (
                  <button
                    key={chip?.id}
                    onClick={() => handleFilterUpdate('status', filters?.status === chip?.id ? '' : chip?.id)}
                    className={`px-3 py-1 text-xs rounded-full border transition-micro ${
                      filters?.status === chip?.id
                        ? `bg-${chip?.color} text-${chip?.color}-foreground border-${chip?.color}`
                        : 'bg-background text-muted-foreground border-border hover:border-foreground'
                    }`}
                  >
                    {chip?.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2 pt-2 border-t border-border">
            <span className="text-xs text-muted-foreground">Acciones rápidas:</span>
            <Button
              variant="ghost"
              size="sm"
              iconName="Download"
              iconPosition="left"
            >
              Exportar Filtrados
            </Button>
            <Button
              variant="ghost"
              size="sm"
              iconName="Upload"
              iconPosition="left"
            >
              Importar Productos
            </Button>
            <Button
              variant="ghost"
              size="sm"
              iconName="RefreshCw"
              iconPosition="left"
            >
              Sincronizar ERP
            </Button>
          </div>
        </div>
      )}
      {/* Active Filters Summary */}
      {activeFiltersCount > 0 && (
        <div className="flex items-center space-x-2">
          <span className="text-xs text-muted-foreground">Filtros activos:</span>
          {filters?.search && (
            <span className="px-2 py-1 text-xs bg-accent/10 text-accent rounded-full">
              Búsqueda: "{filters?.search}"
            </span>
          )}
          {filters?.category && (
            <span className="px-2 py-1 text-xs bg-accent/10 text-accent rounded-full">
              {categoryOptions?.find(c => c?.value === filters?.category)?.label}
            </span>
          )}
          {filters?.status && (
            <span className="px-2 py-1 text-xs bg-accent/10 text-accent rounded-full">
              {statusOptions?.find(s => s?.value === filters?.status)?.label}
            </span>
          )}
          {filters?.supplier && (
            <span className="px-2 py-1 text-xs bg-accent/10 text-accent rounded-full">
              {supplierOptions?.find(s => s?.value === filters?.supplier)?.label}
            </span>
          )}
          {(filters?.priceRange?.min || filters?.priceRange?.max) && (
            <span className="px-2 py-1 text-xs bg-accent/10 text-accent rounded-full">
              Precio: ${filters?.priceRange?.min || '0'} - ${filters?.priceRange?.max || '∞'}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterBar;
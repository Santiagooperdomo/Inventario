import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const CategorySearch = ({ 
  onSearch, 
  onFilterChange, 
  savedFilters = [],
  onSaveFilter,
  onLoadFilter,
  onDeleteFilter
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    hasProducts: '',
    level: '',
    hasRules: '',
    isExternal: ''
  });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [filterName, setFilterName] = useState('');
  const [showSaveFilter, setShowSaveFilter] = useState(false);

  const statusOptions = [
    { value: '', label: 'Todos los estados' },
    { value: 'active', label: 'Activas' },
    { value: 'inactive', label: 'Inactivas' },
    { value: 'pending', label: 'Pendientes' },
    { value: 'archived', label: 'Archivadas' }
  ];

  const productOptions = [
    { value: '', label: 'Todas las categorías' },
    { value: 'with', label: 'Con productos' },
    { value: 'without', label: 'Sin productos' },
    { value: 'low', label: 'Pocos productos (<10)' },
    { value: 'high', label: 'Muchos productos (>100)' }
  ];

  const levelOptions = [
    { value: '', label: 'Todos los niveles' },
    { value: '1', label: 'Nivel 1 (Raíz)' },
    { value: '2', label: 'Nivel 2' },
    { value: '3', label: 'Nivel 3' },
    { value: '4', label: 'Nivel 4' },
    { value: '5', label: 'Nivel 5+' }
  ];

  const booleanOptions = [
    { value: '', label: 'Todas' },
    { value: 'true', label: 'Sí' },
    { value: 'false', label: 'No' }
  ];

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, onSearch]);

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilters({
      status: '',
      hasProducts: '',
      level: '',
      hasRules: '',
      isExternal: ''
    });
  };

  const handleSaveFilter = () => {
    if (filterName?.trim()) {
      const filterData = {
        name: filterName,
        searchTerm,
        filters,
        createdAt: new Date()?.toISOString()
      };
      onSaveFilter(filterData);
      setFilterName('');
      setShowSaveFilter(false);
    }
  };

  const handleLoadFilter = (filter) => {
    setSearchTerm(filter?.searchTerm || '');
    setFilters(filter?.filters || {});
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (searchTerm) count++;
    Object.values(filters)?.forEach(value => {
      if (value) count++;
    });
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-4">
      {/* Search Bar */}
      <div className="flex items-center space-x-2">
        <div className="flex-1 relative">
          <Icon 
            name="Search" 
            size={20} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
          />
          <Input
            type="search"
            placeholder="Buscar categorías por nombre, descripción o atributos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e?.target?.value)}
            className="pl-10"
          />
        </div>
        
        <Button
          variant="outline"
          onClick={() => setShowAdvanced(!showAdvanced)}
          iconName={showAdvanced ? 'ChevronUp' : 'Filter'}
          iconPosition="left"
        >
          Filtros avanzados
          {activeFilterCount > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </div>
      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="space-y-4 pt-4 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Select
              label="Estado"
              options={statusOptions}
              value={filters?.status}
              onChange={(value) => handleFilterChange('status', value)}
            />
            
            <Select
              label="Productos"
              options={productOptions}
              value={filters?.hasProducts}
              onChange={(value) => handleFilterChange('hasProducts', value)}
            />
            
            <Select
              label="Nivel de jerarquía"
              options={levelOptions}
              value={filters?.level}
              onChange={(value) => handleFilterChange('level', value)}
            />
            
            <Select
              label="Reglas automáticas"
              options={booleanOptions}
              value={filters?.hasRules}
              onChange={(value) => handleFilterChange('hasRules', value)}
            />
            
            <Select
              label="Categoría externa"
              options={booleanOptions}
              value={filters?.isExternal}
              onChange={(value) => handleFilterChange('isExternal', value)}
            />
          </div>

          {/* Filter Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearFilters}
                iconName="X"
                disabled={activeFilterCount === 0}
              >
                Limpiar filtros
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSaveFilter(!showSaveFilter)}
                iconName="Save"
                disabled={activeFilterCount === 0}
              >
                Guardar filtro
              </Button>
            </div>

            {/* Saved Filters */}
            {savedFilters?.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Filtros guardados:</span>
                <div className="flex items-center space-x-1">
                  {savedFilters?.slice(0, 3)?.map((filter, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLoadFilter(filter)}
                      className="text-xs"
                    >
                      {filter?.name}
                    </Button>
                  ))}
                  {savedFilters?.length > 3 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="MoreHorizontal"
                    >
                      +{savedFilters?.length - 3}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Save Filter Form */}
          {showSaveFilter && (
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center space-x-2">
                <Input
                  type="text"
                  placeholder="Nombre del filtro"
                  value={filterName}
                  onChange={(e) => setFilterName(e?.target?.value)}
                  className="flex-1"
                />
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleSaveFilter}
                  disabled={!filterName?.trim()}
                >
                  Guardar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSaveFilter(false)}
                  iconName="X"
                />
              </div>
            </div>
          )}
        </div>
      )}
      {/* Quick Filters */}
      <div className="flex items-center space-x-2 pt-2 border-t border-border">
        <span className="text-sm text-muted-foreground">Filtros rápidos:</span>
        <Button
          variant={filters?.status === 'active' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleFilterChange('status', filters?.status === 'active' ? '' : 'active')}
        >
          Activas
        </Button>
        <Button
          variant={filters?.hasProducts === 'without' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleFilterChange('hasProducts', filters?.hasProducts === 'without' ? '' : 'without')}
        >
          Sin productos
        </Button>
        <Button
          variant={filters?.hasRules === 'true' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleFilterChange('hasRules', filters?.hasRules === 'true' ? '' : 'true')}
        >
          Con reglas
        </Button>
        <Button
          variant={filters?.level === '1' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleFilterChange('level', filters?.level === '1' ? '' : '1')}
        >
          Nivel raíz
        </Button>
      </div>
    </div>
  );
};

export default CategorySearch;
import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const MovementHistoryTab = ({ movementData, onExportHistory }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('all');
  const [dateRange, setDateRange] = useState('today');
  const [sortConfig, setSortConfig] = useState({ key: 'timestamp', direction: 'desc' });

  const typeOptions = [
    { value: 'all', label: 'Todos los Tipos' },
    { value: 'adjustment', label: 'Ajuste Manual' },
    { value: 'sale', label: 'Venta' },
    { value: 'purchase', label: 'Compra' },
    { value: 'transfer', label: 'Transferencia' },
    { value: 'return', label: 'Devolución' },
    { value: 'damage', label: 'Daño/Pérdida' }
  ];

  const userOptions = [
    { value: 'all', label: 'Todos los Usuarios' },
    { value: 'system', label: 'Sistema Automático' },
    { value: 'maria.garcia', label: 'María García' },
    { value: 'carlos.lopez', label: 'Carlos López' },
    { value: 'ana.martinez', label: 'Ana Martínez' }
  ];

  const dateRangeOptions = [
    { value: 'today', label: 'Hoy' },
    { value: 'yesterday', label: 'Ayer' },
    { value: 'week', label: 'Esta Semana' },
    { value: 'month', label: 'Este Mes' },
    { value: 'quarter', label: 'Este Trimestre' }
  ];

  const getMovementIcon = (type) => {
    const icons = {
      adjustment: 'Edit',
      sale: 'ShoppingCart',
      purchase: 'Package',
      transfer: 'ArrowRightLeft',
      return: 'RotateCcw',
      damage: 'AlertTriangle'
    };
    return icons?.[type] || 'Activity';
  };

  const getMovementColor = (type, quantity) => {
    if (quantity > 0) return 'text-success';
    if (quantity < 0) return 'text-error';
    return 'text-muted-foreground';
  };

  const getTypeLabel = (type) => {
    const labels = {
      adjustment: 'Ajuste',
      sale: 'Venta',
      purchase: 'Compra',
      transfer: 'Transferencia',
      return: 'Devolución',
      damage: 'Daño'
    };
    return labels?.[type] || type;
  };

  const filteredAndSortedData = useMemo(() => {
    let filtered = movementData?.filter(movement => {
      const matchesSearch = movement?.sku?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                           movement?.productName?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                           movement?.reference?.toLowerCase()?.includes(searchTerm?.toLowerCase());
      
      const matchesType = typeFilter === 'all' || movement?.type === typeFilter;
      const matchesUser = userFilter === 'all' || movement?.user === userFilter;

      // Date filtering logic would go here
      const matchesDate = true; // Simplified for demo

      return matchesSearch && matchesType && matchesUser && matchesDate;
    });

    if (sortConfig?.key) {
      filtered?.sort((a, b) => {
        let aValue = a?.[sortConfig?.key];
        let bValue = b?.[sortConfig?.key];
        
        if (sortConfig?.key === 'timestamp') {
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
  }, [movementData, searchTerm, typeFilter, userFilter, dateRange, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev?.key === key && prev?.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const SortableHeader = ({ sortKey, children }) => (
    <th 
      className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/50 transition-micro"
      onClick={() => handleSort(sortKey)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        {sortConfig?.key === sortKey && (
          <Icon 
            name={sortConfig?.direction === 'asc' ? 'ChevronUp' : 'ChevronDown'} 
            size={14} 
          />
        )}
      </div>
    </th>
  );

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 p-4 bg-muted/30 rounded-lg">
        <div className="flex-1">
          <Input
            type="search"
            placeholder="Buscar por SKU, producto o referencia..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e?.target?.value)}
            className="w-full"
          />
        </div>
        <div className="flex gap-3">
          <Select
            options={typeOptions}
            value={typeFilter}
            onChange={setTypeFilter}
            placeholder="Tipo"
            className="w-48"
          />
          <Select
            options={userOptions}
            value={userFilter}
            onChange={setUserFilter}
            placeholder="Usuario"
            className="w-48"
          />
          <Select
            options={dateRangeOptions}
            value={dateRange}
            onChange={setDateRange}
            placeholder="Período"
            className="w-48"
          />
        </div>
      </div>
      {/* Export Actions */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          {filteredAndSortedData?.length} movimientos encontrados
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            iconName="Download"
            onClick={() => onExportHistory('csv')}
          >
            Exportar CSV
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            iconName="FileText"
            onClick={() => onExportHistory('pdf')}
          >
            Exportar PDF
          </Button>
        </div>
      </div>
      {/* Movement History Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <SortableHeader sortKey="timestamp">Fecha/Hora</SortableHeader>
                <SortableHeader sortKey="type">Tipo</SortableHeader>
                <SortableHeader sortKey="sku">SKU</SortableHeader>
                <SortableHeader sortKey="productName">Producto</SortableHeader>
                <SortableHeader sortKey="quantity">Cantidad</SortableHeader>
                <SortableHeader sortKey="previousStock">Stock Anterior</SortableHeader>
                <SortableHeader sortKey="newStock">Stock Nuevo</SortableHeader>
                <SortableHeader sortKey="location">Ubicación</SortableHeader>
                <SortableHeader sortKey="user">Usuario</SortableHeader>
                <SortableHeader sortKey="reference">Referencia</SortableHeader>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Notas
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredAndSortedData?.map((movement) => (
                <tr 
                  key={movement?.id} 
                  className="hover:bg-muted/30 transition-micro"
                >
                  <td className="px-4 py-3">
                    <div className="text-sm text-foreground">
                      {new Date(movement.timestamp)?.toLocaleDateString('es-ES')}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(movement.timestamp)?.toLocaleTimeString('es-ES')}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <Icon 
                        name={getMovementIcon(movement?.type)} 
                        size={16} 
                        className="text-muted-foreground" 
                      />
                      <span className="text-sm font-medium text-foreground">
                        {getTypeLabel(movement?.type)}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-sm text-foreground">
                    {movement?.sku}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-foreground">{movement?.productName}</div>
                    <div className="text-xs text-muted-foreground">{movement?.category}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-semibold ${getMovementColor(movement?.type, movement?.quantity)}`}>
                      {movement?.quantity > 0 ? '+' : ''}{movement?.quantity?.toLocaleString('es-ES')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {movement?.previousStock?.toLocaleString('es-ES')}
                  </td>
                  <td className="px-4 py-3 font-medium text-foreground">
                    {movement?.newStock?.toLocaleString('es-ES')}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary/10 text-secondary">
                      {movement?.location}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center">
                        <Icon name="User" size={12} className="text-muted-foreground" />
                      </div>
                      <span className="text-sm text-foreground">{movement?.userName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                    {movement?.reference}
                  </td>
                  <td className="px-4 py-3">
                    {movement?.notes && (
                      <div className="text-xs text-muted-foreground max-w-32 truncate" title={movement?.notes}>
                        {movement?.notes}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Pagination would go here */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Mostrando {filteredAndSortedData?.length} movimientos
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" disabled>
            <Icon name="ChevronLeft" size={16} />
            Anterior
          </Button>
          <span className="text-sm text-muted-foreground">Página 1 de 1</span>
          <Button variant="outline" size="sm" disabled>
            Siguiente
            <Icon name="ChevronRight" size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MovementHistoryTab;
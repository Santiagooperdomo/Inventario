import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const StockLevelsTab = ({ stockData, onStockUpdate, onBulkTransfer, userRole }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'sku', direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');

  const statusOptions = [
    { value: 'all', label: 'Todos los Estados' },
    { value: 'in-stock', label: 'En Stock' },
    { value: 'low-stock', label: 'Stock Bajo' },
    { value: 'out-of-stock', label: 'Sin Stock' },
    { value: 'overstock', label: 'Exceso de Stock' }
  ];

  const locationOptions = [
    { value: 'all', label: 'Todas las Ubicaciones' },
    { value: 'warehouse-a', label: 'Almacén A' },
    { value: 'warehouse-b', label: 'Almacén B' },
    { value: 'store-central', label: 'Tienda Central' },
    { value: 'store-norte', label: 'Tienda Norte' }
  ];

  const getStatusColor = (item) => {
    if (item?.currentStock === 0) return 'text-error bg-error/10';
    if (item?.currentStock <= item?.reorderPoint) return 'text-warning bg-warning/10';
    if (item?.currentStock > item?.reorderPoint * 3) return 'text-accent bg-accent/10';
    return 'text-success bg-success/10';
  };

  const getStatusText = (item) => {
    if (item?.currentStock === 0) return 'Sin Stock';
    if (item?.currentStock <= item?.reorderPoint) return 'Stock Bajo';
    if (item?.currentStock > item?.reorderPoint * 3) return 'Exceso';
    return 'En Stock';
  };

  const filteredAndSortedData = useMemo(() => {
    let filtered = stockData?.filter(item => {
      const matchesSearch = item?.sku?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                           item?.productName?.toLowerCase()?.includes(searchTerm?.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'in-stock' && item?.currentStock > item?.reorderPoint) ||
        (statusFilter === 'low-stock' && item?.currentStock <= item?.reorderPoint && item?.currentStock > 0) ||
        (statusFilter === 'out-of-stock' && item?.currentStock === 0) ||
        (statusFilter === 'overstock' && item?.currentStock > item?.reorderPoint * 3);

      const matchesLocation = locationFilter === 'all' || item?.location === locationFilter;

      return matchesSearch && matchesStatus && matchesLocation;
    });

    if (sortConfig?.key) {
      filtered?.sort((a, b) => {
        let aValue = a?.[sortConfig?.key];
        let bValue = b?.[sortConfig?.key];
        
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
  }, [stockData, searchTerm, statusFilter, locationFilter, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev?.key === key && prev?.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSelectAll = () => {
    if (selectedItems?.length === filteredAndSortedData?.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredAndSortedData?.map(item => item?.id));
    }
  };

  const handleItemSelect = (itemId) => {
    setSelectedItems(prev => 
      prev?.includes(itemId) 
        ? prev?.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleQuickAdjustment = (itemId, adjustment) => {
    const item = stockData?.find(i => i?.id === itemId);
    if (item) {
      const newStock = Math.max(0, item?.currentStock + adjustment);
      onStockUpdate(itemId, newStock);
    }
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
      {/* Filters and Search */}
      <div className="flex flex-col lg:flex-row gap-4 p-4 bg-muted/30 rounded-lg">
        <div className="flex-1">
          <Input
            type="search"
            placeholder="Buscar por SKU o nombre del producto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e?.target?.value)}
            className="w-full"
          />
        </div>
        <div className="flex gap-3">
          <Select
            options={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="Estado"
            className="w-48"
          />
          <Select
            options={locationOptions}
            value={locationFilter}
            onChange={setLocationFilter}
            placeholder="Ubicación"
            className="w-48"
          />
        </div>
      </div>
      {/* Bulk Actions */}
      {selectedItems?.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-accent/10 border border-accent/20 rounded-lg">
          <span className="text-sm font-medium text-foreground">
            {selectedItems?.length} elementos seleccionados
          </span>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              iconName="ArrowRightLeft"
              onClick={() => onBulkTransfer(selectedItems)}
            >
              Transferir
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              iconName="Edit"
            >
              Ajustar Stock
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              iconName="RefreshCw"
            >
              Recalcular
            </Button>
          </div>
        </div>
      )}
      {/* Stock Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 w-12">
                  <input
                    type="checkbox"
                    checked={selectedItems?.length === filteredAndSortedData?.length && filteredAndSortedData?.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-border"
                  />
                </th>
                <SortableHeader sortKey="sku">SKU</SortableHeader>
                <SortableHeader sortKey="productName">Producto</SortableHeader>
                <SortableHeader sortKey="currentStock">Stock Actual</SortableHeader>
                <SortableHeader sortKey="reservedQuantity">Reservado</SortableHeader>
                <SortableHeader sortKey="availableStock">Disponible</SortableHeader>
                <SortableHeader sortKey="reorderPoint">Punto Reorden</SortableHeader>
                <SortableHeader sortKey="location">Ubicación</SortableHeader>
                {userRole === 'manager' && (
                  <>
                    <SortableHeader sortKey="unitCost">Costo Unit.</SortableHeader>
                    <SortableHeader sortKey="totalValue">Valor Total</SortableHeader>
                  </>
                )}
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredAndSortedData?.map((item) => (
                <tr 
                  key={item?.id} 
                  className="hover:bg-muted/30 transition-micro"
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedItems?.includes(item?.id)}
                      onChange={() => handleItemSelect(item?.id)}
                      className="rounded border-border"
                    />
                  </td>
                  <td className="px-4 py-3 font-mono text-sm text-foreground">
                    {item?.sku}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                        <Icon name="Package" size={16} className="text-muted-foreground" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{item?.productName}</div>
                        <div className="text-xs text-muted-foreground">{item?.category}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold text-foreground">
                    {item?.currentStock?.toLocaleString('es-ES')}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {item?.reservedQuantity?.toLocaleString('es-ES')}
                  </td>
                  <td className="px-4 py-3 font-medium text-foreground">
                    {item?.availableStock?.toLocaleString('es-ES')}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {item?.reorderPoint?.toLocaleString('es-ES')}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary/10 text-secondary">
                      {locationOptions?.find(loc => loc?.value === item?.location)?.label || item?.location}
                    </span>
                  </td>
                  {userRole === 'manager' && (
                    <>
                      <td className="px-4 py-3 text-muted-foreground">
                        €{item?.unitCost?.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 font-medium text-foreground">
                        €{(item?.currentStock * item?.unitCost)?.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                      </td>
                    </>
                  )}
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item)}`}>
                      {getStatusText(item)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleQuickAdjustment(item?.id, -1)}
                        className="w-7 h-7"
                        disabled={item?.currentStock === 0}
                      >
                        <Icon name="Minus" size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleQuickAdjustment(item?.id, 1)}
                        className="w-7 h-7"
                      >
                        <Icon name="Plus" size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-7 h-7"
                      >
                        <Icon name="MoreHorizontal" size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Mostrando {filteredAndSortedData?.length} de {stockData?.length} productos
        </span>
        <div className="flex items-center space-x-4">
          <span>Total en Stock: {filteredAndSortedData?.reduce((sum, item) => sum + item?.currentStock, 0)?.toLocaleString('es-ES')}</span>
          {userRole === 'manager' && (
            <span>
              Valor Total: €{filteredAndSortedData?.reduce((sum, item) => sum + (item?.currentStock * item?.unitCost), 0)?.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default StockLevelsTab;
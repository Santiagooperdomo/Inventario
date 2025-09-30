import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Image from '../../../components/AppImage';

const ProductGrid = ({ products, selectedProducts, onProductSelect, onProductEdit, onBulkAction }) => {
  const [editingProduct, setEditingProduct] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig?.key === key && sortConfig?.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleInlineEdit = (product) => {
    setEditingProduct(product?.id);
    setEditValues({
      name: product?.name,
      price: product?.price,
      cost: product?.cost,
      stock: product?.stock
    });
  };

  const handleSaveEdit = () => {
    onProductEdit(editingProduct, editValues);
    setEditingProduct(null);
    setEditValues({});
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setEditValues({});
  };

  const getStatusBadge = (status, stock) => {
    if (status === 'inactive') {
      return <span className="px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground">Inactivo</span>;
    }
    if (stock <= 10) {
      return <span className="px-2 py-1 text-xs rounded-full bg-error/10 text-error">Stock Bajo</span>;
    }
    if (stock <= 50) {
      return <span className="px-2 py-1 text-xs rounded-full bg-warning/10 text-warning">Stock Medio</span>;
    }
    return <span className="px-2 py-1 text-xs rounded-full bg-success/10 text-success">En Stock</span>;
  };

  const sortedProducts = [...products]?.sort((a, b) => {
    if (sortConfig?.direction === 'asc') {
      return a?.[sortConfig?.key] > b?.[sortConfig?.key] ? 1 : -1;
    }
    return a?.[sortConfig?.key] < b?.[sortConfig?.key] ? 1 : -1;
  });

  return (
    <div className="h-full bg-card flex flex-col">
      {/* Bulk Actions Bar */}
      {selectedProducts?.length > 0 && (
        <div className="p-4 bg-accent/5 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-foreground">
                {selectedProducts?.length} productos seleccionados
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                iconName="Edit"
                iconPosition="left"
                onClick={() => onBulkAction('edit')}
              >
                Editar Precios
              </Button>
              <Button
                variant="outline"
                size="sm"
                iconName="FolderOpen"
                iconPosition="left"
                onClick={() => onBulkAction('category')}
              >
                Cambiar Categoría
              </Button>
              <Button
                variant="outline"
                size="sm"
                iconName="Download"
                iconPosition="left"
                onClick={() => onBulkAction('export')}
              >
                Exportar
              </Button>
              <Button
                variant="destructive"
                size="sm"
                iconName="Trash2"
                iconPosition="left"
                onClick={() => onBulkAction('delete')}
              >
                Eliminar
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Product Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-muted border-b border-border">
            <tr>
              <th className="w-12 p-3 text-left">
                <input
                  type="checkbox"
                  className="rounded border-border"
                  onChange={(e) => {
                    if (e?.target?.checked) {
                      onProductSelect(products?.map(p => p?.id));
                    } else {
                      onProductSelect([]);
                    }
                  }}
                />
              </th>
              <th className="w-16 p-3 text-left">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Imagen
                </span>
              </th>
              <th className="p-3 text-left cursor-pointer" onClick={() => handleSort('sku')}>
                <div className="flex items-center space-x-1">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    SKU
                  </span>
                  <Icon name="ArrowUpDown" size={12} className="text-muted-foreground" />
                </div>
              </th>
              <th className="p-3 text-left cursor-pointer" onClick={() => handleSort('name')}>
                <div className="flex items-center space-x-1">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Nombre del Producto
                  </span>
                  <Icon name="ArrowUpDown" size={12} className="text-muted-foreground" />
                </div>
              </th>
              <th className="p-3 text-left">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Categoría
                </span>
              </th>
              <th className="p-3 text-left cursor-pointer" onClick={() => handleSort('stock')}>
                <div className="flex items-center space-x-1">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Stock
                  </span>
                  <Icon name="ArrowUpDown" size={12} className="text-muted-foreground" />
                </div>
              </th>
              <th className="p-3 text-left cursor-pointer" onClick={() => handleSort('cost')}>
                <div className="flex items-center space-x-1">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Costo
                  </span>
                  <Icon name="ArrowUpDown" size={12} className="text-muted-foreground" />
                </div>
              </th>
              <th className="p-3 text-left cursor-pointer" onClick={() => handleSort('price')}>
                <div className="flex items-center space-x-1">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Precio
                  </span>
                  <Icon name="ArrowUpDown" size={12} className="text-muted-foreground" />
                </div>
              </th>
              <th className="p-3 text-left">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Estado
                </span>
              </th>
              <th className="w-24 p-3 text-left">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Acciones
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedProducts?.map((product) => (
              <tr
                key={product?.id}
                className="border-b border-border hover:bg-muted/50 transition-micro"
              >
                <td className="p-3">
                  <input
                    type="checkbox"
                    className="rounded border-border"
                    checked={selectedProducts?.includes(product?.id)}
                    onChange={(e) => {
                      if (e?.target?.checked) {
                        onProductSelect([...selectedProducts, product?.id]);
                      } else {
                        onProductSelect(selectedProducts?.filter(id => id !== product?.id));
                      }
                    }}
                  />
                </td>
                <td className="p-3">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={product?.image}
                      alt={product?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </td>
                <td className="p-3">
                  <span className="text-sm font-mono text-foreground">{product?.sku}</span>
                </td>
                <td className="p-3">
                  {editingProduct === product?.id ? (
                    <Input
                      type="text"
                      value={editValues?.name}
                      onChange={(e) => setEditValues({...editValues, name: e?.target?.value})}
                      className="w-full"
                    />
                  ) : (
                    <div>
                      <span className="text-sm font-medium text-foreground">{product?.name}</span>
                      <p className="text-xs text-muted-foreground">{product?.description}</p>
                    </div>
                  )}
                </td>
                <td className="p-3">
                  <span className="text-sm text-muted-foreground">{product?.category}</span>
                </td>
                <td className="p-3">
                  {editingProduct === product?.id ? (
                    <Input
                      type="number"
                      value={editValues?.stock}
                      onChange={(e) => setEditValues({...editValues, stock: parseInt(e?.target?.value)})}
                      className="w-20"
                    />
                  ) : (
                    <span className="text-sm font-medium text-foreground">{product?.stock}</span>
                  )}
                </td>
                <td className="p-3">
                  {editingProduct === product?.id ? (
                    <Input
                      type="number"
                      step="0.01"
                      value={editValues?.cost}
                      onChange={(e) => setEditValues({...editValues, cost: parseFloat(e?.target?.value)})}
                      className="w-24"
                    />
                  ) : (
                    <span className="text-sm text-foreground">${product?.cost?.toFixed(2)}</span>
                  )}
                </td>
                <td className="p-3">
                  {editingProduct === product?.id ? (
                    <Input
                      type="number"
                      step="0.01"
                      value={editValues?.price}
                      onChange={(e) => setEditValues({...editValues, price: parseFloat(e?.target?.value)})}
                      className="w-24"
                    />
                  ) : (
                    <span className="text-sm font-medium text-foreground">${product?.price?.toFixed(2)}</span>
                  )}
                </td>
                <td className="p-3">
                  {getStatusBadge(product?.status, product?.stock)}
                </td>
                <td className="p-3">
                  {editingProduct === product?.id ? (
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleSaveEdit}
                      >
                        <Icon name="Check" size={16} className="text-success" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleCancelEdit}
                      >
                        <Icon name="X" size={16} className="text-error" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleInlineEdit(product)}
                      >
                        <Icon name="Edit" size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onProductSelect([product?.id])}
                      >
                        <Icon name="Eye" size={16} />
                      </Button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductGrid;
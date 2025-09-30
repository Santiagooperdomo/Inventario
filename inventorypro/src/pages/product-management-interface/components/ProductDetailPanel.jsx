import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ProductDetailPanel = ({ product, onClose, onEdit, onDelete }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!product) {
    return (
      <div className="h-full bg-card border-l border-border flex items-center justify-center">
        <div className="text-center">
          <Icon name="Package" size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Seleccionar Producto</h3>
          <p className="text-sm text-muted-foreground">
            Selecciona un producto de la lista para ver los detalles
          </p>
        </div>
      </div>
    );
  }

  const stockHistory = [
    { month: 'Ene', stock: 120 },
    { month: 'Feb', stock: 98 },
    { month: 'Mar', stock: 156 },
    { month: 'Abr', stock: 89 },
    { month: 'May', stock: 134 },
    { month: 'Jun', stock: product?.stock }
  ];

  const tabs = [
    { id: 'overview', label: 'Resumen', icon: 'Info' },
    { id: 'specifications', label: 'Especificaciones', icon: 'FileText' },
    { id: 'supplier', label: 'Proveedor', icon: 'Truck' },
    { id: 'history', label: 'Historial', icon: 'Clock' }
  ];

  return (
    <div className="h-full bg-card border-l border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Detalles del Producto</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Product Header */}
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
            <Image
              src={product?.image}
              alt={product?.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-foreground truncate">{product?.name}</h3>
            <p className="text-sm text-muted-foreground">{product?.sku}</p>
            <div className="flex items-center space-x-2 mt-2">
              <span className={`px-2 py-1 text-xs rounded-full ${
                product?.stock <= 10 ? 'bg-error/10 text-error' :
                product?.stock <= 50 ? 'bg-warning/10 text-warning': 'bg-success/10 text-success'
              }`}>
                {product?.stock} unidades
              </span>
              <span className="text-sm font-medium text-foreground">${product?.price?.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            iconName="Edit"
            iconPosition="left"
            onClick={() => onEdit(product)}
          >
            Editar
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="Copy"
            iconPosition="left"
          >
            Duplicar
          </Button>
          <Button
            variant="destructive"
            size="sm"
            iconName="Trash2"
            iconPosition="left"
            onClick={() => onDelete(product)}
          >
            Eliminar
          </Button>
        </div>
      </div>
      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-micro ${
                activeTab === tab?.id
                  ? 'text-primary border-b-2 border-primary' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name={tab?.icon} size={16} />
              <span>{tab?.label}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Image Gallery */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-3">Imágenes</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                  <Image
                    src={product?.image}
                    alt={product?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                  <Image
                    src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop"
                    alt="Vista lateral"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Basic Info */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-3">Información Básica</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Descripción</span>
                  <span className="text-sm text-foreground text-right max-w-48">
                    {product?.description}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Categoría</span>
                  <span className="text-sm text-foreground">{product?.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Marca</span>
                  <span className="text-sm text-foreground">{product?.brand || 'Sin marca'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Código de Barras</span>
                  <span className="text-sm font-mono text-foreground">{product?.barcode || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-3">Precios</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Costo</span>
                  <span className="text-sm text-foreground">${product?.cost?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Precio de Venta</span>
                  <span className="text-sm font-medium text-foreground">${product?.price?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Margen</span>
                  <span className="text-sm text-success">
                    {(((product?.price - product?.cost) / product?.cost) * 100)?.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Stock Chart */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-3">Historial de Stock</h4>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stockHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
                    />
                    <YAxis 
                      tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'var(--color-popover)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="stock" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'specifications' && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-foreground">Especificaciones Técnicas</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Peso</span>
                <span className="text-sm text-foreground">2.5 kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Dimensiones</span>
                <span className="text-sm text-foreground">30 x 20 x 15 cm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Material</span>
                <span className="text-sm text-foreground">Plástico ABS</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Color</span>
                <span className="text-sm text-foreground">Negro</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Garantía</span>
                <span className="text-sm text-foreground">12 meses</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'supplier' && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-foreground">Información del Proveedor</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Proveedor Principal</span>
                <span className="text-sm text-foreground">TechSupply S.A.</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Código de Proveedor</span>
                <span className="text-sm font-mono text-foreground">TS-{product?.sku}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Tiempo de Entrega</span>
                <span className="text-sm text-foreground">5-7 días</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Pedido Mínimo</span>
                <span className="text-sm text-foreground">50 unidades</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Última Compra</span>
                <span className="text-sm text-foreground">15/09/2025</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-foreground">Historial de Movimientos</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 bg-muted rounded-lg">
                <Icon name="Plus" size={16} className="text-success mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Entrada de Stock</p>
                  <p className="text-xs text-muted-foreground">+50 unidades • 16/09/2025 14:30</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-muted rounded-lg">
                <Icon name="Minus" size={16} className="text-error mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Venta</p>
                  <p className="text-xs text-muted-foreground">-12 unidades • 15/09/2025 10:15</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-muted rounded-lg">
                <Icon name="Edit" size={16} className="text-accent mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Actualización de Precio</p>
                  <p className="text-xs text-muted-foreground">$89.99 → $94.99 • 14/09/2025 16:45</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPanel;
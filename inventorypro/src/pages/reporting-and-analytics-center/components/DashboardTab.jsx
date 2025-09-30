import React, { useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DashboardTab = ({ onDrillDown }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedMetrics, setSelectedMetrics] = useState(['inventory', 'turnover', 'value']);

  const inventoryData = [
    { month: 'Ene', stock: 2400, ventas: 1800, compras: 2200 },
    { month: 'Feb', stock: 2100, ventas: 2100, compras: 1900 },
    { month: 'Mar', stock: 2800, ventas: 2400, compras: 2600 },
    { month: 'Abr', stock: 2200, ventas: 1900, compras: 2100 },
    { month: 'May', stock: 2600, ventas: 2300, compras: 2400 },
    { month: 'Jun', stock: 2900, ventas: 2600, compras: 2700 }
  ];

  const categoryData = [
    { name: 'Electrónicos', value: 35, color: '#1e40af' },
    { name: 'Ropa', value: 25, color: '#0ea5e9' },
    { name: 'Hogar', value: 20, color: '#059669' },
    { name: 'Deportes', value: 12, color: '#d97706' },
    { name: 'Otros', value: 8, color: '#dc2626' }
  ];

  const turnoverData = [
    { product: 'iPhone 14', turnover: 8.5, stock: 45, sales: 382 },
    { product: 'Samsung TV', turnover: 6.2, stock: 23, sales: 142 },
    { product: 'Nike Air Max', turnover: 12.1, stock: 67, sales: 810 },
    { product: 'MacBook Pro', turnover: 4.3, stock: 12, sales: 52 },
    { product: 'PlayStation 5', turnover: 15.8, stock: 8, sales: 126 }
  ];

  const kpiCards = [
    {
      title: 'Valor Total Inventario',
      value: '€2,847,392',
      change: '+12.5%',
      trend: 'up',
      icon: 'DollarSign',
      color: 'text-success'
    },
    {
      title: 'Rotación Promedio',
      value: '7.2x',
      change: '+0.8x',
      trend: 'up',
      icon: 'RotateCcw',
      color: 'text-accent'
    },
    {
      title: 'Stock Bajo Mínimo',
      value: '23',
      change: '-5',
      trend: 'down',
      icon: 'AlertTriangle',
      color: 'text-warning'
    },
    {
      title: 'Productos Sin Movimiento',
      value: '156',
      change: '+12',
      trend: 'up',
      icon: 'Package',
      color: 'text-error'
    }
  ];

  const periods = [
    { value: 'week', label: 'Semana' },
    { value: 'month', label: 'Mes' },
    { value: 'quarter', label: 'Trimestre' },
    { value: 'year', label: 'Año' }
  ];

  const handleDrillDown = (data, type) => {
    onDrillDown({ data, type, timestamp: new Date()?.toISOString() });
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Panel de Control</h2>
          <p className="text-muted-foreground">Métricas clave y análisis de rendimiento</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Icon name="Calendar" size={16} className="text-muted-foreground" />
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e?.target?.value)}
              className="bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {periods?.map(period => (
                <option key={period?.value} value={period?.value}>
                  {period?.label}
                </option>
              ))}
            </select>
          </div>
          
          <Button variant="outline" iconName="Download" iconPosition="left">
            Exportar
          </Button>
          
          <Button variant="outline" iconName="RefreshCw" iconPosition="left">
            Actualizar
          </Button>
        </div>
      </div>
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards?.map((kpi, index) => (
          <div
            key={index}
            className="bg-card border border-border rounded-lg p-6 cursor-pointer hover:shadow-lg transition-all duration-200"
            onClick={() => handleDrillDown(kpi, 'kpi')}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg bg-muted flex items-center justify-center ${kpi?.color}`}>
                <Icon name={kpi?.icon} size={24} />
              </div>
              <div className={`flex items-center space-x-1 text-sm ${
                kpi?.trend === 'up' ? 'text-success' : 'text-error'
              }`}>
                <Icon name={kpi?.trend === 'up' ? 'TrendingUp' : 'TrendingDown'} size={16} />
                <span>{kpi?.change}</span>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-1">{kpi?.value}</h3>
              <p className="text-sm text-muted-foreground">{kpi?.title}</p>
            </div>
          </div>
        ))}
      </div>
      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inventory Trend Chart */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Tendencia de Inventario</h3>
              <p className="text-sm text-muted-foreground">Stock, ventas y compras por mes</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDrillDown(inventoryData, 'inventory-trend')}
            >
              <Icon name="Maximize2" size={16} />
            </Button>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={inventoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--color-popover)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar dataKey="stock" fill="var(--color-primary)" name="Stock" />
                <Bar dataKey="ventas" fill="var(--color-accent)" name="Ventas" />
                <Bar dataKey="compras" fill="var(--color-success)" name="Compras" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Distribución por Categoría</h3>
              <p className="text-sm text-muted-foreground">Valor de inventario por categoría</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDrillDown(categoryData, 'category-distribution')}
            >
              <Icon name="Maximize2" size={16} />
            </Button>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {categoryData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry?.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--color-popover)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      {/* Top Products Table */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Productos con Mayor Rotación</h3>
            <p className="text-sm text-muted-foreground">Top 5 productos por velocidad de rotación</p>
          </div>
          <Button
            variant="outline"
            iconName="ExternalLink"
            iconPosition="right"
            onClick={() => handleDrillDown(turnoverData, 'top-products')}
          >
            Ver Todos
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Producto</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">Rotación</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">Stock Actual</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">Ventas (30d)</th>
                <th className="text-center py-3 px-4 font-medium text-muted-foreground">Estado</th>
              </tr>
            </thead>
            <tbody>
              {turnoverData?.map((product, index) => (
                <tr
                  key={index}
                  className="border-b border-border hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => handleDrillDown(product, 'product-detail')}
                >
                  <td className="py-3 px-4">
                    <div className="font-medium text-foreground">{product?.product}</div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="font-semibold text-foreground">{product?.turnover}x</span>
                  </td>
                  <td className="py-3 px-4 text-right text-muted-foreground">
                    {product?.stock}
                  </td>
                  <td className="py-3 px-4 text-right text-muted-foreground">
                    {product?.sales}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      product?.turnover > 10 ? 'bg-success/10 text-success' :
                      product?.turnover > 5 ? 'bg-warning/10 text-warning': 'bg-error/10 text-error'
                    }`}>
                      {product?.turnover > 10 ? 'Excelente' :
                       product?.turnover > 5 ? 'Bueno' : 'Lento'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardTab;
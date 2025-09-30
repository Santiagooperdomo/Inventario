import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import Icon from '../../../components/AppIcon';

const CategoryMetrics = ({ selectedCategory, onDrillDown }) => {
  // Mock data for category performance metrics
  const categoryDistribution = [
    { name: 'Electrónicos', value: 234, products: 1247, color: '#1e40af' },
    { name: 'Ropa', value: 189, products: 892, color: '#059669' },
    { name: 'Hogar', value: 156, products: 634, color: '#d97706' },
    { name: 'Deportes', value: 98, products: 445, color: '#dc2626' },
    { name: 'Libros', value: 67, products: 289, color: '#7c3aed' },
    { name: 'Otros', value: 45, products: 178, color: '#64748b' }
  ];

  const inventoryValue = [
    { category: 'Electrónicos', value: 450000, turnover: 3.2 },
    { category: 'Ropa', value: 280000, turnover: 4.1 },
    { category: 'Hogar', value: 320000, turnover: 2.8 },
    { category: 'Deportes', value: 180000, turnover: 3.7 },
    { category: 'Libros', value: 95000, turnover: 2.1 },
    { category: 'Otros', value: 75000, turnover: 1.9 }
  ];

  const monthlyTrends = [
    { month: 'Ene', categories: 789, products: 3245, value: 1200000 },
    { month: 'Feb', categories: 798, products: 3312, value: 1280000 },
    { month: 'Mar', categories: 812, products: 3456, value: 1350000 },
    { month: 'Abr', categories: 825, products: 3589, value: 1420000 },
    { month: 'May', categories: 834, products: 3678, value: 1480000 },
    { month: 'Jun', categories: 847, products: 3745, value: 1520000 }
  ];

  const categoryLevels = [
    { level: 'Nivel 1', count: 12, percentage: 1.4 },
    { level: 'Nivel 2', count: 89, percentage: 10.5 },
    { level: 'Nivel 3', count: 234, percentage: 27.6 },
    { level: 'Nivel 4', count: 356, percentage: 42.0 },
    { level: 'Nivel 5+', count: 156, percentage: 18.4 }
  ];

  const performanceMetrics = {
    totalCategories: 847,
    activeCategories: 789,
    inactiveCategories: 58,
    categoriesWithProducts: 723,
    emptyCategorories: 124,
    averageProductsPerCategory: 4.4,
    totalInventoryValue: 1520000,
    averageTurnoverRate: 2.9,
    categoriesWithRules: 234,
    externalCategories: 89
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(value);
  };

  const formatPercentage = (value) => {
    return `${value?.toFixed(1)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Métricas de rendimiento
          </h3>
          <p className="text-sm text-muted-foreground">
            Análisis detallado del rendimiento de categorías
          </p>
        </div>
        
        {selectedCategory && (
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Filter" size={16} />
            <span>Filtrado por: {selectedCategory?.name}</span>
          </div>
        )}
      </div>
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-card border border-border rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="FolderTree" size={20} className="text-primary" />
            <span className="text-sm font-medium text-foreground">Total Categorías</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{performanceMetrics?.totalCategories}</p>
          <p className="text-xs text-success">+12 este mes</p>
        </div>

        <div className="p-4 bg-card border border-border rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Package" size={20} className="text-accent" />
            <span className="text-sm font-medium text-foreground">Con Productos</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{performanceMetrics?.categoriesWithProducts}</p>
          <p className="text-xs text-muted-foreground">
            {formatPercentage((performanceMetrics?.categoriesWithProducts / performanceMetrics?.totalCategories) * 100)}
          </p>
        </div>

        <div className="p-4 bg-card border border-border rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="DollarSign" size={20} className="text-success" />
            <span className="text-sm font-medium text-foreground">Valor Total</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {formatCurrency(performanceMetrics?.totalInventoryValue)}
          </p>
          <p className="text-xs text-success">+8.5% vs mes anterior</p>
        </div>

        <div className="p-4 bg-card border border-border rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="TrendingUp" size={20} className="text-warning" />
            <span className="text-sm font-medium text-foreground">Rotación Promedio</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {performanceMetrics?.averageTurnoverRate}x
          </p>
          <p className="text-xs text-warning">-0.2x vs mes anterior</p>
        </div>
      </div>
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium text-foreground">
              Distribución por categoría
            </h4>
            <Icon name="PieChart" size={20} className="text-muted-foreground" />
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {categoryDistribution?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry?.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name, props) => [
                    `${value} categorías`,
                    props?.payload?.name
                  ]}
                  labelFormatter={() => ''}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 space-y-2">
            {categoryDistribution?.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item?.color }}
                  />
                  <span className="text-foreground">{item?.name}</span>
                </div>
                <div className="text-muted-foreground">
                  {item?.value} cat. • {item?.products} prod.
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inventory Value by Category */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium text-foreground">
              Valor de inventario
            </h4>
            <Icon name="BarChart3" size={20} className="text-muted-foreground" />
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={inventoryValue} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="category" 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                  tickFormatter={(value) => `${(value / 1000)?.toFixed(0)}K`}
                />
                <Tooltip 
                  formatter={(value) => [formatCurrency(value), 'Valor']}
                  labelStyle={{ color: 'var(--color-foreground)' }}
                  contentStyle={{ 
                    backgroundColor: 'var(--color-popover)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px'
                  }}
                />
                <Bar 
                  dataKey="value" 
                  fill="var(--color-primary)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      {/* Trends and Levels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Trends */}
        <div className="lg:col-span-2 bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium text-foreground">
              Tendencias mensuales
            </h4>
            <Icon name="TrendingUp" size={20} className="text-muted-foreground" />
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrends} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="month" 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                />
                <YAxis 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                />
                <Tooltip 
                  labelStyle={{ color: 'var(--color-foreground)' }}
                  contentStyle={{ 
                    backgroundColor: 'var(--color-popover)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="categories" 
                  stroke="var(--color-primary)" 
                  strokeWidth={2}
                  dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
                  name="Categorías"
                />
                <Line 
                  type="monotone" 
                  dataKey="products" 
                  stroke="var(--color-accent)" 
                  strokeWidth={2}
                  dot={{ fill: 'var(--color-accent)', strokeWidth: 2, r: 4 }}
                  name="Productos"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Levels */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium text-foreground">
              Niveles de jerarquía
            </h4>
            <Icon name="TreePine" size={20} className="text-muted-foreground" />
          </div>
          
          <div className="space-y-3">
            {categoryLevels?.map((level, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground font-medium">{level?.level}</span>
                  <span className="text-muted-foreground">{level?.count}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${level?.percentage}%` }}
                  />
                </div>
                <div className="text-xs text-muted-foreground text-right">
                  {formatPercentage(level?.percentage)}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-border">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Profundidad promedio</p>
              <p className="text-xl font-bold text-foreground">3.2 niveles</p>
            </div>
          </div>
        </div>
      </div>
      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="AlertTriangle" size={16} className="text-warning" />
            <span className="text-sm font-medium text-foreground">Categorías vacías</span>
          </div>
          <p className="text-xl font-bold text-foreground">{performanceMetrics?.emptyCategories}</p>
          <p className="text-xs text-muted-foreground">
            {formatPercentage((performanceMetrics?.emptyCategories / performanceMetrics?.totalCategories) * 100)} del total
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Zap" size={16} className="text-accent" />
            <span className="text-sm font-medium text-foreground">Con reglas automáticas</span>
          </div>
          <p className="text-xl font-bold text-foreground">{performanceMetrics?.categoriesWithRules}</p>
          <p className="text-xs text-muted-foreground">
            {formatPercentage((performanceMetrics?.categoriesWithRules / performanceMetrics?.totalCategories) * 100)} automatizadas
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="ExternalLink" size={16} className="text-secondary" />
            <span className="text-sm font-medium text-foreground">Externas</span>
          </div>
          <p className="text-xl font-bold text-foreground">{performanceMetrics?.externalCategories}</p>
          <p className="text-xs text-muted-foreground">
            {formatPercentage((performanceMetrics?.externalCategories / performanceMetrics?.totalCategories) * 100)} sincronizadas
          </p>
        </div>
      </div>
    </div>
  );
};

export default CategoryMetrics;
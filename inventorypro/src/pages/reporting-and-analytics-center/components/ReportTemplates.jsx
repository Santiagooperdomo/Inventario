import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ReportTemplates = ({ onSelectTemplate, onCreateFromTemplate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const reportTemplates = [
    {
      id: 'abc-analysis',
      name: 'Análisis ABC',
      description: 'Clasificación de productos por valor e importancia estratégica',
      category: 'inventory',
      icon: 'BarChart3',
      complexity: 'intermediate',
      estimatedTime: '5-10 min',
      fields: ['product_name', 'total_value', 'quantity_sold', 'profit_margin'],
      features: ['Clasificación automática A/B/C', 'Gráficos de Pareto', 'Recomendaciones'],
      preview: 'Identifica los productos más valiosos (A), importantes (B) y de menor impacto (C)',
      tags: ['inventario', 'clasificación', 'valor']
    },
    {
      id: 'inventory-turnover',
      name: 'Rotación de Inventario',
      description: 'Análisis de velocidad de rotación por producto y categoría',
      category: 'inventory',
      icon: 'RotateCcw',
      complexity: 'basic',
      estimatedTime: '3-5 min',
      fields: ['product_name', 'turnover_rate', 'days_in_stock', 'stock_quantity'],
      features: ['Cálculo automático de rotación', 'Comparación histórica', 'Alertas de stock lento'],
      preview: 'Mide qué tan rápido se mueven los productos del inventario',
      tags: ['rotación', 'velocidad', 'stock']
    },
    {
      id: 'dead-stock',
      name: 'Identificación de Stock Muerto',
      description: 'Productos sin movimiento en períodos específicos',
      category: 'inventory',
      icon: 'AlertTriangle',
      complexity: 'basic',
      estimatedTime: '2-3 min',
      fields: ['product_name', 'last_sale_date', 'stock_quantity', 'total_value'],
      features: ['Filtros por período', 'Cálculo de costo de oportunidad', 'Sugerencias de liquidación'],
      preview: 'Identifica productos que no han tenido movimiento en X días',
      tags: ['stock muerto', 'liquidación', 'costo']
    },
    {
      id: 'supplier-performance',
      name: 'Rendimiento de Proveedores',
      description: 'Evaluación integral del desempeño de proveedores',
      category: 'supplier',
      icon: 'Truck',
      complexity: 'advanced',
      estimatedTime: '10-15 min',
      fields: ['supplier_name', 'delivery_time', 'quality_score', 'cost_variance'],
      features: ['Métricas de calidad', 'Análisis de puntualidad', 'Comparación de costos'],
      preview: 'Evalúa proveedores por calidad, tiempo de entrega y costo',
      tags: ['proveedores', 'calidad', 'entrega']
    },
    {
      id: 'location-comparison',
      name: 'Comparación de Ubicaciones',
      description: 'Análisis comparativo entre diferentes ubicaciones o almacenes',
      category: 'location',
      icon: 'MapPin',
      complexity: 'intermediate',
      estimatedTime: '7-12 min',
      fields: ['location_name', 'total_inventory', 'turnover_rate', 'profit_margin'],
      features: ['Comparación multi-ubicación', 'Benchmarking', 'Análisis de eficiencia'],
      preview: 'Compara el rendimiento entre diferentes ubicaciones',
      tags: ['ubicaciones', 'comparación', 'eficiencia']
    },
    {
      id: 'forecast-demand',
      name: 'Pronóstico de Demanda',
      description: 'Predicción de demanda futura basada en datos históricos',
      category: 'forecast',
      icon: 'TrendingUp',
      complexity: 'advanced',
      estimatedTime: '15-20 min',
      fields: ['product_name', 'historical_sales', 'seasonal_factor', 'predicted_demand'],
      features: ['Algoritmos de predicción', 'Análisis estacional', 'Intervalos de confianza'],
      preview: 'Predice la demanda futura para optimizar compras',
      tags: ['pronóstico', 'demanda', 'predicción']
    },
    {
      id: 'financial-valuation',
      name: 'Valoración Financiera',
      description: 'Valoración completa del inventario con métodos contables',
      category: 'financial',
      icon: 'DollarSign',
      complexity: 'advanced',
      estimatedTime: '12-18 min',
      fields: ['product_name', 'fifo_value', 'lifo_value', 'weighted_avg_cost'],
      features: ['Múltiples métodos de valoración', 'Comparación FIFO/LIFO', 'Análisis de márgenes'],
      preview: 'Calcula el valor del inventario usando diferentes métodos contables',
      tags: ['valoración', 'financiero', 'contabilidad']
    },
    {
      id: 'seasonal-analysis',
      name: 'Análisis Estacional',
      description: 'Identificación de patrones estacionales en ventas e inventario',
      category: 'forecast',
      icon: 'Calendar',
      complexity: 'intermediate',
      estimatedTime: '8-12 min',
      fields: ['month', 'sales_volume', 'seasonal_index', 'trend_factor'],
      features: ['Detección de patrones', 'Índices estacionales', 'Recomendaciones de stock'],
      preview: 'Identifica patrones estacionales para optimizar inventario',
      tags: ['estacional', 'patrones', 'tendencias']
    }
  ];

  const categories = [
    { value: 'all', label: 'Todas las Categorías', count: reportTemplates?.length },
    { value: 'inventory', label: 'Inventario', count: reportTemplates?.filter(t => t?.category === 'inventory')?.length },
    { value: 'financial', label: 'Financiero', count: reportTemplates?.filter(t => t?.category === 'financial')?.length },
    { value: 'supplier', label: 'Proveedores', count: reportTemplates?.filter(t => t?.category === 'supplier')?.length },
    { value: 'location', label: 'Ubicaciones', count: reportTemplates?.filter(t => t?.category === 'location')?.length },
    { value: 'forecast', label: 'Pronósticos', count: reportTemplates?.filter(t => t?.category === 'forecast')?.length }
  ];

  const complexityColors = {
    basic: 'text-success bg-success/10',
    intermediate: 'text-warning bg-warning/10',
    advanced: 'text-error bg-error/10'
  };

  const complexityLabels = {
    basic: 'Básico',
    intermediate: 'Intermedio',
    advanced: 'Avanzado'
  };

  const filteredTemplates = reportTemplates?.filter(template => {
    const matchesSearch = template?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         template?.description?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         template?.tags?.some(tag => tag?.toLowerCase()?.includes(searchTerm?.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || template?.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-xl font-semibold text-foreground mb-2">Plantillas de Reportes</h3>
        <p className="text-muted-foreground">
          Utiliza plantillas predefinidas para generar reportes rápidamente
        </p>
      </div>
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Buscar plantillas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e?.target?.value)}
            className="w-full"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          {categories?.map(category => (
            <button
              key={category?.value}
              onClick={() => setSelectedCategory(category?.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category?.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80'
              }`}
            >
              {category?.label} ({category?.count})
            </button>
          ))}
        </div>
      </div>
      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates?.map(template => (
          <div
            key={template?.id}
            className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group"
            onClick={() => onSelectTemplate?.(template)}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name={template?.icon} size={24} className="text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {template?.name}
                  </h4>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${complexityColors?.[template?.complexity]}`}>
                    {complexityLabels?.[template?.complexity]}
                  </span>
                </div>
              </div>
              <Icon name="ExternalLink" size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {template?.description}
            </p>

            {/* Preview */}
            <div className="bg-muted/50 rounded-lg p-3 mb-4">
              <p className="text-xs text-muted-foreground mb-1">Vista previa:</p>
              <p className="text-sm text-foreground">{template?.preview}</p>
            </div>

            {/* Features */}
            <div className="mb-4">
              <p className="text-xs font-medium text-muted-foreground mb-2">Características:</p>
              <div className="space-y-1">
                {template?.features?.slice(0, 3)?.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-success rounded-full" />
                    <span className="text-xs text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mb-4">
              {template?.tags?.slice(0, 3)?.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-accent/10 text-accent"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <Icon name="Clock" size={14} />
                <span>{template?.estimatedTime}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="Eye"
                  onClick={(e) => {
                    e?.stopPropagation();
                    onSelectTemplate?.(template);
                  }}
                >
                  Vista Previa
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Plus"
                  onClick={(e) => {
                    e?.stopPropagation();
                    onCreateFromTemplate?.(template);
                  }}
                >
                  Usar
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* No Results */}
      {filteredTemplates?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Search" size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No se encontraron plantillas</h3>
          <p className="text-muted-foreground mb-4">
            Intenta con diferentes términos de búsqueda o categorías
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
            }}
          >
            Limpiar Filtros
          </Button>
        </div>
      )}
    </div>
  );
};

export default ReportTemplates;
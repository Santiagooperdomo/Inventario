import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';


const CustomReportsTab = ({ onSaveReport, onPreviewReport }) => {
  const [reportConfig, setReportConfig] = useState({
    name: '',
    description: '',
    dataSource: 'inventory',
    fields: [],
    filters: [],
    groupBy: '',
    sortBy: '',
    sortOrder: 'asc'
  });

  const [draggedField, setDraggedField] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const dataSources = [
    { value: 'inventory', label: 'Inventario' },
    { value: 'sales', label: 'Ventas' },
    { value: 'purchases', label: 'Compras' },
    { value: 'suppliers', label: 'Proveedores' },
    { value: 'locations', label: 'Ubicaciones' }
  ];

  const availableFields = {
    inventory: [
      { id: 'product_name', label: 'Nombre Producto', type: 'text' },
      { id: 'sku', label: 'SKU', type: 'text' },
      { id: 'category', label: 'Categoría', type: 'text' },
      { id: 'stock_quantity', label: 'Cantidad Stock', type: 'number' },
      { id: 'unit_cost', label: 'Costo Unitario', type: 'currency' },
      { id: 'total_value', label: 'Valor Total', type: 'currency' },
      { id: 'last_updated', label: 'Última Actualización', type: 'date' },
      { id: 'supplier', label: 'Proveedor', type: 'text' },
      { id: 'location', label: 'Ubicación', type: 'text' },
      { id: 'turnover_rate', label: 'Tasa Rotación', type: 'number' }
    ],
    sales: [
      { id: 'sale_date', label: 'Fecha Venta', type: 'date' },
      { id: 'product_name', label: 'Producto', type: 'text' },
      { id: 'quantity_sold', label: 'Cantidad Vendida', type: 'number' },
      { id: 'sale_price', label: 'Precio Venta', type: 'currency' },
      { id: 'total_revenue', label: 'Ingresos Totales', type: 'currency' },
      { id: 'customer', label: 'Cliente', type: 'text' },
      { id: 'sales_rep', label: 'Representante', type: 'text' }
    ]
  };

  const filterOperators = [
    { value: 'equals', label: 'Igual a' },
    { value: 'not_equals', label: 'No igual a' },
    { value: 'greater_than', label: 'Mayor que' },
    { value: 'less_than', label: 'Menor que' },
    { value: 'contains', label: 'Contiene' },
    { value: 'starts_with', label: 'Comienza con' },
    { value: 'between', label: 'Entre' }
  ];

  const previewData = [
    {
      product_name: 'iPhone 14 Pro',
      sku: 'IPH14P-128-BLK',
      category: 'Electrónicos',
      stock_quantity: 45,
      unit_cost: '€899.00',
      total_value: '€40,455.00',
      turnover_rate: 8.5
    },
    {
      product_name: 'Samsung Galaxy S23',
      sku: 'SAM-S23-256-WHT',
      category: 'Electrónicos',
      stock_quantity: 32,
      unit_cost: '€749.00',
      total_value: '€23,968.00',
      turnover_rate: 6.2
    },
    {
      product_name: 'MacBook Air M2',
      sku: 'MBA-M2-512-SLV',
      category: 'Computadoras',
      stock_quantity: 18,
      unit_cost: '€1,299.00',
      total_value: '€23,382.00',
      turnover_rate: 4.1
    }
  ];

  const handleDragStart = (e, field) => {
    setDraggedField(field);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e?.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    if (draggedField && !reportConfig?.fields?.find(f => f?.id === draggedField?.id)) {
      setReportConfig(prev => ({
        ...prev,
        fields: [...prev?.fields, draggedField]
      }));
    }
    setDraggedField(null);
  };

  const removeField = (fieldId) => {
    setReportConfig(prev => ({
      ...prev,
      fields: prev?.fields?.filter(f => f?.id !== fieldId)
    }));
  };

  const addFilter = () => {
    const newFilter = {
      id: Date.now(),
      field: '',
      operator: 'equals',
      value: ''
    };
    setReportConfig(prev => ({
      ...prev,
      filters: [...prev?.filters, newFilter]
    }));
  };

  const updateFilter = (filterId, key, value) => {
    setReportConfig(prev => ({
      ...prev,
      filters: prev?.filters?.map(filter =>
        filter?.id === filterId ? { ...filter, [key]: value } : filter
      )
    }));
  };

  const removeFilter = (filterId) => {
    setReportConfig(prev => ({
      ...prev,
      filters: prev?.filters?.filter(f => f?.id !== filterId)
    }));
  };

  const handlePreview = () => {
    setShowPreview(true);
    onPreviewReport?.(reportConfig);
  };

  const handleSave = () => {
    if (reportConfig?.name && reportConfig?.fields?.length > 0) {
      onSaveReport?.({
        ...reportConfig,
        id: Date.now(),
        createdAt: new Date()?.toISOString(),
        lastModified: new Date()?.toISOString()
      });
      
      // Reset form
      setReportConfig({
        name: '',
        description: '',
        dataSource: 'inventory',
        fields: [],
        filters: [],
        groupBy: '',
        sortBy: '',
        sortOrder: 'asc'
      });
    }
  };

  const currentFields = availableFields?.[reportConfig?.dataSource] || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Constructor de Reportes</h2>
          <p className="text-muted-foreground">Crea reportes personalizados con arrastrar y soltar</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            iconName="Eye"
            iconPosition="left"
            onClick={handlePreview}
            disabled={reportConfig?.fields?.length === 0}
          >
            Vista Previa
          </Button>
          <Button
            variant="default"
            iconName="Save"
            iconPosition="left"
            onClick={handleSave}
            disabled={!reportConfig?.name || reportConfig?.fields?.length === 0}
          >
            Guardar Reporte
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <div className="lg:col-span-1 space-y-6">
          {/* Basic Info */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Información Básica</h3>
            
            <div className="space-y-4">
              <Input
                label="Nombre del Reporte"
                placeholder="Ej: Análisis de Inventario Mensual"
                value={reportConfig?.name}
                onChange={(e) => setReportConfig(prev => ({ ...prev, name: e?.target?.value }))}
                required
              />
              
              <Input
                label="Descripción"
                placeholder="Descripción opcional del reporte"
                value={reportConfig?.description}
                onChange={(e) => setReportConfig(prev => ({ ...prev, description: e?.target?.value }))}
              />
              
              <Select
                label="Fuente de Datos"
                options={dataSources}
                value={reportConfig?.dataSource}
                onChange={(value) => setReportConfig(prev => ({ 
                  ...prev, 
                  dataSource: value,
                  fields: [] // Reset fields when changing data source
                }))}
              />
            </div>
          </div>

          {/* Available Fields */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Campos Disponibles</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Arrastra los campos al área de construcción
            </p>
            
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {currentFields?.map((field) => (
                <div
                  key={field?.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, field)}
                  className="flex items-center space-x-3 p-3 bg-muted rounded-lg cursor-move hover:bg-muted/80 transition-colors"
                >
                  <Icon name="GripVertical" size={16} className="text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{field?.label}</p>
                    <p className="text-xs text-muted-foreground capitalize">{field?.type}</p>
                  </div>
                  <Icon 
                    name={
                      field?.type === 'text' ? 'Type' :
                      field?.type === 'number' ? 'Hash' :
                      field?.type === 'currency' ? 'DollarSign' :
                      field?.type === 'date' ? 'Calendar' : 'FileText'
                    } 
                    size={16} 
                    className="text-muted-foreground" 
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Report Builder */}
        <div className="lg:col-span-2 space-y-6">
          {/* Selected Fields */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Campos Seleccionados</h3>
            
            <div
              className="min-h-32 border-2 border-dashed border-border rounded-lg p-4"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {reportConfig?.fields?.length === 0 ? (
                <div className="text-center text-muted-foreground">
                  <Icon name="MousePointer" size={32} className="mx-auto mb-2" />
                  <p>Arrastra campos aquí para construir tu reporte</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {reportConfig?.fields?.map((field, index) => (
                    <div
                      key={field?.id}
                      className="flex items-center justify-between p-3 bg-primary/5 border border-primary/20 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                          {index + 1}
                        </span>
                        <div>
                          <p className="text-sm font-medium text-foreground">{field?.label}</p>
                          <p className="text-xs text-muted-foreground capitalize">{field?.type}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeField(field?.id)}
                        className="text-error hover:text-error hover:bg-error/10"
                      >
                        <Icon name="X" size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Filtros</h3>
              <Button
                variant="outline"
                size="sm"
                iconName="Plus"
                iconPosition="left"
                onClick={addFilter}
              >
                Agregar Filtro
              </Button>
            </div>

            {reportConfig?.filters?.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No hay filtros configurados
              </p>
            ) : (
              <div className="space-y-4">
                {reportConfig?.filters?.map((filter) => (
                  <div key={filter?.id} className="flex items-center space-x-3 p-4 bg-muted rounded-lg">
                    <Select
                      placeholder="Campo"
                      options={currentFields?.map(f => ({ value: f?.id, label: f?.label }))}
                      value={filter?.field}
                      onChange={(value) => updateFilter(filter?.id, 'field', value)}
                      className="flex-1"
                    />
                    
                    <Select
                      placeholder="Operador"
                      options={filterOperators}
                      value={filter?.operator}
                      onChange={(value) => updateFilter(filter?.id, 'operator', value)}
                      className="flex-1"
                    />
                    
                    <Input
                      placeholder="Valor"
                      value={filter?.value}
                      onChange={(e) => updateFilter(filter?.id, 'value', e?.target?.value)}
                      className="flex-1"
                    />
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFilter(filter?.id)}
                      className="text-error hover:text-error hover:bg-error/10"
                    >
                      <Icon name="Trash2" size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sorting & Grouping */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Agrupación</h3>
              <Select
                placeholder="Agrupar por campo"
                options={reportConfig?.fields?.map(f => ({ value: f?.id, label: f?.label }))}
                value={reportConfig?.groupBy}
                onChange={(value) => setReportConfig(prev => ({ ...prev, groupBy: value }))}
              />
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Ordenamiento</h3>
              <div className="space-y-3">
                <Select
                  placeholder="Ordenar por campo"
                  options={reportConfig?.fields?.map(f => ({ value: f?.id, label: f?.label }))}
                  value={reportConfig?.sortBy}
                  onChange={(value) => setReportConfig(prev => ({ ...prev, sortBy: value }))}
                />
                <Select
                  options={[
                    { value: 'asc', label: 'Ascendente' },
                    { value: 'desc', label: 'Descendente' }
                  ]}
                  value={reportConfig?.sortOrder}
                  onChange={(value) => setReportConfig(prev => ({ ...prev, sortOrder: value }))}
                />
              </div>
            </div>
          </div>

          {/* Preview */}
          {showPreview && reportConfig?.fields?.length > 0 && (
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Vista Previa</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPreview(false)}
                >
                  <Icon name="X" size={16} />
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      {reportConfig?.fields?.map((field) => (
                        <th key={field?.id} className="text-left py-3 px-4 font-medium text-muted-foreground">
                          {field?.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewData?.map((row, index) => (
                      <tr key={index} className="border-b border-border">
                        {reportConfig?.fields?.map((field) => (
                          <td key={field?.id} className="py-3 px-4 text-foreground">
                            {row?.[field?.id] || '-'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 text-sm text-muted-foreground">
                Mostrando 3 de 1,247 registros (vista previa)
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomReportsTab;
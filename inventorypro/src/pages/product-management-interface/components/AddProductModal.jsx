import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const AddProductModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    category: '',
    brand: '',
    cost: '',
    price: '',
    stock: '',
    minStock: '',
    supplier: '',
    barcode: '',
    weight: '',
    dimensions: '',
    status: 'active'
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});

  const categoryOptions = [
    { value: 'electronics', label: 'Electrónicos' },
    { value: 'clothing', label: 'Ropa' },
    { value: 'home', label: 'Hogar' },
    { value: 'sports', label: 'Deportes' },
    { value: 'books', label: 'Libros' }
  ];

  const supplierOptions = [
    { value: 'techsupply', label: 'TechSupply S.A.' },
    { value: 'globalparts', label: 'Global Parts Ltd.' },
    { value: 'quickship', label: 'QuickShip Express' },
    { value: 'reliablegoods', label: 'Reliable Goods Co.' }
  ];

  const statusOptions = [
    { value: 'active', label: 'Activo' },
    { value: 'inactive', label: 'Inactivo' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const generateSKU = () => {
    const prefix = formData?.category ? formData?.category?.substring(0, 3)?.toUpperCase() : 'PRD';
    const timestamp = Date.now()?.toString()?.slice(-6);
    const sku = `${prefix}-${timestamp}`;
    handleInputChange('sku', sku);
  };

  const generateBarcode = () => {
    const barcode = Math.floor(Math.random() * 9000000000000) + 1000000000000;
    handleInputChange('barcode', barcode?.toString());
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData?.name?.trim()) newErrors.name = 'El nombre es requerido';
      if (!formData?.sku?.trim()) newErrors.sku = 'El SKU es requerido';
      if (!formData?.category) newErrors.category = 'La categoría es requerida';
    }

    if (step === 2) {
      if (!formData?.cost || parseFloat(formData?.cost) <= 0) {
        newErrors.cost = 'El costo debe ser mayor a 0';
      }
      if (!formData?.price || parseFloat(formData?.price) <= 0) {
        newErrors.price = 'El precio debe ser mayor a 0';
      }
      if (parseFloat(formData?.price) <= parseFloat(formData?.cost)) {
        newErrors.price = 'El precio debe ser mayor al costo';
      }
    }

    if (step === 3) {
      if (!formData?.stock || parseInt(formData?.stock) < 0) {
        newErrors.stock = 'El stock inicial es requerido';
      }
      if (!formData?.supplier) newErrors.supplier = 'El proveedor es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSave = () => {
    if (validateStep(3)) {
      onSave(formData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      sku: '',
      description: '',
      category: '',
      brand: '',
      cost: '',
      price: '',
      stock: '',
      minStock: '',
      supplier: '',
      barcode: '',
      weight: '',
      dimensions: '',
      status: 'active'
    });
    setCurrentStep(1);
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  const steps = [
    { id: 1, title: 'Información Básica', icon: 'Info' },
    { id: 2, title: 'Precios', icon: 'DollarSign' },
    { id: 3, title: 'Inventario', icon: 'Package' }
  ];

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Agregar Nuevo Producto</h2>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <Icon name="X" size={20} />
            </Button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center space-x-4 mt-6">
            {steps?.map((step, index) => (
              <div key={step?.id} className="flex items-center">
                <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
                  currentStep === step?.id
                    ? 'bg-primary text-primary-foreground'
                    : currentStep > step?.id
                    ? 'bg-success text-success-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  <Icon name={step?.icon} size={16} />
                  <span className="text-sm font-medium">{step?.title}</span>
                </div>
                {index < steps?.length - 1 && (
                  <Icon name="ChevronRight" size={16} className="mx-2 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-96">
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Nombre del Producto"
                  type="text"
                  value={formData?.name}
                  onChange={(e) => handleInputChange('name', e?.target?.value)}
                  error={errors?.name}
                  required
                  placeholder="Ej: Laptop Dell Inspiron 15"
                />
                <div className="space-y-2">
                  <Input
                    label="SKU"
                    type="text"
                    value={formData?.sku}
                    onChange={(e) => handleInputChange('sku', e?.target?.value)}
                    error={errors?.sku}
                    required
                    placeholder="Ej: ELE-123456"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="RefreshCw"
                    iconPosition="left"
                    onClick={generateSKU}
                  >
                    Generar SKU
                  </Button>
                </div>
              </div>

              <Input
                label="Descripción"
                type="text"
                value={formData?.description}
                onChange={(e) => handleInputChange('description', e?.target?.value)}
                placeholder="Descripción detallada del producto"
              />

              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Categoría"
                  options={categoryOptions}
                  value={formData?.category}
                  onChange={(value) => handleInputChange('category', value)}
                  error={errors?.category}
                  required
                  placeholder="Seleccionar categoría"
                />
                <Input
                  label="Marca"
                  type="text"
                  value={formData?.brand}
                  onChange={(e) => handleInputChange('brand', e?.target?.value)}
                  placeholder="Ej: Dell, Samsung, Nike"
                />
              </div>

              <div className="space-y-2">
                <Input
                  label="Código de Barras"
                  type="text"
                  value={formData?.barcode}
                  onChange={(e) => handleInputChange('barcode', e?.target?.value)}
                  placeholder="Código de barras del producto"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="Hash"
                  iconPosition="left"
                  onClick={generateBarcode}
                >
                  Generar Código
                </Button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Costo"
                  type="number"
                  step="0.01"
                  value={formData?.cost}
                  onChange={(e) => handleInputChange('cost', e?.target?.value)}
                  error={errors?.cost}
                  required
                  placeholder="0.00"
                />
                <Input
                  label="Precio de Venta"
                  type="number"
                  step="0.01"
                  value={formData?.price}
                  onChange={(e) => handleInputChange('price', e?.target?.value)}
                  error={errors?.price}
                  required
                  placeholder="0.00"
                />
              </div>

              {formData?.cost && formData?.price && (
                <div className="bg-muted rounded-lg p-4">
                  <h4 className="text-sm font-medium text-foreground mb-2">Análisis de Margen</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Costo:</span>
                      <p className="font-medium text-foreground">${parseFloat(formData?.cost)?.toFixed(2)}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Precio:</span>
                      <p className="font-medium text-foreground">${parseFloat(formData?.price)?.toFixed(2)}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Margen:</span>
                      <p className={`font-medium ${
                        parseFloat(formData?.price) > parseFloat(formData?.cost) ? 'text-success' : 'text-error'
                      }`}>
                        {parseFloat(formData?.cost) > 0 
                          ? (((parseFloat(formData?.price) - parseFloat(formData?.cost)) / parseFloat(formData?.cost)) * 100)?.toFixed(1) + '%' :'0%'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Peso (kg)"
                  type="number"
                  step="0.01"
                  value={formData?.weight}
                  onChange={(e) => handleInputChange('weight', e?.target?.value)}
                  placeholder="0.00"
                />
                <Input
                  label="Dimensiones (cm)"
                  type="text"
                  value={formData?.dimensions}
                  onChange={(e) => handleInputChange('dimensions', e?.target?.value)}
                  placeholder="L x A x H"
                />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Stock Inicial"
                  type="number"
                  value={formData?.stock}
                  onChange={(e) => handleInputChange('stock', e?.target?.value)}
                  error={errors?.stock}
                  required
                  placeholder="0"
                />
                <Input
                  label="Stock Mínimo"
                  type="number"
                  value={formData?.minStock}
                  onChange={(e) => handleInputChange('minStock', e?.target?.value)}
                  placeholder="10"
                  description="Nivel para alertas de stock bajo"
                />
              </div>

              <Select
                label="Proveedor Principal"
                options={supplierOptions}
                value={formData?.supplier}
                onChange={(value) => handleInputChange('supplier', value)}
                error={errors?.supplier}
                required
                placeholder="Seleccionar proveedor"
              />

              <Select
                label="Estado"
                options={statusOptions}
                value={formData?.status}
                onChange={(value) => handleInputChange('status', value)}
                placeholder="Seleccionar estado"
              />

              {/* Summary */}
              <div className="bg-muted rounded-lg p-4">
                <h4 className="text-sm font-medium text-foreground mb-3">Resumen del Producto</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Nombre:</span>
                    <span className="text-foreground font-medium">{formData?.name || 'Sin nombre'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">SKU:</span>
                    <span className="text-foreground font-mono">{formData?.sku || 'Sin SKU'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Categoría:</span>
                    <span className="text-foreground">
                      {categoryOptions?.find(c => c?.value === formData?.category)?.label || 'Sin categoría'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Precio:</span>
                    <span className="text-foreground font-medium">
                      ${formData?.price ? parseFloat(formData?.price)?.toFixed(2) : '0.00'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Stock Inicial:</span>
                    <span className="text-foreground">{formData?.stock || '0'} unidades</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Paso {currentStep} de {steps?.length}
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={handleClose}
              >
                Cancelar
              </Button>
              {currentStep > 1 && (
                <Button
                  variant="outline"
                  iconName="ChevronLeft"
                  iconPosition="left"
                  onClick={handlePrevious}
                >
                  Anterior
                </Button>
              )}
              {currentStep < steps?.length ? (
                <Button
                  variant="default"
                  iconName="ChevronRight"
                  iconPosition="right"
                  onClick={handleNext}
                >
                  Siguiente
                </Button>
              ) : (
                <Button
                  variant="default"
                  iconName="Check"
                  iconPosition="left"
                  onClick={handleSave}
                >
                  Guardar Producto
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;
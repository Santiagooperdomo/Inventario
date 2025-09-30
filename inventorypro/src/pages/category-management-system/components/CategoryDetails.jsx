import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const CategoryDetails = ({ 
  category, 
  onSave, 
  onDelete, 
  onCancel,
  isEditing,
  onToggleEdit,
  parentCategories = []
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parentId: '',
    status: 'active',
    attributes: [],
    rules: [],
    sortOrder: 0,
    isVisible: true,
    allowProducts: true,
    metaTitle: '',
    metaDescription: '',
    slug: ''
  });

  const [errors, setErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (category) {
      setFormData({
        name: category?.name || '',
        description: category?.description || '',
        parentId: category?.parentId || '',
        status: category?.status || 'active',
        attributes: category?.attributes || [],
        rules: category?.rules || [],
        sortOrder: category?.sortOrder || 0,
        isVisible: category?.isVisible !== false,
        allowProducts: category?.allowProducts !== false,
        metaTitle: category?.metaTitle || '',
        metaDescription: category?.metaDescription || '',
        slug: category?.slug || ''
      });
      setIsDirty(false);
      setErrors({});
    }
  }, [category]);

  const statusOptions = [
    { value: 'active', label: 'Activa' },
    { value: 'inactive', label: 'Inactiva' },
    { value: 'pending', label: 'Pendiente' },
    { value: 'archived', label: 'Archivada' }
  ];

  const attributeTypes = [
    { value: 'text', label: 'Texto' },
    { value: 'number', label: 'Número' },
    { value: 'boolean', label: 'Sí/No' },
    { value: 'select', label: 'Lista desplegable' },
    { value: 'multiselect', label: 'Selección múltiple' },
    { value: 'date', label: 'Fecha' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setIsDirty(true);
    
    // Clear error for this field
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const generateSlug = (name) => {
    return name?.toLowerCase()?.replace(/[áàäâ]/g, 'a')?.replace(/[éèëê]/g, 'e')?.replace(/[íìïî]/g, 'i')?.replace(/[óòöô]/g, 'o')?.replace(/[úùüû]/g, 'u')?.replace(/ñ/g, 'n')?.replace(/[^a-z0-9]/g, '-')?.replace(/-+/g, '-')?.replace(/^-|-$/g, '');
  };

  const handleNameChange = (value) => {
    handleInputChange('name', value);
    if (!formData?.slug || formData?.slug === generateSlug(formData?.name)) {
      handleInputChange('slug', generateSlug(value));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.name?.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }

    if (formData?.name?.length > 100) {
      newErrors.name = 'El nombre no puede exceder 100 caracteres';
    }

    if (formData?.description?.length > 500) {
      newErrors.description = 'La descripción no puede exceder 500 caracteres';
    }

    if (!formData?.slug?.trim()) {
      newErrors.slug = 'El slug es obligatorio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave({
        ...category,
        ...formData,
        updatedAt: new Date()?.toISOString()
      });
      setIsDirty(false);
    }
  };

  const handleAddAttribute = () => {
    const newAttribute = {
      id: Date.now()?.toString(),
      name: '',
      type: 'text',
      required: false,
      options: []
    };
    
    setFormData(prev => ({
      ...prev,
      attributes: [...prev?.attributes, newAttribute]
    }));
    setIsDirty(true);
  };

  const handleUpdateAttribute = (index, field, value) => {
    const updatedAttributes = [...formData?.attributes];
    updatedAttributes[index] = {
      ...updatedAttributes?.[index],
      [field]: value
    };
    
    setFormData(prev => ({
      ...prev,
      attributes: updatedAttributes
    }));
    setIsDirty(true);
  };

  const handleRemoveAttribute = (index) => {
    const updatedAttributes = formData?.attributes?.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      attributes: updatedAttributes
    }));
    setIsDirty(true);
  };

  if (!category) {
    return (
      <div className="h-full flex items-center justify-center bg-muted/30">
        <div className="text-center p-8">
          <Icon name="FolderOpen" size={64} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Selecciona una categoría
          </h3>
          <p className="text-muted-foreground">
            Elige una categoría del árbol para ver y editar sus detalles
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <Icon name="Tag" size={24} className="text-primary" />
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              {category?.name}
            </h2>
            <p className="text-sm text-muted-foreground">
              ID: {category?.id} • {category?.productCount || 0} productos
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {!isEditing ? (
            <>
              <Button
                variant="outline"
                iconName="Edit"
                onClick={onToggleEdit}
              >
                Editar
              </Button>
              <Button
                variant="destructive"
                iconName="Trash2"
                onClick={() => onDelete(category)}
              >
                Eliminar
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={onCancel}
                disabled={!isDirty}
              >
                Cancelar
              </Button>
              <Button
                variant="default"
                iconName="Save"
                onClick={handleSave}
                disabled={!isDirty}
              >
                Guardar
              </Button>
            </>
          )}
        </div>
      </div>
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-foreground">Información básica</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nombre de la categoría"
              type="text"
              value={formData?.name}
              onChange={(e) => handleNameChange(e?.target?.value)}
              error={errors?.name}
              disabled={!isEditing}
              required
              placeholder="Ej: Electrónicos"
            />
            
            <Select
              label="Categoría padre"
              options={[
                { value: '', label: 'Sin categoría padre' },
                ...parentCategories?.map(cat => ({
                  value: cat?.id,
                  label: cat?.name
                }))
              ]}
              value={formData?.parentId}
              onChange={(value) => handleInputChange('parentId', value)}
              disabled={!isEditing}
              placeholder="Seleccionar categoría padre"
            />
          </div>

          <Input
            label="Descripción"
            type="text"
            value={formData?.description}
            onChange={(e) => handleInputChange('description', e?.target?.value)}
            error={errors?.description}
            disabled={!isEditing}
            placeholder="Descripción de la categoría"
            description="Máximo 500 caracteres"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Estado"
              options={statusOptions}
              value={formData?.status}
              onChange={(value) => handleInputChange('status', value)}
              disabled={!isEditing}
            />
            
            <Input
              label="Orden de clasificación"
              type="number"
              value={formData?.sortOrder}
              onChange={(e) => handleInputChange('sortOrder', parseInt(e?.target?.value) || 0)}
              disabled={!isEditing}
              min="0"
            />
            
            <Input
              label="Slug URL"
              type="text"
              value={formData?.slug}
              onChange={(e) => handleInputChange('slug', e?.target?.value)}
              error={errors?.slug}
              disabled={!isEditing}
              placeholder="categoria-url"
            />
          </div>
        </div>

        {/* Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-foreground">Configuración</h3>
          
          <div className="space-y-3">
            <Checkbox
              label="Visible en el catálogo"
              description="La categoría aparecerá en el sitio web"
              checked={formData?.isVisible}
              onChange={(e) => handleInputChange('isVisible', e?.target?.checked)}
              disabled={!isEditing}
            />
            
            <Checkbox
              label="Permitir productos directos"
              description="Los productos pueden asignarse directamente a esta categoría"
              checked={formData?.allowProducts}
              onChange={(e) => handleInputChange('allowProducts', e?.target?.checked)}
              disabled={!isEditing}
            />
          </div>
        </div>

        {/* Attributes */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-foreground">Atributos personalizados</h3>
            {isEditing && (
              <Button
                variant="outline"
                size="sm"
                iconName="Plus"
                onClick={handleAddAttribute}
              >
                Agregar atributo
              </Button>
            )}
          </div>

          {formData?.attributes?.length > 0 ? (
            <div className="space-y-3">
              {formData?.attributes?.map((attribute, index) => (
                <div key={attribute?.id} className="p-4 border border-border rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                    <Input
                      label="Nombre del atributo"
                      type="text"
                      value={attribute?.name}
                      onChange={(e) => handleUpdateAttribute(index, 'name', e?.target?.value)}
                      disabled={!isEditing}
                      placeholder="Ej: Color, Tamaño"
                    />
                    
                    <Select
                      label="Tipo de dato"
                      options={attributeTypes}
                      value={attribute?.type}
                      onChange={(value) => handleUpdateAttribute(index, 'type', value)}
                      disabled={!isEditing}
                    />
                    
                    <div className="flex items-end space-x-2">
                      <Checkbox
                        label="Obligatorio"
                        checked={attribute?.required}
                        onChange={(e) => handleUpdateAttribute(index, 'required', e?.target?.checked)}
                        disabled={!isEditing}
                      />
                      {isEditing && (
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleRemoveAttribute(index)}
                        >
                          <Icon name="Trash2" size={16} />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Icon name="Settings" size={32} className="mx-auto mb-2" />
              <p>No hay atributos personalizados definidos</p>
            </div>
          )}
        </div>

        {/* SEO */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-foreground">SEO y metadatos</h3>
          
          <div className="space-y-4">
            <Input
              label="Título meta"
              type="text"
              value={formData?.metaTitle}
              onChange={(e) => handleInputChange('metaTitle', e?.target?.value)}
              disabled={!isEditing}
              placeholder="Título para motores de búsqueda"
              description="Máximo 60 caracteres recomendados"
            />
            
            <Input
              label="Descripción meta"
              type="text"
              value={formData?.metaDescription}
              onChange={(e) => handleInputChange('metaDescription', e?.target?.value)}
              disabled={!isEditing}
              placeholder="Descripción para motores de búsqueda"
              description="Máximo 160 caracteres recomendados"
            />
          </div>
        </div>

        {/* Statistics */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-foreground">Estadísticas</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="Package" size={16} className="text-primary" />
                <span className="text-sm font-medium text-foreground">Productos</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{category?.productCount || 0}</p>
            </div>
            
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="DollarSign" size={16} className="text-success" />
                <span className="text-sm font-medium text-foreground">Valor inventario</span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                ${(category?.inventoryValue || 0)?.toLocaleString()}
              </p>
            </div>
            
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="TrendingUp" size={16} className="text-accent" />
                <span className="text-sm font-medium text-foreground">Rotación</span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {(category?.turnoverRate || 0)?.toFixed(1)}x
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryDetails;
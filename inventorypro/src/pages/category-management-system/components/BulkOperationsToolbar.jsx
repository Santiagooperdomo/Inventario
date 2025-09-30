import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const BulkOperationsToolbar = ({ 
  selectedCategories = [], 
  onClearSelection,
  onBulkMerge,
  onBulkDelete,
  onBulkStatusChange,
  onBulkAttributeApply,
  onBulkProductReassign
}) => {
  const [showActions, setShowActions] = useState(false);
  const [mergeTarget, setMergeTarget] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [reassignTarget, setReassignTarget] = useState('');

  const statusOptions = [
    { value: 'active', label: 'Activa' },
    { value: 'inactive', label: 'Inactiva' },
    { value: 'pending', label: 'Pendiente' },
    { value: 'archived', label: 'Archivada' }
  ];

  const bulkActions = [
    {
      id: 'merge',
      label: 'Fusionar categorías',
      icon: 'Merge',
      description: 'Combinar categorías seleccionadas en una sola',
      requiresTarget: true,
      dangerous: true
    },
    {
      id: 'status',
      label: 'Cambiar estado',
      icon: 'ToggleLeft',
      description: 'Actualizar el estado de las categorías seleccionadas'
    },
    {
      id: 'reassign',
      label: 'Reasignar productos',
      icon: 'Move',
      description: 'Mover productos a otra categoría',
      requiresTarget: true
    },
    {
      id: 'attributes',
      label: 'Aplicar atributos',
      icon: 'Settings',
      description: 'Aplicar atributos a todas las categorías'
    },
    {
      id: 'delete',
      label: 'Eliminar categorías',
      icon: 'Trash2',
      description: 'Eliminar permanentemente las categorías seleccionadas',
      dangerous: true
    }
  ];

  const handleBulkAction = (actionId) => {
    switch (actionId) {
      case 'merge':
        if (mergeTarget && selectedCategories?.length > 1) {
          onBulkMerge(selectedCategories, mergeTarget);
        }
        break;
      case 'status':
        if (newStatus) {
          onBulkStatusChange(selectedCategories, newStatus);
        }
        break;
      case 'reassign':
        if (reassignTarget) {
          onBulkProductReassign(selectedCategories, reassignTarget);
        }
        break;
      case 'attributes':
        onBulkAttributeApply(selectedCategories);
        break;
      case 'delete':
        onBulkDelete(selectedCategories);
        break;
    }
    setShowActions(false);
  };

  if (selectedCategories?.length === 0) {
    return null;
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-primary-foreground">
                {selectedCategories?.length}
              </span>
            </div>
            <div>
              <p className="font-medium text-foreground">
                {selectedCategories?.length} categoría{selectedCategories?.length !== 1 ? 's' : ''} seleccionada{selectedCategories?.length !== 1 ? 's' : ''}
              </p>
              <p className="text-sm text-muted-foreground">
                Operaciones masivas disponibles
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowActions(!showActions)}
            iconName={showActions ? 'ChevronUp' : 'ChevronDown'}
            iconPosition="right"
          >
            Acciones masivas
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            iconName="X"
          >
            Limpiar selección
          </Button>
        </div>
      </div>
      {showActions && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bulkActions?.map((action) => (
              <div
                key={action?.id}
                className={`p-4 border rounded-lg transition-micro hover:shadow-sm ${
                  action?.dangerous ? 'border-error/20 bg-error/5' : 'border-border bg-muted/30'
                }`}
              >
                <div className="flex items-start space-x-3 mb-3">
                  <Icon 
                    name={action?.icon} 
                    size={20} 
                    className={action?.dangerous ? 'text-error' : 'text-primary'}
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground mb-1">
                      {action?.label}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {action?.description}
                    </p>
                  </div>
                </div>

                {/* Action-specific controls */}
                {action?.id === 'merge' && (
                  <div className="space-y-2">
                    <Select
                      label="Categoría destino"
                      options={[
                        { value: '', label: 'Seleccionar categoría destino' },
                        { value: 'electronics', label: 'Electrónicos' },
                        { value: 'clothing', label: 'Ropa' },
                        { value: 'home', label: 'Hogar' }
                      ]}
                      value={mergeTarget}
                      onChange={setMergeTarget}
                      className="mb-2"
                    />
                    <Button
                      variant={action?.dangerous ? 'destructive' : 'default'}
                      size="sm"
                      fullWidth
                      onClick={() => handleBulkAction(action?.id)}
                      disabled={!mergeTarget || selectedCategories?.length < 2}
                    >
                      Fusionar categorías
                    </Button>
                  </div>
                )}

                {action?.id === 'status' && (
                  <div className="space-y-2">
                    <Select
                      label="Nuevo estado"
                      options={statusOptions}
                      value={newStatus}
                      onChange={setNewStatus}
                      className="mb-2"
                    />
                    <Button
                      variant="default"
                      size="sm"
                      fullWidth
                      onClick={() => handleBulkAction(action?.id)}
                      disabled={!newStatus}
                    >
                      Cambiar estado
                    </Button>
                  </div>
                )}

                {action?.id === 'reassign' && (
                  <div className="space-y-2">
                    <Select
                      label="Categoría destino"
                      options={[
                        { value: '', label: 'Seleccionar categoría destino' },
                        { value: 'electronics', label: 'Electrónicos' },
                        { value: 'clothing', label: 'Ropa' },
                        { value: 'home', label: 'Hogar' }
                      ]}
                      value={reassignTarget}
                      onChange={setReassignTarget}
                      className="mb-2"
                    />
                    <Button
                      variant="default"
                      size="sm"
                      fullWidth
                      onClick={() => handleBulkAction(action?.id)}
                      disabled={!reassignTarget}
                    >
                      Reasignar productos
                    </Button>
                  </div>
                )}

                {(action?.id === 'attributes' || action?.id === 'delete') && (
                  <Button
                    variant={action?.dangerous ? 'destructive' : 'default'}
                    size="sm"
                    fullWidth
                    onClick={() => handleBulkAction(action?.id)}
                  >
                    {action?.label}
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Acciones rápidas:</span>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  iconName="ToggleLeft"
                  onClick={() => onBulkStatusChange(selectedCategories, 'active')}
                >
                  Activar todas
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="ToggleRight"
                  onClick={() => onBulkStatusChange(selectedCategories, 'inactive')}
                >
                  Desactivar todas
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Archive"
                  onClick={() => onBulkStatusChange(selectedCategories, 'archived')}
                >
                  Archivar todas
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkOperationsToolbar;
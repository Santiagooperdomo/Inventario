import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActions = () => {
  const actions = [
    {
      id: 'stock-adjustment',
      title: 'Ajuste de Stock',
      description: 'Modificar niveles de inventario',
      icon: 'Package',
      color: 'primary',
      shortcut: 'Ctrl+A'
    },
    {
      id: 'transfer',
      title: 'Transferencia',
      description: 'Mover productos entre ubicaciones',
      icon: 'ArrowRightLeft',
      color: 'success',
      shortcut: 'Ctrl+T'
    },
    {
      id: 'reorder',
      title: 'Generar Orden',
      description: 'Crear orden de reposición',
      icon: 'ShoppingCart',
      color: 'warning',
      shortcut: 'Ctrl+R'
    },
    {
      id: 'receive',
      title: 'Recibir Mercancía',
      description: 'Registrar productos recibidos',
      icon: 'Truck',
      color: 'success',
      shortcut: 'Ctrl+M'
    },
    {
      id: 'audit',
      title: 'Auditoría',
      description: 'Iniciar conteo de inventario',
      icon: 'ClipboardCheck',
      color: 'secondary',
      shortcut: 'Ctrl+U'
    },
    {
      id: 'report',
      title: 'Generar Reporte',
      description: 'Crear reporte personalizado',
      icon: 'FileText',
      color: 'primary',
      shortcut: 'Ctrl+G'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      primary: 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20',
      success: 'bg-success/10 text-success border-success/20 hover:bg-success/20',
      warning: 'bg-warning/10 text-warning border-warning/20 hover:bg-warning/20',
      secondary: 'bg-secondary/10 text-secondary border-secondary/20 hover:bg-secondary/20'
    };
    return colors?.[color] || colors?.primary;
  };

  const handleAction = (actionId) => {
    console.log(`Executing action: ${actionId}`);
    // Here you would implement the actual action logic
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Acciones Rápidas</h3>
        <Button variant="ghost" size="sm">
          <Icon name="Settings" size={16} className="mr-2" />
          Personalizar
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {actions?.map((action) => (
          <button
            key={action?.id}
            onClick={() => handleAction(action?.id)}
            className={`p-4 rounded-lg border transition-standard text-left group ${getColorClasses(action?.color)}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getColorClasses(action?.color)?.replace('hover:bg-', 'bg-')?.split(' ')?.[0]}`}>
                <Icon name={action?.icon} size={20} />
              </div>
              <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-micro">
                {action?.shortcut}
              </div>
            </div>
            
            <h4 className="font-medium text-foreground mb-1">{action?.title}</h4>
            <p className="text-sm text-muted-foreground">{action?.description}</p>
          </button>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Atajos de teclado disponibles</span>
          <Button variant="ghost" size="sm">
            <Icon name="Keyboard" size={14} className="mr-2" />
            Ver todos
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
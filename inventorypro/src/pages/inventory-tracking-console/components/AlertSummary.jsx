import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AlertSummary = ({ alertsSummary, onViewAllAlerts, onQuickAction }) => {
  const alertTypes = [
    {
      key: 'critical',
      label: 'Críticas',
      icon: 'AlertCircle',
      color: 'text-error bg-error/10 border-error/20',
      count: alertsSummary?.critical || 0
    },
    {
      key: 'lowStock',
      label: 'Stock Bajo',
      icon: 'Package',
      color: 'text-warning bg-warning/10 border-warning/20',
      count: alertsSummary?.lowStock || 0
    },
    {
      key: 'outOfStock',
      label: 'Sin Stock',
      icon: 'PackageX',
      color: 'text-error bg-error/10 border-error/20',
      count: alertsSummary?.outOfStock || 0
    },
    {
      key: 'discrepancies',
      label: 'Discrepancias',
      icon: 'AlertTriangle',
      color: 'text-warning bg-warning/10 border-warning/20',
      count: alertsSummary?.discrepancies || 0
    }
  ];

  const totalAlerts = alertTypes?.reduce((sum, type) => sum + type?.count, 0);

  const recentAlerts = alertsSummary?.recent || [];

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Resumen de Alertas</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onViewAllAlerts}
          iconName="ExternalLink"
        >
          Ver Todas
        </Button>
      </div>
      {/* Alert Type Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {alertTypes?.map((type) => (
          <div
            key={type?.key}
            className={`border rounded-lg p-3 transition-micro hover:shadow-sm cursor-pointer ${type?.color}`}
            onClick={() => onQuickAction('filter', type?.key)}
          >
            <div className="flex items-center space-x-2 mb-1">
              <Icon name={type?.icon} size={16} />
              <span className="text-xs font-medium">{type?.label}</span>
            </div>
            <div className="text-xl font-bold">{type?.count}</div>
          </div>
        ))}
      </div>
      {/* Total Alerts */}
      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
            <Icon name="Bell" size={16} className="text-primary" />
          </div>
          <div>
            <div className="font-medium text-foreground">Total de Alertas Activas</div>
            <div className="text-sm text-muted-foreground">Requieren atención inmediata</div>
          </div>
        </div>
        <div className="text-2xl font-bold text-foreground">{totalAlerts}</div>
      </div>
      {/* Recent Alerts */}
      {recentAlerts?.length > 0 && (
        <div>
          <h4 className="font-medium text-foreground mb-3 text-sm">Alertas Recientes</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {recentAlerts?.slice(0, 5)?.map((alert) => (
              <div
                key={alert?.id}
                className="flex items-start space-x-3 p-2 bg-muted/20 rounded-lg hover:bg-muted/40 transition-micro cursor-pointer"
                onClick={() => onQuickAction('view', alert?.id)}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                  alert?.severity === 'critical' ? 'bg-error/10 text-error' :
                  alert?.severity === 'high'? 'bg-warning/10 text-warning' : 'bg-accent/10 text-accent'
                }`}>
                  <Icon 
                    name={alert?.severity === 'critical' ? 'AlertCircle' : 'AlertTriangle'} 
                    size={12} 
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">
                    {alert?.title}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {alert?.description}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {alert?.timeAgo}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-6 h-6 flex-shrink-0"
                  onClick={(e) => {
                    e?.stopPropagation();
                    onQuickAction('acknowledge', alert?.id);
                  }}
                >
                  <Icon name="Check" size={12} />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* No Alerts State */}
      {totalAlerts === 0 && (
        <div className="text-center py-6">
          <Icon name="CheckCircle" size={32} className="mx-auto text-success mb-2" />
          <div className="font-medium text-foreground mb-1">¡Todo en orden!</div>
          <div className="text-sm text-muted-foreground">No hay alertas activas en este momento</div>
        </div>
      )}
      {/* Quick Actions */}
      {totalAlerts > 0 && (
        <div className="flex gap-2 mt-4 pt-4 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onQuickAction('acknowledgeAll')}
            iconName="Check"
            className="flex-1"
          >
            Reconocer Todas
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onQuickAction('export')}
            iconName="Download"
            className="flex-1"
          >
            Exportar
          </Button>
        </div>
      )}
    </div>
  );
};

export default AlertSummary;
import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const AlertNotificationBar = ({ 
  alerts = [], 
  onDismiss, 
  autoHide = true, 
  hideDelay = 5000,
  maxVisible = 3 
}) => {
  const [visibleAlerts, setVisibleAlerts] = useState([]);

  useEffect(() => {
    // Filter and prioritize alerts
    const prioritizedAlerts = alerts?.filter(alert => !alert?.dismissed)?.sort((a, b) => {
        const priorityOrder = { error: 3, warning: 2, info: 1, success: 0 };
        return (priorityOrder?.[b?.type] || 0) - (priorityOrder?.[a?.type] || 0);
      })?.slice(0, maxVisible);

    setVisibleAlerts(prioritizedAlerts);
  }, [alerts, maxVisible]);

  useEffect(() => {
    if (!autoHide) return;

    const timers = visibleAlerts?.filter(alert => alert?.type === 'success' || alert?.type === 'info')?.map(alert => 
        setTimeout(() => {
          handleDismiss(alert?.id);
        }, hideDelay)
      );

    return () => {
      timers?.forEach(timer => clearTimeout(timer));
    };
  }, [visibleAlerts, autoHide, hideDelay]);

  const handleDismiss = (alertId) => {
    setVisibleAlerts(prev => prev?.filter(alert => alert?.id !== alertId));
    onDismiss?.(alertId);
  };

  const getAlertStyles = (type) => {
    const styles = {
      error: {
        bg: 'bg-error/10',
        border: 'border-error/20',
        text: 'text-error',
        icon: 'AlertCircle'
      },
      warning: {
        bg: 'bg-warning/10',
        border: 'border-warning/20',
        text: 'text-warning',
        icon: 'AlertTriangle'
      },
      success: {
        bg: 'bg-success/10',
        border: 'border-success/20',
        text: 'text-success',
        icon: 'CheckCircle'
      },
      info: {
        bg: 'bg-accent/10',
        border: 'border-accent/20',
        text: 'text-accent',
        icon: 'Info'
      }
    };
    return styles?.[type] || styles?.info;
  };

  if (visibleAlerts?.length === 0) return null;

  return (
    <div className="space-y-2 mb-4">
      {visibleAlerts?.map((alert) => {
        const styles = getAlertStyles(alert?.type);
        
        return (
          <div
            key={alert?.id}
            className={`flex items-start space-x-3 p-4 rounded-lg border ${styles?.bg} ${styles?.border} animate-fade-in`}
            role="alert"
            aria-live={alert?.type === 'error' ? 'assertive' : 'polite'}
          >
            <Icon 
              name={styles?.icon} 
              size={20} 
              className={`${styles?.text} flex-shrink-0 mt-0.5`}
            />
            <div className="flex-1 min-w-0">
              {alert?.title && (
                <h4 className={`font-medium ${styles?.text} mb-1`}>
                  {alert?.title}
                </h4>
              )}
              <p className="text-sm text-foreground">
                {alert?.message}
              </p>
              {alert?.details && (
                <p className="text-xs text-muted-foreground mt-1">
                  {alert?.details}
                </p>
              )}
              {alert?.action && (
                <div className="mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={alert?.action?.onClick}
                    className={`${styles?.text} border-current hover:bg-current/10`}
                  >
                    {alert?.action?.label}
                  </Button>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDismiss(alert?.id)}
              className={`${styles?.text} hover:bg-current/10 flex-shrink-0`}
              aria-label="Dismiss alert"
            >
              <Icon name="X" size={16} />
            </Button>
          </div>
        );
      })}
    </div>
  );
};

// Sample alerts for demonstration
export const sampleAlerts = [
  {
    id: 'low-stock-1',
    type: 'warning',
    title: 'Low Stock Alert',
    message: '15 products are running low on inventory',
    details: 'Items below minimum threshold require immediate attention',
    action: {
      label: 'View Products',
      onClick: () => console.log('Navigate to low stock products')
    }
  },
  {
    id: 'sync-error-1',
    type: 'error',
    title: 'ERP Sync Failed',
    message: 'Unable to synchronize with ERP system',
    details: 'Last successful sync: 2 hours ago',
    action: {
      label: 'Retry Sync',
      onClick: () => console.log('Retry ERP sync')
    }
  },
  {
    id: 'backup-success-1',
    type: 'success',
    title: 'Backup Complete',
    message: 'Daily inventory backup completed successfully',
    details: 'Next backup scheduled for tomorrow at 2:00 AM'
  },
  {
    id: 'maintenance-info-1',
    type: 'info',
    title: 'Scheduled Maintenance',
    message: 'System maintenance scheduled for tonight 11:00 PM - 1:00 AM',
    details: 'Some features may be temporarily unavailable'
  }
];

export default AlertNotificationBar;
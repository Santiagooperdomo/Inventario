import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const SecurityPanel = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [systemStatus, setSystemStatus] = useState({
    adConnection: 'online',
    ldapConnection: 'online',
    mfaService: 'online',
    auditLogging: 'online'
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const securityNotices = [
    {
      id: 1,
      type: 'info',
      title: 'Mantenimiento Programado',
      message: 'Mantenimiento del sistema programado para esta noche de 23:00 a 01:00',
      timestamp: '2025-09-16 18:30:00',
      icon: 'Info'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Política de Contraseñas',
      message: 'Las contraseñas deben actualizarse cada 90 días. Próximo vencimiento en 15 días.',
      timestamp: '2025-09-16 09:00:00',
      icon: 'AlertTriangle'
    },
    {
      id: 3,
      type: 'success',
      title: 'Actualización de Seguridad',
      message: 'Parches de seguridad aplicados exitosamente el 14/09/2025',
      timestamp: '2025-09-14 02:00:00',
      icon: 'Shield'
    }
  ];

  const loginAttempts = [
    {
      id: 1,
      user: 'admin@inventorypro.com',
      ip: '192.168.1.100',
      location: 'Madrid, España',
      status: 'success',
      timestamp: '2025-09-16 19:45:12',
      device: 'Chrome/Windows'
    },
    {
      id: 2,
      user: 'manager@inventorypro.com',
      ip: '192.168.1.105',
      location: 'Barcelona, España',
      status: 'success',
      timestamp: '2025-09-16 19:30:45',
      device: 'Firefox/Windows'
    },
    {
      id: 3,
      user: 'unknown@domain.com',
      ip: '203.45.67.89',
      location: 'Ubicación desconocida',
      status: 'failed',
      timestamp: '2025-09-16 19:15:23',
      device: 'Unknown'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'text-success';
      case 'warning': return 'text-warning';
      case 'offline': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const getNoticeStyles = (type) => {
    switch (type) {
      case 'warning': return { bg: 'bg-warning/10', border: 'border-warning/20', text: 'text-warning' };
      case 'error': return { bg: 'bg-error/10', border: 'border-error/20', text: 'text-error' };
      case 'success': return { bg: 'bg-success/10', border: 'border-success/20', text: 'text-success' };
      default: return { bg: 'bg-accent/10', border: 'border-accent/20', text: 'text-accent' };
    }
  };

  return (
    <div className="space-y-6">
      {/* System Status */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Shield" size={20} className="text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Estado del Sistema</h2>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Active Directory</span>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${systemStatus?.adConnection === 'online' ? 'bg-success' : 'bg-error'}`} />
              <span className={`text-sm font-medium ${getStatusColor(systemStatus?.adConnection)}`}>
                {systemStatus?.adConnection === 'online' ? 'Conectado' : 'Desconectado'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Servicio LDAP</span>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${systemStatus?.ldapConnection === 'online' ? 'bg-success' : 'bg-error'}`} />
              <span className={`text-sm font-medium ${getStatusColor(systemStatus?.ldapConnection)}`}>
                {systemStatus?.ldapConnection === 'online' ? 'Activo' : 'Inactivo'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Autenticación MFA</span>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${systemStatus?.mfaService === 'online' ? 'bg-success' : 'bg-error'}`} />
              <span className={`text-sm font-medium ${getStatusColor(systemStatus?.mfaService)}`}>
                {systemStatus?.mfaService === 'online' ? 'Operativo' : 'Fuera de servicio'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Registro de Auditoría</span>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${systemStatus?.auditLogging === 'online' ? 'bg-success' : 'bg-error'}`} />
              <span className={`text-sm font-medium ${getStatusColor(systemStatus?.auditLogging)}`}>
                {systemStatus?.auditLogging === 'online' ? 'Registrando' : 'Detenido'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Última verificación:</span>
            <span>{currentTime?.toLocaleTimeString('es-ES')}</span>
          </div>
        </div>
      </div>
      {/* Security Notices */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="AlertTriangle" size={20} className="text-warning" />
          <h2 className="text-lg font-semibold text-foreground">Avisos de Seguridad</h2>
        </div>
        
        <div className="space-y-3">
          {securityNotices?.map((notice) => {
            const styles = getNoticeStyles(notice?.type);
            return (
              <div
                key={notice?.id}
                className={`p-4 rounded-lg border ${styles?.bg} ${styles?.border}`}
              >
                <div className="flex items-start space-x-3">
                  <Icon name={notice?.icon} size={16} className={`${styles?.text} mt-0.5`} />
                  <div className="flex-1">
                    <h3 className={`text-sm font-medium ${styles?.text} mb-1`}>
                      {notice?.title}
                    </h3>
                    <p className="text-xs text-foreground mb-2">
                      {notice?.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(notice.timestamp)?.toLocaleString('es-ES')}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Recent Login Attempts */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Activity" size={20} className="text-accent" />
          <h2 className="text-lg font-semibold text-foreground">Intentos de Acceso Recientes</h2>
        </div>
        
        <div className="space-y-3">
          {loginAttempts?.map((attempt) => (
            <div key={attempt?.id} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
              <div className={`w-2 h-2 rounded-full ${
                attempt?.status === 'success' ? 'bg-success' : 'bg-error'
              }`} />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-foreground truncate">
                    {attempt?.user}
                  </p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    attempt?.status === 'success' ?'bg-success/10 text-success' :'bg-error/10 text-error'
                  }`}>
                    {attempt?.status === 'success' ? 'Exitoso' : 'Fallido'}
                  </span>
                </div>
                
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <span className="flex items-center space-x-1">
                    <Icon name="MapPin" size={12} />
                    <span>{attempt?.location}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Icon name="Monitor" size={12} />
                    <span>{attempt?.device}</span>
                  </span>
                  <span>{new Date(attempt.timestamp)?.toLocaleString('es-ES')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Current Time Display */}
      <div className="bg-card rounded-lg border border-border p-4">
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-1">Hora del Sistema</p>
          <p className="text-lg font-mono font-semibold text-foreground">
            {currentTime?.toLocaleString('es-ES')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SecurityPanel;
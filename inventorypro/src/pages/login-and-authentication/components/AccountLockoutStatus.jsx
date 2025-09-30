import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const AccountLockoutStatus = ({ username }) => {
  const [lockoutInfo, setLockoutInfo] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);

  // Mock lockout data
  const mockLockoutData = {
    'blocked@inventorypro.com': {
      isLocked: true,
      lockoutTime: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
      lockoutDuration: 15 * 60, // 15 minutes in seconds
      failedAttempts: 5,
      maxAttempts: 3,
      reason: 'Múltiples intentos fallidos de autenticación'
    },
    'warning@inventorypro.com': {
      isLocked: false,
      failedAttempts: 2,
      maxAttempts: 3,
      reason: 'Advertencia: 1 intento restante antes del bloqueo'
    }
  };

  useEffect(() => {
    if (!username) return;

    const lockoutData = mockLockoutData?.[username];
    if (lockoutData) {
      setLockoutInfo(lockoutData);
      
      if (lockoutData?.isLocked) {
        const lockoutEndTime = new Date(lockoutData.lockoutTime.getTime() + lockoutData.lockoutDuration * 1000);
        const remaining = Math.max(0, Math.floor((lockoutEndTime - new Date()) / 1000));
        setTimeRemaining(remaining);
      }
    } else {
      setLockoutInfo(null);
      setTimeRemaining(0);
    }
  }, [username]);

  useEffect(() => {
    if (timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          setLockoutInfo(prev => prev ? { ...prev, isLocked: false } : null);
        }
        return Math.max(0, newTime);
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds?.toString()?.padStart(2, '0')}`;
  };

  if (!lockoutInfo) return null;

  return (
    <div className="mt-4">
      {lockoutInfo?.isLocked ? (
        <div className="bg-error/10 border border-error/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Icon name="Lock" size={20} className="text-error mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-error mb-2">
                Cuenta Bloqueada
              </h3>
              <p className="text-sm text-foreground mb-3">
                {lockoutInfo?.reason}
              </p>
              
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>Intentos fallidos:</span>
                  <span className="font-medium text-error">
                    {lockoutInfo?.failedAttempts}/{lockoutInfo?.maxAttempts}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tiempo restante:</span>
                  <span className="font-mono font-medium text-error">
                    {formatTime(timeRemaining)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Bloqueado desde:</span>
                  <span>{lockoutInfo?.lockoutTime?.toLocaleTimeString('es-ES')}</span>
                </div>
              </div>
              
              <div className="mt-3 p-2 bg-muted rounded text-xs text-muted-foreground">
                <Icon name="Info" size={12} className="inline mr-1" />
                Contacte al administrador del sistema si necesita desbloquear la cuenta inmediatamente.
              </div>
            </div>
          </div>
        </div>
      ) : lockoutInfo?.failedAttempts > 0 ? (
        <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Icon name="AlertTriangle" size={20} className="text-warning mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-warning mb-2">
                Advertencia de Seguridad
              </h3>
              <p className="text-sm text-foreground mb-3">
                {lockoutInfo?.reason}
              </p>
              
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>Intentos fallidos:</span>
                  <span className="font-medium text-warning">
                    {lockoutInfo?.failedAttempts}/{lockoutInfo?.maxAttempts}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Intentos restantes:</span>
                  <span className="font-medium text-warning">
                    {lockoutInfo?.maxAttempts - lockoutInfo?.failedAttempts}
                  </span>
                </div>
              </div>
              
              <div className="mt-3 p-2 bg-muted rounded text-xs text-muted-foreground">
                <Icon name="Shield" size={12} className="inline mr-1" />
                Asegúrese de ingresar las credenciales correctas para evitar el bloqueo de la cuenta.
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default AccountLockoutStatus;
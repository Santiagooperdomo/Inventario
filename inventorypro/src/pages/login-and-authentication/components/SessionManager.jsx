import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SessionManager = ({ user, onLogout, onExtendSession }) => {
  const [sessionTimeLeft, setSessionTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [showWarning, setShowWarning] = useState(false);
  const [isExtending, setIsExtending] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTimeLeft(prev => {
        const newTime = prev - 1;
        
        // Show warning at 5 minutes (300 seconds)
        if (newTime === 300) {
          setShowWarning(true);
        }
        
        // Auto logout at 0
        if (newTime <= 0) {
          onLogout();
          return 0;
        }
        
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onLogout]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds?.toString()?.padStart(2, '0')}`;
  };

  const handleExtendSession = async () => {
    setIsExtending(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSessionTimeLeft(30 * 60); // Reset to 30 minutes
      setShowWarning(false);
      onExtendSession?.();
    } catch (error) {
      console.error('Failed to extend session:', error);
    } finally {
      setIsExtending(false);
    }
  };

  const handleLogout = () => {
    onLogout();
  };

  if (!user) return null;

  return (
    <>
      {/* Session Status Bar */}
      <div className="fixed top-0 left-0 right-0 bg-card border-b border-border px-4 py-2 z-50">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
              <span className="text-sm text-muted-foreground">Sesión activa</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Icon name="Clock" size={16} className="text-muted-foreground" />
              <span className={`text-sm font-mono ${
                sessionTimeLeft <= 300 ? 'text-warning font-semibold' : 'text-muted-foreground'
              }`}>
                {formatTime(sessionTimeLeft)}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Icon name="User" size={16} className="text-muted-foreground" />
              <span className="text-sm text-foreground">{user?.name}</span>
              <span className="text-xs text-muted-foreground">({user?.role})</span>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              iconName="LogOut"
              iconPosition="left"
            >
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>
      {/* Session Warning Modal */}
      {showWarning && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-100 flex items-center justify-center">
          <div className="bg-card rounded-lg border border-border p-6 max-w-md mx-4 elevation-2">
            <div className="text-center">
              <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Clock" size={32} className="text-warning" />
              </div>
              
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Advertencia de Sesión
              </h2>
              
              <p className="text-muted-foreground mb-6">
                Su sesión expirará en <span className="font-semibold text-warning">
                  {formatTime(sessionTimeLeft)}
                </span>. ¿Desea extender su sesión?
              </p>
              
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  iconName="LogOut"
                  iconPosition="left"
                  className="flex-1"
                >
                  Cerrar Sesión
                </Button>
                
                <Button
                  variant="default"
                  onClick={handleExtendSession}
                  loading={isExtending}
                  iconName="RefreshCw"
                  iconPosition="left"
                  className="flex-1"
                >
                  Extender Sesión
                </Button>
              </div>
              
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Última actividad:</span>
                  <span className="text-foreground font-medium">
                    {new Date()?.toLocaleTimeString('es-ES')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SessionManager;
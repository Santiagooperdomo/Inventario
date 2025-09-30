import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import SecurityPanel from './components/SecurityPanel';
import SessionManager from './components/SessionManager';
import AccountLockoutStatus from './components/AccountLockoutStatus';

const LoginAndAuthentication = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentUsername, setCurrentUsername] = useState('');

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('inventoryProUser');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        navigate('/inventory-management-dashboard');
      } catch (error) {
        localStorage.removeItem('inventoryProUser');
      }
    }
  }, [navigate]);

  const handleLogin = async (userData) => {
    setIsLoading(true);
    setError('');
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Save user data
      localStorage.setItem('inventoryProUser', JSON.stringify(userData));
      setUser(userData);
      
      // Log successful login
      console.log('Login successful:', userData);
      
    } catch (error) {
      setError('Error al iniciar sesión. Inténtelo nuevamente.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('inventoryProUser');
    setUser(null);
    setError('');
    setCurrentUsername('');
    navigate('/login-and-authentication');
  };

  const handleExtendSession = () => {
    console.log('Session extended');
    // Update last activity timestamp
    if (user) {
      const updatedUser = {
        ...user,
        lastActivity: new Date()?.toISOString()
      };
      localStorage.setItem('inventoryProUser', JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  };

  const handleUsernameChange = (username) => {
    setCurrentUsername(username);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Session Manager - only show when user is logged in */}
      {user && (
        <SessionManager
          user={user}
          onLogout={handleLogout}
          onExtendSession={handleExtendSession}
        />
      )}
      <div className={`flex min-h-screen ${user ? 'pt-16' : ''}`}>
        {/* Main Login Section - 70% */}
        <div className="flex-1 lg:w-[70%] flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <LoginForm
              onLogin={handleLogin}
              isLoading={isLoading}
              error={error}
              onUsernameChange={handleUsernameChange}
            />
            
            {/* Account Lockout Status */}
            <AccountLockoutStatus username={currentUsername} />
          </div>
        </div>

        {/* Security Panel - 30% */}
        <div className="hidden lg:block lg:w-[30%] bg-muted/30 border-l border-border p-6 overflow-y-auto">
          <SecurityPanel />
        </div>
      </div>
      {/* Mobile Security Panel - Collapsible */}
      <div className="lg:hidden">
        <details className="bg-card border-t border-border">
          <summary className="p-4 cursor-pointer flex items-center justify-between text-foreground hover:bg-muted/50 transition-micro">
            <span className="font-medium">Estado del Sistema y Seguridad</span>
            <svg className="w-5 h-5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </summary>
          <div className="p-4 border-t border-border">
            <SecurityPanel />
          </div>
        </details>
      </div>
      {/* Footer */}
      <footer className="bg-card border-t border-border p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>© {new Date()?.getFullYear()} InventoryPro</span>
              <span>•</span>
              <span>Sistema de Gestión de Inventario Empresarial</span>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-micro">
                Política de Privacidad
              </a>
              <span>•</span>
              <a href="#" className="hover:text-foreground transition-micro">
                Términos de Servicio
              </a>
              <span>•</span>
              <a href="#" className="hover:text-foreground transition-micro">
                Soporte Técnico
              </a>
            </div>
          </div>
          
          <div className="mt-2 pt-2 border-t border-border text-center">
            <p className="text-xs text-muted-foreground">
              Versión 2.1.0 • Última actualización: 16/09/2025 • Servidor: ES-PROD-01
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LoginAndAuthentication;
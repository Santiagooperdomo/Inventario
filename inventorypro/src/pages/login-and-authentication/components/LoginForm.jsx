import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const LoginForm = ({ onLogin, isLoading, error }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    mfaCode: '',
    rememberDevice: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showMFA, setShowMFA] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Mock credentials for different user roles
  const mockCredentials = [
    { username: 'admin@inventorypro.com', password: 'Admin123!', role: 'Administrator', mfa: '123456' },
    { username: 'manager@inventorypro.com', password: 'Manager123!', role: 'Inventory Manager', mfa: '654321' },
    { username: 'staff@inventorypro.com', password: 'Staff123!', role: 'Warehouse Staff', mfa: '789012' },
    { username: 'auditor@inventorypro.com', password: 'Audit123!', role: 'Auditor', mfa: '345678' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors?.[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData?.username?.trim()) {
      errors.username = 'El nombre de usuario es requerido';
    } else if (!formData?.username?.includes('@')) {
      errors.username = 'Ingrese un email válido';
    }
    
    if (!formData?.password?.trim()) {
      errors.password = 'La contraseña es requerida';
    } else if (formData?.password?.length < 8) {
      errors.password = 'La contraseña debe tener al menos 8 caracteres';
    }
    
    if (showMFA && !formData?.mfaCode?.trim()) {
      errors.mfaCode = 'El código MFA es requerido';
    } else if (showMFA && formData?.mfaCode?.length !== 6) {
      errors.mfaCode = 'El código MFA debe tener 6 dígitos';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;

    // Find matching credentials
    const matchingUser = mockCredentials?.find(
      cred => cred?.username === formData?.username && cred?.password === formData?.password
    );

    if (!matchingUser) {
      setValidationErrors({
        general: 'Credenciales inválidas. Use: admin@inventorypro.com / Admin123!'
      });
      return;
    }

    // If MFA is not shown yet, show it
    if (!showMFA) {
      setShowMFA(true);
      return;
    }

    // Validate MFA code
    if (formData?.mfaCode !== matchingUser?.mfa) {
      setValidationErrors({
        mfaCode: `Código MFA incorrecto. Use: ${matchingUser?.mfa}`
      });
      return;
    }

    // Successful login
    const userData = {
      id: Date.now(),
      name: matchingUser?.username?.split('@')?.[0],
      email: matchingUser?.username,
      role: matchingUser?.role,
      lastLogin: new Date()?.toISOString(),
      permissions: ['read', 'write', 'delete']
    };

    onLogin(userData);
    navigate('/inventory-management-dashboard');
  };

  const handleForgotPassword = () => {
    alert('Funcionalidad de recuperación de contraseña - Contacte al administrador del sistema');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-card rounded-lg border border-border p-8 elevation-2">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
            <Icon name="Package" size={32} color="white" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground mb-2">InventoryPro</h1>
          <p className="text-muted-foreground">Sistema de Gestión de Inventario Empresarial</p>
        </div>

        {/* Error Display */}
        {(error || validationErrors?.general) && (
          <div className="bg-error/10 border border-error/20 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <Icon name="AlertCircle" size={16} className="text-error" />
              <p className="text-sm text-error font-medium">
                {error || validationErrors?.general}
              </p>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Field */}
          <Input
            label="Correo Electrónico"
            type="email"
            name="username"
            value={formData?.username}
            onChange={handleInputChange}
            placeholder="usuario@empresa.com"
            error={validationErrors?.username}
            required
            disabled={isLoading}
          />

          {/* Password Field */}
          <div className="relative">
            <Input
              label="Contraseña"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData?.password}
              onChange={handleInputChange}
              placeholder="Ingrese su contraseña"
              error={validationErrors?.password}
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-micro"
              disabled={isLoading}
            >
              <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={16} />
            </button>
          </div>

          {/* MFA Code Field */}
          {showMFA && (
            <Input
              label="Código de Autenticación Multifactor"
              type="text"
              name="mfaCode"
              value={formData?.mfaCode}
              onChange={handleInputChange}
              placeholder="Ingrese código de 6 dígitos"
              error={validationErrors?.mfaCode}
              maxLength={6}
              required
              disabled={isLoading}
              description="Ingrese el código de su aplicación de autenticación"
            />
          )}

          {/* Remember Device */}
          <Checkbox
            label="Recordar este dispositivo por 30 días"
            name="rememberDevice"
            checked={formData?.rememberDevice}
            onChange={handleInputChange}
            disabled={isLoading}
            description="No seleccionar en dispositivos compartidos"
          />

          {/* Submit Button */}
          <Button
            type="submit"
            variant="default"
            fullWidth
            loading={isLoading}
            iconName={showMFA ? "Shield" : "LogIn"}
            iconPosition="left"
          >
            {showMFA ? 'Verificar y Acceder' : 'Iniciar Sesión'}
          </Button>

          {/* Forgot Password Link */}
          <div className="text-center">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-primary hover:text-primary/80 transition-micro"
              disabled={isLoading}
            >
              ¿Olvidó su contraseña?
            </button>
          </div>
        </form>

        {/* Mock Credentials Info */}
        <div className="mt-8 p-4 bg-muted rounded-lg">
          <h3 className="text-sm font-medium text-foreground mb-2">Credenciales de Prueba:</h3>
          <div className="space-y-1 text-xs text-muted-foreground">
            <p><strong>Admin:</strong> admin@inventorypro.com / Admin123! / MFA: 123456</p>
            <p><strong>Manager:</strong> manager@inventorypro.com / Manager123! / MFA: 654321</p>
            <p><strong>Staff:</strong> staff@inventorypro.com / Staff123! / MFA: 789012</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
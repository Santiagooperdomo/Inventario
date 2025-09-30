import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const ScheduledReportsTab = ({ onScheduleReport, onUpdateSchedule }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [scheduleConfig, setScheduleConfig] = useState({
    reportId: '',
    name: '',
    frequency: 'weekly',
    dayOfWeek: 'monday',
    dayOfMonth: 1,
    time: '09:00',
    timezone: 'Europe/Madrid',
    recipients: [''],
    format: 'pdf',
    includeCharts: true,
    active: true
  });

  const scheduledReports = [
    {
      id: 'sched-1',
      name: 'Reporte Semanal de Inventario',
      reportName: 'Análisis de Stock Semanal',
      frequency: 'weekly',
      schedule: 'Lunes a las 09:00',
      nextRun: '2025-01-20 09:00',
      lastRun: '2025-01-13 09:00',
      status: 'active',
      recipients: ['manager@empresa.com', 'inventory@empresa.com'],
      format: 'pdf',
      successRate: 98.5
    },
    {
      id: 'sched-2',
      name: 'Informe Mensual de Rotación',
      reportName: 'Análisis de Rotación de Productos',
      frequency: 'monthly',
      schedule: 'Día 1 a las 08:00',
      nextRun: '2025-02-01 08:00',
      lastRun: '2025-01-01 08:00',
      status: 'active',
      recipients: ['ceo@empresa.com', 'operations@empresa.com'],
      format: 'excel',
      successRate: 100
    },
    {
      id: 'sched-3',
      name: 'Alerta Diaria Stock Bajo',
      reportName: 'Productos con Stock Crítico',
      frequency: 'daily',
      schedule: 'Diario a las 07:30',
      nextRun: '2025-01-17 07:30',
      lastRun: '2025-01-16 07:30',
      status: 'paused',
      recipients: ['warehouse@empresa.com'],
      format: 'csv',
      successRate: 95.2
    },
    {
      id: 'sched-4',
      name: 'Reporte Trimestral Financiero',
      reportName: 'Valoración de Inventario Trimestral',
      frequency: 'quarterly',
      schedule: 'Primer día del trimestre a las 10:00',
      nextRun: '2025-04-01 10:00',
      lastRun: '2025-01-01 10:00',
      status: 'active',
      recipients: ['finance@empresa.com', 'cfo@empresa.com'],
      format: 'pdf',
      successRate: 100
    }
  ];

  const availableReports = [
    { value: 'inv-analysis', label: 'Análisis de Inventario' },
    { value: 'turnover-report', label: 'Reporte de Rotación' },
    { value: 'low-stock', label: 'Stock Bajo Mínimo' },
    { value: 'abc-analysis', label: 'Análisis ABC' },
    { value: 'supplier-performance', label: 'Rendimiento Proveedores' }
  ];

  const frequencyOptions = [
    { value: 'daily', label: 'Diario' },
    { value: 'weekly', label: 'Semanal' },
    { value: 'monthly', label: 'Mensual' },
    { value: 'quarterly', label: 'Trimestral' }
  ];

  const dayOptions = [
    { value: 'monday', label: 'Lunes' },
    { value: 'tuesday', label: 'Martes' },
    { value: 'wednesday', label: 'Miércoles' },
    { value: 'thursday', label: 'Jueves' },
    { value: 'friday', label: 'Viernes' },
    { value: 'saturday', label: 'Sábado' },
    { value: 'sunday', label: 'Domingo' }
  ];

  const formatOptions = [
    { value: 'pdf', label: 'PDF' },
    { value: 'excel', label: 'Excel' },
    { value: 'csv', label: 'CSV' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-success bg-success/10';
      case 'paused':
        return 'text-warning bg-warning/10';
      case 'error':
        return 'text-error bg-error/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active':
        return 'Activo';
      case 'paused':
        return 'Pausado';
      case 'error':
        return 'Error';
      default:
        return 'Desconocido';
    }
  };

  const addRecipient = () => {
    setScheduleConfig(prev => ({
      ...prev,
      recipients: [...prev?.recipients, '']
    }));
  };

  const updateRecipient = (index, value) => {
    setScheduleConfig(prev => ({
      ...prev,
      recipients: prev?.recipients?.map((recipient, i) => 
        i === index ? value : recipient
      )
    }));
  };

  const removeRecipient = (index) => {
    setScheduleConfig(prev => ({
      ...prev,
      recipients: prev?.recipients?.filter((_, i) => i !== index)
    }));
  };

  const handleCreateSchedule = () => {
    if (scheduleConfig?.reportId && scheduleConfig?.name && scheduleConfig?.recipients?.some(r => r?.trim())) {
      onScheduleReport?.({
        ...scheduleConfig,
        id: `sched-${Date.now()}`,
        createdAt: new Date()?.toISOString(),
        recipients: scheduleConfig?.recipients?.filter(r => r?.trim())
      });
      
      setShowCreateModal(false);
      setScheduleConfig({
        reportId: '',
        name: '',
        frequency: 'weekly',
        dayOfWeek: 'monday',
        dayOfMonth: 1,
        time: '09:00',
        timezone: 'Europe/Madrid',
        recipients: [''],
        format: 'pdf',
        includeCharts: true,
        active: true
      });
    }
  };

  const toggleReportStatus = (reportId) => {
    onUpdateSchedule?.(reportId, { 
      status: scheduledReports?.find(r => r?.id === reportId)?.status === 'active' ? 'paused' : 'active' 
    });
  };

  const runReportNow = (reportId) => {
    console.log('Ejecutando reporte:', reportId);
    // Simulate running report
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Reportes Programados</h2>
          <p className="text-muted-foreground">Gestiona la generación automática de reportes</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            iconName="RefreshCw"
            iconPosition="left"
          >
            Actualizar Estado
          </Button>
          <Button
            variant="default"
            iconName="Plus"
            iconPosition="left"
            onClick={() => setShowCreateModal(true)}
          >
            Programar Reporte
          </Button>
        </div>
      </div>
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Calendar" size={24} className="text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">4</p>
              <p className="text-sm text-muted-foreground">Total Programados</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
              <Icon name="CheckCircle" size={24} className="text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">3</p>
              <p className="text-sm text-muted-foreground">Activos</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
              <Icon name="Pause" size={24} className="text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">1</p>
              <p className="text-sm text-muted-foreground">Pausados</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
              <Icon name="TrendingUp" size={24} className="text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">98.4%</p>
              <p className="text-sm text-muted-foreground">Tasa de Éxito</p>
            </div>
          </div>
        </div>
      </div>
      {/* Scheduled Reports Table */}
      <div className="bg-card border border-border rounded-lg">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">Reportes Programados</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-4 px-6 font-medium text-muted-foreground">Reporte</th>
                <th className="text-left py-4 px-6 font-medium text-muted-foreground">Frecuencia</th>
                <th className="text-left py-4 px-6 font-medium text-muted-foreground">Próxima Ejecución</th>
                <th className="text-left py-4 px-6 font-medium text-muted-foreground">Estado</th>
                <th className="text-left py-4 px-6 font-medium text-muted-foreground">Destinatarios</th>
                <th className="text-right py-4 px-6 font-medium text-muted-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {scheduledReports?.map((report) => (
                <tr key={report?.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-foreground">{report?.name}</p>
                      <p className="text-sm text-muted-foreground">{report?.reportName}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Icon name="FileText" size={14} className="text-muted-foreground" />
                        <span className="text-xs text-muted-foreground uppercase">{report?.format}</span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-success">{report?.successRate}% éxito</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <p className="text-sm font-medium text-foreground capitalize">{report?.frequency}</p>
                      <p className="text-xs text-muted-foreground">{report?.schedule}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <p className="text-sm font-medium text-foreground">{report?.nextRun}</p>
                      <p className="text-xs text-muted-foreground">Última: {report?.lastRun}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report?.status)}`}>
                      <div className={`w-1.5 h-1.5 rounded-full mr-1 ${
                        report?.status === 'active' ? 'bg-success' :
                        report?.status === 'paused' ? 'bg-warning' : 'bg-error'
                      }`} />
                      {getStatusLabel(report?.status)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-1">
                      <Icon name="Users" size={14} className="text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{report?.recipients?.length}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => runReportNow(report?.id)}
                        title="Ejecutar ahora"
                      >
                        <Icon name="Play" size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleReportStatus(report?.id)}
                        title={report?.status === 'active' ? 'Pausar' : 'Activar'}
                      >
                        <Icon name={report?.status === 'active' ? 'Pause' : 'Play'} size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedReport(report)}
                        title="Editar"
                      >
                        <Icon name="Edit" size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Eliminar"
                        className="text-error hover:text-error hover:bg-error/10"
                      >
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Create Schedule Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Programar Nuevo Reporte</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowCreateModal(false)}
                >
                  <Icon name="X" size={16} />
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Configuration */}
              <div className="space-y-4">
                <Select
                  label="Reporte Base"
                  placeholder="Selecciona un reporte"
                  options={availableReports}
                  value={scheduleConfig?.reportId}
                  onChange={(value) => setScheduleConfig(prev => ({ ...prev, reportId: value }))}
                  required
                />

                <Input
                  label="Nombre del Programa"
                  placeholder="Ej: Reporte Semanal de Inventario"
                  value={scheduleConfig?.name}
                  onChange={(e) => setScheduleConfig(prev => ({ ...prev, name: e?.target?.value }))}
                  required
                />
              </div>

              {/* Schedule Configuration */}
              <div className="space-y-4">
                <h4 className="text-md font-medium text-foreground">Configuración de Horario</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="Frecuencia"
                    options={frequencyOptions}
                    value={scheduleConfig?.frequency}
                    onChange={(value) => setScheduleConfig(prev => ({ ...prev, frequency: value }))}
                  />

                  {scheduleConfig?.frequency === 'weekly' && (
                    <Select
                      label="Día de la Semana"
                      options={dayOptions}
                      value={scheduleConfig?.dayOfWeek}
                      onChange={(value) => setScheduleConfig(prev => ({ ...prev, dayOfWeek: value }))}
                    />
                  )}

                  {scheduleConfig?.frequency === 'monthly' && (
                    <Input
                      label="Día del Mes"
                      type="number"
                      min="1"
                      max="31"
                      value={scheduleConfig?.dayOfMonth}
                      onChange={(e) => setScheduleConfig(prev => ({ ...prev, dayOfMonth: parseInt(e?.target?.value) }))}
                    />
                  )}

                  <Input
                    label="Hora"
                    type="time"
                    value={scheduleConfig?.time}
                    onChange={(e) => setScheduleConfig(prev => ({ ...prev, time: e?.target?.value }))}
                  />
                </div>
              </div>

              {/* Recipients */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-md font-medium text-foreground">Destinatarios</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Plus"
                    iconPosition="left"
                    onClick={addRecipient}
                  >
                    Agregar
                  </Button>
                </div>

                <div className="space-y-3">
                  {scheduleConfig?.recipients?.map((recipient, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Input
                        type="email"
                        placeholder="email@empresa.com"
                        value={recipient}
                        onChange={(e) => updateRecipient(index, e?.target?.value)}
                        className="flex-1"
                      />
                      {scheduleConfig?.recipients?.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeRecipient(index)}
                          className="text-error hover:text-error hover:bg-error/10"
                        >
                          <Icon name="X" size={16} />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Output Configuration */}
              <div className="space-y-4">
                <h4 className="text-md font-medium text-foreground">Configuración de Salida</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="Formato"
                    options={formatOptions}
                    value={scheduleConfig?.format}
                    onChange={(value) => setScheduleConfig(prev => ({ ...prev, format: value }))}
                  />
                </div>

                <div className="space-y-3">
                  <Checkbox
                    label="Incluir gráficos en el reporte"
                    checked={scheduleConfig?.includeCharts}
                    onChange={(e) => setScheduleConfig(prev => ({ ...prev, includeCharts: e?.target?.checked }))}
                  />
                  
                  <Checkbox
                    label="Activar programa inmediatamente"
                    checked={scheduleConfig?.active}
                    onChange={(e) => setScheduleConfig(prev => ({ ...prev, active: e?.target?.checked }))}
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-border flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowCreateModal(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="default"
                onClick={handleCreateSchedule}
                disabled={!scheduleConfig?.reportId || !scheduleConfig?.name || !scheduleConfig?.recipients?.some(r => r?.trim())}
              >
                Programar Reporte
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduledReportsTab;
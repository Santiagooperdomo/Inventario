import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import AlertNotificationBar from '../../components/ui/AlertNotificationBar';
import CategoryTree from './components/CategoryTree';
import CategoryDetails from './components/CategoryDetails';
import BulkOperationsToolbar from './components/BulkOperationsToolbar';
import CategorySearch from './components/CategorySearch';
import IntegrationPanel from './components/IntegrationPanel';
import CategoryMetrics from './components/CategoryMetrics';

import Button from '../../components/ui/Button';

const CategoryManagementSystem = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [expandedNodes, setExpandedNodes] = useState(['electronics', 'clothing']);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [savedFilters, setSavedFilters] = useState([]);
  const [activeView, setActiveView] = useState('tree'); // tree, metrics, integrations
  const [alerts, setAlerts] = useState([]);

  // Mock user data
  const user = {
    name: "María González",
    email: "maria.gonzalez@inventorypro.com",
    role: "Gerente de Categorías",
    avatar: "https://randomuser.me/api/portraits/women/32.jpg"
  };

  // Mock notifications
  const notifications = [
    {
      id: 1,
      type: 'warning',
      title: 'Categorías huérfanas detectadas',
      message: '12 productos sin categoría asignada',
      time: 'Hace 15 min',
      read: false
    },
    {
      id: 2,
      type: 'success',
      title: 'Sincronización completada',
      message: 'ERP SAP sincronizado correctamente',
      time: 'Hace 1 hora',
      read: false
    },
    {
      id: 3,
      type: 'info',
      title: 'Nueva regla automática',
      message: 'Regla de categorización por marca activada',
      time: 'Hace 2 horas',
      read: true
    }
  ];

  // Mock category data with Spanish content
  const mockCategories = [
    {
      id: 'electronics',
      name: 'Electrónicos',
      description: 'Dispositivos y componentes electrónicos',
      status: 'active',
      productCount: 1247,
      inventoryValue: 450000,
      turnoverRate: 3.2,
      hasRules: true,
      isExternal: false,
      parentId: null,
      level: 1,
      sortOrder: 1,
      slug: 'electronicos',
      metaTitle: 'Electrónicos - Catálogo de productos',
      metaDescription: 'Amplia gama de productos electrónicos y componentes',
      attributes: [
        { id: '1', name: 'Marca', type: 'select', required: true, options: ['Samsung', 'Apple', 'Sony'] },
        { id: '2', name: 'Garantía', type: 'number', required: false }
      ],
      children: [
        {
          id: 'smartphones',
          name: 'Smartphones',
          description: 'Teléfonos inteligentes y accesorios',
          status: 'active',
          productCount: 234,
          inventoryValue: 180000,
          turnoverRate: 4.1,
          hasRules: true,
          isExternal: true,
          parentId: 'electronics',
          level: 2,
          children: [
            {
              id: 'android',
              name: 'Android',
              description: 'Dispositivos con sistema operativo Android',
              status: 'active',
              productCount: 156,
              inventoryValue: 120000,
              turnoverRate: 3.8,
              hasRules: false,
              isExternal: true,
              parentId: 'smartphones',
              level: 3,
              children: []
            },
            {
              id: 'ios',
              name: 'iOS',
              description: 'Dispositivos Apple iPhone',
              status: 'active',
              productCount: 78,
              inventoryValue: 60000,
              turnoverRate: 4.5,
              hasRules: false,
              isExternal: true,
              parentId: 'smartphones',
              level: 3,
              children: []
            }
          ]
        },
        {
          id: 'laptops',
          name: 'Laptops',
          description: 'Computadoras portátiles y ultrabooks',
          status: 'active',
          productCount: 189,
          inventoryValue: 270000,
          turnoverRate: 2.9,
          hasRules: true,
          isExternal: false,
          parentId: 'electronics',
          level: 2,
          children: []
        }
      ]
    },
    {
      id: 'clothing',
      name: 'Ropa',
      description: 'Prendas de vestir y accesorios de moda',
      status: 'active',
      productCount: 892,
      inventoryValue: 280000,
      turnoverRate: 4.1,
      hasRules: false,
      isExternal: false,
      parentId: null,
      level: 1,
      sortOrder: 2,
      slug: 'ropa',
      attributes: [
        { id: '3', name: 'Talla', type: 'select', required: true, options: ['XS', 'S', 'M', 'L', 'XL'] },
        { id: '4', name: 'Color', type: 'text', required: true },
        { id: '5', name: 'Material', type: 'text', required: false }
      ],
      children: [
        {
          id: 'mens-clothing',
          name: 'Ropa Masculina',
          description: 'Prendas para hombre',
          status: 'active',
          productCount: 445,
          inventoryValue: 140000,
          turnoverRate: 3.7,
          hasRules: false,
          isExternal: false,
          parentId: 'clothing',
          level: 2,
          children: []
        },
        {
          id: 'womens-clothing',
          name: 'Ropa Femenina',
          description: 'Prendas para mujer',
          status: 'active',
          productCount: 447,
          inventoryValue: 140000,
          turnoverRate: 4.5,
          hasRules: false,
          isExternal: false,
          parentId: 'clothing',
          level: 2,
          children: []
        }
      ]
    },
    {
      id: 'home',
      name: 'Hogar',
      description: 'Artículos para el hogar y decoración',
      status: 'inactive',
      productCount: 634,
      inventoryValue: 320000,
      turnoverRate: 2.8,
      hasRules: false,
      isExternal: false,
      parentId: null,
      level: 1,
      sortOrder: 3,
      slug: 'hogar',
      attributes: [],
      children: []
    }
  ];

  useEffect(() => {
    // Initialize alerts
    setAlerts([
      {
        id: 'orphan-products',
        type: 'warning',
        title: 'Productos huérfanos detectados',
        message: '12 productos no tienen categoría asignada y requieren clasificación manual',
        details: 'Estos productos pueden afectar la organización del inventario',
        action: {
          label: 'Clasificar productos',
          onClick: () => console.log('Navigate to orphan products')
        }
      },
      {
        id: 'duplicate-categories',
        type: 'info',
        title: 'Posibles categorías duplicadas',
        message: 'Se encontraron 3 categorías con nombres similares que podrían fusionarse',
        details: 'Revisa: "Electrónicos", "Electrodomésticos", "Electrónica"'
      }
    ]);

    // Auto-select first category
    if (mockCategories?.length > 0) {
      setSelectedCategory(mockCategories?.[0]);
    }
  }, []);

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleLogout = () => {
    console.log('Logging out...');
  };

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    setIsEditing(false);
  };

  const handleToggleExpand = (categoryId) => {
    setExpandedNodes(prev => 
      prev?.includes(categoryId) 
        ? prev?.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleBulkSelect = (categoryId, selected) => {
    setSelectedCategories(prev => 
      selected 
        ? [...prev, categoryId]
        : prev?.filter(id => id !== categoryId)
    );
  };

  const handleClearSelection = () => {
    setSelectedCategories([]);
  };

  const handleSaveCategory = (categoryData) => {
    console.log('Saving category:', categoryData);
    setIsEditing(false);
    // Here you would typically make an API call to save the category
  };

  const handleDeleteCategory = (category) => {
    console.log('Deleting category:', category);
    // Here you would typically show a confirmation dialog and then delete
  };

  const handleBulkMerge = (categories, targetId) => {
    console.log('Merging categories:', categories, 'into:', targetId);
  };

  const handleBulkDelete = (categories) => {
    console.log('Bulk deleting categories:', categories);
  };

  const handleBulkStatusChange = (categories, newStatus) => {
    console.log('Changing status of categories:', categories, 'to:', newStatus);
  };

  const handleBulkAttributeApply = (categories) => {
    console.log('Applying attributes to categories:', categories);
  };

  const handleBulkProductReassign = (categories, targetId) => {
    console.log('Reassigning products from categories:', categories, 'to:', targetId);
  };

  const handleSaveFilter = (filterData) => {
    setSavedFilters(prev => [...prev, { ...filterData, id: Date.now() }]);
  };

  const handleLoadFilter = (filter) => {
    setSearchTerm(filter?.searchTerm || '');
    setFilters(filter?.filters || {});
  };

  const handleDeleteFilter = (filterId) => {
    setSavedFilters(prev => prev?.filter(f => f?.id !== filterId));
  };

  const handleDragStart = (category) => {
    console.log('Drag started:', category);
  };

  const handleDragOver = (e, category) => {
    console.log('Drag over:', category);
  };

  const handleDrop = (draggedCategory, targetCategory) => {
    console.log('Dropped:', draggedCategory, 'onto:', targetCategory);
  };

  const handleSync = (integrationId) => {
    console.log('Syncing integration:', integrationId);
    return new Promise(resolve => setTimeout(resolve, 2000));
  };

  const handleConfigureIntegration = (integrationId) => {
    console.log('Configuring integration:', integrationId);
  };

  const handleToggleIntegration = (integrationId) => {
    console.log('Toggling integration:', integrationId);
  };

  const handleDismissAlert = (alertId) => {
    setAlerts(prev => prev?.filter(alert => alert?.id !== alertId));
  };

  const breadcrumbItems = [
    {
      label: 'Productos',
      path: '/product-management-interface',
      icon: 'Package'
    },
    {
      label: 'Gestión de Categorías',
      path: '/category-management-system',
      icon: 'FolderTree',
      current: true
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Sistema de Gestión de Categorías - InventoryPro</title>
        <meta name="description" content="Gestión jerárquica de categorías de productos con funcionalidades avanzadas de organización y automatización" />
      </Helmet>
      <Header 
        user={user} 
        onLogout={handleLogout}
        notifications={notifications}
      />
      <Sidebar 
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={handleToggleSidebar}
        user={user}
      />
      <main className={`transition-all duration-300 ${
        sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-80'
      } pt-16`}>
        <div className="p-6">
          <Breadcrumb items={breadcrumbItems} />
          
          <AlertNotificationBar 
            alerts={alerts}
            onDismiss={handleDismissAlert}
            maxVisible={2}
          />

          {/* Header Section */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Sistema de Gestión de Categorías
              </h1>
              <p className="text-muted-foreground">
                Organiza y mantiene la taxonomía de productos con herramientas avanzadas de categorización
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* View Toggle */}
              <div className="flex items-center bg-muted rounded-lg p-1">
                <Button
                  variant={activeView === 'tree' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveView('tree')}
                  iconName="FolderTree"
                >
                  Árbol
                </Button>
                <Button
                  variant={activeView === 'metrics' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveView('metrics')}
                  iconName="BarChart3"
                >
                  Métricas
                </Button>
                <Button
                  variant={activeView === 'integrations' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveView('integrations')}
                  iconName="Plug"
                >
                  Integraciones
                </Button>
              </div>
              
              <Button
                variant="default"
                iconName="Plus"
                iconPosition="left"
              >
                Nueva Categoría
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          {activeView === 'tree' && (
            <CategorySearch
              onSearch={setSearchTerm}
              onFilterChange={setFilters}
              savedFilters={savedFilters}
              onSaveFilter={handleSaveFilter}
              onLoadFilter={handleLoadFilter}
              onDeleteFilter={handleDeleteFilter}
            />
          )}

          {/* Bulk Operations */}
          {activeView === 'tree' && (
            <BulkOperationsToolbar
              selectedCategories={selectedCategories}
              onClearSelection={handleClearSelection}
              onBulkMerge={handleBulkMerge}
              onBulkDelete={handleBulkDelete}
              onBulkStatusChange={handleBulkStatusChange}
              onBulkAttributeApply={handleBulkAttributeApply}
              onBulkProductReassign={handleBulkProductReassign}
            />
          )}

          {/* Main Content */}
          {activeView === 'tree' && (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-[calc(100vh-300px)]">
              {/* Left Panel - Category Tree */}
              <div className="lg:col-span-2 bg-card border border-border rounded-lg overflow-hidden">
                <div className="p-4 border-b border-border">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground">
                      Árbol de Categorías
                    </h3>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="RotateCcw"
                        onClick={() => {
                          setExpandedNodes([]);
                          setSelectedCategories([]);
                        }}
                      >
                        Colapsar todo
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Expand"
                        onClick={() => {
                          const allIds = [];
                          const collectIds = (categories) => {
                            categories?.forEach(cat => {
                              allIds?.push(cat?.id);
                              if (cat?.children) collectIds(cat?.children);
                            });
                          };
                          collectIds(mockCategories);
                          setExpandedNodes(allIds);
                        }}
                      >
                        Expandir todo
                      </Button>
                    </div>
                  </div>
                </div>
                
                <CategoryTree
                  categories={mockCategories}
                  selectedCategory={selectedCategory}
                  onSelectCategory={handleSelectCategory}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  expandedNodes={expandedNodes}
                  onToggleExpand={handleToggleExpand}
                  searchTerm={searchTerm}
                  onBulkSelect={handleBulkSelect}
                  selectedCategories={selectedCategories}
                />
              </div>

              {/* Right Panel - Category Details */}
              <div className="lg:col-span-3">
                <CategoryDetails
                  category={selectedCategory}
                  onSave={handleSaveCategory}
                  onDelete={handleDeleteCategory}
                  onCancel={() => setIsEditing(false)}
                  isEditing={isEditing}
                  onToggleEdit={() => setIsEditing(!isEditing)}
                  parentCategories={mockCategories?.filter(cat => cat?.id !== selectedCategory?.id)}
                />
              </div>
            </div>
          )}

          {activeView === 'metrics' && (
            <div className="bg-card border border-border rounded-lg p-6">
              <CategoryMetrics
                selectedCategory={selectedCategory}
                onDrillDown={(category) => {
                  setActiveView('tree');
                  setSelectedCategory(category);
                }}
              />
            </div>
          )}

          {activeView === 'integrations' && (
            <IntegrationPanel
              onSync={handleSync}
              onConfigureIntegration={handleConfigureIntegration}
              onToggleIntegration={handleToggleIntegration}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default CategoryManagementSystem;
import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import AlertNotificationBar from '../../components/ui/AlertNotificationBar';
import CategorySidebar from './components/CategorySidebar';
import ProductGrid from './components/ProductGrid';
import ProductDetailPanel from './components/ProductDetailPanel';
import FilterBar from './components/FilterBar';
import AddProductModal from './components/AddProductModal';

const ProductManagementInterface = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filters, setFilters] = useState({});
  const [alerts, setAlerts] = useState([]);

  // Mock user data
  const user = {
    name: "María González",
    email: "maria.gonzalez@inventorypro.com",
    role: "Gerente de Inventario"
  };

  // Mock notifications
  const notifications = [
    {
      id: 1,
      type: 'warning',
      title: 'Stock Bajo',
      message: '15 productos requieren reabastecimiento',
      time: 'Hace 5 min',
      read: false
    },
    {
      id: 2,
      type: 'success',
      title: 'Sincronización Completa',
      message: 'Datos actualizados desde ERP',
      time: 'Hace 10 min',
      read: true
    }
  ];

  // Mock categories data
  const categories = [
    {
      id: 'electronics',
      name: 'Electrónicos',
      icon: 'Smartphone',
      productCount: 847,
      children: [
        { id: 'laptops', name: 'Laptops', icon: 'Laptop', productCount: 156 },
        { id: 'phones', name: 'Teléfonos', icon: 'Smartphone', productCount: 234 },
        { id: 'accessories', name: 'Accesorios', icon: 'Headphones', productCount: 457 }
      ]
    },
    {
      id: 'clothing',
      name: 'Ropa',
      icon: 'Shirt',
      productCount: 1245,
      children: [
        { id: 'mens', name: 'Hombre', icon: 'User', productCount: 567 },
        { id: 'womens', name: 'Mujer', icon: 'User', productCount: 678 }
      ]
    },
    {
      id: 'home',
      name: 'Hogar',
      icon: 'Home',
      productCount: 456,
      children: [
        { id: 'furniture', name: 'Muebles', icon: 'Armchair', productCount: 234 },
        { id: 'decor', name: 'Decoración', icon: 'Palette', productCount: 222 }
      ]
    },
    {
      id: 'sports',
      name: 'Deportes',
      icon: 'Dumbbell',
      productCount: 299
    }
  ];

  // Mock products data
  const products = [
    {
      id: 1,
      sku: 'ELE-001234',
      name: 'Laptop Dell Inspiron 15',
      description: 'Laptop para uso profesional con procesador Intel i7',
      category: 'Electrónicos',
      brand: 'Dell',
      stock: 45,
      cost: 650.00,
      price: 899.99,
      status: 'active',
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop',
      barcode: '1234567890123'
    },
    {
      id: 2,
      sku: 'ELE-001235',
      name: 'iPhone 15 Pro',
      description: 'Smartphone Apple con cámara profesional',
      category: 'Electrónicos',
      brand: 'Apple',
      stock: 8,
      cost: 800.00,
      price: 1199.99,
      status: 'active',
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop',
      barcode: '1234567890124'
    },
    {
      id: 3,
      sku: 'CLO-002001',
      name: 'Camiseta Nike Dri-FIT',
      description: 'Camiseta deportiva transpirable',
      category: 'Ropa',
      brand: 'Nike',
      stock: 156,
      cost: 15.00,
      price: 29.99,
      status: 'active',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop',
      barcode: '1234567890125'
    },
    {
      id: 4,
      sku: 'HOM-003001',
      name: 'Silla de Oficina Ergonómica',
      description: 'Silla con soporte lumbar ajustable',
      category: 'Hogar',
      brand: 'Herman Miller',
      stock: 23,
      cost: 180.00,
      price: 299.99,
      status: 'active',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
      barcode: '1234567890126'
    },
    {
      id: 5,
      sku: 'SPO-004001',
      name: 'Mancuernas Ajustables 20kg',
      description: 'Set de mancuernas con peso ajustable',
      category: 'Deportes',
      brand: 'Bowflex',
      stock: 12,
      cost: 120.00,
      price: 199.99,
      status: 'active',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      barcode: '1234567890127'
    },
    {
      id: 6,
      sku: 'ELE-001236',
      name: 'Auriculares Sony WH-1000XM4',
      description: 'Auriculares inalámbricos con cancelación de ruido',
      category: 'Electrónicos',
      brand: 'Sony',
      stock: 67,
      cost: 200.00,
      price: 349.99,
      status: 'active',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
      barcode: '1234567890128'
    },
    {
      id: 7,
      sku: 'CLO-002002',
      name: 'Jeans Levi\'s 501',
      description: 'Jeans clásicos de corte recto',
      category: 'Ropa',
      brand: 'Levi\'s',
      stock: 89,
      cost: 35.00,
      price: 79.99,
      status: 'active',
      image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=300&fit=crop',
      barcode: '1234567890129'
    },
    {
      id: 8,
      sku: 'HOM-003002',
      name: 'Mesa de Centro Moderna',
      description: 'Mesa de centro de madera con diseño minimalista',
      category: 'Hogar',
      brand: 'IKEA',
      stock: 34,
      cost: 80.00,
      price: 149.99,
      status: 'active',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
      barcode: '1234567890130'
    },
    {
      id: 9,
      sku: 'ELE-001237',
      name: 'Tablet Samsung Galaxy Tab S8',
      description: 'Tablet Android con S Pen incluido',
      category: 'Electrónicos',
      brand: 'Samsung',
      stock: 28,
      cost: 450.00,
      price: 699.99,
      status: 'active',
      image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop',
      barcode: '1234567890131'
    },
    {
      id: 10,
      sku: 'SPO-004002',
      name: 'Bicicleta Estática',
      description: 'Bicicleta para ejercicio en casa',
      category: 'Deportes',
      brand: 'Peloton',
      stock: 6,
      cost: 800.00,
      price: 1299.99,
      status: 'active',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      barcode: '1234567890132'
    }
  ];

  useEffect(() => {
    // Initialize alerts
    const initialAlerts = [
      {
        id: 'low-stock-alert',
        type: 'warning',
        title: 'Productos con Stock Bajo',
        message: `${products?.filter(p => p?.stock <= 10)?.length} productos requieren reabastecimiento inmediato`,
        details: 'Revisa la lista de productos con stock crítico',
        action: {
          label: 'Ver Productos',
          onClick: () => setFilters({ ...filters, status: 'low-stock' })
        }
      }
    ];
    setAlerts(initialAlerts);
  }, []);

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedProduct(null);
  };

  const handleProductSelect = (productIds) => {
    if (Array.isArray(productIds)) {
      setSelectedProducts(productIds);
      if (productIds?.length === 1) {
        const product = products?.find(p => p?.id === productIds?.[0]);
        setSelectedProduct(product);
      } else {
        setSelectedProduct(null);
      }
    }
  };

  const handleProductEdit = (productId, editValues) => {
    console.log('Editing product:', productId, editValues);
    // Here you would update the product in your state/database
  };

  const handleBulkAction = (action) => {
    console.log('Bulk action:', action, 'on products:', selectedProducts);
    // Handle bulk operations
  };

  const handleAddProduct = () => {
    setShowAddModal(true);
  };

  const handleSaveProduct = (productData) => {
    console.log('Saving new product:', productData);
    // Here you would save the product to your state/database
    setShowAddModal(false);
  };

  const handleBarcodeSearch = () => {
    console.log('Opening barcode scanner');
    // Implement barcode scanning functionality
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    console.log('Filters changed:', newFilters);
  };

  const handleLogout = () => {
    console.log('User logged out');
  };

  const handleDismissAlert = (alertId) => {
    setAlerts(prev => prev?.filter(alert => alert?.id !== alertId));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        user={user} 
        onLogout={handleLogout} 
        notifications={notifications}
      />
      
      <Sidebar 
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        user={user}
      />

      <main className={`transition-all duration-300 ${
        sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-80'
      } pt-16`}>
        <div className="p-6">
          <Breadcrumb />
          
          <AlertNotificationBar 
            alerts={alerts}
            onDismiss={handleDismissAlert}
          />

          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Gestión de Productos
            </h1>
            <p className="text-muted-foreground">
              Administra tu catálogo de productos con herramientas avanzadas de filtrado y edición
            </p>
          </div>

          <FilterBar
            onFilterChange={handleFilterChange}
            onAddProduct={handleAddProduct}
            onBarcodeSearch={handleBarcodeSearch}
          />

          <div className="grid grid-cols-12 gap-6 h-[calc(100vh-280px)]">
            {/* Category Sidebar */}
            <div className="col-span-12 lg:col-span-2">
              <CategorySidebar
                categories={categories}
                selectedCategory={selectedCategory}
                onCategorySelect={handleCategorySelect}
                onAddCategory={() => console.log('Add category')}
              />
            </div>

            {/* Product Grid */}
            <div className={`col-span-12 ${selectedProduct ? 'lg:col-span-6' : 'lg:col-span-10'}`}>
              <ProductGrid
                products={products}
                selectedProducts={selectedProducts}
                onProductSelect={handleProductSelect}
                onProductEdit={handleProductEdit}
                onBulkAction={handleBulkAction}
              />
            </div>

            {/* Product Detail Panel */}
            {selectedProduct && (
              <div className="col-span-12 lg:col-span-4">
                <ProductDetailPanel
                  product={selectedProduct}
                  onClose={() => setSelectedProduct(null)}
                  onEdit={(product) => console.log('Edit product:', product)}
                  onDelete={(product) => console.log('Delete product:', product)}
                />
              </div>
            )}
          </div>
        </div>
      </main>

      <AddProductModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleSaveProduct}
      />
    </div>
  );
};

export default ProductManagementInterface;
import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CategoryTree = ({ isCollapsed = false }) => {
  const [expandedCategories, setExpandedCategories] = useState(['electronics', 'clothing']);

  const categories = [
    {
      id: 'electronics',
      name: 'Electrónicos',
      icon: 'Smartphone',
      count: 1247,
      alerts: 8,
      children: [
        { id: 'smartphones', name: 'Smartphones', count: 456, alerts: 3 },
        { id: 'laptops', name: 'Laptops', count: 234, alerts: 2 },
        { id: 'tablets', name: 'Tablets', count: 189, alerts: 1 },
        { id: 'accessories', name: 'Accesorios', count: 368, alerts: 2 }
      ]
    },
    {
      id: 'clothing',
      name: 'Ropa',
      icon: 'Shirt',
      count: 2156,
      alerts: 15,
      children: [
        { id: 'mens', name: 'Hombre', count: 890, alerts: 6 },
        { id: 'womens', name: 'Mujer', count: 1024, alerts: 7 },
        { id: 'kids', name: 'Niños', count: 242, alerts: 2 }
      ]
    },
    {
      id: 'home',
      name: 'Hogar',
      icon: 'Home',
      count: 834,
      alerts: 4,
      children: [
        { id: 'furniture', name: 'Muebles', count: 345, alerts: 2 },
        { id: 'decor', name: 'Decoración', count: 289, alerts: 1 },
        { id: 'appliances', name: 'Electrodomésticos', count: 200, alerts: 1 }
      ]
    },
    {
      id: 'sports',
      name: 'Deportes',
      icon: 'Dumbbell',
      count: 567,
      alerts: 3,
      children: [
        { id: 'fitness', name: 'Fitness', count: 234, alerts: 1 },
        { id: 'outdoor', name: 'Exterior', count: 189, alerts: 1 },
        { id: 'team-sports', name: 'Deportes de Equipo', count: 144, alerts: 1 }
      ]
    },
    {
      id: 'books',
      name: 'Libros',
      icon: 'Book',
      count: 1289,
      alerts: 2,
      children: [
        { id: 'fiction', name: 'Ficción', count: 567, alerts: 1 },
        { id: 'non-fiction', name: 'No Ficción', count: 445, alerts: 0 },
        { id: 'textbooks', name: 'Libros de Texto', count: 277, alerts: 1 }
      ]
    }
  ];

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => 
      prev?.includes(categoryId) 
        ? prev?.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  if (isCollapsed) {
    return (
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="space-y-3">
          {categories?.map((category) => (
            <div 
              key={category?.id}
              className="flex flex-col items-center p-2 rounded-lg hover:bg-muted transition-micro cursor-pointer"
              title={category?.name}
            >
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mb-1">
                <Icon name={category?.icon} size={16} className="text-primary" />
              </div>
              <span className="text-xs font-medium text-foreground">{category?.count}</span>
              {category?.alerts > 0 && (
                <div className="w-2 h-2 bg-warning rounded-full mt-1" />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Categorías</h3>
        <Button variant="ghost" size="icon">
          <Icon name="Search" size={16} />
        </Button>
      </div>
      <div className="space-y-2">
        {categories?.map((category) => {
          const isExpanded = expandedCategories?.includes(category?.id);
          
          return (
            <div key={category?.id}>
              <div 
                className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-micro cursor-pointer"
                onClick={() => toggleCategory(category?.id)}
              >
                <div className="flex items-center space-x-3">
                  <Icon 
                    name={isExpanded ? 'ChevronDown' : 'ChevronRight'} 
                    size={16} 
                    className="text-muted-foreground"
                  />
                  <div className="w-6 h-6 bg-primary/10 rounded flex items-center justify-center">
                    <Icon name={category?.icon} size={14} className="text-primary" />
                  </div>
                  <span className="font-medium text-foreground text-sm">{category?.name}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-muted-foreground">{category?.count}</span>
                  {category?.alerts > 0 && (
                    <div className="w-5 h-5 bg-warning rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-white">{category?.alerts}</span>
                    </div>
                  )}
                </div>
              </div>
              {isExpanded && category?.children && (
                <div className="ml-8 mt-1 space-y-1">
                  {category?.children?.map((child) => (
                    <div 
                      key={child?.id}
                      className="flex items-center justify-between p-2 rounded hover:bg-muted/50 transition-micro cursor-pointer"
                    >
                      <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full" />
                        <span className="text-sm text-muted-foreground">{child?.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-muted-foreground">{child?.count}</span>
                        {child?.alerts > 0 && (
                          <div className="w-4 h-4 bg-warning rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-white">{child?.alerts}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-4 pt-4 border-t border-border">
        <Button variant="outline" size="sm" className="w-full">
          <Icon name="Plus" size={14} className="mr-2" />
          Gestionar Categorías
        </Button>
      </div>
    </div>
  );
};

export default CategoryTree;
import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CategorySidebar = ({ categories, selectedCategory, onCategorySelect, onAddCategory }) => {
  const [expandedCategories, setExpandedCategories] = useState(new Set(['all']));

  const toggleExpanded = (categoryId) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded?.has(categoryId)) {
      newExpanded?.delete(categoryId);
    } else {
      newExpanded?.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const renderCategory = (category, level = 0) => {
    const isExpanded = expandedCategories?.has(category?.id);
    const isSelected = selectedCategory === category?.id;
    const hasChildren = category?.children && category?.children?.length > 0;

    return (
      <div key={category?.id} className="mb-1">
        <div
          className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-micro ${
            isSelected
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          }`}
          style={{ paddingLeft: `${12 + level * 16}px` }}
          onClick={() => onCategorySelect(category?.id)}
        >
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            {hasChildren && (
              <Button
                variant="ghost"
                size="icon"
                className="w-4 h-4 p-0"
                onClick={(e) => {
                  e?.stopPropagation();
                  toggleExpanded(category?.id);
                }}
              >
                <Icon
                  name={isExpanded ? "ChevronDown" : "ChevronRight"}
                  size={12}
                />
              </Button>
            )}
            {!hasChildren && <div className="w-4" />}
            <Icon name={category?.icon || "Folder"} size={16} />
            <span className="text-sm font-medium truncate">{category?.name}</span>
          </div>
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            isSelected
              ? 'bg-primary-foreground/20 text-primary-foreground'
              : 'bg-muted text-muted-foreground'
          }`}>
            {category?.productCount}
          </span>
        </div>
        {hasChildren && isExpanded && (
          <div className="mt-1">
            {category?.children?.map(child => renderCategory(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full bg-card border-r border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Categorías</h2>
          <Button
            variant="outline"
            size="sm"
            iconName="Plus"
            iconPosition="left"
            onClick={onAddCategory}
          >
            Agregar
          </Button>
        </div>
        
        {/* All Products */}
        <div
          className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-micro mb-2 ${
            selectedCategory === 'all' ?'bg-primary text-primary-foreground' :'text-muted-foreground hover:text-foreground hover:bg-muted'
          }`}
          onClick={() => onCategorySelect('all')}
        >
          <div className="flex items-center space-x-2">
            <Icon name="Package" size={16} />
            <span className="text-sm font-medium">Todos los Productos</span>
          </div>
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            selectedCategory === 'all' ?'bg-primary-foreground/20 text-primary-foreground' :'bg-muted text-muted-foreground'
          }`}>
            2,847
          </span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          {categories?.map(category => renderCategory(category))}
        </div>
      </div>
      {/* Category Stats */}
      <div className="p-4 border-t border-border">
        <div className="bg-muted rounded-lg p-3">
          <div className="text-sm font-medium text-foreground mb-2">Estadísticas</div>
          <div className="space-y-1 text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>Categorías Activas</span>
              <span>24</span>
            </div>
            <div className="flex justify-between">
              <span>Sin Categoría</span>
              <span className="text-warning">12</span>
            </div>
            <div className="flex justify-between">
              <span>Última Actualización</span>
              <span>Hace 5 min</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategorySidebar;
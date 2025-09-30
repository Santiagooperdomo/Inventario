import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CategoryTree = ({ 
  categories, 
  selectedCategory, 
  onSelectCategory, 
  onDragStart, 
  onDragOver, 
  onDrop,
  expandedNodes,
  onToggleExpand,
  searchTerm,
  onBulkSelect,
  selectedCategories = []
}) => {
  const [draggedItem, setDraggedItem] = useState(null);
  const [dropTarget, setDropTarget] = useState(null);
  const treeRef = useRef(null);

  const handleDragStart = (e, category) => {
    setDraggedItem(category);
    e.dataTransfer.effectAllowed = 'move';
    e?.dataTransfer?.setData('text/plain', category?.id);
    onDragStart?.(category);
  };

  const handleDragOver = (e, category) => {
    e?.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDropTarget(category);
    onDragOver?.(e, category);
  };

  const handleDragLeave = (e) => {
    if (!e?.currentTarget?.contains(e?.relatedTarget)) {
      setDropTarget(null);
    }
  };

  const handleDrop = (e, targetCategory) => {
    e?.preventDefault();
    if (draggedItem && targetCategory && draggedItem?.id !== targetCategory?.id) {
      onDrop?.(draggedItem, targetCategory);
    }
    setDraggedItem(null);
    setDropTarget(null);
  };

  const handleKeyDown = (e, category) => {
    switch (e?.key) {
      case 'Enter': case' ':
        e?.preventDefault();
        onSelectCategory(category);
        break;
      case 'ArrowRight':
        if (!expandedNodes?.includes(category?.id) && category?.children?.length > 0) {
          onToggleExpand(category?.id);
        }
        break;
      case 'ArrowLeft':
        if (expandedNodes?.includes(category?.id)) {
          onToggleExpand(category?.id);
        }
        break;
    }
  };

  const getIndentLevel = (level) => {
    return Math.min(level, 5) * 20; // Max 5 levels deep
  };

  const getCategoryIcon = (category) => {
    if (category?.children?.length > 0) {
      return expandedNodes?.includes(category?.id) ? 'FolderOpen' : 'Folder';
    }
    return 'Tag';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-success';
      case 'inactive': return 'text-muted-foreground';
      case 'pending': return 'text-warning';
      default: return 'text-foreground';
    }
  };

  const filterCategories = (categories, searchTerm) => {
    if (!searchTerm) return categories;
    
    return categories?.filter(category => {
      const matchesSearch = category?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                           category?.description?.toLowerCase()?.includes(searchTerm?.toLowerCase());
      const hasMatchingChildren = category?.children?.some(child => 
        filterCategories([child], searchTerm)?.length > 0
      );
      return matchesSearch || hasMatchingChildren;
    });
  };

  const renderCategory = (category, level = 0) => {
    const isSelected = selectedCategory?.id === category?.id;
    const isExpanded = expandedNodes?.includes(category?.id);
    const hasChildren = category?.children?.length > 0;
    const isDragTarget = dropTarget?.id === category?.id;
    const isDragging = draggedItem?.id === category?.id;
    const isBulkSelected = selectedCategories?.includes(category?.id);

    const filteredChildren = filterCategories(category?.children || [], searchTerm);

    return (
      <div key={category?.id} className="select-none">
        <div
          className={`flex items-center space-x-2 py-2 px-3 rounded-lg cursor-pointer transition-micro group ${
            isSelected ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
          } ${isDragTarget ? 'bg-accent/20 border-2 border-accent border-dashed' : ''} ${
            isDragging ? 'opacity-50' : ''
          }`}
          style={{ paddingLeft: `${12 + getIndentLevel(level)}px` }}
          onClick={() => onSelectCategory(category)}
          onKeyDown={(e) => handleKeyDown(e, category)}
          tabIndex={0}
          role="treeitem"
          aria-expanded={hasChildren ? isExpanded : undefined}
          aria-selected={isSelected}
          draggable
          onDragStart={(e) => handleDragStart(e, category)}
          onDragOver={(e) => handleDragOver(e, category)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, category)}
        >
          {/* Bulk Selection Checkbox */}
          <input
            type="checkbox"
            checked={isBulkSelected}
            onChange={(e) => {
              e?.stopPropagation();
              onBulkSelect(category?.id, e?.target?.checked);
            }}
            className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
          />

          {/* Expand/Collapse Button */}
          <div className="w-4 h-4 flex items-center justify-center">
            {hasChildren && (
              <Button
                variant="ghost"
                size="icon"
                className="w-4 h-4 p-0"
                onClick={(e) => {
                  e?.stopPropagation();
                  onToggleExpand(category?.id);
                }}
              >
                <Icon 
                  name={isExpanded ? 'ChevronDown' : 'ChevronRight'} 
                  size={12} 
                />
              </Button>
            )}
          </div>

          {/* Category Icon */}
          <Icon 
            name={getCategoryIcon(category)} 
            size={16} 
            className={isSelected ? 'text-primary-foreground' : 'text-muted-foreground'}
          />

          {/* Category Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <span className={`font-medium truncate ${
                isSelected ? 'text-primary-foreground' : 'text-foreground'
              }`}>
                {category?.name}
              </span>
              <div className={`w-2 h-2 rounded-full ${getStatusColor(category?.status)}`} />
            </div>
            {category?.productCount !== undefined && (
              <div className={`text-xs ${
                isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground'
              }`}>
                {category?.productCount} productos
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="opacity-0 group-hover:opacity-100 transition-micro flex items-center space-x-1">
            {category?.hasRules && (
              <Icon 
                name="Zap" 
                size={14} 
                className={isSelected ? 'text-primary-foreground' : 'text-accent'}
                title="Reglas automáticas activas"
              />
            )}
            {category?.isExternal && (
              <Icon 
                name="ExternalLink" 
                size={14} 
                className={isSelected ? 'text-primary-foreground' : 'text-muted-foreground'}
                title="Categoría externa"
              />
            )}
            <Button
              variant="ghost"
              size="icon"
              className="w-6 h-6 p-0"
              onClick={(e) => {
                e?.stopPropagation();
                // Handle quick actions menu
              }}
            >
              <Icon name="MoreVertical" size={12} />
            </Button>
          </div>
        </div>
        {/* Children */}
        {hasChildren && isExpanded && (
          <div className="ml-2">
            {filteredChildren?.map(child => renderCategory(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const filteredCategories = filterCategories(categories, searchTerm);

  return (
    <div 
      ref={treeRef}
      className="h-full overflow-y-auto"
      role="tree"
      aria-label="Árbol de categorías"
    >
      {filteredCategories?.length > 0 ? (
        <div className="space-y-1 p-2">
          {filteredCategories?.map(category => renderCategory(category))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-center p-6">
          <Icon name="Search" size={48} className="text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            No se encontraron categorías
          </h3>
          <p className="text-muted-foreground">
            {searchTerm ? 
              `No hay categorías que coincidan con "${searchTerm}"` :
              'No hay categorías disponibles'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default CategoryTree;
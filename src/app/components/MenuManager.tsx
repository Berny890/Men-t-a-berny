import { useState, useMemo } from 'react';
import {
  DndContext, closestCenter, DragEndEvent, PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core';
import {
  SortableContext, verticalListSortingStrategy, useSortable, arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Plus, Pencil, Trash2, ChevronDown, ChevronRight,
  Check, X, GripVertical, Copy, Search,
} from 'lucide-react';
import { Category, Dish } from '../hooks/useMenuData';
import { formatCLP } from '../utils/formatCLP';

interface MenuManagerProps {
  categories: Category[];
  dishes: Dish[];
  onAddCategory: (name: string) => void;
  onUpdateCategory: (id: string, name: string) => void;
  onDeleteCategory: (id: string) => void;
  onAddDish: (categoryId: string, name: string, description: string, price: number) => void;
  onUpdateDish: (id: string, updates: Partial<Dish>) => void;
  onDeleteDish: (id: string) => void;
  onDuplicateDish: (id: string) => void;
  getDishesByCategory: (categoryId: string) => Dish[];
  onReorderCategories: (ordered: Category[]) => void;
  onReorderDishes: (categoryId: string, ordered: Dish[]) => void;
}

// ── Dish sortable row ──────────────────────────────────────────────────────────
const SortableDish = ({
  dish, onEdit, onDelete, onDuplicate,
}: {
  dish: Dish;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: dish.id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
        background: isDragging ? '#f5e6d3' : '#fffaf3',
      }}
      className="flex items-center gap-2 px-4 py-2.5"
    >
      {/* Grip */}
      <button {...attributes} {...listeners}
        className="cursor-grab active:cursor-grabbing p-1 rounded transition-all hover:opacity-60 shrink-0"
        style={{ color: '#c4a882', touchAction: 'none' }}>
        <GripVertical size={14} />
      </button>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-medium truncate" style={{ color: '#2c1810' }}>{dish.name}</span>
          <span className="text-sm font-bold shrink-0" style={{ color: '#8b2635' }}>{formatCLP(dish.price)} .-</span>
        </div>
        {dish.description && (
          <p className="text-xs truncate mt-0.5" style={{ color: '#7a5c4e' }}>{dish.description}</p>
        )}
      </div>

      {/* Acciones */}
      <div className="flex gap-1 shrink-0">
        <button onClick={onDuplicate} title="Duplicar plato"
          className="p-1.5 rounded-lg transition-all hover:opacity-80"
          style={{ background: '#f5e6d3', color: '#7a5c4e' }}>
          <Copy size={13} />
        </button>
        <button onClick={onEdit} title="Editar plato"
          className="p-1.5 rounded-lg transition-all hover:opacity-80"
          style={{ background: '#e8d5c0', color: '#2c1810' }}>
          <Pencil size={13} />
        </button>
        <button onClick={onDelete} title="Eliminar plato"
          className="p-1.5 rounded-lg transition-all hover:opacity-80"
          style={{ background: '#8b2635', color: '#fff' }}>
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
};

// ── Category sortable block ────────────────────────────────────────────────────
const SortableCategory = ({
  cat, isOpen, onToggle,
  isEditingCat, editingCatName, onStartEditCat, onSaveEditCat, onCancelEditCat, onChangeCatName,
  onDeleteCategory,
  dishes, onEditDish, onDeleteDish, onDuplicateDish,
  editingDishId, editingDish, onStartEditDish, onSaveEditDish, onCancelEditDish, onChangeEditDish,
  addingDishIn, newDish, onStartAddDish, onCancelAddDish, onChangeNewDish, onAddDish,
  onReorderDishes,
  searchQuery,
}: any) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: cat.id });

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDishDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = dishes.findIndex((d: Dish) => d.id === active.id);
    const newIndex = dishes.findIndex((d: Dish) => d.id === over.id);
    onReorderDishes(cat.id, arrayMove(dishes, oldIndex, newIndex));
  };

  const isSearching = searchQuery.length > 0;
  const visibleDishes = isSearching
    ? dishes.filter((d: Dish) => d.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : dishes;

  const showOpen = isOpen || isSearching;

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
        background: '#fffaf3',
        border: `1.5px solid ${showOpen ? '#8b2635' : '#e8d5c0'}`,
        borderRadius: '16px',
        overflow: 'hidden',
      }}
    >
      {/* Cabecera */}
      <div
        className="flex items-center gap-2 px-4 py-3.5 cursor-pointer select-none"
        style={{ background: showOpen ? '#f5e6d3' : '#fffaf3' }}
        onClick={() => !isEditingCat && onToggle(cat.id)}
      >
        {/* Grip categoría */}
        <button {...attributes} {...listeners}
          onClick={(e) => e.stopPropagation()}
          className="cursor-grab active:cursor-grabbing p-1 rounded transition-all hover:opacity-60 shrink-0"
          style={{ color: '#c4a882', touchAction: 'none' }}>
          <GripVertical size={15} />
        </button>

        {/* Chevron */}
        <span style={{ color: '#8b2635', flexShrink: 0 }}>
          {showOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </span>

        {/* Nombre */}
        {isEditingCat ? (
          <input
            type="text" value={editingCatName}
            onChange={(e) => onChangeCatName(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') onSaveEditCat(cat.id); if (e.key === 'Escape') onCancelEditCat(); }}
            autoFocus
            onClick={(e) => e.stopPropagation()}
            className="flex-1 px-3 py-1 rounded-lg text-sm font-semibold outline-none"
            style={{ background: '#fdf6ec', border: '1.5px solid #8b2635', color: '#2c1810' }}
          />
        ) : (
          <span className="flex-1 font-semibold text-sm" style={{ color: '#2c1810' }}>
            {cat.name}
            <span className="ml-2 font-normal text-xs" style={{ color: '#7a5c4e' }}>
              ({dishes.length} plato{dishes.length !== 1 ? 's' : ''})
            </span>
          </span>
        )}

        {/* Acciones categoría */}
        <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
          {isEditingCat ? (
            <>
              <button onClick={() => onSaveEditCat(cat.id)}
                className="p-1.5 rounded-lg transition-all hover:opacity-80"
                style={{ background: '#8b2635', color: '#fff' }}>
                <Check size={13} />
              </button>
              <button onClick={onCancelEditCat}
                className="p-1.5 rounded-lg transition-all hover:opacity-80"
                style={{ background: '#e8d5c0', color: '#2c1810' }}>
                <X size={13} />
              </button>
            </>
          ) : (
            <>
              <button onClick={() => onStartEditCat(cat.id, cat.name)}
                className="p-1.5 rounded-lg transition-all hover:opacity-80"
                style={{ background: '#e8d5c0', color: '#2c1810' }}
                title="Renombrar">
                <Pencil size={13} />
              </button>
              <button onClick={() => onDeleteCategory(cat.id, cat.name)}
                className="p-1.5 rounded-lg transition-all hover:opacity-80"
                style={{ background: '#8b2635', color: '#fff' }}
                title="Eliminar categoría">
                <Trash2 size={13} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Contenido */}
      {showOpen && (
        <div style={{ borderTop: '1px solid #e8d5c0' }}>
          {/* Platos */}
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDishDragEnd}>
            <SortableContext items={visibleDishes.map((d: Dish) => d.id)} strategy={verticalListSortingStrategy}>
              {visibleDishes.map((dish: Dish, idx: number) => (
                <div key={dish.id} style={{ borderBottom: idx < visibleDishes.length - 1 ? '1px solid #f0e4d4' : 'none' }}>
                  {editingDishId === dish.id ? (
                    /* Edición inline */
                    <div className="px-5 py-3 space-y-2" style={{ background: '#fdf6ec' }}>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs mb-1" style={{ color: '#7a5c4e' }}>Nombre</label>
                          <input type="text" value={editingDish.name ?? ''} autoFocus
                            onChange={(e) => onChangeEditDish({ name: e.target.value })}
                            className="w-full px-3 py-1.5 rounded-lg text-sm outline-none"
                            style={{ background: '#fffaf3', border: '1.5px solid #8b2635', color: '#2c1810' }} />
                        </div>
                        <div>
                          <label className="block text-xs mb-1" style={{ color: '#7a5c4e' }}>Precio ($)</label>
                          <input type="number" step="100" min="0" value={editingDish.price ?? 0}
                            onChange={(e) => onChangeEditDish({ price: parseInt(e.target.value) || 0 })}
                            className="w-full px-3 py-1.5 rounded-lg text-sm outline-none"
                            style={{ background: '#fffaf3', border: '1.5px solid #8b2635', color: '#2c1810' }} />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs mb-1" style={{ color: '#7a5c4e' }}>Descripción</label>
                        <input type="text" value={editingDish.description ?? ''}
                          onChange={(e) => onChangeEditDish({ description: e.target.value })}
                          onKeyDown={(e) => { if (e.key === 'Enter') onSaveEditDish(dish.id); if (e.key === 'Escape') onCancelEditDish(); }}
                          className="w-full px-3 py-1.5 rounded-lg text-sm outline-none"
                          style={{ background: '#fffaf3', border: '1px solid #e8d5c0', color: '#2c1810' }} />
                      </div>
                      <div className="flex gap-2 justify-end pt-1">
                        <button onClick={onCancelEditDish}
                          className="px-3 py-1.5 rounded-lg text-xs transition-all hover:opacity-80"
                          style={{ background: '#e8d5c0', color: '#2c1810' }}>Cancelar</button>
                        <button onClick={() => onSaveEditDish(dish.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-90"
                          style={{ background: '#8b2635', color: '#fff' }}>Guardar</button>
                      </div>
                    </div>
                  ) : (
                    <SortableDish
                      dish={dish}
                      onEdit={() => onStartEditDish(dish)}
                      onDelete={() => onDeleteDish(dish.id, dish.name)}
                      onDuplicate={() => onDuplicateDish(dish.id)}
                    />
                  )}
                </div>
              ))}
            </SortableContext>
          </DndContext>

          {visibleDishes.length === 0 && !isSearching && addingDishIn !== cat.id && (
            <p className="text-center py-5 text-xs" style={{ color: '#7a5c4e' }}>Sin platos aún.</p>
          )}
          {visibleDishes.length === 0 && isSearching && (
            <p className="text-center py-4 text-xs" style={{ color: '#7a5c4e' }}>Sin resultados en esta categoría.</p>
          )}

          {/* Formulario nuevo plato */}
          {!isSearching && (
            addingDishIn === cat.id ? (
              <div className="px-5 py-4 space-y-2" style={{ background: '#fdf6ec', borderTop: '1px solid #e8d5c0' }}>
                <p className="text-xs font-semibold mb-2" style={{ color: '#8b2635' }}>Nuevo plato</p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs mb-1" style={{ color: '#7a5c4e' }}>Nombre</label>
                    <input type="text" value={newDish.name} autoFocus
                      onChange={(e) => onChangeNewDish({ name: e.target.value })}
                      placeholder="Nombre del plato"
                      className="w-full px-3 py-1.5 rounded-lg text-sm outline-none"
                      style={{ background: '#fffaf3', border: '1.5px solid #8b2635', color: '#2c1810' }} />
                  </div>
                  <div>
                    <label className="block text-xs mb-1" style={{ color: '#7a5c4e' }}>Precio ($)</label>
                    <input type="number" step="100" min="0" value={newDish.price}
                      onChange={(e) => onChangeNewDish({ price: e.target.value })}
                      placeholder="15000"
                      className="w-full px-3 py-1.5 rounded-lg text-sm outline-none"
                      style={{ background: '#fffaf3', border: '1px solid #e8d5c0', color: '#2c1810' }} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs mb-1" style={{ color: '#7a5c4e' }}>Descripción</label>
                  <input type="text" value={newDish.description}
                    onChange={(e) => onChangeNewDish({ description: e.target.value })}
                    onKeyDown={(e) => e.key === 'Enter' && onAddDish(cat.id)}
                    placeholder="Descripción breve"
                    className="w-full px-3 py-1.5 rounded-lg text-sm outline-none"
                    style={{ background: '#fffaf3', border: '1px solid #e8d5c0', color: '#2c1810' }} />
                </div>
                <div className="flex gap-2 justify-end pt-1">
                  <button onClick={onCancelAddDish}
                    className="px-3 py-1.5 rounded-lg text-xs transition-all hover:opacity-80"
                    style={{ background: '#e8d5c0', color: '#2c1810' }}>Cancelar</button>
                  <button onClick={() => onAddDish(cat.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-90"
                    style={{ background: '#8b2635', color: '#fff' }}>Agregar plato</button>
                </div>
              </div>
            ) : (
              <div className="px-4 py-3" style={{ borderTop: dishes.length > 0 ? '1px dashed #e8d5c0' : 'none' }}>
                <button onClick={() => onStartAddDish(cat.id)}
                  className="flex items-center gap-2 text-xs font-medium transition-all hover:opacity-70"
                  style={{ color: '#8b2635' }}>
                  <Plus size={14} /> Agregar plato a {cat.name}
                </button>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

// ── Main component ─────────────────────────────────────────────────────────────
export const MenuManager = ({
  categories, dishes,
  onAddCategory, onUpdateCategory, onDeleteCategory,
  onAddDish, onUpdateDish, onDeleteDish, onDuplicateDish,
  getDishesByCategory, onReorderCategories, onReorderDishes,
}: MenuManagerProps) => {
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set());
  const [newCategoryName, setNewCategoryName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editingCatName, setEditingCatName] = useState('');

  const [addingDishIn, setAddingDishIn] = useState<string | null>(null);
  const [newDish, setNewDish] = useState({ name: '', description: '', price: '' });

  const [editingDishId, setEditingDishId] = useState<string | null>(null);
  const [editingDish, setEditingDish] = useState<Partial<Dish>>({});

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const toggle = (id: string) => setOpenCategories((prev) => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const handleCategoryDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = categories.findIndex((c) => c.id === active.id);
    const newIndex = categories.findIndex((c) => c.id === over.id);
    onReorderCategories(arrayMove(categories, oldIndex, newIndex));
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim()) { onAddCategory(newCategoryName.trim()); setNewCategoryName(''); }
  };

  const handleDeleteCategory = (id: string, name: string) => {
    const count = getDishesByCategory(id).length;
    const msg = count > 0
      ? `Esta categoría tiene ${count} plato${count > 1 ? 's' : ''}. Al eliminarla se borrarán también todos sus platos.\n\n¿Eliminar "${name}"?`
      : `¿Eliminar la categoría "${name}"?`;
    if (confirm(msg)) onDeleteCategory(id);
  };

  const handleAddDish = (categoryId: string) => {
    if (newDish.name.trim() && newDish.price) {
      const price = parseInt(newDish.price);
      if (price >= 0) {
        onAddDish(categoryId, newDish.name.trim(), newDish.description.trim(), price);
        setNewDish({ name: '', description: '', price: '' });
        setAddingDishIn(null);
      }
    }
  };

  const handleSaveDishEdit = (id: string) => {
    if (editingDish.name?.trim()) {
      onUpdateDish(id, { name: editingDish.name.trim(), description: editingDish.description ?? '', price: editingDish.price ?? 0 });
    }
    setEditingDishId(null);
  };

  // Número de categorías que coinciden con la búsqueda
  const matchingCategoryIds = useMemo(() => {
    if (!searchQuery) return new Set<string>();
    return new Set(
      dishes
        .filter((d) => d.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .map((d) => d.categoryId)
    );
  }, [searchQuery, dishes]);

  const visibleCategories = searchQuery
    ? categories.filter((c) => matchingCategoryIds.has(c.id))
    : categories;

  return (
    <div className="space-y-3">
      {/* Buscador */}
      <div className="flex items-center gap-3 px-4 py-3 rounded-2xl shadow-sm"
        style={{ background: '#fffaf3', border: '1px solid #e8d5c0' }}>
        <Search size={16} style={{ color: '#8b2635', flexShrink: 0 }} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar plato por nombre..."
          className="flex-1 text-sm outline-none bg-transparent"
          style={{ color: '#2c1810' }}
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} style={{ color: '#7a5c4e' }}>
            <X size={15} />
          </button>
        )}
      </div>

      {/* Nueva categoría */}
      {!searchQuery && (
        <div className="rounded-2xl overflow-hidden shadow-sm"
          style={{ background: '#fffaf3', border: '1px solid #e8d5c0' }}>
          <div className="px-5 py-3 flex items-center gap-2"
            style={{ background: '#f5e6d3', borderBottom: '1px solid #e8d5c0' }}>
            <Plus size={15} style={{ color: '#8b2635' }} />
            <span className="font-semibold text-sm" style={{ color: '#2c1810' }}>Nueva categoría</span>
          </div>
          <div className="p-4 flex gap-2">
            <input type="text" value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
              placeholder="Ej: PASTAS, POSTRES, ENSALADAS..."
              className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none"
              style={{ background: '#fdf6ec', border: '1.5px solid #e8d5c0', color: '#2c1810' }} />
            <button onClick={handleAddCategory}
              className="px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all hover:opacity-90"
              style={{ background: '#8b2635', color: '#fff' }}>
              <Plus size={14} /> Agregar
            </button>
          </div>
        </div>
      )}

      {/* Resultados búsqueda */}
      {searchQuery && (
        <p className="text-xs px-1" style={{ color: '#7a5c4e' }}>
          {dishes.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase())).length} resultado(s) para "{searchQuery}"
        </p>
      )}

      {visibleCategories.length === 0 && searchQuery && (
        <p className="text-center py-10 text-sm" style={{ color: '#7a5c4e' }}>
          Sin resultados para "{searchQuery}"
        </p>
      )}

      {visibleCategories.length === 0 && !searchQuery && (
        <p className="text-center py-10 text-sm" style={{ color: '#7a5c4e' }}>
          No hay categorías. ¡Crea la primera!
        </p>
      )}

      {/* Acordeón con DnD de categorías */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleCategoryDragEnd}>
        <SortableContext items={visibleCategories.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {visibleCategories.map((cat) => {
              const catDishes = getDishesByCategory(cat.id);
              return (
                <SortableCategory
                  key={cat.id}
                  cat={cat}
                  dishes={catDishes}
                  isOpen={openCategories.has(cat.id)}
                  onToggle={toggle}
                  isEditingCat={editingCatId === cat.id}
                  editingCatName={editingCatName}
                  onStartEditCat={(id: string, name: string) => { setEditingCatId(id); setEditingCatName(name); }}
                  onSaveEditCat={(id: string) => { if (editingCatName.trim()) onUpdateCategory(id, editingCatName.trim()); setEditingCatId(null); }}
                  onCancelEditCat={() => setEditingCatId(null)}
                  onChangeCatName={setEditingCatName}
                  onDeleteCategory={handleDeleteCategory}
                  editingDishId={editingDishId}
                  editingDish={editingDish}
                  onStartEditDish={(dish: Dish) => { setEditingDishId(dish.id); setEditingDish({ name: dish.name, description: dish.description, price: dish.price }); }}
                  onSaveEditDish={handleSaveDishEdit}
                  onCancelEditDish={() => setEditingDishId(null)}
                  onChangeEditDish={(u: Partial<Dish>) => setEditingDish((prev) => ({ ...prev, ...u }))}
                  onDeleteDish={(id: string, name: string) => { if (confirm(`¿Eliminar el plato "${name}"?`)) onDeleteDish(id); }}
                  onDuplicateDish={onDuplicateDish}
                  addingDishIn={addingDishIn}
                  newDish={newDish}
                  onStartAddDish={(id: string) => { setAddingDishIn(id); setNewDish({ name: '', description: '', price: '' }); }}
                  onCancelAddDish={() => setAddingDishIn(null)}
                  onChangeNewDish={(u: any) => setNewDish((prev) => ({ ...prev, ...u }))}
                  onAddDish={handleAddDish}
                  onReorderDishes={onReorderDishes}
                  searchQuery={searchQuery}
                />
              );
            })}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

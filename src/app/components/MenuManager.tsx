import { useState } from 'react';
import { Plus, Pencil, Trash2, ChevronDown, ChevronRight, UtensilsCrossed, Tag, Check, X } from 'lucide-react';
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
  getDishesByCategory: (categoryId: string) => Dish[];
}

interface NewDishForm {
  name: string;
  description: string;
  price: string;
}

export const MenuManager = ({
  categories, getDishesByCategory,
  onAddCategory, onUpdateCategory, onDeleteCategory,
  onAddDish, onUpdateDish, onDeleteDish,
}: MenuManagerProps) => {
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set());
  const [newCategoryName, setNewCategoryName] = useState('');

  // Edición inline categoría
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editingCatName, setEditingCatName] = useState('');

  // Formulario nuevo plato por categoría
  const [addingDishIn, setAddingDishIn] = useState<string | null>(null);
  const [newDish, setNewDish] = useState<NewDishForm>({ name: '', description: '', price: '' });

  // Edición inline plato
  const [editingDishId, setEditingDishId] = useState<string | null>(null);
  const [editingDish, setEditingDish] = useState<Partial<Dish>>({});

  const toggle = (id: string) => {
    setOpenCategories((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      onAddCategory(newCategoryName.trim());
      setNewCategoryName('');
    }
  };

  const handleDeleteCategory = (id: string, name: string) => {
    const count = getDishesByCategory(id).length;
    const msg = count > 0
      ? `Esta categoría tiene ${count} plato${count > 1 ? 's' : ''}. Al eliminarla se borrarán también todos sus platos.\n\n¿Eliminar "${name}"?`
      : `¿Eliminar la categoría "${name}"?`;
    if (confirm(msg)) onDeleteCategory(id);
  };

  const handleSaveCatEdit = (id: string) => {
    if (editingCatName.trim()) {
      onUpdateCategory(id, editingCatName.trim());
    }
    setEditingCatId(null);
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

  const handleStartEditDish = (dish: Dish) => {
    setEditingDishId(dish.id);
    setEditingDish({ name: dish.name, description: dish.description, price: dish.price });
  };

  const handleSaveDishEdit = (id: string) => {
    if (editingDish.name?.trim()) {
      onUpdateDish(id, {
        name: editingDish.name.trim(),
        description: editingDish.description ?? '',
        price: editingDish.price ?? 0,
      });
    }
    setEditingDishId(null);
  };

  const handleDeleteDish = (id: string, name: string) => {
    if (confirm(`¿Eliminar el plato "${name}"?`)) onDeleteDish(id);
  };

  return (
    <div className="space-y-3">
      {/* Formulario nueva categoría */}
      <div className="rounded-2xl overflow-hidden shadow-sm" style={{ background: '#fffaf3', border: '1px solid #e8d5c0' }}>
        <div className="px-6 py-4 flex items-center gap-2" style={{ background: '#f5e6d3', borderBottom: '1px solid #e8d5c0' }}>
          <Tag size={16} style={{ color: '#8b2635' }} />
          <span className="font-semibold text-sm" style={{ color: '#2c1810' }}>Nueva categoría</span>
        </div>
        <div className="p-4 flex gap-2">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
            placeholder="Ej: PASTAS, POSTRES, ENSALADAS..."
            className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none"
            style={{ background: '#fdf6ec', border: '1.5px solid #e8d5c0', color: '#2c1810' }}
          />
          <button
            onClick={handleAddCategory}
            className="px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all hover:opacity-90"
            style={{ background: '#8b2635', color: '#fff' }}
          >
            <Plus size={15} /> Agregar
          </button>
        </div>
      </div>

      {categories.length === 0 && (
        <p className="text-center py-10 text-sm" style={{ color: '#7a5c4e' }}>
          No hay categorías. ¡Crea la primera para empezar!
        </p>
      )}

      {/* Acordeón de categorías */}
      {categories.map((cat) => {
        const catDishes = getDishesByCategory(cat.id);
        const isOpen = openCategories.has(cat.id);
        const isEditingCat = editingCatId === cat.id;

        return (
          <div key={cat.id} className="rounded-2xl overflow-hidden shadow-sm transition-all"
            style={{ background: '#fffaf3', border: `1.5px solid ${isOpen ? '#8b2635' : '#e8d5c0'}` }}>

            {/* Cabecera categoría */}
            <div
              className="flex items-center gap-3 px-5 py-4 cursor-pointer select-none transition-all"
              style={{ background: isOpen ? '#f5e6d3' : '#fffaf3' }}
              onClick={() => !isEditingCat && toggle(cat.id)}
            >
              {/* Chevron */}
              <span style={{ color: '#8b2635', flexShrink: 0 }}>
                {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              </span>

              {/* Nombre categoría (editable inline) */}
              {isEditingCat ? (
                <input
                  type="text"
                  value={editingCatName}
                  onChange={(e) => setEditingCatName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveCatEdit(cat.id);
                    if (e.key === 'Escape') setEditingCatId(null);
                  }}
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 px-3 py-1 rounded-lg text-sm font-semibold outline-none"
                  style={{ background: '#fdf6ec', border: '1.5px solid #8b2635', color: '#2c1810' }}
                />
              ) : (
                <span className="flex-1 font-semibold text-sm" style={{ color: '#2c1810' }}>
                  {cat.name}
                  <span className="ml-2 font-normal text-xs" style={{ color: '#7a5c4e' }}>
                    ({catDishes.length} plato{catDishes.length !== 1 ? 's' : ''})
                  </span>
                </span>
              )}

              {/* Acciones categoría */}
              <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
                {isEditingCat ? (
                  <>
                    <button
                      onClick={() => handleSaveCatEdit(cat.id)}
                      className="p-1.5 rounded-lg transition-all hover:opacity-80"
                      style={{ background: '#8b2635', color: '#fff' }}
                      title="Guardar"
                    >
                      <Check size={14} />
                    </button>
                    <button
                      onClick={() => setEditingCatId(null)}
                      className="p-1.5 rounded-lg transition-all hover:opacity-80"
                      style={{ background: '#e8d5c0', color: '#2c1810' }}
                      title="Cancelar"
                    >
                      <X size={14} />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => { setEditingCatId(cat.id); setEditingCatName(cat.name); }}
                      className="p-1.5 rounded-lg transition-all hover:opacity-80"
                      style={{ background: '#e8d5c0', color: '#2c1810' }}
                      title="Renombrar categoría"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(cat.id, cat.name)}
                      className="p-1.5 rounded-lg transition-all hover:opacity-80"
                      style={{ background: '#8b2635', color: '#fff' }}
                      title="Eliminar categoría"
                    >
                      <Trash2 size={14} />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Contenido desplegable */}
            {isOpen && (
              <div style={{ borderTop: '1px solid #e8d5c0' }}>

                {/* Lista de platos */}
                {catDishes.length === 0 && addingDishIn !== cat.id && (
                  <p className="text-center py-5 text-xs" style={{ color: '#7a5c4e' }}>
                    Sin platos aún. Agrega el primero.
                  </p>
                )}

                {catDishes.map((dish, idx) => {
                  const isEditingThis = editingDishId === dish.id;
                  return (
                    <div key={dish.id}
                      style={{ borderBottom: idx < catDishes.length - 1 ? '1px solid #f0e4d4' : 'none', background: '#fffaf3' }}>

                      {isEditingThis ? (
                        /* Fila edición inline plato */
                        <div className="px-5 py-3 space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-xs mb-1" style={{ color: '#7a5c4e' }}>Nombre</label>
                              <input
                                type="text"
                                value={editingDish.name ?? ''}
                                onChange={(e) => setEditingDish({ ...editingDish, name: e.target.value })}
                                autoFocus
                                className="w-full px-3 py-1.5 rounded-lg text-sm outline-none"
                                style={{ background: '#fdf6ec', border: '1.5px solid #8b2635', color: '#2c1810' }}
                              />
                            </div>
                            <div>
                              <label className="block text-xs mb-1" style={{ color: '#7a5c4e' }}>Precio ($)</label>
                              <input
                                type="number"
                                step="100"
                                min="0"
                                value={editingDish.price ?? 0}
                                onChange={(e) => setEditingDish({ ...editingDish, price: parseInt(e.target.value) || 0 })}
                                className="w-full px-3 py-1.5 rounded-lg text-sm outline-none"
                                style={{ background: '#fdf6ec', border: '1.5px solid #8b2635', color: '#2c1810' }}
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs mb-1" style={{ color: '#7a5c4e' }}>Descripción</label>
                            <input
                              type="text"
                              value={editingDish.description ?? ''}
                              onChange={(e) => setEditingDish({ ...editingDish, description: e.target.value })}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveDishEdit(dish.id);
                                if (e.key === 'Escape') setEditingDishId(null);
                              }}
                              className="w-full px-3 py-1.5 rounded-lg text-sm outline-none"
                              style={{ background: '#fdf6ec', border: '1px solid #e8d5c0', color: '#2c1810' }}
                            />
                          </div>
                          <div className="flex gap-2 justify-end pt-1">
                            <button
                              onClick={() => setEditingDishId(null)}
                              className="px-3 py-1.5 rounded-lg text-xs transition-all hover:opacity-80"
                              style={{ background: '#e8d5c0', color: '#2c1810' }}
                            >
                              Cancelar
                            </button>
                            <button
                              onClick={() => handleSaveDishEdit(dish.id)}
                              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-90"
                              style={{ background: '#8b2635', color: '#fff' }}
                            >
                              Guardar cambios
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Fila normal plato */
                        <div className="flex items-center gap-3 px-5 py-3">
                          <UtensilsCrossed size={14} style={{ color: '#c4a882', flexShrink: 0 }} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-baseline gap-2">
                              <span className="text-sm font-medium truncate" style={{ color: '#2c1810' }}>{dish.name}</span>
                              <span className="text-sm font-bold shrink-0" style={{ color: '#8b2635' }}>{formatCLP(dish.price)} .-</span>
                            </div>
                            {dish.description && (
                              <p className="text-xs truncate mt-0.5" style={{ color: '#7a5c4e' }}>{dish.description}</p>
                            )}
                          </div>
                          <div className="flex gap-1.5 shrink-0">
                            <button
                              onClick={() => handleStartEditDish(dish)}
                              className="p-1.5 rounded-lg transition-all hover:opacity-80"
                              style={{ background: '#e8d5c0', color: '#2c1810' }}
                              title="Editar plato"
                            >
                              <Pencil size={13} />
                            </button>
                            <button
                              onClick={() => handleDeleteDish(dish.id, dish.name)}
                              className="p-1.5 rounded-lg transition-all hover:opacity-80"
                              style={{ background: '#8b2635', color: '#fff' }}
                              title="Eliminar plato"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Formulario nuevo plato inline */}
                {addingDishIn === cat.id ? (
                  <div className="px-5 py-4 space-y-2" style={{ background: '#fdf6ec', borderTop: '1px solid #e8d5c0' }}>
                    <p className="text-xs font-semibold mb-2" style={{ color: '#8b2635' }}>Nuevo plato</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs mb-1" style={{ color: '#7a5c4e' }}>Nombre</label>
                        <input
                          type="text"
                          value={newDish.name}
                          onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
                          autoFocus
                          placeholder="Nombre del plato"
                          className="w-full px-3 py-1.5 rounded-lg text-sm outline-none"
                          style={{ background: '#fffaf3', border: '1.5px solid #8b2635', color: '#2c1810' }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs mb-1" style={{ color: '#7a5c4e' }}>Precio ($)</label>
                        <input
                          type="number"
                          step="100"
                          min="0"
                          value={newDish.price}
                          onChange={(e) => setNewDish({ ...newDish, price: e.target.value })}
                          placeholder="15000"
                          className="w-full px-3 py-1.5 rounded-lg text-sm outline-none"
                          style={{ background: '#fffaf3', border: '1.5px solid #e8d5c0', color: '#2c1810' }}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs mb-1" style={{ color: '#7a5c4e' }}>Descripción</label>
                      <input
                        type="text"
                        value={newDish.description}
                        onChange={(e) => setNewDish({ ...newDish, description: e.target.value })}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddDish(cat.id)}
                        placeholder="Descripción del plato"
                        className="w-full px-3 py-1.5 rounded-lg text-sm outline-none"
                        style={{ background: '#fffaf3', border: '1px solid #e8d5c0', color: '#2c1810' }}
                      />
                    </div>
                    <div className="flex gap-2 justify-end pt-1">
                      <button
                        onClick={() => { setAddingDishIn(null); setNewDish({ name: '', description: '', price: '' }); }}
                        className="px-3 py-1.5 rounded-lg text-xs transition-all hover:opacity-80"
                        style={{ background: '#e8d5c0', color: '#2c1810' }}
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={() => handleAddDish(cat.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-90"
                        style={{ background: '#8b2635', color: '#fff' }}
                      >
                        Agregar plato
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="px-5 py-3" style={{ borderTop: catDishes.length > 0 ? '1px dashed #e8d5c0' : 'none' }}>
                    <button
                      onClick={() => { setAddingDishIn(cat.id); setNewDish({ name: '', description: '', price: '' }); }}
                      className="flex items-center gap-2 text-xs font-medium transition-all hover:opacity-80"
                      style={{ color: '#8b2635' }}
                    >
                      <Plus size={14} /> Agregar plato a {cat.name}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

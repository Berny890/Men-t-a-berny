import { useState } from 'react';
import { Plus, Pencil, Trash2, UtensilsCrossed } from 'lucide-react';
import { Category, Dish } from '../hooks/useMenuData';
import { formatCLP } from '../utils/formatCLP';

interface DishManagerProps {
  categories: Category[];
  dishes: Dish[];
  onAdd: (categoryId: string, name: string, description: string, price: number) => void;
  onUpdate: (id: string, updates: Partial<Dish>) => void;
  onDelete: (id: string) => void;
  getDishesByCategory: (categoryId: string) => Dish[];
}

export const DishManager = ({ categories, onAdd, onUpdate, onDelete, getDishesByCategory }: DishManagerProps) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [newDish, setNewDish] = useState({ name: '', description: '', price: '' });
  const [editingDish, setEditingDish] = useState<Dish | null>(null);

  const handleAdd = () => {
    if (selectedCategoryId && newDish.name.trim() && newDish.description.trim() && newDish.price) {
      const price = parseInt(newDish.price);
      if (price >= 0) {
        onAdd(selectedCategoryId, newDish.name.trim(), newDish.description.trim(), price);
        setNewDish({ name: '', description: '', price: '' });
      }
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`¿Eliminar el plato "${name}"?`)) onDelete(id);
  };

  const selectedDishes = selectedCategoryId ? getDishesByCategory(selectedCategoryId) : [];

  return (
    <div className="rounded-2xl shadow-sm overflow-hidden" style={{ background: '#fffaf3', border: '1px solid #e8d5c0' }}>
      <div className="px-6 py-4 flex items-center gap-2" style={{ background: '#f5e6d3', borderBottom: '1px solid #e8d5c0' }}>
        <UtensilsCrossed size={18} style={{ color: '#8b2635' }} />
        <h2 className="font-semibold" style={{ color: '#2c1810' }}>Platos</h2>
      </div>

      <div className="p-6">
        {/* Selector categoría */}
        <div className="mb-5">
          <label className="block text-xs font-medium mb-1.5" style={{ color: '#7a5c4e' }}>Categoría</label>
          <select
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
            style={{ background: '#fdf6ec', border: '1.5px solid #e8d5c0', color: '#2c1810' }}
          >
            <option value="">-- Selecciona una categoría --</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        {selectedCategoryId && (
          <>
            {/* Formulario nuevo plato */}
            <div className="p-4 rounded-xl mb-5" style={{ background: '#fdf6ec', border: '1px solid #e8d5c0' }}>
              <h3 className="text-sm font-semibold mb-3" style={{ color: '#8b2635' }}>Nuevo plato</h3>
              <div className="grid gap-2.5 mb-3">
                <input type="text" value={newDish.name}
                  onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
                  placeholder="Nombre del plato"
                  className="px-4 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: '#fffaf3', border: '1.5px solid #e8d5c0', color: '#2c1810' }} />
                <input type="text" value={newDish.description}
                  onChange={(e) => setNewDish({ ...newDish, description: e.target.value })}
                  placeholder="Descripción"
                  className="px-4 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: '#fffaf3', border: '1.5px solid #e8d5c0', color: '#2c1810' }} />
                <input type="number" step="100" min="0" value={newDish.price}
                  onChange={(e) => setNewDish({ ...newDish, price: e.target.value })}
                  placeholder="Precio (ej: 15000)"
                  className="px-4 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: '#fffaf3', border: '1.5px solid #e8d5c0', color: '#2c1810' }} />
              </div>
              <button onClick={handleAdd}
                className="w-full py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all hover:opacity-90"
                style={{ background: '#8b2635', color: '#fff' }}>
                <Plus size={16} /> Agregar plato
              </button>
            </div>

            {/* Lista platos */}
            <div className="space-y-2">
              {selectedDishes.map((dish) => (
                <div key={dish.id} className="flex items-center gap-3 px-4 py-3 rounded-xl"
                  style={{ background: '#fdf6ec', border: '1px solid #e8d5c0' }}>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: '#2c1810' }}>{dish.name}</p>
                    <p className="text-xs truncate" style={{ color: '#7a5c4e' }}>{dish.description}</p>
                    <p className="text-sm font-bold mt-0.5" style={{ color: '#8b2635' }}>{formatCLP(dish.price)} .-</p>
                  </div>
                  <button onClick={() => setEditingDish({ ...dish })}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 shrink-0 transition-all hover:opacity-80"
                    style={{ background: '#e8d5c0', color: '#2c1810' }}>
                    <Pencil size={12} /> Editar
                  </button>
                  <button onClick={() => handleDelete(dish.id, dish.name)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 shrink-0 transition-all hover:opacity-80"
                    style={{ background: '#8b2635', color: '#fff' }}>
                    <Trash2 size={12} /> Eliminar
                  </button>
                </div>
              ))}
              {selectedDishes.length === 0 && (
                <p className="text-center py-6 text-sm" style={{ color: '#7a5c4e' }}>
                  No hay platos en esta categoría
                </p>
              )}
            </div>
          </>
        )}
      </div>

      {/* Modal edición */}
      {editingDish && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="rounded-2xl shadow-xl p-6 w-full max-w-sm" style={{ background: '#fffaf3', border: '1px solid #e8d5c0' }}>
            <h3 className="font-semibold mb-4" style={{ color: '#2c1810' }}>Editar plato</h3>
            <div className="grid gap-3 mb-4">
              <div>
                <label className="block text-xs mb-1" style={{ color: '#7a5c4e' }}>Nombre</label>
                <input type="text" value={editingDish.name}
                  onChange={(e) => setEditingDish({ ...editingDish, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: '#fdf6ec', border: '1.5px solid #e8d5c0', color: '#2c1810' }} />
              </div>
              <div>
                <label className="block text-xs mb-1" style={{ color: '#7a5c4e' }}>Descripción</label>
                <input type="text" value={editingDish.description}
                  onChange={(e) => setEditingDish({ ...editingDish, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: '#fdf6ec', border: '1.5px solid #e8d5c0', color: '#2c1810' }} />
              </div>
              <div>
                <label className="block text-xs mb-1" style={{ color: '#7a5c4e' }}>Precio</label>
                <input type="number" step="100" min="0" value={editingDish.price}
                  onChange={(e) => setEditingDish({ ...editingDish, price: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: '#fdf6ec', border: '1.5px solid #e8d5c0', color: '#2c1810' }} />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setEditingDish(null)}
                className="px-4 py-2 rounded-xl text-sm transition-all hover:opacity-80"
                style={{ background: '#e8d5c0', color: '#2c1810' }}>
                Cancelar
              </button>
              <button onClick={() => {
                if (editingDish.name.trim() && editingDish.description.trim()) {
                  onUpdate(editingDish.id, { name: editingDish.name.trim(), description: editingDish.description.trim(), price: editingDish.price });
                  setEditingDish(null);
                }
              }}
                className="px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-90"
                style={{ background: '#8b2635', color: '#fff' }}>
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

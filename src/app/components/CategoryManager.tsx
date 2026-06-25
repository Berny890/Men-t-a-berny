import { useState } from 'react';
import { Plus, Pencil, Trash2, Tag } from 'lucide-react';
import { Category } from '../hooks/useMenuData';

interface CategoryManagerProps {
  categories: Category[];
  onAdd: (name: string) => void;
  onUpdate: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  getDishesByCategory: (id: string) => { id: string }[];
}

export const CategoryManager = ({ categories, onAdd, onUpdate, onDelete, getDishesByCategory }: CategoryManagerProps) => {
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleAdd = () => {
    if (newName.trim()) {
      onAdd(newName.trim());
      setNewName('');
    }
  };

  const handleSaveEdit = () => {
    if (editingId && editingName.trim()) {
      onUpdate(editingId, editingName.trim());
      setEditingId(null);
      setEditingName('');
    }
  };

  const handleDelete = (id: string, name: string) => {
    const count = getDishesByCategory(id).length;
    const msg = count > 0
      ? `Esta categoría tiene ${count} plato${count > 1 ? 's' : ''}. Al eliminarla se borrarán también todos sus platos.\n\n¿Eliminar "${name}"?`
      : `¿Eliminar la categoría "${name}"?`;
    if (confirm(msg)) onDelete(id);
  };

  return (
    <div className="rounded-2xl shadow-sm overflow-hidden" style={{ background: '#fffaf3', border: '1px solid #e8d5c0' }}>
      <div className="px-6 py-4 flex items-center gap-2" style={{ background: '#f5e6d3', borderBottom: '1px solid #e8d5c0' }}>
        <Tag size={18} style={{ color: '#8b2635' }} />
        <h2 className="font-semibold" style={{ color: '#2c1810' }}>Categorías</h2>
      </div>

      <div className="p-6">
        {/* Crear */}
        <div className="flex gap-2 mb-5">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="Nueva categoría..."
            className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
            style={{ background: '#fdf6ec', border: '1.5px solid #e8d5c0', color: '#2c1810' }}
          />
          <button
            onClick={handleAdd}
            className="px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all hover:opacity-90"
            style={{ background: '#8b2635', color: '#fff' }}
          >
            <Plus size={16} />
            Crear
          </button>
        </div>

        {/* Lista */}
        <div className="space-y-2">
          {categories.map((cat) => {
            const count = getDishesByCategory(cat.id).length;
            return (
              <div key={cat.id} className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
                style={{ background: '#fdf6ec', border: '1px solid #e8d5c0' }}>
                <span className="flex-1 text-sm font-medium" style={{ color: '#2c1810' }}>
                  {cat.name}
                  <span className="ml-2 text-xs font-normal" style={{ color: '#7a5c4e' }}>
                    ({count} plato{count !== 1 ? 's' : ''})
                  </span>
                </span>
                <button
                  onClick={() => { setEditingId(cat.id); setEditingName(cat.name); }}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all hover:opacity-80"
                  style={{ background: '#e8d5c0', color: '#2c1810' }}
                >
                  <Pencil size={12} /> Editar
                </button>
                <button
                  onClick={() => handleDelete(cat.id, cat.name)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all hover:opacity-80"
                  style={{ background: '#8b2635', color: '#fff' }}
                >
                  <Trash2 size={12} /> Eliminar
                </button>
              </div>
            );
          })}
          {categories.length === 0 && (
            <p className="text-center py-6 text-sm" style={{ color: '#7a5c4e' }}>
              No hay categorías. ¡Crea la primera!
            </p>
          )}
        </div>
      </div>

      {/* Modal edición */}
      {editingId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="rounded-2xl shadow-xl p-6 w-full max-w-sm" style={{ background: '#fffaf3', border: '1px solid #e8d5c0' }}>
            <h3 className="font-semibold mb-4" style={{ color: '#2c1810' }}>Editar categoría</h3>
            <input
              type="text"
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
              autoFocus
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none mb-4"
              style={{ background: '#fdf6ec', border: '1.5px solid #e8d5c0', color: '#2c1810' }}
            />
            <div className="flex gap-2 justify-end">
              <button onClick={() => setEditingId(null)}
                className="px-4 py-2 rounded-xl text-sm transition-all hover:opacity-80"
                style={{ background: '#e8d5c0', color: '#2c1810' }}>
                Cancelar
              </button>
              <button onClick={handleSaveEdit}
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

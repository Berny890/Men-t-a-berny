import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Category } from '../hooks/useMenuData';

interface CategoryManagerProps {
  categories: Category[];
  onAdd: (name: string) => void;
  onUpdate: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  getDishesByCategory: (id: string) => { id: string }[];
}

export const CategoryManager = ({
  categories,
  onAdd,
  onUpdate,
  onDelete,
  getDishesByCategory,
}: CategoryManagerProps) => {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleAdd = () => {
    if (newCategoryName.trim()) {
      onAdd(newCategoryName.trim());
      setNewCategoryName('');
    }
  };

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setEditingName(category.name);
  };

  const handleSaveEdit = () => {
    if (editingId && editingName.trim()) {
      onUpdate(editingId, editingName.trim());
      setEditingId(null);
      setEditingName('');
    }
  };

  const handleDelete = (id: string, name: string) => {
    const dishCount = getDishesByCategory(id).length;
    const warning =
      dishCount > 0
        ? `Esta categoría tiene ${dishCount} plato${dishCount > 1 ? 's' : ''}. Al eliminarla se borrarán también todos sus platos.\n\n¿Está seguro de eliminar "${name}"?`
        : `¿Está seguro de eliminar la categoría "${name}"?`;
    if (confirm(warning)) {
      onDelete(id);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl mb-4">Gestión de Categorías</h2>
      
      {/* Crear categoría */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Nombre de la categoría"
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAdd}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus size={20} />
          Crear
        </button>
      </div>

      {/* Lista de categorías */}
      <div className="space-y-2">
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg"
          >
            <span className="flex-1">
              {category.name}
              <span className="ml-2 text-xs text-gray-400">
                ({getDishesByCategory(category.id).length} plato{getDishesByCategory(category.id).length !== 1 ? 's' : ''})
              </span>
            </span>
            <button
              onClick={() => handleEdit(category)}
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 flex items-center gap-2"
            >
              <Pencil size={16} />
              Editar
            </button>
            <button
              onClick={() => handleDelete(category.id, category.name)}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center gap-2"
            >
              <Trash2 size={16} />
              Eliminar
            </button>
          </div>
        ))}
        {categories.length === 0 && (
          <p className="text-gray-500 text-center py-4">No hay categorías creadas</p>
        )}
      </div>

      {/* Modal de edición */}
      {editingId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg mb-4">Editar Categoría</h3>
            <input
              type="text"
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setEditingId(null)}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

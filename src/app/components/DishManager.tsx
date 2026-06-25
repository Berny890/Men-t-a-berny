import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
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

export const DishManager = ({
  categories,
  onAdd,
  onUpdate,
  onDelete,
  getDishesByCategory,
}: DishManagerProps) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [newDish, setNewDish] = useState({
    name: '',
    description: '',
    price: '',
  });
  const [editingDish, setEditingDish] = useState<Dish | null>(null);

  const handleAdd = () => {
    if (selectedCategoryId && newDish.name.trim() && newDish.description.trim() && newDish.price) {
      const price = parseFloat(newDish.price);
      if (price >= 0) {
        onAdd(selectedCategoryId, newDish.name.trim(), newDish.description.trim(), price);
        setNewDish({ name: '', description: '', price: '' });
      }
    }
  };

  const handleEdit = (dish: Dish) => {
    setEditingDish({ ...dish });
  };

  const handleSaveEdit = () => {
    if (editingDish && editingDish.name.trim() && editingDish.description.trim()) {
      onUpdate(editingDish.id, {
        name: editingDish.name.trim(),
        description: editingDish.description.trim(),
        price: editingDish.price,
      });
      setEditingDish(null);
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`¿Está seguro de eliminar el plato "${name}"?`)) {
      onDelete(id);
    }
  };

  const selectedDishes = selectedCategoryId ? getDishesByCategory(selectedCategoryId) : [];

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl mb-4">Gestión de Platos</h2>

      {/* Selector de categoría */}
      <div className="mb-6">
        <label className="block mb-2 text-sm">Seleccionar Categoría</label>
        <select
          value={selectedCategoryId}
          onChange={(e) => setSelectedCategoryId(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">-- Seleccione una categoría --</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {selectedCategoryId && (
        <>
          {/* Crear plato */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="mb-3">Crear Nuevo Plato</h3>
            <div className="grid gap-3 mb-3">
              <input
                type="text"
                value={newDish.name}
                onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
                placeholder="Nombre del plato"
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                value={newDish.description}
                onChange={(e) => setNewDish({ ...newDish, description: e.target.value })}
                placeholder="Descripción"
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                step="100"
                min="0"
                value={newDish.price}
                onChange={(e) => setNewDish({ ...newDish, price: e.target.value })}
                placeholder="Precio (ej: 15000)"
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleAdd}
              className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              Crear Plato
            </button>
          </div>

          {/* Lista de platos */}
          <div className="space-y-3">
            <h3 className="mb-2">Platos en esta categoría</h3>
            {selectedDishes.map((dish) => (
              <div
                key={dish.id}
                className="p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h4>{dish.name}</h4>
                    <p className="text-sm text-gray-600">{dish.description}</p>
                    <p className="mt-1 text-blue-600">{formatCLP(dish.price)} .-</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(dish)}
                      className="px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 flex items-center gap-1 text-sm"
                    >
                      <Pencil size={14} />
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(dish.id, dish.name)}
                      className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center gap-1 text-sm"
                    >
                      <Trash2 size={14} />
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {selectedDishes.length === 0 && (
              <p className="text-gray-500 text-center py-4">No hay platos en esta categoría</p>
            )}
          </div>
        </>
      )}

      {/* Modal de edición */}
      {editingDish && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg mb-4">Editar Plato</h3>
            <div className="grid gap-3 mb-4">
              <div>
                <label className="block text-sm mb-1">Nombre</label>
                <input
                  type="text"
                  value={editingDish.name}
                  onChange={(e) => setEditingDish({ ...editingDish, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Descripción</label>
                <input
                  type="text"
                  value={editingDish.description}
                  onChange={(e) => setEditingDish({ ...editingDish, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Precio</label>
                <input
                  type="number"
                  step="100"
                  min="0"
                  value={editingDish.price}
                  onChange={(e) => setEditingDish({ ...editingDish, price: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setEditingDish(null)}
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

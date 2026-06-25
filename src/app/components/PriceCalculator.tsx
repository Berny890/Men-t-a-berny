import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Category, Dish, Ingredient } from '../hooks/useMenuData';
import { formatCLP, roundToHundred } from '../utils/formatCLP';

interface PriceCalculatorProps {
  categories: Category[];
  dishes: Dish[];
  getDishesByCategory: (categoryId: string) => Dish[];
  getDishById: (id: string) => Dish | undefined;
  onAddIngredient: (dishId: string, ingredient: Omit<Ingredient, 'id'>) => void;
  onUpdateIngredient: (dishId: string, ingredientId: string, updates: Partial<Ingredient>) => void;
  onDeleteIngredient: (dishId: string, ingredientId: string) => void;
  onUpdateDish: (id: string, updates: Partial<Dish>) => void;
}

export const PriceCalculator = ({
  categories,
  getDishesByCategory,
  getDishById,
  onAddIngredient,
  onUpdateIngredient,
  onDeleteIngredient,
  onUpdateDish,
}: PriceCalculatorProps) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [selectedDishId, setSelectedDishId] = useState('');
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);

  useEffect(() => {
    if (selectedDishId) {
      const dish = getDishById(selectedDishId);
      setSelectedDish(dish || null);
    } else {
      setSelectedDish(null);
    }
  }, [selectedDishId, getDishById]);

  const handleAddIngredient = () => {
    if (selectedDishId) {
      onAddIngredient(selectedDishId, {
        name: '',
        quantity: '',
        unitPrice: 0,
        subtotal: 0,
      });
    }
  };

  const handleUpdateIngredient = (ingredientId: string, field: keyof Ingredient, value: any) => {
    if (!selectedDishId || !selectedDish) return;

    const ingredient = selectedDish.ingredients.find(i => i.id === ingredientId);
    if (!ingredient) return;

    const updates: Partial<Ingredient> = { [field]: value };

    // El precio unitario ES el subtotal (lo que pagaste por esa cantidad completa)
    if (field === 'unitPrice') {
      const unitPrice = parseFloat(value) || 0;
      updates.subtotal = unitPrice;
    }

    onUpdateIngredient(selectedDishId, ingredientId, updates);
  };

  const handleDeleteIngredient = (ingredientId: string) => {
    if (selectedDishId && confirm('¿Eliminar este ingrediente?')) {
      onDeleteIngredient(selectedDishId, ingredientId);
    }
  };

  const handleMarginChange = (margin: number) => {
    if (selectedDishId) {
      onUpdateDish(selectedDishId, { margin });
    }
  };

  const handleDeliveryCostChange = (deliveryCost: number) => {
    if (selectedDishId) {
      onUpdateDish(selectedDishId, { deliveryCost });
    }
  };

  const handleApplySuggestedPrice = () => {
    if (selectedDishId && selectedDish) {
      const rounded = roundToHundred(calculateSuggestedPrice());
      if (confirm(`¿Actualizar el precio del plato a ${formatCLP(rounded)}?\n(Redondeado al 100 más cercano)`)) {
        onUpdateDish(selectedDishId, { price: rounded });
      }
    }
  };

  const calculateTotalCost = () => {
    if (!selectedDish) return 0;
    return selectedDish.ingredients.reduce((sum, ing) => sum + ing.subtotal, 0);
  };

  const calculateSuggestedPrice = () => {
    if (!selectedDish) return 0;
    const totalCost = calculateTotalCost();
    const deliveryCost = selectedDish.deliveryCost ?? 0;
    return (totalCost + deliveryCost) * (1 + selectedDish.margin / 100);
  };

  const categoryDishes = selectedCategoryId ? getDishesByCategory(selectedCategoryId) : [];

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl mb-4">Calculadora de Precios</h2>

      {/* Información de ayuda */}
      <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
        <h4 className="mb-2">Cómo usar la calculadora</h4>
        <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
          <li><strong>Cantidad:</strong> Ejemplo: "500g", "2 unidades", "1 litro"</li>
          <li><strong>Precio:</strong> Lo que pagó por esa cantidad completa</li>
          <li><strong>Delivery:</strong> Costo de envío que se suma al costo base</li>
          <li><strong>Margen:</strong> Porcentaje de ganancia sobre (ingredientes + delivery)</li>
          <li>El precio sugerido se calcula automáticamente</li>
        </ul>
      </div>

      {/* Selección de categoría */}
      <div className="mb-4">
        <label className="block mb-2 text-sm">Seleccionar Categoría</label>
        <select
          value={selectedCategoryId}
          onChange={(e) => {
            setSelectedCategoryId(e.target.value);
            setSelectedDishId('');
          }}
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

      {/* Selección de plato */}
      {selectedCategoryId && (
        <div className="mb-6">
          <label className="block mb-2 text-sm">Seleccionar Plato</label>
          <select
            value={selectedDishId}
            onChange={(e) => setSelectedDishId(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Seleccione un plato --</option>
            {categoryDishes.map((dish) => (
              <option key={dish.id} value={dish.id}>
                {dish.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Tabla de ingredientes */}
      {selectedDish && (
        <>
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3>Ingredientes</h3>
              <button
                onClick={handleAddIngredient}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <Plus size={16} />
                Agregar Ingrediente
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2 text-left">Ingrediente</th>
                    <th className="border p-2 text-left">Cantidad</th>
                    <th className="border p-2 text-left">Precio</th>
                    <th className="border p-2 text-left">Subtotal</th>
                    <th className="border p-2 w-16"></th>
                  </tr>
                </thead>
                <tbody>
                  {selectedDish.ingredients.map((ingredient) => (
                    <tr key={ingredient.id}>
                      <td className="border p-2">
                        <input
                          type="text"
                          value={ingredient.name}
                          onChange={(e) => handleUpdateIngredient(ingredient.id, 'name', e.target.value)}
                          placeholder="Nombre"
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="border p-2">
                        <input
                          type="text"
                          value={ingredient.quantity}
                          onChange={(e) => handleUpdateIngredient(ingredient.id, 'quantity', e.target.value)}
                          placeholder="Ej: 500g"
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="border p-2">
                        <input
                          type="number"
                          step="0.01"
                          value={ingredient.unitPrice}
                          onChange={(e) => handleUpdateIngredient(ingredient.id, 'unitPrice', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="border p-2">
                        {formatCLP(ingredient.subtotal)}
                      </td>
                      <td className="border p-2 text-center">
                        <button
                          onClick={() => handleDeleteIngredient(ingredient.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {selectedDish.ingredients.length === 0 && (
              <p className="text-gray-500 text-center py-4 border">
                No hay ingredientes. Agregue el primer ingrediente.
              </p>
            )}
          </div>

          {/* Cálculo de precio */}
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="mb-4">Cálculo de Precio</h3>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between items-center">
                <span>Costo Total de Ingredientes:</span>
                <span className="text-lg">{formatCLP(calculateTotalCost())}</span>
              </div>

              <div className="flex justify-between items-center">
                <span>Costo de Delivery ($):</span>
                <input
                  type="number"
                  step="100"
                  min="0"
                  value={selectedDish.deliveryCost ?? 0}
                  onChange={(e) => handleDeliveryCostChange(parseFloat(e.target.value) || 0)}
                  className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-between items-center text-sm text-gray-500 pl-2">
                <span>Subtotal (ingredientes + delivery):</span>
                <span>{formatCLP(calculateTotalCost() + (selectedDish.deliveryCost ?? 0))}</span>
              </div>

              <div className="flex justify-between items-center">
                <span>Margen de Utilidad (%):</span>
                <input
                  type="number"
                  step="1"
                  value={selectedDish.margin}
                  onChange={(e) => handleMarginChange(parseFloat(e.target.value) || 0)}
                  className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex justify-between items-center pt-3 border-t-2 border-blue-300">
                <div>
                  <span>Precio Sugerido</span>
                  <span className="ml-2 text-xs text-gray-400">(redondeado al 100)</span>
                </div>
                <span className="text-2xl text-blue-600">
                  {formatCLP(roundToHundred(calculateSuggestedPrice()))}
                </span>
              </div>

              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>Precio Actual del Plato:</span>
                <span>{formatCLP(selectedDish.price)}</span>
              </div>
            </div>

            <button
              onClick={handleApplySuggestedPrice}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Aplicar Precio Sugerido al Menú
            </button>
          </div>
        </>
      )}
    </div>
  );
};
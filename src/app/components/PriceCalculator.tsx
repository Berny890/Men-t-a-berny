import { useState, useEffect } from 'react';
import { Plus, Trash2, Calculator } from 'lucide-react';
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
  categories, getDishesByCategory, getDishById,
  onAddIngredient, onUpdateIngredient, onDeleteIngredient, onUpdateDish,
}: PriceCalculatorProps) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [selectedDishId, setSelectedDishId] = useState('');
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);

  useEffect(() => {
    setSelectedDish(selectedDishId ? getDishById(selectedDishId) || null : null);
  }, [selectedDishId, getDishById]);

  const handleAddIngredient = () => {
    if (selectedDishId) onAddIngredient(selectedDishId, { name: '', quantity: '', unitPrice: 0, subtotal: 0 });
  };

  const handleUpdateIngredient = (ingredientId: string, field: keyof Ingredient, value: any) => {
    if (!selectedDishId || !selectedDish) return;
    const updates: Partial<Ingredient> = { [field]: value };
    if (field === 'unitPrice') updates.subtotal = parseFloat(value) || 0;
    onUpdateIngredient(selectedDishId, ingredientId, updates);
  };

  const handleDeleteIngredient = (ingredientId: string) => {
    if (selectedDishId && confirm('¿Eliminar este ingrediente?'))
      onDeleteIngredient(selectedDishId, ingredientId);
  };

  const totalCost = selectedDish?.ingredients.reduce((s, i) => s + i.subtotal, 0) ?? 0;
  const deliveryCost = selectedDish?.deliveryCost ?? 0;
  const suggested = roundToHundred((totalCost + deliveryCost) * (1 + (selectedDish?.margin ?? 30) / 100));

  const categoryDishes = selectedCategoryId ? getDishesByCategory(selectedCategoryId) : [];

  return (
    <div className="rounded-2xl shadow-sm overflow-hidden" style={{ background: '#fffaf3', border: '1px solid #e8d5c0' }}>
      <div className="px-6 py-4 flex items-center gap-2" style={{ background: '#f5e6d3', borderBottom: '1px solid #e8d5c0' }}>
        <Calculator size={18} style={{ color: '#8b2635' }} />
        <h2 className="font-semibold" style={{ color: '#2c1810' }}>Calculadora de Precios</h2>
      </div>

      <div className="p-6">
        {/* Info */}
        <div className="p-4 rounded-xl mb-5 text-sm" style={{ background: '#fdf6ec', border: '1px solid #e8d5c0' }}>
          <ul className="space-y-1" style={{ color: '#7a5c4e' }}>
            <li><strong style={{ color: '#2c1810' }}>Cantidad:</strong> Ej: "500g", "2 unidades"</li>
            <li><strong style={{ color: '#2c1810' }}>Precio:</strong> Lo que pagaste por esa cantidad completa</li>
            <li><strong style={{ color: '#2c1810' }}>Delivery:</strong> Costo de envío sumado al costo base</li>
            <li><strong style={{ color: '#2c1810' }}>Margen:</strong> Ganancia sobre (ingredientes + delivery)</li>
          </ul>
        </div>

        {/* Selectores */}
        <div className="grid sm:grid-cols-2 gap-3 mb-5">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#7a5c4e' }}>Categoría</label>
            <select value={selectedCategoryId}
              onChange={(e) => { setSelectedCategoryId(e.target.value); setSelectedDishId(''); }}
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
              style={{ background: '#fdf6ec', border: '1.5px solid #e8d5c0', color: '#2c1810' }}>
              <option value="">-- Selecciona --</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          {selectedCategoryId && (
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#7a5c4e' }}>Plato</label>
              <select value={selectedDishId}
                onChange={(e) => setSelectedDishId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                style={{ background: '#fdf6ec', border: '1.5px solid #e8d5c0', color: '#2c1810' }}>
                <option value="">-- Selecciona --</option>
                {categoryDishes.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
          )}
        </div>

        {selectedDish && (
          <>
            {/* Tabla ingredientes */}
            <div className="mb-5">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-semibold" style={{ color: '#2c1810' }}>Ingredientes</h3>
                <button onClick={handleAddIngredient}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all hover:opacity-90"
                  style={{ background: '#8b2635', color: '#fff' }}>
                  <Plus size={13} /> Agregar
                </button>
              </div>

              <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid #e8d5c0' }}>
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ background: '#f5e6d3' }}>
                      <th className="px-3 py-2 text-left text-xs font-semibold" style={{ color: '#7a5c4e' }}>Ingrediente</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold" style={{ color: '#7a5c4e' }}>Cantidad</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold" style={{ color: '#7a5c4e' }}>Precio $</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold" style={{ color: '#7a5c4e' }}>Subtotal</th>
                      <th className="px-3 py-2 w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedDish.ingredients.map((ing, i) => (
                      <tr key={ing.id} style={{ background: i % 2 === 0 ? '#fffaf3' : '#fdf6ec' }}>
                        <td className="px-3 py-2">
                          <input type="text" value={ing.name}
                            onChange={(e) => handleUpdateIngredient(ing.id, 'name', e.target.value)}
                            placeholder="Nombre"
                            className="w-full px-2 py-1 rounded-lg text-xs outline-none"
                            style={{ background: '#fffaf3', border: '1px solid #e8d5c0', color: '#2c1810' }} />
                        </td>
                        <td className="px-3 py-2">
                          <input type="text" value={ing.quantity}
                            onChange={(e) => handleUpdateIngredient(ing.id, 'quantity', e.target.value)}
                            placeholder="Ej: 500g"
                            className="w-full px-2 py-1 rounded-lg text-xs outline-none"
                            style={{ background: '#fffaf3', border: '1px solid #e8d5c0', color: '#2c1810' }} />
                        </td>
                        <td className="px-3 py-2">
                          <input type="number" step="1" value={ing.unitPrice}
                            onChange={(e) => handleUpdateIngredient(ing.id, 'unitPrice', e.target.value)}
                            className="w-24 px-2 py-1 rounded-lg text-xs outline-none"
                            style={{ background: '#fffaf3', border: '1px solid #e8d5c0', color: '#2c1810' }} />
                        </td>
                        <td className="px-3 py-2 text-xs font-medium" style={{ color: '#8b2635' }}>
                          {formatCLP(ing.subtotal)}
                        </td>
                        <td className="px-3 py-2 text-center">
                          <button onClick={() => handleDeleteIngredient(ing.id)}
                            className="transition-all hover:opacity-70" style={{ color: '#8b2635' }}>
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {selectedDish.ingredients.length === 0 && (
                  <p className="text-center py-4 text-sm" style={{ color: '#7a5c4e' }}>
                    Sin ingredientes. Agrega el primero.
                  </p>
                )}
              </div>
            </div>

            {/* Panel cálculo */}
            <div className="rounded-xl p-5" style={{ background: '#f5e6d3', border: '1px solid #e8d5c0' }}>
              <h3 className="text-sm font-semibold mb-4" style={{ color: '#2c1810' }}>Cálculo de precio</h3>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center text-sm">
                  <span style={{ color: '#7a5c4e' }}>Costo ingredientes</span>
                  <span className="font-medium" style={{ color: '#2c1810' }}>{formatCLP(totalCost)}</span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span style={{ color: '#7a5c4e' }}>Costo delivery</span>
                  <input type="number" step="100" min="0" value={deliveryCost}
                    onChange={(e) => onUpdateDish(selectedDishId, { deliveryCost: parseFloat(e.target.value) || 0 })}
                    className="w-24 px-2 py-1 rounded-lg text-xs text-right outline-none"
                    style={{ background: '#fffaf3', border: '1px solid #e8d5c0', color: '#2c1810' }} />
                </div>

                <div className="flex justify-between items-center text-sm" style={{ color: '#7a5c4e' }}>
                  <span>Subtotal</span>
                  <span>{formatCLP(totalCost + deliveryCost)}</span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span style={{ color: '#7a5c4e' }}>Margen de utilidad (%)</span>
                  <input type="number" step="1" value={selectedDish.margin}
                    onChange={(e) => onUpdateDish(selectedDishId, { margin: parseFloat(e.target.value) || 0 })}
                    className="w-20 px-2 py-1 rounded-lg text-xs text-right outline-none"
                    style={{ background: '#fffaf3', border: '1px solid #e8d5c0', color: '#2c1810' }} />
                </div>

                <div className="flex justify-between items-center pt-3" style={{ borderTop: '1.5px solid #e8d5c0' }}>
                  <div>
                    <span className="font-semibold" style={{ color: '#2c1810' }}>Precio sugerido</span>
                    <span className="ml-2 text-xs" style={{ color: '#7a5c4e' }}>(al 100 más cercano)</span>
                  </div>
                  <span className="text-2xl font-bold" style={{ color: '#8b2635' }}>{formatCLP(suggested)}</span>
                </div>

                <div className="flex justify-between items-center text-xs" style={{ color: '#7a5c4e' }}>
                  <span>Precio actual del plato</span>
                  <span>{formatCLP(selectedDish.price)}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  if (confirm(`¿Actualizar precio a ${formatCLP(suggested)}?\n(Redondeado al 100 más cercano)`))
                    onUpdateDish(selectedDishId, { price: suggested });
                }}
                className="w-full py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                style={{ background: '#8b2635', color: '#fff' }}>
                Aplicar precio sugerido al menú
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

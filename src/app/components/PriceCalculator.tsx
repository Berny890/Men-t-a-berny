import { useState, useEffect } from 'react';
import { Plus, Trash2, Calculator, Info } from 'lucide-react';
import { Category, Dish, Ingredient, FixedCost } from '../hooks/useMenuData';
import { formatCLP, roundToHundred } from '../utils/formatCLP';

interface Props {
  categories: Category[];
  dishes: Dish[];
  fixedCosts: FixedCost[];
  getDishesByCategory: (categoryId: string) => Dish[];
  getDishById: (id: string) => Dish | undefined;
  onAddIngredient: (dishId: string, ingredient: Omit<Ingredient, 'id'>) => void;
  onUpdateIngredient: (dishId: string, ingredientId: string, updates: Partial<Ingredient>) => void;
  onDeleteIngredient: (dishId: string, ingredientId: string) => void;
  onUpdateDish: (id: string, updates: Partial<Dish>) => void;
}

export const PriceCalculator = ({
  categories, dishes, fixedCosts, getDishesByCategory, getDishById,
  onAddIngredient, onUpdateIngredient, onDeleteIngredient, onUpdateDish,
}: Props) => {
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

  // --- Cálculos ---
  const totalFixedMonthly = fixedCosts.reduce((s, f) => s + f.amount, 0);
  const totalMonthlyBatches = dishes.reduce((s, d) => s + (d.monthlyBatches || 0), 0);

  // Costo fijo asignado a este plato por batch
  // Proporcional: (batches_este_plato / total_batches) * total_fijos
  const fixedCostPerBatch = (() => {
    if (!selectedDish || totalMonthlyBatches === 0 || totalFixedMonthly === 0) return 0;
    const proportion = (selectedDish.monthlyBatches || 0) / totalMonthlyBatches;
    return proportion > 0 ? (proportion * totalFixedMonthly) / (selectedDish.monthlyBatches || 1) : 0;
  })();

  const variableCost = selectedDish?.ingredients.reduce((s, i) => s + i.subtotal, 0) ?? 0;
  const deliveryCost = selectedDish?.deliveryCost ?? 0;
  const totalCost = variableCost + fixedCostPerBatch + deliveryCost;
  const margin = selectedDish?.margin ?? 30;
  const suggested = roundToHundred(totalCost * (1 + margin / 100));
  const currentPrice = selectedDish?.price ?? 0;

  // Punto de equilibrio: cuántos batches necesita vender para cubrir sus fijos asignados
  const breakEven = (() => {
    if (!selectedDish || totalMonthlyBatches === 0) return null;
    const fixedAllocatedMonthly = (selectedDish.monthlyBatches / totalMonthlyBatches) * totalFixedMonthly;
    const contributionPerBatch = currentPrice - variableCost - deliveryCost;
    if (contributionPerBatch <= 0) return null;
    return Math.ceil(fixedAllocatedMonthly / contributionPerBatch);
  })();

  const categoryDishes = selectedCategoryId ? getDishesByCategory(selectedCategoryId) : [];

  const hasMissingBatches = fixedCosts.length > 0 && totalMonthlyBatches === 0;

  return (
    <div className="rounded-2xl shadow-sm overflow-hidden" style={{ background: '#fffaf3', border: '1px solid #e8d5c0' }}>
      <div className="px-6 py-4 flex items-center gap-2" style={{ background: '#f5e6d3', borderBottom: '1px solid #e8d5c0' }}>
        <Calculator size={18} style={{ color: '#8b2635' }} />
        <h2 className="font-semibold" style={{ color: '#2c1810' }}>Calculadora de Precios</h2>
      </div>

      <div className="p-6">

        {/* Aviso costos fijos */}
        {fixedCosts.length === 0 && (
          <div className="flex gap-3 p-4 rounded-xl mb-5 text-sm" style={{ background: '#fdf6ec', border: '1.5px solid #e8d5c0' }}>
            <Info size={16} className="shrink-0 mt-0.5" style={{ color: '#8b2635' }} />
            <p style={{ color: '#7a5c4e' }}>
              <strong style={{ color: '#2c1810' }}>Aún no tienes costos fijos registrados.</strong> Sin ellos el precio sugerido no incluye gas, luz, personal ni otros gastos fijos. Ve a la pestaña <strong>Costos Fijos</strong> para agregarlos.
            </p>
          </div>
        )}

        {hasMissingBatches && (
          <div className="flex gap-3 p-4 rounded-xl mb-5 text-sm" style={{ background: '#fff8e1', border: '1.5px solid #f5c842' }}>
            <Info size={16} className="shrink-0 mt-0.5" style={{ color: '#b8860b' }} />
            <p style={{ color: '#7a5c00' }}>
              Tienes costos fijos registrados pero ningún plato tiene <strong>batches mensuales estimados</strong>. Ingresa cuántas veces preparas cada plato al mes para que el costo fijo se distribuya correctamente.
            </p>
          </div>
        )}

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
              <select value={selectedDishId} onChange={(e) => setSelectedDishId(e.target.value)}
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
            {/* Batches mensuales */}
            <div className="flex items-center justify-between p-4 rounded-xl mb-5"
              style={{ background: '#fdf6ec', border: '1.5px solid #e8d5c0' }}>
              <div>
                <p className="text-sm font-medium" style={{ color: '#2c1810' }}>¿Cuántas veces preparas este plato al mes?</p>
                <p className="text-xs mt-0.5" style={{ color: '#7a5c4e' }}>Necesario para distribuir los costos fijos</p>
              </div>
              <input type="number" min="0" step="1" value={selectedDish.monthlyBatches || ''}
                onChange={(e) => onUpdateDish(selectedDishId, { monthlyBatches: parseInt(e.target.value) || 0 })}
                placeholder="0"
                className="w-20 px-3 py-2 rounded-xl text-sm text-center outline-none font-semibold"
                style={{ background: '#fffaf3', border: '1.5px solid #8b2635', color: '#8b2635' }} />
            </div>

            {/* Ingredientes */}
            <div className="mb-5">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-semibold" style={{ color: '#2c1810' }}>Ingredientes del batch</h3>
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
                      {['Ingrediente', 'Cantidad', 'Precio $', 'Subtotal', ''].map((h) => (
                        <th key={h} className="px-3 py-2 text-left text-xs font-semibold" style={{ color: '#7a5c4e' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {selectedDish.ingredients.map((ing, i) => (
                      <tr key={ing.id} style={{ background: i % 2 === 0 ? '#fffaf3' : '#fdf6ec' }}>
                        <td className="px-3 py-2">
                          <input type="text" value={ing.name}
                            onChange={(e) => handleUpdateIngredient(ing.id, 'name', e.target.value)}
                            placeholder="Nombre" className="w-full px-2 py-1 rounded-lg text-xs outline-none"
                            style={{ background: '#fffaf3', border: '1px solid #e8d5c0', color: '#2c1810' }} />
                        </td>
                        <td className="px-3 py-2">
                          <input type="text" value={ing.quantity}
                            onChange={(e) => handleUpdateIngredient(ing.id, 'quantity', e.target.value)}
                            placeholder="Ej: 500g" className="w-full px-2 py-1 rounded-lg text-xs outline-none"
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
                          <button onClick={() => confirm('¿Eliminar?') && onDeleteIngredient(selectedDishId, ing.id)}
                            style={{ color: '#8b2635' }}><Trash2 size={14} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {selectedDish.ingredients.length === 0 && (
                  <p className="text-center py-4 text-sm" style={{ color: '#7a5c4e' }}>Sin ingredientes aún.</p>
                )}
              </div>
            </div>

            {/* Panel de cálculo completo */}
            <div className="rounded-xl overflow-hidden" style={{ border: '1.5px solid #e8d5c0' }}>
              <div className="px-5 py-3 font-semibold text-sm" style={{ background: '#f5e6d3', color: '#2c1810' }}>
                Desglose de costos
              </div>

              <div className="p-5 space-y-3">
                {/* Costo variable */}
                <div className="flex justify-between text-sm">
                  <span style={{ color: '#7a5c4e' }}>Costo variable (ingredientes)</span>
                  <span className="font-medium" style={{ color: '#2c1810' }}>{formatCLP(variableCost)}</span>
                </div>

                {/* Costo fijo asignado */}
                <div className="flex justify-between text-sm">
                  <div>
                    <span style={{ color: '#7a5c4e' }}>Costo fijo asignado por batch</span>
                    {totalMonthlyBatches > 0 && selectedDish.monthlyBatches > 0 && (
                      <p className="text-xs" style={{ color: '#7a5c4e' }}>
                        ({formatCLP(totalFixedMonthly)} fijos ÷ {totalMonthlyBatches} batches totales × {selectedDish.monthlyBatches} de este plato)
                      </p>
                    )}
                    {(totalMonthlyBatches === 0 || !selectedDish.monthlyBatches) && (
                      <p className="text-xs" style={{ color: '#b8860b' }}>Ingresa batches mensuales para calcularlo</p>
                    )}
                  </div>
                  <span className="font-medium" style={{ color: fixedCostPerBatch > 0 ? '#2c1810' : '#aaa' }}>
                    {fixedCostPerBatch > 0 ? formatCLP(fixedCostPerBatch) : '—'}
                  </span>
                </div>

                {/* Delivery */}
                <div className="flex justify-between items-center text-sm">
                  <span style={{ color: '#7a5c4e' }}>Costo delivery</span>
                  <input type="number" step="100" min="0" value={deliveryCost}
                    onChange={(e) => onUpdateDish(selectedDishId, { deliveryCost: parseFloat(e.target.value) || 0 })}
                    className="w-24 px-2 py-1 rounded-lg text-xs text-right outline-none"
                    style={{ background: '#fdf6ec', border: '1px solid #e8d5c0', color: '#2c1810' }} />
                </div>

                {/* Costo total real */}
                <div className="flex justify-between text-sm font-semibold pt-2" style={{ borderTop: '1px dashed #e8d5c0' }}>
                  <span style={{ color: '#2c1810' }}>Costo total real por batch</span>
                  <span style={{ color: '#2c1810' }}>{formatCLP(totalCost)}</span>
                </div>

                {/* Margen */}
                <div className="flex justify-between items-center text-sm">
                  <span style={{ color: '#7a5c4e' }}>Margen de utilidad (%)</span>
                  <input type="number" step="1" value={margin}
                    onChange={(e) => onUpdateDish(selectedDishId, { margin: parseFloat(e.target.value) || 0 })}
                    className="w-20 px-2 py-1 rounded-lg text-xs text-right outline-none"
                    style={{ background: '#fdf6ec', border: '1px solid #e8d5c0', color: '#2c1810' }} />
                </div>

                {/* Precio sugerido */}
                <div className="flex justify-between items-center pt-3" style={{ borderTop: '2px solid #e8d5c0' }}>
                  <div>
                    <p className="font-bold" style={{ color: '#2c1810' }}>Precio sugerido</p>
                    <p className="text-xs" style={{ color: '#7a5c4e' }}>Redondeado al 100 más cercano</p>
                  </div>
                  <span className="text-3xl font-bold" style={{ color: '#8b2635' }}>{formatCLP(suggested)}</span>
                </div>

                {/* Precio actual */}
                <div className="flex justify-between text-xs" style={{ color: '#7a5c4e' }}>
                  <span>Precio actual del plato</span>
                  <span className={currentPrice < totalCost ? 'font-bold' : ''} style={{ color: currentPrice < totalCost ? '#c0392b' : '#7a5c4e' }}>
                    {formatCLP(currentPrice)}
                    {currentPrice < totalCost && ' ⚠ bajo el costo real'}
                  </span>
                </div>

                {/* Punto de equilibrio */}
                {breakEven !== null && selectedDish.monthlyBatches > 0 && (
                  <div className="p-3 rounded-xl mt-2 text-sm" style={{ background: '#fdf6ec', border: '1px solid #e8d5c0' }}>
                    <p className="font-semibold mb-1" style={{ color: '#2c1810' }}>Punto de equilibrio</p>
                    <p style={{ color: '#7a5c4e' }}>
                      Necesitas vender al menos{' '}
                      <strong style={{ color: '#8b2635' }}>{breakEven} batch{breakEven !== 1 ? 'es' : ''} al mes</strong>{' '}
                      de este plato para cubrir su parte de los costos fijos.
                      {selectedDish.monthlyBatches >= breakEven
                        ? <span style={{ color: '#2e7d32' }}> ✓ Tu estimado ({selectedDish.monthlyBatches}) lo supera.</span>
                        : <span style={{ color: '#c0392b' }}> Tu estimado ({selectedDish.monthlyBatches}) no lo alcanza.</span>
                      }
                    </p>
                  </div>
                )}

                <button
                  onClick={() => {
                    if (confirm(`¿Actualizar precio a ${formatCLP(suggested)}?`))
                      onUpdateDish(selectedDishId, { price: suggested });
                  }}
                  className="w-full py-3 rounded-xl text-sm font-semibold mt-2 transition-all hover:opacity-90"
                  style={{ background: '#8b2635', color: '#fff' }}>
                  Aplicar precio sugerido al menú
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export interface Ingredient {
  id: string;
  name: string;
  quantity: string;
  unitPrice: number;
  subtotal: number;
}

export interface Dish {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  ingredients: Ingredient[];
  margin: number;
  deliveryCost: number;
  monthlyBatches: number;
}

export interface Category {
  id: string;
  name: string;
}

export interface FixedCost {
  id: string;
  name: string;
  amount: number;
}

export interface MenuData {
  categories: Category[];
  dishes: Dish[];
  fixedCosts: FixedCost[];
}

const createDefaultData = (): MenuData => {
  const entradaId = '1';
  const principalId = '2';
  const postreId = '3';

  return {
    categories: [
      { id: entradaId, name: 'ENTRADAS' },
      { id: principalId, name: 'PLATOS PRINCIPALES' },
      { id: postreId, name: 'POSTRES' },
    ],
    dishes: [
      {
        id: '101', categoryId: entradaId,
        name: 'Ensalada César',
        description: 'Lechuga fresca, crutones, queso parmesano y aderezo César casero',
        price: 2500,
        ingredients: [
          { id: '1001', name: 'Lechuga', quantity: '2 unidades', unitPrice: 800, subtotal: 800 },
          { id: '1002', name: 'Pan para crutones', quantity: '1 bolsa', unitPrice: 600, subtotal: 600 },
          { id: '1003', name: 'Queso parmesano', quantity: '200g', unitPrice: 1200, subtotal: 1200 },
        ],
        margin: 30, deliveryCost: 0, monthlyBatches: 0,
      },
      {
        id: '201', categoryId: principalId,
        name: 'Lasaña de Carne',
        description: 'Capas de pasta, carne molida, salsa bechamel y queso gratinado al horno',
        price: 4500,
        ingredients: [
          { id: '2001', name: 'Pasta lasaña', quantity: '500g', unitPrice: 900, subtotal: 900 },
          { id: '2002', name: 'Carne molida', quantity: '1kg', unitPrice: 3500, subtotal: 3500 },
          { id: '2003', name: 'Queso mozzarella', quantity: '300g', unitPrice: 1800, subtotal: 1800 },
        ],
        margin: 30, deliveryCost: 0, monthlyBatches: 0,
      },
      {
        id: '301', categoryId: postreId,
        name: 'Tiramisú',
        description: 'Delicioso postre italiano con café, mascarpone y cacao',
        price: 3000, ingredients: [],
        margin: 30, deliveryCost: 0, monthlyBatches: 0,
      },
    ],
    fixedCosts: [],
  };
};

export const useMenuData = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [fixedCosts, setFixedCosts] = useState<FixedCost[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAll = useCallback(async () => {
    setLoading(true);
    const [{ data: cats }, { data: dishRows }, { data: ingRows }, { data: fcRows }] = await Promise.all([
      supabase.from('categories').select('*').order('created_at'),
      supabase.from('dishes').select('*').order('created_at'),
      supabase.from('ingredients').select('*').order('created_at'),
      supabase.from('fixed_costs').select('*').order('created_at'),
    ]);

    const assembled: Dish[] = (dishRows || []).map((d) => ({
      id: d.id,
      categoryId: d.category_id,
      name: d.name,
      description: d.description,
      price: d.price,
      margin: d.margin,
      deliveryCost: d.delivery_cost,
      monthlyBatches: d.monthly_batches ?? 0,
      ingredients: (ingRows || [])
        .filter((i) => i.dish_id === d.id)
        .map((i) => ({
          id: i.id, name: i.name, quantity: i.quantity,
          unitPrice: i.unit_price, subtotal: i.subtotal,
        })),
    }));

    setCategories((cats || []).map((c) => ({ id: c.id, name: c.name })));
    setDishes(assembled);
    setFixedCosts((fcRows || []).map((f) => ({ id: f.id, name: f.name, amount: f.amount })));
    setLoading(false);
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  // --- Categorías ---
  const addCategory = async (name: string) => {
    const id = Date.now().toString();
    setCategories((prev) => [...prev, { id, name }]);
    await supabase.from('categories').insert({ id, name });
  };

  const updateCategory = async (id: string, name: string) => {
    setCategories((prev) => prev.map((c) => c.id === id ? { ...c, name } : c));
    await supabase.from('categories').update({ name }).eq('id', id);
  };

  const deleteCategory = async (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    setDishes((prev) => prev.filter((d) => d.categoryId !== id));
    await supabase.from('categories').delete().eq('id', id);
  };

  // --- Platos ---
  const addDish = async (categoryId: string, name: string, description: string, price: number) => {
    const id = Date.now().toString();
    const newDish: Dish = { id, categoryId, name, description, price, ingredients: [], margin: 30, deliveryCost: 0, monthlyBatches: 0 };
    setDishes((prev) => [...prev, newDish]);
    await supabase.from('dishes').insert({ id, category_id: categoryId, name, description, price, margin: 30, delivery_cost: 0, monthly_batches: 0 });
    return newDish;
  };

  const updateDish = async (id: string, updates: Partial<Dish>) => {
    setDishes((prev) => prev.map((d) => d.id === id ? { ...d, ...updates } : d));
    const db: Record<string, unknown> = {};
    if (updates.name !== undefined) db.name = updates.name;
    if (updates.description !== undefined) db.description = updates.description;
    if (updates.price !== undefined) db.price = updates.price;
    if (updates.margin !== undefined) db.margin = updates.margin;
    if (updates.deliveryCost !== undefined) db.delivery_cost = updates.deliveryCost;
    if (updates.categoryId !== undefined) db.category_id = updates.categoryId;
    if (updates.monthlyBatches !== undefined) db.monthly_batches = updates.monthlyBatches;
    if (Object.keys(db).length > 0) await supabase.from('dishes').update(db).eq('id', id);
  };

  const deleteDish = async (id: string) => {
    setDishes((prev) => prev.filter((d) => d.id !== id));
    await supabase.from('dishes').delete().eq('id', id);
  };

  // --- Ingredientes ---
  const addIngredient = async (dishId: string, ingredient: Omit<Ingredient, 'id'>) => {
    const id = Date.now().toString();
    setDishes((prev) => prev.map((d) =>
      d.id === dishId ? { ...d, ingredients: [...d.ingredients, { ...ingredient, id }] } : d
    ));
    await supabase.from('ingredients').insert({ id, dish_id: dishId, name: ingredient.name, quantity: ingredient.quantity, unit_price: ingredient.unitPrice, subtotal: ingredient.subtotal });
  };

  const updateIngredient = async (dishId: string, ingredientId: string, updates: Partial<Ingredient>) => {
    setDishes((prev) => prev.map((d) =>
      d.id === dishId
        ? { ...d, ingredients: d.ingredients.map((i) => i.id === ingredientId ? { ...i, ...updates } : i) }
        : d
    ));
    const db: Record<string, unknown> = {};
    if (updates.name !== undefined) db.name = updates.name;
    if (updates.quantity !== undefined) db.quantity = updates.quantity;
    if (updates.unitPrice !== undefined) db.unit_price = updates.unitPrice;
    if (updates.subtotal !== undefined) db.subtotal = updates.subtotal;
    if (Object.keys(db).length > 0) await supabase.from('ingredients').update(db).eq('id', ingredientId);
  };

  const deleteIngredient = async (dishId: string, ingredientId: string) => {
    setDishes((prev) => prev.map((d) =>
      d.id === dishId ? { ...d, ingredients: d.ingredients.filter((i) => i.id !== ingredientId) } : d
    ));
    await supabase.from('ingredients').delete().eq('id', ingredientId);
  };

  // --- Costos fijos ---
  const addFixedCost = async (name: string, amount: number) => {
    const id = Date.now().toString();
    setFixedCosts((prev) => [...prev, { id, name, amount }]);
    await supabase.from('fixed_costs').insert({ id, name, amount });
  };

  const updateFixedCost = async (id: string, updates: Partial<FixedCost>) => {
    setFixedCosts((prev) => prev.map((f) => f.id === id ? { ...f, ...updates } : f));
    const db: Record<string, unknown> = {};
    if (updates.name !== undefined) db.name = updates.name;
    if (updates.amount !== undefined) db.amount = updates.amount;
    if (Object.keys(db).length > 0) await supabase.from('fixed_costs').update(db).eq('id', id);
  };

  const deleteFixedCost = async (id: string) => {
    setFixedCosts((prev) => prev.filter((f) => f.id !== id));
    await supabase.from('fixed_costs').delete().eq('id', id);
  };

  const getDishById = (id: string) => dishes.find((d) => d.id === id);
  const getDishesByCategory = (categoryId: string) => dishes.filter((d) => d.categoryId === categoryId);

  const resetToDefault = async () => {
    if (!confirm('¿Borrar todo y cargar los datos de ejemplo?')) return;
    await supabase.from('categories').delete().neq('id', '___never___');
    await supabase.from('fixed_costs').delete().neq('id', '___never___');
    const def = createDefaultData();
    for (const cat of def.categories) {
      await supabase.from('categories').insert({ id: cat.id, name: cat.name });
    }
    for (const dish of def.dishes) {
      await supabase.from('dishes').insert({ id: dish.id, category_id: dish.categoryId, name: dish.name, description: dish.description, price: dish.price, margin: dish.margin, delivery_cost: dish.deliveryCost, monthly_batches: dish.monthlyBatches });
      for (const ing of dish.ingredients) {
        await supabase.from('ingredients').insert({ id: ing.id, dish_id: dish.id, name: ing.name, quantity: ing.quantity, unit_price: ing.unitPrice, subtotal: ing.subtotal });
      }
    }
    await loadAll();
  };

  const clearAllData = async () => {
    if (!confirm('¿Eliminar TODOS los datos?')) return;
    await supabase.from('categories').delete().neq('id', '___never___');
    await supabase.from('fixed_costs').delete().neq('id', '___never___');
    setCategories([]); setDishes([]); setFixedCosts([]);
  };

  return {
    categories, dishes, fixedCosts, loading,
    addCategory, updateCategory, deleteCategory,
    addDish, updateDish, deleteDish,
    addIngredient, updateIngredient, deleteIngredient,
    addFixedCost, updateFixedCost, deleteFixedCost,
    getDishById, getDishesByCategory,
    resetToDefault, clearAllData,
  };
};

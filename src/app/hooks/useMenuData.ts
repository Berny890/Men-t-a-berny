import { useState, useEffect } from 'react';

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
}

export interface Category {
  id: string;
  name: string;
}

export interface MenuData {
  categories: Category[];
  dishes: Dish[];
}

const STORAGE_KEY = 'restaurant-menu-data';

const getInitialData = (): MenuData => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return createDefaultData();
    }
  }
  return createDefaultData();
};

const createDefaultData = (): MenuData => {
  // Crear datos de ejemplo para una mejor experiencia inicial
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
        id: '101',
        categoryId: entradaId,
        name: 'Ensalada César',
        description: 'Lechuga fresca, crutones, queso parmesano y aderezo César casero',
        price: 2500,
        ingredients: [
          { id: '1001', name: 'Lechuga', quantity: '2 unidades', unitPrice: 800, subtotal: 800 },
          { id: '1002', name: 'Pan para crutones', quantity: '1 bolsa', unitPrice: 600, subtotal: 600 },
          { id: '1003', name: 'Queso parmesano', quantity: '200g', unitPrice: 1200, subtotal: 1200 },
        ],
        margin: 30,
        deliveryCost: 0,
      },
      {
        id: '201',
        categoryId: principalId,
        name: 'Lasaña de Carne',
        description: 'Capas de pasta, carne molida, salsa bechamel y queso gratinado al horno',
        price: 4500,
        ingredients: [
          { id: '2001', name: 'Pasta lasaña', quantity: '500g', unitPrice: 900, subtotal: 900 },
          { id: '2002', name: 'Carne molida', quantity: '1kg', unitPrice: 3500, subtotal: 3500 },
          { id: '2003', name: 'Queso mozzarella', quantity: '300g', unitPrice: 1800, subtotal: 1800 },
        ],
        margin: 30,
        deliveryCost: 0,
      },
      {
        id: '301',
        categoryId: postreId,
        name: 'Tiramisú',
        description: 'Delicioso postre italiano con café, mascarpone y cacao',
        price: 3000,
        ingredients: [],
        margin: 30,
        deliveryCost: 0,
      },
    ],
  };
};

export const useMenuData = () => {
  const [data, setData] = useState<MenuData>(() => getInitialData());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  // Categorías
  const addCategory = (name: string) => {
    const newCategory: Category = {
      id: Date.now().toString(),
      name,
    };
    setData(prev => ({
      ...prev,
      categories: [...prev.categories, newCategory],
    }));
    return newCategory;
  };

  const updateCategory = (id: string, name: string) => {
    setData(prev => ({
      ...prev,
      categories: prev.categories.map(cat =>
        cat.id === id ? { ...cat, name } : cat
      ),
    }));
  };

  const deleteCategory = (id: string) => {
    setData(prev => ({
      categories: prev.categories.filter(cat => cat.id !== id),
      dishes: prev.dishes.filter(dish => dish.categoryId !== id),
    }));
  };

  // Platos
  const addDish = (categoryId: string, name: string, description: string, price: number) => {
    const newDish: Dish = {
      id: Date.now().toString(),
      categoryId,
      name,
      description,
      price,
      ingredients: [],
      margin: 30,
      deliveryCost: 0,
    };
    setData(prev => ({
      ...prev,
      dishes: [...prev.dishes, newDish],
    }));
    return newDish;
  };

  const updateDish = (id: string, updates: Partial<Dish>) => {
    setData(prev => ({
      ...prev,
      dishes: prev.dishes.map(dish =>
        dish.id === id ? { ...dish, ...updates } : dish
      ),
    }));
  };

  const deleteDish = (id: string) => {
    setData(prev => ({
      ...prev,
      dishes: prev.dishes.filter(dish => dish.id !== id),
    }));
  };

  // Ingredientes
  const addIngredient = (dishId: string, ingredient: Omit<Ingredient, 'id'>) => {
    setData(prev => ({
      ...prev,
      dishes: prev.dishes.map(dish =>
        dish.id === dishId
          ? {
              ...dish,
              ingredients: [
                ...dish.ingredients,
                { ...ingredient, id: Date.now().toString() },
              ],
            }
          : dish
      ),
    }));
  };

  const updateIngredient = (dishId: string, ingredientId: string, updates: Partial<Ingredient>) => {
    setData(prev => ({
      ...prev,
      dishes: prev.dishes.map(dish =>
        dish.id === dishId
          ? {
              ...dish,
              ingredients: dish.ingredients.map(ing =>
                ing.id === ingredientId ? { ...ing, ...updates } : ing
              ),
            }
          : dish
      ),
    }));
  };

  const deleteIngredient = (dishId: string, ingredientId: string) => {
    setData(prev => ({
      ...prev,
      dishes: prev.dishes.map(dish =>
        dish.id === dishId
          ? {
              ...dish,
              ingredients: dish.ingredients.filter(ing => ing.id !== ingredientId),
            }
          : dish
      ),
    }));
  };

  const getDishById = (id: string) => {
    return data.dishes.find(dish => dish.id === id);
  };

  const getDishesByCategory = (categoryId: string) => {
    return data.dishes.filter(dish => dish.categoryId === categoryId);
  };

  const resetToDefault = () => {
    if (confirm('¿Está seguro de borrar todos los datos y volver al ejemplo inicial? Esta acción no se puede deshacer.')) {
      const defaultData = createDefaultData();
      setData(defaultData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
    }
  };

  const clearAllData = () => {
    if (confirm('¿Está seguro de eliminar TODOS los datos? Esta acción no se puede deshacer.')) {
      const emptyData = { categories: [], dishes: [] };
      setData(emptyData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(emptyData));
    }
  };

  return {
    categories: data.categories,
    dishes: data.dishes,
    addCategory,
    updateCategory,
    deleteCategory,
    addDish,
    updateDish,
    deleteDish,
    addIngredient,
    updateIngredient,
    deleteIngredient,
    getDishById,
    getDishesByCategory,
    resetToDefault,
    clearAllData,
  };
};
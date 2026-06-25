import { useState } from 'react';
import { Menu, Calculator, Eye, Download, RefreshCw, Trash } from 'lucide-react';
import { useMenuData } from './hooks/useMenuData';
import { CategoryManager } from './components/CategoryManager';
import { DishManager } from './components/DishManager';
import { MenuPreview } from './components/MenuPreview';
import { PriceCalculator } from './components/PriceCalculator';
import { ExportSection } from './components/ExportSection';

type Tab = 'menu' | 'calculator' | 'preview' | 'export';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('menu');
  const menuData = useMenuData();

  const tabs = [
    { id: 'menu' as Tab, label: 'Gestor de Menú', icon: Menu },
    { id: 'calculator' as Tab, label: 'Calculadora de Precios', icon: Calculator },
    { id: 'preview' as Tab, label: 'Vista Previa', icon: Eye },
    { id: 'export' as Tab, label: 'Exportación', icon: Download },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
          <h1 className="text-xl md:text-3xl text-center text-gray-800">
            Sistema de Gestión de Menú de Restaurante
          </h1>
          <p className="text-center text-gray-600 mt-1 md:mt-2 text-sm md:text-base">
            Emprendimiento Familiar
          </p>
        </div>
      </header>

      {/* Tabs Navigation */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-2 md:px-4">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 md:px-6 py-3 md:py-4 border-b-4 transition-colors whitespace-nowrap text-sm md:text-base ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={20} />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'menu' && (
          <div className="space-y-6">
            <CategoryManager
              categories={menuData.categories}
              onAdd={menuData.addCategory}
              onUpdate={menuData.updateCategory}
              onDelete={menuData.deleteCategory}
              getDishesByCategory={menuData.getDishesByCategory}
            />
            <DishManager
              categories={menuData.categories}
              dishes={menuData.dishes}
              onAdd={menuData.addDish}
              onUpdate={menuData.updateDish}
              onDelete={menuData.deleteDish}
              getDishesByCategory={menuData.getDishesByCategory}
            />
          </div>
        )}

        {activeTab === 'calculator' && (
          <PriceCalculator
            categories={menuData.categories}
            dishes={menuData.dishes}
            getDishesByCategory={menuData.getDishesByCategory}
            getDishById={menuData.getDishById}
            onAddIngredient={menuData.addIngredient}
            onUpdateIngredient={menuData.updateIngredient}
            onDeleteIngredient={menuData.deleteIngredient}
            onUpdateDish={menuData.updateDish}
          />
        )}

        {activeTab === 'preview' && (
          <MenuPreview
            categories={menuData.categories}
            dishes={menuData.dishes}
            getDishesByCategory={menuData.getDishesByCategory}
          />
        )}

        {activeTab === 'export' && (
          <ExportSection
            categories={menuData.categories}
            dishes={menuData.dishes}
            getDishesByCategory={menuData.getDishesByCategory}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-center md:text-left text-xs md:text-sm">
              Sistema de Gestión de Menú © 2026 - Todos los datos se guardan localmente en su navegador
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={menuData.resetToDefault}
                className="px-3 md:px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center justify-center gap-2 text-xs md:text-sm"
                title="Volver a datos de ejemplo"
              >
                <RefreshCw size={14} />
                <span>Restaurar Ejemplo</span>
              </button>
              <button
                onClick={menuData.clearAllData}
                className="px-3 md:px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center justify-center gap-2 text-xs md:text-sm"
                title="Eliminar todos los datos"
              >
                <Trash size={14} />
                <span>Borrar Todo</span>
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
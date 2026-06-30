import { useState } from 'react';
import { UtensilsCrossed, Calculator, Eye, Download, RefreshCw, Flame, ClipboardList, Settings, LogOut } from 'lucide-react';
import { useMenuData } from './hooks/useMenuData';
import { useSettings } from './hooks/useSettings';
import { useAuth } from './hooks/useAuth';
import { LoginGate } from './components/LoginGate';
import { MenuManager } from './components/MenuManager';
import { MenuPreview } from './components/MenuPreview';
import { PriceCalculator } from './components/PriceCalculator';
import { ExportSection } from './components/ExportSection';
import { FixedCostsManager } from './components/FixedCostsManager';
import { ReservationsManager } from './components/ReservationsManager';
import { SettingsManager } from './components/SettingsManager';

type Tab = 'menu' | 'costos' | 'calculator' | 'preview' | 'export' | 'reservas' | 'config';

function AdminApp() {
  const [activeTab, setActiveTab] = useState<Tab>('menu');
  const menuData = useMenuData();
  const { token, logout, changePassword } = useAuth();
  const { settings, loading: settingsLoading, updateSettings } = useSettings(token);

  const tabs = [
    { id: 'menu' as Tab, label: 'Menú', icon: UtensilsCrossed },
    { id: 'costos' as Tab, label: 'Costos Fijos', icon: Flame },
    { id: 'calculator' as Tab, label: 'Calculadora', icon: Calculator },
    { id: 'preview' as Tab, label: 'Vista Previa', icon: Eye },
    { id: 'export' as Tab, label: 'Exportar', icon: Download },
    { id: 'reservas' as Tab, label: 'Reservas', icon: ClipboardList },
    { id: 'config' as Tab, label: 'Configuración', icon: Settings },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#fdf6ec' }}>

      {/* Header */}
      <header style={{ background: '#8b2635' }} className="shadow-lg">
        <div className="max-w-5xl mx-auto px-4 py-5 flex items-center justify-center gap-3">
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-bold tracking-wide" style={{ color: '#fdf6ec', fontFamily: 'Georgia, serif' }}>
              Gestión de Menú
            </h1>
            <p className="text-xs tracking-widest uppercase" style={{ color: '#e8c8ae' }}>
              Emprendimiento Familiar
            </p>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="sticky top-0 z-10 shadow-sm" style={{ background: '#fffaf3', borderBottom: '2px solid #e8d5c0' }}>
        <div className="max-w-5xl mx-auto px-2 md:px-4">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className="flex items-center gap-2 px-4 md:px-6 py-4 transition-all whitespace-nowrap text-sm font-medium border-b-4"
                  style={{
                    borderBottomColor: active ? '#8b2635' : 'transparent',
                    color: active ? '#8b2635' : '#7a5c4e',
                    background: active ? '#fdf6ec' : 'transparent',
                  }}>
                  <Icon size={18} />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {menuData.loading && (
          <div className="flex items-center justify-center py-24">
            <div className="text-center">
              <div className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4"
                style={{ borderColor: '#8b2635', borderTopColor: 'transparent' }} />
              <p style={{ color: '#7a5c4e' }}>Cargando datos...</p>
            </div>
          </div>
        )}

        {!menuData.loading && activeTab === 'menu' && (
          <MenuManager
            categories={menuData.categories}
            dishes={menuData.dishes}
            onAddCategory={menuData.addCategory}
            onUpdateCategory={menuData.updateCategory}
            onDeleteCategory={menuData.deleteCategory}
            onAddDish={menuData.addDish}
            onUpdateDish={menuData.updateDish}
            onDeleteDish={menuData.deleteDish}
            onDuplicateDish={menuData.duplicateDish}
            onToggleAvailableDish={(id, current) => menuData.updateDish(id, { available: current === false ? true : false })}
            getDishesByCategory={menuData.getDishesByCategory}
            onReorderCategories={menuData.reorderCategories}
            onReorderDishes={menuData.reorderDishes}
          />
        )}

        {!menuData.loading && activeTab === 'costos' && (
          <FixedCostsManager
            fixedCosts={menuData.fixedCosts}
            onAdd={menuData.addFixedCost}
            onUpdate={menuData.updateFixedCost}
            onDelete={menuData.deleteFixedCost}
          />
        )}

        {!menuData.loading && activeTab === 'calculator' && (
          <PriceCalculator
            categories={menuData.categories}
            dishes={menuData.dishes}
            fixedCosts={menuData.fixedCosts}
            getDishesByCategory={menuData.getDishesByCategory}
            getDishById={menuData.getDishById}
            onAddIngredient={menuData.addIngredient}
            onUpdateIngredient={menuData.updateIngredient}
            onDeleteIngredient={menuData.deleteIngredient}
            onUpdateDish={menuData.updateDish}
          />
        )}

        {!menuData.loading && activeTab === 'preview' && (
          <MenuPreview
            categories={menuData.categories}
            dishes={menuData.dishes}
            getDishesByCategory={menuData.getDishesByCategory}
            subtitle={settings.menuSubtitle}
            portions={settings.menuPortions}
          />
        )}

        {!menuData.loading && activeTab === 'export' && (
          <ExportSection
            categories={menuData.categories}
            dishes={menuData.dishes}
            getDishesByCategory={menuData.getDishesByCategory}
            menuMode={settings.menuMode}
            whatsappNumber={settings.whatsappNumber}
            whatsappMessageTemplate={settings.whatsappMessageTemplate}
          />
        )}

        {activeTab === 'reservas' && <ReservationsManager token={token} />}

        {activeTab === 'config' && (
          <SettingsManager
            settings={settings}
            loading={settingsLoading}
            updateSettings={updateSettings}
            changePassword={changePassword}
          />
        )}
      </main>

      {/* Footer */}
      <footer style={{ background: '#fffaf3', borderTop: '2px solid #e8d5c0' }} className="mt-12">
        <div className="max-w-5xl mx-auto px-4 py-5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-center md:text-left" style={{ color: '#7a5c4e' }}>
            © 2026 · Los datos se guardan en la nube
          </p>
          <div className="flex items-center gap-2">
            {activeTab !== 'menu' && activeTab !== 'reservas' && activeTab !== 'config' && (
              <button onClick={menuData.resetToDefault}
                className="px-4 py-2 rounded-lg text-xs flex items-center gap-2 transition-all hover:opacity-80"
                style={{ background: '#e8d5c0', color: '#2c1810' }}>
                <RefreshCw size={13} /> Restaurar ejemplo
              </button>
            )}
            <button onClick={logout}
              className="px-4 py-2 rounded-lg text-xs flex items-center gap-2 transition-all hover:opacity-80"
              style={{ background: '#e8d5c0', color: '#2c1810' }}>
              <LogOut size={13} /> Cerrar sesión
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <LoginGate>
      <AdminApp />
    </LoginGate>
  );
}

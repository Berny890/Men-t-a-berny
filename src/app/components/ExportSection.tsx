import { useState } from 'react';
import { Download, FileText, Table, CalendarDays, X } from 'lucide-react';
import { Category, Dish } from '../hooks/useMenuData';
import { exportMenuToPDF, exportCostSheet } from '../utils/exportUtils';

interface ExportSectionProps {
  categories: Category[];
  dishes: Dish[];
  getDishesByCategory: (categoryId: string) => Dish[];
}

const formatDateLong = (dateStr: string): string => {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
};

export const ExportSection = ({ categories, dishes, getDishesByCategory }: ExportSectionProps) => {
  const [showModal, setShowModal] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  const handleExportPDF = () => {
    if (dishes.length === 0) {
      alert('No hay platos para exportar. Agrega platos al menú primero.');
      return;
    }
    setShowModal(true);
  };

  const handleConfirm = () => {
    setShowModal(false);
    exportMenuToPDF(categories, dishes, getDishesByCategory, deliveryDate || null);
  };

  const handleExportCostSheet = () => {
    if (dishes.length === 0) {
      alert('No hay datos para exportar. Agrega platos al menú primero.');
      return;
    }
    exportCostSheet(categories, dishes);
  };

  return (
    <div className="rounded-2xl shadow-sm overflow-hidden" style={{ background: '#fffaf3', border: '1px solid #e8d5c0' }}>
      <div className="px-6 py-4 flex items-center gap-2" style={{ background: '#f5e6d3', borderBottom: '1px solid #e8d5c0' }}>
        <Download size={18} style={{ color: '#8b2635' }} />
        <h2 className="font-semibold" style={{ color: '#2c1810' }}>Exportación</h2>
      </div>

      <div className="p-6 grid md:grid-cols-2 gap-5">
        {/* PDF */}
        <div className="p-5 rounded-xl" style={{ background: '#fdf6ec', border: '1.5px solid #e8d5c0' }}>
          <div className="flex items-center gap-3 mb-3">
            <FileText size={28} style={{ color: '#8b2635' }} />
            <div>
              <h3 className="text-sm font-semibold" style={{ color: '#2c1810' }}>Menú en PDF</h3>
              <p className="text-xs" style={{ color: '#7a5c4e' }}>Altura dinámica según contenido</p>
            </div>
          </div>
          <p className="text-xs mb-4" style={{ color: '#7a5c4e' }}>
            Genera el menú con diseño profesional. Antes de descargar te pregunta la fecha de reparto.
          </p>
          <button onClick={handleExportPDF}
            className="w-full py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all hover:opacity-90"
            style={{ background: '#8b2635', color: '#fff' }}>
            <Download size={16} /> Descargar PDF del Menú
          </button>
        </div>

        {/* Excel */}
        <div className="p-5 rounded-xl" style={{ background: '#fdf6ec', border: '1.5px solid #e8d5c0' }}>
          <div className="flex items-center gap-3 mb-3">
            <Table size={28} style={{ color: '#8b2635' }} />
            <div>
              <h3 className="text-sm font-semibold" style={{ color: '#2c1810' }}>Planilla de Costos</h3>
              <p className="text-xs" style={{ color: '#7a5c4e' }}>Formato Excel (.xlsx)</p>
            </div>
          </div>
          <p className="text-xs mb-4" style={{ color: '#7a5c4e' }}>
            Desglose completo de costos, márgenes y precios finales de todos los platos.
          </p>
          <button onClick={handleExportCostSheet}
            className="w-full py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all hover:opacity-90"
            style={{ background: '#8b2635', color: '#fff' }}>
            <Download size={16} /> Descargar Planilla de Costos
          </button>
        </div>
      </div>

      {/* Modal fecha de reparto */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
            style={{ background: '#fffaf3', border: '1px solid #e8d5c0' }}>
            {/* Header modal */}
            <div className="px-6 py-4 flex items-center justify-between"
              style={{ background: '#8b2635' }}>
              <div className="flex items-center gap-2">
                <CalendarDays size={20} color="#fff" />
                <span className="font-semibold text-sm" style={{ color: '#fff' }}>Fecha de reparto</span>
              </div>
              <button onClick={() => setShowModal(false)} style={{ color: '#f5e6d3' }}>
                <X size={18} />
              </button>
            </div>

            {/* Body modal */}
            <div className="p-6">
              <p className="text-sm mb-5" style={{ color: '#7a5c4e' }}>
                ¿Cuándo vas a repartir este menú? La fecha aparecerá al final del PDF.
              </p>

              <input
                type="date"
                value={deliveryDate}
                min={todayStr}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none mb-3"
                style={{ background: '#fdf6ec', border: '1.5px solid #8b2635', color: '#2c1810' }}
              />

              {deliveryDate && (
                <p className="text-xs text-center mb-4 capitalize" style={{ color: '#8b2635' }}>
                  📅 {formatDateLong(deliveryDate)}
                </p>
              )}

              {!deliveryDate && (
                <p className="text-xs text-center mb-4" style={{ color: '#7a5c4e' }}>
                  También puedes exportar sin fecha
                </p>
              )}

              <div className="flex gap-2">
                <button onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm transition-all hover:opacity-80"
                  style={{ background: '#e8d5c0', color: '#2c1810' }}>
                  Cancelar
                </button>
                <button onClick={handleConfirm}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                  style={{ background: '#8b2635', color: '#fff' }}>
                  <Download size={14} className="inline mr-1.5" />
                  Exportar PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

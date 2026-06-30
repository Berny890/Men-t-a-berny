import { useState } from 'react';
import { Download, FileText, Table, CalendarDays, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Category, Dish } from '../hooks/useMenuData';
import { exportMenuToPDF, exportCostSheet, MenuMode } from '../utils/exportUtils';

interface ExportSectionProps {
  categories: Category[];
  dishes: Dish[];
  getDishesByCategory: (categoryId: string) => Dish[];
  menuMode?: MenuMode;
  whatsappNumber?: string;
  whatsappMessageTemplate?: string;
}

const DIAS = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'];
const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

const toDateStr = (y: number, m: number, d: number) =>
  `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

const formatDateLong = (dateStr: string): string => {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
};

const Calendar = ({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (date: string) => void;
}) => {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const firstDay = new Date(viewYear, viewMonth, 1).getDay(); // 0=dom
  // Convertir a lunes=0
  const startOffset = (firstDay + 6) % 7;
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const todayStr = toDateStr(today.getFullYear(), today.getMonth(), today.getDate());

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  // Pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div style={{ fontFamily: 'Georgia, serif' }}>
      {/* Navegación mes */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth}
          className="p-1.5 rounded-lg transition-all hover:opacity-70"
          style={{ background: '#e8d5c0', color: '#2c1810' }}>
          <ChevronLeft size={16} />
        </button>
        <span className="font-semibold text-sm" style={{ color: '#2c1810' }}>
          {MESES[viewMonth]} {viewYear}
        </span>
        <button onClick={nextMonth}
          className="p-1.5 rounded-lg transition-all hover:opacity-70"
          style={{ background: '#e8d5c0', color: '#2c1810' }}>
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Días semana */}
      <div className="grid grid-cols-7 mb-1">
        {DIAS.map(d => (
          <div key={d} className="text-center text-xs font-semibold py-1"
            style={{ color: '#7a5c4e' }}>
            {d}
          </div>
        ))}
      </div>

      {/* Grilla días */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const dateStr = toDateStr(viewYear, viewMonth, day);
          const isPast = dateStr < todayStr;
          const isToday = dateStr === todayStr;
          const isSelected = dateStr === selected;

          return (
            <button
              key={i}
              disabled={isPast}
              onClick={() => onSelect(dateStr)}
              className="mx-auto flex items-center justify-center rounded-full text-sm transition-all"
              style={{
                width: '34px',
                height: '34px',
                background: isSelected ? '#8b2635' : isToday ? '#f5e6d3' : 'transparent',
                color: isSelected ? '#fff' : isPast ? '#ccc' : '#2c1810',
                fontWeight: isSelected || isToday ? '700' : '400',
                cursor: isPast ? 'not-allowed' : 'pointer',
                border: isToday && !isSelected ? '1.5px solid #8b2635' : '1.5px solid transparent',
              }}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export const ExportSection = ({ categories, dishes, getDishesByCategory, menuMode = 'simple', whatsappNumber = '', whatsappMessageTemplate = '' }: ExportSectionProps) => {
  const [showModal, setShowModal] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState('');

  const handleExportPDF = () => {
    if (dishes.length === 0) {
      alert('No hay platos para exportar. Agrega platos al menú primero.');
      return;
    }
    setShowModal(true);
  };

  const handleConfirm = () => {
    setShowModal(false);
    exportMenuToPDF(categories, dishes, getDishesByCategory, deliveryDate || null, menuMode, whatsappNumber, whatsappMessageTemplate);
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

      {/* Modal calendario */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
            style={{ background: '#fffaf3', border: '1px solid #e8d5c0' }}>

            {/* Header */}
            <div className="px-6 py-4 flex items-center justify-between" style={{ background: '#8b2635' }}>
              <div className="flex items-center gap-2">
                <CalendarDays size={20} color="#fff" />
                <span className="font-semibold text-sm" style={{ color: '#fff' }}>
                  ¿Cuándo vas a repartir?
                </span>
              </div>
              <button onClick={() => setShowModal(false)} style={{ color: '#f5e6d3' }}>
                <X size={18} />
              </button>
            </div>

            {/* Calendario */}
            <div className="px-6 pt-5 pb-4">
              <Calendar selected={deliveryDate} onSelect={setDeliveryDate} />
            </div>

            {/* Fecha seleccionada */}
            <div className="px-6 pb-2 min-h-[36px] text-center">
              {deliveryDate ? (
                <p className="text-sm font-semibold capitalize" style={{ color: '#8b2635' }}>
                  {formatDateLong(deliveryDate)}
                </p>
              ) : (
                <p className="text-xs" style={{ color: '#7a5c4e' }}>
                  Selecciona una fecha o exporta sin fecha
                </p>
              )}
            </div>

            {/* Acciones */}
            <div className="px-6 pb-5 flex gap-2 mt-2">
              <button onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 rounded-xl text-sm transition-all hover:opacity-80"
                style={{ background: '#e8d5c0', color: '#2c1810' }}>
                Cancelar
              </button>
              <button onClick={handleConfirm}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 flex items-center justify-center gap-1.5"
                style={{ background: '#8b2635', color: '#fff' }}>
                <Download size={14} />
                {deliveryDate ? 'Exportar con fecha' : 'Exportar sin fecha'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { Category, Dish } from '../hooks/useMenuData';

const MM = 2.83465;
const PW = 105 * MM;          // ancho página
const MARGIN = 13 * MM;
const CW = PW - MARGIN * 2;   // ancho contenido

// Tamaños de fuente
const FS_DISH = 8.5;           // nombre plato (más pequeño)
const FS_DESC = 7.5;           // descripción
const FS_CAT  = 10;            // categoría
const FS_MENU = 26;            // MENÚ
const FS_SUB  = 8.5;           // EMPRENDIMIENTO FAMILIAR
const FS_POR  = 8;             // porciones

const LINE_DISH = 4.2 * MM;   // altura línea nombre plato
const LINE_DESC = 3.7 * MM;   // altura línea descripción
const LINE_CAT  = 4.5 * MM;   // altura nombre categoría

const calculateHeight = (doc: jsPDF, categories: Category[], getDishesByCategory: (id: string) => Dish[], deliveryDate: string | null): number => {
  let h = 14 * MM;  // padding top generoso

  // MENÚ
  h += 10 * MM;
  // EMPRENDIMIENTO FAMILIAR
  h += 5 * MM;
  // Porciones
  h += 5 * MM;
  // línea + espacio
  h += 7 * MM;

  categories.forEach((cat) => {
    const dishes = getDishesByCategory(cat.id);
    if (!dishes.length) return;

    h += LINE_CAT;          // nombre categoría
    h += 1.5 * MM;          // línea
    h += 4 * MM;            // espacio

    dishes.forEach((dish) => {
      h += LINE_DISH;       // nombre + precio
      if (dish.description) {
        doc.setFontSize(FS_DESC);
        const lines = doc.splitTextToSize(dish.description, CW);
        h += lines.length * LINE_DESC;
      }
      h += 3.5 * MM;        // espacio entre platos
    });

    h += 2 * MM;            // espacio entre categorías
  });

  // footer: línea + texto + fecha (opcional) + padding
  h += 12 * MM;
  if (deliveryDate) h += 6 * MM;

  return h;
};

const formatDateLong = (dateStr: string): string => {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
};

export const exportMenuToPDF = (
  categories: Category[],
  dishes: Dish[],
  getDishesByCategory: (id: string) => Dish[],
  deliveryDate: string | null = null
) => {
  const tempDoc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: [PW, 1000] });
  const pageHeight = Math.max(calculateHeight(tempDoc, categories, getDishesByCategory, deliveryDate), 80 * MM);

  const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: [PW, pageHeight] });

  let y = 14 * MM;

  // --- MENÚ ---
  doc.setFont('times', 'bold');
  doc.setFontSize(FS_MENU);
  doc.setTextColor(20, 20, 20);
  doc.text('MENÚ', PW / 2, y, { align: 'center' });
  y += 6 * MM;

  // EMPRENDIMIENTO FAMILIAR
  doc.setFont('times', 'normal');
  doc.setFontSize(FS_SUB);
  doc.setTextColor(80, 80, 80);
  doc.text('EMPRENDIMIENTO FAMILIAR', PW / 2, y, { align: 'center' });
  y += 4.5 * MM;

  // Porciones
  doc.setFont('times', 'italic');
  doc.setFontSize(FS_POR);
  doc.setTextColor(110, 110, 110);
  doc.text('Porciones para 6 personas', PW / 2, y, { align: 'center' });
  y += 5 * MM;

  // Línea separadora
  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(0.8);
  doc.line(MARGIN, y, PW - MARGIN, y);
  y += 7 * MM;

  // --- CATEGORÍAS Y PLATOS ---
  categories.forEach((cat) => {
    const catDishes = getDishesByCategory(cat.id);
    if (!catDishes.length) return;

    doc.setFont('times', 'bold');
    doc.setFontSize(FS_CAT);
    doc.setTextColor(20, 20, 20);
    doc.text(cat.name.toUpperCase(), MARGIN, y);
    y += 1.5 * MM;

    doc.setDrawColor(30, 30, 30);
    doc.setLineWidth(0.4);
    doc.line(MARGIN, y, PW - MARGIN, y);
    y += 4 * MM;

    catDishes.forEach((dish) => {
      const price = `$${Number(dish.price).toLocaleString('es-CL')} .-`;

      doc.setFont('times', 'bold');
      doc.setFontSize(FS_DISH);
      doc.setTextColor(20, 20, 20);
      doc.text(dish.name.toUpperCase(), MARGIN, y);
      doc.text(price, PW - MARGIN, y, { align: 'right' });
      y += LINE_DISH;

      if (dish.description) {
        doc.setFont('times', 'italic');
        doc.setFontSize(FS_DESC);
        doc.setTextColor(90, 90, 90);
        const lines = doc.splitTextToSize(dish.description, CW);
        doc.text(lines, MARGIN, y);
        y += lines.length * LINE_DESC;
      }

      y += 3.5 * MM;
    });

    y += 2 * MM;
  });

  // --- FOOTER ---
  y += 2 * MM;
  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(0.4);
  doc.line(MARGIN, y, PW - MARGIN, y);
  y += 5 * MM;

  doc.setFont('times', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(20, 20, 20);
  doc.text('— ¡BUEN PROVECHO! —', PW / 2, y, { align: 'center' });

  // Fecha de reparto
  if (deliveryDate) {
    y += 5.5 * MM;
    doc.setFont('times', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(90, 90, 90);
    const label = `Reparto: ${formatDateLong(deliveryDate)}`;
    doc.text(label, PW / 2, y, { align: 'center' });
  }

  doc.save('menu-restaurante.pdf');
};

export const exportCostSheet = (categories: Category[], dishes: Dish[]) => {
  const data: any[] = [];

  data.push(['Categoría', 'Nombre Plato', 'Descripción', 'Costo Total Ingredientes', 'Margen %', 'Precio Final']);

  dishes.forEach((dish) => {
    const category = categories.find((c) => c.id === dish.categoryId);
    const totalCost = dish.ingredients.reduce((sum, ing) => sum + ing.subtotal, 0);
    data.push([category?.name || 'Sin categoría', dish.name, dish.description, totalCost.toFixed(2), dish.margin, dish.price.toFixed(2)]);
  });

  const ws = XLSX.utils.aoa_to_sheet(data);
  ws['!cols'] = [{ wch: 20 }, { wch: 25 }, { wch: 40 }, { wch: 20 }, { wch: 12 }, { wch: 15 }];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Planilla de Costos');
  XLSX.writeFile(wb, 'planilla-costos.xlsx');
};

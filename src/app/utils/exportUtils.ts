import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { Category, Dish } from '../hooks/useMenuData';

const MM_TO_PT = 2.83465;
const PAGE_WIDTH_MM = 105;
const PAGE_WIDTH = PAGE_WIDTH_MM * MM_TO_PT;
const MARGIN = 14 * MM_TO_PT;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

// Calcula la altura total que necesita el contenido
const calculateContentHeight = (
  doc: jsPDF,
  categories: Category[],
  getDishesByCategory: (id: string) => Dish[]
): number => {
  let height = 0;

  // Header: EST. 2024 + MENÚ + subtítulo + descripción + línea
  height += 10 * MM_TO_PT; // top padding
  height += 6 * MM_TO_PT;  // EST. 2024
  height += 12 * MM_TO_PT; // MENÚ
  height += 7 * MM_TO_PT;  // EMPRENDIMIENTO FAMILIAR
  height += 6 * MM_TO_PT;  // Porciones para 6 personas
  height += 8 * MM_TO_PT;  // línea separadora + espacio

  categories.forEach((category) => {
    const dishes = getDishesByCategory(category.id);
    if (dishes.length === 0) return;

    height += 8 * MM_TO_PT; // categoría + línea
    height += 4 * MM_TO_PT; // espacio tras línea

    dishes.forEach((dish) => {
      height += 5.5 * MM_TO_PT; // nombre + precio
      if (dish.description) {
        doc.setFontSize(8);
        const lines = doc.splitTextToSize(dish.description, CONTENT_WIDTH);
        height += lines.length * 4 * MM_TO_PT;
      }
      height += 5 * MM_TO_PT; // separador entre platos
    });

    height += 4 * MM_TO_PT; // espacio entre categorías
  });

  // Footer
  height += 10 * MM_TO_PT; // línea + ¡BUEN PROVECHO!
  height += 10 * MM_TO_PT; // padding inferior

  return height;
};

export const exportMenuToPDF = (
  categories: Category[],
  dishes: Dish[],
  getDishesByCategory: (id: string) => Dish[]
) => {
  // Documento temporal para medir texto
  const tempDoc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: [PAGE_WIDTH, 1000] });
  const contentHeight = calculateContentHeight(tempDoc, categories, getDishesByCategory);
  const minHeight = 120 * MM_TO_PT;
  const pageHeight = Math.max(contentHeight, minHeight);

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: [PAGE_WIDTH, pageHeight],
  });

  let y = 10 * MM_TO_PT;

  // --- HEADER ---
  // EST. 2024
  doc.setFont('times', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(80, 80, 80);
  doc.text('EST. 2024', PAGE_WIDTH / 2, y, { align: 'center' });
  y += 6 * MM_TO_PT;

  // MENÚ
  doc.setFont('times', 'bold');
  doc.setFontSize(28);
  doc.setTextColor(20, 20, 20);
  doc.text('MENÚ', PAGE_WIDTH / 2, y, { align: 'center' });
  y += 10 * MM_TO_PT;

  // EMPRENDIMIENTO FAMILIAR
  doc.setFont('times', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.text('EMPRENDIMIENTO FAMILIAR', PAGE_WIDTH / 2, y, { align: 'center' });
  y += 5.5 * MM_TO_PT;

  // Porciones para 6 personas
  doc.setFont('times', 'italic');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 100, 100);
  doc.text('Porciones para 6 personas', PAGE_WIDTH / 2, y, { align: 'center' });
  y += 6 * MM_TO_PT;

  // Línea separadora header
  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(0.8);
  doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);
  y += 6 * MM_TO_PT;

  // --- CATEGORÍAS Y PLATOS ---
  categories.forEach((category) => {
    const categoryDishes = getDishesByCategory(category.id);
    if (categoryDishes.length === 0) return;

    // Nombre categoría
    doc.setFont('times', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(20, 20, 20);
    doc.text(category.name.toUpperCase(), MARGIN, y);
    y += 1.5 * MM_TO_PT;

    // Línea bajo categoría
    doc.setDrawColor(30, 30, 30);
    doc.setLineWidth(0.4);
    doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);
    y += 5 * MM_TO_PT;

    categoryDishes.forEach((dish) => {
      const price = `$${Number(dish.price).toLocaleString('es-CL')} .-`;

      // Nombre plato
      doc.setFont('times', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(20, 20, 20);
      doc.text(dish.name.toUpperCase(), MARGIN, y);
      doc.text(price, PAGE_WIDTH - MARGIN, y, { align: 'right' });
      y += 4.5 * MM_TO_PT;

      // Descripción
      if (dish.description) {
        doc.setFont('times', 'italic');
        doc.setFontSize(8);
        doc.setTextColor(90, 90, 90);
        const lines = doc.splitTextToSize(dish.description, CONTENT_WIDTH);
        doc.text(lines, MARGIN, y);
        y += lines.length * 4 * MM_TO_PT;
      }

      y += 4 * MM_TO_PT;
    });

    y += 3 * MM_TO_PT;
  });

  // --- FOOTER ---
  const footerY = pageHeight - 10 * MM_TO_PT;
  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(0.4);
  doc.line(MARGIN, footerY - 6 * MM_TO_PT, PAGE_WIDTH - MARGIN, footerY - 6 * MM_TO_PT);

  doc.setFont('times', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(20, 20, 20);
  doc.text('— ¡BUEN PROVECHO! —', PAGE_WIDTH / 2, footerY, { align: 'center' });

  doc.save('menu-restaurante.pdf');
};

export const exportCostSheet = (categories: Category[], dishes: Dish[]) => {
  const data: any[] = [];

  data.push([
    'Categoría',
    'Nombre Plato',
    'Descripción',
    'Costo Total Ingredientes',
    'Margen %',
    'Precio Final',
  ]);

  dishes.forEach((dish) => {
    const category = categories.find((c) => c.id === dish.categoryId);
    const totalCost = dish.ingredients.reduce((sum, ing) => sum + ing.subtotal, 0);

    data.push([
      category?.name || 'Sin categoría',
      dish.name,
      dish.description,
      totalCost.toFixed(2),
      dish.margin,
      dish.price.toFixed(2),
    ]);
  });

  const ws = XLSX.utils.aoa_to_sheet(data);
  ws['!cols'] = [
    { wch: 20 },
    { wch: 25 },
    { wch: 40 },
    { wch: 20 },
    { wch: 12 },
    { wch: 15 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Planilla de Costos');
  XLSX.writeFile(wb, 'planilla-costos.xlsx');
};

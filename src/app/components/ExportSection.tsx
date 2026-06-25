import { Download, FileText, Table } from 'lucide-react';
import { Category, Dish } from '../hooks/useMenuData';
import { exportMenuToPDF, exportCostSheet } from '../utils/exportUtils';

interface ExportSectionProps {
  categories: Category[];
  dishes: Dish[];
  getDishesByCategory: (categoryId: string) => Dish[];
}

export const ExportSection = ({
  categories,
  dishes,
  getDishesByCategory,
}: ExportSectionProps) => {
  const handleExportPDF = () => {
    if (dishes.length === 0) {
      alert('No hay platos para exportar. Por favor agregue platos al menú primero.');
      return;
    }
    exportMenuToPDF(categories, dishes, getDishesByCategory);
  };

  const handleExportCostSheet = () => {
    if (dishes.length === 0) {
      alert('No hay datos para exportar. Por favor agregue platos al menú primero.');
      return;
    }
    exportCostSheet(categories, dishes);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl mb-4">Exportación</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* PDF del Menú */}
        <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border-2 border-blue-200">
          <div className="flex items-center gap-3 mb-4">
            <FileText size={32} className="text-blue-600" />
            <div>
              <h3 className="text-lg">Menú en PDF</h3>
              <p className="text-sm text-gray-600">Formato 100mm x 265mm</p>
            </div>
          </div>
          <p className="text-sm text-gray-700 mb-4">
            Genera un PDF del menú con el diseño profesional, incluyendo todos los platos actuales con nombres, descripciones y precios.
          </p>
          <button
            onClick={handleExportPDF}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
          >
            <Download size={20} />
            Descargar PDF del Menú
          </button>
        </div>

        {/* Planilla de Costos */}
        <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border-2 border-green-200">
          <div className="flex items-center gap-3 mb-4">
            <Table size={32} className="text-green-600" />
            <div>
              <h3 className="text-lg">Planilla de Costos</h3>
              <p className="text-sm text-gray-600">Formato Excel (.xlsx)</p>
            </div>
          </div>
          <p className="text-sm text-gray-700 mb-4">
            Genera un archivo Excel con el desglose de costos, márgenes y precios finales de todos los platos.
          </p>
          <button
            onClick={handleExportCostSheet}
            className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
          >
            <Download size={20} />
            Descargar Planilla de Costos
          </button>
        </div>
      </div>

      {/* Información adicional */}
      <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
        <h4 className="mb-2">Información Importante</h4>
        <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
          <li>El PDF se descargará automáticamente en su navegador</li>
          <li>La planilla Excel incluye todos los cálculos de costos e ingredientes</li>
          <li>Los archivos reflejan los datos actuales del menú</li>
          <li>Puede exportar cuantas veces necesite</li>
        </ul>
      </div>
    </div>
  );
};

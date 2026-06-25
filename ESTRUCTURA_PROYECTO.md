# Estructura del Proyecto - Sistema de Gestión de Menú

## 📁 Archivos Principales

```
/
├── src/
│   ├── app/
│   │   ├── App.tsx                          # Componente principal con pestañas
│   │   ├── hooks/
│   │   │   └── useMenuData.ts               # Hook personalizado para gestión de estado
│   │   ├── components/
│   │   │   ├── CategoryManager.tsx          # Gestión de categorías
│   │   │   ├── DishManager.tsx              # Gestión de platos
│   │   │   ├── MenuPreview.tsx              # Vista previa del menú
│   │   │   ├── PriceCalculator.tsx          # Calculadora de precios con ingredientes
│   │   │   └── ExportSection.tsx            # Sección de exportación PDF/Excel
│   │   └── utils/
│   │       └── exportUtils.ts               # Funciones para exportar PDF y Excel
│   └── styles/
│       └── [archivos de estilos Tailwind]
├── package.json                             # Dependencias del proyecto
├── INSTRUCCIONES.md                         # Manual de usuario
└── ESTRUCTURA_PROYECTO.md                   # Este archivo
```

## 🔧 Tecnologías Utilizadas

### Frontend
- **React 18.3.1** - Framework principal
- **TypeScript** - Tipado estático
- **Tailwind CSS v4** - Estilos

### Librerías
- **lucide-react** - Iconos
- **jspdf** - Generación de PDFs
- **xlsx** - Generación de archivos Excel

### Build Tool
- **Vite 6.3.5** - Bundler y dev server

## 📊 Estructura de Datos

### Category
```typescript
{
  id: string;
  name: string;
}
```

### Dish
```typescript
{
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  ingredients: Ingredient[];
  margin: number;  // Porcentaje de margen
}
```

### Ingredient
```typescript
{
  id: string;
  name: string;
  quantity: string;      // Ej: "500g", "2 unidades"
  unitPrice: number;      // Precio pagado por esa cantidad
  subtotal: number;       // Igual a unitPrice
}
```

## 🎯 Componentes Principales

### 1. App.tsx
- Componente raíz
- Sistema de pestañas (Tabs)
- Gestión de estado principal mediante `useMenuData`
- Responsive design

### 2. useMenuData Hook
**Funciones disponibles:**
- `addCategory(name)` - Crear categoría
- `updateCategory(id, name)` - Actualizar categoría
- `deleteCategory(id)` - Eliminar categoría
- `addDish(categoryId, name, description, price)` - Crear plato
- `updateDish(id, updates)` - Actualizar plato
- `deleteDish(id)` - Eliminar plato
- `addIngredient(dishId, ingredient)` - Agregar ingrediente
- `updateIngredient(dishId, ingredientId, updates)` - Actualizar ingrediente
- `deleteIngredient(dishId, ingredientId)` - Eliminar ingrediente
- `getDishById(id)` - Obtener plato por ID
- `getDishesByCategory(categoryId)` - Obtener platos de una categoría
- `resetToDefault()` - Volver a datos de ejemplo
- `clearAllData()` - Eliminar todos los datos

### 3. CategoryManager
- Crear nuevas categorías
- Editar nombres de categorías
- Eliminar categorías (con confirmación)
- Modal de edición

### 4. DishManager
- Selector de categoría
- Crear platos (nombre, descripción, precio)
- Listar platos por categoría
- Editar platos
- Eliminar platos (con confirmación)

### 5. PriceCalculator
- Selector de categoría y plato
- Tabla de ingredientes editable
- Cálculo automático:
  - Costo total de ingredientes
  - Aplicación de margen %
  - Precio sugerido
- Botón para aplicar precio al menú
- Información de ayuda

### 6. MenuPreview
- Diseño formato menú impreso
- Header perpetuo:
  - "MENÚ"
  - "EMPRENDIMIENTO FAMILIAR"
  - "Porciones para 6 personas"
- Categorías con platos
- Formato de precio: $XX .-
- Footer: "¡BUEN PROVECHO!"

### 7. ExportSection
- **PDF del Menú:**
  - Dimensiones: 100mm x 265mm
  - Diseño profesional
  - Incluye todos los elementos perpetuos
- **Planilla de Costos (Excel):**
  - Columnas: Categoría, Plato, Descripción, Costo, Margen, Precio
  - Formato .xlsx

## 💾 Persistencia de Datos

### localStorage
- Clave: `'restaurant-menu-data'`
- Guardado automático en cada cambio
- Carga automática al iniciar
- Datos de ejemplo si no existe información previa

### Datos de Ejemplo Incluidos
- 3 categorías: ENTRADAS, PLATOS PRINCIPALES, POSTRES
- 3 platos de ejemplo:
  - Ensalada César (con ingredientes)
  - Lasaña de Carne (con ingredientes)
  - Tiramisú (sin ingredientes)

## 🎨 Diseño

### Colores Principales
- Azul: Botones principales, tabs activos
- Verde: Botones de crear/agregar
- Amarillo: Botones de editar
- Rojo: Botones de eliminar
- Gris: Botones secundarios

### Responsive
- Móvil: Pestañas compactas, solo iconos + primera palabra
- Tablet: Layout adaptativo
- Desktop: Full layout con todos los elementos

## 🚀 Comandos de Desarrollo

```bash
# Instalar dependencias
npm install

# Modo desarrollo
npm run dev

# Build para producción
npm run build
```

## ✅ Características Implementadas

- ✅ Gestión completa de categorías
- ✅ Gestión completa de platos
- ✅ Calculadora de precios con ingredientes
- ✅ Cálculo automático de márgenes
- ✅ Vista previa en tiempo real
- ✅ Exportación a PDF (formato 100mm x 265mm)
- ✅ Exportación a Excel (.xlsx)
- ✅ Almacenamiento local (localStorage)
- ✅ Datos de ejemplo incluidos
- ✅ Diseño responsive
- ✅ Validaciones y confirmaciones
- ✅ Interfaz intuitiva sin jerga técnica
- ✅ Botones de reseteo y borrado
- ✅ Información de ayuda integrada

## 📝 Notas de Implementación

### Formato de Precios
- En el sistema: números (ej: 2500)
- En el menú PDF: $2500 .-

### Cálculo de Costos
- "Precio" en ingredientes = costo total de esa cantidad
- Ejemplo: 500g de algo cuesta $800 → Precio = 800
- No se calcula precio por unidad, se usa el costo total

### Persistencia
- Todo se guarda automáticamente
- No requiere botón "Guardar"
- Los datos persisten al recargar la página
- Se pierden si se borran los datos del navegador

## 🎓 Uso Recomendado

1. Explore los datos de ejemplo
2. Use "Borrar Todo" cuando esté listo para sus datos
3. Cree categorías primero
4. Agregue platos a cada categoría
5. Use la calculadora para ajustar precios
6. Revise en Vista Previa
7. Exporte cuando esté satisfecho

---

**Sistema completo y funcional - Listo para usar en producción**

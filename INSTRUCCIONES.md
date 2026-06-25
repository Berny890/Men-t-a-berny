# Sistema de Gestión de Menú de Restaurante

## Descripción
Aplicación web completa para gestionar el menú de un restaurante familiar, calcular precios con base en costos de ingredientes, y exportar a PDF y Excel.

## Características Principales

### 1️⃣ Gestor de Menú
- **Categorías**: Cree, edite y elimine categorías (Entradas, Principales, Postres, etc.)
- **Platos**: Administre platos dentro de cada categoría
  - Nombre del plato
  - Descripción
  - Precio
- **Vista en tiempo real**: Los cambios se reflejan inmediatamente

### 2️⃣ Calculadora de Precios
- **Ingredientes por plato**: Agregue todos los ingredientes de cada receta
  - Nombre del ingrediente
  - Cantidad (ej: "500g", "2 unidades", "1 litro")
  - Precio (lo que pagó por esa cantidad)
- **Cálculo automático**:
  - Suma total de costos
  - Aplicación de margen de utilidad (%)
  - Precio sugerido final
- **Sincronización**: Actualice el precio del menú con un clic

### 3️⃣ Vista Previa del Menú
- Visualización en formato profesional
- Diseño listo para imprimir
- Actualización automática

### 4️⃣ Exportación

#### PDF del Menú
- Formato: 100mm x 265mm (ideal para menús de mesa)
- Incluye:
  - Título "MENÚ"
  - Subtítulo "EMPRENDIMIENTO FAMILIAR"
  - Nota "Porciones para 6 personas"
  - Todas las categorías y platos
  - Formato de precios: $[número] .-
  - Footer "¡BUEN PROVECHO!"

#### Planilla de Costos (Excel)
- Columnas incluidas:
  - Categoría
  - Nombre del Plato
  - Descripción
  - Costo Total de Ingredientes
  - Margen %
  - Precio Final

## Almacenamiento
- **LocalStorage**: Todos los datos se guardan automáticamente en su navegador
- **Sin servidor**: No necesita conexión a internet después de cargar
- **Persistente**: Los datos permanecen aunque cierre el navegador

## Botones de Administración

### Restaurar Ejemplo
- Vuelve a cargar los datos de ejemplo iniciales
- Útil para empezar de nuevo o ver cómo funciona

### Borrar Todo
- Elimina TODOS los datos
- Deja la aplicación en blanco para empezar desde cero

## Cómo Usar

### Primer Uso
1. La aplicación carga con datos de ejemplo
2. Explore cada sección para familiarizarse
3. Cuando esté listo, use "Borrar Todo" para empezar con sus datos

### Flujo de Trabajo Recomendado
1. **Crear Categorías** (ej: Entradas, Principales, Postres)
2. **Agregar Platos** a cada categoría
3. **Calcular Precios**:
   - Seleccione un plato
   - Agregue todos los ingredientes
   - Ajuste el margen de utilidad
   - Aplique el precio sugerido
4. **Revisar** en Vista Previa
5. **Exportar** PDF y Planilla de Costos

## Consejos

### Para la Calculadora de Precios
- Sea específico con las cantidades: "500g", no solo "500"
- En "Precio", ponga lo que pagó por ESA cantidad completa
- Margen típico para restaurantes: 30-50%
- Ejemplo:
  - Ingrediente: Tomates
  - Cantidad: 1kg
  - Precio: $800 (lo que pagó por 1kg)

### Para el PDF
- El formato 100mm x 265mm es ideal para menús de mesa delgados
- Asegúrese de revisar la Vista Previa antes de exportar

### Para la Planilla de Costos
- Use Excel o Google Sheets para abrir el archivo
- Útil para análisis de rentabilidad
- Puede modificar el archivo descargado según necesite

## Seguridad y Privacidad
- **100% local**: Sus datos NUNCA salen de su computadora
- **Sin cuenta**: No requiere registro ni login
- **Gratuito**: No hay costos ocultos

## Compatibilidad
- Funciona en cualquier navegador moderno (Chrome, Firefox, Safari, Edge)
- Responsivo: se adapta a tablets y móviles
- No requiere instalación

## Soporte
Si borra los datos del navegador (caché), perderá la información guardada. Recomendamos:
1. Exportar regularmente la Planilla de Costos
2. Hacer capturas de pantalla de configuraciones importantes

---

**¡Listo para usar! Abra la aplicación en su navegador y comience a gestionar su menú.**

# 🍽️ Guía Rápida de Uso

## ¿Qué hace esta aplicación?

Gestiona el menú de tu restaurante, calcula precios basados en costos de ingredientes, y exporta el menú a PDF para imprimir.

---

## 📋 4 Secciones Principales

### 1️⃣ GESTOR DE MENÚ

**¿Qué puedo hacer aquí?**
- Crear categorías (Entradas, Principales, Postres, etc.)
- Agregar platos a cada categoría
- Editar nombres, descripciones y precios
- Eliminar lo que ya no necesites

**Ejemplo:**
```
Categoría: ENTRADAS
  ├─ Ensalada César - Lechuga, crutones... - $2500
  └─ Empanadas - Masa casera rellena... - $1800
```

---

### 2️⃣ CALCULADORA DE PRECIOS

**¿Para qué sirve?**
Te ayuda a calcular el precio correcto de cada plato basándose en:
- Lo que gastas en ingredientes
- El porcentaje de ganancia que quieres

**Cómo usarla:**

1. **Selecciona categoría y plato**
2. **Agrega ingredientes:**
   - Nombre: "Tomates"
   - Cantidad: "1kg"
   - Precio: $800 ← *Lo que PAGASTE por 1kg*
3. **Ajusta el margen de ganancia:** 40% (típico para restaurantes)
4. **La app calcula automáticamente:**
   - Costo total: $3500
   - + 40% ganancia: $1400
   - = Precio sugerido: $4900
5. **Aplica el precio al menú** con un clic

**💡 Consejo:** Un margen del 30-50% es común en restaurantes.

---

### 3️⃣ VISTA PREVIA

**¿Qué veo aquí?**
Tu menú tal como se verá impreso:
- Título "MENÚ"
- Tu nombre "EMPRENDIMIENTO FAMILIAR"
- Todas las categorías y platos
- Precios con formato $XXX .-
- Footer "¡BUEN PROVECHO!"

**¡Lo que ves aquí es lo que saldrá en el PDF!**

---

### 4️⃣ EXPORTACIÓN

#### 📄 PDF del Menú
- **Tamaño:** 100mm x 265mm (delgado, vertical)
- **Para:** Imprimir y poner en las mesas
- **Incluye:** Todo el menú formateado

#### 📊 Planilla de Costos (Excel)
- **Para:** Analizar tu negocio
- **Incluye:** Costos, márgenes y precios de todos los platos
- **Formato:** .xlsx (Excel)

---

## 🚀 Flujo de Trabajo Recomendado

```
1. GESTOR → Crea categorías
            ↓
2. GESTOR → Agrega platos
            ↓
3. CALCULADORA → Calcula precios con ingredientes
            ↓
4. VISTA PREVIA → Revisa que todo se vea bien
            ↓
5. EXPORTACIÓN → Descarga PDF y/o Excel
```

---

## ⚡ Inicio Rápido (3 pasos)

### Primera vez usando la app:

**Paso 1:** Explora el ejemplo
- La app viene con datos de ejemplo
- Navega por las 4 pestañas
- Prueba a editar algo

**Paso 2:** Comienza con tus datos
- Click en "Borrar Todo" (abajo)
- Crea tu primera categoría
- Agrega tu primer plato

**Paso 3:** Calcula y exporta
- Ve a Calculadora de Precios
- Agrega ingredientes a un plato
- Exporta tu PDF

---

## 💾 ¿Dónde se guardan mis datos?

- **En tu navegador** (localStorage)
- **Automáticamente** - no hay botón "Guardar"
- **Persisten** aunque cierres el navegador
- **⚠️ IMPORTANTE:** Si borras los datos del navegador, pierdes todo

**Recomendación:** Exporta la Planilla de Costos regularmente como respaldo.

---

## 🎯 Ejemplos Prácticos

### Ejemplo 1: Calcular precio de Lasaña

**Ingredientes:**
```
Pasta lasaña     | 500g      | $900
Carne molida     | 1kg       | $3500
Salsa tomate     | 1 lata    | $600
Queso mozzarella | 300g      | $1800
```

**Cálculo:**
- Costo total: $6800
- Margen 40%: $2720
- **Precio sugerido: $9520**

### Ejemplo 2: Estructurar tu menú

```
📁 ENTRADAS
   • Ensalada mixta
   • Empanadas
   
📁 PLATOS PRINCIPALES
   • Lasaña de carne
   • Pollo al horno
   • Milanesa con papas
   
📁 POSTRES
   • Tiramisú
   • Flan casero
```

---

## 🔧 Botones Especiales (abajo de todo)

### 🔄 Restaurar Ejemplo
- Vuelve a los datos de ejemplo
- Útil si quieres practicar de nuevo
- **⚠️ Borra tus datos actuales**

### 🗑️ Borrar Todo
- Elimina TODO
- Deja la app vacía
- Úsalo cuando empieces con tus datos reales

---

## ❓ Preguntas Frecuentes

**P: ¿Necesito internet?**
R: Solo para cargar la primera vez. Después funciona sin conexión.

**P: ¿Se guardan mis datos?**
R: Sí, automáticamente en tu navegador.

**P: ¿Puedo usar esto en mi celular?**
R: Sí, es responsive y funciona en cualquier dispositivo.

**P: ¿El PDF se puede imprimir?**
R: Sí, está optimizado para impresión en tamaño 100mm x 265mm.

**P: ¿Puedo cambiar los textos "MENÚ" o "EMPRENDIMIENTO FAMILIAR"?**
R: No, son elementos perpetuos del diseño. Solo puedes cambiar categorías y platos.

**P: ¿Qué pasa si borro el navegador?**
R: Pierdes los datos. Por eso es importante exportar regularmente.

---

## 🎨 Código de Colores

- 🔵 **Azul** → Acciones principales
- 🟢 **Verde** → Crear/Agregar nuevo
- 🟡 **Amarillo** → Editar
- 🔴 **Rojo** → Eliminar
- ⚪ **Gris** → Acciones secundarias

---

## 📱 Atajos de Teclado

- **Enter** → Confirma inputs al crear categorías/platos
- **Tab** → Navega entre campos
- **Esc** → Cierra modales

---

## ✅ Checklist para tu Primer Menú

- [ ] Borrar datos de ejemplo
- [ ] Crear 3 categorías
- [ ] Agregar 5-10 platos
- [ ] Calcular precios de al menos 3 platos
- [ ] Revisar Vista Previa
- [ ] Descargar PDF
- [ ] Descargar Planilla de Costos
- [ ] ¡Imprimir y usar!

---

**¡Listo! Ya puedes gestionar tu menú profesionalmente. 🎉**

*¿Dudas? Lee INSTRUCCIONES.md para más detalles.*

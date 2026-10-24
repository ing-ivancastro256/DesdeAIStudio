# Control de Ancho en Sección Externa, Jerarquía de Anchos en Cascada y Degradado de 2 Colores

Este plan incorpora el control completo de **Ancho de la Sección Externa** (`En Caja` / `100% Ancho`, deslizador y presets), establece una jerarquía estricta de anchos en cascada donde ningún contenedor interno puede superar a su contenedor padre (**Canvas ≥ Sección Externa ≥ Bloque Div / Sección Interna**), y moderniza el fondo en degradado de la Sección Externa permitiendo elegir dos colores personalizados junto a los estilos por defecto sin campos de código CSS.

## Decisiones Confirmadas y Revisión del Usuario

> [!IMPORTANT]
> Se aplican las tres decisiones confirmadas para el comportamiento visual y el diseño del panel de propiedades:
> - **Comportamiento visual de la Sección Externa en modo `En Caja`**: Al establecer un ancho menor que el del Canvas, se achica toda la caja exterior de la Sección Externa (incluyendo su color de fondo, degradado o imagen, superposición y bordes) manteniéndose centrada horizontalmente dentro del lienzo.
> - **Ubicación en el panel de Sección Externa**: El nuevo grupo desplegable **Ancho de la Sección Externa** se ubica en primer lugar arriba de todo, justo antes de **Fondo de la Sección**, abierto por defecto al igual que el resto de grupos.
> - **Degradado en Sección Externa**: Se conservan los estilos rápidos predefinidos, se añaden los **dos selectores de color** (`Color inicial (1)` y `Color final (2)`) con el mismo diseño directo que en Columnas, y se elimina por completo el cuadro de texto `CSS Personalizado`.

---

## 1. Visión General y Concepto Central

- **Qué resuelve**:
  1. Permite redimensionar el ancho propio de cualquier **Sección Externa** (por ejemplo, el Hero principal o cualquier bloque de sección) alternando entre `100% Ancho` (comportamiento actual que ocupa todo el Canvas) y `En Caja` con medida exacta en píxeles centrada en el lienzo.
  2. Garantiza coherencia geométrica absoluta en toda la estructura anidada de la página: el **Canvas** gobierna el tope máximo de la **Sección Externa**, y a su vez la **Sección Externa** gobierna el tope máximo de cualquier **Bloque Div / Sección Interna** contenido dentro de ella.
  3. Facilita la personalización de fondos degradados en la Sección Externa mediante selectores visuales de dos colores sincronizados con los presets rápidos, retirando el campo técnico de CSS manual.
- **Usuarios y contexto**: Creadores de páginas y embudos que diseñan secciones con fondos de color o degradados acotados respecto al lienzo general y necesitan que todos los bloques internos respeten automáticamente las dimensiones del contenedor que los envuelve.
- **Valor principal**: Control total de encuadre en cada nivel jerárquico (`Canvas` → `Sección Externa` → `Bloque Div`), fidelidad idéntica entre Modo Edición y Vista Previa, y edición visual sin fricción técnica.

---

## 2. Experiencia de Usuario y Diseño Visual

### Flujos Clave de Interacción
1. **Control de Ancho de la Sección Externa**:
   - Al seleccionar una Sección Externa en el lienzo o desde Estructura, el primer grupo desplegado arriba en el inspector es **Ancho de la Sección Externa**.
   - Incluye dos botones de modo: **`En Caja`** y **`100% Ancho`** (las secciones existentes sin medida fija inician en `100% Ancho` para respetar el ancho actual del Canvas; al activar `En Caja` adoptan una medida inicial acotada al Canvas, como `1200px` o el máximo permitido por el lienzo).
   - En modo `En Caja`, se muestran el deslizador continuo con entrada numérica en `px` y los botones de presets rápidos (`720px`, `960px`, `1140px`, `1200px`, `1440px`), deshabilitando u ocultando límites que superen el ancho gobernante del Canvas.
   - En el lienzo (tanto en Edición como en Vista Previa), la caja completa de la Sección Externa se ajusta a ese ancho y se centra horizontalmente con su fondo y bordes.
2. **Concordancia en Cascada (`Canvas` → `Sección Externa` → `Bloque Div`)**:
   - Si el **Canvas** se reduce (ej. a `960px`), cualquier Sección Externa que tuviera `1200px` se ajusta automáticamente a `960px`.
   - Si una **Sección Externa** se reduce (ej. a `800px`), cualquier **Bloque Div / Sección Interna** (incluidos bloques anidados) dentro de esa sección cuyo ancho supere `800px` se recorta automáticamente a `800px`, y su propio inspector pasa a mostrar `800px` como tope máximo gobernado por la Sección Externa.
3. **Degradado Visual de 2 Colores en Fondo de la Sección**:
   - Dentro de **Fondo de la Sección → Degradado**, el usuario dispone de la tarjeta **Degradado de 2 colores** con los selectores visuales **`Color inicial (1)`** y **`Color final (2)`** (selector cromático + código hexadecimal), idénticos a los de Columnas.
   - Debajo se mantienen los **Estilos rápidos** por defecto; al pulsar cualquiera de ellos, se aplica el degradado a la sección y se sincronizan automáticamente ambos selectores de color para que el usuario pueda partir de un preset y ajustar cualquiera de sus dos tonos.
   - El campo inferior `CSS Personalizado` desaparece por completo.

### Identidad Visual y Precisión Espacial
- **Dirección estética**: Paneles de inspección oscuros de alto contraste (`#1e293b` / `#0f172a` con acentos azul/índigo en estados activos), todos los acordeones abiertos por defecto sin controles colapsados ocultos.
- **Tipografía y cifras tabulares**: Valores numéricos de ancho (`px`) renderizados con `tabular-nums` / `font-mono` para mantener alineación estable al deslizar controles de dimensión, y etiquetas de botones en una sola línea (`whitespace-nowrap`).
- **Retroalimentación inmediata**: Ajuste en tiempo real (`< 150ms`) de la caja de la Sección Externa y de sus Bloques Div hijos tanto al arrastrar el deslizador como al pulsar un preset.

---

## 3. Decisiones de Producto y Razonamiento

- **Achicar y centrar la caja completa de la Sección Externa**:
  - *Enfoque elegido*: Aplicar el `maxWidth` y centrado horizontal (`margin: auto` cuando no hay margen lateral explícito) directamente sobre el contenedor raíz de la Sección Externa en vistas de escritorio.
  - *Por qué*: Permite que al asignar un color sólido, degradado o imagen de fondo a una Sección Externa en modo `En Caja`, dicho fondo se vea contenido dentro del ancho elegido dejando visible el lienzo exterior alrededor, exactamente igual que ocurre con un Bloque Div respecto a su sección.
  - *Alternativa descartada*: Restringir únicamente un contenedor interno invisible manteniendo el fondo al 100%, lo cual impediría ver el recorte real del fondo de la sección cuando el usuario busca encajonarla.
- **Propagación descendente automática de límites de ancho**:
  - *Enfoque elegido*: Evaluar en cascada `Límite Canvas` → `Límite Efectivo de cada Sección Externa` → `Límite Efectivo de sus Bloques Div`, recortando de inmediato en el estado cualquier valor hijo que quede por encima cuando cambia un contenedor superior.
  - *Por qué*: Evita estados inconsistentes donde un bloque interno afirme medir `1140px` dentro de una sección de `800px` o un lienzo de `640px`.
- **Unificación del selector de Degradado con el estándar de Columnas**:
  - *Enfoque elegido*: Combinar los dos selectores `Color inicial (1)` y `Color final (2)` (en ángulo diagonal suave de `135deg`) con la galería de presets existentes y eliminar la caja de texto CSS.
  - *Por qué*: Mantiene un lenguaje visual idéntico entre Columnas y Sección Externa y elimina código técnico innecesario de la interfaz.

---

## 4. Arquitectura Técnica y Estrategia de Estado

### Diagrama de Jerarquía de Anchos y Sincronización

```
┌────────────────────────────────────────────────────────────────────────────┐
│ 1. CANVAS PRINCIPAL (Lienzo de Página)                                     │
│    Límite Canvas = Ancho en Caja (ej. 1200px / 640px) o Ancho Real (100%)  │
└─────────────────────────────────────┬──────────────────────────────────────┘
                                      │ Gobierna (Ancho Sección ≤ Límite Canvas)
                                      ▼
┌────────────────────────────────────────────────────────────────────────────┐
│ 2. SECCIÓN EXTERNA                                                         │
│    • Inspector (Grupo #1 arriba): Ancho de la Sección Externa              │
│      [En Caja | 100% Ancho] + Slider + Presets ≤ Límite Canvas             │
│    • Inspector (Grupo #2): Fondo de la Sección                             │
│      Degradado = Color Inicial (1) + Color Final (2) + Presets (sin CSS)   │
│    • Renderizado en Caja: Caja completa con fondo centrada en el Canvas    │
│    • Límite Sección = En Caja ? min(Ancho Sección, Límite Canvas)          │
│                               : Límite Canvas                              │
└─────────────────────────────────────┬──────────────────────────────────────┘
                                      │ Gobierna (Ancho Bloque Div ≤ Límite Sección)
                                      ▼
┌────────────────────────────────────────────────────────────────────────────┐
│ 3. BLOQUE DIV / SECCIÓN INTERNA (y Contenedores Anidados)                  │
│    • Inspector: Tope máximo dinámico = Límite Sección padre                │
│    • Recorte automático si Límite Sección o Límite Canvas disminuye        │
└────────────────────────────────────────────────────────────────────────────┘
```

### Modelo de Datos y Estado
- **Propiedades de Sección Externa**:
  - `widthType`: `'boxed' | 'full'` (por defecto `'full'` en secciones existentes sin ancho numérico definido para preservar compatibilidad visual inmediata).
  - `maxWidth`: medida numérica en píxeles cuando opera en modo `'boxed'`, siempre acotada a `Límite Canvas`.
  - `bgGradientColor1` y `bgGradientColor2`: colores hexadecimales inicial y final del degradado de la sección, sincronizados bidireccionalmente con la propiedad de degradado renderizada (`linear-gradient(135deg, color1 0%, color2 100%)`) y con los presets rápidos.

### Mapeo Interactivo de Componentes y Manejadores
- **Actualización de Sección Externa**:
  - Al cambiar `widthType` a `'boxed'` o reducir `maxWidth` en la Sección Externa, el manejador de actualización valida primero que no exceda el `Límite Canvas` y recorre en el mismo paso todas las filas (`Bloque Div`) y contenedores internos anidados de esa sección para ajustar cualquier `maxWidth` hijo que supere el nuevo ancho de la sección.
- **Actualización del Canvas Global**:
  - Cuando disminuye el `Límite Canvas`, el efecto de normalización ajusta primero las Secciones Externas en caja que excedan el lienzo y, acto seguido, ajusta los Bloques Div internos respecto al límite efectivo resultante de su respectiva Sección Externa.
- **Inspector del Bloque Div**:
  - Recibe como límite máximo gobernante el ancho efectivo de la Sección Externa que lo contiene (e informa claramente en su nota inferior si el tope proviene de la Sección Externa o del Canvas).
- **Fidelidad Edición / Publicación**:
  - Tanto el lienzo del Editor Visual (en escritorio y vista previa de plantillas) como la vista pública publicada aplican la misma regla de ancho máximo y centrado exterior sobre la caja de la Sección Externa, manteniendo `100%` fluido en vista móvil (`390px`) para preservar la adaptabilidad responsiva.

# Biblioteca de Plantillas y Bloques (Scale 6 Pro)

Este módulo incorpora un almacén centralizado e independiente dentro del editor visual para guardar, organizar por categorías, marcar en favoritos, editar de forma aislada, clonar e insertar **Plantillas** (páginas completas) y **Bloques** (secciones exteriores), con una arquitectura ya escalable para incorporar más adelante Pop-ups, Elementos sueltos, Páginas Web e Imágenes.

---

## Decisiones Confirmadas y Reglas Críticas

> [!IMPORTANT]
> **Preferencias confirmadas por ti en la fase de consulta:**
> - **Punto de acceso principal**: La ventana de **Biblioteca** se abrirá desde la **barra superior del editor visual** (y adicionalmente podrás guardar desde el ícono de disquete en cada sección exterior o desde el botón de guardar lienzo completo).
> - **Contenido inicial precargado**: Al abrir la Biblioteca por primera vez ya vendrán incluidas las **plantillas de página y bloques prearmados actuales del sistema**, sumados a todas las plantillas y bloques que vayas guardando y creando.
> - **Pestañas activas en columna TIPO**: Se mostrarán limpiamente las **3 vistas activas hoy** (`Plantillas`, `Bloques` y `Favoritos`), dejando el modelo de datos listo por debajo para activar `Pop-ups`, `Elementos` y `Páginas Web` en siguientes iteraciones sin rehacer nada.

> [!NOTE]
> **Independencia total entre Biblioteca y Páginas en uso (Clonación Profunda):**
> Cuando insertas una Plantilla o un Bloque en una página de tu embudo (o cuando guardas una sección/página hacia la Biblioteca), se genera una **copia profunda independiente** con nuevos identificadores internos. Si más adelante entras a la Biblioteca y editas o eliminas esa Plantilla o Bloque, **jamás se modificará ni romperá** ninguna página donde lo hayas insertado anteriormente.

---

## 1. Visión General y Concepto Central

- **Qué hace**: Permite reutilizar tu trabajo de diseño en segundos. Cualquier sección exterior que diseñes con imágenes, formularios, colores y columnas puede guardarse con un clic como **Bloque** (o **Plantilla**), y cualquier página terminada del embudo puede guardarse completa como **Plantilla**.
- **Para quién y en qué flujo**: Creadores de embudos en Scale 6 Pro que desean construir su propio repositorio de secciones de alta conversión y páginas maestras listas para insertar en nuevos pasos o embudos.
- **Valor clave**: Elimina rehacer secciones desde cero, mantiene categorías personalizadas ordenadas, permite destacar recursos frecuentes con **Favoritos** (`♥`) y ofrece un **Modo de Edición de Plantilla / Bloque** dedicado dentro del mismo constructor visual.

---

## 2. Experiencia de Usuario y Diseño Visual

### A. Nuevos Puntos de Guardado Rápido (Ícono de Disquete)
1. **En cada Sección Exterior del lienzo**:
   - En la barra flotante superior derecha de cada sección exterior, **justo antes de la tuerca de configuración**, aparecerá el nuevo botón con ícono de **Disquete (`Guardar en Biblioteca`)**.
   - Al hacer clic desde una sección exterior, se abre la **Ventana 1 (Guardar en Biblioteca)** con la vista previa real de esa sección y la opción **Bloque** preseleccionada por defecto (pudiendo cambiar a **Plantilla** si deseas).
2. **En el Canvas Completo / Barra de Página**:
   - Junto a los controles superiores del lienzo (y en el panel de Ajustes de Canvas Completo), tendrás un botón con ícono de **Disquete (`Guardar página como Plantilla`)** que abre la **Ventana 1** capturando todas las secciones y estilos globales de la página actual con **Plantilla** seleccionada.

### B. Ventana 1 — Modal "Guardar en Biblioteca" (Fiel a tu Imagen 1, 100% en Español)
- **Cabecera limpia**: Título `BIBLIOTECA` a la izquierda y botón cerrar (`×`) a la derecha.
- **Encabezado central**: Ícono de guardado en bandeja, titular *"Guarda esta Sección en tu biblioteca de Plantillas"* (o *"Guarda esta Página en tu biblioteca de Plantillas"* cuando guardas todo el canvas) y subtítulo explicativo: *"Las plantillas guardadas se pueden cargar fácilmente en tus páginas. Actualizar una plantilla no afectará al contenido publicado."*
- **Columna Izquierda — Vista Previa Rectangular con Scroll Vertical**:
  - Contenedor rectangular gris claro con el lienzo escalado proporcionalmente al 100% del ancho del recuadro para que se vea nítido tal como luce la sección o página real.
  - Si la sección o página es alta, el recuadro mantiene una altura fija cómoda y habilita **desplazamiento vertical interno suave** para inspeccionar todo el diseño de arriba a abajo.
- **Columna Derecha — Formulario de Guardado**:
  - **Guardar Como**: Selector segmentado de dos botones claros: `Plantilla` | `Bloque`.
    - Si eliges `Plantilla`, la etiqueta inferior cambia dinámicamente a **Nombre de Plantilla** y el botón principal dice **Guardar nueva plantilla**.
    - Si eliges `Bloque`, cambia dinámicamente a **Nombre de Bloque** y el botón principal dice **Guardar nuevo bloque**.
  - **Buscador / Validación en vivo de nombre**: Muestra debajo del input si ya existe algún elemento guardado con nombre similar en tu biblioteca para evitar duplicados accidentales.
  - **Categoría inteligente (Seleccionar o Crear al vuelo)**:
    - Por defecto muestra `Sin categoría`.
    - Al desplegar, lista todas tus categorías existentes (ej. `Sin categoría`, `Cabeceras`, `Formularios`, `Testimonios`, `Carta de Ventas`, etc.).
    - Permite **escribir directamente una categoría nueva** en un campo rápido con botón **`+ Agregar nueva categoría`**, dejándola creada y seleccionada al instante.

### C. Ventana 2 — Almacén Principal "BIBLIOTECA" (Fiel a tu Imagen 2 + Mejoras de Usabilidad)
- **Acceso desde la barra superior del Editor Visual**: El botón `Biblioteca` abre la ventana amplia de gestión e inserción.
- **Barra Lateral Izquierda de la Biblioteca**:
  - **Buscador instantáneo (`Buscar...`)** con filtrado en tiempo real por nombre o categoría (ubicado arriba para acceso inmediato, complementado con filtro rápido por categoría en la cabecera del listado).
  - **Sección `TIPO` con contadores numéricos tabulares**:
    - `Plantillas` *(contador total)*
    - `Bloques` *(contador total)*
    - `Favoritos` *(contador de marcados con corazón ♥)*
- **Área Principal de Tarjetas (Grid de 3 columnas en escritorio)**:
  - Cabecera con el título de la vista activa (`Plantillas`, `Bloques` o `Favoritos`) + filtro desplegable por **Categoría** (`Todas las categorías`, `Sin categoría`, o cualquiera creada por ti) para encontrar recursos rápido cuando tengas muchos.
  - **Cada tarjeta muestra**:
    1. **Fila superior de tarjeta**: Nombre de la plantilla/bloque a la izquierda; a la derecha el **botón de Corazón (`♥`)** para marcar/desmarcar **Favorito** con un clic (permanece visible en su pestaña original y aparece también en `Favoritos`) seguido del **botón de tres puntitos (`⋮`)**.
    2. **Menú de tres puntitos (`⋮`)**:
       - `Editar`: Abre el **Modo Edición de Plantilla / Bloque** en el constructor visual.
       - `Clonar / Duplicar`: Crea inmediatamente una copia exacta (`Nombre (Copia)`) dentro de la Biblioteca.
       - `Renombrar / Cambiar categoría` *(mejora práctica rápida sin tener que entrar al editor completo)*.
       - `Eliminar`: Pide confirmación breve y la retira de la Biblioteca sin afectar páginas donde ya fue usada.
    3. **Recuadro rectangular de Vista Previa**: Miniatura fiel en vivo de la sección o página (con scroll vertical al pasar el cursor si es larga, y borde resaltado cuando seleccionas la tarjeta para insertarla).
- **Barra Inferior con Botón `Agregar` (Esquina Inferior Derecha)**:
  - Al hacer clic sobre una tarjeta queda seleccionada (con marco azul nítido y resumen del ítem elegido en el pie del modal), habilitando abajo a la derecha el botón principal **`Agregar`** (además de permitir doble clic rápido si lo prefieres).
  - **Comportamiento al hacer clic en `Agregar`**:
    - **Si es un Bloque**: Inserta la sección clonada **al final de la página actual** donde estás trabajando y hace scroll suave hacia ella.
    - **Si es una Plantilla**:
      - Si el lienzo actual está vacío (sin secciones o sin elementos), **carga toda la plantilla directamente sin preguntar**.
      - Si el lienzo actual ya tiene contenido trabajado, muestra un **aviso claro de confirmación** indicando que la plantilla sustituirá el contenido actual del lienzo antes de aplicarla.

### D. Modo Dedicado de "Edición de Plantilla / Bloque"
- Cuando eliges **`Editar`** en el menú de tres puntitos (`⋮`) de cualquier Plantilla o Bloque de la Biblioteca:
  - El editor visual entra en un modo claramente identificado en la barra superior con un distintivo ámbar/azul: **`Edición de Plantilla: [Nombre]`** o **`Edición de Bloque: [Nombre]`**.
  - Dispones de todas las herramientas del constructor (inspector lateral, estilos, columnas, formularios, imágenes, deshacer/rehacer).
  - En la esquina superior derecha aparecen dos botones claros: **`Volver sin guardar`** y **`Guardar cambios en Biblioteca`**.
  - Al guardar, se actualiza únicamente el registro maestro dentro de la Biblioteca y regresas intacto a la página del embudo en la que estabas trabajando antes.

### E. Identidad Visual y Tipografía
- **Estética**: Superficies limpias de SaaS profesional en blanco puro (`#FFFFFF`), grises neutros estructurales (`#F4F4F5` / `#E4E4E7`), acento primario azul Scale 6 Pro (`#2848F0`) para selección activa y verde esmeralda (`#16A34A` / `#4CAF50`) en la confirmación de guardado fiel a tus capturas de referencia.
- **Tipografía**: `Poppins` en cabeceras y títulos de sección; textos limpios de alta legibilidad y numerales tabulares (`tabular-nums`) en los contadores laterales de la Biblioteca.

---

## 3. Decisiones Clave de Producto y Arquitectura

- **Escalabilidad preparada para los 6 tipos planeados**:
  - *Enfoque elegido*: Definir desde hoy la entidad universal de Biblioteca soportando el campo `kind: 'template' | 'block' | 'popup' | 'element' | 'webpage' | 'image'` junto con `isFavorite: boolean` y `category: string`, mostrando en la interfaz actual únicamente `Plantillas`, `Bloques` y `Favoritos`.
  - *Por qué*: Cuando en las próximas fases activemos Pop-ups, Elementos con estilo propio, Páginas Web e Imágenes, se conectarán sobre el mismo motor de almacenamiento, buscador, categorías y favoritos sin migraciones ni retrabajo.
- **Vista Previa Real Escalada en Rectángulo (con Scroll Vertical)**:
  - *Enfoque elegido*: Renderizar una vista previa en miniatura real y escalada por proporción CSS del árbol de secciones/elementos dentro de un marco rectangular de ancho fijo y `overflow-y: auto`.
  - *Por qué*: A diferencia de íconos genéricos estáticos, ves los colores, textos, botones y formularios reales que diseñaste, y si una plantilla completa tiene 5 o 6 secciones puedes recorrerla verticalmente antes de guardarla o insertarla.
- **Persistencia Local Automática + Semilla del Sistema**:
  - *Enfoque elegido*: Sincronizar la Biblioteca y las Categorías personalizadas en `localStorage` combinadas en el primer arranque con las plantillas y bloques prearmados actuales del sistema.
  - *Por qué*: Tus bloques, plantillas nuevas, ediciones, nombres y favoritos persisten aunque recargues el navegador, y nunca pierdes tus recursos guardados.

---

## 4. Arquitectura Técnica y Flujo de Datos

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                     ESTADO GLOBAL DE BIBLIOTECA (AppContext)                 │
│  • libraryItems[] (id, kind: 'template'|'block'|..., name, category,         │
│                    isFavorite, sections[], pageSettings?, updatedAt)         │
│  • libraryCategories[] ('Sin categoría', 'Cabeceras', 'Ventas', + creadas)   │
│  • Acciones: saveItem, updateItem, duplicateItem, deleteItem, toggleFavorite │
└───────────────────┬──────────────────────────────────────┬───────────────────┘
                    │                                      │
        ┌───────────▼───────────┐              ┌───────────▼───────────┐
        │   DISPARADORES SAVE   │              │  BARRA SUPERIOR EDITOR│
        │ • Disquete en Sección │              │ • Botón "Biblioteca"  │
        │   Exterior (->Bloque) │              │ • Disquete de Página  │
        └───────────┬───────────┘              └───────────┬───────────┘
                    │                                      │
        ┌───────────▼───────────┐              ┌───────────▼───────────┐
        │  MODAL 1: GUARDAR EN  │              │  MODAL 2: BIBLIOTECA  │
        │      BIBLIOTECA       │              │  • Buscador + Categoría│
        │ • Preview Rectangular │              │  • Tipo: Plantillas / │
        │   con scroll vertical │              │    Bloques / Favoritos│
        │ • Selector Plantilla  │              │  • Tarjetas: ♥ y (⋮)  │
        │   o Bloque            │              │    Editar|Clonar|Elim │
        │ • Categoría + Crear   │              │  • Botón inf-der:     │
        │   nueva categoría     │              │    [ Agregar ]        │
        └───────────────────────┘              └─────┬───────────┬─────┘
                                                     │           │
                              ┌──────────────────────┘           └─────────────────────┐
                              ▼                                                        ▼
             ┌─────────────────────────────────┐                      ┌─────────────────────────────────┐
             │     INSERCIÓN POR CLONACIÓN     │                      │   MODO EDICIÓN AISLADA EN VIVO  │
             │ • Bloque -> Clona e inserta al  │                      │ • Carga copia del ítem en el    │
             │   final de la página actual     │                      │   lienzo con barra "Edición de  │
             │ • Plantilla -> Directo si lienzo│                      │   Plantilla / Bloque"           │
             │   vacío; pide confirmación si   │                      │ • Guarda solo en Biblioteca sin │
             │   ya existen elementos          │                      │   alterar páginas ya publicadas │
             └─────────────────────────────────┘                      └─────────────────────────────────┘
```

### Mapeo Interactivo de Componentes y Estados
1. **Guardado desde Sección o Página**:
   - Al pulsar el disquete de una sección exterior, se clona esa sección en memoria y se abre el Modal 1 con `Guardar Como = Bloque` y el nombre sugerido de la sección.
   - Al pulsar el disquete de página completa, se clonan todas las secciones + ajustes globales de página y se abre el Modal 1 con `Guardar Como = Plantilla`.
   - Al crear una nueva categoría desde el selector, se valida que no esté vacía ni repetida, se añade a `libraryCategories` y queda asignada automáticamente.
2. **Exploración, Favoritos y Gestión en Biblioteca**:
   - El buscador y el selector de categoría filtran instantáneamente la pestaña activa (`Plantillas`, `Bloques` o `Favoritos`).
   - El clic en el corazón (`♥`) alterna `isFavorite` sin sacar el elemento de su categoría original y actualiza en vivo el contador de `Favoritos`.
   - El menú contextual (`⋮`) ejecuta `Clonar` (copia profunda inmediata), `Renombrar / Categoría` (edición rápida en tarjeta), `Eliminar` (con confirmación segura) o `Editar` (abre el modo aislado).
3. **Inserción Segura y Modo Edición Aislada**:
   - `Agregar` genera nuevos IDs únicos para cada sección, fila, columna y elemento insertado para garantizar aislamiento absoluto frente a futuras ediciones.
   - En **Modo Edición de Plantilla / Bloque**, el editor guarda temporalmente el estado de la página del embudo en segundo plano; al pulsar `Guardar cambios en Biblioteca`, actualiza únicamente el ítem de la Biblioteca y restaura tu página del embudo exactamente donde la dejaste.

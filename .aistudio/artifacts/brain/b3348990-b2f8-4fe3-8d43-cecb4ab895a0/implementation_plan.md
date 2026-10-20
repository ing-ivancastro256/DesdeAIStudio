# Plan de Configuración Global de Página (Canvas) y Sección Interna (Contenedor de Filas)

Sistema integral de configuración estilo Elementor / WordPress para Scale Sales Pro: control del ancho total vs. boxed del lienzo, catálogo ampliado de 14 Google Fonts, diseño global (colores, fuentes y tamaños por defecto H1-H4) y selección e inspección de secciones internas con espaciados y estilos independientes.

## Decisiones Críticas y Preferencias Confirmadas

> [!IMPORTANT]
> Decisiones confirmadas por el usuario en la fase de clarificación:
> - **Acceso a Configuración de Página**: Pestaña dedicada "Página" en la barra lateral del editor + selección al hacer clic en el fondo del lienzo.
> - **Catálogo de Tipografías**: Colección curada de 14 fuentes de Google Fonts (modernas, geométricas, editoriales y condensed) instaladas en `index.html` y disponibles en todo el editor.
> - **Selección de Sección Interna**: Clic directo en el contenedor interno con borde/anillo activo visible, breadcrumbs actualizados y panel lateral de propiedades independiente.

---

## 1. Visión General y Alcance

Permite a los usuarios tener control absoluto sobre dos niveles estructurales fundamentales del maquetador:
1. **El Canvas / Hoja General de la Página (Div 1)**: Determina el ancho máximo de la pantalla web (Full Width 100% o Ancho Boxed de 800px a 1400px), el color de fondo general de la página, los colores de marca predeterminados, la tipografía global para titulares y cuerpo, y los tamaños por defecto para H1, H2, H3 y H4.
2. **La Sección Interna / Contenedor de Filas (Div 2)**: El contenedor interno que aloja las columnas dentro de una sección externa. Ahora es un elemento de primer nivel seleccionable por clic, con su propio panel para configurar ancho (full o boxed con max-width en px), fondo, padding (superior, inferior, lateral), márgenes, bordes, radio redondeado y sombras.

---

## 2. Experiencia de Usuario y Diseño Visual

### Jerarquía Estructural de Tres Niveles
```
┌─────────────────────────────────────────────────────────────────┐
│ 1. PÁGINA / CANVAS GENERAL (Hoja Web)                           │
│    - Ancho: Full Width (100%) o Boxed (800px, 960px, 1200px...)  │
│    - Fondo general, tipografía global, estilos por defecto H1-H4│
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ 2. SECCIÓN EXTERNA (PageBlockSection)                     │  │
│  │    - Fondo exterior, overlay, padding de sección          │  │
│  │                                                           │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │ 3. SECCIÓN INTERNA / CONTENEDOR (PageBlockRow)       │  │  │
│  │  │    - Clic directo para seleccionar                  │  │  │
│  │  │    - Ancho propio (max-width o 100%)                │  │  │
│  │  │    - Fondo propio, padding X/Y, márgenes, bordes    │  │  │
│  │  │                                                     │  │  │
│  │  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ │  │  │
│  │  │  │ Columna 1    │ │ Columna 2    │ │ Columna 3    │ │  │  │
│  │  │  │ [Elementos]  │ │ [Elementos]  │ │ [Elementos]  │ │  │  │
│  │  │  └──────────────┘ └──────────────┘ └──────────────┘ │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Catálogo de 14 Google Fonts
Instalación en `index.html` y listado con vista previa tipográfica:
1. **Inter** (Neogrotesca limpia, neutral y ultra-legible)
2. **Poppins** (Geométrica moderna, ideal para titulares de impacto)
3. **Roboto** (Estándar digital versátil)
4. **Montserrat** (Moderna urbana con fuerte personalidad)
5. **Playfair Display** (Serif editorial elegante de lujo)
6. **Oswald** (Condensada atlética e impactante)
7. **Lato** (Cálida y balanceada para páginas de venta)
8. **Open Sans** (Legibilidad óptima en párrafos largos)
9. **Raleway** (Elegante y refinada)
10. **Merriweather** (Serif de alta legibilidad en pantallas)
11. **Plus Jakarta Sans** (Moderna premium para SaaS y B2B)
12. **DM Sans** (Geométrica contemporánea)
13. **Outfit** (Limpia y vanguardista)
14. **Cinzel** (Clásica y solemne con estilo romano)

### Flujo de Interacción
1. **Pestañas de la barra lateral izquierda**:
   - `Elementos` (secciones arrastrables, textos, multimedia, formularios)
   - `Bloques` (bloques armados de carta de venta)
   - `Página` (NUEVA: Configuración global de la página con ancho, fuentes y colores)
2. **Selección en el Canvas**:
   - Clic en el fondo del lienzo deselecciona elementos/filas y abre la pestaña `Página`.
   - Clic en la barra superior o borde de una sección selecciona la `Sección Externa`.
   - Clic en el contenedor de columnas selecciona la `Sección Interna` (con anillo azul/violeta, etiqueta flotante "Sección Interna", botón de duplicar/eliminar fila y apertura inmediata del panel de propiedades).
   - Clic en un elemento individual selecciona el `Elemento`.
3. **Breadcrumbs contextuales en la barra superior**:
   - Muestra la ruta activa: `Página > Sección > Sección Interna > Titular H1` permitiendo navegar de regreso a cualquier nivel con un solo clic.

---

## 3. Decisiones de Producto y Arquitectura de Datos

### Modelo de Datos Actualizado en `src/types/index.ts`
- **`FunnelPageGlobalSettings`**:
  ```ts
  export interface FunnelPageGlobalSettings {
    pageWidthType?: 'full' | 'boxed'; // 'full' (100%) o 'boxed'
    pageContentMaxWidth?: number;     // ej. 1200 (default), 800, 960, 1024, 1400
    pageBgColor?: string;             // Fondo general del canvas
    primaryColor?: string;            // Color de acento/botones global
    textColor?: string;               // Color de texto general
    headingFontFamily?: string;       // Fuente global para H1-H4
    bodyFontFamily?: string;          // Fuente global para párrafos/botones
    defaultH1Size?: number;           // Tamaño por defecto H1 (px)
    defaultH2Size?: number;           // Tamaño por defecto H2 (px)
    defaultH3Size?: number;           // Tamaño por defecto H3 (px)
    defaultH4Size?: number;           // Tamaño por defecto H4 (px)
    pagePaddingTop?: number;
    pagePaddingBottom?: number;
    seo_title?: string;
    seo_description?: string;
  }
  ```
- **`PageBlockRow` (Sección Interna)**:
  ```ts
  export interface PageBlockRow {
    id: string;
    name?: string;
    widthType?: 'full' | 'boxed';      // Ancho relativo o con tope
    maxWidth?: number;                 // Ancho en px (ej. 1140, 960)
    bgColor?: string;                  // Color de fondo interno
    paddingTop?: number;
    paddingBottom?: number;
    paddingLeft?: number;
    paddingRight?: number;
    marginTop?: number;
    marginBottom?: number;
    borderRadius?: number;
    borderWidth?: number;
    borderColor?: string;
    borderStyle?: 'solid' | 'dashed' | 'dotted';
    shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
    columns: PageBlockColumn[];
  }
  ```

---

## 4. Pasos de Implementación

1. **Instalar las 14 Google Fonts en `index.html`**:
   - Actualizar el `<link>` de Google Fonts con las 14 familias completas.
   - Definir la constante `AVAILABLE_FONTS` con etiquetas legibles y estilos de muestra.

2. **Actualizar Tipos e Interfaces (`src/types/index.ts`)**:
   - Extender `FunnelPageGlobalSettings` y `PageBlockRow` con todas las propiedades de ancho, espaciado y estilo.

3. **Panel de Configuración Global de Página (`VisualEditor.tsx`)**:
   - Añadir la pestaña `Página` en el encabezado de pestañas del sidebar izquierdo.
   - Controles de:
     - Tipo de ancho: Ancho Total (100%) vs. En Caja (Boxed).
     - Ancho máximo en píxeles (presets de 800px, 960px, 1140px, 1200px, 1400px + slider manual).
     - Color de fondo general del canvas.
     - Tipografía para titulares (con vista previa visual de la fuente).
     - Tipografía para cuerpo de texto y botones.
     - Tamaños por defecto H1, H2, H3, H4.
     - Color primario de marca y color general de texto.

4. **Panel de Propiedades de la Sección Interna (`VisualEditor.tsx`)**:
   - Permitir seleccionar `selectedRowId` haciendo clic en el contenedor de columnas o breadcrumbs.
   - Panel inspector en barra lateral con:
     - Ancho de la sección interna (100% o boxed con max-width).
     - Color de fondo propio (`bgColor`).
     - Padding interno (`paddingTop`, `paddingBottom`, `paddingLeft`, `paddingRight`).
     - Márgenes (`marginTop`, `marginBottom`).
     - Bordes, radio de redondeo y sombras.
     - Acciones rápidas: duplicar sección interna, eliminar, mover.

5. **Aplicar Estilos en el Canvas del Editor y Vista Previa Pública**:
   - En `VisualEditor.tsx`: el contenedor principal del canvas adopta el `pageWidthType`, `pageContentMaxWidth` y `pageBgColor`.
   - Cada fila (`row`) aplica sus estilos computados (ancho, padding, fondo, radio, bordes y sombras).
   - En `PublicFunnelModal.tsx`: replicar la misma lógica para que la página pública refleje con fidelidad el ancho y los estilos de sección interna.

6. **Verificación y Pruebas**:
   - Compilación con `compile_applet` y validación tipográfica con `lint_applet`.
   - Verificar la persistencia al guardar la página y al cargar en vista previa.

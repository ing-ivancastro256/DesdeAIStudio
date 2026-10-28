# Módulo de Pop-ups en la Biblioteca y Constructor Visual — Scale Sales Pro

Incorpora el tipo **Pop-ups** a la Biblioteca central de **Scale Sales Pro** con su propio modo **Edición de Pop-up** dentro del constructor visual completo, control dedicado del botón de cierre (`X`), vinculación viva única en todos los embudos y herramientas de conversión de 2 pasos.

---

## Decisiones Confirmadas y Recomendaciones de Conversión

> [!IMPORTANT]
> **Diferencia arquitectónica clave frente a Plantillas y Bloques (Vinculación Viva Única)**:
> Mientras que las Plantillas y los Bloques insertan copias independientes en cada página, cada **Pop-up es una entidad única centralizada en la Biblioteca**. Todos los **Botones Pop-up** guardan la referencia directa a ese Pop-up: si editas el Pop-up desde la Biblioteca o desde cualquier página, **los cambios se actualizan automáticamente en todas las páginas y embudos donde sea invocado**.

- **Acción del botón "Agregar" en Biblioteca (`Pop-ups`)**: Confirmado. Seleccionar una tarjeta en la pestaña `Pop-ups` y pulsar **Agregar** inserta en el lienzo actual un **Botón Pop-up** ya vinculado a ese Pop-up.
- **Flujo de "+ Crear Pop-up"**: Confirmado. Tanto desde la cabecera de `Pop-ups` en la Biblioteca como desde el botón **Crear nuevo** de un `Botón Pop-up`, se solicita primero **Nombre y Categoría** en un cuadro rápido y luego se abre directamente el modo **Edición de Pop-up** en el constructor.
- **Pop-ups prearmados incluidos**: Confirmado. La Biblioteca incluirá **2 Pop-ups de alta conversión listos para usar** desde el primer momento (*Captura en 2 Pasos Lead Magnet* y *Oferta Especial de Cierre / Rescate*).
- **Limpieza de barra lateral izquierda**: Se retira la pestaña `Bloques` del panel izquierdo del constructor para dejar únicamente **Página** y **Elementos**, centralizando todos los bloques, plantillas y pop-ups en la **Biblioteca**.
- **Guardado desde Secciones**: En la ventana de guardar sección en la Biblioteca, el selector **Guardar Como** pasa a tener **`Plantilla` | `Bloque` | `Pop-up`**, manteniendo **`Bloque`** seleccionado por defecto.

> [!NOTE]
> **Mejoras añadidas con enfoque de Experto en Embudos de Venta**:
> 1. **Barra de Progreso Psicológica (Opt-in de 2 Pasos)**: Opción activable en el lienzo del Pop-up para mostrar arriba una barra persuasiva (ej. *"Paso 1 de 2: ¿A dónde enviamos tu acceso? — 50% completado"*), técnica probada para elevar la tasa de registro en páginas VSL y de captura.
> 2. **Control del Fondo Oscuro (Overlay) y Cierre Exterior**: Ajuste de opacidad/color del telón oscuro detrás del Pop-up e interruptor para permitir o bloquear el cierre al hacer clic fuera de la ventana (ideal para pop-ups de decisión obligatoria).
> 3. **Subtexto Persuasivo en `Botón Pop-up`**: El elemento `Botón Pop-up` hereda también la capacidad de activar un **Subtexto** inferior (ej. *"Haz clic aquí • Registro gratuito en 10 segundos"*) para maximizar clics.
> 4. **Disparador Automático Opcional en Página (Exit-Intent / Tiempo)**: Posibilidad de vincular opcionalmente un Pop-up de la Biblioteca en la configuración de la página para mostrarse automáticamente al intento de abandono (cursor saliendo arriba) o tras X segundos en página, además de abrirse mediante botones.

---

## 1. Visión General y Concepto Central

- **Qué hace**: Permite crear, categorizar, previsualizar y editar **Pop-ups** usando exactamente el mismo constructor visual por secciones, columnas y elementos de **Scale Sales Pro**, eliminando el antiguo editor básico limitado.
- **Para quién y cuándo**: Creadores de embudos, agencias y closers que necesitan formularios emergentes en 2 pasos, cupones de rescate o videos cortos en ventana modal reutilizables en múltiples pasos del embudo sin duplicar trabajo.
- **Valor principal**: Centralización total y mantenimiento instantáneo: corriges un titular, campo de formulario o bono en un Pop-up una sola vez y queda actualizado en todas las páginas conectadas.

---

## 2. Experiencia de Usuario y Diseño Visual

### Flujos Principales de Uso

1. **Explorar y Crear desde la Biblioteca**:
   - En la barra lateral `TIPO` de la Biblioteca aparecen ahora cuatro vistas activas: **Plantillas**, **Bloques**, **Pop-ups** y **Favoritos** (los Pop-ups marcados con corazón también aparecen en Favoritos identificados con etiqueta limpia de texto).
   - Al entrar en **Pop-ups**, justo al costado derecho del título principal **"Pop-ups"** aparece el botón destacado **`+ Crear Pop-up`**.
   - Al pulsarlo, un modal compacto pide **Nombre del Pop-up** y **Categoría** (`Sin categoría`, categorías existentes o `+ Agregar nueva categoría`), guarda el registro e inicia el modo **Edición de Pop-up**.
   - Si el usuario selecciona una tarjeta de Pop-up existente y pulsa **Agregar**, se inserta un **Botón Pop-up** en la página actual ya conectado a dicho Pop-up.

2. **Guardar cualquier Sección Exterior como Pop-up**:
   - Al hacer clic en el icono de disquete (**Guardar en Biblioteca**) de cualquier sección exterior, la opción **Guardar Como** muestra **`Plantilla` | `Bloque` | `Pop-up`** (con **`Bloque`** activo por defecto).
   - Si el usuario elige **`Pop-up`**, el título cambia dinámicamente a *"Guarda esta Sección en tu biblioteca de Pop-ups"*, solicita `Nombre de Pop-up` y `Categoría`, y la guarda con formato de ventana emergente (ancho modal centrado y su botón `X` superior derecho configurado por defecto).

3. **Modo `Edición de Pop-up` en el Constructor Visual**:
   - La barra superior del constructor muestra la insignia **`Edición de Pop-up`**, el campo editable con el nombre del Pop-up, selector rápido de categoría, y los botones **`Volver sin guardar`** y **`Guardar en Biblioteca`**.
   - El área central presenta el Pop-up sobre un fondo atenuado realista de ventana modal, renderizando en vivo el **botón `X` en la esquina superior derecha** exactamente con el tamaño, colores y desplazamiento configurados.
   - En el panel izquierdo (con solo las pestañas **Página** y **Elementos**), la pestaña **Página** se adapta como **Lienzo del Pop-up** comprimido y enfocado:
     - **Se ocultan**: *SEO y Metadatos*, *Colores Generales Globales* y *Tipografía Global*.
     - **Se incluyen**:
       1. **Botón de Cerrar (`X`)**: Presets de ubicación (*Dentro de la esquina*, *Justo en el borde/esquina*, *Fuera de la esquina*), controles deslizantes para mover horizontalmente (izquierda/derecha) y verticalmente (arriba/abajo), tamaño del botón, forma (círculo, redondeado, cuadrado), color de fondo (negro `#18181B` por defecto) y color de la `X` (blanco `#FFFFFF` por defecto) con selector Hex + RGBA + copiado rápido.
       2. **Barra de Progreso de Conversión (Opcional)**: Interruptor `No / Sí`, porcentaje (`10%–100%`), texto superior editable y color de barra.
       3. **Ancho y Ventana del Pop-up**: Presets adaptados a ventanas emergentes (`380px`, `480px`, `580px`, `720px`, `920px`) y control libre desde `300px` hasta `1100px`, color de fondo de la caja del pop-up, opacidad del fondo oscuro trasero y opción de cerrar al hacer clic afuera.
       4. **Redondeo de Esquinas / Puntas**.
       5. **Imagen de Fondo**.
       6. **Disposición (Padding del Lienzo)**.

4. **Vincular, Buscar y Editar desde el `Botón Pop-up`**:
   - Al soltar o seleccionar un **Botón Pop-up** en cualquier página del embudo, su panel inspector muestra:
     - **Texto del botón** y opción desplegable de **Subtexto** persuasivo.
     - **Buscador rápido por nombre** para localizar cualquier Pop-up al instante.
     - **1.º Desplegable — Categoría del Pop-up**: Incluye `Todos`, `Sin categoría` y todas las categorías disponibles.
     - **2.º Desplegable — Pop-up vinculado**: Lista los Pop-ups pertenecientes a la categoría filtrada (y al término buscado).
     - Acciones directas: **`Editar Pop-up`** (abre ese Pop-up en modo `Edición de Pop-up` y al guardar o volver regresa exactamente a la página del embudo donde estabas) y **`Crear nuevo`** (abre el diálogo de Nombre + Categoría, crea el nuevo Pop-up, lo deja vinculado automáticamente a este botón y abre su editor).

### Identidad Visual y Estética
- **Dirección estética**: Consola SaaS limpia y enfocada de alta conversión coherente con **Scale Sales Pro** (`#2848F0` azul eléctrico para acciones primarias, superficies blancas `#FFFFFF` sobre lienzo neutro `#F4F4F5` y bordes sutiles de `1px`).
- **Tipografía y jerarquía**: Encabezados de interfaz en `Poppins` y controles/lectura densa en `Inter`, usando numerales tabulares (`tabular-nums`) en contadores de biblioteca, porcentajes y controles de dimensiones en píxeles.
- **Previsualización fiel**: En las tarjetas de la pestaña `Pop-ups` dentro de la Biblioteca, la miniatura escalada muestra el marco de ventana emergente junto con su botón `X` en la esquina superior derecha para distinguirla visualmente de un bloque de sección regular.

---

## 3. Decisiones de Producto y Razonamiento

- **Entidad Única Referenciada vs. Copia Estática**:
  - *Enfoque elegido*: Referencia viva por identificador (`popupId`) hacia la Biblioteca global, con respaldo seguro para pop-ups antiguos.
  - *Por qué*: Un mismo Pop-up de captura suele conectarse a 4 o 5 botones a lo largo de una carta de ventas extensa (Hero, mitad de página, sección de bonos, FAQ y cierre). Con referencia única, cualquier ajuste de oferta o formulario se refleja en los 5 botones al instante.
- **Reutilización del Constructor Completo en lugar de un Modal Básico**:
  - *Enfoque elegido*: Extender la sesión aislada del constructor visual (`libraryEditSession`) para soportar `popup` además de `template` y `block`.
  - *Por qué*: Da acceso inmediato a todos los elementos avanzados ya construidos (Formulario Completo, Formulario Inline, Video con portada personalizada, Cuenta Regresiva, Columnas Internas, Listas de viñetas e Iconos) sin mantener dos editores distintos.

---

## 4. Arquitectura Técnica y Flujo de Datos

### Diagrama de Componentes y Estado

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                     ESTADO GLOBAL Y PERSISTENCIA (AppContext)                │
│  • libraryItems (Plantillas | Bloques | Pop-ups con popupConfig + secciones) │
│  • libraryCategories (Categorías únicas sincronizadas en localStorage)       │
└──────────────────┬───────────────────────────────────────┬───────────────────┘
                   │                                       │
                   ▼                                       ▼
┌──────────────────────────────────────┐ ┌─────────────────────────────────────┐
│     VENTANA DE BIBLIOTECA MODAL      │ │    CONSTRUCTOR VISUAL PRINCIPAL     │
│  • Pestañas: Plantillas | Bloques |  │ │  • Sidebar: solo Página | Elementos │
│    Pop-ups (+ Crear Pop-up) | Favs   │ │  • Inspector Botón Pop-up:          │
│  • Modal rápido: Nombre + Categoría  │ │    Búsqueda + Categoría + Pop-up    │
│  • Botón "Agregar" en Pop-ups ───────┼─┼──► Inserta Botón Pop-up vinculado   │
│  • Guardar Sección: Plantilla |      │ │  • Modo "Edición de Pop-up":        │
│    Bloque (defecto) | Pop-up         │ │    Lienzo modal + X configurable    │
└──────────────────┬───────────────────┘ └─────────────────┬───────────────────┘
                   │                                       │
                   └───────────────────┬───────────────────┘
                                       ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│           RENDERIZADOR DE POP-UP EN VIVO (Vista Previa y Embudo Público)     │
│  • Resuelve popupId en tiempo real desde libraryItems                        │
│  • Aplica ancho, redondeo, barra de progreso 2-pasos, overlay y botón X      │
│  • Renderiza secciones, filas, columnas y formularios interactivos reales    │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Modelo de Datos y Configuración del Pop-up
- Cada elemento de tipo `popup` dentro de la Biblioteca almacena sus `sections` completas (igual que un bloque o plantilla) más un objeto de configuración de ventana emergente (`popupSettings`) que gobierna:
  - **Dimensiones y caja**: Ancho máximo en píxeles (por defecto `560px`), redondeo de esquinas (`12px` por defecto), relleno interno, color/imagen de fondo del contenedor, color/opacidad del telón oscuro trasero y permiso de cierre al hacer clic fuera.
  - **Botón `X` de cierre**: Modo de anclaje en esquina (`inside`, `edge`, `outside`), ajuste fino horizontal (`offsetX`) y vertical (`offsetY`), diámetro/tamaño (`32px` por defecto), radio de forma, color de fondo (`#18181B`) y color del trazo `X` (`#FFFFFF`).
  - **Barra de progreso opcional**: Estado activo/inactivo, porcentaje, texto de micro-compromiso, color de barra y altura.
  - **Configuración opcional en Página de Embudo**: Campo opcional en la configuración de página normal para activar un Pop-up de la Biblioteca por *Intención de Salida (Exit-Intent)* o *Retardo en segundos*.

### Mapeo de Interacciones Clave
- **Creación rápida (`+ Crear Pop-up` / `Crear nuevo`)**: Valida nombre no vacío, registra nueva categoría si el usuario creó una al vuelo, genera el Pop-up base en `libraryItems` con una sección inicial persuasiva lista para editar, vincula automáticamente el `popupId` si provino de un `Botón Pop-up` y abre `Edición de Pop-up` guardando en memoria el estado exacto de la página del embudo para restaurarla al finalizar.
- **Edición y retorno seguro**: Al pulsar **Guardar en Biblioteca** dentro de `Edición de Pop-up`, se actualiza el registro único en `libraryItems` (tanto sus secciones como su `popupSettings`) y se restaura la página del embudo (o se reabre la Biblioteca en la pestaña `Pop-ups` si entró desde allí).
- **Eliminación informada**: Si el usuario intenta eliminar un Pop-up desde la Biblioteca, el cuadro de confirmación advierte cuántos botones en sus embudos están vinculados actualmente a ese Pop-up antes de confirmar.

# Plan de Reorganización y Nuevos Elementos en la Biblioteca del Editor

Reestructuración integral del panel lateral de **Elementos** en el constructor visual de Scale Sales Pro, estandarizando nombres, depurando iconos innecesarios, creando nuevos elementos interactivos (Cuenta regresiva, Preguntas Frecuentes, Widget de Redes Sociales, reCAPTCHA, Casilla de verificación y Campo de formulario) y organizando los grupos según las especificaciones del usuario.

---

## 1. Estructura de Grupos y Elementos

### Grupo 1: Sección
- **Encabezado**: Sin icono de sección, título limpio "Sección" con etiqueta informativa "Arrastra al lienzo".
- **Elementos (Bloques de disposición en cuadrícula)**:
  - `1 Columna` (100%)
  - `2 Columnas` (50% / 50%)
  - `3 Columnas` (33% / 33% / 33%)
  - `4 Columnas` (25% / 25% / 25% / 25%)

### Grupo 2: Texto
- **Titular**: Encabezados H1 a H4 configurables.
- **Párrafo**: Texto multilínea con saltos de línea automáticos.
- **Lista de Viñetas**: Ítems ordenados o con iconos personalizables.
- **Editor de Texto**: Editor enriquecido con formato WYSIWYG.

### Grupo 3: Multimedia
- **Imagen**: Selector y carga de imagen con opciones de tamaño y bordes.
- **Video**: Reproductor responsive para YouTube, Vimeo y video directo.
- **Audio**: Reproductor de pistas o música de fondo.
- **Icono**: Icono personalizable (renombrado de "Icono Vectorial" a simplemente "Icono").

### Grupo 4: CTA (Llamadas a la Acción)
- **Botón**: Botón de acción con enlace a siguiente página, URL o calendario.
- **Botón Pop-up**: Botón que dispara modales flotantes con ofertas o formularios.

### Grupo 5: Formularios
- **Formulario**: Formulario de captura de prospectos (renombrado de "Formulario Simple" a "Formulario").
- **reCAPTCHA**: Caja de verificación de seguridad "No soy un robot".
- **Casilla de verificación**: Checkbox para términos, condiciones o selección múltiple.
- **Campo de formulario**: Input personalizable (texto, email, teléfono, número o textarea).

### Grupo 6: Otros
- **Separador**: Línea divisoria personalizable (sólida, discontinua o con espaciado).
- **Espaciador**: Bloque de separación vertical ajustable en píxeles.
- **Cuenta regresiva**: Contador regresivo con tarjetas para Días, Horas, Minutos y Segundos, estilo alta conversión con fecha límite configurable.
- **Preguntas frecuentes**: Acordeón FAQ interactivo con preguntas y respuestas desplegables.

### Grupo 7: Redes Sociales
- **Widget de Redes Sociales**: Un único elemento configurable que inserta una barra horizontal con los iconos de Facebook, Instagram, TikTok, WhatsApp y YouTube. Permite activar/desactivar cada red, editar URLs y personalizar tamaño y colores.

### Grupo 8: Conversión SSP
- **Formulario SSP (Quiz)**: Formulario interactivo de preguntas y calificación de prospectos.
- **Calendario SSP**: Selector interactivo de citas sincronizado con Google Calendar.

---

## 2. Cambios en Modelo de Datos y Tipos (`src/types/index.ts`)

1. Ampliar `ElementType`:
   ```ts
   export type ElementType =
     | 'heading'
     | 'subheading'
     | 'paragraph'
     | 'bullet_list'
     | 'rich_text'
     | 'button'
     | 'image'
     | 'video'
     | 'divider'
     | 'spacer'
     | 'audio'
     | 'icon'
     | 'simple_form'
     | 'popup_button'
     | 'form'
     | 'calendar'
     | 'countdown'      // NUEVO
     | 'faq'            // NUEVO
     | 'social_links'   // NUEVO
     | 'recaptcha'      // NUEVO
     | 'checkbox'       // NUEVO
     | 'input_field';   // NUEVO
   ```

2. Extender `content` de `PageBlockElement` para soportar:
   - `countdown`: `targetDate`, `countdownDaysLabel`, `countdownHoursLabel`, `countdownMinutesLabel`, `countdownSecondsLabel`, `countdownTheme`.
   - `faq`: `faqItems: { id: string; question: string; answer: string; open?: boolean }[]`.
   - `social_links`: `socialPlatforms: { id: string; platform: 'facebook' | 'instagram' | 'tiktok' | 'whatsapp' | 'youtube'; url: string; enabled: boolean }[]`.
   - `recaptcha`: `recaptchaTheme: 'light' | 'dark'`.
   - `checkbox`: `checkboxLabel`, `checkboxChecked`, `checkboxRequired`.
   - `input_field`: `inputPlaceholder`, `inputLabel`, `inputType`, `inputRequired`.

---

## 3. Implementación en `VisualEditor.tsx` y `PublicFunnelModal.tsx`

1. **`createNewElement`**:
   - Crear los valores predeterminados de diseño y contenido para `countdown`, `faq`, `social_links`, `recaptcha`, `checkbox`, `input_field`.
2. **`renderElementContent`**:
   - Renderizado interactivo en el lienzo para cada nuevo elemento con Tailwind CSS de alta calidad visual.
   - Cuenta regresiva con animación de segundero y cajas estilizadas.
   - Acordeón FAQ con interacción de colapsar/desplegar en vivo.
   - Fila de redes sociales con badges y enlaces reales.
3. **Inspector de Propiedades (`ElementInspector.tsx` / panel lateral)**:
   - Configuración de fechas y textos para el contador.
   - Añadir/editar/eliminar preguntas en el FAQ.
   - Activar/desactivar redes sociales y colocar enlaces URL correspondientes.
4. **Replica en `PublicFunnelModal.tsx`**:
   - Garantizar que la página publicada o en vista previa muestre todos los nuevos componentes con perfecta fidelidad visual y funcional.

---

## 4. Verificación y Calidad

- Ejecutar `lint_applet` y `compile_applet` para asegurar ausencia de errores de tipado o compilación.
- Comprobar inserción tanto por clic como por arrastre (drag-and-drop).
- Verificar que las secciones creadas mantengan espaciados en 0px por defecto tal como se solicitó previamente.

# Rediseño Integral del Elemento "Formulario Completo"

Transformación del elemento **Formulario completo** dentro del grupo **FORMULARIO** en un constructor modular de captación de leads sin contenedor decorativo, sin título ni subtítulo predefinidos, con radio de esquinas de `0px` por defecto en campos y botón, gestión avanzada de campos arrastrables, personalización completa del botón, casilla de políticas con texto enriquecido y automatizaciones post-envío conectadas al CRM y proveedores de Email Marketing.

## Revisión del Usuario y Decisiones Confirmadas

> [!IMPORTANT]
> Las siguientes decisiones estratégicas fueron confirmadas directamente y guían el diseño e interacción del componente:

- **Decisión Confirmada 1 — Apariencia del Contenedor en el Lienzo**: El formulario se inserta con un contenedor exterior **limpio y transparente**, mostrando únicamente los campos configurados, la casilla opcional de políticas y el botón de envío (sin tarjeta blanca envolvente, sombras ni título/subtítulo explicativo).
- **Decisión Confirmada 2 — Alcance del Estilo de Campos**: La tipografía, colores, borde (`1px` por defecto) y redondeo (`0px` por defecto) funcionan de manera **compartida en todos los campos**, incluyendo un interruptor opcional dentro de cada campo para aplicar **ajustes visuales individuales** cuando se requiera destacar o diferenciar un campo específico.
- **Decisión Confirmada 3 — Proveedores de Email Marketing Post-Envío**: En **Acción Después de Enviar**, se mostrarán **todos los proveedores disponibles** (`GetResponse`, `ActiveCampaign`, `ConvertKit / Kit`, `MailerLite`, `Brevo`) permitiendo activar uno o varios simultáneamente y especificar la **Lista o Etiqueta (Tag)** de destino en cada uno.

---

## 1. Visión General y Concepto Central

- **Qué Hace**: Permite diseñar formularios a medida directamente en el editor visual de páginas y ventanas emergentes, controlando el orden, ancho en columnas, tipos de entrada, estilos tipográficos/bordes, botón de acción, consentimiento legal con enlaces y flujo de conversión posterior al envío.
- **Audiencia y Contexto**: Creadores de embudos y páginas de captura que necesitan integrar formularios limpios sobre cualquier fondo de sección o columna sin cajas forzadas, manteniendo control quirúrgico sobre cada campo y conectando cada registro con el CRM y herramientas de automatización.
- **Valor Principal**: Elimina la rigidez del formulario fijo tradicional, unificando en un solo inspector seis bloques ordenados y predecibles con paridad visual respecto al resto del constructor.

---

## 2. Experiencia de Usuario y Diseño Visual

### Flujo Paso a Paso en el Editor y Lienzo

1. **Inserción Limpia en el Lienzo**:
   - Al arrastrar **Formulario completo** al lienzo, aparecen únicamente sus campos iniciales y el botón de envío sobre fondo transparente, sin encabezados ni subtítulos automáticos.
   - Tanto los campos como el botón nacen con esquinas rectas (`0px` de radio) y los campos con borde sólido de `1px`.
2. **Grupo 1 — Nombre del Formulario**:
   - Primer bloque superior del inspector para asignar el identificador del formulario (usado en registros del CRM, eventos de conversión y trazabilidad de leads).
3. **Grupo 2 — Campos del Formulario**:
   - **Lista Vertical Reordenable**: Cada campo se presenta en una fila compacta uno debajo de otro con tirador para **arrastrar y soltar** (con línea azul indicadora de posición), botón de **Duplicar/Copiar** y botón de **Eliminar (`×`)**.
   - **Botón `+ Añadir campo`**: Agrega instantáneamente un nuevo campo al final de la lista y abre su configuración.
   - **Configuración Interna Desplegable por Campo** (organizada en pestañas **Contenido** y **Estilo** al hacer clic sobre un campo):
     - *Pestaña Contenido*:
       - Selector **Tipo de campo**: `Texto`, `Email`, `Text Area`, `Teléfono`, `WhatsApp`, `Select`, `Radio`, `Checkbox`.
       - Edición de **Etiqueta (Label)**, **Placeholder** (en campos de entrada de texto), interruptor **Requerido** (`Sí` / `No`) y selector **Ancho de columna** (`100%`, `50%`, `33%`, `25%`, `66%`, `75%`) para distribuir campos en una o varias columnas.
       - **Configuración de Múltiples Opciones** (exclusiva cuando el tipo es `Select`, `Radio` o `Checkbox`): área de texto multilínea para escribir una opción por línea (soportando tanto texto directo como formato `Etiqueta|valor`).
     - *Pestaña Estilo*:
       - Edición directa del estilo global compartido de los campos (familia tipográfica, tamaño de letra, color de texto, color de fondo, espesor de borde con `1px` por defecto, color de borde y radio de esquina con `0px` por defecto) junto con un interruptor **"Personalizar solo este campo"** para sobrescribir cualquiera de esos valores únicamente en el campo seleccionado.
   - **Controles Globales Inferiores de Campos** (debajo de `+ Añadir campo`):
     - Selector **Tamaño de campo** (`Extra Pequeño`, `Pequeño`, `Mediano`, `Grande`).
     - Interruptor **Mostrar / Ocultar Etiquetas (Label)** encima de los campos e interruptor **Marca de requerido (`*`)**.
4. **Grupo 3 — Botón del Formulario**:
   - Réplica exacta de todas las capacidades del elemento **Botón** independiente:
     - **Texto del botón** (texto principal, subtexto opcional, ancho completo o ajustado).
     - **Icono del botón** (selector visual completo de iconos, posición antes o después del texto, tamaño del icono y separación respecto al texto).
     - **Tipografía y Formato** (fuente, tamaño, peso negrita, cursiva, subrayado, transformación mayúsculas/minúsculas y alineación).
     - **Color y Fondo** (color sólido o degradado de 2 colores, color de texto y colores de acento/hover).
     - **Borde y Redondeo** (activación de borde, grosor, estilo sólido/punteado/discontinuo, color de borde y radio de esquinas con `0px` por defecto).
5. **Grupo 4 — Checkbox de Políticas**:
   - Interruptor superior (`No` / `Sí`) para activar o desactivar la casilla de aceptación de políticas encima del botón.
   - Barra de formato enriquecido en línea (**Negrita `B`**, **Cursiva `I`**, **Subrayado `U`** e **Insertar Enlace / URL**) que permite seleccionar palabras específicas (por ejemplo, *"políticas de privacidad"* o *"términos y condiciones"*) y convertirlas en hipervínculos clicables hacia la URL deseada, además de configurar obligatoriedad y tamaño/color del texto.
6. **Grupo 5 — Acción Después de Enviar**:
   - Sistema multi-selección donde el usuario puede combinar simultáneamente una o varias acciones al completar el envío:
     - **Siguiente página del embudo**: avanza automáticamente al siguiente paso configurado en el embudo.
     - **Redirección a URL**: redirige a una dirección web externa o interna (misma pestaña o nueva pestaña).
     - **Añadir al CRM**: crea o actualiza automáticamente el contacto real en el módulo CRM con su nombre, correo, teléfono/WhatsApp, respuestas personalizadas y etiqueta de origen del formulario.
     - **Email Marketing**: despliega los proveedores (`ActiveCampaign`, `GetResponse`, `ConvertKit / Kit`, `MailerLite`, `Brevo`) con casillas de activación independientes e input de **Lista o Etiqueta (Tag)** para cada proveedor seleccionado.
7. **Grupo 6 — Disposición**:
   - Control unificado en una sola línea de 4 lados vinculables para **Margen** y **Relleno (Padding)** (`Superior`, `Inferior`, `Derecha`, `Izquierda`), consistente con el resto de elementos del constructor.

### Identidad Visual, Tipografía y Micro-interacciones
- **Dirección Estética**: Inspector técnico de alta densidad estilo SaaS profesional, con jerarquía clara de tarjetas limpias, bordes sutiles (`--border` / `slate-200`), acentos precisos en índigo/azul (`indigo-600` / `blue-600`) y superficies de lienzo 100% fieles al diseño final del usuario.
- **Tipografía y Ritmo Espacial**: Etiquetas de control legibles (`11px–12px` semibold), controles numéricos alineados horizontalmente con deslizadores y flechas de incremento, y grilla flexible de 12 columnas internas en el formulario para soportar combinaciones de campos al `100%`, `50%` o `33%` sin desbordes.
- **Feedback Interactivo**: Indicador lineal azul limpio durante el reordenamiento por arrastrar y soltar de campos, validación en vivo de campos requeridos y casilla de políticas al probar en Vista Previa o Embudo Público, y notificación de confirmación al registrar el lead en el CRM.

---

## 3. Decisiones de Producto y Equilibrios Técnicos

- **Decisión 1 — Herencia Inteligente de Estilo con Sobrescritura Opcional por Campo**
  - *Enfoque Elegido*: Mantener tokens base de estilo de campo a nivel de formulario (editables desde la pestaña de estilo de cualquier campo) con un conmutador opcional para personalizar un campo individual.
  - *Por Qué*: Evita tener que repetir cambios de fuente, color o borde 6 veces cuando el usuario quiere cambiar la estética del formulario entero, pero conserva total libertad si desea resaltar un campo concreto.
  - *Alternativas Descartadas*: Estilos exclusivamente individuales por campo (tedioso y propenso a inconsistencias visuales) o exclusivamente globales (impide excepciones puntuales).

- **Decisión 2 — Editor Ligero de Texto Enriquecido y Enlaces para Políticas**
  - *Enfoque Elegido*: Editor interactivo con selección de texto y aplicación directa de **Negrita**, **Cursiva**, **Subrayado** e **Hipervínculo (`URL`)** sanitizado, renderizado fielmente junto al checkbox.
  - *Por Qué*: Permite enlazar múltiples documentos legales dentro de una misma oración (*"Acepto los Términos de Uso y la Política de Privacidad"*) sin obligar al usuario a escribir código HTML manual.

- **Decisión 3 — Retrocompatibilidad Transparente con Formularios Existentes**
  - *Enfoque Elegido*: Si una plantilla previa contiene la estructura antigua de campos básicos, se convierte automáticamente en la lista ordenada de campos editables sin perder etiquetas ni textos configurados; mientras que todo nuevo **Formulario completo** insertado nace limpio, sin títulos y con radios en `0px`.

---

## 4. Arquitectura Técnica y Estrategia de Datos

### Diagrama de Arquitectura y Flujo de Componentes

```
┌────────────────────────────────────────────────────────────────────────────┐
│                      EDITOR VISUAL & VISTA PÚBLICA                         │
├───────────────────────────────────┬────────────────────────────────────────┤
│   INSPECTOR FORMULARIO COMPLETO   │     LIENZO / RENDERIZADOR DE FORM      │
│                                   │                                        │
│  1. Nombre del Formulario         │  ┌──────────────────────────────────┐  │
│  2. Campos del Formulario         │  │ Grilla Dinámica (100% / 50% /33%)│  │
│     ├─ Lista Drag & Drop + Copy/× │  │  ├─ Texto / Email / Text Area    │  │
│     ├─ Config Interna (Tabs):     │  │  ├─ Teléfono / WhatsApp          │  │
│     │   • Contenido (Tipo/Opciones│  │  └─ Select / Radio / Checkbox    │  │
│     │   • Estilo Global/Individual│  ├──────────────────────────────────┤  │
│     └─ Tamaño + Switch Labels     │  │ [✓] Checkbox Políticas (Rich URL)│  │
│  3. Botón del Formulario          │  ├──────────────────────────────────┤  │
│     └─ Texto/Icono/Fuente/Fondo/  │  │ [ Icono  Botón Envío (0px rad) ] │  │
│        Borde & Radio (0px def.)   │  └────────────────┬─────────────────┘  │
│  4. Checkbox de Políticas         │                   │ Al Enviar (Submit) │
│  5. Acción Después de Enviar      │                   ▼                    │
│  6. Disposición (Margen/Relleno)  │  ┌──────────────────────────────────┐  │
└─────────────────┬─────────────────┘  │   MOTOR DE ACCIONES POST-ENVÍO   │  │
                  │                    │  ├─ Añadir Contacto + Evento CRM │  │
                  ▼                    │  ├─ Sincronizar Email Marketing  │  │
┌───────────────────────────────────┐  │  │   (Proveedor + Lista/Etiqueta)│  │
│   ESTADO DEL ELEMENTO (JSON)      │  │  ├─ Avanzar Paso del Embudo      │  │
│   Campos, Estilos, Botón, Reglas  │──┼─►└─ Redirigir a URL Personalizada│  │
└───────────────────────────────────┘  └──────────────────────────────────┘  │
```

### Modelo de Datos y Estado

- **Entidad de Campo de Formulario**: Identificador único, tipo (`text`, `email`, `textarea`, `tel`, `whatsapp`, `select`, `radio`, `checkbox`), etiqueta, placeholder, indicador de requerido, ancho porcentual de columna, lista de opciones multilínea (`Etiqueta|valor`) y objeto opcional de sobrescritura de estilo individual (`fuente`, `tamaño`, `colorTexto`, `colorFondo`, `grosorBorde`, `colorBorde`, `radioEsquina`).
- **Configuración Global de Campos**: Visibilidad de etiquetas (`showLabels`), indicador de asterisco requerido (`showRequiredMark`), escala de altura/relleno (`inputSize`) y estilo base compartido (`borderWidth: 1`, `borderRadius: 0`, colores y tipografía).
- **Configuración Completa del Botón**: Propiedades unificadas con el botón estándar (texto, icono, posición/tamaño/espaciado de icono, familia/tamaño/formato tipográfico, fondo sólido o degradado de 2 colores, borde configurable y `borderRadius: 0` por defecto).
- **Configuración de Políticas y Post-Envío**: Estado activo e HTML enriquecido seguro para la casilla de políticas; banderas independientes de acciones post-envío (`irSiguientePaso`, `redirigirUrl`, `agregarCrm`, `emailMarketing`) junto con el arreglo de destinos de Email Marketing (`proveedor`, `activo`, `listaOEtiqueta`).

### Mapeo Interactivo de Eventos y Validaciones

- **Reordenamiento, Copia y Eliminación de Campos**: Arrastrar una fila actualiza el índice del arreglo en tiempo real mostrando una línea divisoria azul; duplicar clona el campo con un nuevo identificador justo debajo del original; eliminar remueve el campo cerrando su panel interno si estaba activo.
- **Validación y Envío Real en Vista Previa y Embudo Público**: Al enviar el formulario, se validan los campos marcados como requeridos, formato de correo/teléfono y la casilla obligatoria de políticas; luego se ejecutan en secuencia las acciones activadas: creación del contacto con historial detallado en el CRM, registro de listas/etiquetas de Email Marketing seleccionadas y navegación automática al siguiente paso del embudo o URL configurada.

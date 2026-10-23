# Plan de Modernización y Reestructuración Multimedia (Imagen, Video, Audio e Icono)

Este plan detalla la reestructuración completa de los controles e inspectores de los elementos del grupo **MULTIMEDIA** (`image`, `video`, `audio`, `icon`) en el editor visual y en el visor del embudo, asegurando controles ergonómicos, diseño limpio sin elementos innecesarios y soporte completo para portadas interactivas de video y playlists de audio.

## Decisiones Críticas y Preferencias Confirmadas

> [!IMPORTANT]
> Se han integrado las siguientes respuestas y elecciones directas del usuario:
> - **Proporción de Imagen**: Conexión proporcional por defecto entre ancho y alto, con botón de candado interactivo para desbloquear dimensiones libres cuando sea necesario y botón "Restaurar tamaño original".
> - **Acción de Portada de Video (Cover)**: Al hacer clic en la portada personalizada, la cubierta se oculta suavemente e inicia la reproducción del video de inmediato.
> - **Playlists de Audio (Spotify / SoundCloud)**: Reproductor enriquecido con visualización interactiva y lista de hasta 20 pistas de la playlist.

---

## 1. Alcance por Elemento

### A. Elemento Imagen (`image`)
1. **Bordes y Radio por Defecto**:
   - Nuevas imágenes se inicializan con `borderRadius: 0` (0px) en lugar de esquinas redondeadas forzadas.
2. **Ajustes y Forma de Imagen**:
   - **Eliminar control de rotación** (grados).
   - **Controles de Ancho y Alto sincronizados** (siguiendo *Imagen 1* del usuario):
     - Fila para **Ancho (Size / Width)**: Deslizador (`range`) + Input numérico con unidad (`px` / `%`).
     - Fila para **Alto (Height)**: Deslizador (`range`) + Input numérico con unidad (`px` / `%`).
     - Botón de enlace / candado para alternar entre proporción fija y libre.
     - Botón/enlace inferior: `↺ Restaurar tamaño original` que restablece las dimensiones naturales de la imagen.
   - Conservar sombra, opacidad y alineación.
3. **Nuevo Grupo "LINK DE IMAGEN"**:
   - Input para URL de destino (`linkUrl`).
   - Switch o checkbox para `Abrir en nueva pestaña (_blank)`.
   - Si está vacío, la imagen no realiza ninguna acción al clic.
   - En canvas (modo vista previa) y embudo público, la imagen se envuelve en enlace `<a>` funcional.
4. **Orden Estricto de Acordeones**:
   1. *Origen de la imagen*
   2. *Ajustes y Forma de Imagen*
   3. *Link de Imagen*
   4. *Borde Exterior de Imagen*
   5. *Disposición (Márgenes y Relleno)*

---

### B. Elemento Video (`video`)
1. **Origen del Video**:
   - Selector desplegable **"Fuente"**: `YouTube`, `Vimeo`, `Wistia`, `Subir Video`, `Video Externo`, `Alojado en Servidor`.
   - Campo para introducir la URL del video.
   - Eliminación de textos redundantes y del check verde de "listo para reproducir" para lograr una interfaz limpia.
   - Conservación del botón de carga de video de prueba (`Cargar video de prueba`).
2. **Ajustes del Reproductor**:
   - Configuración de bordes:
     - Grosor de borde (`borderWidth` en px).
     - Estilo de borde (`borderStyle`: sólido, rayado, punteado).
     - Color de borde (`borderColor` con selector Hex/paleta).
   - Bordes redondeados (`borderRadius` en px).
   - Ancho máximo del reproductor:
     - Botones de presets rápidos (`480px`, `640px`, `750px`, `100%`).
     - Input numérico libre en px/% para control milimétrico.
   - Mantenimiento de alineación (`izquierda`, `centro`, `derecha`) y relación de aspecto (`16:9`, `4:3`, `9:16`, `1:1`).
3. **Nuevo Grupo "OPCIONES DEL VIDEO"**:
   - `Autoreproducir` (`autoplay`).
   - `Silenciar` (`muted`).
   - `Bucle / Repetir` (`loop`).
4. **Nuevo Grupo "COVER PORTADA" (siguiendo *Imagen 2*)**:
   - Selector de tipo de portada:
     - **Opción 1: Imagen personalizada** (subida o URL de imagen de portada).
     - **Opción 2: Portada diseñada con 4 elementos interactivos**:
       1. **Icono de Play**: Centrado vertical y horizontalmente; selector de variantes de icono (Play clásico, Play con círculo, Play suave); control de tamaño y color del icono y de su botón circular.
       2. **Texto Superior**: Píldora/banner superior (ej. "DALE CLICK AQUÍ" / "Haz clic para ver el video"); personalizable en tipografía, tamaño de fuente, color de texto, color de fondo de la cápsula y estilos (negrita, mayúsculas).
       3. **Flecha Indicadora**: Flecha curvada orientada hacia el botón de play; personalizable en tipo de flecha, tamaño, color y ángulo de rotación sobre su eje (0° a 360°).
       4. **Fondo de Portada**: Fondo personalizable (color sólido, gradiente suave o patrón oscuro) con control de opacidad y selector de color.
   - **Comportamiento interactivo**: Al hacer clic sobre la portada (en vista previa o modo público), la cubierta se desvanece suavemente y el video se reproduce automáticamente.
5. **Disposición**:
   - Mantenimiento intacto del control de márgenes (Box Model).

---

### C. Elemento Audio (`audio`)
1. **Origen de Audio**:
   - Selector desplegable **"Fuente"**: `SoundCloud`, `Spotify`, `Audio Externo`, `Subir Audio`, `Alojado en Servidor`.
   - Campo para URL de audio/canción/playlist.
   - Eliminación de textos redundantes inferiores y del check verde.
   - Mantenimiento de botón de carga de audio de prueba.
2. **Soporte de Playlist**:
   - Cuando se introduce un enlace de playlist (Spotify o SoundCloud), renderizar el reproductor embebido completo que expone la lista de pistas navegable (hasta 20+ temas).
3. **Disposición**:
   - Acordeón de espaciado y márgenes al final.

---

### D. Elemento Icono (`icon`)
1. **Previsualización Visual de Icono**:
   - En lugar de mostrar solo el nombre textual (ej. "Star"), renderizar la forma real del icono seleccionado en un recuadro gráfico destacado.
2. **Organización de Controles**:
   - **Tamaño y Color en una sola línea**: Slider de tamaño del icono colocado de forma compacta y selector de color en la misma fila para optimizar espacio vertical.
   - Inmediatamente debajo: **"Forma del icono"** (desplegable: Ninguna / Círculo / Cuadrado / Esquinas redondeadas).
   - Inmediatamente debajo: **"Color de Fondo del contenedor"** con su respectivo selector de color (Hex y presets).
3. **Disposición**:
   - Acordeón de márgenes y padding al final.

---

## 2. Arquitectura de Componentes y Datos

```
┌────────────────────────────────────────────────────────────────────────┐
│ VisualEditor / Inspector Panel (Sidebar)                               │
├────────────────────────────────────────────────────────────────────────┤
│  Image Inspector:                                                      │
│  [1. Origen] → [2. Ajustes/Forma (W/H Sliders)] → [3. Link] →         │
│  [4. Bordes] → [5. Disposición]                                        │
│                                                                        │
│  Video Inspector:                                                      │
│  [1. Origen (Fuente + URL)] → [2. Ajustes (Bordes + Ancho)] →          │
│  [3. Opciones (Autoplay/Mute/Loop)] → [4. Cover Portada (4 Elementos)] │
│  → [5. Disposición]                                                    │
│                                                                        │
│  Audio Inspector:                                                      │
│  [1. Origen (Fuente + Playlist)] → [2. Disposición]                    │
│                                                                        │
│  Icon Inspector:                                                       │
│  [Visual Preview] → [Tamaño + Color fila única] →                      │
│  [Forma Contenedor] → [Color Fondo] → [Disposición]                    │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │ Actualiza estado del elemento
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ Canvas Renderer & PublicFunnelModal                                    │
├────────────────────────────────────────────────────────────────────────┤
│  - Renderizado de imagen con enlace <a> funcional si existe URL        │
│  - Renderizado de Video con Cover interactivo y autoplay al clic       │
│  - Embed de Audio con soporte para playlist de 20 temas                │
│  - Renderizado de Icono con forma y fondo configurados                 │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Plan de Verificación

1. **Pruebas de Imagen**:
   - Agregar nueva imagen y verificar que nace con `borderRadius: 0px`.
   - Modificar ancho y alto con los sliders y comprobar sincronización proporcional con candado activo y desbloqueo al abrir el candado.
   - Pulsar "Restaurar tamaño original" y verificar restablecimiento.
   - Probar configuración de enlace y apertura en nueva pestaña en modo vista previa.
2. **Pruebas de Video**:
   - Seleccionar fuente (YouTube, Vimeo, etc.), verificar remoción de textos y checks verdes.
   - Probar bordes y ancho máximo numérico.
   - Configurar portada personalizada compuesta con icono, texto superior, flecha girada y fondo; verificar que al hacer clic se oculta e inicia el video.
3. **Pruebas de Audio**:
   - Probar fuentes, ingresar enlace de playlist y verificar visualización de lista de pistas.
4. **Pruebas de Icono**:
   - Verificar preview gráfico de la forma del icono, alineación horizontal de tamaño y color, y selector de forma/fondo.
5. **Validación de Compilación y Tipos**:
   - Ejecutar `compile_applet` y `lint_applet` para confirmar cero errores.

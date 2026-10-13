# Trabajo realizado

## 2026-10-13 · Primera publicación Arsenal Collection

- Separación del repositorio football-lab respecto del Git de la carpeta padre.
- Descarga de los 38 partidos StatsBomb 2003/04, eventos y alineaciones completos.
- Agregación por jugador, reconstrucción de minutos regulares y validación de resultados históricos.
- Archivo público FPL 2025/26 con 36 entradas de Arsenal; cruce de 24 jugadores actuales por ID estable `code`, no por coincidencias parciales del nombre.
- Distinción entre plantel actual, club del rendimiento 2025/26 y afiliación FPL actual de candidatos.
- Web estática con comparación, once propuesto, planteles filtrables, candidatos externos, partidos, fuentes y muestra FM26.
- Faltantes visibles, definiciones distintas señaladas y ausencia de porcentaje global de similitud.
- Pruebas de relojes, resultados, cero/faltante, afiliaciones e igualdad de cinco muestras con FPL oficial.
- Publicación solicitada por el usuario: commit, push y GitHub Pages.

Pendiente: estadísticas modernas de pases/progresión, atributos FM de cobertura completa, homologación por campo, revisión futbolística de parejas y viabilidad económica de candidatos. Ninguno se presenta como resuelto en la página.

## 2026-10-13 · Porcentaje de producción ofensiva

A pedido del usuario, se agregó offensive_v1: porcentaje explícito de cercanía en goles/90 y xG/90 con pesos iguales, mínimo de minutos, tratamiento de faltantes/ceros y exclusión de arqueros/defensores. No afirma similitud táctica ni probabilidad de encaje. Se aclaró la sección de acciones disponibles sólo en 2003/04. Se prueban simetría, normalización por minutos, valores iguales, faltantes, ceros y exclusiones por posición.

## 2026-10-13 · Porcentajes visibles en comparación y Refuerzos

Se agregó un acceso visible desde el encabezado, porcentajes por pareja en el once y una columna sticky de similitud en Refuerzos. La lista externa usa el mismo offensive_v1, con orden predeterminado descendente y una ficha de la mejor coincidencia dentro de los filtros. El cambio de referente ajusta automáticamente la categoría; faltantes quedan no evaluables. Se versionaron las URLs de CSS/JS para evitar cargar una mezcla de archivos antiguos desde caché.

## 2026-10-13 · Overall, Ofensivo y Defensivo

Se implementó profile_v2: xA se suma al ataque; recuperaciones, tackles y CBI a defensa; atajadas y goles recibidos para arqueros. Se reconstruyó CBI histórico y se atribuyeron los 26 goles recibidos al arquero que completó los 38 partidos. Se documentan proxies y pesos por función original. Top siete refuerzos, tres porcentajes compactos por candidato, pestañas en rojo Arsenal y eliminación de los destacados grandes de porcentaje del header y Refuerzos. Pruebas de ponderación, faltantes, ceros, arqueros, rankings y exposición histórica.

## 2026-10-13 · Partidos con color, escudos y páginas de detalle

Tarjetas rellenas de verde pastel, rojo pastel y amarillo pastel según el resultado del Arsenal. Nombres y marcador ordenados local–visitante, con dos escudos discretos. Se reemplazaron los enlaces al JSON por fichas HTML para los 76 partidos. Se añadió resumen de estadísticas, alineaciones y cronología histórica; los faltantes modernos quedan explícitos. Se verificó que todos los goles de las cronologías, incluidos los goles en contra, reconcilien con el marcador y que cada fixture tenga ficha y escudos válidos. La navegación de vuelta conserva la temporada y la pestaña Partidos.

La revisión de las fichas detectó intervalos abiertos después de expulsiones. Se corrigieron los minutos en la generación histórica y las fichas, con pruebas para Campbell (24,4 minutos) y Li en el primer partido. Se regeneraron los agregados; cualquier índice afectado se recalcula con la exposición corregida.


## 2026-10-13 · Posiciones compatibles y retiro de Football Manager

Se retiró la sección Football Manager y su muestra de los datos descargables y del generador. Comparar limita el selector a grupos compatibles; el buscador de refuerzos fija automáticamente el grupo original y conserva hasta siete resultados. El modelo también rechaza grupos incompatibles. Se conserva la hipótesis editorial Bergkamp–mediapunta del once actual. Entrar desde Plantel elige un referente compatible. Validación: pruebas del modelo, doce pruebas de datos y navegación en navegador.

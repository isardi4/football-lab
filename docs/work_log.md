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

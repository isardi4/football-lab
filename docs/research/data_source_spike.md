# Primer chequeo comparativo de fuentes gratuitas

Fecha: 2026-10-07. Estado: **comparación preliminar; ninguna fuente seleccionada; D1 pendiente**.

Objetivo: elegir datos gratuitos para un MVP de búsqueda y comparación de jugadores. Se separan observaciones sobre archivos descargados de cobertura anunciada por los proveedores. Un HTTP exitoso demuestra acceso a esa muestra, no cobertura completa ni calidad futbolística.

La bajada detallada por fuente y la consulta de acceso a API-Football están en [source_comparison.md](source_comparison.md).

## Comparación inicial

| Fuente | Acceso gratuito | Información útil | Chequeo realizado | Limitación para este MVP |
|---|---|---|---|---|
| StatsBomb Open Data | JSON públicos, sin cuenta | Eventos individuales, coordenadas, alineaciones | Catálogo, partidos de una edición y eventos/alineaciones de un partido descargados | Cobertura selectiva; hay ediciones parciales |
| Wyscout, dataset académico | Dataset público; muestra procesada disponible en GitHub | Eventos con jugador, equipo, tiempo, coordenadas y etiquetas | Partido procesado descargado; publicación original consultada | Histórico; muestra procesada requiere verificar equivalencia con original |
| SkillCorner Open Data | CSV y JSON públicos | Agregados físicos, movimientos sin pelota y pases; muestras de tracking | Tres CSV de temporada descargados e inspeccionados | Filtro de participación y distintos universos; revisar definiciones y condiciones de datos |
| API-Football Free | Cuenta/key; 100 consultas/día y temporadas limitadas según página oficial | Endpoints de jugadores, alineaciones y estadísticas | Consulta real sin key: HTTP 403; autenticación pendiente | Información efectiva por liga/temporada todavía desconocida |
| football-data.org Free | Cuenta/token; 10 consultas/minuto | Resultados, calendario, tablas de 12 competiciones | Página oficial de planes consultada | Alineaciones y planteles figuran en paquete pago; baja prioridad para perfil estadístico |
| Football-Data.co.uk | CSV descargable sin cuenta en la muestra | Resultados y estadísticas por equipo | CSV Premier League 2023/24 descargado | No contiene jugadores en esa muestra; sirve para contexto |
| OpenFootball / footballcsv | Archivos públicos | Resultados, fechas y equipos | CSV descargado: 380 partidos, 5 columnas | No aporta rendimiento individual |
| Metrica Sports | Muestras públicas | Tracking y eventos sincronizados | CSV de eventos descargado: 1.745 filas | Tres partidos de ejemplo; primeros dos anonimizados; poca base para comparar planteles |

## Evidencia de muestras

Los números detallados, columnas, URLs y hashes SHA-256 están en [free_source_checks.json](free_source_checks.json). Los archivos originales se guardan en `data/source_checks/`, ignorado por Git.

### StatsBomb

El catálogo descargado contiene 80 combinaciones competición/temporada. Las entradas argentinas observadas son Liga Profesional 1997/1998 y 1981; no hay una entrada de Primera Nacional en este catálogo.

La edición `competition_id=9`, `season_id=281` (1. Bundesliga 2023/24) devuelve **34 partidos**. Esto impide asumir que ese archivo representa la temporada completa. Se verificó la distribución: los 34 partidos son de Bayer Leverkusen; cada rival aparece dos veces. No constituye un universo equilibrado para percentiles de toda la liga.

El partido `3895292` contiene **3.843 eventos**, **30 jugadores con eventos** y **40 jugadores listados en alineaciones**. Estar listado no equivale a haber jugado. Hay pases, tiros, presiones, recuperaciones, duelos y conducciones; minutos y participación requieren reconstrucción y validación.

Fuentes: [repositorio oficial](https://github.com/hudl/open-data), [catálogo](https://github.com/hudl/open-data/blob/master/data/competitions.json), [partidos inspeccionados](https://github.com/hudl/open-data/blob/master/data/matches/9/281.json). El README pide atribución y logo al publicar análisis. Se descargó [LICENSE.pdf](https://github.com/hudl/open-data/blob/master/LICENSE.pdf), pero todavía no se completó su revisión íntegra: no dar por resueltas redistribución o utilización comercial.

### Wyscout académico

La publicación original describe cinco ligas europeas de 2017/18, Mundial 2018 y Euro 2016, con eventos e información de jugadores/equipos/partidos, bajo **CC BY 4.0**. Esto corresponde a ese dataset académico, no a acceso gratuito a la API comercial ni a temporadas actuales.

La muestra procesada `1694390` contiene **1.641 eventos** y bloques `teams` y `players`. Los eventos observados incluyen `playerId`, `teamId`, `eventName`, `subEventName`, `tags`, `positions`, `matchPeriod` y `eventSec`. Falta comprobar minutos, posiciones, identidad y completitud para una edición entera.

El enlace de ejemplo del README omite el subdirectorio `files` y devolvió 404. La ruta verificada es `processed-v2/files/1694390.json`. El sitio de Figshare devolvió 403 en el navegador de investigación; eso no prueba que sus descargas sean inaccesibles para todos.

Fuentes: [publicación original](https://www.nature.com/articles/s41597-019-0247-7), [colección original](https://figshare.com/collections/Soccer_match_event_dataset/4415000), [muestra procesada](https://github.com/koenvo/wyscout-soccer-match-event-dataset/blob/main/processed-v2/files/1694390.json). La muestra de GitHub es una transformación de terceros, no una segunda fuente independiente.

### SkillCorner

Los tres CSV corresponden a AUS 1 League 2024/2025:

| Archivo | Filas | Jugadores únicos | Equipos | Columnas | Celdas vacías |
|---|---:|---:|---:|---:|---:|
| Physical | 406 | 268 | 13 | 65 | 365 |
| Passing | 407 | 284 | 13 | 48 | 108 |
| Off-ball runs | 407 | 284 | 13 | 130 | 1.325 |

En cada archivo, la combinación jugador/equipo/grupo posicional es única en esta muestra. Hay identidad, fecha de nacimiento, posición y minutos; los datos físicos incluyen distancias y sprints, y los de pases incluyen volumen y precisión. No unir sólo por jugador: generaría multiplicaciones o mezcla de roles/equipos. Tampoco sumar promedios o porcentajes entre filas.

El README indica que los agregados filtran actuaciones de más de 60 minutos. La comparación describe ese universo seleccionado, no toda participación de la temporada. La diferencia de jugadores entre archivos y los faltantes requieren análisis antes de construir scores.

Fuentes: [README oficial](https://github.com/SkillCorner/opendata), [CSV publicados](https://github.com/SkillCorner/opendata/tree/master/data/aggregates), [licencia del repositorio](https://github.com/SkillCorner/opendata/blob/master/LICENSE). El repositorio incluye MIT y solicita crédito; falta aclarar el alcance específico sobre los datos antes de redistribuirlos. No se descargó tracking completo.

### APIs y fuentes de contexto

- **API-Football:** el [plan gratuito](https://www.api-football.com/pricing) anuncia 100 requests/día, todos los endpoints/competiciones y temporadas limitadas. La [cobertura pública](https://www.api-football.com/coverage) lista Primera Nacional y Federal A. Una liga listada no confirma estadísticas individuales completas: falta key para inspeccionar flags de cobertura, temporadas accesibles y respuestas reales. Mantener como candidata para Argentina.
- **football-data.org:** el [plan gratuito](https://www.football-data.org/pricing) anuncia 12 competiciones, resultados diferidos, fixtures y tablas. Alineaciones, sustituciones y planteles aparecen en “Free + Deep Data”, que es pago. No se probó un token ni se revisaron condiciones completas.
- **Football-Data.co.uk:** [CSV comprobado](https://www.football-data.co.uk/mmz4281/2324/E0.csv) con 380 filas, estadísticas local/visitante y cuotas. No incluye IDs o métricas de jugadores. No resuelve por sí solo el MVP de scouting; condiciones de reutilización pendientes.
- **OpenFootball / footballcsv:** el [repositorio consultado](https://github.com/footballcsv/england) declara CC0 y muestra resultados de partidos. Se descargó Inglaterra 2013/14: 380 filas y cinco columnas de resultados.
- **Metrica:** su [README](https://github.com/metrica-sports/sample-data) describe dos partidos anonimizados y un tercer ejemplo, eventos/tracking sincronizados y reconocimiento de fuente al publicar. Útil para aprender tracking, con baja prioridad para una comparación de jugadores identificables en una temporada.

## Conclusión provisional y próximos chequeos

Hay **tres alternativas concretas para profundizar**: StatsBomb para eventos detallados, Wyscout académico para temporadas históricas de ligas, y SkillCorner para agregados físicos/tácticos de una edición. API-Football Free agrega una vía potencial para Argentina, pendiente de prueba autenticada. No hay un ganador todavía: “más columnas” no equivale a más utilidad ni a mejor cobertura.

Antes de elegir:

1. Inspeccionar 3–5 partidos de StatsBomb y Wyscout en ediciones candidatas y cuantificar equipos/partidos cubiertos. Verificar minutos, posiciones, IDs y campos necesarios para 5–8 métricas del MVP.
2. En SkillCorner, medir cobertura por rol/equipo y faltantes por métrica, explicar el filtro de minutos y revisar denominadores. Evaluar si permite una V1 basada en agregados sin reconstruir eventos.
3. Con acceso gratuito a API-Football, consultar temporadas permitidas y 3–5 partidos de Primera Nacional; registrar ausencia de datos además de errores. No poner keys en el repo ni en informes.
4. Completar revisión de condiciones para una demo pública de las candidatas finalistas y documentar atribución.
5. Elegir por cobertura útil, reproducibilidad, dificultad de implementación y posibilidad de mostrar el resultado públicamente; mantener adapters para cambiar luego.

Esta ronda es de acceso y estructura. No certifica exactitud de métricas, comparabilidad entre proveedores, licencia de una aplicación comercial ni resolución de D1.

## Reproducibilidad

Sin dependencias adicionales, desde la raíz:

```sh
python3 scripts/check_free_sources.py --download
python3 scripts/check_free_sources.py
```

El primer comando descarga once archivos públicos; el segundo analiza el cache sin red. Se ejecutó el segundo con las once muestras descargadas: **11 inspecciones, 0 errores**. El modo de descarga del script todavía no se ejecutó; las descargas de esta ronda se hicieron con `curl`. Las URLs apuntan a ramas mutables; los hashes permiten detectar cambios, pero para reproducibilidad duradera habrá que fijar revisiones o conservar snapshots autorizados.

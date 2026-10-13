# Qué entrega cada fuente y para qué sirve

Fecha: 2026-10-07. Esta comparación usa muestras descargadas y documentación oficial. **No hay proveedor seleccionado.** “No observado” significa que no se encontró en la muestra o que falta acceso, no que la fuente completa no lo ofrezca.

## Comparación para el MVP

| Fuente | Datos por jugador comprobados | Participación/posición | Profundidad futbolística | Argentina | Trabajo para una primera comparación |
|---|---|---|---|---|---|
| StatsBomb Open Data | Eventos, IDs y alineaciones | Reconstruir minutos; posiciones en alineaciones/táctica | Pases, tiros, recuperaciones, duelos, presiones, conducciones, coordenadas | Catálogo con dos ediciones históricas; sin Primera Nacional | Alto: transformar eventos y elegir universo con cobertura suficiente |
| Wyscout académico | Eventos, identidad y atributos biográficos | Rol amplio observado; minutos pendientes | Pases, duelos, tiros, faltas y etiquetas con coordenadas | Dataset descrito no incluye ligas argentinas | Alto: interpretar etiquetas, reconstruir participación y validar datos históricos |
| SkillCorner Open Data | Agregados físicos, pases y movimientos sin pelota | Minutos y grupos posicionales en CSV; muestra filtrada | Sprints, distancias, pases rompe líneas, desmarques, oportunidades de pase | CSV inspeccionados de Australia | Medio: validar denominadores, faltantes y unión de tablas |
| API-Football Free | **No comprobados: falta key** | Pendiente de requests autenticadas | El catálogo de endpoints no prueba datos efectivos | Primera Nacional anunciada, todavía sin muestra deportiva | Desconocido hasta consultar la API |
| football-data.org Free | No comprobados con token; plan básico orientado a partidos | Alineaciones/planteles anunciados en paquete pago | No se verificaron métricas individuales gratuitas | Pendiente; no candidata principal para Argentina | Bajo para resultados; no demuestra viabilidad del scouting |
| Football-Data.co.uk | No en el CSV inspeccionado | No | Tiros, faltas, córners y tarjetas por equipo | No se descargó muestra argentina | Bajo para contexto; insuficiente para perfiles individuales |
| OpenFootball / footballcsv | No en el CSV inspeccionado | No | Resultado, fecha, equipos y jornada | Sólo se inspeccionó Inglaterra | Bajo para contexto; insuficiente para perfiles individuales |
| Metrica Sports | Eventos de jugadores anonimizados | Identificadores tipo Player19; no biografía | Coordenadas y eventos; tracking sincronizado disponible | Identidades/competición anonimizadas en el ejemplo | Alto para tracking; universo demasiado pequeño para el scouting planteado |

Estas estimaciones de trabajo son una evaluación de implementación, no mediciones de calidad del proveedor. Las métricas de proveedores distintos no se pueden combinar por nombre sin revisar definiciones.

## API-Football: consulta real y bloqueo concreto

Se ejecutó:

```text
GET https://v3.football.api-sports.io/leagues?country=Argentina&name=Primera%20Nacional
```

Resultado: **HTTP 403**, sin autenticación. El cuerpo devuelve `results: 0`, `response: []` y:

```json
{
  "token": "Missing application key, Check our documentation on how to add your API key in headers.",
  "error": "4xHe"
}
```

Respuesta registrada en [api_football_access_check.json](api_football_access_check.json). **Esto es un error de acceso; no indica que Primera Nacional carezca de datos.** No se encontró una credencial en variables relevantes del proceso ni en `.env` / `.env.local` del proyecto.

El [plan oficial](https://www.api-football.com/pricing) anuncia 100 consultas gratuitas diarias y temporadas limitadas. Su [lista de cobertura](https://www.api-football.com/coverage) incluye Primera Nacional. Falta comprobar qué temporada admite la cuenta gratuita, los flags de cobertura y valores reales por jugador.

Para continuar, guardar la key de la cuenta directa de API-Sports en `.env` (ignorado por Git):

```dotenv
API_FOOTBALL_KEY=valor_privado
```

No pegar la key en el chat. Una key de RapidAPI requiere otra configuración; el script preparado usa la cuenta directa de API-Sports.

```sh
# Una consulta: IDs, temporadas y flags anunciados por liga.
python3 scripts/check_api_football.py

# Dos consultas: cobertura de ese año y fixtures, con IDs de Chacarita.
python3 scripts/check_api_football.py --season AÑO_DISPONIBLE

# Tres consultas para un partido elegido: jugadores, alineaciones, stats de equipo.
python3 scripts/check_api_football.py --fixture ID_PARTIDO
```

El script guarda respuestas en el cache local y se detiene ante errores HTTP o errores del cuerpo. No imprime headers ni la key. Se verificó sintaxis y salida sin credencial; la ejecución autenticada sigue pendiente. Los IDs y años se elegirán de las respuestas, sin asumir que la temporada actual esté habilitada.

## Bajada por fuente

### StatsBomb: explicar acciones en el campo

Sirve para construir estadísticas desde acciones individuales y mostrar de dónde sale una comparación. La muestra contiene 3.843 eventos con 30 jugadores que realizaron acciones; las alineaciones listan 40 jugadores. Podemos investigar pases, progresión, recuperación, presión y mapas de acciones, definiendo cada cálculo.

**Hallazgo de cobertura:** los 34 partidos de Bundesliga 2023/24 son todos de Bayer Leverkusen. Cada rival aparece dos veces. Ese archivo permite estudiar esa campaña, pero produce exposiciones muy desiguales para comparar jugadores de toda la liga. No usarlo como universo completo de percentiles.

La decisión depende de encontrar una edición adecuada. La biografía y los minutos deben verificarse por archivo; no asumir edad o participación a partir del listado. [Repositorio oficial](https://github.com/hudl/open-data), [partidos comprobados](https://github.com/hudl/open-data/blob/master/data/matches/9/281.json).

### Wyscout académico: rendimiento histórico con biografía

La muestra Francia–Rumania (`1694390`) entrega 1.641 eventos: 780 pases, 537 duelos y 22 tiros, además de otras acciones. Los objetos de jugadores incluyen nombre, nacimiento, altura, peso, pie y rol amplio. Es información adicional útil para filtros respecto de una muestra puramente de eventos.

Es un dataset histórico, no acceso a Wyscout comercial actualizado. El campo `currentTeamId` es parte de un snapshot: no tratarlo como club actual ni como club en la fecha del partido sin comprobarlo. Los roles `MID/FWD/DEF` no distinguen por sí solos volante central de todas las demás funciones.

Próximo chequeo: edición de liga completa, metadata de partidos/alineaciones y reconstrucción de minutos. [Publicación original y licencia CC BY 4.0](https://www.nature.com/articles/s41597-019-0247-7), [muestra procesada de terceros](https://github.com/koenvo/wyscout-soccer-match-event-dataset/blob/main/processed-v2/files/1694390.json).

### SkillCorner: perfiles físicos y juego sin pelota

Los CSV australianos 2024/25 permiten trabajar directamente con agregados. Physical tiene 268 jugadores únicos; Passing y Off-ball runs, 284. Se observaron nacimiento, equipo, minutos, grupo posicional, sprints, distancias, pases rompe líneas y distintos tipos de desmarques.

Physical contiene 92 filas de Midfield; Passing y OBR también, sin garantizar equivalencia de identidades entre tablas. Hay filas por jugador/equipo/rol. Physical no incluye el grupo Goalkeeper; las otras dos tablas sí. No interpretar su ausencia como rendimiento físico cero.

El proveedor filtra actuaciones de más de 60 minutos. Algunas columnas ya están normalizadas (`p30tip`); hay que confirmar su definición antes de aplicar per-90. Puede acelerar un MVP basado en perfiles agregados, a cambio de menor capacidad para reproducirlos desde eventos. [Datos y documentación oficial](https://github.com/SkillCorner/opendata).

### football-data.org: calendario y resultados mediante API

El plan gratuito anunciado ofrece fixtures, tablas y resultados diferidos de 12 competiciones, a 10 consultas/minuto. Planteles, sustituciones y alineaciones aparecen en un paquete pago. No hubo consulta autenticada porque no hay token configurado.

Puede servir para practicar ingestión de una API y añadir contexto competitivo, pero la documentación consultada no demuestra una base gratuita suficiente para comparar recuperación o progresión por jugador. [Planes oficiales](https://www.football-data.org/pricing).

### Football-Data.co.uk: contexto de equipos

El CSV Premier League 2023/24 contiene 380 partidos, con tiros, tiros al arco, faltas, córners y tarjetas separados entre local y visitante. No contiene jugadores. Es sencillo para contextualizar equipos, no para atribuirles rendimiento individual.

Las cuotas presentes no aportan al MVP planteado. Antes de publicar datos derivados, completar revisión de condiciones de reutilización. [Archivo comprobado](https://www.football-data.co.uk/mmz4281/2324/E0.csv).

### OpenFootball / footballcsv: resultados simples

Se descargó el CSV de Inglaterra 2013/14: 380 filas y cinco columnas (`Round`, `Date`, `Team 1`, `FT`, `Team 2`). No contiene alineaciones, minutos ni acciones. Es útil para un calendario o tabla de posiciones y fácil de importar; no cubre el núcleo de scouting. [Repositorio y licencia CC0](https://github.com/footballcsv/england), [archivo comprobado](https://github.com/footballcsv/england/blob/master/2010s/2013-14/eng.1.csv).

### Metrica: laboratorio de tracking

Se descargó Sample Game 1: 1.745 eventos y 14 columnas, con equipo, tipo/subtipo, periodo, frames, segundos, jugador de origen/destino y coordenadas. Los jugadores se identifican como `Player19`, sin biografía en esta muestra. Se observaron valores `NaN` explícitos en coordenadas: contarlos además de las celdas vacías.

Sirve para aprender movimientos y visualizar acciones; no ofrece el universo de jugadores identificados y temporadas que necesitamos. No se descargó el tracking completo. [Proveedor y alcance de las muestras](https://github.com/metrica-sports/sample-data), [CSV de eventos](https://github.com/metrica-sports/sample-data/blob/master/data/Sample_Game_1/Sample_Game_1_RawEventsData.csv).

## Qué decisión permite esta ronda

- Para comparar perfiles con agregados y menor transformación inicial: profundizar **SkillCorner**.
- Para aprender analytics desde eventos y explicar cada cálculo: profundizar **StatsBomb y Wyscout**, verificando cobertura.
- Para acercarse a Primera Nacional con información actualizable: probar **API-Football autenticada** antes de decidir.
- Las fuentes de resultados pueden complementar contexto; no reemplazan datos individuales.

No combinar las tres candidatas principales en el MVP: sus muestras no comparten competición/temporada. Primero elegir un universo y una fuente principal por evidencia; después enriquecer donde tenga sentido.

## Archivos verificables

- [Inventario de 11 muestras con URLs, estructura y hashes](free_source_checks.json).
- [Informe del spike y criterios pendientes](data_source_spike.md).
- `scripts/check_free_sources.py`: regeneración del inventario; 11 muestras locales, 0 errores.
- `scripts/check_api_football.py`: preparado para la prueba autenticada, pendiente de key.


Profundización: [SkillCorner — viabilidad y MVP propuesto](skillcorner_deep_dive.md).

# Football Analytics Lab

> **North Star document / Project plan**
> Estado: `V1 exploratoria / publicación GitHub Pages`
> Última revisión: `2026-10-13`
> Objetivo inicial: **MVP de portfolio/aprendizaje con datos gratuitos**
> Caso de uso inicial: **Invincibles 2003/04 vs Arsenal actual: similitud por función y posibles refuerzos**
> Objetivo del documento: mantener alineado el desarrollo, las decisiones de arquitectura y el uso de Codex con el problema real que queremos resolver.

---

## 0. Cómo usar este documento

Este archivo es la referencia principal del proyecto. Antes de implementar una feature importante, cambiar arquitectura, incorporar una nueva fuente o modificar una métrica central, hay que volver a este documento y verificar que el cambio acerque al producto a su objetivo.

El proyecto puede iterar y cambiar. Este documento **no es un contrato inmutable**, pero cualquier cambio de dirección relevante debería quedar reflejado acá.

## 0.1 Estado actual y alcance de esta revisión

El workspace contiene una primera aplicación estática en `docs/` y scripts reproducibles de descarga/agregación. Se creó un repositorio independiente para football-lab; la carpeta padre no se incluye en commits. La fase actual es **V1 exploratoria publicada en GitHub Pages**, con métricas históricas y modernas, planteles, comparación y candidatos externos. No hay modelo validado de similitud táctica.

La implementación descarga los 38 partidos históricos, usa un archivo FPL de temporada 2025/26 contrastado con cinco respuestas oficiales y separa el plantel vigente de la ventana de rendimiento. Las fuentes adicionales, modelos avanzados y arquitectura del resto del documento son propuestas. Ver [README](README.md), [diccionario](docs/data_dictionary.md) y [registro de trabajo](docs/work_log.md).

## 0.2 Acuerdos de dirección y decisiones pendientes

Acuerdos confirmados por el usuario: **portfolio y aprendizaje como prioridad, fuentes gratuitas para el MVP y evolución hacia scouting útil**. **Dirección vigente del 2026-10-13:** comparar los Invincibles del Arsenal 2003/04 con el plantel más actual posible del Arsenal; identificar equivalentes internos, explicar diferencias y sugerir refuerzos para acercarse a los perfiles originales. Esto reemplaza el caso Hull City. La exploración de enfrentamientos entre grandes equipos históricos queda fuera del alcance.

Referencia histórica: los 38 partidos de Premier 2003/04 están listados en StatsBomb Open Data; se inspeccionó un archivo de eventos, pendiente de auditoría del conjunto completo. Referencia actual: plantel Arsenal 2026/27, corte inicial 2026-10-13, contrastado con listas oficiales recientes de Premier League. Separar fecha del plantel, fecha de descarga y última fecha deportiva disponible. Como base de rendimiento se propone Arsenal campeón 2025/26: CSV con 38 partidos y cinco agregados individuales FPL comprobados. El plantel de selección sigue siendo el vigente; 2026/27 queda como ventana de actualización separada. Se investigan atributos FM públicos como complemento sin juego propio. La fuente moderna detallada sigue pendiente; FPL responde sin key, pero no cubre pases/progresión ni roles finos. Ver [alcance y viabilidad de Arsenal](docs/research/arsenal_invincibles_scope.md).

Antes de implementar, conversar y registrar:

| Decisión | Propuesta para discutir | Qué resuelve |
|---|---|---|
| Objetivo principal | **Confirmado:** portfolio/aprendizaje, con utilidad real como evolución | Cuánto invertir en profundidad de datos frente a amplitud tecnológica |
| Primera pregunta | ¿Qué jugadores del Arsenal actual se parecen por función a cada Invincible y qué perfiles faltan? | Un caso acotado para evaluar utilidad |
| Ventana temporal | Histórico 2003/04; plantel actual 2026/27 con corte 2026-10-13; rendimiento reciente con ventanas separadas | Evitar mezclar rendimientos y edades de momentos distintos |
| Presupuesto de datos | **Confirmado:** cero gasto en fuentes para el MVP | Qué proveedores podemos probar y sostener |
| Primera entrega | Tabla reproducible y comparación de jugadores antes de la web | Validar datos y métricas con poca infraestructura |
| Validación futbolística | Elegir quién revisará una muestra de perfiles y candidatos | Comprobar si la información sirve para investigar jugadores |

Las filas marcadas como confirmadas reflejan instrucciones del usuario; el resto son propuestas pendientes. Registrar los acuerdos acá y, cuando afecten arquitectura, en `docs/decisions/`.

## 0.3 MVP y primer experimento

**Prioridad vigente:** reconstruir perfiles de los Invincibles, compararlos con jugadores del Arsenal actual y proponer candidatos externos que reduzcan las brechas. Los ejemplos posteriores de Chacarita/Hull y el roadmap original son antecedentes; este alcance prevalece cuando hay contradicciones.

**Primer experimento (Phase 0):** auditar eventos, alineaciones y participación de 3–5 partidos de Arsenal 2003/04 y verificar una fuente moderna con métricas compatibles de jugadores. Confirmar el plantel actual con fuentes oficiales, incluyendo jóvenes del primer equipo y excluyendo cedidos fuera del club. Definir por campo qué comparación está sustentada y qué dimensión no se puede medir.

**MVP / V1:** una tabla por referente histórico que muestre candidatos internos, similitudes, diferencias, cobertura y confianza; después candidatos externos para las brechas con datos suficientes. Empezar con Vieira/Gilberto y Henry/Bergkamp como propuesta de piloto, sin convertir esas parejas en restricciones para el producto final. Cubrir el once de referencia y permitir revisar otros participantes históricos.

La primera entrega termina con perfiles reproducibles, comparación explicada del plantel vigente y una shortlist verificable donde exista cobertura moderna suficiente. Un rol sin evidencia se marca no evaluable. Se implementó profile_v2 a pedido del usuario, reemplazando offensive_v1: afinidad Overall, Ofensiva y Defensiva por indicadores compartidos, mínimo 900 minutos, faltantes y ceros visibles, pesos por función original. Ataque: goles, xG y xA; defensa: recuperaciones, tackles y CBI aproximado; arqueros: atajadas, goles recibidos y vallas invictas. La lista externa se limita a siete candidatos. No mide similitud táctica; sus definiciones y limitaciones están en el diccionario. No publicar otros porcentajes sin definir métricas, pesos, tratamiento de faltantes y evaluación. Mantener perfiles de estilo y nivel de producción separados; una similitud alta no significa igual calidad.

La salida final propone un once sin duplicar jugadores y explica complementariedad de las parejas. La búsqueda externa comienza por Premier League si la fuente permite el mismo detalle; ampliar mercados sólo con cobertura comparable. Las sugerencias iniciales son deportivas: la viabilidad económica requiere contratos/precios verificados y no se presume. Los atributos de Football Manager publicados en sitios comunitarios se investigan desde Phase 0 como complemento, sin exigir que el usuario posea el juego. Mantenerlos separados de estadísticas reales y de partidos simulados. Opportunity score, AI Scout y simulación de partidos quedan para después.

### Regla para Codex

Al comenzar una sesión de desarrollo relevante:

1. Leer este archivo completo.
2. Identificar la fase actual del roadmap.
3. Confirmar qué problema concreto se está resolviendo.
4. Evitar implementar features que pertenezcan a fases posteriores salvo que sean necesarias como dependencia.
5. Priorizar soluciones simples y reemplazables.
6. Mantener tests y documentación al mismo tiempo que el código.
7. Registrar decisiones arquitectónicas importantes en `docs/decisions/`.
8. No modificar definiciones de métricas, scores o entidades centrales silenciosamente.

Una buena regla general:

> **No programar algo solamente porque es posible. Programarlo si mejora la capacidad del sistema para encontrar, comparar o explicar jugadores útiles para un club real.**

---

# 1. Visión

Construir una plataforma de scouting y analytics de fútbol que combine distintas fuentes de información para responder preguntas de reclutamiento reales.

El primer caso de uso será:

> **¿Qué jugadores del Arsenal actual cumplen funciones parecidas a los Invincibles 2003/04, qué diferencias quedan y qué refuerzos acercarían el plantel a esos perfiles?**

El proyecto debe evolucionar desde una plataforma de datos relativamente simple hasta un sistema capaz de:

- centralizar información de jugadores provenientes de múltiples fuentes;
- comparar jugadores entre equipos y competiciones diferentes;
- identificar jugadores similares;
- encontrar reemplazos potenciales;
- descubrir jugadores infravalorados;
- modelar necesidades específicas de un club;
- explicar por qué un jugador podría ser una buena incorporación;
- permitir exploración mediante una interfaz web;
- eventualmente permitir consultas en lenguaje natural mediante un agente de AI.

La intención no es construir un clon de SofaScore, Transfermarkt, Wyscout o Football Manager.

La intención es construir una **capa de inteligencia sobre los datos**.

---

# 2. Pregunta central del producto

El producto debe ser capaz de responder, cada vez mejor, preguntas como:

> “Chacarita necesita un volante central de menos de 25 años, accesible económicamente, que pueda recuperar pelota pero también progresarla. ¿Quiénes son los mejores candidatos?”

O:

> “Si perdemos a nuestro lateral derecho titular, ¿qué jugadores con un perfil similar serían incorporaciones realistas?”

O:

> “¿Qué jugadores de Primera B, Federal A o equipos de menor presupuesto están rindiendo por encima de lo que su contexto sugiere?”

O:

> “¿Qué futbolistas jóvenes parecen estar preparados para dar un salto de categoría?”

Todo desarrollo debería poder vincularse directa o indirectamente con una de estas preguntas.

---

# 3. Filosofía del proyecto

## 3.1 Performance != Ability != Fit != Opportunity

Queremos separar conceptos que muchas herramientas mezclan.

### Performance

Qué produjo el jugador en partidos reales.

Ejemplos:

- minutos;
- goles;
- asistencias;
- tiros;
- pases;
- recuperaciones;
- duelos;
- tackles;
- intercepciones;
- pérdidas;
- acciones progresivas;
- etc.

### Ability

Qué características creemos que tiene el jugador.

Puede provenir de:

- atributos de Football Manager;
- scouting humano;
- modelos derivados del rendimiento;
- información física/técnica disponible públicamente.

### Fit

Qué tan bien encaja ese jugador con las necesidades concretas de un equipo y rol.

Un jugador puede ser excelente pero tener bajo fit para Chacarita.

### Opportunity

Qué tan atractiva es la incorporación considerando rendimiento, capacidad, edad, costo, disponibilidad y contexto.

Un jugador “peor” en términos absolutos puede ser una mejor oportunidad.

---

# 4. Caso de uso inicial: Arsenal actual inspirado en los Invincibles

El equipo objetivo es Arsenal. Los jugadores de 2003/04 son los referentes a reconstruir a partir de sus acciones, minutos y posiciones; los candidatos internos pertenecen al plantel vigente, no necesariamente al Arsenal en la temporada usada para medir su rendimiento.

La unidad de comparación es **jugador, ventana temporal y función**. Un jugador actual puede parecerse en creación y diferir en ubicación o finalización. La ausencia de minutos recientes no significa falta de capacidad; mostrarla como falta de evidencia y usar una ventana anterior separada si existe acceso.

La ficha de cada referente debe explicar: perfil original, candidatos internos, dimensiones comparables, brechas, confianza y candidatos externos. El once propuesto debe usar jugadores distintos y revisar cómo combinan; no basta con seleccionar por separado el primero de cada ranking.

## 4.1 Configuración inicial

```yaml
club:
  name: Arsenal
  current_season: 2026/27
  roster_cutoff: 2026-10-13
reference:
  club: Arsenal
  season: 2003/04
  competition: Premier League
analysis:
  comparison: historical_role_to_current_players
  current_performance_window: 2025/26  # Base completa propuesta; validar cobertura por jugador.
  external_market: Premier League  # Primera propuesta, no límite definitivo.
```

Los detalles de métricas, evidencia y criterios de aceptación están en [el alcance vigente](docs/research/arsenal_invincibles_scope.md).

---

# 5. Qué NO queremos construir

Para proteger el foco, inicialmente quedan fuera:

- resultados en vivo;
- fantasy football;
- apuestas;
- predicción de resultados de partidos;
- gestión completa de planteles estilo Football Manager;
- redes sociales;
- noticias;
- tracking GPS;
- video analysis;
- modelo financiero completo de clubes;
- scraping masivo de sitios sin revisar términos de uso;
- microservicios innecesarios;
- infraestructura cloud compleja antes de validar el producto.

Estas ideas pueden aparecer más adelante, pero no forman parte del MVP.

---

# 6. Usuario objetivo

## 6.1 Usuario conceptual principal

Scout / Director Deportivo / Analista de Recruitment de un club con recursos limitados.

Necesita encontrar jugadores:

- accesibles;
- adecuados al nivel del club;
- con determinadas características;
- potencialmente infravalorados;
- provenientes de mercados que el club pueda atacar.

## 6.2 Usuario real inicial

Nosotros mismos.

Esto tiene una ventaja: podemos cuestionar constantemente si una feature resulta realmente útil.

---

# 7. Data Strategy

La plataforma debe combinar fuentes complementarias. Ninguna fuente individual define “la verdad”.

### Estrategia gratuita para el MVP (acuerdo vigente)

Comparar varias fuentes gratuitas y elegir **una fuente principal para la primera implementación**. Ninguna está seleccionada. StatsBomb Open Data es una candidata: publica JSON de competiciones/temporadas, partidos, eventos y alineaciones para una selección de competiciones. Es adecuado para investigar un MVP analítico, pero debemos verificar cobertura de la edición elegida y revisar su licencia antes de publicar una demo. El README exige atribución a StatsBomb y uso de su logo al compartir análisis.

Referencias oficiales consultadas el 2026-10-07:

- [Repositorio y condiciones resumidas](https://github.com/hudl/open-data).
- [Licencia del dataset](https://github.com/hudl/open-data/blob/master/LICENSE.pdf).
- [Catálogo de competiciones](https://github.com/hudl/open-data/blob/master/data/competitions.json).

La recomendación de esta fuente es una propuesta técnica; todavía no se descargó ni validó una muestra. No afirmar cobertura de Primera Nacional. Derivar estadísticas desde eventos requiere definir y verificar cada cálculo, especialmente minutos y cambios de posición. No todos los campos de fuentes comerciales tienen equivalentes directos.

Para Phase 0, comparar candidatas antes de resolver D1 sobre la fuente y competición elegidas. Se permiten chequeos de planes gratuitos de APIs comerciales; las suscripciones pagas y la integración simultánea de múltiples proveedores quedan para después del MVP. Primeros resultados: [comparación de fuentes gratuitas](docs/research/data_source_spike.md) y [bajada por fuente](docs/research/source_comparison.md). API-Football respondió HTTP 403 sin key; falta una credencial gratuita para consultar datos deportivos.


## 7.1 Fuente A — Match / performance data

Objetivo: medir lo que el jugador hace en partidos reales.

Candidatos iniciales a investigar:

- API-Football;
- Sportmonks;
- otras APIs con cobertura de Argentina;
- datasets abiertos para desarrollo/validación.

La condición crítica es la cobertura de:

- Primera Nacional;
- Primera B Metropolitana;
- Torneo Federal A;
- Liga Profesional;
- reservas;
- Uruguay;
- Paraguay;
- Chile;
- Brasil;
- Ecuador;
- Colombia.

### Spike obligatorio antes del desarrollo profundo

Seleccionar 3–5 partidos de Chacarita dentro de la temporada y fecha de corte acordadas, incluyendo local y visitante, y consultar qué información real entrega el proveedor. Contrastar además una muestra de otros equipos de Primera Nacional; no extrapolar cobertura de un equipo a toda la competición.

Relevar disponibilidad y completitud de estos campos candidatos; esta lista no supone que todos sean accesibles:

- minutos;
- titular/suplente;
- posición;
- goles;
- asistencias;
- tiros;
- pases;
- precisión de pase;
- duelos;
- tackles;
- intercepciones;
- faltas;
- tarjetas.

Luego evaluar disponibilidad de métricas más avanzadas:

- progressive passes;
- progressive carries;
- key passes;
- touches by zone;
- pressures;
- expected goals;
- expected assists;
- field coordinates / event data.

### Decisión Gate D1

No avanzar a un modelo avanzado de scouting hasta saber exactamente qué granularidad real tenemos para Primera Nacional.

El informe del spike debe incluir proveedor y plan consultado, competición/temporada, IDs de partidos, fecha de consulta, endpoints, campos, unidades, cantidad de filas esperadas/recibidas, faltantes y restricciones de almacenamiento y publicación. Documentar costo y límites de consultas antes de elegir proveedor. La lista de APIs es una lista de candidatos, no una afirmación de cobertura verificada.

Resolver D1 con uno de estos resultados:

- **Viable para comparación:** identidad, partido, equipo, posición y minutos utilizables, más métricas con definiciones consistentes suficientes para la pregunta elegida. Acordar y registrar cuáles, y medir su completitud en toda la muestra.
- **Viable con alcance reducido:** hay identidad, alineaciones o minutos, pero faltan métricas para caracterizar el rol. Reformular la V1 como exploración de planteles y participación, explicitando qué preguntas no puede responder.
- **No viable con la fuente probada:** faltan campos esenciales, acceso sostenible o condiciones de uso adecuadas. Evaluar otra fuente, importación manual permitida o cambio de competición antes de construir la base completa.

No derivar progresión de precisión de pase, capacidad de recuperación de tarjetas ni accesibilidad económica de un valor de mercado aislado. Cada pregunta requiere evidencia pertinente.

---

## 7.2 Fuente B — Football Manager / scouting attributes

Objetivo: incorporar información difícil de obtener de estadísticas de partido.

Ejemplos:

### Technical

- Passing
- Technique
- First Touch
- Dribbling
- Tackling
- Finishing
- Crossing
- Heading

### Mental

- Decisions
- Vision
- Anticipation
- Work Rate
- Positioning
- Aggression
- Composure
- Teamwork
- Off the Ball

### Physical

- Acceleration
- Pace
- Stamina
- Strength
- Agility
- Balance

Otros datos útiles:

- positions;
- preferred foot;
- age;
- height;
- current ability;
- potential ability;
- role suitability.

### Política de uso

Football Manager se tratará como una **fuente complementaria opcional**.

El repositorio público no debe incluir dumps completos ni redistribuir bases de datos propietarias.

Diseñar el sistema para aceptar importaciones locales, por ejemplo:

```text
CSV / HTML export
        ↓
FM Import Adapter
        ↓
Normalized Player Attributes
```

Si una fuente web publica atributos de FM, revisar términos de uso antes de automatizar extracción.

El sistema debe funcionar incluso si la integración FM está deshabilitada.

---

## 7.3 Fuente C — Market / identity / contracts

Objetivo:

- identidad del jugador;
- edad;
- nacionalidad;
- club;
- historial;
- fecha de contrato;
- transfer history;
- valor estimado;
- disponibilidad probable.

Las fuentes deberán evaluarse según:

1. cobertura;
2. licencia;
3. costo;
4. estabilidad;
5. facilidad de actualización.

No acoplar el core a Transfermarkt ni a ningún proveedor particular.

---

## 7.4 Fuente D — Competition / team context

Necesitamos entender el contexto en el que juega cada futbolista.

Variables potenciales:

- strength de la liga;
- posición del equipo;
- posesión promedio;
- goles a favor / contra;
- estilo de juego;
- volumen de pases;
- intensidad defensiva;
- edad promedio del plantel;
- localía;
- calidad relativa del equipo.

Esto permitirá evitar comparaciones ingenuas.

---

# 8. Principio arquitectónico clave: Source Adapters

Nunca permitir que el modelo del producto dependa directamente del formato de una API externa.

Cada proveedor debe tener su adapter.

Ejemplo:

```text
API-Football ──▶ ApiFootballAdapter ──┐
                                       │
Sportmonks ────▶ SportmonksAdapter ───┼──▶ Canonical Data Model
                                       │
FM CSV ────────▶ FootballManagerAdapter┘
```

Así podremos cambiar de proveedor sin reescribir toda la aplicación.

---

# 9. Entity Resolution

Este será uno de los problemas centrales del proyecto.

La misma persona puede aparecer como:

```text
Juan Ignacio Pérez
Juan I. Pérez
J. Pérez
Juan Perez
```

Y cada fuente puede tener un ID diferente.

## 9.1 Canonical Player ID

La plataforma debe generar un identificador interno independiente de cualquier proveedor.

```text
player_id = internal UUID
```

Guardar IDs externos en una tabla de mapeo.

### player_source_identity

| player_id | source | source_player_id | source_name |
|---|---|---|---|

## 9.2 Matching features

Usar combinación de:

- nombre normalizado;
- fecha de nacimiento;
- nacionalidad;
- club actual;
- posición;
- altura;
- historial de clubes.

### Matching strategy inicial

1. exact DOB + similar name;
2. exact normalized name + same club;
3. fuzzy name + DOB + nationality;
4. marcar casos dudosos para revisión manual.

No hacer fuzzy matching automático agresivo en producción.

## 9.3 Confidence

Cada match debe tener:

```text
match_confidence
match_method
review_required
```

---

# 10. Modelo de datos conceptual

Separar datos crudos, entidades core, métricas y features.

## 10.1 Raw / ingestion

Datos exactamente como llegan.

Ejemplo:

```text
raw_api_football_players
raw_api_football_fixtures
raw_api_football_player_stats
raw_fm_players
raw_market_players
```

Nunca modificar silenciosamente el raw data.

## 10.2 Staging

Normalización de columnas, tipos y nombres.

```text
stg_players_api_football
stg_player_match_stats
stg_fm_players
stg_teams
stg_competitions
```

## 10.3 Core

Entidades canónicas.

### dim_player

```text
player_id
full_name
birth_date
nationality
height_cm
preferred_foot
primary_position
```

### dim_team

```text
team_id
team_name
country
```

### dim_competition

```text
competition_id
competition_name
country
level
```

### dim_season / dim_match

Separar la competición de su edición/temporada. El partido debe guardar `match_id`, `competition_id`, `season_id`, fecha, equipos y estado; así la historia de un jugador puede consultarse por fecha sin duplicar competiciones por año.

### fact_player_match

Grano:

> un jugador en un partido.

```text
player_id
match_id
team_id
minutes
position
starter
...
```

### fact_player_season

Grano:

> un jugador / equipo / competición / temporada.

Agregado a partir de fact_player_match cuando sea posible.

### player_attribute_snapshot

Para atributos provenientes de FM/scouting.

```text
player_id
snapshot_date
source
passing
vision
decisions
stamina
...
```

### player_market_snapshot

```text
player_id
snapshot_date
club
estimated_value
contract_end
```

---

# 11. Métricas

## 11.1 Principios

Toda métrica debe tener:

- nombre;
- definición;
- fórmula;
- grain;
- fuente;
- limitaciones;
- versión.

Crear posteriormente:

```text
docs/metrics/
```

No introducir métricas sin definición.

Conservar procedencia y fecha de consulta, y distinguir dato observado, estimación e hipótesis. Ausencia de registro no equivale a cero minutos ni cero acciones. En porcentajes agregados usar la suma de numeradores y denominadores cuando existan; si sólo hay porcentajes por partido, explicitar la limitación. Los peer groups deben especificar posición, competición, temporada, fecha de corte, mínimo de minutos y tamaño de muestra; mostrar cobertura y evitar percentiles cuando la muestra no permita una comparación útil.

---

## 11.2 Rate stats

Cuando corresponda, calcular métricas por 90 minutos.

Ejemplo:

```text
tackles_per_90 = tackles / minutes * 90
```

Definir un mínimo de minutos para comparaciones.

Ejemplo inicial:

```text
minimum_minutes = 450
```

Debe ser configurable.

---

## 11.3 Percentiles

Comparar jugadores contra peer groups.

Nunca comparar indiscriminadamente un central con un extremo.

Peer groups potenciales:

```text
GK
CB
FB/WB
DM
CM
AM
W
ST
```

Posteriormente se podrán crear roles más específicos.

Ejemplo:

```text
progressive_passes_percentile
ball_recoveries_percentile
duel_win_percentile
```

---

## 11.4 Context adjustment

Algunas métricas deben considerar contexto.

Ejemplo conceptual:

```text
raw_pass_volume
        ↓
team_possession_adjustment
        ↓
context_adjusted_pass_volume
```

No implementar ajustes sofisticados sin validar primero los datos.

---

# 12. Player Representation

El sistema necesita representar cada jugador mediante un vector de features.

Ejemplo para un mediocampista:

```text
passing
progression
creation
defending
ball_winning
press_resistance
carrying
physicality
aerial
availability
age_curve
```

Cada dimensión puede componerse de múltiples métricas.

Ejemplo:

```text
passing = weighted(
    pass_completion,
    passes_attempted,
    forward_passes,
    long_pass_accuracy
)
```

El objetivo no es tener una fórmula perfecta inicialmente.

El objetivo es que sea:

- explícita;
- testeable;
- interpretable;
- versionable.

---

# 13. Similarity Engine

Pregunta:

> ¿Qué jugadores se parecen futbolísticamente a este jugador?

## V1

- seleccionar features;
- normalizar por posición;
- StandardScaler;
- cosine similarity.

```text
Player Feature Matrix
       ↓
Standardization
       ↓
Cosine Similarity
       ↓
Nearest Players
```

## V2

Experimentar con:

- PCA;
- weighted cosine similarity;
- KNN;
- clustering;
- learned embeddings.

### Requisito

La similitud debe ser explicable.

Ejemplo:

```text
Cosine similarity: 0.88 (no es una probabilidad ni un porcentaje de encaje)

Main similarities:
+ ball winning
+ progressive passing
+ stamina

Main differences:
- aerial ability
- chance creation
```

No mostrar únicamente un número opaco.

---

# 14. Replacement Finder

Pregunta distinta a similarity:

> ¿Quién puede reemplazar a X dentro de restricciones reales del club?

Pipeline conceptual:

```text
Target player
    ↓
Similarity candidates
    ↓
Club constraints
    ↓
Age / Cost / League filters
    ↓
Fit Score
    ↓
Opportunity Score
    ↓
Ranked shortlist
```

Un reemplazo no necesita ser el jugador más parecido.

---

# 15. Chacarita Fit Score

Representa qué tan bien encaja un jugador con una necesidad específica del club.

No crear una fórmula universal.

Debe depender de:

```text
club
position
role
season
strategy
```

Ejemplo conceptual:

```text
fit_score =
    0.30 * role_match
  + 0.25 * performance
  + 0.20 * physical_profile
  + 0.15 * age_fit
  + 0.10 * competition_readiness
```

Los pesos iniciales serán hipótesis.

Todo score debe poder mostrar su composición.

---

# 16. Opportunity Score

Busca encontrar jugadores infravalorados o especialmente interesantes.

Ejemplo conceptual:

```text
opportunity_score =
    performance_vs_peers
  + age/upside
  + fit
  + affordability
  + availability
  + contextual_overperformance
```

La oportunidad NO significa “mejor jugador”.

Significa:

> **mejor relación entre lo que ofrece y lo que probablemente cuesta/conlleva incorporarlo.**

---

# 17. League Strength

Comparar jugadores entre categorías requiere contextualizar el nivel competitivo.

Inicialmente evitar inventar factores arbitrarios.

## Posibles enfoques futuros

- movimientos de jugadores entre ligas;
- rendimiento antes/después de transferencias;
- resultados de copas entre divisiones;
- market values;
- ratings de equipos;
- modelos Elo;
- modelos jerárquicos bayesianos.

Este módulo se considera avanzado.

---

# 18. Age Curve / Potential

Objetivo futuro:

Distinguir entre:

- rendimiento actual;
- potencial de desarrollo;
- riesgo de declive.

Inputs posibles:

- edad;
- posición;
- minutos;
- trayectoria histórica;
- mejora season-over-season;
- atributos FM si están disponibles.

No usar edad sola como proxy de potencial.

---

# 19. Frontend Product

La interfaz debe ser una herramienta de exploración, no un dashboard estático.

## 19.1 Home / Scouting Search

```text
Find players

Position:      [ Defensive Midfielder ]
Age:           [ 18 - 25 ]
Market:        [ Argentina / Uruguay / Paraguay ]
Max value:     [ $500k ]
Minutes:       [ > 800 ]

Profile priorities

Ball winning        ████████░░
Progression         █████████░
Passing             ███████░░░
Physical            ██████░░░░
Creation            ████░░░░░░

[ Find players ]
```

Resultado:

```text
1. Player A    Fit 91    Opportunity 94
2. Player B    Fit 89    Opportunity 88
3. Player C    Fit 87    Opportunity 92
```

---

## 19.2 Player Profile

Debe incluir:

### Header

- nombre;
- edad;
- club;
- posición;
- nacionalidad;
- pie;
- altura;
- valor estimado.

### Performance

- métricas raw;
- per 90;
- percentiles.

### Attribute profile

Si existe información FM/scouting.

### Radar

Comparación contra peer group.

### Context

- liga;
- equipo;
- posesión;
- minutos;
- rol.

### Similar Players

Top N jugadores similares.

### Fit

Cómo encajaría en Chacarita o club seleccionado.

---

## 19.3 Player Comparison

Comparar 2–4 jugadores.

Mostrar:

- perfil;
- performance;
- percentiles;
- attributes;
- costo;
- edad;
- similarity;
- fit.

---

## 19.4 Replacement Finder

Seleccionar:

```text
Replace: [ Player X ]
For club: [ Chacarita ]
```

Mostrar candidatos rankeados y explicación.

---

## 19.5 Club Needs

Posteriormente:

```text
Chacarita Juniors

Current Squad

GK  ████████
CB  █████████
RB  █████
LB  ███████
DM  ████
CM  ███████
AM  ████████
ST  █████
```

Identificar posiciones donde podría tener sentido reforzar.

Esto requiere una etapa posterior de squad modeling.

---

# 20. Explainability

Todo ranking importante debe poder responder:

> “¿Por qué aparece este jugador?”

Ejemplo:

```text
Why we like this player

+ 91st percentile ball recoveries
+ 84th percentile progressive passing
+ 22 years old
+ strong FM Work Rate / Stamina
+ performs in a low-possession team
+ estimated market value below comparable players

Concerns

- small sample size
- weaker aerial profile
- limited experience at higher divisions
```

Este principio será especialmente importante si incorporamos AI.

---

# 21. AI Scout — fase futura

Una vez que el modelo de datos y métricas sean confiables, agregar una interfaz de lenguaje natural.

Ejemplo:

> “Buscame un cinco para Chacarita, menor de 24, con buena recuperación pero que no sea un tronco con la pelota.”

El LLM **no debe inventar análisis**.

Debe usar tools.

Ejemplo:

```text
search_players()
get_player_profile()
compare_players()
find_similar_players()
calculate_club_fit()
explain_score()
```

Arquitectura:

```text
User
 ↓
LLM
 ↓
Tool layer
 ↓
Analytics API
 ↓
Canonical Metrics
 ↓
Database
```

La semantic layer debe controlar las métricas utilizadas.

---

# 22. Arquitectura técnica inicial

Prioridad: simplicidad + aprendizaje + capacidad de crecer. Este stack es una propuesta para Phases 1–3, sujeta al resultado del spike. Phase 0 necesita sólo un script Python, configuración de acceso, respuestas raw locales y un informe; no requiere levantar toda esta arquitectura.

```text
             External Sources
                    │
                    ▼
             Python Ingestion
                    │
                    ▼
               PostgreSQL
                    │
                    ▼
                 dbt
                    │
         ┌──────────┴───────────┐
         ▼                      ▼
    Analytics marts        Feature tables
         │                      │
         └──────────┬───────────┘
                    ▼
                 FastAPI
                    │
                    ▼
               Next.js App
```

## Stack propuesto

### Backend / Data

- Python 3.12+
- PostgreSQL
- SQLAlchemy
- Alembic
- dbt Core
- Pandas o Polars
- scikit-learn
- FastAPI
- Pydantic

### Frontend

- Next.js
- TypeScript
- React
- Tailwind CSS
- chart library a elegir

### Dev environment

- Docker
- Docker Compose
- `.env`
- Makefile o task runner

### Testing

- pytest
- dbt tests
- API integration tests
- frontend tests cuando aporten valor

### CI

- GitHub Actions

### Posteriormente

Evaluar:

- Dagster / Prefect;
- BigQuery;
- object storage;
- Redis;
- vector database;
- cloud deployment.

No incorporar hasta que exista necesidad.

---

# 23. Por qué PostgreSQL inicialmente

Aunque BigQuery sea excelente y conocido, PostgreSQL permite practicar:

- backend application development;
- transactions;
- indexes;
- relational design;
- SQLAlchemy;
- migrations;
- local development;
- APIs con baja latencia.

BigQuery podría incorporarse posteriormente como warehouse analítico si el volumen lo justifica.

---

# 24. Repository Structure

Propuesta inicial:

```text
football-analytics-lab/
│
├── README.md
├── FOOTBALL_ANALYTICS_LAB_PROJECT_PLAN.md
├── AGENTS.md
├── .env.example
├── docker-compose.yml
├── Makefile
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── main.py
│   ├── tests/
│   └── pyproject.toml
│
├── ingestion/
│   ├── common/
│   ├── api_football/
│   ├── sportmonks/
│   ├── football_manager/
│   └── market_data/
│
├── dbt/
│   ├── models/
│   │   ├── staging/
│   │   ├── intermediate/
│   │   ├── marts/
│   │   └── features/
│   ├── tests/
│   └── dbt_project.yml
│
├── analytics/
│   ├── similarity/
│   ├── scoring/
│   ├── normalization/
│   └── experiments/
│
├── frontend/
│   └── ...
│
├── docs/
│   ├── architecture/
│   ├── decisions/
│   ├── metrics/
│   ├── data_sources/
│   └── research/
│
├── notebooks/
│   └── experiments_only/
│
└── scripts/
```

---

# 25. Regla para notebooks

Los notebooks sirven para explorar.

No deben convertirse en producción.

Flujo:

```text
Notebook experiment
       ↓
Valid result
       ↓
Python module / dbt model
       ↓
Tests
```

---

# 26. API conceptual

Endpoints futuros posibles.

```text
GET /players
GET /players/{player_id}
GET /players/{player_id}/stats
GET /players/{player_id}/similar

GET /clubs
GET /clubs/{club_id}
GET /clubs/{club_id}/needs

POST /scouting/search
POST /scouting/replacements
POST /scouting/compare
```

Ejemplo:

```json
POST /scouting/search
{
  "club_id": "chacarita",
  "position": "DM",
  "age_max": 25,
  "max_value_usd": 500000,
  "profile": {
    "ball_winning": 0.9,
    "progression": 0.8,
    "passing": 0.7
  }
}
```

---

# 27. Observability / Data Quality

Desde etapas tempranas incorporar checks sencillos.

Ejemplos:

- player_id not null;
- unique external IDs por source;
- minutes >= 0;
- minutes <= match length esperado;
- percentages entre 0 y 100;
- players matched correctamente;
- no duplicación de player-match grain;
- season consistency.

Crear reporte de ingestión:

```text
Source run: api_football
Fixtures fetched: 20
Player rows: 812
New players: 14
Matched players: 798
Unmatched: 6
Warnings: 2
```

---

# 28. Versionado de modelos y scores

Los scores deben tener versión.

Ejemplo:

```text
similarity_model_version = v1
fit_model_version = chaca_dm_v1
opportunity_model_version = v1
```

Esto permite comparar resultados sin perder reproducibilidad.

---

# 29. Roadmap

## Phase 0 — Feasibility / Data Spike

### Objetivo

Demostrar que una fuente gratuita permite comparar jugadores en una competición/temporada definida.

### Tareas

- [ ] Resolver límite del repositorio Git (actualmente detectado en la carpeta padre).
- [ ] Crear entorno Python mínimo.
- [ ] Revisar licencia y atribución de la fuente gratuita candidata.
- [x] Primer chequeo de muestras públicas de StatsBomb, Wyscout, SkillCorner y Football-Data.co.uk.
- [ ] Completar comparación de cobertura, métricas y condiciones antes de elegir fuente.
- [ ] Inspeccionar catálogo y seleccionar competición/temporada por cobertura.
- [ ] Descargar partidos, alineaciones y eventos de una muestra de 3–5 partidos de distintos equipos.
- [ ] Guardar respuestas raw locales con procedencia y versión de la fuente.
- [ ] Verificar cómo reconstruir minutos y posiciones.
- [ ] Documentar métricas posibles, faltantes y cobertura de la edición.
- [ ] Resolver D1 para esa edición: comparación viable, alcance reducido o cambio de fuente gratuita.

### Deliverable

```text
docs/research/data_source_spike.md
```

Debe responder:

> ¿Tenemos suficientes datos para construir la V1?

### Exit criteria

Completar el informe de 3–5 partidos de la competición gratuita elegida y resolver D1 con evidencia de campos, completitud y condiciones de uso. El acceso a un único partido es un paso intermedio.

---

## Phase 1 — Data Foundation

### Objetivo

Construir la base de datos canónica.

### Tareas

- [ ] Docker Compose con PostgreSQL.
- [ ] raw schema.
- [ ] source adapter inicial.
- [ ] ingest teams.
- [ ] ingest players.
- [ ] ingest fixtures.
- [ ] ingest player match stats.
- [ ] dbt staging.
- [ ] dim_player.
- [ ] dim_team.
- [ ] dim_competition.
- [ ] fact_player_match.
- [ ] tests.
- [ ] logging.

### Exit criteria

Poder ejecutar:

```sql
SELECT *
FROM fact_player_match
WHERE player_id = ...
ORDER BY match_date;
```

y obtener la historia de partidos de un jugador.

---

## Phase 2 — Player Analytics

### Objetivo

Transformar eventos/stat lines en perfiles comparables.

### Tareas

- [ ] season aggregation;
- [ ] per-90 metrics;
- [ ] minimum minutes rules;
- [ ] position groups;
- [ ] percentiles;
- [ ] normalization;
- [ ] player profile mart;
- [ ] data quality tests.

### Deliverable

Tabla:

```text
mart_player_profile
```

### Exit criteria

Poder comparar estadísticamente a dos mediocampistas de la competición/temporada gratuita elegida.

---

## Phase 3 — Basic Web App

### Objetivo

Hacer visible y explorable el sistema.

### Features

- [ ] player search;
- [ ] player profile;
- [ ] basic filters;
- [ ] percentile bars;
- [ ] radar profile;
- [ ] comparison page.

### Exit criteria

Buscar un jugador y entender su perfil sin consultar SQL.

---

## Phase 4 — Football Manager Integration (opcional)

### Objetivo

Agregar atributos de scouting.

### Tareas

- [ ] definir formato importable;
- [ ] parser CSV/HTML;
- [ ] entity matching;
- [ ] confidence score;
- [ ] manual review workflow;
- [ ] attribute snapshots;
- [ ] UI attribute profile.

### Exit criteria

Un jugador puede combinar:

```text
real match performance
+
FM/scouting attributes
```

sin depender de IDs compartidos.

---

## Phase 5 — Similarity Engine

### Objetivo

Encontrar perfiles futbolísticamente similares.

### Tareas

- [ ] feature selection;
- [ ] scaling;
- [ ] cosine similarity;
- [ ] top-N results;
- [ ] explanation;
- [ ] similarity tests;
- [ ] UI.

### Exit criteria

Elegir un jugador y obtener candidatos razonables que puedan ser inspeccionados manualmente.

---

## Phase 6 — Chacarita Recruitment Model

### Objetivo

Convertir analytics en recruiting.

### Tareas

- [ ] club profile;
- [ ] position priorities;
- [ ] role profiles;
- [ ] fit score;
- [ ] age constraints;
- [ ] affordability constraints;
- [ ] opportunity score;
- [ ] shortlist generation;
- [ ] explanation layer.

### Exit criteria

Responder:

> “¿Qué 10 volantes centrales deberíamos investigar para Chacarita?”

con razones claras.

---

## Phase 7 — Replacement Finder

### Objetivo

Buscar alternativas ante una salida concreta.

- [ ] select target player;
- [ ] similarity shortlist;
- [ ] constraints;
- [ ] ranking;
- [ ] comparison;
- [ ] explain differences.

---

## Phase 8 — Advanced Context Modeling

Explorar:

- league strength;
- possession-adjusted metrics;
- team-style adjustment;
- age curves;
- historical progression;
- cross-league translation;
- uncertainty intervals.

Nada de esto es requisito para el MVP.

---

## Phase 9 — AI Scout

Agregar natural-language interface únicamente cuando los datos y scores sean confiables.

El AI Scout debe consultar funciones y métricas existentes; no reemplazarlas.

---

# 30. Primer milestone tangible

El primer milestone no es tener una UI linda.

Es producir una tabla como:

| Player | Team | Age | Min | Tackles/90 | Duels Won % | Pass % | Key Passes/90 | Profile |
|---|---|---:|---:|---:|---:|---:|---:|---|
| A | X | 22 | 1,820 | 3.2 | 61% | 82% | 1.1 | Ball winner |
| B | Y | 24 | 2,010 | 2.4 | 58% | 87% | 1.7 | Distributor |

para jugadores reales de la competición/temporada gratuita elegida; incluir únicamente columnas verificadas.

Si podemos hacer esto con datos reproducibles, tenemos una base real.

---

# 31. Primera pregunta de investigación

Antes de implementar modelos:

> **¿Qué eventos, alineaciones y cobertura tiene la competición gratuita elegida y qué métricas podemos derivar de forma fiable?**

Crear un script mínimo:

```text
scripts/spike_open_data.py
```

Debe:

1. consultar competición;
2. seleccionar una competición/temporada y equipos de la muestra;
3. traer un fixture para verificar acceso y ampliar a la muestra definida en Phase 0;
4. traer alineaciones y eventos e inspeccionar estadísticas derivables;
5. guardar JSON raw;
6. imprimir los campos disponibles.

No intentar crear arquitectura completa todavía.

---

# 32. Coding Principles

## 32.1 Simple first

Preferir:

```python
calculate_per_90()
```

antes que construir un framework genérico de métricas.

## 32.2 Explicit over magical

Las transformaciones importantes deben ser legibles.

## 32.3 Reproducibility

Todo análisis relevante debe poder reproducirse desde raw data.

## 32.4 Tests for business logic

Los siguientes módulos deben tener tests especialmente fuertes:

- entity resolution;
- metric calculation;
- percentiles;
- similarity;
- fit score;
- opportunity score.

## 32.5 No silent fallbacks

Si una fuente no tiene un dato, usar `NULL` / unavailable.

Nunca inventar `0` salvo que conceptualmente signifique cero.

---

# 33. Codex Working Agreement

Este proyecto se desarrollará activamente con Codex.

## Antes de programar

Codex debe:

1. leer `FOOTBALL_ANALYTICS_LAB_PROJECT_PLAN.md`;
2. leer `AGENTS.md` si existe;
3. inspeccionar el código actual;
4. identificar la menor modificación necesaria;
5. mencionar supuestos relevantes.

## Durante implementación

Codex debe:

- evitar refactors gigantes no solicitados;
- mantener funciones pequeñas;
- agregar type hints;
- agregar tests;
- actualizar documentación cuando cambia comportamiento;
- usar variables de entorno para secrets;
- no hardcodear API keys;
- no hacer scraping no documentado sin una decisión explícita;
- no introducir una dependencia grande sin justificarla.

## Al terminar una tarea

Debe indicar:

```text
Implemented
Tests
Known limitations
Next logical step
```

## Arquitectural decisions

Si una decisión afecta varias partes del sistema, crear ADR.

Ejemplo:

```text
docs/decisions/0001-use-postgres.md
```

Formato:

```text
Context
Decision
Alternatives
Consequences
```

---

# 34. Git Workflow

Inicialmente:

```text
main
  └── feature/<short-name>
```

Commits pequeños y descriptivos.

Ejemplos:

```text
feat: add api-football fixture ingestion
feat: create canonical player dimension
fix: prevent duplicate player match rows
test: cover fuzzy player matching
```

Evitar commits tipo:

```text
changes
stuff
fix
```

---

# 35. README vs plan de proyecto

`README.md` debe ser atractivo para una persona que descubre el repo.

Debe explicar:

- qué es;
- qué problema resuelve;
- screenshots;
- arquitectura;
- cómo ejecutarlo.

`FOOTBALL_ANALYTICS_LAB_PROJECT_PLAN.md` es el documento interno de dirección.

Debe mantener mayor nivel de detalle y roadmap.

---

# 36. Portfolio Goal

El proyecto debe demostrar experiencia en:

### Data Engineering

- ingestion;
- APIs;
- entity resolution;
- data modeling;
- orchestration;
- data quality.

### Analytics Engineering

- dbt;
- semantic definitions;
- metrics;
- marts;
- testing.

### Data Science

- normalization;
- similarity models;
- ranking;
- clustering;
- model evaluation.

### Software Engineering

- APIs;
- backend;
- frontend;
- Docker;
- testing;
- CI/CD.

### Product Thinking

- concrete user problem;
- iterative scope;
- explainability;
- UX;
- business constraints.

### AI Engineering

Posteriormente:

- agents;
- tools;
- semantic layer;
- grounded explanations.

El objetivo profesional no es mostrar “muchas tecnologías”.

Es mostrar:

> **capacidad para diseñar y construir un data product end-to-end.**

---

# 37. Success Criteria

## V1 success

El proyecto es exitoso si podemos:

1. obtener datos reales gratuitos de la competición/temporada elegida;
2. normalizarlos;
3. comparar jugadores de una misma posición;
4. explorar jugadores en una interfaz.

## V2 success

Podemos seleccionar un jugador y encontrar perfiles similares razonables.

## V3 success

Podemos generar una shortlist para Chacarita con restricciones y explicación.

## V4 success

Personas con conocimiento de fútbol encuentran resultados no triviales y razonables.

---

# 38. Cómo evaluar si el modelo sirve

No alcanza con una métrica matemática.

Usar tres tipos de evaluación.

## Quantitative

- ranking stability;
- similarity distance;
- historical player moves;
- predictive backtests cuando corresponda.

## Qualitative

Inspección manual:

> “¿Estos jugadores realmente parecen cumplir roles parecidos?”

## Domain validation

Idealmente mostrar shortlists a personas que conozcan las categorías analizadas.

El feedback humano es una fuente de información, no una derrota del modelo.

---

# 39. Riesgos principales

## R1 — Falta de granularidad de datos

Mitigación:

- spike temprano;
- adapters intercambiables;
- limitar inicialmente métricas.

## R2 — Data licensing

Mitigación:

- no redistribuir datasets propietarios;
- imports locales;
- documentar fuentes;
- revisar términos antes de scraping.

## R3 — Entity resolution incorrecto

Mitigación:

- confidence score;
- revisión manual;
- DOB + club + nationality.

## R4 — Scores arbitrarios

Mitigación:

- composición visible;
- versionado;
- evaluación manual;
- iteración.

## R5 — Overengineering

Mitigación:

- una sola aplicación;
- PostgreSQL;
- Docker Compose;
- fases claras;
- no microservices.

## R6 — Scope creep

Mitigación:

Volver a la pregunta:

> **¿Esto ayuda a encontrar, comparar o explicar posibles incorporaciones?**

Si no, probablemente no corresponde ahora.

---

# 40. Open Questions

Mantener esta sección viva.

## Data

- [ ] ¿Qué stats exactos tiene API-Football para Primera Nacional?
- [ ] ¿Sportmonks tiene mayor granularidad?
- [ ] ¿Hay event data utilizable para Argentina?
- [ ] ¿Qué mercados regionales tienen cobertura comparable?
- [ ] ¿Qué fuente económica es viable?
- [ ] ¿Cómo importaremos atributos FM de forma segura?

## Analytics

- [ ] ¿Qué peer groups usamos?
- [ ] ¿Cuál es el mínimo de minutos?
- [ ] ¿Cómo tratamos jugadores multi-position?
- [ ] ¿Cómo ajustar por team possession?
- [ ] ¿Cómo modelar league strength?

## Product

- [ ] ¿Cómo definimos necesidades reales de Chacarita?
- [ ] ¿Qué restricciones económicas usar?
- [ ] ¿Qué perfiles posicionales construir primero?

## Technical

- [ ] Pandas vs Polars.
- [ ] Chart library.
- [ ] Deployment target.
- [ ] Orchestrator futuro.

---

# 41. Backlog de ideas futuras

No implementar todavía.

- transfer recommendation simulator;
- squad age profile;
- succession planning;
- undervalued XI;
- free agents finder;
- contract expiry opportunities;
- loan candidates;
- promotion-ready players;
- club-to-club player fit;
- style similarity between teams;
- historical career trajectory;
- injury availability model;
- expected transfer success;
- AI scouting reports;
- automated weekly scouting digest;
- watchlists;
- player alerts;
- “players before they became expensive” retrospective;
- lineup optimization;
- network graph of transfers;
- visualization of scouting markets.

---

# 42. El objetivo final

La versión madura del producto debería permitir escribir:

> **“Necesito un volante central para Chacarita, menor de 24 años, agresivo para recuperar, pero capaz de progresar la pelota. No quiero alguien que ya tenga precio de Primera. Buscá oportunidades en Argentina y Uruguay.”**

Y devolver algo como:

```text
SCOUTING SHORTLIST

1. Player A — 22 — Club X
   Fit Score:         91
   Opportunity Score: 94

   Why:
   + elite ball recovery for peer group
   + above-average progressive passing
   + strong stamina/work-rate profile
   + young for current production
   + affordable relative to comparables

   Risks:
   - limited experience at higher level
   - aerial profile below target

2. Player B — 23 — Club Y
   Fit Score:         89
   Opportunity Score: 90

   ...
```

Y que podamos defender cada recomendación mostrando **los datos, las métricas, las transformaciones y las hipótesis que la produjeron**.

Ese es el norte.

---

# 43. NEXT ACTION

## Dirección vigente

Auditar la temporada de Arsenal 2003/04 y conseguir métricas modernas comparables para el plantel Arsenal 2026/27. La pregunta es similitud por función y brechas del plantel frente a los Invincibles, con shortlist externa sustentada por datos. Seguir [el alcance vigente](docs/research/arsenal_invincibles_scope.md). No retomar Hull City ni la simulación de torneos históricos salvo una nueva instrucción del usuario.

No empezar por machine learning.

No empezar por React.

Investigar atributos públicos de Football Manager junto al spike de rendimiento; no bloquear el proyecto por no tener el juego.

## Primer objetivo práctico

> **Demostrar que podemos obtener datos gratuitos, reconstruir participación y comparar jugadores de la competición elegida.**

Primer mini-proyecto:

```text
Data Source Spike
```

Salida esperada:

```text
1 partido para verificar acceso
    ↓
3–5 partidos de distintos equipos de la competición elegida
    ↓
JSON raw local + metadatos de consulta
    ↓
campos, definiciones y completitud
    ↓
informe de viabilidad y resolución de D1
```

Después de eso tomamos la primera decisión real de arquitectura basada en evidencia.

---

## Project mantra

> **Data first. Explainable models. Realistic recruitment. Build only what helps make a better football decision.**


## Profundización de SkillCorner (2026-10-07)

Se completó el [análisis de SkillCorner](docs/research/skillcorner_deep_dive.md) con cobertura, unión de tablas, faltantes, normalización y propuesta de MVP. La selección de fuente sigue pendiente.

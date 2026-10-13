# Hull City: auditoría de accesos simples

Fecha: 2026-10-13. Club elegido: Hull City. Temporada: Premier League 2026/27, en curso. El [ascenso está confirmado por la Premier League](https://www.premierleague.com/en/news/4664386/all-you-need-to-know-as-hull-city-are-promoted-to-premier-league).

## Resultado

**Sí hay acceso gratuito y sin credenciales para una comparación básica de jugadores. No hay evidencia de cobertura de toda la información del plan de scouting.** FPL es una candidata nueva para la fuente principal de V1; Football-Data.co.uk aporta contexto de equipos. Ninguna suscripción fue contratada.

Se descargaron cuatro respuestas reales; metadatos, campos y hashes quedan en [hull_city_access_check.json](hull_city_access_check.json). Los originales están en `data/source_checks/hull_city/`, dentro del cache ignorado. Las URLs son mutables: los recuentos describen esta consulta.

## Acceso observado y cobertura

| Fuente | Comprobación | Sirve para Hull actual |
|---|---|---|
| [FPL bootstrap](https://fantasy.premierleague.com/api/bootstrap-static/) | HTTP exitoso sin clave; 20 equipos, 667 registros de jugadores; Hull ID 11, 43 registros y 25 con minutos | Identidad, categoría FPL, minutos, titularidades, goles, asistencias, xG, xA, recuperaciones, tackles y despejes/bloqueos/intercepciones combinados |
| [FPL historial de un jugador](https://fantasy.premierleague.com/api/element-summary/572/) | 6 filas de historial de Tzolakis; 540 minutos, coincide con su agregado | Una muestra confirma desglose por partido; falta ampliar a otros jugadores y equipos |
| [Football-Data.co.uk 2026/27](https://www.football-data.co.uk/mmz4281/2627/E0.csv) | CSV descargado: 60 partidos, 6 de Hull; fechas entre 21/08 y 12/10 | Resultados, tiros, faltas, córners, tarjetas y campos de xG por equipo; no estadísticas individuales |
| [StatsBomb catálogo actual](https://github.com/hudl/open-data/blob/master/data/competitions.json) | Premier League sólo 2003/04 y 2015/16 | No cubre 2026/27 |
| [SkillCorner Open Data](https://github.com/SkillCorner/opendata) | README actual y muestras previas: A-League australiana 2024/25 | No cubre Hull 2026/27 |
| [Wyscout académico](https://www.nature.com/articles/s41597-019-0247-7) | Dataset histórico, cinco ligas 2017/18 y torneos internacionales | No cubre Hull 2026/27 |
| [API-Football Free](https://www.api-football.com/pricing) | 100 consultas/día anunciadas, temporadas limitadas; no hay key local configurada | Pendiente: no se probó acceso autenticado ni disponibilidad de 2026 |
| [football-data.org Free](https://www.football-data.org/pricing) | Plan gratuito de resultados/calendario/tablas; planteles y alineaciones anunciados en paquete pago | Contexto potencial; no resuelve métricas individuales gratuitas |

## Qué información falta o necesita cuidado

- **Plantel y posición:** los 43 registros son entradas de FPL, no una certificación del plantel inscripto. Validar contra listado oficial. FPL agrupa arqueros, defensores, mediocampistas y delanteros; no distingue confiablemente pivote, interior o extremo.
- **Edad:** `birth_date` está presente salvo en una entrada de Hull; calcular edad a fecha de corte y mostrar faltantes.
- **Defensa:** hay valores en recuperaciones y tackles. Despejes, bloqueos e intercepciones vienen combinados; no inventar el desglose ni equiparar automáticamente sus definiciones con otro proveedor.
- **Progresión y táctica:** no se observaron volumen/precisión de pases, pases progresivos, pases rompe líneas, presiones, conducciones, coordenadas o tracking en los endpoints inspeccionados. No permiten el perfil completo de volante recuperador y progresor del plan anterior.
- **Economía:** `now_cost` es precio fantasy, no valor de mercado, salario ni costo de fichaje. No usarlo para decidir accesibilidad económica. Los endpoints comprobados no aportan contratos ni disponibilidad de transferencia.
- **Lesiones:** noticias y estados FPL no constituyen un historial médico ni una verificación completa de disponibilidad.
- **Cobertura temporal:** temporada en curso, con sólo seis partidos de Hull en el CSV descargado. No mezclar su Championship 2025/26 con Premier 2026/27 ni interpretar una muestra corta como rendimiento estable.
- **Estabilidad y publicación:** el endpoint funciona, pero no se verificó un contrato de API pública estable ni las condiciones de redistribución. Revisarlas antes de publicar la demo.

## Primera entrega viable propuesta

Comparación de jugadores de Hull con la misma categoría FPL de la Premier 2026/27, mostrando minutos, titularidades, producción ofensiva y métricas defensivas disponibles. Mantener categorías amplias hasta validar roles. Mostrar fuente, fecha de consulta, faltantes y tamaño de muestra; aplicar mínimo de minutos configurable, sin imponer todavía un umbral aprobado.

Antes de elegir definitivamente FPL, ampliar el chequeo a 3–5 partidos de distintos equipos y a jugadores de varias categorías; contrastar minutos e identidad con fuentes oficiales y cuantificar filas/campos faltantes de toda la liga. Validar las definiciones de las métricas que se mostrarán. FPL puede sostener ese MVP, pero no alcanza para afirmar encaje táctico completo o viabilidad de contratación.

La prueba autenticada de API-Football requiere una clave de cuenta directa en `.env` como `API_FOOTBALL_KEY`, nunca en el chat. Primero comprobar temporada 2026 y cobertura de jugadores; luego consultar Hull, plantel y una pequeña muestra de partidos. El script existente aún está orientado a Argentina: adaptar sus parámetros antes de esa prueba. Una temporada no habilitada en el plan gratuito debe registrarse como limitación de acceso, no como ausencia de datos del proveedor.

# Equipos históricos y enfrentamientos hipotéticos

Investigación: 2026-10-13. Propuesta exploratoria del usuario; todavía no reemplaza la selección de Hull City en el plan.

## Cobertura comprobada

Se descargaron los listados oficiales de partidos de StatsBomb y se contaron las apariciones por equipo. La presencia de una competición en el catálogo no implica cobertura completa.

| Equipo y temporada | Competición inspeccionada | Partidos listados del equipo | Evaluación |
|---|---|---:|---|
| Arsenal 2003/04 | Premier League | 38 | Temporada de liga completa; un archivo de eventos inspeccionado previamente |
| Barcelona 2010/11 | La Liga | 33 | Muestra amplia, faltan cinco partidos de liga |
| Barcelona 2014/15 | La Liga | 38 | Temporada de liga completa en el listado |
| Real Madrid 2016/17 | Champions League | 1 | Sólo la final; insuficiente para caracterizar la temporada |
| Liverpool 2018/19 | Champions League | 1 | Sólo la final; insuficiente para caracterizar la temporada |
| Bayern Munich 2012/13 | Champions League | 1 | Sólo la final; insuficiente para caracterizar la temporada |
| Bayern Munich 2015/16 | Bundesliga | 2 | El archivo tiene 34 partidos de Leverkusen, no de Bayern |

Fuentes oficiales descargadas: [Arsenal](https://github.com/hudl/open-data/blob/master/data/matches/2/44.json), [Barcelona 2010/11](https://github.com/hudl/open-data/blob/master/data/matches/11/22.json), [Barcelona 2014/15](https://github.com/hudl/open-data/blob/master/data/matches/11/26.json), [Madrid](https://github.com/hudl/open-data/blob/master/data/matches/16/2.json), [Liverpool](https://github.com/hudl/open-data/blob/master/data/matches/16/4.json), [Bayern 2012/13](https://github.com/hudl/open-data/blob/master/data/matches/16/24.json), [Bundesliga 2015/16](https://github.com/hudl/open-data/blob/master/data/matches/9/27.json).

Estos recuentos validan listados, no la disponibilidad, consistencia o calidad de todos los archivos de eventos.

## Producto posible

Comparar equipos definidos por club y temporada, con perfiles de ataque, defensa, circulación y progresión derivados de métricas compatibles. Luego simular partidos a 90 minutos en cancha neutral y un torneo, mostrando probabilidades de victoria/empate/derrota, distribución de marcadores y probabilidad de campeón. La extensión a eliminatorias requiere definir prórroga y penales.

La simulación es condicional al modelo: no demuestra quién habría ganado entre épocas. Debe explicitar cómo ajusta rival, liga, época, localía y muestra. No convertir directamente xG por partido en probabilidades sin calibrar tasas de gol contra resultados reales. Validar con partidos reservados y comparar con un modelo sencillo antes de añadir efectos tácticos. Separar descripción del estilo de predicción: más pases o presiones no prueban ventaja en un enfrentamiento.

Primera comparación viable por cobertura: Arsenal 2003/04 y Barcelona 2014/15. Barcelona 2010/11 puede agregarse mostrando sus cinco faltantes y evaluando el sesgo. Para Madrid, Liverpool y Bayern hay que buscar temporadas con cobertura más amplia o complementar con resultados históricos de toda la liga; no comparar una temporada completa con una sola final como si fueran muestras equivalentes. Una ruta basada en resultados permite más equipos; la ruta basada en eventos permite explicar más el estilo, pero limita el universo.

Próximo paso: auditar eventos de 3–5 partidos por candidato, elegir métricas compartidas y buscar resultados del universo completo para ajustar la fuerza de los rivales. No generar todavía un ranking ni probabilidades numéricas sin un modelo validado.

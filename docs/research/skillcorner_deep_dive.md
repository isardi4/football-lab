# SkillCorner: viabilidad de un MVP con datos gratuitos

Revisión: 2026-10-07. **Resultado: candidata sólida para una V1 de perfiles físicos y juego con/sin pelota.** La selección definitiva y la publicación de una demo siguen pendientes. Se analizaron tres CSV ya descargados; no se necesita cuenta para estos archivos.

## Alcance real de los datos

Los agregados observados pertenecen a `AUS - A-League`, temporada `2024/2025`, competición `61`, temporada `95`; Passing y OBR incluyen edición `870`. Aparecen **13 equipos** y **290 jugadores únicos en la unión**. Tener los 13 equipos no certifica que todas sus actuaciones estén incluidas: no contamos con el calendario completo asociado a estos agregados.

| Bloque | Filas jugador/equipo/posición | Jugadores únicos | Filas con ≥5 actuaciones según el contador del bloque |
|---|---:|---:|---:|
| Physical | 406 | 268 | 210 |
| Passing | 407 | 284 | 192 |
| Off-ball runs (OBR) | 407 | 284 | 192 |

El README oficial distingue agregados de temporada y muestras de tracking/eventos dinámicos de diez partidos. Esos diez partidos no permiten reconstruir todos los agregados de la temporada. No hace falta descargar tracking para explorar los CSV. [Fuente oficial](https://github.com/SkillCorner/opendata).

## Cómo unir las tablas

Clave comprobada, sin duplicados ni componentes vacíos:

```text
competition_id + season_id + player_id + team_id + position_group
```

Passing y OBR tienen exactamente las mismas 407 claves. Physical comparte 385; agrega 21 claves propias y carece de 22 que están en Passing/OBR. La unión externa conserva **428 perfiles**, con indicadores de presencia por bloque. No hay conflictos observados entre tablas en nombre, nacimiento, equipo o edición para claves compartidas.

Las 22 claves sin Physical corresponden a porteros. Esto no explica por sí solo las 21 exclusivas de Physical: investigar cobertura, QC y clasificación antes de atribuirles una causa. Una misma persona puede aportar varios perfiles por rol o equipo; no contar filas como jugadores únicos.

La exportación local `data/source_checks/skillcorner-joined.csv` mantiene columnas separadas por bloque y deja ausencias vacías. No promedia roles ni inventa valores faltantes.

## El punto más importante: minutos y muestras

En los agregados hay **minutos promedio por actuación incluida**, no minutos acumulados de la temporada. Por ejemplo, Adam Taggart tiene `minutes_full_all=96.78`, `count_match=24` en Physical, y `minutes=97.47`, `performance_included_count=13` en Passing. Son dos conjuntos de actuaciones distintos.

Para los contadores físicos, el tutorial oficial usa:

```text
HI por 90 = hi_count_full_all × 90 / minutes_full_all
```

Es el cociente de promedios correspondientes al mismo bloque; no sumar sus filas ni aplicar esa fórmula a velocidad, porcentajes o tiempos de aceleración. Los minutos mayores que 90 pueden incluir tiempo añadido; no recortarlos automáticamente.

Passing/OBR tienen totales y tasas ya calculadas. `p30tip` parece representar por 30 minutos de posesión del equipo: el nombre y su relación numérica con totales, promedio de minutos TIP y actuaciones incluidas sustentan esa interpretación. **Falta confirmar la definición exacta en el glosario específico**, especialmente tratamiento de QC y denominadores. Conservar el nombre original y no volver a normalizarlo por 90.

El README indica selección de actuaciones de más de 60 minutos; el tutorial utiliza 60+. Hay que confirmar el criterio de borde antes de reconstruir filtros. El tutorial propone mínimo cinco partidos como regla exploratoria; eso no garantiza estabilidad estadística. [Normalización oficial](https://github.com/SkillCorner/opendata/blob/master/notebooks/tutorials/01_Getting_Started_with_SkillCorner_Data/DATA_NORMALIZATION_BASICS.md).

## Qué podemos medir

| Dimensión | Campos presentes | Pregunta útil | Precaución |
|---|---|---|---|
| Intensidad física | `hi_count_full_all`, `hi_distance_full_all`, minutos | ¿Qué carga de actividad de alta intensidad registra? | Volumen condicionado por rol, estilo y minutos |
| Sprints | `sprint_count_full_all`, `sprint_distance_full_all` | ¿Cuánta actividad de sprint produce? | No representa por sí sola calidad futbolística |
| Velocidad | `psv99`, `psv99_top5` | ¿Qué perfil de velocidad registra? | PSV99 es un proxy del máximo; no es la velocidad máxima instantánea |
| Circulación | `pass_pct_completed`, `pass_count_attempted_p30tip` | ¿Qué volumen y precisión de pase muestra? | Alta precisión puede acompañar pases conservadores |
| Romper líneas | `pass_count_linebreak_completed_p30tip` | ¿Con qué frecuencia completa pases que rompen líneas? | Confirmar definición geométrica y normalización |
| Juego sin pelota | `offballrun_count_p30tip`, tipos de carrera | ¿Cómo ofrece apoyos y rupturas? | Más carreras no implica automáticamente mejor decisión |
| Uso de desmarques | `*_targeted_p30tip`, `*_received_p30tip` | ¿Cuánto buscan y encuentran sus movimientos? | Depende también de compañeros y oportunidades |

Según el glosario físico, TIP corresponde a posesión del equipo y OTIP a posesión rival; PSV99 es el percentil 99 de velocidad de sprint. Para hombres, HSR cubre 20–25 km/h y sprint supera 25 km/h. Son definiciones del proveedor, no umbrales que elegimos nosotros. El QC puede excluir actuaciones cuya calidad no alcance el estándar. [Glosario físico oficial](https://skillcorner.crunch.help/en/glossaries/physical-data-glossary).

Los tres CSV inspeccionados no aportan contratos, salarios, valor de mercado, lesiones, pie preferido ni una evaluación defensiva completa. No respaldan una recomendación económicamente realista para Chacarita ni un score de recuperación. Los grupos posicionales son amplios: `Midfield` no equivale necesariamente a volante central.

## Faltantes que afectan la primera entrega

- Physical: `timetosprint_top3` falta en **217/406** filas y `timetohsr_top3` en **147/406**. El glosario explica requisitos de cantidad de actuaciones para ciertas métricas Top 3; no atribuir todos los faltantes a errores de captura. Excluirlas de la primera comparación y mantenerlas como información opcional.
- Passing: `pass_pct_dangerous_completed` falta en **42/407** filas. Puede haber denominadores sin oportunidades; no convertir NULL a cero.
- OBR: distancias promedio de overlap y underlap faltan en **183/407** y **177/407** filas, respectivamente. Si no hubo ese tipo de carrera, el promedio no existe; verificar el contador asociado.
- Dos filas de Passing/OBR no tienen minutos; una fecha de nacimiento falta en Physical. Conservar filtros y gráficos que admitan datos desconocidos.

El perfil JSON registra faltantes y rangos para cada columna, no sólo un porcentaje global. Los CSV se inspeccionaron como snapshots locales con hashes; no se promete actualización continua.

## ¿Tenemos suficiente muestra para comparar?

Aplicando una hipótesis de **≥5 actuaciones en cada bloque**, con presencia de los tres, quedan **173 perfiles**:

| Grupo | Perfiles |
|---|---:|
| Midfield | 41 |
| Central Defender | 38 |
| Full Back | 37 |
| Wide Attacker | 31 |
| Center Forward | 26 |

Son perfiles, no necesariamente personas distintas. Si una persona tiene más de un rol/equipo, cada registro conserva su contexto. Para percentiles futuros, definir si el universo pondera perfiles o jugadores y mostrar su tamaño. No asumir que estos 173 perfiles representan a todos los futbolistas de la competición.

## Ejemplo concreto: dos perfiles del dataset

Selección ilustrativa, sin ranking ni declaración de quién es mejor:

| Campo | Alessandro Lopane — Melbourne City | Alex Rufer — Wellington Phoenix |
|---|---:|---:|
| Grupo | Midfield | Midfield |
| Actuaciones Physical | 7 | 17 |
| Actuaciones incluidas Passing | 6 | 13 |
| Actividades HI por 90, derivadas | 67,43 | 37,32 |
| Pase completado, % del proveedor | 87,17 | 86,03 |
| Pases rompe líneas completados, `p30tip` | 2,27 | 7,24 |
| Carreras sin pelota, `p30tip` | 42,03 | 13,90 |

Este contraste muestra que el dataset puede diferenciar actividad física, pase y movimiento, con muestras visibles. No demuestra que cumplan el mismo rol táctico ni predice rendimiento en Argentina. Las columnas `p30tip` siguen pendientes de validación semántica completa.

## MVP que propongo con esta fuente

Un **explorador de perfiles de A-League 2024/25**, inicialmente Midfield:

1. Búsqueda por nombre y filtros por equipo, grupo posicional y actuaciones incluidas; edad sólo con fecha de referencia explícita de la temporada.
2. Perfil con tres bloques: físico, pase y movimientos sin pelota. Mostrar el número de actuaciones de cada bloque, ausencias y fecha/edición.
3. Comparación de dos perfiles en 6–8 métricas verificadas, sin un score universal ni ranking económico.
4. Glosario junto a cada métrica y exportación de la comparación cuando las condiciones de publicación estén revisadas.

Primero un prototipo tabular local. Las tareas de backend/web se deciden después de validar la tabla. Similarity y arquetipos pueden seguir cuando definiciones y normalización estén resueltas.

## Decisión y pendientes

**Viabilidad técnica preliminar positiva para comparar perfiles; D1 todavía pendiente de cierre semántico y condiciones de publicación.** No se adoptó SkillCorner como única fuente del proyecto.

Antes de implementar rankings o publicar:

- Confirmar glosario de Passing/OBR: denominadores `p30tip`, definición de romper líneas y de carrera peligrosa.
- Explicar diferencias de actuaciones entre bloques y claves exclusivas de Physical; medir cobertura temporal por equipo si hay metadata suficiente.
- Revisar alcance de [MIT del repositorio](https://github.com/SkillCorner/opendata/blob/master/LICENSE) sobre los datasets y mantener atribución; no inferir acceso libre a la API comercial.
- Fijar versión del snapshot y definir reglas de mínimo de muestra, fecha de edad y multirol.

## Reproducir los chequeos

```sh
python3 scripts/check_free_sources.py --download
python3 scripts/profile_skillcorner.py
```

El perfil se ejecutó contra los CSV locales. Genera [skillcorner_profile.json](skillcorner_profile.json) y una unión externa en el cache ignorado por Git. Verifica claves únicas/no vacías y calcula dos tasas físicas siguiendo la fórmula oficial. No calcula scores ni percentiles.

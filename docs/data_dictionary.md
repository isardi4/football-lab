# Diccionario · Arsenal Collection

Fecha: 2026-10-13. Análisis independiente con fines de aprendizaje y portfolio.

| Campo | Significado y procedencia |
|---|---|
| `historical` | Participantes con intervalos posicionales en los 38 partidos StatsBomb de Arsenal 2003/04; incluye un ingreso en descuento con cero minutos regulares |
| `champions` | Registros asociados a Arsenal en el archivo FPL final 2025/26; no equivale a jugadores que participaron |
| `current` | 24 jugadores seleccionados desde las listas oficiales de septiembre 2026, cruzados con snapshot FPL del 13/10; excluye cesiones fuera del club y academia sin presencia en el grupo principal |
| `past_team` | Club del snapshot FPL 2025/26; el agregado puede incluir otra afiliación si hubo transferencia durante la temporada |
| `role` | Etiqueta editorial de función actual; no se deriva de una posición fina FPL |
| `minutes` histórico | Suma de intervalos `from/to` de alineaciones; reloj global, primer tiempo limitado a 45 y segundo a 90; finales abiertos cierran en 90. Excluye descuento y ausencias temporales; corta intervalos en Red Card/Second Yellow, aunque la posición quede abierta |
| `minutes` moderno | Total reportado por FPL de la ventana 2025/26 |
| `goals` histórico | Eventos Shot, outcome Goal; no goles en contra de rivales |
| `goals_conceded` histórico | Goles del marcador atribuidos al arquero que completó los 90 minutos; null para jugadores de campo |
| `clean_sheets` histórico | Partidos sin goles recibidos del arquero que completó los 90 minutos; null para jugadores de campo |
| `clean_sheets` moderno | Valor FPL; admite valla invicta desde 60 minutos sin goles recibidos mientras el jugador participa. No se trata como criterio idéntico fuera de partidos completos |
| `goals` moderno | `goals_scored` reportado por FPL |
| `assists` histórico | Pases con `goal_assist=true` |
| `assists` moderno | Asistencias fantasy, no homologadas a asistencias oficiales |
| `xg` histórico | Suma de `statsbomb_xg` de tiros |
| `xa` histórico | Suma de xG de los tiros ligados por `assisted_shot_id`; no reproduce necesariamente otra definición de xA |
| `xg/xa` moderno | `expected_goals/expected_assists` FPL; modelos distintos al histórico |
| `recoveries` histórico | Ball Recovery sin `recovery_failure=true` |
| `tackles` histórico | Duel con type Tackle, sin limitar a resultado exitoso |
| `recoveries/tackles` moderno | Totales FPL, pendientes de homologación de definiciones |
| `cbi` | Histórico: suma de eventos Clearance + Block + Interception; moderno: total FPL clearances_blocks_interceptions. Proxy entre proveedores, no homologación exacta |
| `progressive_passes` | Pases completados con avance horizontal de al menos 12 unidades en campo StatsBomb 120×80; definición del proyecto |
| `dribbles` | Dribble con outcome Complete |
| `saves` histórico | Goal Keeper type Shot Saved, Penalty Saved o Shot Saved to Post; clasificación a revisar antes de usar para selección de arqueros |
| `external` | Jugadores con ≥900 minutos 2025/26 fuera del snapshot Arsenal de esa temporada y del plantel actual seleccionado |
| `current_team_fpl` | Afiliación actual reportada por FPL; pendiente de verificación oficial para recomendaciones de fichaje |
| `fm` | Muestra pública de ocho atributos de Rice FM26 publicada por FMInside; escala normalizada 0–99. No entra en cálculos de similitud |
| `provenance` | SHA-256 de los archivos locales utilizados, para auditar snapshots |

Los faltantes son `null`; los ceros observados permanecen cero. Per-90: `total * 90 / minutes`; con cero minutos, no se calcula. Overall, Ofensivo y Defensivo son afinidades exploratorias de métricas disponibles. No hay corrección por liga/época ni estimación de costo de contratación.

StatsBomb Open Data y FPL no son mediciones idénticas. Las parejas propuestas en el once son hipótesis editoriales, no conclusiones estadísticas. El buscador de refuerzos compara una dimensión explícita de producción, no el encaje táctico completo. Datos de FM son evaluaciones del juego; no certifican salarios, contratos ni rendimiento real.

Fuentes: [StatsBomb Open Data](https://github.com/hudl/open-data), [FPL](https://fantasy.premierleague.com), [archivo vaastav](https://github.com/vaastav/Fantasy-Premier-League), [Football-Data.co.uk](https://www.football-data.co.uk), [planteles oficiales](https://www.premierleague.com/en/news/4706139/see-all-the-202627-premier-league-squad-lists), [FMInside](https://fminside.net/players/7-fm-26/28106491-declan-rice).

Los JSON de eventos, alineaciones y dumps originales permanecen en cache local ignorado. La web contiene agregados calculados y procedencia. La atribución y el logo StatsBomb aparecen en la página.

## Modelo anterior: offensive_v1 (reemplazado por profile_v2)

La comparación muestra similitud de producción ofensiva, no de estilo global: `100 × min(a,b)/max(a,b)` para goles/90 y xG/90; media de dimensiones con igual peso. Ceros compartidos no aportan señal y no se incluyen. Requiere ambas métricas disponibles, valores no negativos, al menos 900 minutos en cada ventana y jugadores de categorías MID/FWD. Para arqueros/defensores queda no evaluable: estas métricas no describen su función. El xG de ambas fuentes tiene modelos distintos, por lo que este índice es orientativo y no validado como medida táctica. No incluye defensa, asistencias fantasy, FM ni métricas históricas sin equivalente moderno. Es independiente del interruptor de totales/per-90.

El mismo offensive_v1 se usa en Comparar y Refuerzos. El orden predeterminado de refuerzos es porcentaje descendente, con desempate por minutos descendentes y nombre; los no evaluables quedan al final. La ficha superior destaca la mejor coincidencia ofensiva de los filtros activos, incluso si se ordena la tabla por otra estadística. Al cambiar referente se selecciona su grupo amplio, editable por el usuario.

## Modelo vigente: profile_v2

A pedido del usuario, se compara ofensiva y defensa y se muestran hasta siete candidatos externos. No se agregaron fuentes nuevas: se derivaron campos históricos adicionales compatibles a nivel conceptual, con criterios de proveedor todavía diferentes.

- **Ofensivo:** goles/90, xG/90 y xA/90. No incluye asistencias fantasy porque tienen distinta atribución.
- **Defensivo de campo:** recuperaciones/90, tackles/90 y CBI/90. CBI histórico suma eventos Clearance, Block e Interception; FPL aporta su total equivalente nominal. Es un proxy. No se interpreta que todos los tipos de bloqueo/intercepción se codifiquen igual.
- **Defensivo de arquero:** atajadas/90 y goles recibidos/90. El histórico atribuye goles del marcador sólo al arquero con exposición completa de 90 minutos; no usa ese total para jugadores de campo. Sin datos de distribución, el ofensivo del arquero no es evaluable.
- **Por indicador:** `100 * min(a,b) / max(a,b)`, con valores por 90. Un cero compartido no aporta señal. Un cero frente a un valor positivo produce 0% de afinidad. No significa peor/mejor calidad.
- **Por bloque:** promedio con igual peso de los indicadores que aportan señal. Se requieren al menos dos métricas presentes en ambas fuentes y 900 minutos por jugador; se informa cuántos indicadores aportan señal sobre el universo del bloque. Una métrica faltante puede dejar 2/3; no se reemplaza por cero.
- **Overall:** según grupo original, FWD 70% ofensivo / 30% defensivo, MID 50% / 50%, DEF 30% / 70%, GK 0% / 100%. Son pesos editoriales, no aprendidos. Sin un bloque requerido, no hay Overall; no se redistribuyen sus pesos.
- **Orden:** por valor sin redondear de la dimensión elegida, con desempate por minutos y nombre. La visualización redondea a entero. Top siete, o menos si los filtros devuelven menos.

Una fuente distinta puede cambiar conteos, especialmente CBI y tackles. Los índices sirven para explorar cercanía en este conjunto de indicadores; no son una probabilidad de encaje ni una medida completa de estilo. Pases, conducción, regates, presiones y atributos FM sin contraparte histórica/moderna conservan sus faltantes. No se añade rendimiento simulado a estadísticas reales.

## Detalles de partidos

`match-data.js/json` contiene 76 fichas, con IDs `sb-<match_id>` para 2003/04 y `pl-<fecha ISO>` para 2025/26. El marcador y los nombres se muestran en orden local–visitante; el color de la tarjeta se determina por victoria/derrota/empate del Arsenal.

Histórico: goles desde Shot/Goal y Own Goal Against, omitiendo el espejo Own Goal For para no duplicar. El gol en contra se acredita al rival del autor. Tarjetas se leen desde Foul Committed/Bad Behaviour y cambios desde Substitution. El reloj de la cronología muestra minuto:segundo del evento, sin redondearlo a un minuto editorial. Alineaciones y minutos desde intervalos posicionales, sin descuento. Tiros al arco reconstruidos con outcomes Goal, Saved y Saved to Post: es un proxy de eventos, no una medición homologada con otra fuente.

Moderno: marcadores final y descanso, tiros, tiros al arco, faltas, córners, amarillas y rojas del CSV. No contiene cronología individual ni alineaciones; no se infieren desde agregados de temporada. Los detalles se presentan en una página HTML sin enviar al usuario a un JSON.

Escudos: archivos oficiales actuales del servicio de imágenes de Premier League, guardados localmente. Son identificadores visuales del club, no una reconstrucción de sus versiones históricas. Procedencia y SHA-256 en `crests/sources.json`.

Las posiciones históricas pueden permanecer abiertas después de una expulsión. `position_minutes` limita los intervalos a la primera Red Card/Second Yellow del jugador. Se aplica tanto a agregados como a fichas del partido; goles y conteos de acciones no cambian.

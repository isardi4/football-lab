# Diccionario · Arsenal Collection

Fecha: 2026-10-13. Análisis independiente con fines de aprendizaje y portfolio.

| Campo | Significado y procedencia |
|---|---|
| `historical` | Participantes con intervalos posicionales en los 38 partidos StatsBomb de Arsenal 2003/04; incluye un ingreso en descuento con cero minutos regulares |
| `champions` | Registros asociados a Arsenal en el archivo FPL final 2025/26; no equivale a jugadores que participaron |
| `current` | 24 jugadores seleccionados desde las listas oficiales de septiembre 2026, cruzados con snapshot FPL del 13/10; excluye cesiones fuera del club y academia sin presencia en el grupo principal |
| `past_team` | Club del snapshot FPL 2025/26; el agregado puede incluir otra afiliación si hubo transferencia durante la temporada |
| `role` | Etiqueta editorial de función actual; no se deriva de una posición fina FPL |
| `minutes` histórico | Suma de intervalos `from/to` de alineaciones; reloj global, primer tiempo limitado a 45 y segundo a 90; finales abiertos cierran en 90. Excluye descuento y ausencias temporales |
| `minutes` moderno | Total reportado por FPL de la ventana 2025/26 |
| `goals` histórico | Eventos Shot, outcome Goal; no goles en contra de rivales |
| `goals` moderno | `goals_scored` reportado por FPL |
| `assists` histórico | Pases con `goal_assist=true` |
| `assists` moderno | Asistencias fantasy, no homologadas a asistencias oficiales |
| `xg` histórico | Suma de `statsbomb_xg` de tiros |
| `xa` histórico | Suma de xG de los tiros ligados por `assisted_shot_id`; no reproduce necesariamente otra definición de xA |
| `xg/xa` moderno | `expected_goals/expected_assists` FPL; modelos distintos al histórico |
| `recoveries` histórico | Ball Recovery sin `recovery_failure=true` |
| `tackles` histórico | Duel con type Tackle, sin limitar a resultado exitoso |
| `recoveries/tackles` moderno | Totales FPL, pendientes de homologación de definiciones |
| `cbi` | Total FPL de clearances + blocks + interceptions, no intercepciones separadas |
| `progressive_passes` | Pases completados con avance horizontal de al menos 12 unidades en campo StatsBomb 120×80; definición del proyecto |
| `dribbles` | Dribble con outcome Complete |
| `saves` histórico | Goal Keeper type Shot Saved, Penalty Saved o Shot Saved to Post; clasificación a revisar antes de usar para selección de arqueros |
| `external` | Jugadores con ≥900 minutos 2025/26 fuera del snapshot Arsenal de esa temporada y del plantel actual seleccionado |
| `current_team_fpl` | Afiliación actual reportada por FPL; pendiente de verificación oficial para recomendaciones de fichaje |
| `fm` | Muestra pública de ocho atributos de Rice FM26 publicada por FMInside; escala normalizada 0–99. No entra en cálculos de similitud |
| `provenance` | SHA-256 de los archivos locales utilizados, para auditar snapshots |

Los faltantes son `null`; los ceros observados permanecen cero. Per-90: `total * 90 / minutes`; con cero minutos, no se calcula. No hay porcentaje global de similitud, corrección por liga/época ni estimación de costo de contratación.

StatsBomb Open Data y FPL no son mediciones idénticas. Las parejas propuestas en el once son hipótesis editoriales, no conclusiones estadísticas. El buscador de refuerzos compara una dimensión explícita de producción, no el encaje táctico completo. Datos de FM son evaluaciones del juego; no certifican salarios, contratos ni rendimiento real.

Fuentes: [StatsBomb Open Data](https://github.com/hudl/open-data), [FPL](https://fantasy.premierleague.com), [archivo vaastav](https://github.com/vaastav/Fantasy-Premier-League), [Football-Data.co.uk](https://www.football-data.co.uk), [planteles oficiales](https://www.premierleague.com/en/news/4706139/see-all-the-202627-premier-league-squad-lists), [FMInside](https://fminside.net/players/7-fm-26/28106491-declan-rice).

Los JSON de eventos, alineaciones y dumps originales permanecen en cache local ignorado. La web contiene agregados calculados y procedencia. La atribución y el logo StatsBomb aparecen en la página.

## Índice exploratorio offensive_v1

La comparación muestra similitud de producción ofensiva, no de estilo global: `100 × min(a,b)/max(a,b)` para goles/90 y xG/90; media de dimensiones con igual peso. Ceros compartidos no aportan señal y no se incluyen. Requiere ambas métricas disponibles, valores no negativos, al menos 900 minutos en cada ventana y jugadores de categorías MID/FWD. Para arqueros/defensores queda no evaluable: estas métricas no describen su función. El xG de ambas fuentes tiene modelos distintos, por lo que este índice es orientativo y no validado como medida táctica. No incluye defensa, asistencias fantasy, FM ni métricas históricas sin equivalente moderno. Es independiente del interruptor de totales/per-90.

El mismo offensive_v1 se usa en Comparar y Refuerzos. El orden predeterminado de refuerzos es porcentaje descendente, con desempate por minutos descendentes y nombre; los no evaluables quedan al final. La ficha superior destaca la mejor coincidencia ofensiva de los filtros activos, incluso si se ordena la tabla por otra estadística. Al cambiar referente se selecciona su grupo amplio, editable por el usuario.

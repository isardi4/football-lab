# Arsenal actual e Invincibles: alcance vigente

Fecha de investigación y corte inicial: 2026-10-13. El usuario eligió comparar los Invincibles con el plantel más actual posible del Arsenal y sugerir refuerzos para acercarlo a las funciones originales. Reemplaza Hull City y deja fuera el torneo de equipos históricos.

## Pregunta y entrega

Para cada referente de 2003/04: ¿quién del Arsenal actual cumple una función parecida, en qué aspectos se acerca, qué diferencias quedan y qué jugador externo reduciría esas diferencias?

Resultado esperado: tabla explicada por referente, once actual propuesto sin duplicaciones y shortlist externa para las brechas. La similitud de estilo se presenta separada del nivel de producción; nadie se considera equivalente en calidad sólo por tener estadísticas parecidas. No hay ranking ni reemplazos verificados todavía.

## Datos comprobados

- Histórico: [listado oficial StatsBomb](https://github.com/hudl/open-data/blob/master/data/matches/2/44.json), 38 partidos del Arsenal. El archivo de eventos `3749493` inspeccionado tiene 3.057 acciones, pases con coordenadas/longitud, conducciones, regates, presiones, recuperaciones, duelos, intercepciones y tiros con xG. Pendiente comprobar eventos y alineaciones del conjunto completo y reconstruir minutos/posiciones.
- Plantel: [registro oficial Premier League del 03/09/2026](https://www.premierleague.com/en/news/4706139/see-all-the-202627-premier-league-squad-lists) y [dorsales oficiales del 22/09/2026](https://www.premierleague.com/en/news/4725682/all-20-premier-league-clubs-squad-numbers-for-202627-season). Las listas no son idénticas: el registro marca la cesión de Nwaneri mientras los dorsales lo incluyen. Mantener elegibilidad separada de presencia en una lista; confirmar cambios posteriores antes de cerrar el snapshot.
- Actual: el snapshot FPL descargado el 13/10 contiene 29 entradas asociadas a Arsenal. Martinelli, Fábio Vieira, Nelson y Gabriel Jesus aparecen en FPL, pero no en las listas oficiales citadas. No asumir que esas entradas prueban pertenencia actual ni recomendar que el Arsenal fiche a alguien que ya tiene. Saliba aparece registrado y sin minutos en la muestra actual: no tratarlo como mal jugador.
- La fuente moderna detallada sigue sin seleccionar. API-Football no tiene clave configurada y su plan gratuito limita temporadas. No se verificó acceso a métricas actuales de progresión, creación detallada o defensa compatible con los eventos históricos.

## Once de referencia y dimensiones propuestas

Estos son referentes iniciales y dimensiones a investigar, no conclusiones medidas sobre sus estilos. Validar la selección y los roles con alineaciones, eventos y revisión futbolística; admitir jugadores históricos alternativos.

| Referente | Dimensiones que conviene estudiar |
|---|---|
| Lehmann | Atajadas, acciones fuera del arco y distribución |
| Lauren | Defensa lateral, progresión y aportes desde banda |
| Touré | Defensa, recuperación y salida con pelota |
| Campbell | Duelos, juego aéreo y defensa del área |
| Ashley Cole | Progresión, participación ofensiva y defensa lateral |
| Vieira | Recuperación, conducción y progresión por pase |
| Gilberto Silva | Recuperación, intercepción y circulación |
| Ljungberg | Recepciones/acciones en el área y finalización desde banda |
| Pirès | Creación, regate y amenaza de gol desde banda |
| Bergkamp | Conexión con compañeros, creación y participación entre líneas |
| Henry | Finalización, creación, regate y progresión ofensiva |

No inferir velocidad, liderazgo o todos los desmarques desde un dataset de eventos. Una recepción en el área es una evidencia parcial del movimiento que la precedió.

## Compatibilidad histórica y moderna

| Dimensión | StatsBomb 2003/04 observado | FPL actual observado | Decisión |
|---|---|---|---|
| Minutos y goles | Eventos/alineaciones; minutos a reconstruir | Agregados e historial por partido | Comparación potencial tras validar minutos y fechas |
| Asistencias | Derivar y validar criterios de atribución | Agregado fantasy | No equiparar asistencias fantasy con asistencias oficiales |
| xG y xA | xG de tiros; creación derivable desde pases enlazados | xG y xA agregados | No usar como escala idéntica sin revisar modelos/definiciones |
| Recuperaciones y tackles | Tipos de eventos | Totales FPL | Pendiente equivalencia de definiciones, no sumar por similitud de nombre |
| Intercepciones | Evento separado | Combinado con despejes/bloqueos | No comparar con el total combinado |
| Progresión, pases, regate y presión | Eventos disponibles en la muestra | No disponibles en los endpoints inspeccionados | Requiere otra fuente moderna |
| Juego sin pelota y velocidad | No tracking continuo inspeccionado | No tracking continuo | No evaluable con estos accesos |

FPL permite una comparación exploratoria de producción, pero por sí sola no sustenta la similitud completa por función solicitada. Un rol sin métricas esenciales compatibles queda como no evaluable, sin porcentaje inventado.

## Reglas de comparación

1. Congelar plantel actual, fuentes y fecha de corte; excluir cedidos fuera del club y separar jóvenes del primer equipo de la academia completa.
2. Construir perfiles históricos por posición/función y minutos efectivos. No usar percentiles de toda la Premier 2003/04: el archivo cubre Arsenal y dos partidos por rival, no la liga completa.
3. Mantener la ventana actual 2026/27 separada de 2025/26. Si hay poca participación, mostrar incertidumbre; una ventana anterior puede aportar evidencia si está disponible, aunque el jugador entonces estuviera en otro club.
4. Definir métricas compartidas y normalización por minutos. Revisar efecto del estilo colectivo y contexto de época; no afirmar que per-90 por sí solo los elimina.
5. Mostrar similitud por dimensión, métricas usadas, faltantes y nivel de producción. Antes de combinar dimensiones, definir pesos por rol, verificar sensibilidad e inspeccionar resultados. No llamar probabilidad a una distancia matemática.
6. Seleccionar un once sin duplicaciones. Revisar pareja central, doble pivote, bandas y pareja atacante; complementariedad requiere evaluación además de similitud individual.
7. Para cada brecha, buscar candidatos externos con el mismo conjunto de métricas, club actual confirmado y suficiente participación. Mostrar qué mejora y qué sacrifica frente al candidato interno. No confundir parecido deportivo con disponibilidad para fichar.

## Próximo experimento y salida

Auditar 3–5 partidos históricos y una muestra moderna equivalente. Propuesta de piloto: Vieira/Gilberto y Henry/Bergkamp, para comprobar que podemos distinguir recuperación/progresión y creación/finalización. El piloto no reemplaza la entrega final del once.

La tabla debe contener `referente`, `rol`, `candidato_actual`, `ventana`, `minutos`, `se_parece_en`, `difiere_en`, `dimensiones_no_evaluables`, `confianza` y `candidatos_externos`. Los campos de candidatos pueden quedar pendientes durante el spike; la entrega de recomendaciones requiere evidencia moderna suficiente. No generar nombres ordenados ni porcentajes sólo a partir de recuerdos futbolísticos.

Si los accesos gratuitos no aportan métricas esenciales, documentar exactamente lo que falta y ofrecer una comparación parcial dentro de este caso Arsenal. No reemplazar silenciosamente el club, época o pregunta. Una fuente paga sólo se evalúa después de presentar esa brecha; no hay gasto autorizado.


## Actualización: temporada completa y Football Manager público

El usuario confirmó que no posee Football Manager; investigar los atributos disponibles en sitios comunitarios, sin solicitar una exportación propia. Los atributos FM forman parte del trabajo de discovery actual. No hay todavía un dataset FM importado.

Se propone usar **Arsenal campeón 2025/26** como base de rendimiento moderno completa, manteniendo el plantel actual como universo de selección y 2026/27 como actualización separada. El campeonato está confirmado por la [Premier League](https://www.premierleague.com/en/news/4662306). No asignar a un nuevo fichaje estadísticas que produjo otro jugador ni atribuir al Arsenal toda una temporada de alguien que jugó en otro club.

Acceso real comprobado y guardado en [arsenal_2526_access_check.json](arsenal_2526_access_check.json):

- Football-Data.co.uk: 380 partidos de Premier 2025/26, 38 del Arsenal. Permite contexto colectivo y comparación de resultados/tiros, no perfiles individuales detallados.
- FPL `history_past`: agregados 2025/26 presentes para Raya (3.330 minutos), Gabriel (2.750), Saka (2.218), Rice (3.093) y Ødegaard (1.363). Hay titularidades, goles, asistencias fantasy, xG/xA, tackles y recuperaciones, entre otros campos. Estos cinco casos no prueban cobertura del plantel entero ni historial por partido de esa temporada. La respuesta histórica no identifica el club; validar pertenencia durante la ventana.
- Rice ofrece una muestra completa de campos: 35 titularidades, 69 tackles y 180 recuperaciones. Son valores reportados por FPL, aún no reconciliados con una segunda fuente; no llamarlos eventos StatsBomb equivalentes.

Fuentes FM públicas localizadas: [FMInside Rice FM26](https://fminside.net/players/7-fm-26/28106491-declan-rice), [FM Scout Rice](https://www.fmscout.com/player/28106491/declan-rice.html), [Sortitoutsi Arsenal FM26](https://sortitoutsi.net/football-manager-2026/team/602/arsenal). También hay fichas FMInside de Saka y Ødegaard. La ficha de Rice consultada mediante búsqueda publica atributos técnicos, mentales y físicos y avisa que su escala está normalizada a 0–99. No mezclar esa escala con puntuaciones originales sin una transformación documentada. La apertura directa de FMInside no devolvió contenido en el navegador de investigación; no se validó extracción automatizada.

FM Scout y Sortitoutsi replican información de la misma familia de bases FM; su coincidencia no equivale a tres evaluaciones independientes. Registrar edición, actualización, URL, fecha, escala y si los valores son del juego base o modificados por la comunidad. Salarios, precios y contratos del juego no certifican datos reales actuales. Los atributos son evaluaciones de scouting; estadísticas de una partida son rendimiento simulado. Esta distinción está sustentada por [Sports Interactive/SEGA](https://www.footballmanager.com/privacy-policy-professionals).

No se verificaron atributos FM contemporáneos a 2003/04 para los Invincibles. No usar atributos de Henry o Vieira en una edición posterior como si describieran exactamente su temporada invicta. Primero construir su perfil con eventos reales; cualquier complemento histórico debe identificar época y procedencia.

La [página oficial de estadísticas Premier](https://www.premierleague.com/en/clubs/3/arsenal/stats) y artículos oficiales de Arsenal son fuentes de contraste, pero no se obtuvo una tabla exportable completa de jugadores 2025/26: el navegador sólo obtuvo el contenedor de la página y los artículos devolvieron 403. Understat tiene una página para Arsenal 2025/26, aunque la lectura obtenida no expuso sus tablas; su cobertura efectiva queda pendiente. API-Football anuncia temporadas recientes y estadísticas individuales; falta clave y verificación de acceso 2025. Son candidatas, no datos ya integrados.

Conclusión: sí tenemos una base descargable de temporada completa y muestras individuales; FM público puede enriquecer los perfiles modernos. Falta ampliar cobertura al plantel completo, verificar equivalencias de métricas y conseguir el detalle moderno de pases/progresión. Las fuentes complementarias ayudan, pero no convierten un atributo de visión en una cantidad de pases progresivos.

# Football Lab · Arsenal Collection

[Español](#español) · [English](#english)

**[Ver la web / Open the website](https://isardi4.github.io/football-lab/)**

## Español

Comparación interactiva de los Invincibles 2003/04, el rendimiento del Arsenal campeón 2025/26 y el plantel actual 2026/27. Incluye perfiles por jugador, propuestas de equivalentes por función, planteles, partidos y un buscador exploratorio de refuerzos.

La página es estática, está en `docs/` y se publica con GitHub Pages. No necesita servidor de aplicación, credenciales ni llamadas a APIs desde el navegador. Los datos son un snapshot y no se actualizan en vivo. La web abre en inglés por defecto; el selector de la esquina superior derecha permite cambiar a español y recuerda la elección al navegar.

### Qué incluye

- **Comparar:** tres índices de afinidad estadística —Overall, Ofensivo y Defensivo— y el detalle de los indicadores utilizados. Los candidatos se restringen a grupos de posición compatibles; se conserva la hipótesis editorial Bergkamp–mediapunta en el once actual.
- **Plantel:** jugadores históricos, registros de la campaña campeona y plantel actual, con la temporada y el club de cada muestra claramente separados.
- **Refuerzos:** hasta siete candidatos externos del mismo grupo de posición que el referente, ordenados por el índice o indicador elegido.
- **Partidos:** tarjetas con colores pastel según victoria, empate o derrota del Arsenal y escudos de ambos equipos. Cada partido abre una página de detalles.
- **Fuentes:** procedencia, cobertura, definiciones y datos descargables.

El índice ofensivo usa goles, xG y xA; el defensivo usa recuperaciones, tackles y CBI (despejes, bloqueos e intercepciones). Para arqueros utiliza atajadas, goles recibidos y vallas invictas. Overall pondera los bloques según el grupo de posición original.

Son aproximaciones exploratorias entre fuentes con definiciones diferentes. Las parejas del once son hipótesis editoriales: los porcentajes no representan calidad, similitud táctica completa ni probabilidad de éxito de un fichaje. El buscador no estima precios, contratos o disponibilidad. Ver el [diccionario de datos](docs/data_dictionary.md).

### Datos y cobertura

- **StatsBomb:** eventos y alineaciones de los 38 partidos del Arsenal en 2003/04.
- **FPL:** agregados de 2025/26 del archivo público de vaastav, contrastados con cinco respuestas oficiales; snapshot 2026/27 para afiliaciones actuales.
- **Football-Data.co.uk:** resultados y estadísticas por equipo de los 38 partidos del Arsenal en 2025/26.
- **Premier League:** listas oficiales de planteles y servicio de imágenes para los escudos, con URLs y hashes en [`docs/crests/sources.json`](docs/crests/sources.json).

Los partidos históricos incluyen estadísticas, alineaciones y cronología de goles, tarjetas y cambios. Los de 2025/26 incluyen marcador final, resultado al descanso y estadísticas por equipo; los faltantes de alineaciones y cronología modernas se indican explícitamente.

### Reproducir y abrir localmente

Requisitos: Python 3.10+, curl y Node.js para comprobar el modelo JavaScript. No se necesitan paquetes Python adicionales.

```sh
python3 scripts/download_arsenal.py
python3 scripts/build_dashboard_data.py
python3 scripts/build_match_data.py
python3 scripts/download_crests.py
python3 -m unittest discover -s tests
node tests/test_similarity.cjs
node tests/test_i18n.cjs
node --check docs/lab.js
python3 -m http.server 8000 --directory docs
```

Abrir [localhost:8000](http://localhost:8000). También se puede abrir `docs/index.html` directamente; para consultar la versión incluida en el repositorio no hace falta descargar ni reconstruir los datos.

Los archivos originales se guardan en `data/source_checks/`, ignorado por Git. El descargador fija revisiones de los repositorios históricos; los endpoints actuales y los resultados son snapshots de fuentes mutables. El JSON público incluye hashes para auditoría.

### Atribución

Proyecto independiente de aprendizaje y portfolio. Los datos históricos son de **StatsBomb**, con logo y fuente en la página. El proyecto no está afiliado con Arsenal ni Premier League. Las marcas pertenecen a sus propietarios. Los documentos de [`docs/research/`](docs/research/) conservan la investigación y los cambios de dirección del proyecto.

## English

An interactive comparison of the 2003/04 Invincibles, Arsenal’s title-winning 2025/26 performances, and the current 2026/27 squad. It includes player profiles, proposed counterparts by role, squad lists, match details, and an exploratory recruitment browser.

The static website lives in `docs/` and is published through GitHub Pages. It requires no application server, credentials, or browser-side API calls. The data is a snapshot and does not update live. The website opens in English by default; the selector in the upper-right corner switches to Spanish and remembers the choice while navigating.

### Features

- **Compare:** three statistical affinity indices—Overall, Offensive, and Defensive—with a breakdown of the indicators used. Candidates are restricted to compatible position groups; the current lineup retains the editorial Bergkamp–attacking midfielder hypothesis.
- **Squad:** historical players, title-winning season records, and the current squad, with each sample’s season and club clearly distinguished.
- **Recruitment:** up to seven external candidates from the reference player’s position group, sorted by the selected index or indicator.
- **Matches:** pastel cards showing Arsenal wins, draws, and defeats, with both clubs’ crests. Each match opens a detail page.
- **Sources:** provenance, coverage, definitions, and downloadable data.

The offensive index uses goals, xG, and xA; the defensive index uses recoveries, tackles, and CBI (clearances, blocks, and interceptions). Goalkeepers are assessed using saves, goals conceded, and clean sheets. Overall weights the blocks according to the historical player’s position group.

These are exploratory proxies across sources with different definitions. The lineup pairings are editorial hypotheses: percentages do not represent quality, complete tactical similarity, or the probability of a successful signing. The recruitment browser does not estimate prices, contracts, or availability. See the [data dictionary, in Spanish](docs/data_dictionary.md).

### Data and coverage

- **StatsBomb:** events and lineups for all 38 Arsenal matches in 2003/04.
- **FPL:** 2025/26 aggregates from vaastav’s public archive, checked against five official responses; a 2026/27 snapshot for current club affiliations.
- **Football-Data.co.uk:** results and team statistics for all 38 Arsenal matches in 2025/26.
- **Premier League:** official squad lists and the crest image service, with URLs and hashes recorded in [`docs/crests/sources.json`](docs/crests/sources.json).

Historical match pages include statistics, lineups, and timelines of goals, cards, and substitutions. The 2025/26 pages include full-time and half-time scores and team statistics; missing modern lineups and timelines are explicitly identified.

### Reproduce and run locally

Requirements: Python 3.10+, curl, and Node.js to check the JavaScript model. No additional Python packages are required.

```sh
python3 scripts/download_arsenal.py
python3 scripts/build_dashboard_data.py
python3 scripts/build_match_data.py
python3 scripts/download_crests.py
python3 -m unittest discover -s tests
node tests/test_similarity.cjs
node tests/test_i18n.cjs
node --check docs/lab.js
python3 -m http.server 8000 --directory docs
```

Open [localhost:8000](http://localhost:8000). You can also open `docs/index.html` directly; viewing the version included in the repository does not require downloading or rebuilding the data.

Original source files are stored in `data/source_checks/`, which Git ignores. The downloader pins historical repository revisions; current endpoints and results are snapshots of mutable sources. The public JSON includes hashes for auditing.

### Attribution

An independent learning and portfolio project. Historical data comes from **StatsBomb**, whose logo and source are shown on the website. The project is not affiliated with Arsenal or the Premier League. Trademarks belong to their respective owners. Documents in [`docs/research/`](docs/research/) preserve the research and the project’s changes in direction.

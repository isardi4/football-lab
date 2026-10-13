# Football Lab · Arsenal Collection

Comparación interactiva de los Invincibles 2003/04, la producción del Arsenal campeón 2025/26 y el plantel actual 2026/27. Incluye perfiles por jugador, propuestas de equivalentes por función, planteles, partidos y un buscador exploratorio de candidatos externos.

**Web:** https://isardi4.github.io/football-lab/

Página estática en `docs/`, publicada con GitHub Pages. Sin servidor, credenciales ni API en el navegador. Los datos son un snapshot; la página no promete actualización en vivo ni un ranking validado de similitud táctica.

## Datos

- StatsBomb: eventos y alineaciones de los 38 partidos de Arsenal 2003/04.
- FPL: agregados históricos 2025/26 desde el archivo público de vaastav, contrastados con cinco respuestas oficiales; snapshot 2026/27 para afiliaciones actuales.
- Football-Data.co.uk: 38 resultados del Arsenal en 2025/26.
- Premier League: listas oficiales para separar plantel actual, cedidos y registros históricos.
- Football Manager: muestra pública FM26 de Rice y enlaces de procedencia. Sin integración completa; atributos separados de estadísticas reales.

Hay diferencias de definición entre fuentes; ver [diccionario](docs/data_dictionary.md). Las parejas del once son hipótesis editoriales. El buscador de refuerzos ordena producción por una métrica explícita; no estima precios ni probabilidad de éxito de un fichaje.

## Reproducir

Python 3.10+ y curl, sin paquetes Python adicionales:

```sh
python3 scripts/download_arsenal.py
python3 scripts/build_dashboard_data.py
python3 -m unittest discover -s tests
node --check docs/lab.js
python3 -m http.server 8000 --directory docs
```

Abrir http://localhost:8000. También se puede abrir `docs/index.html` directamente. Los archivos originales están en `data/source_checks/`, ignorados por Git. El downloader fija revisiones de los repositorios históricos; los endpoints actuales y resultados son snapshots mutables. El JSON público incluye hashes para auditoría.

## Atribución

Análisis independiente de aprendizaje y portfolio. Datos históricos: **StatsBomb**, con logo y fuente en la página. No afiliado con Arsenal, Premier League o Sports Interactive. Las marcas pertenecen a sus propietarios. Los documentos en `docs/research/` conservan la investigación y sus cambios de dirección.

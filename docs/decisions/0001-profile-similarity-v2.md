# Comparación exploratoria con Overall, Ofensivo y Defensivo

Fecha: 2026-10-13. Estado: implementado por solicitud del usuario; reemplaza offensive_v1.

## Contexto

El porcentaje inicial usaba sólo goles y xG. El usuario pidió todos los indicadores que podamos comparar, bloques Overall/Ofensivo/Defensivo, siete candidatos y porcentajes discretos. Las fuentes disponibles tienen distintos criterios y no incluyen tracking ni atributos FM históricos equivalentes.

## Decisión

Usar profile_v2, definido en `docs/similarity.js`, con ataque (goles, xG, xA por 90), defensa de campo (recuperaciones, tackles, CBI por 90) y defensa de arqueros (atajadas, goles recibidos y vallas invictas por 90). CBI histórico se reconstruye desde eventos; se trata como un proxy del agregado FPL. Asistencias fantasy y atributos sin contraparte permanecen fuera del índice, pero se conserva su información como referencia.

Cada bloque requiere dos métricas presentes en ambas fuentes y 900 minutos. Se promedian razones min/max de indicadores con señal; ceros compartidos no cuentan como similitud perfecta. Los pesos Overall se fijan según el grupo original: FWD 70/30, MID 50/50, DEF 30/70 y GK 0/100. Sin un bloque requerido, Overall no se calcula. El orden usa valores sin redondear; se muestran porcentajes enteros y hasta siete candidatos.

## Alternativas y consecuencias

Un modelo basado únicamente en métricas completamente homologadas todavía no cubriría defensa. Mantener sólo ataque no cumple el alcance solicitado. Se elige una aproximación explícita entre proveedores, con cobertura, pesos y limitaciones visibles, sin presentarla como similitud táctica validada o probabilidad de encaje. Esta elección debe revisarse cuando se incorporen eventos modernos o estadísticas con definiciones compartidas.

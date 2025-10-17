## Mecánicas del Tamagotchi

### Tick global (cada 5 minutos)
- hambre: −5 (mín 0)
- energía: −3 (mín 0)
- felicidad: −2 (mín 0)

La verificación corre cada 30s y aplica tantos ticks como hayan pasado desde el último registro (persistido en `localStorage`).

### Acciones
- Alimentar: hambre +20 (máx 100), cooldown 60s
- Jugar: felicidad +15, energía −10, cooldown 60s
  - Implementación: en `GameView` puede invocar dos veces un efecto "medio" (`playHalf`) para asegurar arranque correcto del juego sin exceder el costo total. Cada llamada aplica energía −5 y felicidad +7/+8 alternado (total +15 en dos llamadas).
- Dormir: `sleeping = true` por 30s → al despertar energía +25

### Ajustes de balanceo
Los valores anteriores pueden ajustarse ±25% según necesidad (por ejemplo para ajustar dificultad o ritmo). Si se modifica algún valor, documentarlo aquí con fecha y motivo.



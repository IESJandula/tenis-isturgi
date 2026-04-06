-- Insert disponibilidades for Jornada 1 with overlapping slots
-- This ensures matches can be scheduled when players have common availability

-- Get jornada ID (should be 1 in test DB)
-- Get jugador IDs from matches in jornada 1

-- Slot combinations for each match pair
-- Match 1: Carlos Ruiz vs Andres Vega -> viernes 16:00
-- Match 2: Miguel Santos vs Pablo Navarro -> sabado 09:00  
-- Match 3: Javier Luna vs Diego Molina -> viernes 11:00

-- For testing, create 3 combinations:
-- Combo 1: {"viernes":{"16:00":true,"11:00":false},"sabado":{"09:00":false,"11:00":false,"16:00":false},"domingo":{"11:00":false,"18:00":false}}
-- Combo 2: {"viernes":{"16:00":false,"11:00":false},"sabado":{"09:00":true,"11:00":false,"16:00":false},"domingo":{"11:00":false,"18:00":false}}
-- Combo 3: {"viernes":{"16:00":false,"11:00":true},"sabado":{"09:00":false,"11:00":false,"16:00":false},"domingo":{"11:00":false,"18:00":false}}

INSERT INTO disponibilidad (jugador_id, jornada_id, slots) 
SELECT j.id, 1, '{"viernes":{"16:00":true,"11:00":false},"sabado":{"09:00":false,"11:00":false,"16:00":false},"domingo":{"11:00":false,"18:00":false}}'
FROM jugador j WHERE j.nombre = 'Carlos' AND j.apellidos LIKE '%Ruiz%' LIMIT 1;

INSERT INTO disponibilidad (jugador_id, jornada_id, slots)
SELECT j.id, 1, '{"viernes":{"16:00":true,"11:00":false},"sabado":{"09:00":false,"11:00":false,"16:00":false},"domingo":{"11:00":false,"18:00":false}}'
FROM jugador j WHERE j.nombre = 'Andres' AND j.apellidos LIKE '%Vega%' LIMIT 1;

INSERT INTO disponibilidad (jugador_id, jornada_id, slots)
SELECT j.id, 1, '{"viernes":{"16:00":false,"11:00":false},"sabado":{"09:00":true,"11:00":false,"16:00":false},"domingo":{"11:00":false,"18:00":false}}'
FROM jugador j WHERE j.nombre = 'Miguel' AND j.apellidos LIKE '%Santos%' LIMIT 1;

INSERT INTO disponibilidad (jugador_id, jornada_id, slots)
SELECT j.id, 1, '{"viernes":{"16:00":false,"11:00":false},"sabado":{"09:00":true,"11:00":false,"16:00":false},"domingo":{"11:00":false,"18:00":false}}'
FROM jugador j WHERE j.nombre = 'Pablo' AND j.apellidos LIKE '%Navarro%' LIMIT 1;

INSERT INTO disponibilidad (jugador_id, jornada_id, slots)
SELECT j.id, 1, '{"viernes":{"16:00":false,"11:00":true},"sabado":{"09:00":false,"11:00":false,"16:00":false},"domingo":{"11:00":false,"18:00":false}}'
FROM jugador j WHERE j.nombre = 'Javier' AND j.apellidos LIKE '%Luna%' LIMIT 1;

INSERT INTO disponibilidad (jugador_id, jornada_id, slots)
SELECT j.id, 1, '{"viernes":{"16:00":false,"11:00":true},"sabado":{"09:00":false,"11:00":false,"16:00":false},"domingo":{"11:00":false,"18:00":false}}'
FROM jugador j WHERE j.nombre = 'Diego' AND j.apellidos LIKE '%Molina%' LIMIT 1;

-- Verify insertion
SELECT j.nombre, j.apellidos, d.slots
FROM disponibilidad d
JOIN jugador j ON d.jugador_id = j.id
WHERE d.jornada_id = 1;

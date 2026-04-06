-- Insert disponibilidades with valid JSON for scheduling tests
INSERT INTO disponibilidades (jugador_id, jornada_id, slots, created_at, updated_at) 
SELECT j.id, 16, '{"viernes":{"16:00":true},"sabado":{},"domingo":{}}', NOW(), NOW() 
FROM jugadores j WHERE j.nombre = 'Carlos' LIMIT 1;

INSERT INTO disponibilidades (jugador_id, jornada_id, slots, created_at, updated_at) 
SELECT j.id, 16, '{"viernes":{"16:00":true},"sabado":{},"domingo":{}}', NOW(), NOW() 
FROM jugadores j WHERE j.nombre = 'Andres' LIMIT 1;

INSERT INTO disponibilidades (jugador_id, jornada_id, slots, created_at, updated_at) 
SELECT j.id, 16, '{"viernes":{},"sabado":{"09:00":true},"domingo":{}}', NOW(), NOW() 
FROM jugadores j WHERE j.nombre = 'Miguel' LIMIT 1;

INSERT INTO disponibilidades (jugador_id, jornada_id, slots, created_at, updated_at) 
SELECT j.id, 16, '{"viernes":{},"sabado":{"09:00":true},"domingo":{}}', NOW(), NOW() 
FROM jugadores j WHERE j.nombre = 'Pablo' LIMIT 1;

INSERT INTO disponibilidades (jugador_id, jornada_id, slots, created_at, updated_at) 
SELECT j.id, 16, '{"viernes":{"11:00":true},"sabado":{},"domingo":{}}', NOW(), NOW() 
FROM jugadores j WHERE j.nombre = 'Javier' LIMIT 1;

INSERT INTO disponibilidades (jugador_id, jornada_id, slots, created_at, updated_at) 
SELECT j.id, 16, '{"viernes":{"11:00":true},"sabado":{},"domingo":{}}', NOW(), NOW() 
FROM jugadores j WHERE j.nombre = 'Diego' LIMIT 1;

import json
import urllib.request
import urllib.error

BASE = "http://localhost:1337/api"
HEADERS = {"Content-Type": "application/json"}


def request_json(method, url, payload=None):
    data = None
    if payload is not None:
        data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers=HEADERS, method=method)
    with urllib.request.urlopen(req) as resp:
        return json.load(resp), resp.status


print("Validando Sprint 2 - Generacion de Calendario")

# 1) Crear division
payload_div = {"data": {"Nombre": "Division Sprint2"}}
resp_div, status_div = request_json("POST", f"{BASE}/divisions", payload_div)
if status_div not in (200, 201):
    raise SystemExit(f"Error creando division: {status_div} - {resp_div}")

division_id = resp_div["data"]["id"]
print(f"Division creada: {division_id}")

# 2) Crear jugadores y asignar a division
jugadores = [
    ("Jugador", "Uno"),
    ("Jugador", "Dos"),
    ("Jugador", "Tres"),
    ("Jugador", "Cuatro"),
]

jugador_ids = []
for idx, (nombre, apellidos) in enumerate(jugadores, start=1):
    payload_jug = {
        "data": {
            "Nombre": nombre,
            "Apellidos": apellidos,
            "Email": f"jugador{idx}@sprint2.local",
            "division": division_id,
        }
    }
    resp_jug, status_jug = request_json("POST", f"{BASE}/jugadors", payload_jug)
    if status_jug not in (200, 201):
        raise SystemExit(f"Error creando jugador {idx}: {status_jug} - {resp_jug}")
    jugador_ids.append(resp_jug["data"]["id"])

print(f"Jugadores creados: {len(jugador_ids)}")

# 3) Generar calendario
resp_gen, status_gen = request_json(
    "POST", f"{BASE}/jornadas/generar-calendario/{division_id}", {}
)
if status_gen not in (200, 201):
    raise SystemExit(f"Error generando calendario: {status_gen} - {resp_gen}")

print("Calendario generado")

# 4) Obtener jornadas y validar
resp_jornadas, status_jornadas = request_json(
    "GET", f"{BASE}/jornadas/division/{division_id}/jornadas"
)
if status_jornadas != 200:
    raise SystemExit(f"Error obteniendo jornadas: {status_jornadas} - {resp_jornadas}")

jornadas = resp_jornadas or []
num_jugadores = len(jugador_ids)
num_jornadas_esperadas = num_jugadores - 1
num_partidos_esperados = num_jugadores * (num_jugadores - 1) // 2

partidos_total = 0
for jornada in jornadas:
    partidos = jornada.get("partidos") or []
    partidos_total += len(partidos)

print(f"Jornadas: {len(jornadas)} (esperado: {num_jornadas_esperadas})")
print(f"Partidos totales: {partidos_total} (esperado: {num_partidos_esperados})")

if len(jornadas) == num_jornadas_esperadas and partidos_total == num_partidos_esperados:
    print("OK: Validacion basica correcta")
else:
    print("ALERTA: Validacion basica incorrecta")

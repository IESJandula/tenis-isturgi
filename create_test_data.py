import requests
import json

base_url = 'http://localhost:1337/api'
headers = {'Content-Type': 'application/json'}

print("=" * 50)

# 1. CREAR DIVISIÓN
print("\n1️⃣  Creando División A...")
div_data = {'data': {'Nombre': 'División A'}}
div_resp = requests.post(f'{base_url}/divisions', json=div_data, headers=headers)

if div_resp.status_code in [200, 201]:
    div_id = div_resp.json()['data']['id']
    print(f"✅ División creada. ID: {div_id}")
else:
    print(f"❌ Error: {div_resp.status_code} - {div_resp.text}")
    exit(1)

# 2. CREAR JUGADORES
print("\n2️⃣  Creando 6 Jugadores...")
jugadores_nombres = [
    ("Juan", "García López"),
    ("Carlos", "Martínez Ruiz"),
    ("Pedro", "López Fernández"),
    ("Miguel", "Rodríguez Santos"),
    ("Antonio", "Jiménez Díaz"),
    ("Luis", "Cortés Vega")
]

jugador_ids = []
for nombre, apellidos in jugadores_nombres:
    jugador_data = {
        'data': {
            'Nombre': nombre,
            'Apellidos': apellidos,
            'Email': f'{nombre.lower()}@ejemplo.com',
            'division': div_id
        }
    }
    jug_resp = requests.post(f'{base_url}/jugadors', json=jugador_data, headers=headers)
    
    if jug_resp.status_code in [200, 201]:
        jug_id = jug_resp.json()['data']['id']
        jugador_ids.append(jug_id)
        print(f"  ✅ {nombre} {apellidos} (ID: {jug_id})")
    else:
        print(f"  ❌ Error creando {nombre}: {jug_resp.status_code}")

# 3. CREAR JORNADA
print(f"\n3️⃣  Creando Jornada...")
jornada_data = {
    'data': {
        'Nombre': 'Jornada 1',
        'numero': 1,
        'division': div_id
    }
}
jornada_resp = requests.post(f'{base_url}/jornadas/jornadas', json=jornada_data, headers=headers)

if jornada_resp.status_code in [200, 201]:
    jornada_id = jornada_resp.json()['data']['id']
    print(f"✅ Jornada creada. ID: {jornada_id}")
else:
    print(f"❌ Error: {jornada_resp.status_code} - {jornada_resp.text}")
    exit(1)

# 4. CREAR PARTIDOS (EMPAREJAMIENTOS)
print(f"\n4️⃣  Creando Partidos (emparejamientos)...")
emparejamientos = [
    (0, 1),  # Juan vs Carlos
    (2, 3),  # Pedro vs Miguel
    (4, 5),  # Antonio vs Luis
]

for i, (idx1, idx2) in enumerate(emparejamientos):
    partido_data = {
        'data': {
            'jornada': jornada_id,
            'jugador1': jugador_ids[idx1],
            'jugador2': jugador_ids[idx2],
            'estado': 'Pendiente',
            'pista': i + 1,
            'hora': f'{10 + i:02d}:00:00.000'
        }
    }
    part_resp = requests.post(f'{base_url}/partidos', json=partido_data, headers=headers)
    
    if part_resp.status_code in [200, 201]:
        part_id = part_resp.json()['data']['id']
        nombre1 = jugadores_nombres[idx1][0]
        nombre2 = jugadores_nombres[idx2][0]
        print(f"  ✅ Partido {i+1}: {nombre1} vs {nombre2} (Pista {i+1}, {10+i}:00)")
    else:
        print(f"  ❌ Error: {part_resp.status_code} - {part_resp.text[:100]}")

print("\n" + "=" * 50)
print("✅ ¡LISTO! Datos creados correctamente")
print("=" * 50)

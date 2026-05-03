#!/usr/bin/env python3
import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:8080"
TOKEN = "Bearer test"
headers = {"Authorization": TOKEN, "Content-Type": "application/json"}

print("=== TESTEO COMPLETO DE API ===")
print(f"Timestamp: {datetime.now()}")
print(f"Base URL: {BASE_URL}\n")

# Test 1: Health check (sin auth)
print("[0/8] Health Check...")
try:
    r = requests.get(f"{BASE_URL}/api/jornadas", timeout=5)
    print(f"Status: {r.status_code}")
    if r.status_code == 200:
        print("OK Servidor respondiendo\n")
    elif r.status_code == 401:
        print("OK Servidor respondiendo (requiere autenticación)\n")
    else:
        print(f"Status code: {r.status_code}\n")
except Exception as e:
    print(f"ERROR conectando: {e}\n")
    exit(1)

# Test 1: Create Temporada
print("[1/8] Creating Temporada...")
try:
    payload = {"nombre": "Temporada 2026", "anio": 2026}
    r = requests.post(f"{BASE_URL}/api/temporadas", json=payload, headers=headers, timeout=10)
    print(f"Status: {r.status_code}")
    if r.status_code in [200, 201]:
        data = r.json()
        season_id = data.get("id")
        print(f"OK Season: {season_id}\n")
    else:
        print(f"Response: {r.text}\n")
        exit(1)
except Exception as e:
    print(f"ERROR: {e}\n")
    exit(1)

# Test 2: Create Division
print("[2/8] Creating Division...")
try:
    payload = {"nombre": "A", "temporada_id": season_id}
    r = requests.post(f"{BASE_URL}/api/divisiones", json=payload, headers=headers, timeout=10)
    print(f"Status: {r.status_code}")
    if r.status_code in [200, 201]:
        data = r.json()
        division_id = data.get("id")
        print(f"OK Division: {division_id}\n")
    else:
        print(f"Response: {r.text}\n")
        exit(1)
except Exception as e:
    print(f"ERROR: {e}\n")
    exit(1)

# Test 3: Create Players
print("[3/8] Creating Players...")
players = []
for i in range(1, 5):
    try:
        payload = {
            "nombre": f"Jugador{i}",
            "apellidos": f"Apellido{i}",
            "email": f"jugador{i}@test.com",
            "nivel": "B",
            "division_id": division_id
        }
        r = requests.post(f"{BASE_URL}/api/jugadores", json=payload, headers=headers, timeout=10)
        if r.status_code in [200, 201]:
            player = r.json()
            players.append(player)
            print(f"OK Jugador{i}: {player.get('id')}")
        else:
            print(f"ERROR Jugador{i}: {r.status_code}")
    except Exception as e:
        print(f"ERROR Jugador{i}: {e}")
print()

# Test 4: Generate Calendar
print("[4/8] Generating Calendar...")
try:
    payload = {"division_id": division_id}
    r = requests.post(f"{BASE_URL}/api/ligas/generar-calendario", json=payload, headers=headers, timeout=10)
    print(f"Status: {r.status_code}")
    if r.status_code in [200, 201]:
        data = r.json()
        journeys = data.get("jornadas", [])
        if journeys:
            journey_id = journeys[0].get("id")
            print(f"OK Calendar generated. Journeys: {len(journeys)}, First: {journey_id}\n")
        else:
            print("OK Calendar generated but no journeys\n")
    else:
        print(f"Response: {r.text}\n")
except Exception as e:
    print(f"ERROR: {e}\n")

# Test 5: List Matches
print("[5/8] Listing Matches...")
try:
    r = requests.get(f"{BASE_URL}/api/partidos", headers=headers, timeout=10)
    print(f"Status: {r.status_code}")
    if r.status_code == 200:
        matches = r.json()
        if isinstance(matches, list):
            print(f"OK Matches found: {len(matches)}")
            if matches:
                match_id = matches[0].get("id")
                print(f"First match: {match_id}\n")
        else:
            print(f"Response type: {type(matches)}\n")
    else:
        print(f"Response: {r.text}\n")
except Exception as e:
    print(f"ERROR: {e}\n")

# Test 6: Save Provisional Result
if 'match_id' in locals() and match_id:
    print("[6/8] Saving Provisional Result...")
    try:
        payload = {
            "sets_favor": 2,
            "sets_contra": 0,
            "juegos_favor": 6,
            "juegos_contra": 4,
            "jugador_que_guardo": players[0].get("id") if players else None
        }
        r = requests.put(f"{BASE_URL}/api/partidos/{match_id}/resultado-provisional", 
                        json=payload, headers=headers, timeout=10)
        print(f"Status: {r.status_code}")
        if r.status_code in [200, 204]:
            print("OK Provisional result saved\n")
        else:
            print(f"Response: {r.text}\n")
    except Exception as e:
        print(f"ERROR: {e}\n")

# Test 7: Confirm Result
if 'match_id' in locals() and match_id:
    print("[7/8] Confirming Result...")
    try:
        r = requests.put(f"{BASE_URL}/api/partidos/{match_id}/resultado-confirmar", 
                        json={}, headers=headers, timeout=10)
        print(f"Status: {r.status_code}")
        if r.status_code in [200, 204]:
            print("OK Result confirmed\n")
        else:
            print(f"Response: {r.text}\n")
    except Exception as e:
        print(f"ERROR: {e}\n")

# Test 8: Test Availability
if 'journey_id' in locals() and players:
    print("[8/8] Testing Availability...")
    try:
        payload = {
            "jugador_id": players[0].get("id"),
            "jornada_id": journey_id,
            "slots": ["08:00", "09:00"]
        }
        r = requests.post(f"{BASE_URL}/api/disponibilidades", json=payload, headers=headers, timeout=10)
        print(f"Status: {r.status_code}")
        if r.status_code in [200, 201]:
            print("OK Availability saved\n")
        else:
            print(f"Response: {r.text}\n")
    except Exception as e:
        print(f"ERROR: {e}\n")

print("=== TESTEO COMPLETADO ===")
print(f"Timestamp: {datetime.now()}")

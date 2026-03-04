import requests
import json
from datetime import datetime, timedelta

base_url = 'http://localhost:1337/api'
headers = {'Content-Type': 'application/json'}

print("=" * 50)

# 1. CREAR NOTICIAS
print("\n1️⃣  Creando Noticias de prueba...")
noticias = [
    {
        "Titulo": "Inscripciones abiertas para la Escuela de Tenis 2025",
        "Descripcion": "Ya están abiertas las inscripciones para la nueva temporada de la escuela de tenis. Clases para todas las edades y niveles. ¡Plazas limitadas!",
        "Fecha": datetime.now().isoformat() + "Z"
    },
    {
        "Titulo": "Resultados del Torneo de Primavera",
        "Descripcion": "Este fin de semana se han disputado las finales del Torneo de Primavera con un gran éxito de participación. Enhorabuena a los ganadores.",
        "Fecha": (datetime.now() - timedelta(days=7)).isoformat() + "Z"
    },
    {
        "Titulo": "Mejoras en las instalaciones del Club",
        "Descripcion": "Durante el próximo mes se llevarán a cabo labores de mantenimiento y mejora en las pistas 3 y 4, así como en la iluminación general del recinto.",
        "Fecha": (datetime.now() - timedelta(days=15)).isoformat() + "Z"
    }
]

for i, noti in enumerate(noticias):
    payload = {'data': noti}
    resp = requests.post(f'{base_url}/noticias', json=payload, headers=headers)
    if resp.status_code in [200, 201]:
        print(f"  ✅ Noticia {i+1} creada: {noti['Titulo']}")
    else:
        print(f"  ❌ Error creando Noticia {i+1}: {resp.status_code} - {resp.text}")

# 2. CREAR TORNEOS
print("\n2️⃣  Creando Torneos de prueba...")
torneos = [
    {
        "Nombre": "Liga Local de Tenis 2025",
        "Edicion": 5,
        "Categoria": "Liga",
        "Estado": "En curso",
        "FechaInicio": datetime.now().strftime("%Y-%m-%d"),
        "FechaFin": (datetime.now() + timedelta(days=90)).strftime("%Y-%m-%d"),
        "Descripcion_breve": "La liga anual del club para todos los niveles.",
        "Modalidad": "Tierra batida",
        "TipoParticipacion": "Individual",
        "NivelRequerido": "Todas las categorías",
        "Destacado": True,
        "Puntuable": True
    },
    {
        "Nombre": "Torneo de Verano Nocturno",
        "Edicion": 2,
        "Categoria": "Torneo",
        "Estado": "Próximamente",
        "FechaInicio": (datetime.now() + timedelta(days=60)).strftime("%Y-%m-%d"),
        "FechaFin": (datetime.now() + timedelta(days=65)).strftime("%Y-%m-%d"),
        "Descripcion_breve": "Disfruta del tenis en las noches de verano.",
        "Modalidad": "Pista rápida",
        "TipoParticipacion": "Dobles",
        "NivelRequerido": "Intermedio"
    },
    {
        "Nombre": "MasterClass con Profesional",
        "Edicion": 1,
        "Categoria": "Evento especial",
        "Estado": "Próximamente",
        "FechaInicio": (datetime.now() + timedelta(days=30)).strftime("%Y-%m-%d"),
        "FechaFin": (datetime.now() + timedelta(days=30)).strftime("%Y-%m-%d"),
        "Descripcion_breve": "Clase magistral impartida por un jugador del circuito ATP.",
        "NivelRequerido": "Avanzado",
        "Participantes": 20
    }
]

for i, tor in enumerate(torneos):
    payload = {'data': tor}
    resp = requests.post(f'{base_url}/torneos', json=payload, headers=headers)
    if resp.status_code in [200, 201]:
        print(f"  ✅ Torneo {i+1} creado: {tor['Nombre']}")
    else:
        print(f"  ❌ Error creando Torneo {i+1}: {resp.status_code} - {resp.text}")

print("\n" + "=" * 50)
print("✅ ¡LISTO! Datos falsos creados correctamente")
print("=" * 50)

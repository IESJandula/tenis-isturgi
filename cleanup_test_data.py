import json
import urllib.request

BASE = "http://localhost:1337/api"
HEADERS = {"Content-Type": "application/json"}


def fetch_all(endpoint):
    items = []
    page = 1
    page_size = 100
    while True:
        url = f"{BASE}/{endpoint}?pagination[page]={page}&pagination[pageSize]={page_size}"
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req) as resp:
            data = json.load(resp)
        batch = data.get("data") or []
        items.extend(batch)
        meta = data.get("meta", {}).get("pagination", {})
        if not meta or page >= meta.get("pageCount", 1):
            break
        page += 1
    return items


def delete_item(endpoint, item_id):
    url = f"{BASE}/{endpoint}/{item_id}"
    req = urllib.request.Request(url, headers=HEADERS, method="DELETE")
    with urllib.request.urlopen(req) as resp:
        return resp.status


order = [
    ("partidos", "partidos"),
    ("jornadas", "jornadas/jornadas"),
    ("jugadores", "jugadors"),
    ("divisiones", "divisions"),
]

for label, endpoint in order:
    items = fetch_all(endpoint)
    print(f"{label}: encontrados {len(items)}")
    deleted = 0
    for item in items:
        status = delete_item(endpoint, item.get("id"))
        if status in (200, 204):
            deleted += 1
    print(f"{label}: eliminados {deleted}")

print("Limpieza completa")

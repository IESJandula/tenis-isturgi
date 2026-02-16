import json
import urllib.request

BASE = "http://localhost:1337/api"
HEADERS = {"Content-Type": "application/json"}


def request_json(method, url, payload=None):
    data = None
    if payload is not None:
        data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers=HEADERS, method=method)
    with urllib.request.urlopen(req) as resp:
        return json.load(resp), resp.status


def delete_all(endpoint):
    page = 1
    while True:
        url = f"{BASE}/{endpoint}?pagination[page]={page}&pagination[pageSize]=100"
        resp, _ = request_json("GET", url)
        items = resp.get("data") or []
        for item in items:
            request_json("DELETE", f"{BASE}/{endpoint}/{item['id']}")
        meta = resp.get("meta", {}).get("pagination", {})
        if page >= meta.get("pageCount", 1):
            break
        page += 1


def cleanup_validation_data():
    # orden inverso de dependencias
    delete_all("partidos")
    delete_all("jornadas/jornadas")
    delete_all("jugadors")
    delete_all("divisions")


print("Limpieza validacion: iniciada")
cleanup_validation_data()
print("Limpieza validacion: ok")

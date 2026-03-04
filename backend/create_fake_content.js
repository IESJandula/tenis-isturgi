const url = 'http://localhost:1337/api';
const headers = { 'Content-Type': 'application/json' };

const noticias = [
    {
        "Titulo": "Inscripciones abiertas para la Escuela de Tenis 2025",
        "Descripcion": "Ya están abiertas las inscripciones para la nueva temporada de la escuela de tenis. Clases para todas las edades y niveles. ¡Plazas limitadas!",
        "Fecha": new Date().toISOString()
    },
    {
        "Titulo": "Resultados del Torneo de Primavera",
        "Descripcion": "Este fin de semana se han disputado las finales del Torneo de Primavera con un gran éxito de participación. Enhorabuena a los ganadores.",
        "Fecha": new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        "Titulo": "Mejoras en las instalaciones del Club",
        "Descripcion": "Durante el próximo mes se llevarán a cabo labores de mantenimiento y mejora en las pistas 3 y 4, así como en la iluminación general del recinto.",
        "Fecha": new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
    }
];

const torneos = [
    {
        "Nombre": "Liga Local de Tenis 2025",
        "Edicion": 5,
        "Categoria": "Liga",
        "Estado": "En curso",
        "FechaInicio": new Date().toISOString().split('T')[0],
        "FechaFin": new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        "Descripcion_breve": "La liga anual del club para todos los niveles.",
        "TipoParticipacion": "Individual",
        "NivelRequerido": "Todas las categorías",
        "Destacado": true,
        "Puntuable": true
    },
    {
        "Nombre": "Torneo de Verano Nocturno",
        "Edicion": 2,
        "Categoria": "Torneo",
        "Estado": "Próximamente",
        "FechaInicio": new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        "FechaFin": new Date(Date.now() + 65 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        "Descripcion_breve": "Disfruta del tenis en las noches de verano.",
        "TipoParticipacion": "Dobles",
        "NivelRequerido": "Intermedio"
    },
    {
        "Nombre": "MasterClass con Profesional",
        "Edicion": 1,
        "Categoria": "Evento especial",
        "Estado": "Próximamente",
        "FechaInicio": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        "FechaFin": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        "Descripcion_breve": "Clase magistral impartida por un jugador del circuito ATP.",
        "NivelRequerido": "Avanzado",
        "Participantes": 20
    }
];

async function createData() {
    console.log("=".repeat(50));
    console.log("\\n1️⃣  Creando Noticias de prueba...");

    for (let i = 0; i < noticias.length; i++) {
        try {
            const res = await fetch(`${url}/noticias`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ data: noticias[i] })
            });
            const json = await res.json();
            if (res.ok) {
                console.log(`  ✅ Noticia ${i + 1} creada: ${noticias[i].Titulo}`);
            } else {
                console.log(`  ❌ Error creando Noticia ${i + 1}: ${res.status} - ${JSON.stringify(json)}`);
            }
        } catch (e) {
            console.error(`  ❌ Error de red con Noticia ${i + 1}:`, e.message);
        }
    }

    console.log("\\n2️⃣  Creando Torneos de prueba...");

    for (let i = 0; i < torneos.length; i++) {
        try {
            const res = await fetch(`${url}/torneos`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ data: torneos[i] })
            });
            const json = await res.json();
            if (res.ok) {
                console.log(`  ✅ Torneo ${i + 1} creado: ${torneos[i].Nombre}`);
            } else {
                console.log(`  ❌ Error creando Torneo ${i + 1}: ${res.status} - ${JSON.stringify(json)}`);
            }
        } catch (e) {
            console.error(`  ❌ Error de red con Torneo ${i + 1}:`, e.message);
        }
    }

    console.log("\\n" + "=".repeat(50));
    console.log("✅ ¡LISTO! Datos falsos creados correctamente");
    console.log("=".repeat(50));
}

createData();

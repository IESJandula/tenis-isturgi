const axios = require('axios');

async function verify() {
    const API = 'http://localhost:1337/api';
    try {
        console.log('--- Verificando Sprint 4 ---');

        // 1. Buscar un partido programado
        const resPartidos = await axios.get(`${API}/partidos?filters[estado][$eq]=Programado&populate=*`);
        const partido = resPartidos.data.data?.[0];

        if (!partido) {
            console.log('No se encontró ningún partido programado para probar.');
            return;
        }

        console.log(`Probando con Partido: ${partido.documentId} (${partido.jugador1?.Nombre} vs ${partido.jugador2?.Nombre})`);

        // 2. Enviar resultado
        const resultado = "6-2, 6-4";
        console.log(`Enviando resultado: ${resultado}`);

        await axios.put(`${API}/partidos/${partido.documentId}`, {
            data: {
                resultado: resultado,
                estado: 'Jugado'
            }
        });

        console.log('Resultado enviado correctamente.');

        // 3. Esperar un poco a que el lifecycle termine y consultar clasificación
        console.log('Esperando actualización de clasificación...');
        await new Promise(r => setTimeout(r, 2000));

        const resClas = await axios.get(`${API}/clasificacions?populate=*`);
        console.log('Registros en Clasificación:', resClas.data.data.length);

        resClas.data.data.forEach(c => {
            console.log(`Jugador: ${c.jugador?.Nombre} - Puntos: ${c.puntos}, Jugados: ${c.jugados}, Won: ${c.ganados}, Sets: ${c.setsFavor}/${c.setsContra}`);
        });

    } catch (e) {
        console.error('Error en verificación:', e.response?.data || e.message);
    }
}

verify();

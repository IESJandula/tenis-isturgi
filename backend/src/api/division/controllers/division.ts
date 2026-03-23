/**
 * division controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::division.division', ({ strapi }) => ({
    async generarCalendario(ctx) {
        try {
            const { id } = ctx.params;

            const dbDivision = await strapi.documents('api::division.division').findOne({
                documentId: id,
                populate: ['jugadors']
            });

            console.log('Buscando division con ID:', id);

            if (!dbDivision) {
                console.log('No se encontro. id era:', id);
                return ctx.notFound('División no encontrada');
            }

            const jugadores = dbDivision.jugadors || [];
            if (jugadores.length < 2) {
                return ctx.badRequest('Se necesitan al menos 2 jugadores para generar un calendario');
            }

            let players = [...jugadores];
            const hasDummy = players.length % 2 !== 0;
            if (hasDummy) {
                players.push({ id: null, Nombre: 'Descansa', documentId: null });
            }

            const numPlayers = players.length;
            const numRounds = numPlayers - 1;
            const matchesPerRound = numPlayers / 2;

            let countJornadas = 0;
            let countPartidos = 0;

            for (let round = 0; round < numRounds; round++) {
                // Create Jornada
                const jornadaData = {
                    Nombre: `Jornada ${round + 1} - ${dbDivision.Nombre}`,
                    numero: round + 1,
                    division: dbDivision.documentId
                };

                const jornada = await strapi.documents('api::jornada.jornada').create({
                    data: jornadaData,
                    status: 'published'
                });
                countJornadas++;

                // Create Matches
                for (let match = 0; match < matchesPerRound; match++) {
                    const home = players[match];
                    const away = players[numPlayers - 1 - match];

                    if (home.id === null || away.id === null) {
                        continue; // Skip match (Bye)
                    }

                    let p1 = home;
                    let p2 = away;
                    if (match === 0 && round % 2 === 1) {
                        p1 = away; // Alternate home/away for fixed player
                        p2 = home;
                    }

                    await strapi.documents('api::partido.partido').create({
                        data: {
                            jornada: jornada.documentId,
                            jugador1: p1.documentId,
                            jugador2: p2.documentId,
                            estado: 'Pendiente'
                        },
                        status: 'published'
                    });
                    countPartidos++;
                }

                // Rotate players (Berger)
                const lastPlayer = players.pop();
                players.splice(1, 0, lastPlayer);
            }

            return ctx.send({
                message: 'Calendario generado exitosamente',
                jornadas: countJornadas,
                partidos: countPartidos
            });
        } catch (err) {
            console.error('Error en generarCalendario:', err);
            return ctx.internalServerError('Error al generar calendario');
        }
    }
}));

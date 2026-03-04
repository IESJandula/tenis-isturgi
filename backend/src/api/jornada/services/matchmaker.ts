/**
 * Custom service for Matchmaking logic
 */

const SLOTS = [
    { dia: 'viernes', hora: '16:00' },
    { dia: 'viernes', hora: '18:00' },
    { dia: 'sabado', hora: '09:00' },
    { dia: 'sabado', hora: '11:00' },
    { dia: 'sabado', hora: '16:00' },
    { dia: 'sabado', hora: '18:00' },
    { dia: 'domingo', hora: '09:00' },
    { dia: 'domingo', hora: '11:00' },
    { dia: 'domingo', hora: '16:00' },
    { dia: 'domingo', hora: '18:00' },
];

const PISTAS_POR_SLOT = 3;

export default ({ strapi }) => ({
    /**
     * Generates schedule for a given Jornada ID
     */
    async generarHorarios(jornadaId) {
        const fs = require('fs');
        const path = require('path');
        const logPath = path.join(process.cwd(), 'matchmaker.log');
        const log = (msg) => {
            strapi.log.info(`[MATCHMAKER] ${msg}`);
            fs.appendFileSync(logPath, `[${new Date().toISOString()}] ${msg}\n`);
        };

        log(`--- Matchmaking Jornada: ${jornadaId}`);
        // En Strapi v5, el jornadaId que viene del controlador suele ser el documentId

        // 1. Obtener todos los partidos de la jornada
        const { data: partidos } = await strapi.documents('api::partido.partido').findMany({
            filters: {
                jornada: {
                    documentId: { $eq: jornadaId }
                }
            },
            populate: ['jugador1', 'jugador2'],
            status: 'published'
        });
        log(`Partidos encontrados: ${partidos?.length || 0}`);

        // 2. Obtener todas las disponibilidades de esa jornada
        const { data: disponibilidades } = await strapi.documents('api::disponibilidad.disponibilidad').findMany({
            filters: {
                jornada: {
                    documentId: { $eq: jornadaId }
                }
            },
            populate: ['jugador']
            // No ponemos status: published porque disponibilidad no tiene draftAndPublish
        });
        log(`Disponibilidades encontradas: ${disponibilidades?.length || 0}`);

        const ocupacionSlots = SLOTS.map(() => 0);
        const resultados = [];

        for (const partido of partidos) {
            log(`Procesando Partido ID: ${partido.id}`);
            const j1Id = partido.jugador1?.documentId;
            const j2Id = partido.jugador2?.documentId;
            log(`Jugadores: ${j1Id} vs ${j2Id}`);

            if (!j1Id || !j2Id) {
                log(`Falta algún jugador en el partido ${partido.id}`);
                continue;
            }

            const disp1 = disponibilidades.find(d => d.jugador?.documentId === j1Id);
            const disp2 = disponibilidades.find(d => d.jugador?.documentId === j2Id);
            log(`Disp1: ${!!disp1}, Disp2: ${!!disp2}`);

            let slotEncontrado = false;

            if (disp1 && disp2) {
                for (let i = 0; i < SLOTS.length; i++) {
                    const slot = SLOTS[i];
                    const puedeJ1 = disp1.slots?.[slot.dia]?.[slot.hora];
                    const puedeJ2 = disp2.slots?.[slot.dia]?.[slot.hora];
                    const hayPista = ocupacionSlots[i] < PISTAS_POR_SLOT;

                    if (puedeJ1 && puedeJ2 && hayPista) {
                        ocupacionSlots[i]++;
                        // Actualizar partido en DB v5
                        await strapi.documents('api::partido.partido').update({
                            documentId: partido.documentId,
                            data: {
                                estado: 'Programado',
                                pista: ocupacionSlots[i],
                                hora: `${slot.hora}:00`,
                                fecha: this.getFechaSlot(slot.dia, jornadaId),
                            },
                            status: 'published'
                        });
                        slotEncontrado = true;
                        resultados.push(`Partido ${partido.id} programado: ${slot.dia} ${slot.hora}`);
                        break;
                    }
                }
            }

            if (!slotEncontrado) {
                await strapi.documents('api::partido.partido').update({
                    documentId: partido.documentId,
                    data: { estado: 'Aplazado' },
                    status: 'published'
                });
                resultados.push(`Partido ${partido.id} aplazado por falta de coincidencia.`);
            }
        }

        return resultados;
    },

    // Función auxiliar para calcular la fecha real basada en la jornada (Placeholder por ahora)
    getFechaSlot(dia, jornadaId) {
        // En una implementación real, calcularíamos el viernes/sábado/domingo del fin de semana de la jornada
        return new Date().toISOString().split('T')[0];
    }
});

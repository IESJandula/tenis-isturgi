import type { Core } from '@strapi/strapi';

export default {
    async afterUpdate(event: any) {
        const { result } = event;
        strapi.log.info(`[LIFECYCLE] --- afterUpdate START (ID: ${result.id}) ---`);

        try {
            // 1. Auto-publicar si pasa a 'Jugado'
            if (result.estado === 'Jugado' && result.publishedAt === null) {
                strapi.log.info(`[LIFECYCLE] Detectado draft en 'Jugado'. Auto-publicando...`);
                // En v5 la acción de publicar es preferible hacerla via document service
                await strapi.documents('api::partido.partido' as any).publish({
                    documentId: result.documentId,
                });
                strapi.log.info(`[LIFECYCLE] Publicación solicitada para ${result.documentId}`);
                // Tras publicar, el 'result' actual sigue siendo el mismo, pero el registro en DB ya está publicado.
            }
        } catch (pubErr) {
            strapi.log.error(`[LIFECYCLE] Error en auto-publish: ${pubErr.message}`);
        }

        // 2. Actualizar Clasificación
        if (result.estado === 'Jugado' && result.resultado) {
            strapi.log.info(`[LIFECYCLE] Actualizando clasificación para resultado: ${result.resultado}`);

            try {
                // Buscamos el partido completo. La división está en la Jornada.
                const p: any = await strapi.db.query('api::partido.partido').findOne({
                    where: { id: result.id },
                    populate: {
                        jugador1: true,
                        jugador2: true,
                        jornada: {
                            populate: {
                                division: true
                            }
                        }
                    }
                });

                if (!p || !p.jornada?.division || !p.jugador1 || !p.jugador2) {
                    strapi.log.warn('[LIFECYCLE] Faltan datos (Jornada->División o Jugadores). Abortando.');
                    strapi.log.info(`[LIFECYCLE] Debug: Jornada: ${!!p?.jornada}, Div: ${!!p?.jornada?.division}, J1: ${!!p?.jugador1}, J2: ${!!p?.jugador2}`);
                    return;
                }

                const divisionId = p.jornada.division.id;
                strapi.log.info(`[LIFECYCLE] Procesando para División ID: ${divisionId}`);

                const sets = (p.resultado as string).split(',').map(s => s.trim());
                let p1S = 0; let p2S = 0;
                let p1J = 0; let p2J = 0;

                sets.forEach(setStr => {
                    const parts = setStr.split('-').map(g => parseInt(g));
                    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
                        if (parts[0] > parts[1]) p1S++;
                        else if (parts[1] > parts[0]) p2S++;
                        p1J += parts[0];
                        p2J += parts[1];
                    }
                });

                const stats = [
                    { id: p.jugador1.id, sF: p1S, sC: p2S, jF: p1J, jC: p2J, g: p1S > p2S ? 1 : 0, pts: p1S > p2S ? 3 : 1 },
                    { id: p.jugador2.id, sF: p2S, sC: p1S, jF: p2J, jC: p1J, g: p2S > p1S ? 1 : 0, pts: p2S > p1S ? 3 : 1 }
                ];

                for (const s of stats) {
                    strapi.log.info(`[LIFECYCLE] Jugador ${s.id}: Pts ${s.pts}, Sets ${s.sF}-${s.sC}, Juegos ${s.jF}-${s.jC}`);

                    const existing = await strapi.db.query('api::clasificacion.clasificacion').findOne({
                        where: {
                            jugador: s.id,
                            division: divisionId
                        }
                    });

                    if (existing) {
                        strapi.log.info(`[LIFECYCLE] Actualizando clasificación existente ID ${existing.id}`);
                        await strapi.db.query('api::clasificacion.clasificacion').update({
                            where: { id: existing.id },
                            data: {
                                puntos: (existing.puntos || 0) + s.pts,
                                jugados: (existing.jugados || 0) + 1,
                                ganados: (existing.ganados || 0) + s.g,
                                perdidos: (existing.perdidos || 0) + (1 - s.g),
                                setsFavor: (existing.setsFavor || 0) + s.sF,
                                setsContra: (existing.setsContra || 0) + s.sC,
                                juegosFavor: (existing.juegosFavor || 0) + s.jF,
                                juegosContra: (existing.juegosContra || 0) + s.jC,
                            }
                        });
                    } else {
                        strapi.log.info(`[LIFECYCLE] Creando nueva clasificación para jugador ${s.id}`);
                        await strapi.db.query('api::clasificacion.clasificacion').create({
                            data: {
                                jugador: s.id,
                                division: divisionId,
                                puntos: s.pts,
                                jugados: 1,
                                ganados: s.g,
                                perdidos: 1 - s.g,
                                setsFavor: s.sF,
                                setsContra: s.sC,
                                juegosFavor: s.jF,
                                juegosContra: s.jC,
                            }
                        });
                    }
                }
                strapi.log.info('[LIFECYCLE] Clasificación actualizada con éxito.');
            } catch (claErr) {
                strapi.log.error(`[LIFECYCLE] Error en lógica de clasificación: ${claErr.message}`);
            }
        }
        strapi.log.info(`[LIFECYCLE] --- afterUpdate END ---`);
    }
};

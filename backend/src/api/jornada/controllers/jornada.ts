/**
 * Custom controller for Jornada actions
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::jornada.jornada', ({ strapi }) => ({
  async schedule(ctx) {
    const { id } = ctx.params;

    try {
      strapi.log.info(`[CONTROLLER] Ejecutando schedule para jornada: ${id}`);
      // @ts-ignore
      const service = strapi.service('api::jornada.jornada');
      strapi.log.info(`[CONTROLLER] Cargado servicio Jornada: ${!!service}`);

      const results = await service.generarHorarios(id);
      strapi.log.info(`[CONTROLLER] Resultados obtenidos: ${JSON.stringify(results)}`);
      ctx.body = { data: results };
    } catch (err) {
      strapi.log.error(`[CONTROLLER] Error en schedule: ${err.message}`);
      ctx.body = err;
    }
  },

  async obtenerJornadasPorDivision(ctx) {
    const { divisionId: rawDivisionId } = ctx.params;
    try {
      // Intentar buscar por documentId o por ID numérico
      const filter = isNaN(parseInt(rawDivisionId))
        ? { division: { documentId: rawDivisionId } }
        : { division: { id: parseInt(rawDivisionId) } };

      const jornadas = await strapi.documents('api::jornada.jornada').findMany({
        filters: filter,
        populate: {
          partidos: {
            populate: ['jugador1', 'jugador2'],
          },
        },
        sort: 'numero:asc',
        status: 'published',
      });

      // Asegurar que los partidos sean únicos por documentId (fix Strapi v5 duplicates)
      const jornadasUnicas = jornadas.map(j => {
        const partidosMap = new Map();
        if (j.partidos) {
          j.partidos.forEach((p: any) => {
            if (!partidosMap.has(p.documentId)) {
              partidosMap.set(p.documentId, p);
            }
          });
        }
        return {
          ...j,
          partidos: Array.from(partidosMap.values())
        };
      });

      ctx.body = jornadasUnicas;
    } catch (err) {
      strapi.log.error(`[CONTROLLER] Error en obtenerJornadasPorDivision: ${err.message}`);
      ctx.body = err;
    }
  },

  async obtenerPartidosPorJornada(ctx) {
    const { jornadaId } = ctx.params;
    try {
      const filter = isNaN(parseInt(jornadaId))
        ? { jornada: { documentId: jornadaId } }
        : { jornada: { id: parseInt(jornadaId) } };

      const partidos = await strapi.documents('api::partido.partido').findMany({
        filters: filter,
        populate: ['jugador1', 'jugador2'],
        status: 'published',
      });
      ctx.body = partidos;
    } catch (err) {
      strapi.log.error(`[CONTROLLER] Error en obtenerPartidosPorJornada: ${err.message}`);
      ctx.body = err;
    }
  },

  async generarCalendario(ctx) {
    const { divisionId } = ctx.params;
    try {
      // @ts-ignore
      const service = strapi.service('api::jornada.jornada');
      const results = await service.generarCalenarioParaDivision(parseInt(divisionId));
      ctx.body = results;
    } catch (err) {
      ctx.body = err;
    }
  },
}));

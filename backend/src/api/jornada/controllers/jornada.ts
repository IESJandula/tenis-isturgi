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
    const { divisionId } = ctx.params;
    try {
      const jornadas = await strapi.db.query('api::jornada.jornada').findMany({
        where: { division: divisionId },
        populate: {
          partidos: {
            populate: {
              jugador1: true,
              jugador2: true,
            },
          },
        },
        orderBy: { numero: 'asc' },
      });
      ctx.body = jornadas;
    } catch (err) {
      ctx.body = err;
    }
  },

  async obtenerPartidosPorJornada(ctx) {
    const { jornadaId } = ctx.params;
    try {
      const partidos = await strapi.db.query('api::partido.partido').findMany({
        where: { jornada: jornadaId },
        populate: ['jugador1', 'jugador2'],
      });
      ctx.body = partidos;
    } catch (err) {
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

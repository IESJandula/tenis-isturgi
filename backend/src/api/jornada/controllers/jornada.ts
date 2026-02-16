/**
 * jornada controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::jornada.jornada', ({ strapi }) => ({
  /**
   * Endpoint: POST /api/jornadas/generar-calendario/:divisionId
   * Genera automáticamente todas las jornadas y partidos para una división
   */
  async generarCalendario(ctx) {
    try {
      const { divisionId } = ctx.params;

      if (!divisionId) {
        return ctx.badRequest('divisionId es requerido');
      }

      const result = await strapi
        .service('api::jornada.jornada')
        .generarCalenarioParaDivision(parseInt(divisionId));

      ctx.body = result;
    } catch (error: any) {
      ctx.throw(400, error.message);
    }
  },

  /**
    * Endpoint: GET /api/jornadas/division/:divisionId/jornadas
   * Obtiene todas las jornadas de una división con sus partidos
   */
  async obtenerJornadasPorDivision(ctx) {
    try {
      const { divisionId } = ctx.params;

      const jornadas = await strapi.db.query('api::jornada.jornada').findMany({
        where: {
          division: divisionId,
          publishedAt: { $notNull: true },
        },
        populate: {
          partidos: {
            where: {
              publishedAt: { $notNull: true },
            },
            populate: {
              jugador1: {
                where: { publishedAt: { $notNull: true } },
              },
              jugador2: {
                where: { publishedAt: { $notNull: true } },
              },
              ganador: {
                where: { publishedAt: { $notNull: true } },
              },
            },
          },
        },
        orderBy: { numero: 'asc' },
      });

      ctx.body = jornadas;
    } catch (error: any) {
      ctx.throw(400, error.message);
    }
  },

  /**
   * Endpoint: GET /api/jornadas/:jornadaId/partidos
   * Obtiene todos los partidos de una jornada específica
   */
  async obtenerPartidosPorJornada(ctx) {
    try {
      const { jornadaId } = ctx.params;

      const partidos = await strapi.db.query('api::partido.partido').findMany({
        where: {
          jornada: jornadaId,
          publishedAt: { $notNull: true },
        },
        populate: {
          jugador1: {
            where: { publishedAt: { $notNull: true } },
          },
          jugador2: {
            where: { publishedAt: { $notNull: true } },
          },
          ganador: {
            where: { publishedAt: { $notNull: true } },
          },
        },
      });

      ctx.body = partidos;
    } catch (error: any) {
      ctx.throw(400, error.message);
    }
  },
}));

/**
 * Custom routes for Sprint 2
 */

export default {
  routes: [
    {
      method: 'POST',
      path: '/jornadas/generar-calendario/:divisionId',
      handler: 'api::jornada.jornada.generarCalendario',
      config: {
        auth: {
          scope: [],
        },
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/jornadas/division/:divisionId/jornadas',
      handler: 'api::jornada.jornada.obtenerJornadasPorDivision',
      config: {
        auth: false,
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/jornadas/:jornadaId/partidos',
      handler: 'api::jornada.jornada.obtenerPartidosPorJornada',
      config: {
        auth: false,
        policies: [],
      },
    },
  ],
};

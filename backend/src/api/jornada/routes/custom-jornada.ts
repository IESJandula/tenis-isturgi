/**
 * Custom routes for Jornada
 */

export default {
  routes: [
    {
      method: 'POST',
      path: '/jornadas/:id/schedule',
      handler: 'api::jornada.jornada.schedule',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/jornadas/division/:divisionId/jornadas',
      handler: 'api::jornada.jornada.obtenerJornadasPorDivision',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/jornadas/:jornadaId/partidos',
      handler: 'api::jornada.jornada.obtenerPartidosPorJornada',
      config: {
        auth: false,
      },
    },
  ],
};

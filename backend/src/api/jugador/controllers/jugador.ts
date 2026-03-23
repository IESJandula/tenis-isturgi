import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::jugador.jugador', ({ strapi }) => ({
  async getMe(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized('Debe estar autenticado');
    }

    try {
      // Método definitivo a prueba de fallos para Strapi v5 relations
      // Cargar todos los jugadores con su relación 'user' y filtrar en memoria.
      const todosLosJugadores = await strapi.documents('api::jugador.jugador').findMany({
        populate: ['user', 'division']
      });

      const result = todosLosJugadores.find(j => j.user && j.user.id === user.id);

      if (!result) {
        return ctx.notFound('No se encontró un perfil de jugador para este usuario (ID: ' + user.id + ')');
      }

      return { data: result };
    } catch (err) {
      ctx.throw(500, err);
    }
  }
}));

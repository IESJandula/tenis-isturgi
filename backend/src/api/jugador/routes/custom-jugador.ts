export default {
  routes: [
    {
      method: 'GET',
      path: '/jugadors/me',
      handler: 'api::jugador.jugador.getMe',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};

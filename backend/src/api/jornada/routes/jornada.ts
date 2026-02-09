/**
 * jornada router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::jornada.jornada', {
  only: ['find', 'findOne', 'create', 'update', 'delete'],
  config: {
    find: {
      auth: false,
    },
    findOne: {
      auth: false,
    },
  },
  prefix: '/jornadas',
  type: 'content-api',
});

// import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) { },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    try {
      const noticiasCount = await strapi.documents('api::noticia.noticia').count();
      if (noticiasCount < 4) {
        console.log('Seeding real noticias...');
        const realNoticias = [
          {
            Titulo: "Apertura de Inscripciones XXI Liga Municipal Tenis",
            Descripcion: "Nuevas inscripciones para la temporada 2026 de la Liga Municipal. Cuota fijada en 15,68€ por jugador/a. Inscríbete en la App Sporttia.",
            Fecha: "2026-01-16T10:00:00.000Z"
          },
          {
            Titulo: "Horarios y Orden de Juego: Segunda Jornada (Marzo 2026)",
            Descripcion: "Publicados los horarios de los partidos previstos para el fin de semana del 6 al 8 de marzo correspondiente a la Jornada 2 de la Liga Municipal.",
            Fecha: "2026-03-01T10:00:00.000Z"
          },
          {
            Titulo: "Nuevo curso Escuela Municipal de Tenis",
            Descripcion: "Apertura de plazas para el curso escolar 2025/2026 de nuestra escuela de tenis base. Entrenamientos orientados a todas las edades.",
            Fecha: "2025-09-01T10:00:00.000Z"
          },
          {
            Titulo: "Ranking del Club Actualizado",
            Descripcion: "Ya puedes consultar las últimas variaciones del ranking de socios, decisivo para el Master final a final de temporada.",
            Fecha: "2025-12-01T10:00:00.000Z"
          }
        ];

        for (const n of realNoticias) {
          await strapi.documents('api::noticia.noticia').create({
            data: n,
            status: 'published'
          });
        }
        console.log('Noticias reales creadas correctamente.');
      }

      const torneosCount = await strapi.documents('api::torneo.torneo').count();
      if (torneosCount < 4) {
        console.log('Seeding real torneos...');
        const realTorneos = [
          {
            Nombre: "XXI Liga Municipal de Tenis 2026",
            Edicion: 21,
            Categoria: "Liga",
            Estado: "En curso",
            FechaInicio: "2026-01-16",
            FechaFin: "2026-03-31",
            Descripcion_breve: "Competición anual municipal dividida en 4 divisiones.",
            TipoParticipacion: "Individual",
            NivelRequerido: "Todas las categorías",
            Destacado: true,
            Puntuable: true
          },
          {
            Nombre: "VIII Torneo Social 16 Puntos",
            Edicion: 8,
            Categoria: "Torneo",
            Estado: "Finalizado",
            FechaInicio: "2026-01-24",
            FechaFin: "2026-01-25",
            Descripcion_breve: "Torneo social exclusivo para socios. Otorga 16 puntos para el ranking.",
            TipoParticipacion: "Individual",
            NivelRequerido: "Todas las categorías",
            Puntuable: true
          },
          {
            Nombre: "XI Torneo Arques & Torres Asesores",
            Edicion: 11,
            Categoria: "Torneo",
            Estado: "Finalizado",
            FechaInicio: "2025-11-07",
            FechaFin: "2025-11-09",
            Descripcion_breve: "Torneo patrocinado con premios en material y puntos de ranking.",
            TipoParticipacion: "Individual",
            NivelRequerido: "Todas las categorías",
            Puntuable: true
          },
          {
            Nombre: "XXXII Torneo de Tenis Feria de Andújar",
            Edicion: 32,
            Categoria: "Torneo",
            Estado: "Finalizado",
            FechaInicio: "2025-09-12",
            FechaFin: "2025-09-28",
            Descripcion_breve: "Torneo de prestigio para la Feria de Andújar con categorías de Veteranos y Absoluto.",
            TipoParticipacion: "Individual",
            NivelRequerido: "Todas las categorías"
          }
        ];

        for (const t of realTorneos) {
          await strapi.documents('api::torneo.torneo').create({
            data: t,
            status: 'published'
          });
        }
        console.log('Torneos reales creados correctamente.');
      }

    } catch (e) {
      console.error("Error seeding initial data:", e);
    }
  },
};

/**
 * Servicio de Jornada con algoritmo Berger para generar calendario
 */

import { factories } from '@strapi/strapi';

interface Jugador {
  id: number;
  username: string;
}

interface Enfrentamiento {
  jugador1_id: number;
  jugador2_id: number;
}

export default factories.createCoreService('api::jornada.jornada', ({ strapi }) => ({
  /**
   * Algoritmo Berger para generar todos contra todos
   * @param jugadores Array de jugadores ordenados
   * @returns Array de jornadas, cada jornada contiene los enfrentamientos
   */
  generarCalendarioRoundRobin(jugadores: Jugador[]): Enfrentamiento[][] {
    const n = jugadores.length;
    const esImpar = n % 2 === 1;
    const numJugadoresAlineados = esImpar ? n + 1 : n;
    const numJornadas = numJugadoresAlineados - 1;
    const numPartidosPorJornada = Math.floor(numJugadoresAlineados / 2);

    // Crear lista de posiciones (si es impar, añadimos un -1 para representar "descanso")
    const posiciones: number[] = [];
    for (let i = 0; i < n; i++) {
      posiciones.push(i);
    }
    if (esImpar) {
      posiciones.push(-1); // -1 representa descanso
    }

    // Estructura para guardar todas las jornadas
    const jornadas: Enfrentamiento[][] = [];

    // Algoritmo Berger: rotación circular
    for (let jornada = 0; jornada < numJornadas; jornada++) {
      const enfrentamientos: Enfrentamiento[] = [];

      // En cada jornada, emparejamos posiciones opuestas
      for (let i = 0; i < numPartidosPorJornada; i++) {
        const pos1 = posiciones[i];
        const pos2 = posiciones[numJugadoresAlineados - 1 - i];

        // Solo crear enfrentamiento si ninguno es descanso (-1)
        if (pos1 !== -1 && pos2 !== -1) {
          enfrentamientos.push({
            jugador1_id: jugadores[pos1].id,
            jugador2_id: jugadores[pos2].id,
          });
        }
      }

      jornadas.push(enfrentamientos);

      // Rotación: mantenemos el primer elemento fijo y rotamos el resto
      if (jornada < numJornadas - 1) {
        const primero = posiciones[0];
        for (let i = 0; i < numJugadoresAlineados - 1; i++) {
          posiciones[i] = posiciones[i + 1];
        }
        posiciones[numJugadoresAlineados - 1] = primero;
      }
    }

    return jornadas;
  },

  /**
   * Generar calendario para una división
   * @param divisionId ID de la división
   */
  async generarCalenarioParaDivision(divisionId: number) {
    try {
      // Obtener la división con sus jugadores
      const division = await strapi.db.query('api::division.division').findOne({
        where: { id: divisionId },
        populate: {
          jugadors: {
            where: {
              publishedAt: { $notNull: true },
            },
          },
          temporada: true,
        },
      });

      if (!division) {
        throw new Error(`División con ID ${divisionId} no encontrada`);
      }

      if (!division.jugadors || division.jugadors.length === 0) {
        throw new Error('No hay jugadores asignados a esta división');
      }

      const jugadores = division.jugadors.map((j: any) => ({
        id: j.id,
        username: j.username || `${j.Nombre} ${j.Apellidos}`,
      }));

      // Generar calendario usando algoritmo Berger
      const jornadas = this.generarCalendarioRoundRobin(jugadores);

      return await strapi.db.transaction(async ({ trx }) => {
        // Guardar en la BD de forma atomica
        const jornadasCreadas = [];

        for (let i = 0; i < jornadas.length; i++) {
          // Crear la jornada
          const jornadaCreada = await strapi.db.query('api::jornada.jornada').create({
            data: {
              Nombre: `Jornada ${i + 1}`,
              numero: i + 1,
              division: divisionId,
              publishedAt: new Date(),
            },
            transaction: trx,
          } as any);

          // Crear los partidos para esta jornada
          for (const enfrentamiento of jornadas[i]) {
            await strapi.db.query('api::partido.partido').create({
              data: {
                jugador1: enfrentamiento.jugador1_id,
                jugador2: enfrentamiento.jugador2_id,
                jornada: jornadaCreada.id,
                estado: 'Pendiente',
                publishedAt: new Date(),
              },
              transaction: trx,
            } as any);
          }

          jornadasCreadas.push(jornadaCreada);
        }

        return {
          success: true,
          division: division.Nombre,
          totalJornadas: jornadasCreadas.length,
          totalJugadores: jugadores.length,
          jornadas: jornadasCreadas,
        };
      });
    } catch (error) {
      throw error;
    }
  },
}));

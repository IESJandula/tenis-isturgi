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

const SLOTS = [
  { dia: 'viernes', hora: '16:00' },
  { dia: 'viernes', hora: '18:00' },
  { dia: 'sabado', hora: '09:00' },
  { dia: 'sabado', hora: '11:00' },
  { dia: 'sabado', hora: '16:00' },
  { dia: 'sabado', hora: '18:00' },
  { dia: 'domingo', hora: '09:00' },
  { dia: 'domingo', hora: '11:00' },
  { dia: 'domingo', hora: '16:00' },
  { dia: 'domingo', hora: '18:00' },
];

const PISTAS_POR_SLOT = 3;

export default factories.createCoreService('api::jornada.jornada', ({ strapi }) => ({
  /**
   * Generates schedule for a given Jornada ID using availability
   */
  async generarHorarios(jornadaId: string) {
    const log = (msg: string) => {
      strapi.log.info(`[MATCHMAKER] ${msg}`);
    };

    log(`--- Iniciando Matchmaker para Jornada: ${jornadaId}`);

    // 1. Obtener todos los partidos de la jornada
    const partidosRes = await (strapi as any).documents('api::partido.partido').findMany({
      populate: ['jornada', 'jugador1', 'jugador2'],
      status: 'published'
    });

    const allPartidos = Array.isArray(partidosRes) ? partidosRes : (partidosRes?.data || []);
    log(`Total partidos en sistema: ${allPartidos.length}`);

    const partidos = allPartidos.filter((p: any) => p.jornada?.documentId === jornadaId);
    log(`Partidos filtrados para jornada ${jornadaId}: ${partidos.length}`);

    // 2. Obtener todas las disponibilidades de esa jornada
    // Usamos db.query ya que Document API populated relations return null for manual entries in junction tables
    const allDisponibilidades = await (strapi.db as any).query('api::disponibilidad.disponibilidad').findMany({
      populate: ['jornada', 'jugador']
    });

    log(`Total disponibilidades en sistema: ${allDisponibilidades.length}`);

    const disponibilidades = allDisponibilidades.filter((d: any) => d.jornada?.documentId === jornadaId);
    log(`Disponibilidades filtradas para jornada ${jornadaId}: ${disponibilidades.length}`);

    const ocupacionSlots = SLOTS.map(() => 0);
    const resultados = [];

    for (const partido of partidos) {
      log(`Procesando Partido ID: ${partido.id}`);
      const j1DocId = partido.jugador1?.documentId;
      const j2DocId = partido.jugador2?.documentId;

      if (!j1DocId || !j2DocId) {
        log(`Falta algún jugador en el partido ${partido.id}`);
        continue;
      }

      const disp1 = disponibilidades.find((d: any) => d.jugador?.documentId === j1DocId);
      const disp2 = disponibilidades.find((d: any) => d.jugador?.documentId === j2DocId);

      log(`Disp1: ${!!disp1}, Disp2: ${!!disp2}`);

      let slotEncontrado = false;

      if (disp1 && disp2) {
        for (let i = 0; i < SLOTS.length; i++) {
          const slot = SLOTS[i];
          const puedeJ1 = disp1.slots?.[slot.dia]?.[slot.hora];
          const puedeJ2 = disp2.slots?.[slot.dia]?.[slot.hora];
          const hayPista = ocupacionSlots[i] < PISTAS_POR_SLOT;

          if (puedeJ1 && puedeJ2 && hayPista) {
            ocupacionSlots[i]++;
            log(`Actualizando Documento Partition: ${partido.documentId}`);
            // Actualizar partido en DB
            await (strapi as any).documents('api::partido.partido').update({
              documentId: partido.documentId,
              data: {
                estado: 'Programado',
                pista: ocupacionSlots[i],
                hora: `${slot.hora}:00`,
                fecha: new Date().toISOString().split('T')[0], // Placeholder
              },
              status: 'published'
            });
            slotEncontrado = true;
            resultados.push(`Partido ${partido.id} programado: ${slot.dia} ${slot.hora}`);
            log(`Partido ${partido.id} programado satisfactoriamente`);
            break;
          }
        }
      }

      if (!slotEncontrado) {
        await (strapi as any).documents('api::partido.partido').update({
          documentId: partido.documentId,
          data: { estado: 'Aplazado' },
          status: 'published'
        });
        resultados.push(`Partido ${partido.id} aplazado por falta de coincidencia.`);
        log(`Partido ${partido.id} aplazado`);
      }
    }

    return resultados;
  },

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
      const jornadas = (this as any).generarCalendarioRoundRobin(jugadores);

      return await strapi.db.transaction(async ({ trx }) => {
        // Limpiar calendario previo para esta división
        const jornadasPrevias = await strapi.db.query('api::jornada.jornada').findMany({
          where: { division: divisionId },
        });

        for (const j of jornadasPrevias) {
          // Eliminar partidos de la jornada
          await strapi.db.query('api::partido.partido').deleteMany({
            where: { jornada: j.id },
          });
          // Eliminar jornada
          await strapi.db.query('api::jornada.jornada').delete({
            where: { id: j.id },
          });
        }

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

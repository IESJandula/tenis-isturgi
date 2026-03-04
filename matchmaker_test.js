/**
 * matchmaker_test.js
 * Standalone script to test the scheduling logic for Sprint 3.
 */

const PISTAS_POR_SLOT = 3;
const SLOTS = [
    { dia: 'Viernes', hora: '16:00' },
    { dia: 'Viernes', hora: '18:00' },
    { dia: 'Sábado', hora: '09:00' },
    { dia: 'Sábado', hora: '11:00' },
    { dia: 'Sábado', hora: '16:00' },
    { dia: 'Sábado', hora: '18:00' },
    { dia: 'Domingo', hora: '09:00' },
    { dia: 'Domingo', hora: '11:00' },
    { dia: 'Domingo', hora: '16:00' },
    { dia: 'Domingo', hora: '18:00' },
];

/**
 * The Matchmaker function
 */
function asignarHorarios(partidos, disponibilidades) {
    const asignaciones = [];
    const ocupacionSlots = SLOTS.map(() => 0); // Contador de pistas ocupadas por cada slot

    for (const partido of partidos) {
        const disp1 = disponibilidades.find(d => d.jugador === partido.jugador1);
        const disp2 = disponibilidades.find(d => d.jugador === partido.jugador2);

        if (!disp1 || !disp2) {
            asignaciones.push({ ...partido, estado: 'Aplazado', motivo: 'Sin datos de disponibilidad' });
            continue;
        }

        // Buscar slot común
        let slotAsignado = null;
        for (let i = 0; i < SLOTS.length; i++) {
            const slot = SLOTS[i];
            const diaKey = slot.dia.toLowerCase();

            const puedeJugador1 = disp1.slots[diaKey] && disp1.slots[diaKey][slot.hora];
            const puedeJugador2 = disp2.slots[diaKey] && disp2.slots[diaKey][slot.hora];
            const hayPistaLibre = ocupacionSlots[i] < PISTAS_POR_SLOT;

            if (puedeJugador1 && puedeJugador2 && hayPistaLibre) {
                slotAsignado = slot;
                ocupacionSlots[i]++;
                asignaciones.push({
                    ...partido,
                    estado: 'Programado',
                    fecha: slot.dia,
                    hora: slot.hora,
                    pista: ocupacionSlots[i]
                });
                break;
            }
        }

        if (!slotAsignado) {
            asignaciones.push({ ...partido, estado: 'Aplazado', motivo: 'Conflicto de horarios o pistas llenas' });
        }
    }

    return asignaciones;
}

// --- DATOS DE PRUEBA ---
const partidosTest = [
    { id: 1, jugador1: 'Nadal', jugador2: 'Federer' },
    { id: 2, jugador1: 'Alcaraz', jugador2: 'Djokovic' },
    { id: 3, jugador1: 'Ferrer', jugador2: 'Moya' },
    { id: 4, jugador1: 'Badosa', jugador2: 'Sabalenka' },
];

const disponibilidadesTest = [
    {
        jugador: 'Nadal',
        slots: { sábado: { '16:00': true }, domingo: { '09:00': true } }
    },
    {
        jugador: 'Federer',
        slots: { sábado: { '16:00': true } }
    },
    {
        jugador: 'Alcaraz',
        slots: { sábado: { '16:00': true }, viernes: { '18:00': true } }
    },
    {
        jugador: 'Djokovic',
        slots: { viernes: { '18:00': true } }
    },
    {
        jugador: 'Ferrer',
        slots: { viernes: { '16:00': true } }
    },
    {
        jugador: 'Moya',
        slots: { sábado: { '11:00': true } } // Conflicto total
    },
    {
        jugador: 'Badosa',
        slots: { domingo: { '18:00': true } }
    },
    {
        jugador: 'Sabalenka',
        slots: { domingo: { '18:00': true } }
    }
];

const resultado = asignarHorarios(partidosTest, disponibilidadesTest);
console.log('--- RESULTADOS DEL MATCHMAKER ---');
console.table(resultado);

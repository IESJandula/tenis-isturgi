const players = [
    { id: 1, name: 'P1' },
    { id: 2, name: 'P2' },
    { id: 3, name: 'P3' },
    { id: 4, name: 'P4' },
];

let roundPlayers = [...players];
const hasDummy = roundPlayers.length % 2 !== 0;
if (hasDummy) {
    roundPlayers.push({ id: null, name: 'Descansa' });
}

const numPlayers = roundPlayers.length;
const numRounds = numPlayers - 1;
const matchesPerRound = numPlayers / 2;

for (let round = 0; round < numRounds; round++) {
    console.log(`\n--- Round ${round + 1} ---`);

    for (let match = 0; match < matchesPerRound; match++) {
        const home = roundPlayers[match];
        const away = roundPlayers[numPlayers - 1 - match];

        if (home.id === null || away.id === null) {
            console.log(`Skip: ${home.name} vs ${away.name} (Descansa)`);
            continue;
        }

        let p1 = home;
        let p2 = away;
        if (match === 0 && round % 2 === 1) {
            p1 = away;
            p2 = home;
        }

        console.log(`${p1.name} vs ${p2.name}`);
    }

    // Rotate players (Berger: fix index 0, rotate 1 to N-1 clockwise)
    const lastPlayer = roundPlayers.pop();
    roundPlayers.splice(1, 0, lastPlayer);
}

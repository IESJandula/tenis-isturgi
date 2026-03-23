async function linkPlayers() {
    try {
        const res = await fetch('http://127.0.0.1:1337/api/jugadors');
        const { data } = await res.json();

        for (let i = 0; i < 4; i++) {
            if (!data[i]) break;
            const p = data[i];

            await fetch(`http://127.0.0.1:1337/api/jugadors/${p.documentId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    data: { division: 'ga6y73migb9ch4xzp1y5jghv' }
                })
            });
            console.log(`Linked player ${p.Nombre || p.id} to division`);
        }
    } catch (e) { console.error(e) }
}
linkPlayers();

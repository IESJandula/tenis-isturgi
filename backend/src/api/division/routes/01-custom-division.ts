export default {
    routes: [
        {
            method: 'POST',
            path: '/divisions/:id/generar-calendario',
            handler: 'api::division.division.generarCalendario',
            config: {
                auth: false,
            },
        },
    ],
};

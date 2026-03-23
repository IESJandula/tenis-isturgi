
export default {
    routes: [
        {
            method: 'GET',
            path: '/clasificacion-debug',
            handler: 'debug.debug',
            config: {
                auth: false,
            },
        },
    ],
};

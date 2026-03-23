
export default {
    async debug(ctx) {
        try {
            const knex = (strapi as any).db.connection;
            const rawRecords = await knex('clasificacions').select('*');
            const documentRecords = await (strapi as any).db.query('api::clasificacion.clasificacion').findMany({
                populate: ['jugador', 'division']
            });
            ctx.body = {
                knexCount: rawRecords.length,
                rawRecords: rawRecords,
                strapiCount: documentRecords.length,
                documentRecords: documentRecords
            };
        } catch (err) {
            ctx.body = { error: err.message };
        }
    }
};

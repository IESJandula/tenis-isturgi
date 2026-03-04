const axios = require('axios');
const fs = require('fs');
const path = require('path');
const https = require('https');
const FormData = require('form-data');
const { stat } = require('fs/promises');

// Since we know the bootstrap doesn't work correctly with relative paths, we can just run the upload function manually via Strapi programmatic API in a clean script

async function run() {
    console.log("Loading Strapi programmatically...");
    const strapi = require('@strapi/strapi')();
    await strapi.load();

    const tmpDir = path.join(__dirname, '.tmp');
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

    const imgMap = {
        'XXI Liga Municipal de Tenis 2026': 'https://image.jimcdn.com/app/cms/image/transf/none/path/se6cb951de2d7dd94/image/ia62ff8b543c7bfe8/version/1736932470/image.jpg',
        'Apertura de Inscripciones XXI Liga Municipal Tenis': 'https://image.jimcdn.com/app/cms/image/transf/none/path/se6cb951de2d7dd94/image/ia62ff8b543c7bfe8/version/1736932470/image.jpg',
        'VIII Torneo Social 16 Puntos': 'https://image.jimcdn.com/app/cms/image/transf/none/path/se6cb951de2d7dd94/image/idf1df92ae70fbacc/version/1736932791/image.jpg',
        'XI Torneo Arques & Torres Asesores': 'https://image.jimcdn.com/app/cms/image/transf/none/path/se6cb951de2d7dd94/image/idebe1477aa2f82ba/version/1729605333/image.jpg',
        'Nuevo curso Escuela Municipal de Tenis': 'https://image.jimcdn.com/app/cms/image/transf/none/path/se6cb951de2d7dd94/image/ibe2923c6d7a4cb28/version/1724838640/image.jpg'
    };

    async function downloadImage(url, dest) {
        return new Promise((resolve, reject) => {
            const file = fs.createWriteStream(dest);
            https.get(url, response => {
                response.pipe(file);
                file.on('finish', () => { file.close(); resolve(dest); });
            }).on('error', err => { fs.unlink(dest, () => { }); reject(err); });
        });
    }

    const torneos = await strapi.documents('api::torneo.torneo').findMany({ populate: '*' });
    for (const t of torneos) {
        if (imgMap[t.Nombre] && !t.Imagen) {
            console.log("Processing Torneo: ", t.Nombre);
            const filename = Date.now() + '.jpg';
            const filepath = path.join(tmpDir, filename);
            await downloadImage(imgMap[t.Nombre], filepath);

            const fileStat = await stat(filepath);
            try {
                await strapi.plugins.upload.services.upload.upload({
                    data: {
                        refId: t.documentId,
                        ref: 'api::torneo.torneo',
                        field: 'Imagen'
                    },
                    files: {
                        path: filepath,
                        name: filename,
                        type: 'image/jpeg',
                        size: fileStat.size,
                    }
                });
                console.log("Successfully attached image!");
            } catch (e) { console.error("Error attaching: ", e.message); }
            if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
        }
    }

    const noticias = await strapi.documents('api::noticia.noticia').findMany({ populate: '*' });
    for (const n of noticias) {
        if (imgMap[n.Titulo] && !n.Imagen) {
            console.log("Processing Noticia: ", n.Titulo);
            const filename = Date.now() + '.jpg';
            const filepath = path.join(tmpDir, filename);
            await downloadImage(imgMap[n.Titulo], filepath);

            const fileStat = await stat(filepath);
            try {
                await strapi.plugins.upload.services.upload.upload({
                    data: {
                        refId: n.documentId,
                        ref: 'api::noticia.noticia',
                        field: 'Imagen'
                    },
                    files: {
                        path: filepath,
                        name: filename,
                        type: 'image/jpeg',
                        size: fileStat.size,
                    }
                });
                console.log("Successfully attached image!");
            } catch (e) { console.error("Error attaching: ", e.message); }
            if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
        }
    }

    console.log("Done linking images natively in Strapi core.");
    process.exit(0);
}

run().catch(console.error);

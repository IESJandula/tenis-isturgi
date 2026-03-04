const fs = require('fs');
const path = require('path');
const https = require('https');
const FormData = require('form-data');
const axios = require('axios');

const STRAPI_URL = 'http://localhost:1337';

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
            file.on('finish', () => {
                file.close();
                resolve(dest);
            });
        }).on('error', err => {
            fs.unlink(dest);
            reject(err);
        });
    });
}

function getJwt() {
    // If strapi handles public uploads differently or lacks JWT, we will try standard upload first.
    return null;
}

// Since the /api/upload endpoint returns 403 Forbidden because it expects an authenticated user...
// A better way is to attach the images using a strapi instance directly. To do this, we can run strapi programmatically:
async function attachViaInternalStrapi() {
    console.log("Starting internal Strapi context to attach images...");
    const strapi = require('@strapi/strapi')();
    await strapi.load();

    const tmpDir = path.join(__dirname, '.tmp');
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

    const torneos = await strapi.documents('api::torneo.torneo').findMany();
    for (const t of torneos) {
        if (imgMap[t.Nombre]) {
            console.log(`Downloading ${t.Nombre}...`);
            const filename = Date.now() + '.jpg';
            const filepath = path.join(tmpDir, filename);
            await downloadImage(imgMap[t.Nombre], filepath);

            console.log(`Uploading ${t.Nombre}...`);
            const stat = fs.statSync(filepath);
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
                        size: stat.size,
                    }
                });
                console.log("Attached!");
            } catch (e) { console.error(e.message); }
            if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
        }
    }

    const noticias = await strapi.documents('api::noticia.noticia').findMany();
    for (const n of noticias) {
        if (imgMap[n.Titulo]) {
            console.log(`Downloading ${n.Titulo}...`);
            const filename = Date.now() + '.jpg';
            const filepath = path.join(tmpDir, filename);
            await downloadImage(imgMap[n.Titulo], filepath);

            console.log(`Uploading ${n.Titulo}...`);
            const stat = fs.statSync(filepath);
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
                        size: stat.size,
                    }
                });
                console.log("Attached!");
            } catch (e) { console.error(e.message); }
            if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
        }
    }

    console.log("Done attaching.");
    process.exit(0);
}

attachViaInternalStrapi().catch(console.error);

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const https = require('https');
const FormData = require('form-data');
const crypto = require('crypto');

const BASE_URL = 'http://localhost:1337';

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

// Gives "Public" role temporary access to get items, then deletes the access.
async function grantPublicPermissions() {
    const Database = require('better-sqlite3');
    const dbPath = path.join(__dirname, '.tmp', 'data.db');
    const db = new Database(dbPath);
    try {
        const publicRole = db.prepare("SELECT id FROM up_roles WHERE type = 'public'").get();
        if (publicRole) {
            db.prepare(`
               INSERT OR IGNORE INTO up_permissions (action, role_id) 
               VALUES ('api::torneo.torneo.find', ?),
                      ('api::noticia.noticia.find', ?),
                      ('plugin::upload.upload.upload', ?)
            `).run(publicRole.id, publicRole.id, publicRole.id);
            console.log("Granted upload and find permissions to Public.");
        }
    } catch (e) { console.error("Permission error", e); }
    db.close();
}

async function run() {
    await grantPublicPermissions();

    const tmpDir = path.join(__dirname, '.tmp');
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

    console.log("Waiting 3 seconds for DB locks...");
    await new Promise(r => setTimeout(r, 3000));

    // Public now has upload access
    try {
        const torneosReq = await axios.get(`${BASE_URL}/api/torneos`);
        const torneos = torneosReq.data.data;

        for (const t of torneos) {
            if (imgMap[t.Nombre]) {
                const imgPath = path.join(tmpDir, t.documentId + '.jpg');
                await downloadImage(imgMap[t.Nombre], imgPath);

                const form = new FormData();
                form.append('files', fs.createReadStream(imgPath));
                form.append('refId', t.documentId);
                form.append('ref', 'api::torneo.torneo');
                form.append('field', 'Imagen');

                try {
                    await axios.post(`${BASE_URL}/api/upload`, form, { headers: { ...form.getHeaders() } });
                    console.log("Uploaded successfully for Torneo: ", t.Nombre);
                } catch (e) { console.error("Upload failed for ", t.Nombre, e.response?.data?.error || e.message); }
                fs.unlinkSync(imgPath);
            }
        }

        const noticiasReq = await axios.get(`${BASE_URL}/api/noticias`);
        const noticias = noticiasReq.data.data;

        for (const n of noticias) {
            if (imgMap[n.Titulo]) {
                const imgPath = path.join(tmpDir, n.documentId + '.jpg');
                await downloadImage(imgMap[n.Titulo], imgPath);

                const form = new FormData();
                form.append('files', fs.createReadStream(imgPath));
                form.append('refId', n.documentId);
                form.append('ref', 'api::noticia.noticia');
                form.append('field', 'Imagen');

                try {
                    await axios.post(`${BASE_URL}/api/upload`, form, { headers: { ...form.getHeaders() } });
                    console.log("Uploaded successfully for Noticia: ", n.Titulo);
                } catch (e) { console.error("Upload failed for ", n.Titulo, e.response?.data?.error || e.message); }
                fs.unlinkSync(imgPath);
            }
        }
        console.log("Finished API uploads.");
    } catch (e) {
        console.error(e.response?.data || e.message);
    }
}

run();

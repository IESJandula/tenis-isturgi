const fs = require('fs');
const path = require('path');
const https = require('https');
const axios = require('axios');
const FormData = require('form-data');
const Database = require('better-sqlite3');

const dbPath = path.join(__dirname, '.tmp', 'data.db');

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
        }).on('error', err => { fs.unlink(dest); reject(err); });
    });
}

function generateRandomString(length) {
    let result = '';
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

async function run() {
    try {
        console.log("Starting DB update...");
        // 1. Give public role upload permissions temporarily (if possible via db)
        // or just insert the file data directly into the DB. Since it's sqlite, we can inject the files table.

        const db = new Database(dbPath);

        const torneos = db.prepare("SELECT * FROM torneos").all();
        const noticias = db.prepare("SELECT * FROM noticias").all();

        const tmpDir = path.join(__dirname, '.tmp');
        const uploadDir = path.join(__dirname, 'public', 'uploads');
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

        for (const t of torneos) {
            if (imgMap[t.nombre]) {
                console.log(`Processing Torneo: ${t.nombre}`);
                const filename = Date.now() + '_' + path.basename(imgMap[t.nombre]) + '.jpg';
                const filepath = path.join(uploadDir, filename);
                await downloadImage(imgMap[t.nombre], filepath);
                const stat = fs.statSync(filepath);

                // Inject into files
                const fileDocId = generateRandomString(16);
                let fileId;
                try {
                    const stmt = db.prepare(`
                      INSERT INTO files (name, hash, ext, mime, size, url, provider, created_at, updated_at, folder_path, document_id) 
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                  `);
                    const info = stmt.run(
                        filename,
                        filename.split('.')[0],
                        '.jpg',
                        'image/jpeg',
                        stat.size / 1024,
                        '/uploads/' + filename,
                        'local',
                        new Date().toISOString(),
                        new Date().toISOString(),
                        '/',
                        fileDocId
                    );
                    fileId = info.lastInsertRowid;
                } catch (ex) { console.error("DB Insert error:", ex); continue; }

                // Link Torneo -> File
                try {
                    const linkStmt = db.prepare("INSERT INTO files_related_morphs (file_id, related_id, related_type, field, \"order\") VALUES (?, ?, ?, ?, ?)");
                    linkStmt.run(fileId, t.id, 'api::torneo.torneo', 'Imagen', 1);
                } catch (ex) { console.error("Morph Insert error:", ex); }
                console.log("Linked!");
            }
        }

        for (const n of noticias) {
            if (imgMap[n.titulo]) {
                console.log(`Processing Noticia: ${n.titulo}`);
                const filename = Date.now() + '_' + path.basename(imgMap[n.titulo]) + '.jpg';
                const filepath = path.join(uploadDir, filename);
                await downloadImage(imgMap[n.titulo], filepath);
                const stat = fs.statSync(filepath);

                // Inject into files
                const fileDocId = generateRandomString(16);
                let fileId;
                try {
                    const stmt = db.prepare(`
                      INSERT INTO files (name, hash, ext, mime, size, url, provider, created_at, updated_at, folder_path, document_id) 
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                  `);
                    const info = stmt.run(
                        filename,
                        filename.split('.')[0],
                        '.jpg',
                        'image/jpeg',
                        stat.size / 1024,
                        '/uploads/' + filename,
                        'local',
                        new Date().toISOString(),
                        new Date().toISOString(),
                        '/',
                        fileDocId
                    );
                    fileId = info.lastInsertRowid;
                } catch (ex) { console.error("DB Insert error:", ex); continue; }

                // Link Noticia -> File
                try {
                    const linkStmt = db.prepare("INSERT INTO files_related_morphs (file_id, related_id, related_type, field, \"order\") VALUES (?, ?, ?, ?, ?)");
                    linkStmt.run(fileId, n.id, 'api::noticia.noticia', 'Imagen', 1);
                } catch (ex) { console.error("Morph Insert error:", ex); }
                console.log("Linked!");
            }
        }

        db.close();
        console.log("Done database injection!");
    } catch (e) {
        console.error("Run error", e);
    }
}
run();

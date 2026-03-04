const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

const STRAPI_URL = 'http://localhost:1337';

async function uploadImageAndLink(filePath, refId, refPath) {
    try {
        const form = new FormData();
        form.append('files', fs.createReadStream(filePath));
        form.append('refId', refId);
        form.append('ref', refPath);
        form.append('field', 'Imagen');

        console.log(`Uploading ${filePath} for ${refPath} ID: ${refId}...`);

        const response = await axios.post(`${STRAPI_URL}/api/upload`, form, {
            headers: {
                ...form.getHeaders()
            }
        });

        console.log(`Successfully uploaded and linked image! Media ID: ${response.data[0].id}`);
        return response.data[0];
    } catch (error) {
        console.error(`Error uploading image for ${refId}:`, error.response?.data || error.message);
    }
}

async function main() {
    try {
        // 1. Fetch articulos
        const torneosRes = await axios.get(`${STRAPI_URL}/api/torneos?sort=FechaInicio:desc`);
        const torneos = torneosRes.data.data;

        const noticiasRes = await axios.get(`${STRAPI_URL}/api/noticias?sort=Fecha:desc`);
        const noticias = noticiasRes.data.data;

        if (torneos.length < 4 || noticias.length < 4) {
            console.log("Not enough records in DB yet");
            return;
        }

        const imgMap = {
            'XXI Liga Municipal de Tenis 2026': 'liga2026.jpg',
            'VIII Torneo Social 16 Puntos': 'torneosocial16.jpg',
            'XI Torneo Arques & Torres Asesores': 'torneoarques.jpg',
            'XXXII Torneo de Tenis Feria de Andújar': null, // No clear image on homepage for this specific one

            'Apertura de Inscripciones XXI Liga Municipal Tenis': 'liga2026.jpg',
            'Horarios y Orden de Juego: Segunda Jornada (Marzo 2026)': null,
            'Nuevo curso Escuela Municipal de Tenis': 'escuelatenis.jpg',
            'Ranking del Club Actualizado': null
        };

        console.log("Processing Torneos...");
        for (const t of torneos) {
            const imgName = imgMap[t.Nombre];
            if (imgName) {
                const imgPath = path.join(__dirname, '.tmp', 'images', imgName);
                if (fs.existsSync(imgPath)) {
                    await uploadImageAndLink(imgPath, t.documentId, 'api::torneo.torneo');
                }
            }
        }

        console.log("Processing Noticias...");
        for (const n of noticias) {
            const imgName = imgMap[n.Titulo];
            if (imgName) {
                const imgPath = path.join(__dirname, '.tmp', 'images', imgName);
                if (fs.existsSync(imgPath)) {
                    await uploadImageAndLink(imgPath, n.documentId, 'api::noticia.noticia');
                }
            }
        }

        console.log("Done linking images!");
    } catch (err) {
        console.error("Main error:", err.message);
    }
}

main();

const fs = require('fs');
const path = require('path');
const https = require('https');

const links = [
    'https://image.jimcdn.com/app/cms/image/transf/none/path/se6cb951de2d7dd94/image/ia62ff8b543c7bfe8/version/1736932470/image.jpg',
    'https://image.jimcdn.com/app/cms/image/transf/none/path/se6cb951de2d7dd94/image/idf1df92ae70fbacc/version/1736932791/image.jpg',
    'https://image.jimcdn.com/app/cms/image/transf/none/path/se6cb951de2d7dd94/image/idebe1477aa2f82ba/version/1729605333/image.jpg',
    'https://image.jimcdn.com/app/cms/image/transf/none/path/se6cb951de2d7dd94/image/ibe2923c6d7a4cb28/version/1724838640/image.jpg'
];

const dir = path.join(__dirname, '..', 'Imagenes_Torneos');
if (!fs.existsSync(dir)) fs.mkdirSync(dir);

async function download() {
    for (let i = 0; i < links.length; i++) {
        const fn = path.join(dir, `torneo_imagen_${i + 1}.jpg`);
        const file = fs.createWriteStream(fn);
        https.get(links[i], r => {
            r.pipe(file);
        });
    }
}
download();

const Database = require('better-sqlite3');
const db = new Database('.tmp/data.db');

console.log("=== NOTICIAS ===");
const noticias = db.prepare('SELECT id, titulo, published_at FROM noticias').all();
console.log(noticias);

console.log("\\n=== TORNEOS ===");
const torneos = db.prepare('SELECT id, nombre, published_at FROM torneos').all();
console.log(torneos);

console.log("\\n=== PERMISOS PUBLICOS ===");
const publicRole = db.prepare('SELECT id FROM up_roles WHERE type = ?').get('public');
if (publicRole) {
    const permissions = db.prepare('SELECT action FROM up_permissions WHERE role_id = ? AND action LIKE ?').all(publicRole.id, 'api::%');
    console.log("Permisos para rol public:", permissions.map(p => p.action));
}

db.close();

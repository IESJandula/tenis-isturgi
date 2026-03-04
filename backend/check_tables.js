const Database = require('better-sqlite3');
const db = new Database('.tmp/data.db');

console.log("=== TABLES ===");
const tables = db.prepare('SELECT name FROM sqlite_master WHERE type="table"').all();
console.log(tables.map(t => t.name).filter(n => n.includes('noticia') || n.includes('torneo') || n.includes('permission') || n.includes('document')));

db.close();

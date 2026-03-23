const db = require('better-sqlite3')('.tmp/data.db');

const now = new Date().toISOString(); 
// In Strapi v5, published_at is a string (ISO 8601) in SQLite or a date object.
// Actually, let's check the format of existing published_at records.

const tables = [
  'jugadors', 
  'partidos', 
  'noticias', 
  'torneos', 
  'divisions', 
  'jornadas', 
  'temporadas', 
  'clubes', 
  'clasificacions', 
  'disponibilidads'
];

tables.forEach(t => {
  try {
    // First, let's see if the table exists
    const tableExists = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name=?").get(t);
    if (!tableExists) {
      console.log(`Table ${t} does not exist, skipping.`);
      return;
    }

    const result = db.prepare(`UPDATE ${t} SET published_at = ? WHERE published_at IS NULL`).run(now);
    console.log(`Published ${result.changes} records in ${t}`);
  } catch (e) {
    console.log(`Error publishing in ${t}: ${e.message}`);
  }
});

db.close();
console.log('Publishing sync completed.');

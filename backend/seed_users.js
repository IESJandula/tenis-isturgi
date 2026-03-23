const db = require('better-sqlite3')('.tmp/data.db');
const bcrypt = require('bcryptjs');

async function seed() {
    const hash = await bcrypt.hash('123456', 10);

    // Create Admin
    db.prepare(`
    INSERT INTO up_users (username, email, password, provider, confirmed, blocked, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run('admin', 'admin@isturgi.com', hash, 'local', 1, 0, new Date().toISOString(), new Date().toISOString());

    const adminId = db.prepare('SELECT last_insert_rowid() as id').get().id;
    db.prepare('INSERT INTO up_users_role_lnk (user_id, role_id) VALUES (?, ?)').run(adminId, 1);

    // Create Socio
    db.prepare(`
    INSERT INTO up_users (username, email, password, provider, confirmed, blocked, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run('socio', 'socio@isturgi.com', hash, 'local', 1, 0, new Date().toISOString(), new Date().toISOString());

    const socioId = db.prepare('SELECT last_insert_rowid() as id').get().id;
    db.prepare('INSERT INTO up_users_role_lnk (user_id, role_id) VALUES (?, ?)').run(socioId, 1);

    console.log('Users seeded successfully');
    db.close();
}

seed().catch(err => {
    console.error(err);
    process.exit(1);
});

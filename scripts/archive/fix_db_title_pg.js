const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
async function run() {
  const res = await pool.query(`UPDATE "Lesson" SET title = 'Learn the basics of Google Antigravity' WHERE title LIKE '%720p%';`);
  console.log("Database retroactively cleaned!", res.rowCount, "rows updated.");
  await pool.end();
}
run();

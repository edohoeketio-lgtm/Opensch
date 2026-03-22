const fs = require('fs');
const { Client } = require('pg');

const envFile = fs.readFileSync('.env.local', 'utf8');
const dbUrlLine = envFile.split('\n').find(line => line.startsWith('DATABASE_URL='));
const dbUrl = dbUrlLine ? dbUrlLine.split('=')[1].replace(/^"|"$/g, '') : null;

if (!dbUrl) {
  console.error("No DATABASE_URL found.");
  process.exit(1);
}

const client = new Client({
  connectionString: dbUrl,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    await client.connect();
    const res = await client.query(`UPDATE "Lesson" SET title = 'Learn the basics of Google Antigravity' WHERE title LIKE '%720p%';`);
    console.log(`Database retroactively cleaned! ${res.rowCount} rows updated.`);
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}
run();

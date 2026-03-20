require('dotenv').config({ path: '.env.local' });
const { Client } = require('pg');

let url = process.env.DATABASE_URL;
// try to use session pooler port
url = url.replace(':6543', ':5432');

const client = new Client({
  connectionString: url
});

async function run() {
  await client.connect();
  console.log("Connected to DB");
  try {
    await client.query('ALTER TABLE "GlobalSettings" ADD COLUMN "currentCohortWeek" INTEGER NOT NULL DEFAULT 1;');
    console.log("Column added successfully");
  } catch(e) {
    if (e.code === '42701') {
      console.log("Column already exists");
    } else {
      throw e;
    }
  }
  await client.end();
}
run().catch(console.error);

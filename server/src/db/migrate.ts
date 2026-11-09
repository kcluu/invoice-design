import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool } from './pool';

const migrationsDir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'migrations');

// runs every .sql file once, in filename order
export const migrate = async () => {
  await pool.query(`create table if not exists schema_migrations (name text primary key, run_at timestamptz not null default now())`);
  const { rows } = await pool.query<{ name: string }>('select name from schema_migrations');
  const done = new Set(rows.map((row) => row.name));
  const files = (await readdir(migrationsDir)).filter((file) => file.endsWith('.sql')).sort();

  for (const file of files) {
    if (done.has(file)) continue;
    const sql = await readFile(path.join(migrationsDir, file), 'utf8');
    const client = await pool.connect();
    try {
      await client.query('begin');
      await client.query(sql);
      await client.query('insert into schema_migrations (name) values ($1)', [file]);
      await client.query('commit');
      console.log(`migrated ${file}`);
    } catch (error) {
      await client.query('rollback');
      throw error;
    } finally {
      client.release();
    }
  }
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  migrate()
    .then(() => pool.end())
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

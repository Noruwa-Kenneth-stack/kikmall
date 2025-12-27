import pkg from "pg";
const { Pool } = pkg;

declare global {

  var pgPool: pkg.Pool | undefined;
}

const pool =
  global.pgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

if (!global.pgPool) global.pgPool = pool;

export async function query(text: string, params?: unknown[]) {
  return pool.query(text, params);
}

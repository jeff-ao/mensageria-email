import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = (text: string, params?: any[]) => {
  return pool.query(text, params);
};

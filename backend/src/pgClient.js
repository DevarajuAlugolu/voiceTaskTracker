import dotenv from "dotenv";
import pkg from "pg";
const { Pool } = pkg;

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("DATABASE_URL is not defined in environment");
  process.exit(1);
}

export const pool = new Pool({
  connectionString,
});

pool.on("error", (err) => {
  console.error("Unexpected PG error", err);
  process.exit(-1);
});
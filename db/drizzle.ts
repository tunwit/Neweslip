import { drizzle, MySql2Database } from "drizzle-orm/mysql2";
import * as schema from "./schema";
import mysql from "mysql2/promise";

const dbURL = process.env.DATABASE_URL;

if (!dbURL)
  throw new ReferenceError("DATABASE_URL environment variable is not set.");

const globalForDb = globalThis as unknown as {
  drizzleDb?: MySql2Database<typeof schema>;
  mysqlPool?: mysql.Pool;
};

if (!globalForDb.drizzleDb) {
  const pool = mysql.createPool({
    uri: dbURL,
    waitForConnections: true,
    connectionLimit: 10,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
  });

  // Optional: check connection oncex
  pool.getConnection().then((conn) => conn.release());

  globalForDb.mysqlPool = pool;
  globalForDb.drizzleDb = drizzle(pool, { schema, mode: "default" });
}

const globleDrizzle = globalForDb.drizzleDb;
export default globleDrizzle;

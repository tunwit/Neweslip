import { drizzle, MySql2Database } from "drizzle-orm/mysql2";
import * as schema from "../db/schema";
import mysql from "mysql2/promise";

const dbURL = process.env.DATABASE_URL


if (!dbURL)
  throw new ReferenceError("DATABASE_URL environment variable is not set.");


let globalDrizzle: MySql2Database<typeof schema>;

try {
    const pool = mysql.createPool({
        uri: dbURL,
        waitForConnections: true,
        connectionLimit: 5,
    });
    await pool.getConnection().then((conn) => conn.release());

    globalDrizzle = drizzle(pool, { schema, mode: "default" });
} catch (err){
    console.error("❌ MySQL connection error:", err);
    throw Error("Database pool creation failed.");
}

export default globalDrizzle;

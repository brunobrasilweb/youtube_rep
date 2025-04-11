import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";

// Configuração do banco de dados SQLite
const sqlite = new Database("sqlite.db");
const db = drizzle(sqlite);

// Executa todas as migrações pendentes
console.log("Running migrations...");
migrate(db, { migrationsFolder: "src/db/migrations" });
console.log("Migrations completed!");
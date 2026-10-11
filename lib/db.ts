import fs from "node:fs";
import path from "node:path";

import Database from "better-sqlite3";

import { initializeSchema } from "@/lib/schema";
import { seedDatabase } from "@/lib/seed";

const dataDirectory = path.join(process.cwd(), "data");
export const databasePath = path.join(dataDirectory, "northline.sqlite");

let database: Database.Database | undefined;

export function getDb(): Database.Database {
  if (!database) {
    fs.mkdirSync(dataDirectory, { recursive: true });
    database = new Database(databasePath);
    database.pragma("foreign_keys = ON");
    initializeSchema(database);
    seedDatabase(database);
  }

  return database;
}

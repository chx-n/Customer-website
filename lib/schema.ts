import type Database from "better-sqlite3";

export function initializeSchema(db: Database.Database): void {
  db.exec(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS cars (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      transmission TEXT NOT NULL,
      seats INTEGER NOT NULL CHECK (seats > 0),
      price_per_day INTEGER NOT NULL CHECK (price_per_day >= 0),
      location TEXT NOT NULL,
      description TEXT NOT NULL,
      image_url TEXT NOT NULL,
      features_json TEXT NOT NULL DEFAULT '[]',
      is_demo INTEGER NOT NULL DEFAULT 1 CHECK (is_demo IN (0, 1)),
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      car_id INTEGER NOT NULL,
      pickup_date TEXT NOT NULL,
      return_date TEXT NOT NULL,
      total_price INTEGER NOT NULL CHECK (total_price >= 0),
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE RESTRICT,
      CHECK (return_date >= pickup_date)
    );

    CREATE INDEX IF NOT EXISTS idx_cars_category ON cars(category);
    CREATE INDEX IF NOT EXISTS idx_cars_transmission ON cars(transmission);
    CREATE INDEX IF NOT EXISTS idx_cars_seats ON cars(seats);
    CREATE INDEX IF NOT EXISTS idx_cars_price_per_day ON cars(price_per_day);
    CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
    CREATE INDEX IF NOT EXISTS idx_bookings_car_id ON bookings(car_id);
  `);
}

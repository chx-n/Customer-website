import type Database from "better-sqlite3";

type SeedCar = {
  slug: string;
  name: string;
  category: string;
  transmission: string;
  seats: number;
  pricePerDay: number;
  location: string;
  description: string;
  imageUrl: string;
  features: string[];
};

const demoCars: SeedCar[] = [
  {
    slug: "volvo-v60-cross-country",
    name: "Volvo V60 Cross Country",
    category: "wagon",
    transmission: "automatic",
    seats: 5,
    pricePerDay: 4800,
    location: "Makati, Metro Manila",
    description: "A composed demo wagon with generous cargo space for relaxed weekend routes.",
    imageUrl: "/cars/volvo-v60-cross-country.jpg",
    features: ["All-wheel drive", "Apple CarPlay", "Large cargo area"],
  },
  {
    slug: "subaru-outback",
    name: "Subaru Outback",
    category: "suv",
    transmission: "automatic",
    seats: 5,
    pricePerDay: 4300,
    location: "Quezon City, Metro Manila",
    description: "A practical demo SUV for longer drives with a roomy cabin and confident ride height.",
    imageUrl: "/cars/subaru-outback.jpg",
    features: ["Roof rails", "Adaptive cruise control", "All-wheel drive"],
  },
  {
    slug: "toyota-camry",
    name: "Toyota Camry",
    category: "sedan",
    transmission: "automatic",
    seats: 5,
    pricePerDay: 3900,
    location: "Pasig, Metro Manila",
    description: "A quiet demo sedan suited to city errands, airport runs, and easy highway miles.",
    imageUrl: "/cars/toyota-camry.jpg",
    features: ["Quiet cabin", "Rear camera", "Dual-zone climate"],
  },
  {
    slug: "mazda-cx-5",
    name: "Mazda CX-5",
    category: "suv",
    transmission: "automatic",
    seats: 5,
    pricePerDay: 4100,
    location: "Taguig, Metro Manila",
    description: "A polished demo crossover with an attentive drive and flexible passenger space.",
    imageUrl: "/cars/mazda-cx-5.jpg",
    features: ["Blind-spot monitoring", "Apple CarPlay", "Power liftgate"],
  },
  {
    slug: "honda-civic-hatchback",
    name: "Honda Civic Hatchback",
    category: "hatchback",
    transmission: "automatic",
    seats: 5,
    pricePerDay: 3200,
    location: "Mandaluyong, Metro Manila",
    description: "A nimble demo hatchback that keeps city trips simple and cargo surprisingly useful.",
    imageUrl: "/cars/honda-civic-hatchback.jpg",
    features: ["Compact footprint", "Rear camera", "Fold-flat rear seats"],
  },
  {
    slug: "mini-cooper-s",
    name: "Mini Cooper S",
    category: "compact",
    transmission: "manual",
    seats: 4,
    pricePerDay: 3500,
    location: "BGC, Taguig",
    description: "A lively demo compact for drivers who want a smaller car and a more involved feel.",
    imageUrl: "/cars/mini-cooper-s.jpg",
    features: ["Sport seats", "Parking sensors", "Bluetooth audio"],
  },
];

export function seedDatabase(db: Database.Database): void {
  const insertCar = db.prepare(`
    INSERT OR IGNORE INTO cars (
      slug,
      name,
      category,
      transmission,
      seats,
      price_per_day,
      location,
      description,
      image_url,
      features_json,
      is_demo
    ) VALUES (
      @slug,
      @name,
      @category,
      @transmission,
      @seats,
      @pricePerDay,
      @location,
      @description,
      @imageUrl,
      @featuresJson,
      1
    )
  `);

  const insertSeedCars = db.transaction(() => {
    for (const car of demoCars) {
      insertCar.run({
        ...car,
        featuresJson: JSON.stringify(car.features),
      });
      db.prepare("UPDATE cars SET image_url = ?, is_demo = 1 WHERE slug = ?").run(car.imageUrl, car.slug);
    }
  });

  insertSeedCars();
}

import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const responses = mysqlTable("responses", {
  id: int("id").autoincrement().primaryKey(),
  language: mysqlEnum("language", ["ar", "en", "ml", "ne"]).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  company: varchar("company", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  rating1: int("rating1").notNull(),
  rating2: int("rating2").notNull(),
  rating3: int("rating3").notNull(),
  rating4: int("rating4").notNull(),
  rating5: int("rating5").notNull(),
  rating6: int("rating6").notNull(),
  suggestions: text("suggestions"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Response = typeof responses.$inferSelect;
export type InsertResponse = typeof responses.$inferInsert;

export const managers = mysqlTable("managers", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  active: int("active").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Manager = typeof managers.$inferSelect;
export type InsertManager = typeof managers.$inferInsert;

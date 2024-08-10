import { type InferInsertModel, relations, sql } from "drizzle-orm";
import {
  date,
  index,
  integer,
  pgEnum,
  pgTableCreator,
  primaryKey,
  real,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `immotool_${name}`);

export const users = createTable("user", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
  }).default(sql`CURRENT_TIMESTAMP`),
  image: varchar("image", { length: 255 }),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
}));

export const accounts = createTable(
  "account",
  {
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_userId_idx").on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  {
    sessionToken: varchar("sessionToken", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_userId_idx").on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verificationToken",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);

export const property = createTable("property", {
  id: serial("id").primaryKey(),
  units: integer("units").notNull(),
  commercial: integer("commercial").notNull(),
  heatingSystem: varchar("heatingSystem", { length: 50 }).notNull(),
  capacity: integer("capacity"),
  street: varchar("street", { length: 255 }),
  streetNumber: varchar("streetNumber", { length: 255 }),
  zipCode: integer("zipCode"),
  city: varchar("city", { length: 255 }),
  waste: integer("waste"),
  water: integer("water"),
  basicFee: integer("basicFee"),
  sewage: integer("sewage"),
});

export const propertyRelations = relations(property, ({ many }) => ({
  unit: many(unit),
  tenants: many(rentContract),
  counter: many(counter),
}));

export const counterEnum = pgEnum("counter_type", [
  "electricity",
  "gas",
  "water",
]);

export const counter = createTable("counter", {
  id: serial("id").primaryKey(),
  type: counterEnum("type").notNull(),
  number: varchar("number").notNull().unique(),
  propertyId: integer("propertyId")
    .references(() => property.id, { onDelete: "cascade" })
    .notNull(),
});

export const counterRelations = relations(counter, ({ one, many }) => ({
  values: many(counterValues),
  property: one(property, {
    fields: [counter.propertyId],
    references: [property.id],
  }),
}));

export const counterValues = createTable("counterValues", {
  id: serial("id").primaryKey(),
  value: integer("value").notNull(),
  valueDate: date("valueDate").notNull().defaultNow(),
  counterValuesId: integer("counterValuesId")
    .references(() => counter.id, { onDelete: "cascade" })
    .notNull(),
});

export const counterValuesRelations = relations(counterValues, ({ one }) => ({
  counter: one(counter, {
    fields: [counterValues.counterValuesId],
    references: [counter.id],
  }),
}));

export const tenants = createTable("tenants", {
  id: serial("id").primaryKey(),
  firstName: varchar("firstName", { length: 30 }).notNull(),
  lastName: varchar("lastName", { length: 30 }).notNull(),
  phone: varchar("phone", { length: 255 }),
  mobile: varchar("mobile", { length: 255 }),
  email: varchar("email", { length: 255 }),
});

export const tenantsRelation = relations(tenants, ({ many }) => ({
  rentContract: many(rentContract),
}));

export const rentContract = createTable("rentTime", {
  id: serial("id").primaryKey(),
  coldRent: integer("coldRent").notNull(),
  utilityRent: integer("utilityRent").notNull(),
  movedIn: date("movedIn").notNull(),
  movedOut: date("movedOut"),
  unitId: integer("unitId").notNull(),
  tenantId: integer("tenantId").notNull(),
});

export const rentContractRelations = relations(rentContract, ({ one }) => ({
  tenants: one(tenants, {
    fields: [rentContract.tenantId],
    references: [tenants.id],
  }),
}));

export const flatTypeEnum = pgEnum("flat_type", ["normal", "commercial"]);

export const unit = createTable("unit", {
  id: serial("id").primaryKey(),
  type: flatTypeEnum("type").notNull(),
  size: real("size"),
  number: integer("number").notNull(),
  propertyId: integer("propertyId")
    .references(() => property.id, { onDelete: "cascade" })
    .notNull(),
  activeTenantId: integer("activeTenantId"),
  activeRentDetailsId: integer("activeRentDetailsId"),
});

export const unitRelation = relations(unit, ({ one, many }) => ({
  property: one(property, {
    fields: [unit.propertyId],
    references: [property.id],
  }),
  tenants: many(tenants),
  activeTenantId: one(tenants, {
    fields: [unit.activeTenantId],
    references: [tenants.id],
  }),
  rentContract: many(rentContract),
}));

export type Property = Omit<InferInsertModel<typeof property>, "id"> & {
  id: number;
};
export type Flat = InferInsertModel<typeof unit>;
export type Tenant = InferInsertModel<typeof tenants>;

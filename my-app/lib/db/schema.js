import { pgTable, serial, text, timestamp, integer, decimal, boolean, varchar, numeric } from 'drizzle-orm/pg-core';


// Budgets table
export const budgets = pgTable('budgets', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
  amount: numeric('amount').notNull().default(0),
  icon: varchar('icon'),
  createdBy: varchar('createdBy').notNull(),
});

export const expenses = pgTable('expenses', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
  amount: numeric('amount').notNull().default(0),
  budgetId: integer('budgetId').references(() => budgets.id),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})


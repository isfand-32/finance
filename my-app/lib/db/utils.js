import { db } from './index.js';
import { users, budgets, expenses } from './schema.js';
import { eq, and, desc } from 'drizzle-orm';

// User operations
export async function createUser(clerkId, email, firstName, lastName) {
  return await db.insert(users).values({
    clerkId,
    email,
    firstName,
    lastName,
  }).returning();
}

export async function getUserByClerkId(clerkId) {
  return await db.select().from(users).where(eq(users.clerkId, clerkId));
}

// Budget operations
export async function createBudget(userId, budgetData) {
  return await db.insert(budgets).values({
    userId,
    ...budgetData,
  }).returning();
}

export async function getUserBudgets(userId) {
  return await db.select().from(budgets).where(eq(budgets.userId, userId));
}

export async function getBudgetById(budgetId) {
  return await db.select().from(budgets).where(eq(budgets.id, budgetId));
}

export async function updateBudget(budgetId, updateData) {
  return await db.update(budgets)
    .set({ ...updateData, updatedAt: new Date() })
    .where(eq(budgets.id, budgetId))
    .returning();
}

// Expense operations
export async function createExpense(userId, expenseData) {
  return await db.insert(expenses).values({
    userId,
    ...expenseData,
  }).returning();
}

export async function getUserExpenses(userId) {
  return await db.select().from(expenses).where(eq(expenses.userId, userId));
}

export async function getExpensesByBudget(budgetId) {
  return await db.select().from(expenses).where(eq(expenses.budgetId, budgetId));
}

export async function updateExpense(expenseId, updateData) {
  return await db.update(expenses)
    .set({ ...updateData, updatedAt: new Date() })
    .where(eq(expenses.id, expenseId))
    .returning();
} 
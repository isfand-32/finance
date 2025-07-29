import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema.js';

// Database connection
const connectionString = 'postgresql://neondb_owner:npg_ubR4Q3gUZYOJ@ep-noisy-mouse-a1tuaq3h.ap-southeast-1.aws.neon.tech/Expense-tracker?sslmode=require&channel_binding=require';
const client = postgres(connectionString);
export const db = drizzle(client, { schema });

// Export schema for migrations
export * from './schema.js'; 
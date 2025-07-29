import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './lib/db/schema.js',
  out: './lib/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgresql://neondb_owner:npg_ubR4Q3gUZYOJ@ep-noisy-mouse-a1tuaq3h.ap-southeast-1.aws.neon.tech/Expense-tracker?sslmode=require&channel_binding=require',
  },
}); 
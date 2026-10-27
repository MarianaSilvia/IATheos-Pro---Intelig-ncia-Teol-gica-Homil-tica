/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { relations } from 'drizzle-orm';
import { integer, numeric, pgTable, serial, text, timestamp, jsonb } from 'drizzle-orm/pg-core';

// Users table linked to Firebase Auth UID
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  displayName: text('display_name'),
  role: text('role').default('user'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Digital materials and store products (PDFs, eBooks, EBD magazines)
export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  category: text('category').notNull().default('livro'), // 'livro' | 'revista' | 'devocional'
  price: numeric('price', { precision: 10, scale: 2 }).notNull().default('0.00'),
  author: text('author'),
  pages: integer('pages'),
  coverUrl: text('cover_url'),
  fileUrl: text('file_url'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Annual Bible reading progress tracked per chapter
export const readingProgress = pgTable('reading_progress', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  userUid: text('user_uid').notNull(),
  book: text('book').notNull(),
  chapter: integer('chapter').notNull(),
  readAt: timestamp('read_at').defaultNow(),
});

// Saved sermon outlines, EBD lesson plans, and verse X-ray studies
export const savedStudies = pgTable('saved_studies', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  userUid: text('user_uid').notNull(),
  type: text('type').notNull(), // 'sermon' | 'ebd' | 'verse_xray'
  title: text('title').notNull(),
  biblicalText: text('biblical_text'),
  content: jsonb('content').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Subscriptions table for exclusive Annual Package (365 days access)
export const subscriptions = pgTable('subscriptions', {
  id: serial('id').primaryKey(),
  email: text('email').notNull(),
  customerName: text('customer_name'),
  plan: text('plan').notNull().default('annual'),
  status: text('status').notNull().default('active'), // 'active' | 'suspended' | 'expired'
  startedAt: timestamp('started_at').defaultNow(),
  expiresAt: timestamp('expires_at').notNull(),
  pricePaid: numeric('price_paid', { precision: 10, scale: 2 }).notNull().default('297.00'),
  paymentMethod: text('payment_method').default('PIX'), // 'PIX' | 'InfinitePay' | 'Cartão'
  transactionId: text('transaction_id'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  readingProgress: many(readingProgress),
  savedStudies: many(savedStudies),
}));

export const readingProgressRelations = relations(readingProgress, ({ one }) => ({
  user: one(users, {
    fields: [readingProgress.userId],
    references: [users.id],
  }),
}));

export const savedStudiesRelations = relations(savedStudies, ({ one }) => ({
  user: one(users, {
    fields: [savedStudies.userId],
    references: [users.id],
  }),
}));


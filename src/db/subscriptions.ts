/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { eq, desc } from 'drizzle-orm';
import { db, createPool } from './index.ts';
import { subscriptions } from './schema.ts';

export interface SubscriptionRecord {
  id: number;
  email: string;
  customerName: string | null;
  plan: string;
  status: 'active' | 'suspended' | 'expired';
  startedAt: Date | null;
  expiresAt: Date;
  pricePaid: string;
  paymentMethod: string | null;
  transactionId: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

// In-memory fallback if Cloud SQL is unreachable or during tests
const inMemorySubscriptions: SubscriptionRecord[] = [
  {
    id: 1,
    email: 'marianabsilva1987@gmail.com',
    customerName: 'Mariana Silva',
    plan: 'annual',
    status: 'active',
    startedAt: new Date(),
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    pricePaid: '297.00',
    paymentMethod: 'PIX',
    transactionId: 'PIX-IAT-2026-001',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    email: 'pastor.carlos@igreja.com.br',
    customerName: 'Pr. Carlos Eduardo',
    plan: 'annual',
    status: 'active',
    startedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    expiresAt: new Date(Date.now() + 335 * 24 * 60 * 60 * 1000),
    pricePaid: '297.00',
    paymentMethod: 'InfinitePay',
    transactionId: 'INF-2026-9812',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  },
  {
    id: 3,
    email: 'professora.elena@ebd.com.br',
    customerName: 'Prof. Elena Martins',
    plan: 'annual',
    status: 'suspended',
    startedAt: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000),
    expiresAt: new Date(Date.now() + 265 * 24 * 60 * 60 * 1000),
    pricePaid: '297.00',
    paymentMethod: 'Cartão',
    transactionId: 'CARD-5541-2',
    createdAt: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  },
  {
    id: 4,
    email: 'marcos.estudante@teologia.com',
    customerName: 'Marcos Aurelio',
    plan: 'annual',
    status: 'expired',
    startedAt: new Date(Date.now() - 400 * 24 * 60 * 60 * 1000),
    expiresAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
    pricePaid: '297.00',
    paymentMethod: 'PIX',
    transactionId: 'PIX-IAT-2025-778',
    createdAt: new Date(Date.now() - 400 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  },
];

let nextInMemoryId = 5;

/**
 * Ensures the PostgreSQL subscriptions table exists and is seeded.
 */
export async function ensureSubscriptionsTable(): Promise<void> {
  const pool = createPool();
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL,
        customer_name TEXT,
        plan TEXT NOT NULL DEFAULT 'annual',
        status TEXT NOT NULL DEFAULT 'active',
        started_at TIMESTAMP DEFAULT NOW(),
        expires_at TIMESTAMP NOT NULL,
        price_paid NUMERIC(10, 2) NOT NULL DEFAULT 297.00,
        payment_method TEXT DEFAULT 'PIX',
        transaction_id TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Check if initial customer exists
    const checkRes = await pool.query(`SELECT COUNT(*) FROM subscriptions;`);
    const count = parseInt(checkRes.rows[0].count, 10);
    if (count === 0) {
      const oneYearAhead = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
      await pool.query(
        `INSERT INTO subscriptions (email, customer_name, plan, status, expires_at, price_paid, payment_method, transaction_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`,
        [
          'marianabsilva1987@gmail.com',
          'Mariana Silva',
          'annual',
          'active',
          oneYearAhead,
          297.0,
          'PIX',
          'PIX-IAT-2026-001',
        ]
      );
      await pool.query(
        `INSERT INTO subscriptions (email, customer_name, plan, status, expires_at, price_paid, payment_method, transaction_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`,
        [
          'pastor.carlos@igreja.com.br',
          'Pr. Carlos Eduardo',
          'annual',
          'active',
          new Date(Date.now() + 335 * 24 * 60 * 60 * 1000),
          297.0,
          'InfinitePay',
          'INF-2026-9812',
        ]
      );
      console.log('Subscriptions table created and seeded in Cloud SQL.');
    }
  } catch (err) {
    console.warn('Could not auto-create subscriptions table in SQL pool (falling back to memory):', err);
  }
}

/**
 * Get all subscriptions for Admin panel
 */
export async function getAllSubscriptions(): Promise<SubscriptionRecord[]> {
  try {
    const list = await db.select().from(subscriptions).orderBy(desc(subscriptions.createdAt));
    if (list && list.length > 0) {
      return list as SubscriptionRecord[];
    }
  } catch (error) {
    console.warn('Fallback to in-memory subscriptions for list:', error);
  }
  return inMemorySubscriptions;
}

/**
 * Get active subscription status for a given customer email
 */
export async function getSubscriptionByEmail(email: string): Promise<{
  hasSubscription: boolean;
  isActive: boolean;
  subscription: SubscriptionRecord | null;
  daysRemaining: number;
}> {
  const normalizedEmail = email.toLowerCase().trim();
  let subRecord: SubscriptionRecord | null = null;

  try {
    const records = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.email, normalizedEmail))
      .orderBy(desc(subscriptions.expiresAt));

    if (records.length > 0) {
      subRecord = records[0] as SubscriptionRecord;
    }
  } catch (err) {
    console.warn('Error querying subscription by email, using memory store:', err);
    subRecord = inMemorySubscriptions.find((s) => s.email.toLowerCase() === normalizedEmail) || null;
  }

  if (!subRecord) {
    // If not found in DB check memory
    subRecord = inMemorySubscriptions.find((s) => s.email.toLowerCase() === normalizedEmail) || null;
  }

  if (!subRecord) {
    return {
      hasSubscription: false,
      isActive: false,
      subscription: null,
      daysRemaining: 0,
    };
  }

  const now = new Date();
  const expires = new Date(subRecord.expiresAt);
  const diffTime = expires.getTime() - now.getTime();
  const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  const isExpired = diffTime <= 0;
  const isActuallyActive = subRecord.status === 'active' && !isExpired;

  return {
    hasSubscription: true,
    isActive: isActuallyActive,
    subscription: subRecord,
    daysRemaining,
  };
}

/**
 * Create or activate annual subscription (365 days)
 */
export async function createOrRenewSubscription(data: {
  email: string;
  customerName?: string;
  paymentMethod?: string;
  transactionId?: string;
  pricePaid?: number;
}): Promise<SubscriptionRecord> {
  const normalizedEmail = data.email.toLowerCase().trim();
  const oneYearFromNow = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
  const price = data.pricePaid ? data.pricePaid.toFixed(2) : '297.00';
  const method = data.paymentMethod || 'PIX';
  const txId = data.transactionId || `TX-${Date.now()}`;

  // Update in-memory
  const existingIndex = inMemorySubscriptions.findIndex(
    (s) => s.email.toLowerCase() === normalizedEmail
  );

  const updatedRecord: SubscriptionRecord = {
    id: existingIndex >= 0 ? inMemorySubscriptions[existingIndex].id : nextInMemoryId++,
    email: normalizedEmail,
    customerName: data.customerName || (existingIndex >= 0 ? inMemorySubscriptions[existingIndex].customerName : normalizedEmail.split('@')[0]),
    plan: 'annual',
    status: 'active',
    startedAt: new Date(),
    expiresAt: oneYearFromNow,
    pricePaid: price,
    paymentMethod: method,
    transactionId: txId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  if (existingIndex >= 0) {
    inMemorySubscriptions[existingIndex] = updatedRecord;
  } else {
    inMemorySubscriptions.unshift(updatedRecord);
  }

  try {
    const inserted = await db
      .insert(subscriptions)
      .values({
        email: normalizedEmail,
        customerName: updatedRecord.customerName,
        plan: 'annual',
        status: 'active',
        startedAt: new Date(),
        expiresAt: oneYearFromNow,
        pricePaid: price,
        paymentMethod: method,
        transactionId: txId,
      })
      .returning();

    if (inserted && inserted[0]) {
      return inserted[0] as SubscriptionRecord;
    }
  } catch (err) {
    console.warn('Failed to insert subscription into Cloud SQL, memory record saved:', err);
  }

  return updatedRecord;
}

/**
 * Update subscription status (e.g. suspend or reactivate)
 */
export async function updateSubscriptionStatus(
  id: number,
  status: 'active' | 'suspended' | 'expired'
): Promise<SubscriptionRecord | null> {
  const mem = inMemorySubscriptions.find((s) => s.id === id);
  if (mem) {
    mem.status = status;
    mem.updatedAt = new Date();
  }

  try {
    const updated = await db
      .update(subscriptions)
      .set({ status, updatedAt: new Date() })
      .where(eq(subscriptions.id, id))
      .returning();

    if (updated && updated[0]) {
      return updated[0] as SubscriptionRecord;
    }
  } catch (err) {
    console.warn('Failed to update subscription in Cloud SQL:', err);
  }

  return mem || null;
}

/**
 * Renew subscription for +365 days
 */
export async function renewSubscriptionForOneYear(id: number): Promise<SubscriptionRecord | null> {
  const oneYearFromNow = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

  const mem = inMemorySubscriptions.find((s) => s.id === id);
  if (mem) {
    mem.status = 'active';
    mem.expiresAt = oneYearFromNow;
    mem.updatedAt = new Date();
  }

  try {
    const updated = await db
      .update(subscriptions)
      .set({
        status: 'active',
        expiresAt: oneYearFromNow,
        updatedAt: new Date(),
      })
      .where(eq(subscriptions.id, id))
      .returning();

    if (updated && updated[0]) {
      return updated[0] as SubscriptionRecord;
    }
  } catch (err) {
    console.warn('Failed to renew subscription in Cloud SQL:', err);
  }

  return mem || null;
}

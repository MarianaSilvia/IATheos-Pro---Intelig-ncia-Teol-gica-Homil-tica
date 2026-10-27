/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';

test('Annual subscription calculation: 365 days expiration', () => {
  const now = new Date('2026-01-01T00:00:00Z');
  const oneYearFromNow = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);

  const diffMs = oneYearFromNow.getTime() - now.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  assert.equal(diffDays, 365, 'Annual package must grant exactly 365 days');
});

test('Days remaining calculation handles active vs expired status', () => {
  const now = Date.now();
  const futureExpiry = new Date(now + 120 * 24 * 60 * 60 * 1000).toISOString();
  const pastExpiry = new Date(now - 10 * 24 * 60 * 60 * 1000).toISOString();

  const getDays = (expStr: string) => {
    const diff = new Date(expStr).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  assert.ok(getDays(futureExpiry) > 0, 'Future expiration must have positive days remaining');
  assert.equal(getDays(pastExpiry), 0, 'Past expiration must yield 0 days remaining');
});

test('Webhook payload parser extracts customer email and amount correctly', () => {
  const payload1 = {
    email: 'pastor.marcos@igreja.com.br',
    amount: 297.00,
    payment_method: 'PIX',
    event: 'payment.succeeded',
  };

  const payload2 = {
    customer_email: 'lider.ebd@escola.com.br',
    total: 297.00,
    method: 'InfinitePay',
  };

  const parseWebhook = (data: any) => {
    const email = data.email || data.customer_email || data.payer?.email;
    const amount = Number(data.amount || data.total || 297.0);
    const method = data.payment_method || data.method || 'PIX';
    return { email, amount, method };
  };

  const res1 = parseWebhook(payload1);
  assert.equal(res1.email, 'pastor.marcos@igreja.com.br');
  assert.equal(res1.amount, 297.00);
  assert.equal(res1.method, 'PIX');

  const res2 = parseWebhook(payload2);
  assert.equal(res2.email, 'lider.ebd@escola.com.br');
  assert.equal(res2.amount, 297.00);
  assert.equal(res2.method, 'InfinitePay');
});

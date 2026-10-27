/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { desc, eq } from 'drizzle-orm';
import { db } from './index.ts';
import { products } from './schema.ts';

export interface NewProductInput {
  title: string;
  description?: string;
  category?: string;
  price: string;
  author?: string;
  pages?: number;
  coverUrl?: string;
  fileUrl?: string;
}

export async function getProducts() {
  try {
    return await db.select().from(products).orderBy(desc(products.createdAt));
  } catch (error) {
    console.error('Database getProducts failed:', error);
    throw new Error('Database operation failed. Please try again later.', { cause: error });
  }
}

export async function insertProduct(data: NewProductInput) {
  try {
    const result = await db
      .insert(products)
      .values({
        title: data.title,
        description: data.description || '',
        category: data.category || 'livro',
        price: data.price,
        author: data.author || '',
        pages: data.pages || 0,
        coverUrl: data.coverUrl || '',
        fileUrl: data.fileUrl || '',
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Database insertProduct failed:', error);
    throw new Error('Database operation failed. Please try again later.', { cause: error });
  }
}

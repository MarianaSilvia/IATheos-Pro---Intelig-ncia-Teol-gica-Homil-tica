/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { desc, eq, and } from 'drizzle-orm';
import { db } from './index.ts';
import { savedStudies, users } from './schema.ts';

export interface NewSavedStudyInput {
  userUid: string;
  type: 'sermon' | 'ebd' | 'verse_xray';
  title: string;
  biblicalText?: string;
  content: any;
}

export async function getSavedStudiesForUser(userUid: string) {
  try {
    return await db
      .select({
        id: savedStudies.id,
        type: savedStudies.type,
        title: savedStudies.title,
        biblicalText: savedStudies.biblicalText,
        content: savedStudies.content,
        createdAt: savedStudies.createdAt,
      })
      .from(savedStudies)
      .where(eq(savedStudies.userUid, userUid))
      .orderBy(desc(savedStudies.createdAt));
  } catch (error) {
    console.error('Database getSavedStudiesForUser failed:', error);
    throw new Error('Database operation failed. Please try again later.', { cause: error });
  }
}

export async function insertSavedStudy(data: NewSavedStudyInput) {
  try {
    // Find internal user ID
    const userRecords = await db.select({ id: users.id }).from(users).where(eq(users.uid, data.userUid)).limit(1);

    if (userRecords.length === 0) {
      throw new Error('User not found in database.');
    }

    const userId = userRecords[0].id;

    const result = await db
      .insert(savedStudies)
      .values({
        userId,
        userUid: data.userUid,
        type: data.type,
        title: data.title,
        biblicalText: data.biblicalText || '',
        content: data.content,
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Database insertSavedStudy failed:', error);
    throw new Error('Database operation failed. Please try again later.', { cause: error });
  }
}

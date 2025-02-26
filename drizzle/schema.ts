import {
  pgTable,
  foreignKey,
  unique,
  uuid,
  timestamp,
  varchar,
  integer,
  smallint,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const userNewsLetter = pgTable(
  'user_news_letter',
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    userId: uuid('user_id').notNull(),
    newsLetterId: uuid('news_letter_id').notNull(),
    openAt: timestamp('open_at', { mode: 'string' }).notNull(),
  },
  table => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: 'user_news_letter_user_id_users_id_fk',
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.newsLetterId],
      foreignColumns: [newsLetter.id],
      name: 'user_news_letter_news_letter_id_news_letter_id_fk',
    }).onDelete('cascade'),
    unique('user_news_letter_user_id_news_letter_id_unique').on(
      table.userId,
      table.newsLetterId,
    ),
  ],
);

export const newsLetter = pgTable('news_letter', {
  id: uuid().defaultRandom().primaryKey().notNull(),
  title: varchar({ length: 255 }).notNull(),
  sentAt: timestamp('sent_at', { mode: 'string' }).defaultNow().notNull(),
  utmCampaign: varchar('utm_campaign', { length: 255 }),
  utmSource: varchar('utm_source', { length: 255 }),
  utmMedium: varchar('utm_medium', { length: 255 }),
  utmChannel: varchar('utm_channel', { length: 255 }),
  createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
  url: varchar({ length: 255 }),
});

export const users = pgTable(
  'users',
  {
    id: uuid()
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
    email: varchar({ length: 55 }).notNull(),
    lastLogin: timestamp('last_login', { mode: 'string' })
      .defaultNow()
      .notNull(),
    dayStreak: integer('day_streak').default(0),
    createdAt: timestamp('created_at', { mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { mode: 'string' })
      .defaultNow()
      .notNull(),
    isAdmin: smallint('is_admin').default(0),
    name: varchar({ length: 255 }).default('user'),
  },
  table => [unique('users_email_unique').on(table.email)],
);

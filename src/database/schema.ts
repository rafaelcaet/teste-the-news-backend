import { uuid, varchar, timestamp, integer, unique } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import { pgTable } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id')
    .primaryKey()
    .default(sql`uuid_generate_v4()`),
  email: varchar('email', { length: 55 }).unique().notNull(),
  lastLogin: timestamp('last_login', { mode: 'date' }).defaultNow().notNull(),
  dayStreak: integer('day_streak').default(0),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
});

export const newsletters = pgTable('news_letter', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  sentAt: timestamp('sent_at', { mode: 'date' }).defaultNow().notNull(),
  utmCampaign: varchar('utm_campaign', { length: 255 }),
  utmSource: varchar('utm_source', { length: 255 }),
  utmMedium: varchar('utm_medium', { length: 255 }),
  utmChannel: varchar('utm_channel', { length: 255 }),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

export const userNewsletters = pgTable(
  'user_news_letter',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    newsletterId: uuid('news_letter_id')
      .notNull()
      .references(() => newsletters.id, { onDelete: 'cascade' }),
    openedAt: timestamp('open_at', { mode: 'date' }).notNull(),
  },
  table => ({
    uniqueUserNewsletter: unique().on(table.userId, table.newsletterId),
  }),
);

export const usersRelations = relations(users, ({ many }) => ({
  newsletters: many(userNewsletters),
}));

export const newslettersRelations = relations(newsletters, ({ many }) => ({
  userNewsletters: many(userNewsletters),
}));

export const userNewslettersRelations = relations(
  userNewsletters,
  ({ one }) => ({
    user: one(users, {
      fields: [userNewsletters.userId],
      references: [users.id],
    }),
    newsletter: one(newsletters, {
      fields: [userNewsletters.newsletterId],
      references: [newsletters.id],
    }),
  }),
);

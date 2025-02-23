import { relations } from "drizzle-orm/relations";
import { users, userNewsLetter, newsLetter } from "./schema";

export const userNewsLetterRelations = relations(userNewsLetter, ({one}) => ({
	user: one(users, {
		fields: [userNewsLetter.userId],
		references: [users.id]
	}),
	newsLetter: one(newsLetter, {
		fields: [userNewsLetter.newsLetterId],
		references: [newsLetter.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	userNewsLetters: many(userNewsLetter),
}));

export const newsLetterRelations = relations(newsLetter, ({many}) => ({
	userNewsLetters: many(userNewsLetter),
}));
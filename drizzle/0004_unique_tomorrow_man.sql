CREATE TABLE "news_letter" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"sent_at" timestamp DEFAULT now() NOT NULL,
	"utm_campaign" varchar(255),
	"utm_source" varchar(255),
	"utm_medium" varchar(255),
	"utm_channel" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_news_letter" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"news_letter_id" uuid NOT NULL,
	"open_at" timestamp NOT NULL,
	CONSTRAINT "user_news_letter_user_id_news_letter_id_unique" UNIQUE("user_id","news_letter_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"email" varchar(55) NOT NULL,
	"last_login" timestamp DEFAULT now() NOT NULL,
	"day_streak" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DROP TABLE "my_schema.news_letter" CASCADE;--> statement-breakpoint
DROP TABLE "my_schema.user_news_letter" CASCADE;--> statement-breakpoint
DROP TABLE "my_schema.users" CASCADE;--> statement-breakpoint
ALTER TABLE "user_news_letter" ADD CONSTRAINT "user_news_letter_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_news_letter" ADD CONSTRAINT "user_news_letter_news_letter_id_news_letter_id_fk" FOREIGN KEY ("news_letter_id") REFERENCES "public"."news_letter"("id") ON DELETE cascade ON UPDATE no action;
/*
  Warnings:

  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "day_streak" SET DEFAULT 0,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "users_id_seq";

-- CreateTable
CREATE TABLE "user_news_letter" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "news_letter_id" TEXT NOT NULL,
    "open_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_news_letter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "news_letter" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "news_letter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_news_letter_user_id_news_letter_id_key" ON "user_news_letter"("user_id", "news_letter_id");

-- AddForeignKey
ALTER TABLE "user_news_letter" ADD CONSTRAINT "user_news_letter_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_news_letter" ADD CONSTRAINT "user_news_letter_news_letter_id_fkey" FOREIGN KEY ("news_letter_id") REFERENCES "news_letter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

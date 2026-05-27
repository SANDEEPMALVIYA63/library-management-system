/*
  Warnings:

  - The values [inactive] on the enum `bookstatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `issued_by_user_id` on the `rental` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `rental` table. All the data in the column will be lost.
  - The `status` column on the `rental` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `role` column on the `user` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `registry` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `language` on the `book` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `category` on the `book` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `memberId` to the `rental` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rental_days` to the `rental` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `rental` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "USERTYPE" AS ENUM ('LIBRARIAN', 'USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "BOOKCATEGORY" AS ENUM ('GEOGRAPHY', 'BIOGRAPHY', 'POLITICAL_SCIENCE', 'MEDICAL', 'HISTORY', 'SCIENCE', 'TECHNOLOGY', 'PHILOSOPHY', 'BUSINESS', 'RELIGION', 'OTHER');

-- CreateEnum
CREATE TYPE "LANGUAGETYPE" AS ENUM ('ENGLISH', 'HINDI', 'MARATHI', 'GUJARATI', 'PUNJABI', 'BENGALI', 'TAMIL', 'TELUGU', 'KANNADA', 'MALAYALAM');

-- CreateEnum
CREATE TYPE "RENTALSTATUS" AS ENUM ('RENTED', 'RETURNED', 'OVERDUE');

-- CreateEnum
CREATE TYPE "MEBMERSTATUS" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');

-- AlterEnum
BEGIN;
CREATE TYPE "bookstatus_new" AS ENUM ('active', 'rentad', 'delete');
ALTER TABLE "public"."book" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "book" ALTER COLUMN "status" TYPE "bookstatus_new" USING ("status"::text::"bookstatus_new");
ALTER TYPE "bookstatus" RENAME TO "bookstatus_old";
ALTER TYPE "bookstatus_new" RENAME TO "bookstatus";
DROP TYPE "public"."bookstatus_old";
ALTER TABLE "book" ALTER COLUMN "status" SET DEFAULT 'active';
COMMIT;

-- DropForeignKey
ALTER TABLE "registry" DROP CONSTRAINT "registry_book_id_fkey";

-- DropForeignKey
ALTER TABLE "registry" DROP CONSTRAINT "registry_rental_id_fkey";

-- DropForeignKey
ALTER TABLE "registry" DROP CONSTRAINT "registry_user_id_fkey";

-- DropForeignKey
ALTER TABLE "rental" DROP CONSTRAINT "rental_issued_by_user_id_fkey";

-- DropForeignKey
ALTER TABLE "rental" DROP CONSTRAINT "rental_user_id_fkey";

-- DropIndex
DROP INDEX "rental_user_id_idx";

-- AlterTable
ALTER TABLE "book" DROP COLUMN "language",
ADD COLUMN     "language" "LANGUAGETYPE" NOT NULL,
DROP COLUMN "category",
ADD COLUMN     "category" "BOOKCATEGORY" NOT NULL;

-- AlterTable
ALTER TABLE "rental" DROP COLUMN "issued_by_user_id",
DROP COLUMN "user_id",
ADD COLUMN     "memberId" INTEGER NOT NULL,
ADD COLUMN     "rental_days" INTEGER NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "RENTALSTATUS" NOT NULL DEFAULT 'RENTED';

-- AlterTable
ALTER TABLE "user" DROP COLUMN "role",
ADD COLUMN     "role" "USERTYPE" NOT NULL DEFAULT 'USER';

-- DropTable
DROP TABLE "registry";

-- DropEnum
DROP TYPE "BookCategory";

-- DropEnum
DROP TYPE "LanguageType";

-- DropEnum
DROP TYPE "RentalStatus";

-- DropEnum
DROP TYPE "UserType";

-- CreateTable
CREATE TABLE "member" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "member_id" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "status" "MEBMERSTATUS" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "member_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "member_member_id_key" ON "member"("member_id");

-- CreateIndex
CREATE UNIQUE INDEX "member_email_key" ON "member"("email");

-- CreateIndex
CREATE UNIQUE INDEX "member_mobile_key" ON "member"("mobile");

-- CreateIndex
CREATE INDEX "member_email_idx" ON "member"("email");

-- CreateIndex
CREATE INDEX "member_mobile_idx" ON "member"("mobile");

-- CreateIndex
CREATE INDEX "member_member_id_idx" ON "member"("member_id");

-- CreateIndex
CREATE INDEX "book_category_idx" ON "book"("category");

-- CreateIndex
CREATE INDEX "book_language_idx" ON "book"("language");

-- CreateIndex
CREATE INDEX "rental_memberId_idx" ON "rental"("memberId");

-- CreateIndex
CREATE INDEX "rental_userId_idx" ON "rental"("userId");

-- CreateIndex
CREATE INDEX "rental_status_idx" ON "rental"("status");

-- AddForeignKey
ALTER TABLE "rental" ADD CONSTRAINT "rental_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rental" ADD CONSTRAINT "rental_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member" ADD CONSTRAINT "member_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

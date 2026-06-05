-- CreateEnum
CREATE TYPE "Category" AS ENUM ('TECH', 'MUSIC', 'AGRICULTURE', 'BUSINESS', 'SPORTS', 'EDUCATION');

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "category" "Category";

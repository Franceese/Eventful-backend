/*
  Warnings:

  - Added the required column `capacity` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Made the column `category` on table `Event` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Event"
ADD COLUMN "capacity" INTEGER NOT NULL DEFAULT 100;

ALTER TABLE "Event"
ALTER COLUMN "category" SET NOT NULL;

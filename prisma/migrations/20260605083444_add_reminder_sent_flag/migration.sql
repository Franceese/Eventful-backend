-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "capacity" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Reminder" ADD COLUMN     "isSent" BOOLEAN NOT NULL DEFAULT false;

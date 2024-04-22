/*
  Warnings:

  - You are about to drop the column `taskStatus` on the `Task` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Task" DROP COLUMN "taskStatus";

-- DropEnum
DROP TYPE "TaskStatus";

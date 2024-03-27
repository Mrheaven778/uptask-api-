/*
  Warnings:

  - The `taskStatus` column on the `Task` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('pending', 'onHold', 'inProgress', 'underReview', 'completed');

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "taskStatus",
ADD COLUMN     "taskStatus" "TaskStatus"[];

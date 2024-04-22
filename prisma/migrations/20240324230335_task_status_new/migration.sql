/*
  Warnings:

  - Added the required column `taskStatus` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('pending', 'onHold', 'inProgress', 'underReview', 'completed');

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "taskStatus" "TaskStatus" NOT NULL;

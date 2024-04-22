/*
  Warnings:

  - Added the required column `teamProjectId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "teamProjectId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_teamProjectId_fkey" FOREIGN KEY ("teamProjectId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

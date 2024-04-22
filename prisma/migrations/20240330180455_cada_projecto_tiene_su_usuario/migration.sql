/*
  Warnings:

  - You are about to drop the column `mangerId` on the `Post` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[managerId]` on the table `Post` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `managerId` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_mangerId_fkey";

-- DropIndex
DROP INDEX "Post_mangerId_key";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "mangerId",
ADD COLUMN     "managerId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Post_managerId_key" ON "Post"("managerId");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

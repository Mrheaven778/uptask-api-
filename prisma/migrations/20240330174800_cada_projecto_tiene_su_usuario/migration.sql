/*
  Warnings:

  - A unique constraint covering the columns `[mangerId]` on the table `Post` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `mangerId` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "mangerId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Post_mangerId_key" ON "Post"("mangerId");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_mangerId_fkey" FOREIGN KEY ("mangerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

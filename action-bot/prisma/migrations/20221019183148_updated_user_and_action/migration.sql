/*
  Warnings:

  - You are about to drop the column `name` on the `Action` table. All the data in the column will be lost.
  - Added the required column `city` to the `Action` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endDay` to the `Action` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDay` to the `Action` table without a default value. This is not possible if the table is not empty.
  - Added the required column `text` to the `Action` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Action` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Action" DROP COLUMN "name",
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "endDay" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startDay" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "text" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "userId" INTEGER;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "categories" TEXT[];

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "Action_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

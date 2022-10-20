/*
  Warnings:

  - You are about to drop the column `field` on the `Action` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Action` table. All the data in the column will be lost.
  - Added the required column `category` to the `Action` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Action` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Action" DROP COLUMN "field",
DROP COLUMN "name",
ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;

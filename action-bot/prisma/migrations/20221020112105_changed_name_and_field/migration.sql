/*
  Warnings:

  - You are about to drop the column `category` on the `Action` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Action` table. All the data in the column will be lost.
  - Added the required column `field` to the `Action` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Action` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Action" DROP COLUMN "category",
DROP COLUMN "title",
ADD COLUMN     "field" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;

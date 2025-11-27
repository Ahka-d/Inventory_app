/*
  Warnings:

  - You are about to drop the column `categoryId` on the `item` table. All the data in the column will be lost.
  - You are about to drop the `classification` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `category_id` to the `item` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "item" DROP CONSTRAINT "item_categoryId_fkey";

-- AlterTable
ALTER TABLE "item" DROP COLUMN "categoryId",
ADD COLUMN     "category_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "classification";

-- CreateTable
CREATE TABLE "category" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "item" ADD CONSTRAINT "item_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

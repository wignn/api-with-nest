/*
  Warnings:

  - You are about to drop the column `bookId` on the `Genre` table. All the data in the column will be lost.
  - Added the required column `cover` to the `Book` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Genre" DROP CONSTRAINT "Genre_bookId_fkey";

-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "asset" TEXT,
ADD COLUMN     "cover" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Genre" DROP COLUMN "bookId";

-- CreateTable
CREATE TABLE "BookGenre" (
    "bookId" TEXT NOT NULL,
    "genreId" TEXT NOT NULL,

    CONSTRAINT "BookGenre_pkey" PRIMARY KEY ("bookId","genreId")
);

-- AddForeignKey
ALTER TABLE "BookGenre" ADD CONSTRAINT "BookGenre_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookGenre" ADD CONSTRAINT "BookGenre_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "Genre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

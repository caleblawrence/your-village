/*
  Warnings:

  - The migration will add a unique constraint covering the columns `[date,requestedByUserId]` on the table `Opportunity`. If there are existing duplicate values, the migration will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "date_requestedByUserId_unique_constraint" ON "Opportunity"("date", "requestedByUserId");

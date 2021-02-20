/*
  Warnings:

  - The migration will add a unique constraint covering the columns `[sentByUserId,requestedUserId]` on the table `UserFriendRequests`. If there are existing duplicate values, the migration will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "sentByUser_requestedUser_unique_constraint" ON "UserFriendRequests"("sentByUserId", "requestedUserId");

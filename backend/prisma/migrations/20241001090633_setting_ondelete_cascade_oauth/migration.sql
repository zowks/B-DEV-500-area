-- DropForeignKey
ALTER TABLE "google_oauth" DROP CONSTRAINT "google_oauth_users_id_fkey";

-- AddForeignKey
ALTER TABLE "google_oauth" ADD CONSTRAINT "google_oauth_users_id_fkey" FOREIGN KEY ("users_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

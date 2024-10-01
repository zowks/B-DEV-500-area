-- CreateTable
CREATE TABLE "google_oauth" (
    "id" SERIAL NOT NULL,
    "access_token" TEXT NOT NULL,
    "expires_at" TIMESTAMP NOT NULL,
    "users_id" UUID NOT NULL,

    CONSTRAINT "google_oauth_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "google_oauth_access_token_key" ON "google_oauth"("access_token");

-- AddForeignKey
ALTER TABLE "google_oauth" ADD CONSTRAINT "google_oauth_users_id_fkey" FOREIGN KEY ("users_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

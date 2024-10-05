-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" VARCHAR(254) NOT NULL,
    "hashed_password" VARCHAR(255) NOT NULL,
    "firstname" VARCHAR(255) NOT NULL,
    "lastname" VARCHAR(255) NOT NULL,
    "is_admin" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "google_oauth" (
    "id" SERIAL NOT NULL,
    "access_token" TEXT NOT NULL,
    "refresh_token" TEXT NOT NULL,
    "expires_at" TIMESTAMP NOT NULL,
    "scope" TEXT NOT NULL,
    "users_id" UUID NOT NULL,

    CONSTRAINT "google_oauth_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_id_key" ON "users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "google_oauth_access_token_key" ON "google_oauth"("access_token");

-- CreateIndex
CREATE UNIQUE INDEX "google_oauth_refresh_token_key" ON "google_oauth"("refresh_token");

-- AddForeignKey
ALTER TABLE "google_oauth" ADD CONSTRAINT "google_oauth_users_id_fkey" FOREIGN KEY ("users_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

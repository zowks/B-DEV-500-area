-- CreateEnum
CREATE TYPE "area_status" AS ENUM ('RUNNING', 'STOPPED', 'ERROR');

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
CREATE TABLE "oauth_credentials" (
    "id" SERIAL NOT NULL,
    "access_token" TEXT NOT NULL,
    "refresh_token" TEXT NOT NULL,
    "expires_at" TIMESTAMP NOT NULL,
    "scope" TEXT NOT NULL,
    "revoke_url" TEXT NOT NULL,
    "token_url" TEXT NOT NULL,
    "users_id" UUID NOT NULL,

    CONSTRAINT "oauth_credentials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "areas" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "action_id" VARCHAR(255) NOT NULL,
    "reaction_id" VARCHAR(255) NOT NULL,
    "reaction_body" JSONB,
    "reaction_fields" JSONB NOT NULL,
    "delay" INTEGER NOT NULL,
    "status" "area_status" NOT NULL DEFAULT 'STOPPED',
    "oauth_credential_id" INTEGER
);

-- CreateIndex
CREATE UNIQUE INDEX "users_id_key" ON "users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "oauth_credentials_access_token_key" ON "oauth_credentials"("access_token");

-- CreateIndex
CREATE UNIQUE INDEX "oauth_credentials_refresh_token_key" ON "oauth_credentials"("refresh_token");

-- CreateIndex
CREATE UNIQUE INDEX "areas_id_key" ON "areas"("id");

-- AddForeignKey
ALTER TABLE "oauth_credentials" ADD CONSTRAINT "oauth_credentials_users_id_fkey" FOREIGN KEY ("users_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "areas" ADD CONSTRAINT "areas_oauth_credential_id_fkey" FOREIGN KEY ("oauth_credential_id") REFERENCES "oauth_credentials"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isIdentityVerified" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "isVerified" SET DEFAULT false;

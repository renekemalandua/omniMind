-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "identityNumber" DROP NOT NULL;

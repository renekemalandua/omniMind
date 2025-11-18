-- CreateEnum
CREATE TYPE "VerificationStatusLA" AS ENUM ('pending', 'approved', 'rejected');

-- AlterTable
ALTER TABLE "LarAngolaUser" ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "verificationData" JSONB,
ADD COLUMN     "verificationStatus" "VerificationStatusLA" NOT NULL DEFAULT 'pending';

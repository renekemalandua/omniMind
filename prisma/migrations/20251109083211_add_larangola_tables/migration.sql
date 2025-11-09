-- CreateEnum
CREATE TYPE "public"."TransactionTypeLA" AS ENUM ('rent', 'sale');

-- CreateEnum
CREATE TYPE "public"."ListingStatusLA" AS ENUM ('active', 'inactive');

-- CreateEnum
CREATE TYPE "public"."LarAngolaUserRole" AS ENUM ('intermediary', 'client');

-- CreateTable
CREATE TABLE "public"."PropertyCategoryLA" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PropertyCategoryLA_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PropertyLA" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "bedrooms" INTEGER,
    "bathrooms" INTEGER,
    "areaSqm" DOUBLE PRECISION,
    "amenities" JSONB,
    "images" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PropertyLA_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ListingLA" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "transactionType" "public"."TransactionTypeLA" NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'AOA',
    "status" "public"."ListingStatusLA" NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ListingLA_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."InquiryLA" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "userId" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InquiryLA_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LarAngolaUser" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "public"."LarAngolaUserRole" NOT NULL,
    "fullName" TEXT NOT NULL,
    "phone" TEXT,
    "city" TEXT,
    "preferences" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LarAngolaUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LarAngolaUser_userId_key" ON "public"."LarAngolaUser"("userId");

-- AddForeignKey
ALTER TABLE "public"."PropertyLA" ADD CONSTRAINT "PropertyLA_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."LarAngolaUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PropertyLA" ADD CONSTRAINT "PropertyLA_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."PropertyCategoryLA"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ListingLA" ADD CONSTRAINT "ListingLA_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "public"."PropertyLA"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ListingLA" ADD CONSTRAINT "ListingLA_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."LarAngolaUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InquiryLA" ADD CONSTRAINT "InquiryLA_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "public"."ListingLA"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InquiryLA" ADD CONSTRAINT "InquiryLA_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."LarAngolaUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LarAngolaUser" ADD CONSTRAINT "LarAngolaUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

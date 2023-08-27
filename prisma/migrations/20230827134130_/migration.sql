-- CreateEnum
CREATE TYPE "languages" AS ENUM ('EN_US', 'PT_BR');

-- CreateEnum
CREATE TYPE "status" AS ENUM ('REQUEST_RECEIVED', 'AWAITING_PAYMENT', 'REJECTED_PAYMENT', 'PAYMENT_ACCEPTED', 'IN_PREPARATION', 'WAITING_FOR_DELIVERY', 'OUT_FOR_DELIVERY', 'CUSTOMER_DID_NOT_ANSWER', 'DELIVERED');

-- CreateEnum
CREATE TYPE "usersType" AS ENUM ('GLOBAL_OWNER', 'GLOBAL_MANAGER', 'GLOBAL_EMPLOYEE', 'GLOBAL_TRAINEE');

-- CreateEnum
CREATE TYPE "usersPermission" AS ENUM ('SELLER_OWNER', 'SELLER_MANAGER', 'SELLER_EMPLOYEE', 'SELLER_TRAINEE');

-- CreateEnum
CREATE TYPE "ratings" AS ENUM ('VERY_BAD', 'BAD', 'MEDIUM', 'GOOD', 'VERY_GOOD');

-- CreateTable
CREATE TABLE "addresses" (
    "id" UUID NOT NULL,
    "street" TEXT NOT NULL,
    "addressNumber" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "complement" TEXT,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" UUID NOT NULL,
    "loggedIn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "loggedOutAt" TIMESTAMP(3),
    "tokens" TEXT[],
    "userId" UUID NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "type" "usersType",
    "balance" INTEGER NOT NULL DEFAULT 0,
    "nivel" INTEGER NOT NULL DEFAULT 1,
    "experience" INTEGER NOT NULL DEFAULT 0,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "description" TEXT,
    "email" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "imageUri" TEXT,
    "darkMode" BOOLEAN NOT NULL DEFAULT false,
    "language" "languages" NOT NULL DEFAULT 'PT_BR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "disabledAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "addressId" UUID NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchases" (
    "id" UUID NOT NULL,
    "status" "status" NOT NULL,
    "rating" "ratings",
    "totalPrice" INTEGER NOT NULL DEFAULT 0,
    "userId" UUID NOT NULL,
    "storeId" UUID NOT NULL,

    CONSTRAINT "purchases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "disabledAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "type" "usersPermission",
    "userId" UUID,
    "storeId" UUID,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stores" (
    "id" UUID NOT NULL,
    "corporateName" TEXT NOT NULL,
    "tradingName" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "disabledAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "addressId" UUID NOT NULL,

    CONSTRAINT "stores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assessments" (
    "id" UUID NOT NULL,
    "value" INTEGER NOT NULL DEFAULT 5,
    "comment" TEXT,
    "userId" UUID NOT NULL,
    "purchaseId" UUID NOT NULL,
    "storeId" UUID NOT NULL,

    CONSTRAINT "assessments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversations" (
    "id" UUID NOT NULL,
    "storeId" UUID,

    CONSTRAINT "conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CategoryToStore" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_ConversationToUser" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "addresses_id_key" ON "addresses"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Session_id_key" ON "Session"("id");

-- CreateIndex
CREATE UNIQUE INDEX "users_id_key" ON "users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_login_key" ON "users"("login");

-- CreateIndex
CREATE UNIQUE INDEX "users_addressId_key" ON "users"("addressId");

-- CreateIndex
CREATE UNIQUE INDEX "purchases_id_key" ON "purchases"("id");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_id_key" ON "permissions"("id");

-- CreateIndex
CREATE UNIQUE INDEX "stores_id_key" ON "stores"("id");

-- CreateIndex
CREATE UNIQUE INDEX "stores_corporateName_key" ON "stores"("corporateName");

-- CreateIndex
CREATE UNIQUE INDEX "stores_cnpj_key" ON "stores"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "stores_identifier_key" ON "stores"("identifier");

-- CreateIndex
CREATE UNIQUE INDEX "stores_addressId_key" ON "stores"("addressId");

-- CreateIndex
CREATE UNIQUE INDEX "assessments_id_key" ON "assessments"("id");

-- CreateIndex
CREATE UNIQUE INDEX "assessments_purchaseId_key" ON "assessments"("purchaseId");

-- CreateIndex
CREATE UNIQUE INDEX "categories_id_key" ON "categories"("id");

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "conversations_id_key" ON "conversations"("id");

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryToStore_AB_unique" ON "_CategoryToStore"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryToStore_B_index" ON "_CategoryToStore"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ConversationToUser_AB_unique" ON "_ConversationToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ConversationToUser_B_index" ON "_ConversationToUser"("B");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permissions" ADD CONSTRAINT "permissions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permissions" ADD CONSTRAINT "permissions_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stores" ADD CONSTRAINT "stores_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_purchaseId_fkey" FOREIGN KEY ("purchaseId") REFERENCES "purchases"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToStore" ADD CONSTRAINT "_CategoryToStore_A_fkey" FOREIGN KEY ("A") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToStore" ADD CONSTRAINT "_CategoryToStore_B_fkey" FOREIGN KEY ("B") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ConversationToUser" ADD CONSTRAINT "_ConversationToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ConversationToUser" ADD CONSTRAINT "_ConversationToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
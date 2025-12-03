-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "invoiceLink" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "dueDate" TIMESTAMP(3) NOT NULL,
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Invoice_status_idx" ON "Invoice"("status");

-- CreateIndex
CREATE INDEX "Invoice_customerEmail_idx" ON "Invoice"("customerEmail");

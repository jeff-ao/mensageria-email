-- CreateTable
CREATE TABLE "Img_imovel" (
    "id" SERIAL NOT NULL,
    "imovelId" INTEGER NOT NULL,
    "arquivo" BYTEA NOT NULL,
    "formato" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Img_imovel_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Img_imovel" ADD CONSTRAINT "Img_imovel_imovelId_fkey" FOREIGN KEY ("imovelId") REFERENCES "Imoveis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "ImgTemp" (
    "id" SERIAL NOT NULL,
    "blob" BYTEA NOT NULL,
    "imovelId" INTEGER NOT NULL,
    "terminou" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ImgTemp_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ImgTemp" ADD CONSTRAINT "ImgTemp_imovelId_fkey" FOREIGN KEY ("imovelId") REFERENCES "Imoveis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

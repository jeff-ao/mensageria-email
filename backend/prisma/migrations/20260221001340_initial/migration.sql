-- CreateTable
CREATE TABLE "Clientes" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Corretores" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Corretores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Imoveis" (
    "id" SERIAL NOT NULL,
    "tipo" TEXT NOT NULL,
    "corretorId" INTEGER NOT NULL,
    "metragem" DOUBLE PRECISION NOT NULL,
    "bairro" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Imoveis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Interesses" (
    "id" SERIAL NOT NULL,
    "clienteId" INTEGER NOT NULL,
    "metragem" DOUBLE PRECISION NOT NULL,
    "bairro" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Interesses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Clientes_email_key" ON "Clientes"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Corretores_email_key" ON "Corretores"("email");

-- AddForeignKey
ALTER TABLE "Imoveis" ADD CONSTRAINT "Imoveis_corretorId_fkey" FOREIGN KEY ("corretorId") REFERENCES "Corretores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interesses" ADD CONSTRAINT "Interesses_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

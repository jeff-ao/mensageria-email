import { prisma } from "./src/lib/prisma";

async function seed() {
  const cliente = await prisma.clientes.create({
    data: {
      email: "marcelamartinstec@gmail.com",
      name: "Marcela",
    },
  });

  console.log("Cliente criado:", cliente);

  const interesse = await prisma.interesses.create({
    data: {
      clienteId: cliente.id,
      metragem: 80.0,
      bairro: "Centro",
    },
  });

  console.log("Interesse criado:", interesse);

  const corretor = await prisma.corretores.create({
    data: {
      email: "corretor@email.com",
      name: "Corretor Teste",
    },
  });

  console.log("Corretor criado:", corretor);
}

seed()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

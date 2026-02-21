import { prisma } from "../src/lib/prisma";

async function main() {
  // Criar 2 clientes
  const cliente1 = await prisma.clientes.create({
    data: {
      email: "joao.silva@email.com",
      name: "João Silva",
    },
  });

  const cliente2 = await prisma.clientes.create({
    data: {
      email: "maria.santos@email.com",
      name: "Maria Santos",
    },
  });

  console.log("Clientes criados:", { cliente1, cliente2 });

  // Criar 3 corretores
  const corretor1 = await prisma.corretores.create({
    data: {
      email: "carlos.pereira@imobiliaria.com",
      name: "Carlos Pereira",
    },
  });

  const corretor2 = await prisma.corretores.create({
    data: {
      email: "ana.costa@imobiliaria.com",
      name: "Ana Costa",
    },
  });

  const corretor3 = await prisma.corretores.create({
    data: {
      email: "pedro.oliveira@imobiliaria.com",
      name: "Pedro Oliveira",
    },
  });

  console.log("Corretores criados:", { corretor1, corretor2, corretor3 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

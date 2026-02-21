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

  // Criar 2 interesses para o cliente 1
  const interesse1Cliente1 = await prisma.interesses.create({
    data: {
      clienteId: cliente1.id,
      metragem: 80.0,
      bairro: "Centro",
    },
  });

  const interesse2Cliente1 = await prisma.interesses.create({
    data: {
      clienteId: cliente1.id,
      metragem: 120.0,
      bairro: "Jardins",
    },
  });

  // Criar 2 interesses para o cliente 2
  const interesse1Cliente2 = await prisma.interesses.create({
    data: {
      clienteId: cliente2.id,
      metragem: 100.0,
      bairro: "Boa Vista",
    },
  });

  const interesse2Cliente2 = await prisma.interesses.create({
    data: {
      clienteId: cliente2.id,
      metragem: 150.0,
      bairro: "Centro",
    },
  });

  console.log("Interesses criados:", {
    interesse1Cliente1,
    interesse2Cliente1,
    interesse1Cliente2,
    interesse2Cliente2,
  });

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

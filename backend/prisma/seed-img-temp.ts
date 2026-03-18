import "dotenv/config";
import sharp from "sharp";
import { prisma } from "../src/lib/prisma";
import { RabbitMQConnection } from "../src/config/rabbitmq";

const IMG_QUEUE = "processa-imagem";
const TEST_CLIENT_EMAIL = "jvinicius7337@gmail.com";
const TEST_CLIENT_NAME = "Joao Vinicius Teste";
const TEST_BAIRRO = "Centro";
const TEST_METRAGEM = 95;

type SampleImage = {
  label: string;
  width: number;
  height: number;
  color: { r: number; g: number; b: number; alpha: number };
};

const sampleImages: SampleImage[] = [
  {
    label: "skyline-azul",
    width: 1200,
    height: 800,
    color: { r: 32, g: 74, b: 135, alpha: 1 },
  },
  {
    label: "torre-cinza",
    width: 1000,
    height: 1000,
    color: { r: 88, g: 96, b: 110, alpha: 1 },
  },
  {
    label: "predios-urbanos",
    width: 1400,
    height: 933,
    color: { r: 149, g: 94, b: 74, alpha: 1 },
  },
];

async function ensureImovelForTest(): Promise<{
  imovelId: number;
  bairro: string;
  metragem: number;
}> {
  let corretor = await prisma.corretores.findFirst({ where: { id: 1 } });

  if (!corretor) {
    corretor = await prisma.corretores.create({
      data: {
        name: "Corretor Seed Img",
        email: "corretor.seed.img@email.com",
      },
    });
    console.log("[seed-img-temp] Corretor criado:", { id: corretor.id });
  }

  const imovel = await prisma.imoveis.create({
    data: {
      tipo: "Apartamento",
      metragem: TEST_METRAGEM,
      bairro: TEST_BAIRRO,
      corretorId: corretor.id,
    },
  });

  console.log("[seed-img-temp] Imovel criado:", {
    imovelId: imovel.id,
    corretorId: corretor.id,
  });

  return {
    imovelId: imovel.id,
    bairro: imovel.bairro,
    metragem: imovel.metragem,
  };
}

async function ensureClienteInteresseForTest(bairro: string, metragem: number) {
  const cliente = await prisma.clientes.upsert({
    where: { email: TEST_CLIENT_EMAIL },
    update: { name: TEST_CLIENT_NAME },
    create: {
      email: TEST_CLIENT_EMAIL,
      name: TEST_CLIENT_NAME,
    },
  });

  const interesseExistente = await prisma.interesses.findFirst({
    where: {
      clienteId: cliente.id,
      bairro,
      metragem,
    },
  });

  if (!interesseExistente) {
    const interesse = await prisma.interesses.create({
      data: {
        clienteId: cliente.id,
        bairro,
        metragem,
      },
    });

    console.log("[seed-img-temp] Interesse criado para cliente de teste:", {
      interesseId: interesse.id,
      clienteId: cliente.id,
      email: cliente.email,
      bairro,
      metragem,
    });
  } else {
    console.log("[seed-img-temp] Interesse ja existia para cliente de teste:", {
      interesseId: interesseExistente.id,
      clienteId: cliente.id,
      email: cliente.email,
      bairro,
      metragem,
    });
  }
}

async function createBufferFromSample(sample: SampleImage): Promise<Buffer> {
  return sharp({
    create: {
      width: sample.width,
      height: sample.height,
      channels: 4,
      background: sample.color,
    },
  })
    .jpeg({ quality: 92 })
    .toBuffer();
}

async function main() {
  const { imovelId, bairro, metragem } = await ensureImovelForTest();

  await ensureClienteInteresseForTest(bairro, metragem);

  const rabbitmq = new RabbitMQConnection();
  await rabbitmq.connect();
  const channel = rabbitmq.getChannel();

  await channel.assertQueue(IMG_QUEUE, { durable: true });

  console.log("[seed-img-temp] Iniciando insercao em ImgTemp...");

  for (const sample of sampleImages) {
    const imageBuffer = await createBufferFromSample(sample);

    const imgTemp = await prisma.imgTemp.create({
      data: {
        blob: new Uint8Array(imageBuffer),
        imovelId,
        terminou: false,
      },
    });

    console.log("[seed-img-temp] ImgTemp inserida:", {
      imgTempId: imgTemp.id,
      imovelId,
      label: sample.label,
      bytes: imageBuffer.length,
      dimensoes: `${sample.width}x${sample.height}`,
    });

    channel.sendToQueue(
      IMG_QUEUE,
      Buffer.from(JSON.stringify({ id: imgTemp.id })),
      {
        persistent: true,
      },
    );

    console.log("[seed-img-temp] Mensagem enfileirada em processa-imagem:", {
      imgTempId: imgTemp.id,
    });
  }

  console.log("[seed-img-temp] Seed finalizado com sucesso.");

  await rabbitmq.disconnect();
}

main()
  .catch((error) => {
    console.error("[seed-img-temp] Erro durante seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

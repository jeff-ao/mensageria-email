import dotenv from "dotenv";
dotenv.config();
import { RabbitMQConnection } from "./config/rabbitmq";
import { PrismaClient } from "@prisma/client";
import sharp from "sharp";

/* const DEAD_LETTER_EXCHANGE = "processa_imagem-dlx";
const DEAD_LETTER_QUEUE = "imagens-falhas"; */
const QUEUE_NAME = "processa-imagem";
const prisma = new PrismaClient();

async function startWorker() {
  const rabbitmq = new RabbitMQConnection();
  await rabbitmq.connect();
  const channel = rabbitmq.getChannel();

  /*   await channel.assertExchange(DEAD_LETTER_EXCHANGE, "direct", {
    durable: true,
  }); */

  /*   await channel.assertQueue(DEAD_LETTER_QUEUE, { durable: true });
  await channel.bindQueue(DEAD_LETTER_QUEUE, DEAD_LETTER_EXCHANGE, "fail_key"); */

  await channel.assertQueue(QUEUE_NAME, {
    durable: true,
    /*   arguments: {
      "x-dead-letter-exchange": DEAD_LETTER_EXCHANGE,
      "x-dead-letter-routing-key": "fail_key",
    }, */
  });

  console.log("Worker aguardando mensagens na fila:", QUEUE_NAME);

  channel.consume(
    QUEUE_NAME,
    async (msg) => {
      if (msg) {
        const { id } = JSON.parse(msg.content.toString());

        try {
          const imagem = await prisma.imgTemp.findUnique({
            where: { id },
          });

          if (!imagem) {
            console.error("Imagem não encontrada no banco de dados:", id);
            throw new Error("Imagem não encontrada");
          } // dead letter

          const processedImageBuffer = await sharp(imagem.bytes)
            .resize(500, 500)
            .jpeg({ quality: 80 })
            .toBuffer();

          if (!processedImageBuffer) {
            console.error("Erro ao processar a imagem:", id);
            throw new Error("Erro ao processar a imagem");
          }

          await prisma.Img_imovel.create({
            data: {
              bytes: processedImageBuffer,
              imovelId: imagem.imovelId,
              formato: "jpeg",
            },
          });

          await prisma.imgTemp.update({
            where: { id },
            data: { terminou: "true" },
          });

          const todasTerminaram = await prisma.imgTemp.findMany({
            where: {
              imovelId: imagem.imovelId,
              terminou: "false",
            },
          });

          if (todasTerminaram.length === 0) {
            await prisma.imgTemp.delete({
              where: { imovelId: imagem.imovelId },
            });

            const imovel = await prisma.imovel.findUnique({
              where: { id: imagem.imovelId },
              select: {
                tipo: true,
                metragem: true,
                bairro: true,
              },
            });
            const clientes = await prisma.cliente.findMany({
              where: {
                preferencias: {
                  bairro: imovel?.bairro,
                },
              },
            });

            for (const cliente of clientes) {
              const emailData = {
                email: cliente.email,
                imovel: {
                  tipo: imovel?.tipo,
                  metragem: imovel?.metragem,
                  bairro: imovel?.bairro,
                },
              };

              channel.sendToQueue(
                "envia-email",
                Buffer.from(JSON.stringify(emailData)),
              );
            }
          }

          channel.ack(msg);
        } catch (error) {
          console.error("Erro ao processar mensagem:", error);

          await prisma.imgTemp.updateMany({
            where: { id: id },
            data: { terminou: "true" },
          });
          channel.nack(msg, false, false);
        }
      }
    },
    { noAck: false },
  );
}

await startWorker();

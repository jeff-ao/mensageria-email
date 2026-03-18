import dotenv from "dotenv";
dotenv.config();
import { RabbitMQConnection } from "./config/rabbitmq";
import { prisma } from "./lib/prisma";
import sharp from "sharp";

/* const DEAD_LETTER_EXCHANGE = "processa_imagem-dlx";
const DEAD_LETTER_QUEUE = "imagens-falhas"; */
const QUEUE_NAME = "processa-imagem";
const EMAIL_QUEUE = "envia-email";

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

  await channel.assertQueue(EMAIL_QUEUE, { durable: true });

  console.log("Worker aguardando mensagens na fila:", QUEUE_NAME);

  channel.consume(
    QUEUE_NAME,
    async (msg) => {
      if (msg) {
        const payload = JSON.parse(msg.content.toString());
        const id = typeof payload === "number" ? payload : payload?.id;
        console.log("[img-worker] Mensagem recebida:", {
          raw: msg.content.toString(),
          parsedId: id,
        });

        try {
          if (!id) {
            throw new Error("Mensagem sem id válido");
          }

          const imagem = await prisma.imgTemp.findUnique({
            where: { id },
          });

          if (!imagem) {
            console.error("Imagem não encontrada no banco de dados:", id);
            throw new Error("Imagem não encontrada");
          } // dead letter

          console.log("[img-worker] Imagem temporaria encontrada:", {
            imgTempId: imagem.id,
            imovelId: imagem.imovelId,
            tamanhoBlobBytes: imagem.blob.length,
          });

          const processedImageBuffer = await sharp(imagem.blob)
            .resize(500, 500)
            .jpeg({ quality: 80 })
            .toBuffer();

          if (!processedImageBuffer) {
            console.error("Erro ao processar a imagem:", id);
            throw new Error("Erro ao processar a imagem");
          }

          console.log("[img-worker] Imagem processada com sucesso:", {
            imgTempId: id,
            tamanhoProcessadoBytes: processedImageBuffer.length,
          });

          const imagemFinal = await prisma.img_imovel.create({
            data: {
              arquivo: new Uint8Array(processedImageBuffer),
              imovelId: imagem.imovelId,
              formato: "jpeg",
            },
          });

          console.log("[img-worker] Imagem salva em Img_imovel:", {
            imgImovelId: imagemFinal.id,
            imovelId: imagem.imovelId,
            formato: imagemFinal.formato,
          });

          await prisma.imgTemp.update({
            where: { id },
            data: { terminou: true },
          });

          console.log("[img-worker] ImgTemp marcado como concluido:", { id });

          const todasTerminaram = await prisma.imgTemp.findMany({
            where: {
              imovelId: imagem.imovelId,
              terminou: false,
            },
          });

          if (todasTerminaram.length === 0) {
            console.log(
              "[img-worker] Todas as imagens do imovel terminaram. Preparando notificacoes:",
              { imovelId: imagem.imovelId },
            );

            await prisma.imgTemp.deleteMany({
              where: { imovelId: imagem.imovelId },
            });

            console.log("[img-worker] Registros temporarios removidos:", {
              imovelId: imagem.imovelId,
            });

            const imovel = await prisma.imoveis.findUnique({
              where: { id: imagem.imovelId },
              select: {
                tipo: true,
                metragem: true,
                bairro: true,
              },
            });
            const clientes = await prisma.clientes.findMany({
              where: {
                Interesses: {
                  some: {
                    bairro: imovel?.bairro,
                    metragem: imovel?.metragem,
                  },
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
                EMAIL_QUEUE,
                Buffer.from(JSON.stringify(emailData)),
              );

              console.log("[img-worker] Email enfileirado:", {
                clienteEmail: cliente.email,
                imovelId: imagem.imovelId,
              });
            }

            console.log("[img-worker] Notificacoes concluidas:", {
              totalClientes: clientes.length,
              imovelId: imagem.imovelId,
            });
          }

          channel.ack(msg);
          console.log("[img-worker] Mensagem confirmada (ack):", { id });
        } catch (error) {
          console.error("Erro ao processar mensagem:", error);

          await prisma.imgTemp.updateMany({
            where: { id: id },
            data: { terminou: true },
          });
          console.log("[img-worker] ImgTemp marcado como concluido por erro:", {
            id,
          });
          channel.nack(msg, false, false);
          console.log("[img-worker] Mensagem rejeitada (nack sem requeue):", {
            id,
          });
        }
      }
    },
    { noAck: false },
  );
}

await startWorker();

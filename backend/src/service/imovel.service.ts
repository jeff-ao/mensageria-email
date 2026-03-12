import { prisma } from "../lib/prisma";
import { RequestImovel } from "../types/imovel";

import { RabbitMQConnection } from "../config/rabbitmq";
import { Blob } from "buffer";
import { Bytes } from "../../generated/prisma/internal/prismaNamespace";

const rabbitmq = new RabbitMQConnection();

await rabbitmq.connect();

const EMAIL_QUEUE = "envia-email";
const IMG_QUEUE = "processa-imagem";

const channel = rabbitmq.getChannel();

await channel.assertQueue(EMAIL_QUEUE, {
  durable: true,
});

await channel.assertQueue(IMG_QUEUE, {
  durable: true,
});

export const imovelService = {
  cadastrarImovel: async (id: number, imovelData: RequestImovel) => {
    try {
      const corretor = await prisma.corretores.findUnique({
        where: { id },
      });

      if (!corretor) {
        throw new Error("Corretor não encontrado");
      }

      const imovel = await prisma.imoveis.create({
        data: {
          bairro: imovelData.bairro,
          metragem: imovelData.metragem,
          tipo: imovelData.tipo,
          corretorId: id,
        },
      });

      const clientes = await prisma.clientes.findMany({
        where: {
          Interesses: {
            some: { metragem: imovel.metragem, bairro: imovel.bairro },
          },
        },
      });

      if (clientes.length > 0) {
        console.log("preparando mensagens ");
        // const channel = rabbitmq.getChannel();

        // await channel.assertQueue(EMAIL_QUEUE, {
        //   durable: true,
        // });

        for (const cliente of clientes) {
          const mensagem = JSON.stringify({
            email: cliente.email,
            imovel: imovel,
          });
          channel.sendToQueue(EMAIL_QUEUE, Buffer.from(mensagem));

          console.log("enviado para o cliente: ", cliente.name);
        }
      }

      return imovel;
    } catch (error) {
      throw new Error(`erro ao cadastrar, ${error}`);
    }
  },
  cadastrarImagemPorId: async (id: number, imagem: Bytes) => {
    try {
      const imovel = await prisma.imoveis.findUnique({
        where: { id },
      });

      if (!imovel) {
        throw new Error("Imovel não encontrado");
      }

      const imgTemp = await prisma.imgTemp.create({
        data: {
          blob: imagem,
          imovelId: id,
        },
      });

      channel.sendToQueue(IMG_QUEUE, Buffer.from(JSON.stringify(imgTemp.id)));

      return imgTemp;
    } catch (error) {
      throw new Error(`erro ao cadastrar imagem, ${error}`);
    }
  },
};

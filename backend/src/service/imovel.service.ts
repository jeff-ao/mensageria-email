import { prisma } from "../lib/prisma";
import { RequestImovel } from "../types/imovel";

import { RabbitMQConnection } from "../config/rabbitmq";

const rabbitmq = new RabbitMQConnection();

const QUEUE_NAME = "envia-email";

export const imovelService = {
  cadastrarImovel: async (id: number, imovelData: RequestImovel) => {
    try {
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
        await rabbitmq.connect();
        const channel = rabbitmq.getChannel();

        await channel.assertQueue(QUEUE_NAME, {
          durable: true,
        });

        for (const cliente of clientes) {
          const mensagem = JSON.stringify({
            email: cliente.email,
            imovel: imovel,
          });
          channel.sendToQueue(QUEUE_NAME, Buffer.from(mensagem));

          console.log("enviado para o cliente: ", cliente.name);
        }
      }

      return imovel;
    } catch (error) {
      throw new Error(`erro ao cadastrar, ${error}`);
    }
  },
};

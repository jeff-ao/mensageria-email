import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";
import { RabbitMQConnection } from "./config/rabbitmq";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const QUEUE_NAME = "envia-email";

async function startWorker() {
  const rabbitmq = new RabbitMQConnection();
  await rabbitmq.connect();
  const channel = rabbitmq.getChannel();

  await channel.assertQueue(QUEUE_NAME, { durable: true });
  console.log("Worker aguardando mensagens na fila:", QUEUE_NAME);

  channel.consume(
    QUEUE_NAME,
    async (msg) => {
      if (msg) {
        try {
          const { email, imovel } = JSON.parse(msg.content.toString());
          const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: `Novo imóvel disponível: ${imovel.tipo}`,
            text: `Olá, um novo imóvel está disponível: Tipo: ${imovel.tipo}, Metragem: ${imovel.metragem}, Bairro: ${imovel.bairro}.`,
          };
          const result = await transporter.sendMail(mailOptions);
          console.log("Email enviado:", result.messageId);
          channel.ack(msg);
        } catch (error) {
          console.error("Erro ao processar mensagem:", error);
          channel.nack(msg, false, false);
        }
      }
    },
    { noAck: false },
  );
}

await startWorker();

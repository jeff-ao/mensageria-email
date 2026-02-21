import dotenv from "dotenv";
dotenv.config();
import Queue from "bull";
import nodemailer from "nodemailer";

const emailQueue = new Queue("envia-email", {
  redis: { host: "127.0.0.1", port: 6379 },
});

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

emailQueue.process(async (job) => {
  const { imovel, clienteEmail } = job.data;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: clienteEmail,
    subject: `Novo imóvel disponível: ${imovel.tipo}`,
    text: `Olá, um novo imóvel está disponível: Tipo: ${imovel.tipo}, Metragem: ${imovel.metragem}, Bairro: ${imovel.bairro}.`,
  };
  const result = await transporter.sendMail(mailOptions);
  console.log("Email enviado:", result.messageId);
});

emailQueue.on("failed", (job, err) => {
  console.error("Falha ao processar job:", err.message);
});

export default emailQueue;

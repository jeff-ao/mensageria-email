import Queue from "bull";

const emailQueue = new Queue("envia-email", {
  redis: { host: "127.0.0.1", port: 6379 },
});

const testData = {
  imovel: {
    tipo: "Apartamento",
    metragem: 80,
    bairro: "Centro",
  },
  clienteEmail: "marcelamartinstec@gmail.com",
};

emailQueue.add(testData).then(() => {
  console.log("Job added to queue");
  process.exit(0);
});

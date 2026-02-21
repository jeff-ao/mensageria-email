import amqp, { Channel, Connection } from "amqplib/callback_api";
import { promisify } from "util";
import dotenv from "dotenv";

dotenv.config();

const connectAsync = promisify(amqp.connect);

export class RabbitMQConnection {
  private connection: Connection | undefined;
  private channel: Channel | undefined;
  private url: string;

  constructor(url?: string) {
    this.url = url || process.env.RABBITMQ_URL || "amqp://localhost";
  }

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      amqp.connect(this.url, (error, connection) => {
        if (error) {
          console.error("❌ Erro ao conectar ao RabbitMQ:", error);
          reject(error);
          return;
        }

        this.connection = connection;

        connection.createChannel((error, channel) => {
          if (error) {
            console.error("❌ Erro ao criar canal:", error);
            reject(error);
            return;
          }

          this.channel = channel;
          console.log("✅ Conectado ao RabbitMQ");

          connection.on("error", (err: Error) => {
            console.error("❌ Erro na conexão:", err);
          });

          connection.on("close", () => {
            console.log("⚠️ Conexão fechada");
          });

          resolve();
        });
      });
    });
  }

  async disconnect(): Promise<void> {
    try {
      if (this.channel) {
        await new Promise<void>((resolve, reject) => {
          this.channel!.close((err) => {
            if (err) reject(err);
            else resolve();
          });
        });
      }
      if (this.connection) {
        await new Promise<void>((resolve, reject) => {
          this.connection!.close((err) => {
            if (err) reject(err);
            else resolve();
          });
        });
      }
      console.log("✅ Desconectado do RabbitMQ");
    } catch (error) {
      console.error("❌ Erro ao desconectar:", error);
    }
  }

  getChannel(): Channel {
    if (!this.channel) {
      throw new Error("Canal não inicializado. Execute connect() primeiro.");
    }
    return this.channel;
  }

  getConnection(): Connection {
    if (!this.connection) {
      throw new Error("Conexão não inicializada. Execute connect() primeiro.");
    }
    return this.connection;
  }
}

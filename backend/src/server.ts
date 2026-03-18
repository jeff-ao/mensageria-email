import express from "express";
import corretorRouter from "./routes/corretores.routes";
import imovelRouter from "./routes/imovel.routes";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(
  cors({
    origin: "*",
  }),
);

app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

app.use("/corretores", corretorRouter);
app.use("/imoveis", imovelRouter);

app
  .listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  })
  .on("error", (err) => {
    console.error("Server error:", err);
  });

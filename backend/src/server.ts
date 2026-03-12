import express from "express";
import corretorRouter from "./routes/corretores.routes";

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

app.use("/corretor", corretorRouter);

app
  .listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  })
  .on("error", (err) => {
    console.error("Server error:", err);
  });

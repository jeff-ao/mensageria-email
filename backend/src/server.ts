import Express from "express";
import corretorRouter from "./routes/corretores.routes";
const app = Express();
const PORT = process.env.PORT || 3000;

app.use(Express.json());
app.use(corretorRouter);

app
  .listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  })
  .on("error", (err) => {
    console.error("Server error:", err);
  });

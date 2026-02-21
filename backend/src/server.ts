import Express from "express";
import corretorRouter from "./routes/corretores.routes";
const app = Express();
const PORT = process.env.PORT || 3000;

app.use(corretorRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

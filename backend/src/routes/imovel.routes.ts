import { Router } from "express";
import { imovelController } from "../controllers/imovel.controller";
import upload from "../middlewares/upload";
const router = Router();

router.post("/:id/imagens", upload.single("image"), (req, res) => {
  imovelController.cadastrarImagem(req, res);
});

router.get("/:id/imagens-temporarias/quantidade", (req, res) => {
  imovelController.ContarStatusImagemPorImovelId(req, res);
});

export default router;

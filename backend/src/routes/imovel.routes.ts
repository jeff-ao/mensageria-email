import { Router } from "express";
import { imovelController } from "../controllers/imovel.controller";
import upload from "../middlewares/upload";
const router = Router();

router.post("/:id/imagens", upload.single("image"), (req, res) => {
  imovelController.cadastrarImagem(req, res);
});

export default router;

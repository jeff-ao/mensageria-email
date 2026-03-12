import { Router, Request, Response, NextFunction } from "express";
import { corretorController } from "../controllers/corretor.controller";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.json({ status: "ok", message: "Corretor route is working" });
});

router.post("/:id/imovel", (req, res) => {
  corretorController.cadastrarImovel(req, res);
});

export default router;

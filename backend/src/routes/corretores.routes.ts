import { Router, Request, Response, NextFunction } from "express";
import { corretorController } from "../controllers/corretor.controller";

const router = Router();

router.post("/corretor/:id/imovel", (req, res, next) => {
  corretorController.cadastrarImovel(req, res, next);
});

export default router;

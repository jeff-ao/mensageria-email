import { Request, Response, NextFunction } from "express";
import { RequestImovel } from "../types/imovel";
import { imovelService } from "../service/imovel.service";

export const corretorController = {
  cadastrarImovel: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const imovelData: RequestImovel = req.body;
      const id = Number(req.params.id);

      await imovelService.cadastrarImovel(id, imovelData);

      res.json({ status: "ok", message: "imovel cadastrado" });
      return;
    } catch (error) {
      next();
    }
  },
};

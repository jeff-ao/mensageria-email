import { Request, Response, NextFunction } from "express";
import { RequestImovel } from "../types/imovel";
import { imovelService } from "../service/imovel.service";

export const corretorController = {
  cadastrarImovel: async (req: Request, res: Response) => {
    try {
      const imovelData: RequestImovel = req.body;
      const id = Number(req.params.id);

      const imovel = await imovelService.cadastrarImovel(id, imovelData);

      res.json({
        status: "ok",
        message: "imovel cadastrado",
        imovel_id: imovel.id,
      });
      return;
    } catch (error) {
      console.error("Erro ao cadastrar imóvel:", error);
      res.status(500).json({ status: "error", message: error });
    }
  },
};

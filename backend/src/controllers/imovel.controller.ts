import { Request, Response, NextFunction } from "express";
import { imovelService } from "../service/imovel.service";

export const imovelController = {
  cadastrarImagem: async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);

      if (!req?.file) {
        throw new Error("Imagem não fornecida");
      }

      const imgBytes = Buffer.from(req?.file?.buffer);

      const imgTemp = await imovelService.cadastrarImagemPorId(id, imgBytes);

      res.json({
        status: "ok",
        message: "imagem cadastrada",
        img_id: imgTemp.id,
      });
    } catch (error) {
      console.error("Erro ao cadastrar imagem:", error);
      res.status(500).json({ status: "error", message: error });
    }
  },
};

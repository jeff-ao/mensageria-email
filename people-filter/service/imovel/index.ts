import {
  ImovelDataRequest,
  ImovelDataResponse,
  imovelImagemResponse,
  ImovelImagensContagemResponse,
} from "@/types";
import api from "../api";

export const imovelService = {
  cadastrarImovel: async (
    corretorId: number,
    imovelData: ImovelDataRequest,
  ): Promise<ImovelDataResponse> => {
    try {
      const response = await api.post(
        `/corretores/${corretorId}/imovel`,
        imovelData,
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao cadastrar imóvel:", error);
      throw error;
    }
  },

  cadastrarImagemPorImovelId: async (
    imovelId: number,
    imgBytes: File,
  ): Promise<imovelImagemResponse> => {
    try {
      const formData = new FormData();

      formData.append("image", imgBytes);

      const response = await api.post(`/imoveis/${imovelId}/imagem`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Resposta do servidor:", response.data);

      return response.data;
    } catch (error) {
      console.error("Erro ao cadastrar imagem por imóvel ID:", error);
      throw error;
    }
  },

  ContarStatusImagemPorImovelId: async (
    imovelId: number,
  ): Promise<ImovelImagensContagemResponse> => {
    try {
      const response = await api.get(
        `/imoveis/${imovelId}/imagens-temporarias/quantidade`,
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao contar status de imagem por imóvel ID:", error);
      throw error;
    }
  },
};

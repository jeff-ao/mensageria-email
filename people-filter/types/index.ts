import { stat } from "fs";

export interface ImovelDataRequest {
  bairro: string;
  valor: string;
  tipo: string;
  metragem: string;
}

export interface ImovelDataResponse {
  status: string;
  mensagem: string;
  imovel_id: number;
}

export interface ImovelImagensContagemResponse {
  status: string;
  mensagem: string;
  contagem: number;
}

export interface imovelImagemResponse {
  status: string;
  mensagem: string;
  imagem_id: number;
}

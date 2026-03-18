"use client";

import { useState, useEffect } from "react";
import { imovelService } from "@/service/imovel";

export default function CadastrarImovel() {
  const [form, setForm] = useState({
    bairro: "",
    valor: "",
    tipo: "",
    metragem: "",
  });
  const [imovelId, setImovelId] = useState<number | null>(null);
  const [polling, setPolling] = useState(false);
  const [images, setImages] = useState<File[]>([]);

  const interval = 3000;

  useEffect(() => {
    const handlePolling = () => {
      if (!polling) return;

      const timer = setInterval(async () => {
        try {
          const response = await imovelService.ContarStatusImagemPorImovelId(
            imovelId!,
          );
          if (response.contagem === 0) {
            alert("cabo");
            setPolling(false);
          }
        } catch {
          clearInterval(timer);
        }
      }, interval);

      return () => clearInterval(timer);
    };

    if (imovelId) handlePolling();
  }, [form, images, polling, imovelId]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function handleImages(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;

    const selectedFiles = Array.from(e.target.files).slice(0, 20);
    setImages(selectedFiles);

    if (e.target.files.length > 20) {
      alert("Você pode selecionar no máximo 20 imagens.");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const response = await imovelService.cadastrarImovel(1, form);
      console.log("Resposta do servidor:", response);
      const imovelIdAtual = response.imovel_id;
      setImovelId(imovelIdAtual);

      console.log("Imóvel cadastrado com ID:", imovelIdAtual);

      images.forEach(async (img) => {
        await imovelService.cadastrarImagemPorImovelId(imovelIdAtual!, img);
      });

      setPolling(true);
    } catch (error) {
      alert(`Deu erro: ${error}`);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-500">
      <form
        onSubmit={handleSubmit}
        className="bg-black p-8 rounded-xl shadow-md w-[380px] flex flex-col gap-4"
      >
        <input
          name="bairro"
          placeholder="Bairro"
          value={form.bairro}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          name="valor"
          placeholder="Valor"
          value={form.valor}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          name="tipo"
          placeholder="Tipo"
          value={form.tipo}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          name="metragem"
          placeholder="Metragem"
          value={form.metragem}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <div className="border rounded p-4 text-center">
          <p className="text-sm mb-2">IMG (máx 20)</p>

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImages}
          />

          <p className="text-xs mt-2">{images.length}/20 imagens</p>
        </div>

        <button
          type="submit"
          className="bg-blue-300 text-white py-2 rounded hover:opacity-90 "
        >
          Cadastrar
        </button>
      </form>
    </div>
  );
}

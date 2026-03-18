// "use client";

// import { Autocomplete, TextField } from "@mui/material";
// import axios from "axios";
// import { useEffect, useState } from "react";
// import { useDebounce } from "use-debounce";

// export default function Home() {
//   const [search, setSearch] = useState("");
//   const [debouncedSearch] = useDebounce(search, 500);
//   const [people, setPeople] = useState<{ name: string }[]>([]);
//   const [selectedPeople, setSelectedPeople] = useState<string[]>([]);

//   useEffect(() => {
//     if (debouncedSearch) {
//       axios
//         .get(
//           `https://jsonplaceholder.typicode.com/users?name_like=${debouncedSearch}`
//         )
//         .then((response) => {
//           setPeople((prep) => response.data);
//         });
//     } else {
//       setPeople([]);
//     }
//   }, [debouncedSearch]);

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans">
//       <div>
//         <h1 className="text-4xl font-bold text-zinc-800">Busca de pessoas</h1>
//         <Autocomplete
//           multiple
//           id="tags-standard"
//           value={selectedPeople}
//           onChange={(event, newValue) => {
//             setSelectedPeople(newValue);
//           }}
//           onInputChange={(event, newInputValue) => {
//             setSearch(newInputValue);
//           }}
//           getOptionLabel={(option) => option}
//           options={people
//             .map((person) => person.name)
//             .filter((name) => !selectedPeople.includes(name))}
//           sx={{ width: 300, marginTop: 4 }}
//           renderInput={(params) => {
//             return (
//               <TextField
//                 {...params}
//                 className="w-full rounded border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-600"
//                 placeholder="Buscar pessoas..."
//               />
//             );
//           }}
//         />
//       </div>
//     </div>
//   );
// }
"use client";

import { useState } from "react";

export default function CadastrarImovel() {
  const [form, setForm] = useState({
    bairro: "",
    valor: "",
    tipo: "",
    metragem: "",
  });

  const [images, setImages] = useState<File[]>([]);

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

    function handleSubmit(e: React.FormEvent) {
      e.preventDefault();

      images.forEach((img) => {});

      console.log("enviar:", form, images);
    }

    return (
      <div className="flex justify-center items-center min-h-screen bg-white-100">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow-md w-[380px] flex flex-col gap-4"
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
            className="bg-black text-white py-2 rounded hover:opacity-90"
          >
            Cadastrar
          </button>
        </form>
      </div>
    );
  }
}

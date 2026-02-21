"use client";

import { Autocomplete, TextField } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

export default function Home() {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [people, setPeople] = useState<{ name: string }[]>([]);
  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);

  useEffect(() => {
    if (debouncedSearch) {
      axios
        .get(
          `https://jsonplaceholder.typicode.com/users?name_like=${debouncedSearch}`
        )
        .then((response) => {
          setPeople((prep) => response.data);
        });
    } else {
      setPeople([]);
    }
  }, [debouncedSearch]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans">
      <div>
        <h1 className="text-4xl font-bold text-zinc-800">Busca de pessoas</h1>
        <Autocomplete
          multiple
          id="tags-standard"
          value={selectedPeople}
          onChange={(event, newValue) => {
            setSelectedPeople(newValue);
          }}
          onInputChange={(event, newInputValue) => {
            setSearch(newInputValue);
          }}
          getOptionLabel={(option) => option}
          options={people
            .map((person) => person.name)
            .filter((name) => !selectedPeople.includes(name))}
          sx={{ width: 300, marginTop: 4 }}
          renderInput={(params) => {
            return (
              <TextField
                {...params}
                className="w-full rounded border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-600"
                placeholder="Buscar pessoas..."
              />
            );
          }}
        />
      </div>
    </div>
  );
}

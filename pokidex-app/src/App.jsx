import React, { useState } from "react";
import PokemonList from "./components/PokemonList";

function App() {
  const [limit, setLimit] = useState(10); // Default to 10 Pokémon

  const handleLimitChange = (event) => {
    const newLimit = Number(event.target.value);
    if (!isNaN(newLimit) && newLimit > 0 && newLimit <= 1010) {
      setLimit(newLimit);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Simple Pokédex</h1>
      <div className="mb-4">
        <label htmlFor="limit" className="mr-2">
          Number of Pokémon to display:
        </label>
        <input
          type="number"
          id="limit"
          value={limit}
          onChange={handleLimitChange}
          className="p-2 border rounded"
          min="1"
          max="1010"
        />
      </div>
      <PokemonList limit={limit} />
    </div>
  );
}

export default App;

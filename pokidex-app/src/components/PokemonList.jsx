import React, { useState, useEffect } from "react";
import axios from "axios";

const PokemonList = ({ limit }) => {
  const [pokemonList, setPokemonList] = useState([]);
  const [types, setTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const pageSize = 50; // Number of Pokémon per page

  useEffect(() => {
    const fetchPokemon = async () => {
      setLoading(true);
      try {
        // Fetch basic Pokémon data with pagination
        const offset = (currentPage - 1) * pageSize;
        const response = await axios.get(
          `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
        );
        const basicPokemonList = response.data.results;

        // Fetch detailed Pokémon data to get types and images
        const detailedPokemonPromises = basicPokemonList.map((pokemon) =>
          axios.get(pokemon.url)
        );
        const detailedPokemonList = await Promise.all(detailedPokemonPromises);

        // Structure the detailed data with types and images
        const detailedPokemonData = detailedPokemonList.map(
          (pokemonResponse) => ({
            name: pokemonResponse.data.name,
            types: pokemonResponse.data.types.map(
              (typeInfo) => typeInfo.type.name
            ),
            image: pokemonResponse.data.sprites.front_default // Get the front sprite image
          })
        );

        setPokemonList(detailedPokemonData);

        // Fetch types of Pokémon for filtering
        const typesResponse = await axios.get("https://pokeapi.co/api/v2/type");
        setTypes(typesResponse.data.results);

        // Calculate total pages
        const totalResponse = await axios.get(
          "https://pokeapi.co/api/v2/pokemon?limit=1"
        );
        setTotalPages(Math.ceil(totalResponse.data.count / pageSize));
      } catch (error) {
        console.error("Error fetching Pokémon:", error);
      }
      setLoading(false);
    };

    fetchPokemon();
  }, [limit, currentPage]);

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  };

  const handlePageChange = (direction) => {
    setCurrentPage((prevPage) =>
      direction === "next"
        ? Math.min(prevPage + 1, totalPages)
        : Math.max(prevPage - 1, 1)
    );
  };

  return (
    <div>
      {/* Type filter dropdown */}
      <select className="mb-4 p-2 rounded" onChange={handleTypeChange}>
        <option value="">All Types</option>
        {types.map((type, index) => (
          <option key={index} value={type.name}>
            {type.name}
          </option>
        ))}
      </select>

      {/* Pokémon list */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {pokemonList
            .filter(
              (pokemon) =>
                selectedType === "" || pokemon.types.includes(selectedType)
            )
            .map((pokemon, index) => (
              <div
                key={index}
                className="bg-gray-200 p-4 rounded-lg text-center"
              >
                <img
                  src={pokemon.image}
                  alt={pokemon.name}
                  className="mx-auto mb-2"
                />
                <p>{pokemon.name}</p>
              </div>
            ))}
        </div>
      )}

      {/* Pagination controls */}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => handlePageChange("prev")}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange("next")}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PokemonList;

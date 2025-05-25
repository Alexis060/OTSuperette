import { useState } from "react";

export function usePokemonSearch() {
  const [pokemon, setPokemon] = useState(null);
  const [error, setError] = useState(null);

  const searchPokemon = async (searchTerm) => {
    if (searchTerm.trim()) {
      try {
        // Peticion del api
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchTerm}`);

        if (!response.ok) {
          throw new Error('No se encontró el Pokémon.');
        }

        const data = await response.json();

        // Jalar las estadisticas del pokemn
        const stats = data.stats.map(stat => ({
          name: stat.stat.name,
          base_stat: stat.base_stat,
        }));

        // Guardamos los datos del pokemon
        setPokemon({
          name: data.name,
          image: data.sprites.front_default,
          stats: stats,
        });

        setError(null);

      } catch (err) {
        setError(err.message);
        setPokemon(null); 
      }
    }
  };

  return {
    pokemon,
    error,
    searchPokemon,
  };
}

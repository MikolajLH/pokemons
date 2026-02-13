import { Pokemon } from "../types";
import { usePokemons } from "./usePokemons";

export const usePokemon = (pokemonId: number): Pokemon => {
  const { pokemons } = usePokemons();
  const pokemon = pokemons.find((pokemon) => pokemon.id === pokemonId) || null;

  if (!pokemon) {
    throw new Error(`Pokemon ${pokemonId} not fetched`);
  }
  return pokemon;
};

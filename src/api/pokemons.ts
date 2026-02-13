import { Pokemon } from "../types";
import { ApiPokemon, ApiPokemonListPaginatedResponse } from "../types/api";

import { client, endpoint_url } from "./client";

const convertApiResponseToPokemon = (apiResponse: ApiPokemon): Pokemon => {
  return {
    id: apiResponse.id,
    name: apiResponse.name,
    sprite_uri: apiResponse.sprites.front_default,
  };
};

export const fetchPokemonByUrl = async (url: string): Promise<Pokemon> => {
  const raw = await client<ApiPokemon>(url);

  return convertApiResponseToPokemon(raw);
};

export const fetchPokemonById = async (id: number): Promise<Pokemon> => {
  const raw = await client<ApiPokemon>(endpoint_url(`pokemon/${id}/`));

  return convertApiResponseToPokemon(raw);
};

export const fetchPokemonListPage = async ({
  pageParam,
}: {
  pageParam: string;
}): Promise<{
  pokemons: Pokemon[];
  next: string | null;
  previous: string | null;
}> => {
  //const url = `https://pokeapi.co/api/v2/pokemon/?offset=${pageParam}&limit=20`;
  const listResponse = await client<ApiPokemonListPaginatedResponse>(pageParam);

  const pokemonPromises = listResponse.results.map((item) =>
    fetchPokemonByUrl(item.url),
  );
  const pokemons = await Promise.all(pokemonPromises);

  return {
    pokemons,
    next: listResponse.next,
    previous: listResponse.previous,
  };
};

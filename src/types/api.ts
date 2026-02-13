export type ApiPokemonListPaginatedResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: { name: string; url: string }[];
};

export type ApiPokemon = {
  id: number;
  name: string;
  sprites: { front_default: string };
};

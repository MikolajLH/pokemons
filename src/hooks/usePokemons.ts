import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchPokemonListPage } from "../api/pokemons";

export const usePokemons = () => {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["pokemons"],
    queryFn: fetchPokemonListPage,
    initialPageParam: "https://pokeapi.co/api/v2/pokemon/?offset=0&limit=20",
    getNextPageParam: (lastPage) => lastPage.next,
  });

  return {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  };
};

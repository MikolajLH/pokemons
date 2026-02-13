import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { Pokemon } from "../types";

type FavoritePokemonState = {
  favoritePokemon: Pokemon | null;
  setFavoritePokemon: (pokemon: Pokemon) => void;
  removeFavoritePokemon: () => void;
  isFavoritePokemon: (id: number) => boolean;
};

export const useFavoritePokemonStore = create<FavoritePokemonState>()(
  persist(
    (set, get) => ({
      favoritePokemon: null,
      setFavoritePokemon: (pokemon) => set({ favoritePokemon: pokemon }),
      removeFavoritePokemon: () => set({ favoritePokemon: null }),
      isFavoritePokemon: (id) => get().favoritePokemon?.id === id,
    }),
    {
      name: "favorite-pokemon-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

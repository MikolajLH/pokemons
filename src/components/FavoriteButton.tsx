import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, TouchableOpacity } from "react-native";
import { useFavoritePokemonStore } from "../store/useFavoritePokemonStore";
import { Pokemon } from "../types";

const FavoriteButton = ({ pokemon }: { pokemon: Pokemon }) => {
  const isFav = useFavoritePokemonStore((state) =>
    state.isFavoritePokemon(pokemon.id),
  );
  const setFavorite = useFavoritePokemonStore(
    (state) => state.setFavoritePokemon,
  );
  const removeFavorite = useFavoritePokemonStore(
    (state) => state.removeFavoritePokemon,
  );

  const toggle = () => {
    if (isFav) {
      removeFavorite();
    } else {
      setFavorite(pokemon);
    }
  };

  const hasHydrated = useFavoritePokemonStore.persist.hasHydrated();

  if (!hasHydrated) {
    return <ActivityIndicator />;
  }

  return (
    <TouchableOpacity onPress={toggle}>
      <Ionicons
        name={isFav ? "star" : "star-outline"}
        size={24}
        color={isFav ? "gold" : "gray"}
      />
    </TouchableOpacity>
  );
};

export default FavoriteButton;

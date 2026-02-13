import PokemonCard from "@/src/components/PokemonCard";
import { useFavoritePokemonStore } from "@/src/store/useFavoritePokemonStore";
import { Text, View } from "react-native";

const FavoritePokemon = () => {
  const favoritePokemon = useFavoritePokemonStore().favoritePokemon;

  if (!favoritePokemon) {
    return (
      <View>
        <Text>No favorite pokemon</Text>
      </View>
    );
  }
  return (
    <View>
      <PokemonCard pokemon={favoritePokemon} />
    </View>
  );
};

export default FavoritePokemon;

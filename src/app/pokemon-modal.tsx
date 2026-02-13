import { useLocalSearchParams, useRouter } from "expo-router";
import { Button, View } from "react-native";
import PokemonCard from "../components/PokemonCard";
import { usePokemon } from "../hooks/usePokemon";

const PokemonModal = () => {
  const router = useRouter();
  const { pokemonId } = useLocalSearchParams<{ pokemonId: string }>();
  const pokemon = usePokemon(+pokemonId);

  return (
    <View>
      <PokemonCard pokemon={pokemon} />
      <Button title="Close" onPress={() => router.back()} />
    </View>
  );
};

export default PokemonModal;

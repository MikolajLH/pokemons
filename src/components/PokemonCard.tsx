import { Text, View } from "react-native";
import { Pokemon } from "../types";
import FavoriteButton from "./FavoriteButton";

type PokemonCardProps = {
  pokemon: Pokemon;
};

const PokemonCard = ({ pokemon }: PokemonCardProps) => {
  return (
    <View>
      <Text>Pokemon info</Text>
      <Text>{pokemon.name}</Text>
      <FavoriteButton pokemon={pokemon} />
    </View>
  );
};

export default PokemonCard;

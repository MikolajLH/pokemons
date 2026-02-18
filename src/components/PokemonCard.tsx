import { Text, View, Image } from "react-native";
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
      <Image
        source={{ uri: pokemon.sprite_uri }}
        style={{ width: 100, height: 100 }}
      />
    </View>
  );
};

export default PokemonCard;

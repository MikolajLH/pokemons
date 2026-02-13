import { Image, StyleSheet, Text, View } from "react-native";
import { Pokemon } from "../types";

type PokemonListItemProps = {
  pokemon: Pokemon;
};

const PokemonListItem = ({ pokemon }: PokemonListItemProps) => {
  return (
    <View>
      <Text>{pokemon.name}</Text>
      <Image
        style={styles.image}
        source={{
          uri: pokemon.sprite_uri,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 80,
    height: 80,
  },
});

export default PokemonListItem;

import { Image, StyleSheet, Text, View } from "react-native";
import { Pokemon } from "../types";

type PokemonListItemProps = {
  pokemon: Pokemon;
};

const PokemonListItem = ({ pokemon }: PokemonListItemProps) => {
  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={{
          uri: pokemon.sprite_uri,
        }}
      />
      <Text style={styles.text}>{pokemon.name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
    backgroundColor: "red",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 100,
    height: 100,
    backgroundColor: "yellow",
  },
  text: {
    width: "100%",
    textAlign: "center",
    backgroundColor: "#ACFFED",
    fontWeight: "bold",
    fontSize: 20,
  },
});

export default PokemonListItem;

import PokemonListItem from "@/src/components/PokemonListItem";
import { ScrollView, Text, View } from "react-native";

const bulbasaur = {
  id: 1,
  name: "bulbasaur",
  sprite_uri:
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
};

const caterpie = {
  id: 10,
  name: "caterpie",
  sprite_uri:
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10.png",
};

const Index = () => {
  return (
    <View>
      <Text>Pokemons list</Text>
      <ScrollView>
        <PokemonListItem pokemon={bulbasaur} />
        <PokemonListItem pokemon={caterpie} />
      </ScrollView>
    </View>
  );
};

export default Index;

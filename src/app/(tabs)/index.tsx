import PokemonListItem from "@/src/components/PokemonListItem";
import { usePokemons } from "@/src/hooks/usePokemons";
import { FlatList, Text, View } from "react-native";

const Index = () => {
  const { data, hasNextPage, fetchNextPage } = usePokemons();
  const allPokemons = data?.pages?.flatMap((page) => page.pokemons) || [];
  return (
    <View>
      <Text>Pokemons list</Text>
      <FlatList
        data={allPokemons}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => <PokemonListItem pokemon={item} />}
        onEndReached={() => {
          if (hasNextPage) fetchNextPage();
        }}
      />
    </View>
  );
};

export default Index;

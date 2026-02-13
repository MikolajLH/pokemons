import PokemonListItem from "@/src/components/PokemonListItem";
import { usePokemons } from "@/src/hooks/usePokemons";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Button, FlatList, Text, TouchableOpacity, View } from "react-native";

const Index = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { pokemons, hasNextPage, fetchNextPage } = usePokemons();

  return (
    <View>
      <Button
        title="Clear"
        onPress={async () =>
          await queryClient.resetQueries({ queryKey: ["pokemons"] })
        }
      />
      <Text>Pokemons list</Text>
      <FlatList
        data={pokemons}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              router.push({
                pathname: "/pokemon-modal",
                params: { pokemonId: item.id },
              });
              console.log(`Pressed pokemon ${item.name}`);
            }}
          >
            <PokemonListItem pokemon={item} />
          </TouchableOpacity>
        )}
        onEndReached={() => {
          if (hasNextPage) fetchNextPage();
        }}
      />
    </View>
  );
};

export default Index;

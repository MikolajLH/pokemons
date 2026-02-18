import Animated, { AnimatedStyle, StyleProps } from "react-native-reanimated";
import { Pokemon } from "../types";

type PokemonOverlayProps = {
  pokemon: Pokemon;
  animatedStyle: AnimatedStyle;
  boundingBoxStyle?: StyleProps | undefined;
};

const PokemonOverlay = ({
  pokemon,
  animatedStyle,
  boundingBoxStyle = undefined,
}: PokemonOverlayProps) => {
  return (
    <>
      {boundingBoxStyle && <Animated.View style={boundingBoxStyle} />}
      <Animated.Image
        source={{ uri: pokemon.sprite_uri }}
        style={[{ position: "absolute" }, animatedStyle]}
      />
    </>
  );
};

export default PokemonOverlay;

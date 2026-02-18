import { useCallback, useState } from "react";
import { LayoutChangeEvent } from "react-native";

//http://stackoverflow.com/questions/56738500/react-native-onlayout-with-react-hooks
export const useComponentRect = () => {
  const [size, setSize] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    setSize({ x, y, width, height });
  }, []);

  return { rect: size, onLayout: onLayout };
};

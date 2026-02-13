import { Tabs } from "expo-router";

const TabLayout = () => {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: "List" }} />
      <Tabs.Screen name="favorite-pokemon" options={{ title: "Favorite" }} />
      <Tabs.Screen name="camera" options={{ title: "Camera" }} />
      <Tabs.Screen name="map" options={{ title: "Map" }} />
    </Tabs>
  );
};

export default TabLayout;

import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Linking, StyleSheet, Text, View } from "react-native";
import type { CameraPermissionStatus } from "react-native-vision-camera";
import { Camera } from "react-native-vision-camera";

export const PermissionsPage = () => {
  const router = useRouter();
  const [cameraPermissionStatus, setCameraPermissionStatus] =
    useState<CameraPermissionStatus>("not-determined");

  const requestCameraPermission = useCallback(async () => {
    console.log("Requesting camera permission...");
    const permission = await Camera.requestCameraPermission();
    console.log(`Camera permission status: ${permission}`);

    const devices = Camera.getAvailableCameraDevices();
    console.log("devices:", JSON.stringify(devices, null, 2));

    if (permission === "denied") await Linking.openSettings();
    setCameraPermissionStatus(permission);
  }, []);

  useEffect(() => {
    if (cameraPermissionStatus === "granted") router.navigate("/(tabs)/camera");
  }, [cameraPermissionStatus, router]);

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Welcome to{"\n"}Vision Camera.</Text>
      <View style={styles.permissionsContainer}>
        {cameraPermissionStatus !== "granted" && (
          <Text style={styles.permissionText}>
            Vision Camera needs{" "}
            <Text style={styles.bold}>Camera permission</Text>.{" "}
            <Text style={styles.hyperlink} onPress={requestCameraPermission}>
              Grant
            </Text>
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  welcome: {
    fontSize: 38,
    fontWeight: "bold",
    maxWidth: "80%",
  },
  banner: {
    position: "absolute",
    opacity: 0.4,
    bottom: 0,
    left: 0,
  },
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  permissionsContainer: {},
  permissionText: {
    fontSize: 17,
  },
  hyperlink: {
    color: "#007aff",
    fontWeight: "bold",
  },
  bold: {
    fontWeight: "bold",
  },
});

import { useIsFocused } from "@react-navigation/native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  Frame,
  useCameraDevice,
  useCameraPermission,
  Camera as VisionCamera,
} from "react-native-vision-camera";

import {
  Face,
  Camera as FaceDetectorCamera,
  FrameFaceDetectionOptions,
} from "react-native-vision-camera-face-detector";

import ViewShot from "react-native-view-shot";

import * as MediaLibrary from "expo-media-library";
import { useComponentRect } from "../hooks/useComponentRect";
import { useFavoritePokemonStore } from "../store/useFavoritePokemonStore";

const Camera = () => {
  const pokemon = useFavoritePokemonStore().favoritePokemon;
  //const { width, height } = useWindowDimensions();
  const { rect, onLayout } = useComponentRect();
  const faceDetectionOptions: FrameFaceDetectionOptions = useMemo(
    () => ({
      performanceMode: "fast",
      classificationMode: "none",
      contourMode: "none",
      landmarkMode: "none",
      windowWidth: rect?.width ?? 1,
      windowHeight: rect?.height ?? 1,
      autoMode: true,
    }),
    [rect],
  );

  const faceX = useSharedValue<number>(0);
  const faceY = useSharedValue<number>(0);
  const faceW = useSharedValue<number>(0);
  const faceH = useSharedValue<number>(0);
  const faceCenterX = useDerivedValue(
    () => faceX.value + faceW.value * 0.5 - 50,
  );

  const boundingBoxStyle = useAnimatedStyle(() => ({
    position: "absolute",
    borderWidth: 4,
    borderLeftColor: "rgb(0,255,0)",
    borderRightColor: "rgb(0,255,0)",
    borderBottomColor: "rgb(0,255,0)",
    borderTopColor: "rgb(255,0,0)",
    top: faceY.value,
    left: faceX.value,
    width: faceW.value,
    height: faceH.value,
  }));

  const isFocused = useIsFocused();

  const device = useCameraDevice("front");
  const { hasPermission } = useCameraPermission();
  const camera = useRef<VisionCamera>(null);
  const viewShotRef = useRef<ViewShot>(null);

  const handleFaceDetected = (faces: Face[], frame: Frame) => {
    if (faces.length <= 0) {
      faceX.value = 0;
      faceY.value = 0;
      faceW.value = 0;
      faceH.value = 0;
      return;
    }
    const { width, height, x, y } = faces[0].bounds;
    faceX.value = x;
    faceY.value = y;
    faceW.value = width;
    faceH.value = height;

    //console.log("faces", faces.length, `(${x.toFixed(2)}, ${y.toFixed(2)})`);
    //console.log("rect:", JSON.stringify(rect));
  };

  const [pictureTempPath, setPictureTempPath] = useState<string | null>(null);

  const onCapture = async () => {
    console.log("onCapture");
    if (pictureTempPath && viewShotRef.current) {
      try {
        const vs = viewShotRef.current;
        const cap = vs.capture;
        if (cap) {
          const uri = await cap();
          const { status } = await MediaLibrary.requestPermissionsAsync();
          if (status === "granted") {
            const asset = await MediaLibrary.createAssetAsync(uri);
            console.log("saved to gallery", asset.filename);
          }
        }
      } catch (err) {
        console.error("failed in saving the image", err);
      } finally {
        setPictureTempPath(null);
      }
    }
  };

  const onShutterPressed = async () => {
    console.log("shutter btn pressed");
    if (camera.current) {
      const picture = await camera.current.takePhoto();
      console.log(`saved to temp: ${picture.path}`);
      setPictureTempPath(picture.path);
    }
  };

  if (!device) {
    return (
      <View>
        <Text>No camera device</Text>
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <View>
        <Text>No camera permission</Text>
      </View>
    );
  }

  return (
    <View style={styles.container} onLayout={onLayout}>
      <StatusBar barStyle="light-content" />
      {rect && (
        <>
          <FaceDetectorCamera
            ref={camera}
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={isFocused}
            faceDetectionCallback={handleFaceDetected}
            faceDetectionOptions={faceDetectionOptions}
            photo={true}
          />
          <Animated.View style={boundingBoxStyle} />
          {pokemon && (
            <Animated.Image
              source={{ uri: pokemon.sprite_uri }}
              style={{
                position: "absolute",
                top: faceY,
                left: faceCenterX,
                width: 100,
                height: 100,
              }}
            />
          )}

          <View style={styles.controlsContainer}>
            <TouchableOpacity
              style={styles.shutterBtnOuter}
              onPress={onShutterPressed}
              activeOpacity={0.7}
            >
              <View style={styles.shutterBtnInner} />
            </TouchableOpacity>
          </View>
        </>
      )}
      {pictureTempPath && (
        <View style={[{ zIndex: 10 }, StyleSheet.absoluteFill]}>
          <ViewShot
            ref={viewShotRef}
            options={{
              format: "jpg",
              quality: 0.9,
            }}
            style={styles.viewShotContainer}
          >
            <Image
              source={{ uri: pictureTempPath }}
              style={{ width: "100%", height: "100%" }}
              onLoad={onCapture}
            />
            <Animated.View style={boundingBoxStyle} />
            {pokemon && (
              <Animated.Image
                source={{ uri: pokemon.sprite_uri }}
                style={{
                  position: "absolute",
                  top: faceY,
                  left: faceCenterX,
                  width: 100,
                  height: 100,
                }}
              />
            )}
          </ViewShot>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  rect: {
    position: "absolute",
    borderColor: "black",
    borderWidth: 5,
    backgroundColor: "red",
    width: 100,
    height: 50,
  },
  container: {
    flex: 1,
    backgroundColor: "blue",
    justifyContent: "center",
    alignItems: "center",
  },
  viewShotContainer: {
    width: "100%",
    height: "100%",
    flex: 1,
    backgroundColor: "white",
    opacity: 90,
    justifyContent: "center",
    alignItems: "center",
  },
  controlsContainer: {
    position: "absolute",
    bottom: 50,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  shutterBtnOuter: {
    width: 75,
    height: 75,
    borderRadius: 75 / 2,
    borderWidth: 5,
    borderColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  shutterBtnInner: {
    width: 60,
    height: 60,
    borderRadius: 60 / 2,
    backgroundColor: "white",
  },
});

export default Camera;

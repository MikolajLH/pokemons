import { PermissionsPage } from "@/src/pages/PermissionsPage";
import { useFavoritePokemonStore } from "@/src/store/useFavoritePokemonStore";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
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
  Camera,
  Face,
  FrameFaceDetectionOptions,
} from "react-native-vision-camera-face-detector";

import { default as MyCamera } from "@/src/components/Camera";

const FaceDetection = () => {
  const pokemon = useFavoritePokemonStore().favoritePokemon;

  const { width, height } = useWindowDimensions();
  const { hasPermission } = useCameraPermission();

  const faceDetectionOptions = useRef<FrameFaceDetectionOptions>({
    performanceMode: "fast",
    classificationMode: "none",
    contourMode: "none",
    landmarkMode: "none",
    windowWidth: width,
    windowHeight: height,
  }).current;

  const cameraDevice = useCameraDevice("front");
  const camera = useRef<VisionCamera>(null);

  const [faceExists, setFaceExists] = useState(false);

  const aFaceW = useSharedValue(0);
  const aFaceH = useSharedValue(0);
  const aFaceX = useSharedValue(0);
  const aFaceY = useSharedValue(0);
  const headCenter = useDerivedValue(
    () => aFaceX.value + aFaceW.value * 0.5 - 50,
  );

  const boundingBoxStyle = useAnimatedStyle(() => ({
    position: "absolute",
    borderWidth: 4,
    borderLeftColor: "rgb(0,255,0)",
    borderRightColor: "rgb(0,255,0)",
    borderBottomColor: "rgb(0,255,0)",
    borderTopColor: "rgb(255,0,0)",
    width: withTiming(aFaceW.value, {
      duration: 100,
    }),
    height: withTiming(aFaceH.value, {
      duration: 100,
    }),
    left: withTiming(aFaceX.value, {
      duration: 100,
    }),
    top: withTiming(aFaceY.value - 120, {
      duration: 100,
    }),
  }));

  const handleFacesDetected = (faces: Face[], frame: Frame) => {
    if (faces.length <= 0) {
      aFaceW.value = 0;
      aFaceH.value = 0;
      aFaceX.value = 0;
      aFaceY.value = 0;
      setFaceExists(false);
      return;
    }
    setFaceExists(true);

    console.log(
      "faces",
      faces.length,
      aFaceX.value,
      aFaceY.value,
      //"frame",
      //frame.toString(),
      //"faces",
      //JSON.stringify(faces),
    );

    const { bounds } = faces[0];
    const { width, height, x, y } = bounds;
    aFaceW.value = width;
    aFaceH.value = height;
    aFaceX.value = x;
    aFaceY.value = y;

    // only call camera methods if ref is defined
    if (camera.current) {
      // take photo, capture video, etc...
    }
  };

  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        {
          alignItems: "center",
          justifyContent: "center",
        },
      ]}
    >
      {hasPermission && cameraDevice && (
        <>
          <Camera
            ref={camera}
            style={[StyleSheet.absoluteFill]}
            isActive={true}
            device={cameraDevice}
            faceDetectionCallback={handleFacesDetected}
            faceDetectionOptions={{
              ...faceDetectionOptions,
              autoMode: true,
              cameraFacing: "front",
            }}
          />
          <Animated.View style={boundingBoxStyle} />
          {pokemon && faceExists && (
            <Animated.Image
              source={{ uri: pokemon.sprite_uri }}
              style={{
                position: "absolute",
                top: aFaceY,
                left: headCenter,
                width: 100,
                height: 100,
              }}
            />
          )}
        </>
      )}
    </View>
  );
};

const CameraScreen = () => {
  useEffect(() => {
    const devices = VisionCamera.getAvailableCameraDevices();
    console.log("devices:", JSON.stringify(devices, null, 2));
  }, []);

  const device = useCameraDevice("front");

  const { hasPermission } = useCameraPermission();
  if (!hasPermission) {
    return <PermissionsPage />;
  }

  if (!device) {
    return (
      <View>
        <Text>No camera device</Text>
      </View>
    );
  }
  const test = true;
  return test ? <MyCamera /> : <FaceDetection />;
};

export default CameraScreen;

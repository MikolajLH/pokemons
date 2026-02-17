import { useIsFocused } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import {
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

const Camera = () => {
  const aFaceW = useSharedValue(0);
  const aFaceH = useSharedValue(0);
  const aFaceX = useSharedValue(0);
  const aFaceY = useSharedValue(0);

  const lEyeX = useSharedValue(0);
  const lEyeY = useSharedValue(0);
  const rEyeX = useSharedValue(0);
  const rEyeY = useSharedValue(0);
  const eyesSpace = useDerivedValue(() => Math.abs(lEyeX.value - rEyeX.value));

  const [faceExists, setFaceExists] = useState(false);

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
    top: withTiming(aFaceY.value, {
      duration: 100,
    }),
  }));

  const { width, height } = useWindowDimensions();
  const faceDetectionOptions = useRef<FrameFaceDetectionOptions>({
    performanceMode: "fast",
    classificationMode: "none",
    contourMode: "none",
    landmarkMode: "none",
    windowWidth: width,
    windowHeight: height,
    autoMode: true,
  }).current;

  const device = useCameraDevice("front");
  const { hasPermission, requestPermission } = useCameraPermission();
  const camera = useRef<VisionCamera>(null);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission]);

  const handleFaceDetected = (faces: Face[], frame: Frame) => {
    if (faces.length <= 0) {
      aFaceW.value = 0;
      aFaceH.value = 0;
      aFaceX.value = 0;
      aFaceY.value = 0;
      setFaceExists(false);
      return;
    }
    setFaceExists(true);

    const face = faces[0];
    const lEye = face.landmarks?.LEFT_EYE ?? null;
    const rEye = face.landmarks?.LEFT_EYE ?? null;

    if (lEye) {
      lEyeX.value = lEye.x;
      lEyeY.value = lEye.y;
    }

    if (rEye) {
      rEyeX.value = rEye.x;
      rEyeY.value = rEye.y;
    }

    const { bounds } = faces[0];
    const { width, height, x, y } = bounds;
    aFaceW.value = width;
    aFaceH.value = height;
    aFaceX.value = x;
    aFaceY.value = y;

    console.log("faces", faces.length, `(${x.toFixed(2)}, ${y.toFixed(2)})`);
  };

  if (!hasPermission) {
    return (
      <View>
        <Text>No camera permission</Text>
      </View>
    );
  }

  if (!device) {
    return (
      <View>
        <Text>No camera device</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <FaceDetectorCamera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isFocused}
        faceDetectionCallback={handleFaceDetected}
        faceDetectionOptions={faceDetectionOptions}
      />
      <Animated.View style={boundingBoxStyle} />
      <Animated.View
        style={{
          top: 0,
          left: 0,
          ...styles.rect,
        }}
      />
      <Animated.View
        style={{
          top: lEyeY,
          left: lEyeX,
          width: eyesSpace,
          height: 10,
          borderWidth: 5,
          borderColor: "green",
        }}
      />
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={styles.shutterBtnOuter}
          onPress={() => console.log("shutter btn pressed")}
          activeOpacity={0.7}
        >
          <View style={styles.shutterBtnInner} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Camera;

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

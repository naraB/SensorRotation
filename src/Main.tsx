import { Skia, Image, vec, rrect, rect, Circle, Box, Canvas, Group, RadialGradient, useValue, useSharedValueEffect, useComputedValue, useImage, Shadow, interpolate, Extrapolate, Mask } from "@shopify/react-native-skia"
import React from "react"
import { StyleSheet, Text, View } from "react-native"
import { SensorType, useAnimatedReaction, useAnimatedSensor, useSharedValue } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { ScreenHeight, ScreenWidth } from "./constants"
import { processTransform3d, toMatrix3 } from "./redash/Matrix4"
import { degreeToRad } from "./utils"

const styles = StyleSheet.create({
  placeholder: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 6
  }
})

export const Main = () => {
  const lightX = useValue(0);
  const lightY = useValue(0);
  const rotateX = useValue(0);
  const rotateY = useValue(0);
  const roll = useSharedValue(0);
  const pitch = useSharedValue(0);
  const safeAreaInsets = useSafeAreaInsets();
  const image = useImage(require("./assets/nft.png"));
  const animatedSensor = useAnimatedSensor(SensorType.ROTATION, { interval: 1 });

  const width = (ScreenWidth - 100);
  const height = width;
  const y = 100;
  const x = (ScreenWidth - width) / 2;

  const lightXOrigin = ScreenWidth / 2;
  const lightYOrigin = (height + y) / 2;


  useAnimatedReaction(() => animatedSensor.sensor.value, (s) => {
    pitch.value = s.pitch;
    roll.value = s.roll;
  }, []);

  useSharedValueEffect(() => {
    lightX.current = interpolate(
      roll.value,
      [-Math.PI, Math.PI],
      [-500 * 2, 500 * 2]
    );

    lightY.current = interpolate(
      pitch.value,
      [-Math.PI, Math.PI],
      [-500 * 2, 500 * 2]
    );

    rotateY.current = interpolate(
      roll.value,
      [-Math.PI, Math.PI],
      [degreeToRad(40), degreeToRad(-40)],
      Extrapolate.CLAMP
    );

    rotateX.current = interpolate(
      pitch.value,
      [-Math.PI, Math.PI],
      [degreeToRad(40), degreeToRad(-40)],
      Extrapolate.CLAMP
    );
  }, roll, pitch);

  const transform = useComputedValue(
    () => [
      { translateX: lightX.current },
      { translateY: lightY.current },
    ],
    [lightX, lightY]
  );

  const matrix = useComputedValue(() => {
    const mat3 = toMatrix3(processTransform3d([
      { perspective: 300 },
      { rotateY: rotateY.current },
      { rotateX: rotateX.current },
    ]));

    return Skia.Matrix(mat3);
  }, [rotateX, rotateY])

  const mask =
    (<Box box={rrect(rect(x, y, width, height), 24, 24)} >
      <Shadow dx={12} dy={12} blur={25} color="black" />
    </Box>);

  const nft = image && (
    <Group clip={rrect(rect(x, y, width, height), 24, 24)}>
      <Image
        image={image}

        x={x}
        y={y}
        width={width}
        height={height}
        rect={rect(x, y, width, height)}
      />
    </Group >
  );

  const light =
    (<Group origin={vec(lightXOrigin, lightYOrigin)} transform={transform} blendMode="plus">
      <Circle cy={lightYOrigin} cx={lightXOrigin} r={256}>
        <RadialGradient
          c={vec(lightXOrigin, lightYOrigin)}
          r={128}
          mode="clamp"
          colors={["rgba(255,255,255,0.4)", "rgba(255,255,255,0.2)", "rgba(255,255,255,0.01)"]}
        />
      </Circle>
    </Group>);

  const shadow =
    (<Box box={rrect(rect(x, y, width, height), 26, 26)} color="rgba(255,255,255,0.5)">
      <Shadow dx={8} dy={8} blur={32} color="rgba(199,216,89,0.8)" />
      <Shadow dx={4} dy={8} blur={16} color="rgba(221,111,208,0.6)" />
    </Box>);

  return (
    <View style={{ flex: 1, }}>
      <Canvas
        style={{
          width: "100%",
          height: height + 100 + y
        }}
      >
        <Group origin={{ x: (ScreenWidth) / 2, y: (ScreenHeight) / 2 }} matrix={matrix}>
          {shadow}
          <Mask
            clip
            mask={mask}>
            {nft}
          </Mask>
        </Group>
        {light}
      </Canvas >
      <View style={{ top: -60, marginHorizontal: 50 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={[styles.placeholder, { height: 24, width: 80 }]} />
          <View style={[styles.placeholder, { height: 24, width: 80 }]} />
        </View>

      </View>
      <View style={{ flex: 1, marginHorizontal: 50 }} >
        <View style={[styles.placeholder, { height: 40, width: '60%', }]} />
        <View style={[styles.placeholder, { height: 24, width: '80%', marginTop: 12 }]} />
        <View style={[styles.placeholder, { height: 32, width: '90%', marginTop: 48 }]} />
      </View>
      <View
        style={{
          height: 60,
          borderRadius: 12,
          alignItems: "center",
          marginHorizontal: 32,
          backgroundColor: '#111',
          justifyContent: "center",
          marginBottom: safeAreaInsets.bottom + 20,
        }}>
        <Text
          style={{
            color: "rgba(255,255,255,0.9)",
            fontWeight: "500",
            fontSize: 20
          }}>
          View on OpenSea ↗
        </Text>
      </View>
    </View >
  )
}
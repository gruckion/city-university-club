# Animated Membership Card - Gyroscope Tilt Effect

This document describes three idiomatic approaches to implementing a gyroscope-based tilt animation for the membership card in React Native. When the user moves their phone left/right or tilts it, the card appears to float above the screen with a subtle 3D perspective effect.

## Overview

All three approaches use device motion sensors to detect phone orientation changes and apply 3D transforms (rotateX, rotateY with perspective) to create the illusion of depth.

---

## Solution 1: React Native Reanimated `useAnimatedSensor` (Recommended)

**Best for:** Expo projects already using Reanimated. Most idiomatic and performant.

### How It Works

Reanimated provides a built-in `useAnimatedSensor` hook that directly exposes device sensor data as a shared value, which can be used in `useAnimatedStyle` for 60 FPS animations on the UI thread.

### Key Features
- Runs entirely on the UI thread (no JS bridge overhead)
- Built-in support for rotation, gravity, gyroscope sensors
- Automatic cleanup on component unmount
- Works seamlessly with `useAnimatedStyle`

### Code Example

```tsx
import Animated, {
  useAnimatedSensor,
  useAnimatedStyle,
  SensorType,
  withSpring,
} from "react-native-reanimated";

const MAX_TILT = 15; // Maximum tilt angle in degrees

export function AnimatedCard({ children }) {
  // Use rotation sensor for orientation data
  const rotation = useAnimatedSensor(SensorType.ROTATION, {
    interval: "auto", // Matches screen refresh rate
  });

  const animatedStyle = useAnimatedStyle(() => {
    const { pitch, roll } = rotation.sensor.value;

    // Convert radians to degrees and clamp
    const rotateX = Math.max(-MAX_TILT, Math.min(MAX_TILT, pitch * (180 / Math.PI) * 0.5));
    const rotateY = Math.max(-MAX_TILT, Math.min(MAX_TILT, roll * (180 / Math.PI) * 0.5));

    return {
      transform: [
        { perspective: 1000 },
        { rotateX: withSpring(`${-rotateX}deg`, { damping: 15, stiffness: 100 }) },
        { rotateY: withSpring(`${rotateY}deg`, { damping: 15, stiffness: 100 }) },
      ],
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      {children}
    </Animated.View>
  );
}
```

### Sensor Types Available
- `SensorType.ROTATION` - Device orientation (pitch, roll, yaw + quaternion)
- `SensorType.GRAVITY` - Gravity vector (x, y, z)
- `SensorType.GYROSCOPE` - Raw rotation rate
- `SensorType.ACCELEROMETER` - Device acceleration

### Pros
- Most performant (UI thread)
- Cleanest API
- Built into Reanimated (no extra dependencies)
- Handles sensor cleanup automatically

### Cons
- Requires Reanimated 3.0+
- Less control over raw sensor data

---

## Solution 2: Expo DeviceMotion with Reanimated

**Best for:** When you need more control over sensor data or want to combine multiple sensor readings.

### How It Works

Uses `expo-sensors` DeviceMotion API to get rotation data, then manually updates Reanimated shared values which drive the animation.

### Key Features
- Direct access to all DeviceMotion properties
- Can combine accelerometer, gyroscope, and rotation data
- More control over data processing
- Works with or without Reanimated

### Code Example

```tsx
import { useEffect } from "react";
import { DeviceMotion } from "expo-sensors";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

const MAX_TILT = 15;

export function AnimatedCard({ children }) {
  const rotateX = useSharedValue(0);
  const rotateY = useSharedValue(0);

  useEffect(() => {
    let subscription: ReturnType<typeof DeviceMotion.addListener>;

    const startListening = async () => {
      const isAvailable = await DeviceMotion.isAvailableAsync();
      if (!isAvailable) {
        console.warn("DeviceMotion not available");
        return;
      }

      DeviceMotion.setUpdateInterval(16); // ~60fps

      subscription = DeviceMotion.addListener(({ rotation }) => {
        if (rotation) {
          // beta = front/back tilt, gamma = left/right tilt
          const { beta, gamma } = rotation;

          // Convert radians to degrees and apply sensitivity
          const newRotateX = Math.max(-MAX_TILT, Math.min(MAX_TILT, beta * (180 / Math.PI) * 0.3));
          const newRotateY = Math.max(-MAX_TILT, Math.min(MAX_TILT, gamma * (180 / Math.PI) * 0.3));

          rotateX.value = newRotateX;
          rotateY.value = newRotateY;
        }
      });
    };

    startListening();

    return () => {
      subscription?.remove();
    };
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1000 },
      { rotateX: withSpring(`${-rotateX.value}deg`, { damping: 15 }) },
      { rotateY: withSpring(`${rotateY.value}deg`, { damping: 15 }) },
    ],
  }));

  return (
    <Animated.View style={animatedStyle}>
      {children}
    </Animated.View>
  );
}
```

### DeviceMotion Data Structure
```typescript
{
  rotation: {
    alpha: number,  // Z-axis rotation (yaw)
    beta: number,   // X-axis rotation (pitch/tilt front-back)
    gamma: number,  // Y-axis rotation (roll/tilt left-right)
  },
  accelerationIncludingGravity: { x, y, z },
  acceleration: { x, y, z },
  rotationRate: { alpha, beta, gamma },
  orientation: 0 | 90 | 180 | -90,
}
```

### Pros
- Full control over sensor data
- Can process/filter data before animating
- Works with any animation library
- Explicit permission handling

### Cons
- More boilerplate code
- Manual subscription management
- Slightly less performant (JS → UI thread updates)

---

## Solution 3: Gravity Sensor with Parallax Effect

**Best for:** Simpler tilt effect based on gravity vector. Good for subtle, ambient motion.

### How It Works

Uses the gravity sensor (or accelerometer with gravity) to detect how the device is tilted relative to Earth's gravity. This provides smooth, predictable tilt values.

### Key Features
- Simple gravity-based calculations
- Natural feeling tilt response
- Good for parallax/depth effects
- Easy to understand the math

### Code Example

```tsx
import Animated, {
  useAnimatedSensor,
  useAnimatedStyle,
  SensorType,
  interpolate,
  Extrapolation,
  withSpring,
} from "react-native-reanimated";

const TILT_SENSITIVITY = 25; // How much tilt in degrees

export function AnimatedCard({ children }) {
  const gravity = useAnimatedSensor(SensorType.GRAVITY, {
    interval: "auto",
  });

  const animatedStyle = useAnimatedStyle(() => {
    const { x, y } = gravity.sensor.value;

    // Gravity values range roughly from -9.8 to 9.8
    // When phone is flat: x≈0, y≈0, z≈-9.8
    // When tilted left: x increases (positive)
    // When tilted forward: y increases (positive)

    const rotateY = interpolate(
      x,
      [-9.8, 9.8],
      [-TILT_SENSITIVITY, TILT_SENSITIVITY],
      Extrapolation.CLAMP
    );

    const rotateX = interpolate(
      y,
      [-9.8, 9.8],
      [TILT_SENSITIVITY, -TILT_SENSITIVITY],
      Extrapolation.CLAMP
    );

    return {
      transform: [
        { perspective: 800 },
        { rotateX: withSpring(`${rotateX}deg`, { damping: 20, stiffness: 90 }) },
        { rotateY: withSpring(`${rotateY}deg`, { damping: 20, stiffness: 90 }) },
      ],
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      {children}
    </Animated.View>
  );
}
```

### Understanding Gravity Values
```
Phone flat (face up):    x: 0,    y: 0,    z: -9.8
Phone tilted left:       x: +ve,  y: 0,    z: varies
Phone tilted right:      x: -ve,  y: 0,    z: varies
Phone tilted forward:    x: 0,    y: +ve,  z: varies
Phone tilted back:       x: 0,    y: -ve,  z: varies
```

### Pros
- Simple and intuitive
- Stable values (no drift)
- Good for subtle effects
- Works well for parallax layers

### Cons
- Less responsive to quick movements
- Can't detect rotation around vertical axis (yaw)
- Limited to tilt detection only

---

## Comparison Table

| Feature | Solution 1 (useAnimatedSensor) | Solution 2 (DeviceMotion) | Solution 3 (Gravity) |
|---------|-------------------------------|---------------------------|----------------------|
| Performance | Excellent (UI thread) | Good | Excellent (UI thread) |
| Code Complexity | Low | Medium | Low |
| Control over data | Medium | High | Low |
| Sensor drift | Handled internally | Manual handling | None |
| Best use case | General purpose | Custom processing | Subtle parallax |
| Dependencies | Reanimated only | expo-sensors + Reanimated | Reanimated only |

---

## Implementation Notes

### iOS Permissions
On iOS, device motion requires the `NSMotionUsageDescription` permission in `app.json`:

```json
{
  "expo": {
    "plugins": [
      [
        "expo-sensors",
        {
          "motionPermission": "Allow $(PRODUCT_NAME) to access device motion for card animations"
        }
      ]
    ]
  }
}
```

### Performance Tips
1. Use `withSpring` for natural feeling motion
2. Clamp rotation values to prevent extreme angles
3. Use `interval: "auto"` to match screen refresh rate
4. Apply `damping` and `stiffness` for smooth spring animations

### Accessibility
Consider providing a way to disable motion effects for users with vestibular disorders:

```tsx
import { AccessibilityInfo } from "react-native";

const [reduceMotion, setReduceMotion] = useState(false);

useEffect(() => {
  AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
}, []);
```

---

## Chosen Implementation

**Solution 1 (useAnimatedSensor with ROTATION)** was chosen for implementation because:
1. Already using Reanimated in the project
2. Best performance (UI thread animations)
3. Cleanest API with automatic cleanup
4. Rotation sensor provides exact pitch/roll values we need

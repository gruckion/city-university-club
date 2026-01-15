import { useThemeColor } from "heroui-native";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  SensorType,
  useAnimatedSensor,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

// Card background image (without name, date, secretary)
const MEMBERSHIP_CARD_BG = require("@/assets/images/membership-card.png");

const { width: screenWidth } = Dimensions.get("window");
const CARD_WIDTH = screenWidth - 48; // 24px padding on each side
// The original card appears to have roughly 1.6:1 aspect ratio (wider than credit card)
const CARD_HEIGHT = CARD_WIDTH * 0.62;

// Animation constants
const MAX_TILT = 10; // Maximum tilt angle in degrees
const SPRING_CONFIG = {
  damping: 15,
  stiffness: 100,
  mass: 0.5,
};

interface MembershipCardProps {
  memberName: string;
  memberSince?: string;
  secretaryName?: string;
  /** Disable gyroscope animation (useful for accessibility) */
  disableAnimation?: boolean;
}

export function MembershipCard({
  memberName,
  memberSince,
  secretaryName = "H. Senanayake",
  disableAnimation = false,
}: MembershipCardProps) {
  // Theme colors with fallbacks to handle timing issue where useThemeColor may return "invalid"
  const foreground = useThemeColor("foreground") || "#06273a";
  const background = useThemeColor("background") || "#fffef8";
  const border = useThemeColor("border") || "#e5e5e5";

  // Format member since date to "Month Year" format
  const formattedDate = memberSince
    ? new Date(memberSince).toLocaleDateString("en-GB", {
        month: "long",
        year: "numeric",
      })
    : new Date().toLocaleDateString("en-GB", {
        month: "long",
        year: "numeric",
      });

  // Use rotation sensor for device orientation
  const rotationSensor = useAnimatedSensor(SensorType.ROTATION, {
    interval: "auto",
  });

  // Create animated style that responds to device tilt
  const animatedCardStyle = useAnimatedStyle(() => {
    if (disableAnimation) {
      return {
        transform: [{ perspective: 1000 }],
      };
    }

    const { pitch, roll } = rotationSensor.sensor.value;

    const pitchDegrees = pitch * (180 / Math.PI);
    const rollDegrees = roll * (180 / Math.PI);

    const rotateX = interpolate(
      pitchDegrees,
      [-45, 45],
      [MAX_TILT, -MAX_TILT],
      Extrapolation.CLAMP
    );

    const rotateY = interpolate(
      rollDegrees,
      [-45, 45],
      [-MAX_TILT, MAX_TILT],
      Extrapolation.CLAMP
    );

    return {
      transform: [
        { perspective: 1000 },
        { rotateX: withSpring(`${rotateX}deg`, SPRING_CONFIG) },
        { rotateY: withSpring(`${rotateY}deg`, SPRING_CONFIG) },
      ],
    };
  });

  // Create a subtle shadow animation that responds to tilt
  const animatedShadowStyle = useAnimatedStyle(() => {
    if (disableAnimation) {
      return {
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
      };
    }

    const { pitch, roll } = rotationSensor.sensor.value;

    const pitchDegrees = pitch * (180 / Math.PI);
    const rollDegrees = roll * (180 / Math.PI);

    const shadowX = interpolate(
      rollDegrees,
      [-45, 45],
      [6, -6],
      Extrapolation.CLAMP
    );

    const shadowY = interpolate(
      pitchDegrees,
      [-45, 45],
      [-2, 10],
      Extrapolation.CLAMP
    );

    const tiltMagnitude = Math.sqrt(
      pitchDegrees * pitchDegrees + rollDegrees * rollDegrees
    );
    const shadowOpacity = interpolate(
      tiltMagnitude,
      [0, 30],
      [0.2, 0.35],
      Extrapolation.CLAMP
    );

    return {
      shadowOffset: {
        width: withSpring(shadowX, SPRING_CONFIG),
        height: withSpring(shadowY, SPRING_CONFIG),
      },
      shadowOpacity: withSpring(shadowOpacity, SPRING_CONFIG),
    };
  });

  return (
    <Animated.View style={[styles.cardContainer, animatedShadowStyle]}>
      <Animated.View style={[styles.cardWrapper, animatedCardStyle]}>
        {/* Double border effect */}
        <View
          style={[
            styles.outerBorder,
            { borderColor: border, backgroundColor: background },
          ]}
        >
          <View style={[styles.innerBorder, { borderColor: border }]}>
            {/* Card background image */}
            <View style={styles.cardContent}>
              <Image
                resizeMode="cover"
                source={MEMBERSHIP_CARD_BG}
                style={styles.backgroundImage}
              />

              {/* Text overlays */}
              <View style={styles.textOverlay}>
                {/* Member name - positioned below "This is to introduce" */}
                <View style={styles.nameContainer}>
                  <Text style={[styles.memberName, { color: foreground }]}>
                    {memberName.toUpperCase()}
                  </Text>
                </View>

                {/* Bottom row: Date and Secretary signature */}
                <View style={styles.bottomRow}>
                  {/* Date - bottom left, cursive style */}
                  <Text style={[styles.dateText, { color: foreground }]}>
                    {formattedDate}
                  </Text>

                  {/* Secretary signature - bottom right */}
                  <View style={styles.signatureContainer}>
                    {/* Name above the line in cursive */}
                    <Text style={[styles.secretaryName, { color: foreground }]}>
                      {secretaryName}
                    </Text>
                    {/* Line */}
                    <View
                      style={[
                        styles.signatureLine,
                        { backgroundColor: foreground },
                      ]}
                    />
                    {/* "Secretary" below the line */}
                    <Text
                      style={[styles.secretaryTitle, { color: foreground }]}
                    >
                      Secretary
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
  cardWrapper: {
    flex: 1,
    transformOrigin: "center",
  },
  outerBorder: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 3,
    overflow: "hidden",
  },
  innerBorder: {
    flex: 1,
    margin: 3,
    borderRadius: 8,
    borderWidth: 1.5,
    overflow: "hidden",
  },
  cardContent: {
    flex: 1,
    position: "relative",
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  textOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
    padding: 16,
    paddingTop: CARD_HEIGHT * 0.52, // Position below "This is to introduce"
    paddingBottom: 12,
  },
  nameContainer: {
    alignItems: "center",
  },
  memberName: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 2,
    fontFamily: "serif",
    textAlign: "center",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  dateText: {
    fontSize: 16,
    fontFamily: "DancingScript-Regular",
  },
  signatureContainer: {
    alignItems: "center",
  },
  secretaryName: {
    fontSize: 14,
    fontFamily: "DancingScript-Regular",
    marginBottom: 2,
  },
  signatureLine: {
    width: 80,
    height: 1,
  },
  secretaryTitle: {
    fontSize: 10,
    fontFamily: "serif",
    marginTop: 2,
  },
});

export default MembershipCard;

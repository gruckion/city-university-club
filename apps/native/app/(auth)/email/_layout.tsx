import Ionicons from "@expo/vector-icons/build/Ionicons";
import { Link, Stack } from "expo-router";
import { useThemeColor } from "heroui-native";
import { Pressable } from "react-native";

export default function EmailLayout() {
  const background = useThemeColor("background");
  const foreground = useThemeColor("foreground");

  return (
    <Stack
      screenOptions={{
        gestureEnabled: false,
        headerTransparent: true,
        headerStyle: {
          backgroundColor: background,
        },
        headerTintColor: foreground,
        contentStyle: {
          backgroundColor: background,
        },
      }}
    >
      <Stack.Screen
        name="signin"
        options={{
          headerLeft: () => <CloseButton />,
          title: "",
        }}
      />
      <Stack.Screen
        name="signup"
        options={{
          headerLeft: () => <CloseButton />,
          title: "",
          headerBackTitle: "Sign In",
        }}
      />
      <Stack.Screen
        name="(reset)/request-password-reset"
        options={{
          title: "",
          headerBackTitle: "Sign In",
        }}
      />
      <Stack.Screen
        name="(reset)/verify-reset-code"
        options={{
          title: "",
          headerBackTitle: "Back",
        }}
      />
      <Stack.Screen
        name="(reset)/reset-password"
        options={{
          title: "",
        }}
      />
    </Stack>
  );
}

const CloseButton = () => {
  const foreground = useThemeColor("foreground");

  return (
    <Link asChild href="..">
      <Pressable
        className="bg-foreground/10"
        style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons color={foreground} name="close" size={20} />
      </Pressable>
    </Link>
  );
};

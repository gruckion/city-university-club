import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import FormHeader, {
  CUC_COLORS,
  FormContainer,
  StyledButton,
  StyledTextInput,
} from "@/components/form";
import { authClient } from "@/lib/auth-client";

/**
 * Sanitize error messages for password reset
 */
function getSafeErrorMessage(errorMessage: string | undefined): string {
  const lowerMessage = (errorMessage || "").toLowerCase();

  if (
    lowerMessage.includes("token") ||
    lowerMessage.includes("expired") ||
    lowerMessage.includes("invalid")
  ) {
    return "This reset link has expired or is invalid. Please request a new one.";
  }

  if (
    lowerMessage.includes("password") &&
    (lowerMessage.includes("weak") || lowerMessage.includes("short"))
  ) {
    return "Password does not meet requirements. Please use at least 6 characters.";
  }

  return "Unable to reset password. Please try again or request a new reset link.";
}

export default function ResetPasswordRoute() {
  const router = useRouter();
  const { token, error } = useLocalSearchParams<{
    token: string;
    error?: string;
  }>();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!password) {
      Alert.alert("Error", "Please enter your new password");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords don't match");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    await authClient.resetPassword(
      {
        newPassword: password,
        token,
      },
      {
        onRequest: () => {
          setIsLoading(true);
        },
        onError: (ctx) => {
          setIsLoading(false);
          Alert.alert("Error", getSafeErrorMessage(ctx.error.message));
        },
        onSuccess: () => {
          setIsLoading(false);
          Alert.alert(
            "Success",
            "Password reset successfully. Please sign in with your new password."
          );
          router.back();
        },
      }
    );
  };

  // Invalid token state
  if (error === "INVALID_TOKEN" || !token) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: CUC_COLORS.cream,
          justifyContent: "center",
          paddingHorizontal: 24,
        }}
      >
        <View style={{ alignItems: "center", marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 28,
              fontWeight: "300",
              fontFamily: "serif",
              color: CUC_COLORS.navy,
              marginBottom: 12,
              textAlign: "center",
            }}
          >
            Invalid Link
          </Text>
          <Text
            style={{
              fontSize: 15,
              color: "#666",
              textAlign: "center",
              lineHeight: 22,
            }}
          >
            This reset link has expired or is invalid. Please request a new one.
          </Text>
        </View>
        <Link asChild href="/(auth)/email/signin">
          <Pressable
            style={{
              backgroundColor: CUC_COLORS.navy,
              borderRadius: 12,
              paddingVertical: 16,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: CUC_COLORS.cream,
                fontSize: 16,
                fontWeight: "600",
              }}
            >
              Back to Sign In
            </Text>
          </Pressable>
        </Link>
      </View>
    );
  }

  return (
    <FormContainer>
      <FormHeader
        description="Enter your new password to complete the reset"
        title="New Password"
      />

      <StyledTextInput
        label="New Password"
        onChangeText={setPassword}
        placeholder="Enter your new password"
        secureTextEntry
        textContentType="password"
        value={password}
      />

      <StyledTextInput
        label="Confirm Password"
        onChangeText={setConfirmPassword}
        placeholder="Confirm your new password"
        secureTextEntry
        textContentType="password"
        value={confirmPassword}
      />

      <View style={{ marginTop: 8 }}>
        <StyledButton
          isLoading={isLoading}
          label="Reset Password"
          onPress={handleResetPassword}
        />
      </View>
    </FormContainer>
  );
}

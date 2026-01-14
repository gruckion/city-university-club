import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, View } from "react-native";
import FormHeader, {
  FormContainer,
  StyledButton,
  StyledTextInput,
} from "@/components/form";
import { authClient } from "@/lib/auth-client";

export default function RequestPasswordResetRoute() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRequestReset = async () => {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email");
      return;
    }

    await authClient.requestPasswordReset(
      {
        email,
        redirectTo: Linking.createURL("email/reset-password"),
      },
      {
        onRequest: () => {
          setIsLoading(true);
        },
        onError: () => {
          setIsLoading(false);
          // SECURITY: Always show success message to prevent email enumeration
          // We don't reveal whether the email exists in our system
          Alert.alert(
            "Check Your Email",
            "If an account exists with this email, you'll receive a password reset link shortly."
          );
          router.back();
        },
        onSuccess: () => {
          setIsLoading(false);
          Alert.alert(
            "Check Your Email",
            "If an account exists with this email, you'll receive a password reset link shortly."
          );
          router.back();
        },
      }
    );
  };

  return (
    <FormContainer>
      <FormHeader
        description="Enter your email address and we'll send you a link to reset your password"
        title="Reset Password"
      />

      <StyledTextInput
        autoCapitalize="none"
        keyboardType="email-address"
        label="Email Address"
        onChangeText={setEmail}
        placeholder="Enter your email"
        textContentType="emailAddress"
        value={email}
      />

      <View style={{ marginTop: 8 }}>
        <StyledButton
          isLoading={isLoading}
          label="Send Reset Link"
          onPress={handleRequestReset}
        />
      </View>
    </FormContainer>
  );
}

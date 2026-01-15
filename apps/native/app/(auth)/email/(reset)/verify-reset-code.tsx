import { useLocalSearchParams, useRouter } from "expo-router";
import { InputOTP } from "heroui-native";
import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { SystemBars } from "react-native-edge-to-edge";
import FormHeader, { CUC_COLORS, StyledButton } from "@/components/form";
import { KeyboardAwareForm } from "@/components/keyboard";
import { authClient } from "@/lib/auth-client";

export default function VerifyResetCodeRoute() {
  const router = useRouter();
  const { email, otp: prefilledOtp } = useLocalSearchParams<{
    email: string;
    otp?: string;
  }>();

  const [otp, setOtp] = useState(prefilledOtp || "");
  const [isResending, setIsResending] = useState(false);

  // Auto-navigate if OTP was pre-filled from deep link
  const hasAutoNavigated = useRef(false);

  // Set dark status bar style for light background (stack-based approach)
  useEffect(() => {
    const entry = SystemBars.pushStackEntry({ style: "dark" });
    return () => SystemBars.popStackEntry(entry);
  }, []);

  const handleVerifyCode = useCallback(
    (codeToVerify?: string) => {
      const code = codeToVerify || otp;

      if (!code || code.length !== 6) {
        Alert.alert("Error", "Please enter the 6-digit code from your email");
        return;
      }

      if (!email) {
        Alert.alert("Error", "Email is required. Please try again.");
        router.back();
        return;
      }

      // Navigate to reset password screen with email and OTP
      // The OTP validation happens when the user submits the new password
      // This is the correct flow per Better Auth documentation
      router.replace({
        pathname: "/(auth)/email/(reset)/reset-password",
        params: { email, otp: code },
      });
    },
    [otp, email, router]
  );

  useEffect(() => {
    if (prefilledOtp && !hasAutoNavigated.current) {
      hasAutoNavigated.current = true;
      handleVerifyCode(prefilledOtp);
    }
  }, [prefilledOtp, handleVerifyCode]);

  const handleResendCode = async () => {
    if (!email) {
      Alert.alert("Error", "Email is required");
      return;
    }

    setIsResending(true);

    try {
      const { error } = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "forget-password",
      });

      setIsResending(false);

      if (error) {
        // SECURITY: Don't reveal if email exists
        Alert.alert(
          "Code Sent",
          "If an account exists with this email, you'll receive a new code shortly."
        );
      } else {
        Alert.alert(
          "Code Sent",
          "A new verification code has been sent to your email."
        );
      }
    } catch (_err) {
      setIsResending(false);
      Alert.alert(
        "Code Sent",
        "If an account exists with this email, you'll receive a new code shortly."
      );
    }
  };

  // No email provided - show error state
  if (!email) {
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
            Something Went Wrong
          </Text>
          <Text
            style={{
              fontSize: 15,
              color: "#666",
              textAlign: "center",
              lineHeight: 22,
            }}
          >
            We couldn't find your email address. Please try requesting a new
            password reset.
          </Text>
        </View>
        <Pressable
          onPress={() =>
            router.replace("/(auth)/email/(reset)/request-password-reset")
          }
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
            Request New Code
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <KeyboardAwareForm>
      <FormHeader
        description={`Enter the 6-digit code we sent to ${email}`}
        title="Verify Code"
      />

      <View style={{ alignItems: "center", marginBottom: 8 }}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: "500",
            color: CUC_COLORS.navy,
            marginBottom: 12,
          }}
        >
          Verification Code
        </Text>
        <InputOTP
          inputMode="numeric"
          maxLength={6}
          onChange={setOtp}
          onComplete={handleVerifyCode}
          textInputProps={{
            autoComplete: "one-time-code",
            textContentType: "oneTimeCode",
          }}
          value={otp}
        >
          <InputOTP.Group
            className="gap-2"
            style={{
              flexDirection: "row",
              gap: 8,
            }}
          >
            <InputOTP.Slot
              index={0}
              style={{
                width: 48,
                height: 56,
                borderWidth: 2,
                borderColor: CUC_COLORS.navy,
                borderRadius: 12,
                backgroundColor: "#fff",
                alignItems: "center",
                justifyContent: "center",
              }}
            />
            <InputOTP.Slot
              index={1}
              style={{
                width: 48,
                height: 56,
                borderWidth: 2,
                borderColor: CUC_COLORS.navy,
                borderRadius: 12,
                backgroundColor: "#fff",
                alignItems: "center",
                justifyContent: "center",
              }}
            />
            <InputOTP.Slot
              index={2}
              style={{
                width: 48,
                height: 56,
                borderWidth: 2,
                borderColor: CUC_COLORS.navy,
                borderRadius: 12,
                backgroundColor: "#fff",
                alignItems: "center",
                justifyContent: "center",
              }}
            />
          </InputOTP.Group>
          <InputOTP.Separator>
            <Text
              style={{
                fontSize: 24,
                color: CUC_COLORS.navy,
                paddingHorizontal: 8,
              }}
            >
              -
            </Text>
          </InputOTP.Separator>
          <InputOTP.Group
            className="gap-2"
            style={{
              flexDirection: "row",
              gap: 8,
            }}
          >
            <InputOTP.Slot
              index={3}
              style={{
                width: 48,
                height: 56,
                borderWidth: 2,
                borderColor: CUC_COLORS.navy,
                borderRadius: 12,
                backgroundColor: "#fff",
                alignItems: "center",
                justifyContent: "center",
              }}
            />
            <InputOTP.Slot
              index={4}
              style={{
                width: 48,
                height: 56,
                borderWidth: 2,
                borderColor: CUC_COLORS.navy,
                borderRadius: 12,
                backgroundColor: "#fff",
                alignItems: "center",
                justifyContent: "center",
              }}
            />
            <InputOTP.Slot
              index={5}
              style={{
                width: 48,
                height: 56,
                borderWidth: 2,
                borderColor: CUC_COLORS.navy,
                borderRadius: 12,
                backgroundColor: "#fff",
                alignItems: "center",
                justifyContent: "center",
              }}
            />
          </InputOTP.Group>
        </InputOTP>
      </View>

      <View style={{ marginTop: 8, gap: 12 }}>
        <StyledButton label="Continue" onPress={() => handleVerifyCode()} />

        <StyledButton
          isLoading={isResending}
          label="Resend Code"
          onPress={handleResendCode}
          variant="secondary"
        />
      </View>

      <View style={{ marginTop: 16, alignItems: "center" }}>
        <Text style={{ color: "#666", fontSize: 14 }}>
          Code expires in 5 minutes
        </Text>
      </View>
    </KeyboardAwareForm>
  );
}

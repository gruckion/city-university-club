import { useThemeColor } from "heroui-native";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  type TextInputProps,
  View,
} from "react-native";

/* ----------------------------- form container ----------------------------- */
export function FormContainer({ children }: { children: React.ReactNode }) {
  return (
    <View
      className="flex-1 bg-background"
      style={{
        paddingHorizontal: 24,
        paddingTop: 100,
        gap: 16,
      }}
    >
      {children}
    </View>
  );
}

/* ------------------------------- form header ------------------------------ */
export default function FormHeader({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <View style={{ gap: 8, marginBottom: 8 }}>
      <Text
        className="text-foreground"
        style={{
          fontSize: 32,
          fontWeight: "300",
          fontFamily: "serif",
        }}
      >
        {title}
      </Text>
      <Text
        className="text-muted"
        style={{
          fontSize: 15,
          lineHeight: 22,
        }}
      >
        {description}
      </Text>
      {children}
    </View>
  );
}

/* ----------------------------- styled text input -------------------------- */

export interface StyledTextInputProps {
  // Required props
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;

  // Optional native props
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoCorrect?: boolean;
  textContentType?:
    | "emailAddress"
    | "password"
    | "newPassword"
    | "name"
    | "none"
    | "oneTimeCode";
  autoComplete?:
    | "email"
    | "password"
    | "new-password"
    | "name"
    | "off"
    | "one-time-code";

  // Keyboard navigation (React 19 - ref as prop)
  ref?: React.Ref<TextInput>;
  returnKeyType?: TextInputProps["returnKeyType"];
  onSubmitEditing?: TextInputProps["onSubmitEditing"];
  blurOnSubmit?: boolean;
}

export function StyledTextInput({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  autoCorrect,
  textContentType,
  autoComplete,
  ref,
  returnKeyType,
  onSubmitEditing,
  blurOnSubmit,
}: StyledTextInputProps) {
  const muted = useThemeColor("muted");

  return (
    <View style={{ gap: 8 }}>
      <Text
        className="text-foreground"
        style={{
          fontSize: 14,
          fontWeight: "500",
        }}
      >
        {label}
      </Text>
      <TextInput
        autoCapitalize={autoCapitalize}
        autoComplete={autoComplete}
        autoCorrect={autoCorrect}
        blurOnSubmit={blurOnSubmit}
        className="border-border bg-surface text-foreground"
        keyboardType={keyboardType}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        placeholder={placeholder}
        placeholderTextColor={muted}
        ref={ref}
        returnKeyType={returnKeyType}
        secureTextEntry={secureTextEntry}
        style={{
          borderRadius: 12,
          paddingHorizontal: 16,
          paddingVertical: 16,
          fontSize: 16,
          borderWidth: 1,
        }}
        textContentType={textContentType}
        value={value}
      />
    </View>
  );
}

/* ----------------------------- styled button ------------------------------ */

export interface StyledButtonProps {
  onPress: () => void;
  label: string;
  isLoading?: boolean;
  variant?: "primary" | "secondary" | "tertiary";
}

export function StyledButton({
  onPress,
  label,
  isLoading,
  variant = "primary",
}: StyledButtonProps) {
  const foreground = useThemeColor("foreground");
  const primaryForeground = "#fffef8";

  const getClassName = () => {
    switch (variant) {
      case "secondary":
        return "bg-surface border-primary";
      case "tertiary":
        return "bg-transparent";
      default:
        return "bg-primary";
    }
  };

  const getTextClassName = () => {
    switch (variant) {
      case "secondary":
      case "tertiary":
        return "text-foreground";
      default:
        return "text-primary-foreground";
    }
  };

  const getActivityIndicatorColor = () => {
    switch (variant) {
      case "secondary":
      case "tertiary":
        return foreground;
      default:
        return primaryForeground;
    }
  };

  return (
    <Pressable
      className={getClassName()}
      disabled={isLoading}
      onPress={onPress}
      style={{
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: "center",
        opacity: isLoading ? 0.7 : 1,
        borderWidth: variant === "secondary" ? 1 : 0,
      }}
    >
      {isLoading ? (
        <ActivityIndicator color={getActivityIndicatorColor()} size="small" />
      ) : (
        <Text
          className={getTextClassName()}
          style={{
            fontSize: 16,
            fontWeight: "600",
          }}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

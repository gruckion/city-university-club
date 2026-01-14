import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  type TextInputProps,
  View,
} from "react-native";

// CUC brand colors
const CUC_COLORS = {
  navy: "#06273a",
  sage: "#85b09a",
  cream: "#fffef8",
  white: "#ffffff",
};

/* ----------------------------- form container ----------------------------- */
export function FormContainer({ children }: { children: React.ReactNode }) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: CUC_COLORS.cream,
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
        style={{
          fontSize: 32,
          fontWeight: "300",
          fontFamily: "serif",
          color: CUC_COLORS.navy,
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          fontSize: 15,
          color: "#666",
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
  // Keyboard navigation props (React 19 - ref as prop, no forwardRef)
  ref,
  returnKeyType,
  onSubmitEditing,
  blurOnSubmit,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoCorrect?: boolean;
  textContentType?:
    | "emailAddress"
    | "password"
    | "newPassword"
    | "name"
    | "none";
  autoComplete?: "email" | "password" | "new-password" | "name" | "off";
  // Keyboard navigation props
  ref?: React.Ref<TextInput>;
  returnKeyType?: TextInputProps["returnKeyType"];
  onSubmitEditing?: TextInputProps["onSubmitEditing"];
  blurOnSubmit?: boolean;
}) {
  return (
    <View style={{ gap: 8 }}>
      <Text
        style={{
          fontSize: 14,
          fontWeight: "500",
          color: CUC_COLORS.navy,
        }}
      >
        {label}
      </Text>
      <TextInput
        autoCapitalize={autoCapitalize}
        autoComplete={autoComplete}
        autoCorrect={autoCorrect}
        blurOnSubmit={blurOnSubmit}
        keyboardType={keyboardType}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        placeholder={placeholder}
        placeholderTextColor="#999"
        ref={ref}
        returnKeyType={returnKeyType}
        secureTextEntry={secureTextEntry}
        style={{
          backgroundColor: CUC_COLORS.white,
          borderRadius: 12,
          paddingHorizontal: 16,
          paddingVertical: 16,
          fontSize: 16,
          color: CUC_COLORS.navy,
          borderWidth: 1,
          borderColor: "#e5e5e5",
        }}
        textContentType={textContentType}
        value={value}
      />
    </View>
  );
}

/* ----------------------------- styled button ------------------------------ */
export function StyledButton({
  onPress,
  label,
  isLoading,
  variant = "primary",
}: {
  onPress: () => void;
  label: string;
  isLoading?: boolean;
  variant?: "primary" | "secondary" | "tertiary";
}) {
  const getStyles = () => {
    switch (variant) {
      case "secondary":
        return {
          backgroundColor: CUC_COLORS.white,
          borderWidth: 1,
          borderColor: CUC_COLORS.navy,
        };
      case "tertiary":
        return {
          backgroundColor: "transparent",
        };
      default:
        return {
          backgroundColor: CUC_COLORS.navy,
        };
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case "secondary":
      case "tertiary":
        return CUC_COLORS.navy;
      default:
        return CUC_COLORS.cream;
    }
  };

  return (
    <Pressable
      disabled={isLoading}
      onPress={onPress}
      style={{
        ...getStyles(),
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: "center",
        opacity: isLoading ? 0.7 : 1,
      }}
    >
      {isLoading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <Text
          style={{
            color: getTextColor(),
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

export { CUC_COLORS };

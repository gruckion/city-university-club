import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useThemeColor } from "heroui-native";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { authClient } from "@/lib/auth-client";

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export default function Contact() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Theme colors for Ionicons
  const accent = useThemeColor("accent");
  const primaryForeground = "#fffef8";

  // Get session - authenticated users don't need to enter name/email/phone
  const { data: session } = authClient.useSession();
  const isAuthenticated = !!session?.user;

  // Form state - guest fields only used when NOT authenticated
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateEmail = (email: string): boolean => {
    return EMAIL_REGEX.test(email);
  };

  // Derive final values - session takes precedence for authenticated users
  const getName = () =>
    isAuthenticated ? session.user.name || "" : formData.name;
  const getEmail = () =>
    isAuthenticated ? session.user.email || "" : formData.email;
  const getPhone = () => (isAuthenticated ? "" : formData.phone);

  const handleSubmit = () => {
    const name = getName();
    const email = getEmail();

    // Only validate guest fields if not authenticated
    if (!isAuthenticated) {
      if (!name.trim()) {
        Alert.alert("Required Field", "Please enter your name.");
        return;
      }

      if (!email.trim()) {
        Alert.alert("Required Field", "Please enter your email address.");
        return;
      }

      if (!validateEmail(email.trim())) {
        Alert.alert("Invalid Email", "Please enter a valid email address.");
        return;
      }
    }

    setIsSubmitting(true);

    // Prepare submission data
    const submissionData = {
      name: name.trim(),
      email: email.trim(),
      phone: getPhone().trim(),
      subject: formData.subject.trim(),
      message: formData.message.trim(),
    };

    console.log("Submitting contact form:", submissionData);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        "Message Sent",
        "Thank you for your message. We'll get back to you soon.",
        [
          {
            text: "OK",
            onPress: () => {
              // Reset form (only reset fields that are in state)
              setFormData({
                name: "",
                email: "",
                phone: "",
                subject: "",
                message: "",
              });
            },
          },
        ]
      );
    }, 500);
  };

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View
        className="bg-primary px-4 pb-4"
        style={{
          paddingTop: insets.top + 8,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Pressable
            onPress={() => router.back()}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 12,
            }}
          >
            <Ionicons color={primaryForeground} name="arrow-back" size={22} />
          </Pressable>
          <Text
            className="text-primary-foreground"
            style={{
              fontSize: 20,
              fontWeight: "300",
              fontFamily: "serif",
            }}
          >
            Contact Us
          </Text>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
          keyboardShouldPersistTaps="handled"
          style={{ flex: 1 }}
        >
          {/* Contact Info Card */}
          <View
            className="bg-surface"
            style={{
              borderRadius: 12,
              padding: 16,
              marginBottom: 20,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <Text
              className="text-foreground"
              style={{
                fontSize: 16,
                fontWeight: "600",
                marginBottom: 12,
              }}
            >
              Get in Touch
            </Text>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <Ionicons color={accent} name="location-outline" size={18} />
              <Text
                className="text-muted"
                style={{ fontSize: 14, marginLeft: 10 }}
              >
                42 Crutched Friars, London EC3N 2AP
              </Text>
            </View>

            <Pressable
              onPress={() => Linking.openURL("tel:02071676682")}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <Ionicons color={accent} name="call-outline" size={18} />
              <Text
                className="text-foreground"
                style={{ fontSize: 14, marginLeft: 10 }}
              >
                020 7167 6682
              </Text>
            </Pressable>

            <Pressable
              onPress={() =>
                Linking.openURL("mailto:info@cityuniversityclub.co.uk")
              }
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <Ionicons color={accent} name="mail-outline" size={18} />
              <Text
                className="text-foreground"
                style={{ fontSize: 14, marginLeft: 10 }}
              >
                info@cityuniversityclub.co.uk
              </Text>
            </Pressable>
          </View>

          {/* Contact Form */}
          <View
            className="bg-surface"
            style={{
              borderRadius: 12,
              padding: 16,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <Text
              className="text-foreground"
              style={{
                fontSize: 16,
                fontWeight: "600",
                marginBottom: 16,
              }}
            >
              Send us a Message
            </Text>

            {/* Authenticated User Info */}
            {isAuthenticated && (
              <View
                className="bg-accent/15"
                style={{
                  borderRadius: 8,
                  padding: 12,
                  marginBottom: 16,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Ionicons
                  color={accent}
                  name="person-circle-outline"
                  size={20}
                />
                <View style={{ marginLeft: 10, flex: 1 }}>
                  <Text
                    className="text-foreground"
                    style={{
                      fontSize: 14,
                      fontWeight: "500",
                    }}
                  >
                    {session.user.name || "Member"}
                  </Text>
                  <Text className="text-muted" style={{ fontSize: 13 }}>
                    {session.user.email}
                  </Text>
                </View>
              </View>
            )}

            {/* Guest Fields - Only shown when NOT authenticated */}
            {!isAuthenticated && (
              <>
                {/* Name Field */}
                <View style={{ marginBottom: 16 }}>
                  <Text
                    className="text-foreground"
                    style={{
                      fontSize: 14,
                      fontWeight: "500",
                      marginBottom: 6,
                    }}
                  >
                    Name <Text style={{ color: "#dc2626" }}>*</Text>
                  </Text>
                  <TextInput
                    className="border-border bg-surface text-foreground"
                    onChangeText={(value) => updateField("name", value)}
                    placeholder="Your full name"
                    placeholderTextColor="#999"
                    style={{
                      borderWidth: 1,
                      borderRadius: 8,
                      padding: 14,
                      fontSize: 15,
                    }}
                    value={formData.name}
                  />
                </View>

                {/* Email and Phone Row */}
                <View
                  style={{ flexDirection: "row", gap: 12, marginBottom: 16 }}
                >
                  {/* Email Field */}
                  <View style={{ flex: 1 }}>
                    <Text
                      className="text-foreground"
                      style={{
                        fontSize: 14,
                        fontWeight: "500",
                        marginBottom: 6,
                      }}
                    >
                      Email <Text style={{ color: "#dc2626" }}>*</Text>
                    </Text>
                    <TextInput
                      autoCapitalize="none"
                      autoCorrect={false}
                      className="border-border bg-surface text-foreground"
                      keyboardType="email-address"
                      onChangeText={(value) => updateField("email", value)}
                      placeholder="Email address"
                      placeholderTextColor="#999"
                      style={{
                        borderWidth: 1,
                        borderRadius: 8,
                        padding: 14,
                        fontSize: 15,
                      }}
                      value={formData.email}
                    />
                  </View>

                  {/* Phone Field */}
                  <View style={{ flex: 1 }}>
                    <Text
                      className="text-foreground"
                      style={{
                        fontSize: 14,
                        fontWeight: "500",
                        marginBottom: 6,
                      }}
                    >
                      Phone
                    </Text>
                    <TextInput
                      className="border-border bg-surface text-foreground"
                      keyboardType="phone-pad"
                      onChangeText={(value) => updateField("phone", value)}
                      placeholder="Phone number"
                      placeholderTextColor="#999"
                      style={{
                        borderWidth: 1,
                        borderRadius: 8,
                        padding: 14,
                        fontSize: 15,
                      }}
                      value={formData.phone}
                    />
                  </View>
                </View>
              </>
            )}

            {/* Subject Field */}
            <View style={{ marginBottom: 16 }}>
              <Text
                className="text-foreground"
                style={{
                  fontSize: 14,
                  fontWeight: "500",
                  marginBottom: 6,
                }}
              >
                Subject
              </Text>
              <TextInput
                className="border-border bg-surface text-foreground"
                onChangeText={(value) => updateField("subject", value)}
                placeholder="What is this regarding?"
                placeholderTextColor="#999"
                style={{
                  borderWidth: 1,
                  borderRadius: 8,
                  padding: 14,
                  fontSize: 15,
                }}
                value={formData.subject}
              />
            </View>

            {/* Message Field */}
            <View style={{ marginBottom: 20 }}>
              <Text
                className="text-foreground"
                style={{
                  fontSize: 14,
                  fontWeight: "500",
                  marginBottom: 6,
                }}
              >
                Message
              </Text>
              <TextInput
                className="border-border bg-surface text-foreground"
                multiline
                numberOfLines={5}
                onChangeText={(value) => updateField("message", value)}
                placeholder="Your message..."
                placeholderTextColor="#999"
                style={{
                  borderWidth: 1,
                  borderRadius: 8,
                  padding: 14,
                  fontSize: 15,
                  height: 120,
                }}
                textAlignVertical="top"
                value={formData.message}
              />
            </View>

            {/* Submit Button */}
            <Pressable
              className="bg-primary"
              disabled={isSubmitting}
              onPress={handleSubmit}
              style={({ pressed }) => ({
                opacity: pressed || isSubmitting ? 0.8 : 1,
                borderRadius: 8,
                padding: 16,
                alignItems: "center",
                justifyContent: "center",
              })}
            >
              <Text
                className="text-primary-foreground"
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                }}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Text>
            </Pressable>
          </View>

          {/* Opening Hours */}
          <View
            className="bg-primary"
            style={{
              borderRadius: 12,
              padding: 20,
              marginTop: 20,
            }}
          >
            <Text
              className="text-primary-foreground"
              style={{
                fontSize: 16,
                fontWeight: "600",
                marginBottom: 12,
              }}
            >
              Opening Hours
            </Text>
            <Text
              className="text-primary-foreground"
              style={{ fontSize: 14, lineHeight: 22 }}
            >
              Monday to Friday{"\n"}
              9:00 AM - 5:00 PM
            </Text>
            <Text
              className="text-accent"
              style={{ fontSize: 13, marginTop: 8 }}
            >
              Lunch: 12:00 PM - Last orders 2:30 PM
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

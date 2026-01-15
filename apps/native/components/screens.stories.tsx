import { Ionicons } from "@expo/vector-icons";
import type { StoryObj } from "@storybook/react-native";
import { Image } from "expo-image";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { fn } from "storybook/test";
import { CategoryFilter, EVENT_CATEGORIES } from "./CategoryFilter";
import { ExternalLinkButton } from "./ExternalLinkButton";
import FormHeader, {
  FormContainer,
  StyledButton,
  StyledTextInput,
} from "./form";

/* --------------------------------- Sign In Screen --------------------------------- */

export default {
  title: "Screens",
};

export const SignInScreen: StoryObj = {
  render: () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSignIn = () => {
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 2000);
    };

    return (
      <FormContainer>
        <FormHeader
          description="Sign in to access your membership and exclusive club features"
          title="Welcome Back"
        />

        <StyledTextInput
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          label="Email Address"
          onChangeText={setEmail}
          placeholder="Enter your email"
          textContentType="emailAddress"
          value={email}
        />

        <StyledTextInput
          autoComplete="password"
          label="Password"
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry
          textContentType="password"
          value={password}
        />

        <View style={{ marginTop: 8 }}>
          <StyledButton
            isLoading={isLoading}
            label="Sign In"
            onPress={handleSignIn}
          />
        </View>

        <Pressable style={{ alignSelf: "center", paddingVertical: 8 }}>
          <Text
            className="text-accent"
            style={{
              fontSize: 14,
              fontWeight: "500",
            }}
          >
            Forgot Password?
          </Text>
        </Pressable>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 24,
            gap: 4,
          }}
        >
          <Text className="text-muted" style={{ fontSize: 14 }}>
            Don't have an account?
          </Text>
          <Pressable>
            <Text
              className="text-accent"
              style={{
                fontSize: 14,
                fontWeight: "600",
              }}
            >
              Sign Up
            </Text>
          </Pressable>
        </View>
      </FormContainer>
    );
  },
};

/* --------------------------------- Sign Up Screen --------------------------------- */

export const SignUpScreen: StoryObj = {
  render: () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSignUp = () => {
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 2000);
    };

    return (
      <FormContainer>
        <FormHeader
          description="Join City University Club and enjoy exclusive member benefits"
          title="Create Account"
        />

        <StyledTextInput
          autoCapitalize="words"
          autoComplete="name"
          label="Full Name"
          onChangeText={setName}
          placeholder="Enter your full name"
          textContentType="name"
          value={name}
        />

        <StyledTextInput
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          label="Email Address"
          onChangeText={setEmail}
          placeholder="Enter your email"
          textContentType="emailAddress"
          value={email}
        />

        <StyledTextInput
          autoComplete="new-password"
          label="Password"
          onChangeText={setPassword}
          placeholder="Create a password"
          secureTextEntry
          textContentType="newPassword"
          value={password}
        />

        <StyledTextInput
          autoComplete="new-password"
          label="Confirm Password"
          onChangeText={setConfirmPassword}
          placeholder="Confirm your password"
          secureTextEntry
          textContentType="newPassword"
          value={confirmPassword}
        />

        <View style={{ marginTop: 8 }}>
          <StyledButton
            isLoading={isLoading}
            label="Create Account"
            onPress={handleSignUp}
          />
        </View>

        <Text
          className="text-center text-muted"
          style={{
            fontSize: 13,
            lineHeight: 20,
            paddingHorizontal: 20,
          }}
        >
          By signing up, you agree to our{" "}
          <Text
            className="text-foreground"
            style={{ textDecorationLine: "underline" }}
          >
            Terms of Service
          </Text>{" "}
          and{" "}
          <Text
            className="text-foreground"
            style={{ textDecorationLine: "underline" }}
          >
            Privacy Policy
          </Text>
        </Text>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 8,
            gap: 4,
          }}
        >
          <Text className="text-muted" style={{ fontSize: 14 }}>
            Already have an account?
          </Text>
          <Pressable>
            <Text
              className="text-accent"
              style={{
                fontSize: 14,
                fontWeight: "600",
              }}
            >
              Sign In
            </Text>
          </Pressable>
        </View>
      </FormContainer>
    );
  },
};

/* --------------------------------- Reset Password Screen --------------------------------- */

export const ResetPasswordScreen: StoryObj = {
  render: () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleReset = () => {
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 2000);
    };

    return (
      <FormContainer>
        <FormHeader
          description="Enter your new password to complete the reset"
          title="New Password"
        />

        <StyledTextInput
          autoComplete="new-password"
          label="New Password"
          onChangeText={setPassword}
          placeholder="Enter your new password"
          secureTextEntry
          textContentType="newPassword"
          value={password}
        />

        <StyledTextInput
          autoComplete="new-password"
          label="Confirm Password"
          onChangeText={setConfirmPassword}
          placeholder="Confirm your new password"
          secureTextEntry
          textContentType="newPassword"
          value={confirmPassword}
        />

        <View style={{ marginTop: 8 }}>
          <StyledButton
            isLoading={isLoading}
            label="Reset Password"
            onPress={handleReset}
          />
        </View>
      </FormContainer>
    );
  },
};

/* --------------------------------- Invalid Link Screen --------------------------------- */

export const InvalidLinkScreen: StoryObj = {
  render: () => (
    <View
      className="bg-background"
      style={{
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 24,
      }}
    >
      <View style={{ alignItems: "center", marginBottom: 32 }}>
        <Text
          className="text-center text-foreground"
          style={{
            fontSize: 28,
            fontWeight: "300",
            fontFamily: "serif",
            marginBottom: 12,
          }}
        >
          Invalid Link
        </Text>
        <Text
          className="text-center text-muted"
          style={{
            fontSize: 15,
            lineHeight: 22,
          }}
        >
          This reset link has expired or is invalid. Please request a new one.
        </Text>
      </View>
      <Pressable
        className="bg-primary"
        style={{
          borderRadius: 12,
          paddingVertical: 16,
          alignItems: "center",
        }}
      >
        <Text
          className="text-primary-foreground"
          style={{
            fontSize: 16,
            fontWeight: "600",
          }}
        >
          Back to Sign In
        </Text>
      </Pressable>
    </View>
  ),
};

/* --------------------------------- Events List Screen --------------------------------- */

const SAMPLE_EVENTS = [
  {
    id: "christmas-lunch-2025",
    title: "Christmas Lunch",
    description: "Enjoy our special festive menu in the Main Dining Room",
    dateRange: "1st - 23rd December",
    type: "seasonal",
    image:
      "https://static.wixstatic.com/media/11062b_7daf34b38d874071a1001caa9dde798f~mv2_d_5616_3744_s_4_2.jpg/v1/fill/w_400,h_300,al_c,q_80/11062b_7daf34b38d874071a1001caa9dde798f~mv2_d_5616_3744_s_4_2.webp",
  },
  {
    id: "wine-tasting",
    title: "Wine Tasting Evening",
    description: "Sample fine wines from our cellar with expert guidance",
    dateRange: "Monthly",
    type: "recurring",
    image:
      "https://static.wixstatic.com/media/da00a6_52bcb81f629b40c383a2f1a09aa1d97e~mv2.jpg/v1/fill/w_400,h_300,al_c,q_80/da00a6_52bcb81f629b40c383a2f1a09aa1d97e~mv2.webp",
  },
];

export const EventsListScreen: StoryObj = {
  render: () => {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(
      null
    );

    const filteredEvents = selectedCategory
      ? SAMPLE_EVENTS.filter((event) => event.type === selectedCategory)
      : SAMPLE_EVENTS;

    return (
      <View className="flex-1 bg-background">
        {/* Header */}
        <View
          className="bg-primary"
          style={{
            paddingTop: 60,
            paddingBottom: 20,
            paddingHorizontal: 20,
          }}
        >
          <Text
            className="text-primary-foreground"
            style={{
              fontSize: 28,
              fontWeight: "300",
              fontFamily: "serif",
            }}
          >
            Events
          </Text>
          <Text
            className="text-accent"
            style={{
              fontSize: 14,
              marginTop: 4,
            }}
          >
            Upcoming events at City University Club
          </Text>
        </View>

        {/* Category Filter */}
        <CategoryFilter
          categories={EVENT_CATEGORIES}
          onSelectCategory={setSelectedCategory}
          selectedCategory={selectedCategory}
        />

        <ScrollView
          contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
          style={{ flex: 1 }}
        >
          {filteredEvents.length === 0 ? (
            <View
              style={{
                padding: 32,
                alignItems: "center",
              }}
            >
              <Ionicons color="#85b09a" name="calendar-outline" size={48} />
              <Text
                className="text-foreground"
                style={{
                  fontSize: 16,
                  marginTop: 16,
                  textAlign: "center",
                }}
              >
                No events found in this category
              </Text>
              <Pressable
                className="bg-accent"
                onPress={() => setSelectedCategory(null)}
                style={{
                  marginTop: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 8,
                }}
              >
                <Text
                  className="text-foreground"
                  style={{
                    fontWeight: "500",
                  }}
                >
                  View All Events
                </Text>
              </Pressable>
            </View>
          ) : (
            filteredEvents.map((event, index) => (
              <EventCardStory
                event={event}
                featured={index === 0 && selectedCategory === null}
                key={event.id}
              />
            ))
          )}

          {/* View Website Link */}
          <ExternalLinkButton
            label="View All Events"
            url="https://www.cityuniversityclub.co.uk/events"
            variant="subtle"
          />
        </ScrollView>
      </View>
    );
  },
};

/* Helper component for event card in stories */
function EventCardStory({
  event,
  featured,
}: {
  event: (typeof SAMPLE_EVENTS)[0];
  featured?: boolean;
}) {
  return (
    <Pressable
      className={featured ? "bg-primary" : "bg-surface"}
      style={{
        borderRadius: 12,
        marginBottom: 16,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <Image
        contentFit="cover"
        source={event.image}
        style={{ width: "100%", height: 160 }}
        transition={200}
      />

      <View style={{ padding: 16 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              className={
                featured ? "text-primary-foreground" : "text-foreground"
              }
              style={{
                fontSize: 18,
                fontWeight: "600",
                marginBottom: 4,
              }}
            >
              {event.title}
            </Text>
            <Text
              className={featured ? "text-accent" : "text-muted"}
              style={{
                fontSize: 14,
                lineHeight: 20,
              }}
            >
              {event.description}
            </Text>
          </View>
          {featured && (
            <View
              className="bg-accent"
              style={{
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 12,
                marginLeft: 8,
              }}
            >
              <Text
                className="text-foreground"
                style={{
                  fontSize: 11,
                  fontWeight: "600",
                }}
              >
                Featured
              </Text>
            </View>
          )}
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 16,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Ionicons
              color={featured ? "#85b09a" : "#666666"}
              name="calendar-outline"
              size={16}
            />
            <Text
              className={featured ? "text-accent" : "text-muted"}
              style={{
                fontSize: 13,
              }}
            >
              {event.dateRange}
            </Text>
          </View>

          <View
            className={featured ? "bg-primary-foreground" : "bg-primary"}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 6,
            }}
          >
            <Text
              className={featured ? "text-primary" : "text-primary-foreground"}
              style={{
                fontSize: 13,
                fontWeight: "500",
              }}
            >
              RSVP
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

/* --------------------------------- Empty Events State --------------------------------- */

export const EventsEmptyState: StoryObj = {
  render: () => (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View
        className="bg-primary"
        style={{
          paddingTop: 60,
          paddingBottom: 20,
          paddingHorizontal: 20,
        }}
      >
        <Text
          className="text-primary-foreground"
          style={{
            fontSize: 28,
            fontWeight: "300",
            fontFamily: "serif",
          }}
        >
          Events
        </Text>
        <Text
          className="text-accent"
          style={{
            fontSize: 14,
            marginTop: 4,
          }}
        >
          Upcoming events at City University Club
        </Text>
      </View>

      {/* Category Filter with selection */}
      <CategoryFilter
        categories={EVENT_CATEGORIES}
        onSelectCategory={fn()}
        selectedCategory="special"
      />

      {/* Empty State */}
      <View
        style={{
          flex: 1,
          padding: 32,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons color="#85b09a" name="calendar-outline" size={48} />
        <Text
          className="text-foreground"
          style={{
            fontSize: 16,
            marginTop: 16,
            textAlign: "center",
          }}
        >
          No events found in this category
        </Text>
        <Pressable
          className="bg-accent"
          style={{
            marginTop: 12,
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 8,
          }}
        >
          <Text
            className="text-foreground"
            style={{
              fontWeight: "500",
            }}
          >
            View All Events
          </Text>
        </Pressable>
      </View>
    </View>
  ),
};

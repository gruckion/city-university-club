import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { Button, Surface, useTheme } from "heroui-native";
import { Pressable, Text, View } from "react-native";
import { Container } from "@/components/container";
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "@convoexpo-and-nextjs-web-bun-better-auth/backend/convex/_generated/api";
import { authClient } from "@/lib/auth-client";

export default function Home() {
	const router = useRouter();
	const { colors } = useTheme();
	const { isAuthenticated } = useConvexAuth();
	const user = useQuery(api.auth.getCurrentUser, isAuthenticated ? {} : "skip");

	// If not authenticated, show landing prompt
	if (!isAuthenticated) {
		return (
			<Container className="p-6">
				<View className="flex-1 justify-center items-center">
					<Text className="text-4xl font-bold text-foreground text-center mb-2">
						City University Club
					</Text>
					<Text className="text-muted-foreground text-center mb-8">
						Your exclusive members club
					</Text>
					<Button
						size="lg"
						className="w-full rounded-2xl"
						onPress={() => router.push("/(auth)/landing")}
					>
						<Button.LabelContent>Sign In</Button.LabelContent>
					</Button>
				</View>
			</Container>
		);
	}

	return (
		<Container className="p-4">
			{/* Welcome Section */}
			<View className="mb-6">
				<Text className="text-2xl font-bold text-foreground">
					Welcome back, {user?.name?.split(" ")[0] || "Member"}
				</Text>
				<Text className="text-muted-foreground text-sm mt-1">
					City University Club Member
				</Text>
			</View>

			{/* Membership Card Preview */}
			<Surface className="p-5 rounded-2xl mb-6 bg-accent">
				<View className="flex-row justify-between items-start mb-4">
					<View>
						<Text className="text-accent-foreground font-semibold text-lg">
							{user?.name || "Member"}
						</Text>
						<Text className="text-accent-foreground/70 text-xs mt-0.5">
							Member since 2024
						</Text>
					</View>
					<View className="bg-accent-foreground/20 px-3 py-1 rounded-full">
						<Text className="text-accent-foreground text-xs font-medium">
							Active
						</Text>
					</View>
				</View>
				<View className="flex-row items-center gap-2">
					<Ionicons name="card-outline" size={16} color={colors.accentForeground} />
					<Text className="text-accent-foreground/80 text-sm">
						View full membership card
					</Text>
				</View>
			</Surface>

			{/* Quick Actions */}
			<Text className="text-foreground font-semibold mb-3">Quick Actions</Text>
			<View className="flex-row gap-3 mb-6">
				<QuickActionCard
					icon="calendar-outline"
					title="Events"
					subtitle="Upcoming"
					onPress={() => router.push("/(drawer)/events")}
				/>
				<QuickActionCard
					icon="restaurant-outline"
					title="Dining"
					subtitle="Reserve"
					onPress={() => router.push("/(drawer)/dining")}
				/>
				<QuickActionCard
					icon="person-outline"
					title="Profile"
					subtitle="Membership"
					onPress={() => router.push("/(drawer)/membership")}
				/>
			</View>

			{/* News & Announcements */}
			<Text className="text-foreground font-semibold mb-3">
				News & Announcements
			</Text>
			<Surface variant="secondary" className="p-4 rounded-xl mb-3">
				<Text className="text-foreground font-medium">
					Summer Garden Party
				</Text>
				<Text className="text-muted-foreground text-sm mt-1">
					Join us for our annual summer celebration on July 15th
				</Text>
				<Text className="text-accent text-xs mt-2">Read more →</Text>
			</Surface>
			<Surface variant="secondary" className="p-4 rounded-xl mb-3">
				<Text className="text-foreground font-medium">
					New Menu Launch
				</Text>
				<Text className="text-muted-foreground text-sm mt-1">
					Our chef has prepared an exciting new seasonal menu
				</Text>
				<Text className="text-accent text-xs mt-2">Read more →</Text>
			</Surface>

			{/* Sign Out */}
			<View className="mt-auto pt-6">
				<Button
					variant="tertiary"
					size="sm"
					className="self-center"
					onPress={() => authClient.signOut()}
				>
					<Button.StartContent>
						<Ionicons
							name="log-out-outline"
							size={16}
							color={colors.foreground}
						/>
					</Button.StartContent>
					<Button.LabelContent>Sign Out</Button.LabelContent>
				</Button>
			</View>
		</Container>
	);
}

/* ----------------------------- quick action card ---------------------------- */
function QuickActionCard({
	icon,
	title,
	subtitle,
	onPress,
}: {
	icon: keyof typeof Ionicons.glyphMap;
	title: string;
	subtitle: string;
	onPress: () => void;
}) {
	const { colors } = useTheme();
	return (
		<Pressable onPress={onPress} className="flex-1">
			<Surface variant="secondary" className="p-4 rounded-xl items-center">
				<View className="bg-accent/10 p-3 rounded-full mb-2">
					<Ionicons name={icon} size={24} color={colors.accent} />
				</View>
				<Text className="text-foreground font-medium text-sm">{title}</Text>
				<Text className="text-muted-foreground text-xs">{subtitle}</Text>
			</Surface>
		</Pressable>
	);
}

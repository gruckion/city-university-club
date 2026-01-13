import { Ionicons } from "@expo/vector-icons";
import { Button, Surface, useTheme } from "heroui-native";
import { Text, View } from "react-native";
import { Container } from "@/components/container";
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "@convoexpo-and-nextjs-web-bun-better-auth/backend/convex/_generated/api";

export default function Membership() {
	const { colors } = useTheme();
	const { isAuthenticated } = useConvexAuth();
	const user = useQuery(api.auth.getCurrentUser, isAuthenticated ? {} : "skip");

	return (
		<Container className="p-4">
			<Text className="text-2xl font-bold text-foreground mb-6">
				Membership
			</Text>

			{/* Digital Membership Card */}
			<Surface className="p-6 rounded-2xl mb-6 bg-accent">
				<View className="flex-row justify-between items-start mb-6">
					<View>
						<Text className="text-accent-foreground/60 text-xs uppercase tracking-wider mb-1">
							City University Club
						</Text>
						<Text className="text-accent-foreground font-bold text-xl">
							{user?.name || "Member"}
						</Text>
					</View>
					<Ionicons name="shield-checkmark" size={28} color={colors.accentForeground} />
				</View>

				<View className="flex-row justify-between items-end">
					<View>
						<Text className="text-accent-foreground/60 text-xs mb-1">
							Member ID
						</Text>
						<Text className="text-accent-foreground font-mono">
							CUC-2024-0001
						</Text>
					</View>
					<View>
						<Text className="text-accent-foreground/60 text-xs mb-1">
							Valid Until
						</Text>
						<Text className="text-accent-foreground font-mono">
							Dec 2025
						</Text>
					</View>
				</View>
			</Surface>

			{/* Member Benefits */}
			<Text className="text-foreground font-semibold mb-3">Member Benefits</Text>

			<MemberBenefit
				icon="restaurant"
				title="Dining Privileges"
				description="Access to all dining facilities"
			/>
			<MemberBenefit
				icon="calendar"
				title="Events Access"
				description="Priority booking for club events"
			/>
			<MemberBenefit
				icon="people"
				title="Guest Passes"
				description="Bring up to 3 guests per visit"
			/>
			<MemberBenefit
				icon="globe"
				title="Reciprocal Clubs"
				description="Access to partner clubs worldwide"
			/>

			{/* Account Section */}
			<Text className="text-foreground font-semibold mt-6 mb-3">Account</Text>

			<Surface variant="secondary" className="p-4 rounded-xl mb-3">
				<View className="flex-row items-center justify-between">
					<View className="flex-row items-center gap-3">
						<Ionicons name="mail-outline" size={20} color={colors.foreground} />
						<Text className="text-foreground">{user?.email || "email@example.com"}</Text>
					</View>
					<Ionicons name="chevron-forward" size={20} color={colors.mutedForeground} />
				</View>
			</Surface>

			<Surface variant="secondary" className="p-4 rounded-xl mb-3">
				<View className="flex-row items-center justify-between">
					<View className="flex-row items-center gap-3">
						<Ionicons name="receipt-outline" size={20} color={colors.foreground} />
						<Text className="text-foreground">View Statements</Text>
					</View>
					<Ionicons name="chevron-forward" size={20} color={colors.mutedForeground} />
				</View>
			</Surface>
		</Container>
	);
}

function MemberBenefit({
	icon,
	title,
	description,
}: {
	icon: keyof typeof Ionicons.glyphMap;
	title: string;
	description: string;
}) {
	const { colors } = useTheme();
	return (
		<Surface variant="secondary" className="p-4 rounded-xl mb-3 flex-row items-center">
			<View className="bg-accent/10 p-2 rounded-full mr-4">
				<Ionicons name={icon} size={20} color={colors.accent} />
			</View>
			<View className="flex-1">
				<Text className="text-foreground font-medium">{title}</Text>
				<Text className="text-muted-foreground text-sm">{description}</Text>
			</View>
		</Surface>
	);
}

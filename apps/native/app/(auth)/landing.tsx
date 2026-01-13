import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Button, useThemeColor } from "heroui-native";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppleAuth, useGoogleAuth } from "@/lib/oauth";

export default function Landing() {
	const foreground = useThemeColor("foreground");
	const { signIn: signInWithGoogle, isLoading: isGoogleLoading } =
		useGoogleAuth();
	const { signIn: signInWithApple, isLoading: isAppleLoading } = useAppleAuth();

	return (
		<SafeAreaView className="flex-1 gap-4 px-8">
			<View className="flex-1 justify-end">
				<Text className="font-extrabold text-6xl text-foreground">
					City University Club
				</Text>
				<Text className="text-muted-foreground text-xl">
					Your exclusive members club
				</Text>
			</View>
			<View className="w-full flex-row gap-4">
				{/* google */}
				<Button
					className="flex-1 overflow-hidden rounded-full"
					size="lg"
					variant="tertiary"
					onPress={signInWithGoogle}
					isDisabled={isGoogleLoading || isAppleLoading}
				>
					<View className="flex-row items-center gap-2">
						<Ionicons name="logo-google" size={20} color={foreground} />
						<Text className="text-foreground font-medium">Google</Text>
					</View>
				</Button>
				{/* apple */}
				<Button
					className="flex-1 overflow-hidden rounded-full"
					size="lg"
					variant="tertiary"
					onPress={signInWithApple}
					isDisabled={isGoogleLoading || isAppleLoading}
				>
					<View className="flex-row items-center gap-2">
						<Ionicons name="logo-apple" size={20} color={foreground} />
						<Text className="text-foreground font-medium">Apple</Text>
					</View>
				</Button>
			</View>
			<Link href="/(auth)/email/signin" asChild>
				<Button className="w-full rounded-full" size="lg">
					<Button.Label>Email</Button.Label>
				</Button>
			</Link>
		</SafeAreaView>
	);
}

import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Button, useTheme } from "heroui-native";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppleAuth, useGoogleAuth } from "@/lib/oauth";

export default function Landing() {
	const { colors } = useTheme();
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
					disabled={isGoogleLoading || isAppleLoading}
				>
					<Button.StartContent>
						<Ionicons
							name="logo-google"
							size={20}
							color={colors.defaultForeground}
						/>
					</Button.StartContent>
					<Button.LabelContent>Google</Button.LabelContent>
				</Button>
				{/* apple */}
				<Button
					className="flex-1 overflow-hidden rounded-full"
					size="lg"
					variant="tertiary"
					onPress={signInWithApple}
					disabled={isGoogleLoading || isAppleLoading}
				>
					<Button.StartContent>
						<Ionicons
							name="logo-apple"
							size={20}
							color={colors.defaultForeground}
						/>
					</Button.StartContent>
					<Button.LabelContent>Apple</Button.LabelContent>
				</Button>
			</View>
			<Link href="/(auth)/email/signin" asChild>
				<Button className="w-full rounded-full" size="lg">
					<Button.LabelContent>Email</Button.LabelContent>
				</Button>
			</Link>
		</SafeAreaView>
	);
}

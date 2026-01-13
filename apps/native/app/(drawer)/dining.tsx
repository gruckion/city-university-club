import { Ionicons } from "@expo/vector-icons";
import { Button, Surface, useTheme } from "heroui-native";
import { Text, View } from "react-native";
import { Container } from "@/components/container";

export default function Dining() {
	const { colors } = useTheme();

	return (
		<Container className="p-4">
			<Text className="text-2xl font-bold text-foreground mb-2">
				Dining
			</Text>
			<Text className="text-muted-foreground mb-6">
				Reserve your table or explore our menu
			</Text>

			{/* Reservation Card */}
			<Surface className="p-5 rounded-2xl mb-6 bg-accent">
				<Text className="text-accent-foreground font-bold text-lg mb-2">
					Make a Reservation
				</Text>
				<Text className="text-accent-foreground/70 text-sm mb-4">
					Book a table in our main dining room
				</Text>
				<Button variant="secondary" className="rounded-xl">
					<Button.StartContent>
						<Ionicons name="calendar-outline" size={18} color={colors.accent} />
					</Button.StartContent>
					<Button.LabelContent>Reserve Table</Button.LabelContent>
				</Button>
			</Surface>

			{/* Restaurant Options */}
			<Text className="text-foreground font-semibold mb-3">Dining Options</Text>

			<DiningOption
				icon="restaurant-outline"
				title="Main Dining Room"
				description="Fine dining with seasonal menu"
				hours="12:00 PM - 10:00 PM"
			/>
			<DiningOption
				icon="wine-outline"
				title="Lounge Bar"
				description="Cocktails and light bites"
				hours="4:00 PM - 12:00 AM"
			/>
			<DiningOption
				icon="cafe-outline"
				title="Members' Terrace"
				description="Al fresco dining with city views"
				hours="10:00 AM - 8:00 PM"
			/>

			{/* View Menu Button */}
			<Button variant="tertiary" className="mt-4 self-center rounded-xl">
				<Button.StartContent>
					<Ionicons name="book-outline" size={18} color={colors.foreground} />
				</Button.StartContent>
				<Button.LabelContent>View Full Menu</Button.LabelContent>
			</Button>
		</Container>
	);
}

function DiningOption({
	icon,
	title,
	description,
	hours,
}: {
	icon: keyof typeof Ionicons.glyphMap;
	title: string;
	description: string;
	hours: string;
}) {
	const { colors } = useTheme();
	return (
		<Surface variant="secondary" className="p-4 rounded-xl mb-3 flex-row items-center">
			<View className="bg-accent/10 p-3 rounded-full mr-4">
				<Ionicons name={icon} size={24} color={colors.accent} />
			</View>
			<View className="flex-1">
				<Text className="text-foreground font-medium">{title}</Text>
				<Text className="text-muted-foreground text-sm">{description}</Text>
				<View className="flex-row items-center gap-1 mt-1">
					<Ionicons name="time-outline" size={12} color={colors.mutedForeground} />
					<Text className="text-muted-foreground text-xs">{hours}</Text>
				</View>
			</View>
		</Surface>
	);
}

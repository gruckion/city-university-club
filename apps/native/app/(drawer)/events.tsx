import { Ionicons } from "@expo/vector-icons";
import { Button, Surface, useThemeColor } from "heroui-native";
import { Text, View } from "react-native";
import { Container } from "@/components/container";

export default function Events() {
	const foreground = useThemeColor("foreground");
	const muted = useThemeColor("muted");

	return (
		<Container className="p-4">
			<Text className="text-2xl font-bold text-foreground mb-6">
				Upcoming Events
			</Text>

			{/* Featured Event */}
			<Surface className="p-5 rounded-2xl mb-4 bg-accent">
				<View className="flex-row justify-between items-start mb-3">
					<View className="flex-1">
						<Text className="text-accent-foreground font-bold text-lg">
							Summer Garden Party
						</Text>
						<Text className="text-accent-foreground/70 text-sm mt-1">
							Annual celebration on the terrace
						</Text>
					</View>
					<View className="bg-accent-foreground/20 px-3 py-1 rounded-full">
						<Text className="text-accent-foreground text-xs font-medium">
							Featured
						</Text>
					</View>
				</View>
				<View className="flex-row items-center gap-4 mt-2">
					<View className="flex-row items-center gap-1">
						<Ionicons name="calendar-outline" size={14} color={foreground} />
						<Text className="text-accent-foreground/80 text-xs">Jul 15</Text>
					</View>
					<View className="flex-row items-center gap-1">
						<Ionicons name="time-outline" size={14} color={foreground} />
						<Text className="text-accent-foreground/80 text-xs">6:00 PM</Text>
					</View>
				</View>
				<Button variant="secondary" size="sm" className="mt-4 rounded-xl">
					<Button.Label>RSVP Now</Button.Label>
				</Button>
			</Surface>

			{/* Event List */}
			<EventCard
				title="Wine Tasting Evening"
				date="Jul 22"
				time="7:00 PM"
				location="Wine Cellar"
			/>
			<EventCard
				title="Business Networking Lunch"
				date="Jul 28"
				time="12:30 PM"
				location="Main Dining Room"
			/>
			<EventCard
				title="Jazz Night"
				date="Aug 5"
				time="8:00 PM"
				location="Lounge Bar"
			/>
		</Container>
	);
}

function EventCard({
	title,
	date,
	time,
	location,
}: {
	title: string;
	date: string;
	time: string;
	location: string;
}) {
	const muted = useThemeColor("muted");
	return (
		<Surface variant="secondary" className="p-4 rounded-xl mb-3">
			<Text className="text-foreground font-medium">{title}</Text>
			<View className="flex-row items-center gap-4 mt-2">
				<View className="flex-row items-center gap-1">
					<Ionicons name="calendar-outline" size={14} color={muted} />
					<Text className="text-muted-foreground text-xs">{date}</Text>
				</View>
				<View className="flex-row items-center gap-1">
					<Ionicons name="time-outline" size={14} color={muted} />
					<Text className="text-muted-foreground text-xs">{time}</Text>
				</View>
				<View className="flex-row items-center gap-1">
					<Ionicons name="location-outline" size={14} color={muted} />
					<Text className="text-muted-foreground text-xs">{location}</Text>
				</View>
			</View>
		</Surface>
	);
}

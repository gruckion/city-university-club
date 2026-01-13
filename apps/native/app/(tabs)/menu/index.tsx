import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
	Text,
	View,
	ScrollView,
	Image,
	Pressable,
	Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// CUC brand colors
const CUC_COLORS = {
	navy: "#06273a",
	sage: "#85b09a",
	cream: "#fffef8",
	white: "#ffffff",
};

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Menu categories based on the sitemap
const MENU_CATEGORIES = [
	{
		id: "starters",
		name: "Starters",
		description: "Begin your dining experience",
		image:
			"https://static.wixstatic.com/media/11062b_7daf34b38d874071a1001caa9dde798f~mv2_d_5616_3744_s_4_2.jpg/v1/fill/w_600,h_400,al_c,q_80/11062b_7daf34b38d874071a1001caa9dde798f~mv2_d_5616_3744_s_4_2.webp",
		itemCount: 6,
	},
	{
		id: "mains",
		name: "Main Courses",
		description: "Exquisite dishes from our kitchen",
		image:
			"https://static.wixstatic.com/media/11062b_ce333d3fd0a941deb7a0ddf8f1ed837b~mv2_d_3046_3782_s_4_2.jpg/v1/fill/w_600,h_400,al_c,q_80/11062b_ce333d3fd0a941deb7a0ddf8f1ed837b~mv2_d_3046_3782_s_4_2.webp",
		itemCount: 6,
	},
	{
		id: "desserts",
		name: "Desserts & Savouries",
		description: "A sweet ending to your meal",
		image:
			"https://static.wixstatic.com/media/da00a6_3329029cfbc048ab9d8b8fdd4e5e3563~mv2.jpg/v1/fill/w_600,h_400,al_c,q_80/da00a6_3329029cfbc048ab9d8b8fdd4e5e3563~mv2.webp",
		itemCount: 4,
	},
	{
		id: "canape",
		name: "Canapé Menu",
		description: "Perfect for events and gatherings",
		image:
			"https://static.wixstatic.com/media/5e0aaa_ae64aef587014ac0a2f4f27c190da7f4~mv2.png/v1/fill/w_600,h_400,al_c,q_80/5e0aaa_ae64aef587014ac0a2f4f27c190da7f4~mv2.webp",
		itemCount: 14,
	},
];

// Full menu data
export const MENU_DATA = {
	starters: [
		{
			name: "Homemade Soup of the Day",
			description: "Ask your server for today's selection",
			image:
				"https://static.wixstatic.com/media/da00a6_471faa57e03f4661a0aa2a15817ee0fb~mv2.webp",
		},
		{
			name: "Chilli Garlic Pan Fried Tiger Prawns",
			description: "and Chorizo served with Warm Ciabatta Bread",
			image:
				"https://static.wixstatic.com/media/da00a6_9d9456b46aba453e980ce799a6e008e5~mv2.jpg",
		},
		{
			name: "Aged Cheddar Cheese and Caramelised Red Onion Tart",
			description: "Dressed Salad",
			image:
				"https://static.wixstatic.com/media/da00a6_ad86317d721f4132b9d8f3704dcce1f8~mv2.jpg",
		},
		{
			name: "Devilled Kidneys",
			description: "With Toasted Sourdough",
			image:
				"https://static.wixstatic.com/media/da00a6_23187ff8e23a42d4a6069845853df00c~mv2.jpg",
		},
		{
			name: "Crispy Ham Hock Croquettes",
			description: "Red Onion Chutney, Dressed Salad and Reduced Balsamic",
			image:
				"https://static.wixstatic.com/media/da00a6_1d046e4a01c7433c91febe13af1b0164~mv2.jpg",
		},
		{
			name: "Smoked Salmon Plate",
			description: "With Bread and Butter, Capers and Olive Oil",
			image:
				"https://static.wixstatic.com/media/da00a6_99abb134e90e49d1b2fa6d8a6dd81779~mv2.jpg",
		},
	],
	mains: [
		{
			name: "Roast Rump of Lamb",
			description:
				"Confit Shallots, Braised Cabbage, Crispy Celeriac, Herb Parmentier Potatoes, Field Mushrooms, Red Currant Jus",
			image:
				"https://static.wixstatic.com/media/da00a6_c20e4e59e1ac4bce9da6a0ff88e5c0be~mv2.jpg",
		},
		{
			name: "Pan Fried Delice of Salmon",
			description:
				"Wilted Spinach, Herb Crushed New Potatoes, Seasonal Green Vegetables, Chive Veloute",
			image:
				"https://static.wixstatic.com/media/da00a6_5800e90f173c45e9ab8a0df782a28955~mv2.jpg",
		},
		{
			name: "Confit Belly of English Pork",
			description:
				"Pan Fried Black Pudding, Parsley Potato Rosti, Poached Baby Apples, Buttered Herb Carrots, Crackling and Cider Jus",
			image:
				"https://static.wixstatic.com/media/da00a6_fbb48bcf366545f0a4213689c449d8ea~mv2.jpg",
		},
		{
			name: "Oven Roasted Breast of Free Range Chicken",
			description:
				"Braised Little Gem Lettuce, Pea a La Francaise, Crispy Lardons, Cafe au Lait Sauce",
			image:
				"https://static.wixstatic.com/media/da00a6_e3f699ce1cfb4468a8a52353438863c4~mv2.jpg",
		},
		{
			name: "Homemade Tortellinis",
			description:
				"Filled with Truffle Mushrooms, Wilted Spinach, Confit Cherry Tomatoes, Parmesan Cream Sauce",
			image:
				"https://static.wixstatic.com/media/da00a6_857f9768dc9c48a4856074644ee491a6~mv2.jpg",
		},
		{
			name: "Whole Dover Sole",
			description: "Boiled New Potatoes, Wilted Spinach, Capers, Parsley Butter",
			image:
				"https://static.wixstatic.com/media/da00a6_04a2f1a96f4d4dcda9b550b6cb9e4ba2~mv2.jpg",
		},
	],
	desserts: [
		{
			name: "Apricot and Pistachio Tart",
			description: "Vanilla Custard and Caramel Sauce",
			image:
				"https://static.wixstatic.com/media/da00a6_3329029cfbc048ab9d8b8fdd4e5e3563~mv2.jpg",
		},
		{
			name: "Selection of Cheeses",
			description: "Stilton, Cheddar and Brie Plate",
			image:
				"https://static.wixstatic.com/media/da00a6_52bcb81f629b40c383a2f1a09aa1d97e~mv2.jpg",
		},
		{
			name: "Ice Creams",
			description: "Choose from a selection of ice cream and sorbets",
			image:
				"https://static.wixstatic.com/media/da00a6_43177fedaab74f5ab2d476165fb039f8~mv2.png",
		},
		{
			name: "Sticky Toffee Pudding",
			description: "Vanilla Custard and Caramel Sauce",
			image:
				"https://static.wixstatic.com/media/da00a6_d3e73306bcad41baa7552a956bae7e37~mv2.jpg",
		},
	],
	canape: [
		{
			name: "Rare Roast Beef mini-Yorkshire puddings",
			description: "with horseradish cream",
			image: null,
		},
		{ name: "Truffled mushroom and brie de Meaux", description: null, image: null },
		{
			name: "Soy glazed belly of pork",
			description: "served on Chinese spoons",
			image: null,
		},
		{ name: "Spinach and goats cheese frittata", description: null, image: null },
		{ name: "Honey glazed cocktail sausages", description: null, image: null },
		{ name: "Smoked Salmon Blinis", description: null, image: null },
		{ name: "Bloody Mary Prawn cocktail croustades", description: null, image: null },
		{ name: "Goats cheese and spinach tartlets", description: null, image: null },
		{ name: "Chicken yakatori skewers", description: null, image: null },
		{ name: "Mini cod's of fish and chips", description: null, image: null },
		{ name: "Rosary ash goats cheese tartlets", description: null, image: null },
		{
			name: "Mini vegetable and meat spring rolls and samosas",
			description: null,
			image: null,
		},
		{
			name: "Chicken liver parfait",
			description: "on toasted rye bread",
			image: null,
		},
		{
			name: "Cones of Cornish crab",
			description: "tomato & lemon salad, lobster mayonnaise",
			image: null,
		},
	],
};

export default function MenuIndex() {
	const router = useRouter();
	const insets = useSafeAreaInsets();

	return (
		<View style={{ flex: 1, backgroundColor: CUC_COLORS.cream }}>
			{/* Header */}
			<View
				style={{
					backgroundColor: CUC_COLORS.navy,
					paddingTop: insets.top + 16,
					paddingBottom: 20,
					paddingHorizontal: 20,
				}}
			>
				<Text
					style={{
						color: CUC_COLORS.cream,
						fontSize: 28,
						fontWeight: "300",
						fontFamily: "serif",
					}}
				>
					A La Carte Menu
				</Text>
				<Text
					style={{
						color: CUC_COLORS.sage,
						fontSize: 14,
						marginTop: 4,
					}}
				>
					Exquisite dining at City University Club
				</Text>
			</View>

			<ScrollView
				style={{ flex: 1 }}
				contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
			>
				{/* Menu Categories */}
				{MENU_CATEGORIES.map((category) => (
					<Pressable
						key={category.id}
						onPress={() => router.push(`/(tabs)/menu/${category.id}`)}
						style={{
							backgroundColor: CUC_COLORS.white,
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
							source={{ uri: category.image }}
							style={{ width: "100%", height: 140 }}
							resizeMode="cover"
						/>
						<View style={{ padding: 16 }}>
							<View
								style={{
									flexDirection: "row",
									justifyContent: "space-between",
									alignItems: "center",
								}}
							>
								<View style={{ flex: 1 }}>
									<Text
										style={{
											color: CUC_COLORS.navy,
											fontSize: 18,
											fontWeight: "600",
										}}
									>
										{category.name}
									</Text>
									<Text
										style={{
											color: "#666",
											fontSize: 14,
											marginTop: 2,
										}}
									>
										{category.description}
									</Text>
								</View>
								<View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
									<Text style={{ color: CUC_COLORS.sage, fontSize: 13 }}>
										{category.itemCount} items
									</Text>
									<Ionicons
										name="chevron-forward"
										size={20}
										color={CUC_COLORS.sage}
									/>
								</View>
							</View>
						</View>
					</Pressable>
				))}

				{/* Opening Hours */}
				<View
					style={{
						backgroundColor: CUC_COLORS.navy,
						borderRadius: 12,
						padding: 20,
						marginTop: 8,
					}}
				>
					<Text
						style={{
							color: CUC_COLORS.cream,
							fontSize: 16,
							fontWeight: "600",
							marginBottom: 12,
						}}
					>
						Dining Hours
					</Text>
					<View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
						<Ionicons name="time-outline" size={18} color={CUC_COLORS.sage} />
						<Text style={{ color: CUC_COLORS.cream, fontSize: 14 }}>
							Monday to Friday, 9:00 AM - 5:00 PM
						</Text>
					</View>
					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
							gap: 8,
							marginTop: 8,
						}}
					>
						<Ionicons name="restaurant-outline" size={18} color={CUC_COLORS.sage} />
						<Text style={{ color: CUC_COLORS.cream, fontSize: 14 }}>
							Lunch: 12:00 PM - Last orders 2:30 PM
						</Text>
					</View>
				</View>
			</ScrollView>
		</View>
	);
}

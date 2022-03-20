// import React from "react";
// import { useState } from "react";
// import { StyleSheet, Text, View, Image, ImageBackground, Dimensions } from "react-native";
// import { FlatList, ScrollView, TouchableOpacity } from "react-native-gesture-handler";
// import RadioButton from "../../src/RadioButton";
// import Card from "../../src/RecipeItems";

// export default function RecipeScreen(props) {
// 	//Radio Button State
// 	const options1 = [{ value: "Expiring" }, { value: "All" }];
// 	const options2 = [{ value: "Additional" }, { value: "From Inventory" }];
// 	const [option1, setOption1] = useState(null);
// 	const [option2, setOption2] = useState(null);

// 	//HardCoded
// 	const RecipeList = [
// 		{
// 			recipe: "Glazed Ham with Peach-Ginger Sauce",
// 			ingredients:
// 				"1 (10 pound) fully-cooked, bone-in ham,2 teaspoons whole cloves,1/4 teaspoon ground cinnamon,2 tablespoons brown mustard,1/2 cup packed brown sugar,1/4 cup packed brown sugar,2 tablespoons apple cider vinegar,1 cup peach nectar,1 cup peach preserves,5 cups frozen peach slices,2 teaspoons minced fresh ginger root,1 hot cherry pepper, seeded and minced,1 (3 inch) cinnamon stick",
// 			score: "0.241",
// 			url: "https://www.allrecipes.com/recipe/102269/glazed-ham-with-peach-ginger-sauce/",
// 		},
// 		{
// 			recipe: "Basic Fruit Smoothie",
// 			ingredients:
// 				"1 quart strawberries, hulled,1 banana, broken into chunks,2 peaches,1 cup orange-peach-mango juice,2 cups ice",
// 			score: "0.214",
// 			url: "https://www.allrecipes.com/recipe/23553/basic-fruit-smoothie/",
// 		},
// 		{
// 			recipe: "Puppy Chow",
// 			ingredients:
// 				"9 cups crispy rice cereal squares,1/2 cup peanut butter,1 cup semi-sweet chocolate chips,1 1/2 cups confectioners' sugar",
// 			score: "0.211",
// 			url: "https://www.allrecipes.com/recipe/15820/puppy-chow/",
// 		},
// 		{
// 			recipe: "White Chocolate Party Mix",
// 			ingredients:
// 				"1 pound white chocolate,3 cups crispy rice cereal squares,3 cups crispy corn cereal squares,3 cups toasted oat cereal,2 cups thin pretzel sticks,2 cups peanuts,1 (12 ounce) package mini candy-coated chocolate pieces",
// 			score: "0.205",
// 			url: "https://www.allrecipes.com/recipe/9511/white-chocolate-party-mix/",
// 		},
// 		{
// 			recipe: "Easy Peach Cobbler with Canned Peaches",
// 			ingredients:
// 				"2 (29 ounce) cans sliced peaches in juice,2 cups all-purpose flour,1 cup sugar,3/4 cup unsalted butter, softened,1 cup chopped pecans",
// 			score: "0.194",
// 			url: "https://www.allrecipes.com/recipe/285159/easy-peach-cobbler-with-canned-peaches/",
// 		},
// 	];

// 	//check option1 and option2..
// 	//Option1 = Null/Expiring/All, Option2 = Null/Additional/FromInventory
// 	console.log(option1);
// 	console.log(option2);
// 	console.log("Selected P Codes from Inventory :", props.route.params.selectedPCode);
// 	//Pull Inventory

// 	return (
// 		<View style={styles.container}>
// 			<ImageBackground source={require("../../assets/images/photo1.png")} style={styles.bgImage}>
// 				<View style={styles.RadioContainer1}>
// 					<RadioButton style={styles.Radiotext} data={options1} onSelect={(value) => setOption1(value)} />
// 					<Text style={styles.Radiotext}>{option1}</Text>
// 				</View>
// 				<View style={styles.RadioContainer2}>
// 					<RadioButton style={styles.Radiotext} data={options2} onSelect={(value) => setOption2(value)} />
// 					<Text style={styles.Radiotext}>{option2}</Text>
// 				</View>
// 				<View>
// 					<Text style={styles.selected}>Selected</Text>
// 					<Text style={styles.unselected}>Unselected</Text>
// 				</View>
// 				<FlatList
// 					data={RecipeList}
// 					style={styles.RecipeBox}
// 					renderItem={({ item }) => {
// 						return <Card info={item} style={styles.text} />;
// 					}}
// 					keyExtractor={(RecipeList) => RecipeList.recipe.toString()}
// 				/>
// 			</ImageBackground>
// 		</View>
// 	);
// }

// const Devicewidth = Math.round(Dimensions.get("window").width);
// const Deviceheight = Math.round(Dimensions.get("window").height);
// const styles = StyleSheet.create({
// 	bgImage: {
// 		flex: 1,
// 		alignItems: "center",
// 		justifyContent: "center",
// 	},
// 	RecipeBox: {
// 		color: "black",
// 		height: Deviceheight / 1.8,
// 		width: Devicewidth / 1.1,
// 		position: "absolute",
// 		padding: 30,
// 		bottom: Devicewidth / 4,
// 		borderRadius: 20,
// 		backgroundColor: "rgba(250, 160, 78, 0.8)",
// 	},
// 	text: {
// 		fontSize: 18,
// 	},
// 	Radiotext: {
// 		fontSize: 18,
// 		fontWeight: "200",
// 		color: "white",
// 	},
// 	container: {
// 		flex: 1,
// 	},
// 	RadioContainer1: {
// 		position: "absolute",
// 		flex: 1,
// 		top: Devicewidth / 15,
// 		left: Devicewidth / 10,
// 		justifyContent: "center",
// 	},
// 	RadioContainer2: {
// 		position: "absolute",
// 		flex: 1,
// 		top: Devicewidth / 15,
// 		left: Devicewidth / 2,
// 		justifyContent: "center",
// 	},
// 	CheckBox: {
// 		paddingBottom: 20,
// 	},
// 	unselected: {
// 		position: "absolute",
// 		height: 25,
// 		width: 75,
// 		marginBottom: 10,
// 		left: Devicewidth / 4,
// 		bottom: Devicewidth / 2.4,
// 		backgroundColor: "#FF7E7E",
// 		borderRadius: 5,
// 		fontWeight: "bold",
// 	},
// 	selected: {
// 		position: "absolute",
// 		height: 25,
// 		width: 75,
// 		bottom: Devicewidth / 2.4,
// 		left: Devicewidth / 24,
// 		marginBottom: 10,
// 		backgroundColor: "#72F56F",
// 		borderRadius: 5,
// 		fontWeight: "bold",
// 	},
// });

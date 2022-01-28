import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView, StatusBar, TouchableOpacity, StyleSheet, Dimensions, Linking, Alert, View } from "react-native";
import { NavigationContainer, useIsFocused } from "@react-navigation/native";

import styled from "styled-components/native";
import { AntDesign } from "@expo/vector-icons";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import * as WebBrowser from "expo-web-browser";
import LottieView from "lottie-react-native";

export default function RecipeScreen(props) {
	const dummyData = [
		{
			recipe: "One Two Three Sausage Balls",
			ingredients: "1 pound breakfast sausage,2 cups shredded Cheddar cheese,3 cups buttermilk baking mix",
			score: "0.188",
			url: "https://www.allrecipes.com/recipe/15828/one-two-three-sausage-balls/",
			image_url:
				"https://imagesvc.meredithcorp.io/v3/mm/image?q=85&c=sc&poi=face&w=1440&h=720&url=https%3A%2F%2Fimages.media-allrecipes.com%2Fuserphotos%2F871120.png",
		},
	];

	const blankData = [
		{
			recipe: "",
			ingredients: "",
			score: "",
			url: "",
			image_url: "../../assets/images/photo1.png",
		},
	];

	const focused = useIsFocused();
	const username = props.route.params.username;
	const selectedPCode = props.route.params.selectedPCode;
	const [old_selectedPCode, setOld_SelectedPCode] = useState(null);

	const [isLoading, setLoading] = useState(true);
	const [isBasketLoaded, setBasketLoaded] = selectedPCode ? useState(true) : useState(false);
	const [isRecipeFetching, setRecipeFetching] = useState(false);

	const [basket, setBasket] = selectedPCode ? useState(selectedPCode) : useState([]);
	const [data, setData] = useState(blankData);
	const [focusedRecipe, setFocusedRecipe] = useState(blankData[0]);

	const [isSelected, setSelected] = selectedPCode ? useState(true) : useState(false);
	const [isInvEmpty, setInvEmpty] = useState(false);

	const animation = useRef(null);

	useEffect(() => {
		console.log("\n Recipe.js focused ");
		console.log("PROPS PCODE:\n", selectedPCode);
		console.log("isBasketLoaded:\n", isBasketLoaded);
		console.log("basket length:\n", basket.length);
		// selectedPCode ? console.log("basket data:", basket) : null;
		setRecipeFetching(false);
		// (?) Set as true during production
		setLoading(false);

		// Forced useBasket for First instance recipe open
		// AND Empty inventory
		if (isInvEmpty == true) {
			console.log("--- FOCUS: forced basket use effect  ---");
			getBasketDetails();
		}
	}, [focused]);

	//When selectedPCode updates
	if (selectedPCode != old_selectedPCode) {
		setOld_SelectedPCode(selectedPCode);
		setBasket(selectedPCode); // Not necessary
		setSelected(true);
	}
	// const old_selectedPCode = props.route.params.selectedPCode

	const isInitialMount = useRef(true);
	useEffect(() => {
		if (isInitialMount.current) {
			isInitialMount.current = false;
		} else {
			// Only runs on update here
			console.log("--- isSelected use effect ---");
			if (isSelected) {
				basket == selectedPCode ? null : setBasket(selectedPCode);
			} else {
				basket == selectedPCode ? getBasketDetails() : null;
			}
		}
	}, [isSelected]);

	useEffect(() => {
		if (data == blankData) {
			console.log("--- basket use effect ---");
			getBasketDetails();
		}
		if (isInitialMount.current) {
			isInitialMount.current = false;
		} else {
			// TODO: HERE RUNS WHEN BASKET UPDATES
			// Should we run regardless of Basket[0] updates?
			if (data == blankData) {
				console.log("BASKET UPDATE: data is blankData, Ignoring.. ");
				return;
			}
			console.log(animation);
			fetch_recipes();
		}
	}, [basket?.[0]]);

	async function getBasketDetails() {
		console.log(`retrieving basket of.. ${username}`);
		return fetch("https://scanlah.herokuapp.com/api/get_user_perish" + "?username=" + username).then((response) => {
			if (response.ok) {
				return response.json().then((data) => {
					console.log("basket fetched: ", data.length);
					setBasket(data);
					setBasketLoaded(true);
					setInvEmpty(false);
				});
			} else {
				// setBufferText("No items in Inventory");
				setInvEmpty(true);
			}
		});
	}

	async function fetch_recipes() {
		props.navigation.setOptions({ tabBarStyle: { display: "none" } });
		console.log(`Fetch query selected -> ${isSelected ? "SELECTED" : "ALL"}`);
		console.log("Hiding tabbar: ");
		setInvEmpty(false);
		setRecipeFetching(true);
		setLoading(true);
		if (isRecipeFetching) {
			return console.log("Recipe: already exist instance of fetch");
		}
		console.log(`\nfetching recipes.. p_code.length(${basket.length})`);
		var array_p_code = [];
		for (let perish of basket) {
			perish.p_code ? array_p_code.push(perish.p_code) : array_p_code.push(perish);
		}
		var query = array_p_code.join("+");
		console.log("query:", query);

		fetch(`http://scanlah.herokuapp.com/api/recommend_recipe?code=${query}`)
			.then((response) => {
				response.json().then((data) => {
					// console.log(data);
					if (response.ok) {
						data.splice(-1, 1);
						setData(data);
						console.log("fetch_recipes..response ok");
						setRecipeFetching(false);
						setLoading(false);
						// Update focus to be first result
						setFocusedRecipe(data[0]);
					} else {
						console.log("fetch_recipes..response NOT ok");
						console.log(data);
						setRecipeFetching(false);
						setLoading(false);
						emptyBasketError();
					}
					props.navigation.setOptions({
						tabBarStyle: {
							height: 70,
							position: "absolute",
							display: "flex",
							bottom: 16,
							right: 16,
							left: 16,
							borderRadius: 10,
						},
					});
				});
			})
			.catch((error) => {
				console.log(error);
			});
	}

	function emptyBasketError() {
		Alert.alert(
			"Empty basket",
			"Your inventory OR selected items is empty.\n\n Please try again after selecting ingredients from the inventory.",
			[
				{
					text: "Go to Inventory",
					style: "default",
					onPress: () => {
						props.navigation.navigate("Inventory");
					},
				},
				{
					text: "",
				},
				{
					style: "destructive",
					text: "OK",
				},
			]
		);
	}

	function emptyAnimation() {
		return (
			<View style={styles.animationContainer}>
				<Text
					style={{
						position: "absolute",
						top: (Deviceheight / 100) * 25,
						fontFamily: "AvenirNext",
						fontSize: 25,
						// fontWeight: "bold",
						width: "80%",
						textAlign: "center",
						color: "rgba(0, 0, 0, 0.75)",
					}}>
					Your inventory is empty
				</Text>
				<Text
					style={{
						position: "absolute",
						top: (Deviceheight / 100) * 30,
						fontFamily: "AvenirNext",
						fontSize: 20,
						// fontWeight: "bold",
						width: "100%",
						textAlign: "center",
						color: "rgba(0, 0, 0, 0.75)",
					}}>
					Scan some items to start tracking!
				</Text>
				<LottieView
					ref={animation}
					style={{
						position: "absolute",
						top: (Deviceheight / 100) * 0,
						// width: (Devicewidth / 100) * 100,
						elevation: 1,
						zIndex: 1,
						// height: 400,
						// backgroundColor: "black",
					}}
					loop={true}
					autoPlay={true}
					source={require("../../assets/lottie/5081-empty-box.json")}
				/>
				<TouchableOpacity
					onPress={() => props.navigation.navigate("Scan")}
					style={{
						position: "absolute",
						top: (Deviceheight / 100) * 75,
						height: (Deviceheight / 100) * 5,
						width: (Devicewidth / 100) * 80,

						elevation: 3,
						zIndex: 3,
						backgroundColor: "darkorange",
						borderRadius: 5,
						justifyContent: "center",
						// borderColor: "red",
						// borderWidth: 2,
						// shadowColor: "transparent",
					}}>
					<Text
						style={{
							fontSize: 20,
							width: "100%",
							// fontFamily: "AvenirNext",
							textAlign: "center",
							color: "rgba(255, 255, 255, 1)",
						}}>
						Scan items
					</Text>
				</TouchableOpacity>
			</View>
		);
	}

	return isLoading ? (
		<View style={styles.animationContainer}>
			<Text
				style={{
					position: "absolute",
					top: Deviceheight / 5,
					fontFamily: "AvenirNext",
					fontSize: 30,
					// paddingTop: Deviceheight / 10,
					width: "50%",
					textAlign: "center",
					color: "rgba(0, 0, 0, 0.75)",
					borderWidth: 2,
					borderStyle: "dashed",
					borderColor: "black",
					borderTopColor: "white",
					borderBottomColor: "white",
					// backgroundColor: "rgba(0, 0, 0, 0.25)",
				}}>
				Ingredients AI matching
			</Text>
			<LottieView
				ref={animation}
				style={{
					// position: "absolute",
					// top: Deviceheight / 8,
					marginTop: Deviceheight / 30,
					width: Devicewidth / 1.2,
					// height: 400,
					// backgroundColor: "black",
				}}
				loop={true}
				autoPlay={true}
				source={require("../../assets/lottie/60366-pizza-ingrediants.json")}
				// source={require("../../assets/lottie/4887-book.json")}
				// OR find more Lottie files @ https://lottiefiles.com/featured
			/>
			<Text
				style={{
					fontSize: 30,
					fontFamily: "Caveat",
					paddingTop: Deviceheight / 10,
					width: "70%",
					textAlign: "center",
					color: "rgba(0, 0, 0, 0.75)",
				}}>
				Loading machine...
			</Text>
		</View>
	) : isInvEmpty ? (
		emptyAnimation()
	) : (
		<Container>
			<StatusBar barStyle="light-content" />
			<RecipeBackground source={{ uri: focusedRecipe.image_url }}>
				<ShadedArea>
					<SafeAreaView>
						<MenuBar>
							<TouchableOpacity
								onPress={() => {
									// props.navigation.navigate("Inventory");
									props.navigation.goBack();
								}}>
								<Back>
									<AntDesign name="arrowleft" size={24} color="#FFF" />
									<Text style={{ marginLeft: 10 }}>Ingredients</Text>
								</Back>
							</TouchableOpacity>
							<TouchableOpacity
								onPress={() => {
									selectedPCode ? setSelected(true) : null;
									selectedPCode ? null : emptyBasketError();
								}}>
								<Back>
									{isSelected ? (
										<AntDesign name="checkcircle" size={24} color="lightgreen" />
									) : (
										<AntDesign name="checkcircleo" size={24} color="#FFF" />
									)}
									<Text style={{ marginLeft: 10 }}>| SELECTED</Text>
								</Back>
							</TouchableOpacity>
							<TouchableOpacity
								onPress={() => {
									selectedPCode ? setSelected(false) : null;
								}}>
								<Back>
									{!isSelected ? (
										<AntDesign name="checkcircle" size={24} color="lightgreen" />
									) : (
										<AntDesign name="checkcircleo" size={24} color="#FFF" />
									)}
									<Text style={{ marginLeft: 10 }}>| ALL</Text>
								</Back>
							</TouchableOpacity>
							{/* <AntDesign name="heart" size={24} color="#FFF" /> */}
						</MenuBar>
						<MainRecipe>
							<Text title heavy shadower>
								{focusedRecipe.recipe}
							</Text>
							<Text bold>Similarity score: {Math.round(focusedRecipe.score * 100)}%</Text>
							<Divider />
							<Text>{focusedRecipe.ingredients.split(",").join(" | ")}</Text>
						</MainRecipe>
						<Button
							onPress={async () => {
								let browse = await WebBrowser.openBrowserAsync(focusedRecipe.url);
								// Linking.openURL('https://aboutreact.com');
							}}>
							<Text bold small>
								MORE INFO
							</Text>
						</Button>
					</SafeAreaView>
				</ShadedArea>
			</RecipeBackground>
			<RecipesContainer>
				<Text dark heavy large>
					Recipes
				</Text>
				<Text dark small>
					{data.length} recipes available
				</Text>
				<Recipes>
					<FlatList
						data={data}
						style={{ height: "55%", width: "100%" }}
						renderItem={({ item: recipe, index }) => {
							var showcase_ingredents = [];
							for (let item of recipe.ingredients.split(",")) {
								// console.log(item.split(" "));
								showcase_ingredents.push(item.split(" ").slice(-1)[0]);
							}
							return (
								<TouchableOpacity
									key={index}
									onPress={() => {
										setFocusedRecipe(data[index]);
									}}>
									<Recipe>
										<RecipeImage source={{ uri: recipe.image_url }} />
										<RecipeInfo>
											<Text dark bold>
												{recipe.recipe}
											</Text>
											<Text dark small>
												{showcase_ingredents.join(" | ")}
											</Text>
										</RecipeInfo>
										{recipe.recipe == focusedRecipe.recipe ? (
											<AntDesign name="checkcircleo" size={18} color="orange" />
										) : null}
									</Recipe>
								</TouchableOpacity>
							);
						}}
					/>
				</Recipes>
			</RecipesContainer>
		</Container>
	);
}

const Devicewidth = Math.round(Dimensions.get("window").width);
const Deviceheight = Math.round(Dimensions.get("window").height);
const styles = StyleSheet.create({
	InventoryBox: {
		color: "black",
		height: Deviceheight / 1.4,
		width: Devicewidth / 1.1,
		position: "absolute",
		padding: 30,
		bottom: Devicewidth / 2.5,
		borderTopLeftRadius: 40,
		borderTopRightRadius: 40,
		backgroundColor: "rgba(250, 160, 78, 0.8)",
	},
	animationContainer: {
		backgroundColor: "white",
		alignItems: "center",
		justifyContent: "center",
		flex: 1,
	},
});
const Height10 = Math.round((Deviceheight / 100) * 5).toString();

const Container = styled.View`
	flex: 1;
	backgroundcolor-color: #fff;
`;

const Text = styled.Text`
	color: ${(props) => (props.dark ? "#000" : "#FFF")};
	font-family: "AvenirNext";

	${({ black, white }) => {
		switch (true) {
			case black:
				return `color: black`;
			case white:
				return `color: white`;
		}
	}}

	${({ title, large, small }) => {
		switch (true) {
			case title:
				return `font-size: 32px`;
			case large:
				return `font-size: 20px`;
			case small:
				return `font-size: 13px`;
		}
	}}

	${({ bold, heavy }) => {
		switch (true) {
			case bold:
				return `font-weight: 600`;
			case heavy:
				return `font-weight: 700`;
		}
	}}

	${({ shadow, shadower }) => {
		switch (true) {
			case shadow:
				return `text-shadow: 10px 10px red`;
			case shadower:
				return `text-shadow: 10px 10px red`;
		}
	}}
`;

const ShadedArea = styled.View`
	background-color: rgba(0, 0, 0, 0.25);
	height: 100%;
	width: 100%;
`;

const RecipeBackground = styled.ImageBackground`
	${"" /* width: 100%; */}
	height: ${(Deviceheight / 2).toString()}px;
`;

const MenuBar = styled.View`
	flex-direction: row;
	justify-content: space-between;
	padding: 16px;
`;

const Back = styled.View`
	flex-direction: row;
	align-items: center;
	${"" /* position: absolute; */}
	margin: 10px;
`;

const MainRecipe = styled.View`
	padding: 0 32px;
	margin: ${(Deviceheight / 30).toString()}px 0 32px 0;
`;

const Divider = styled.View`
	border-bottom-color: white;
	border-bottom-width: 2px;
	width: 150px;
	margin: 8px 0;
`;

const Button = styled.TouchableOpacity`
	margin: 0 0 40px 32px;
	background-color: rgba(255, 144, 33, 0.8);
	align-self: flex-start;
	padding: 6px 10px;
	border-radius: 100px;
	position: absolute;
	top: ${Deviceheight / 2.5}px;
`;

const RecipesContainer = styled.View`
	margin-top: -24px;
	padding: 32px;
	background-color: #fff;
	border-top-left-radius: 24px;
	border-top-right-radius: 24px;
`;

const Recipes = styled.View`
	margin-top: 16px;
`;

const Recipe = styled.View`
	flex-direction: row;
	align-items: center;
	margin-bottom: 16px;
`;

const RecipeImage = styled.Image`
	width: 60px;
	height: 60px;
	border-radius: 8px;
`;

const RecipeInfo = styled.View`
	flex: 1;
	margin-left: 12px;
`;

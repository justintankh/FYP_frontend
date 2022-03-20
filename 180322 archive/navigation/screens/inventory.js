import React, { useState, useEffect, useRef } from "react";
import {
	StyleSheet,
	Text,
	View,
	ImageBackground,
	Image,
	Dimensions,
	Button,
	Alert,
	TouchableOpacity,
	StatusBar,
	Touchable,
} from "react-native";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import { NavigationContainer, useIsFocused } from "@react-navigation/native";
import Card from "../../src/InventoryItems";
import { AntDesign } from "@expo/vector-icons";
import LottieView from "lottie-react-native";

export default function InventoryScreen(props) {
	const username = props.route.params.username;
	// console.log(props);
	//check user code, and fetch his inventory list
	const [inventorylist, setInventorylist] = useState(null);

	const [isInvEmpty, setInvEmpty] = useState(false);

	const focused = useIsFocused();

	const [selectedPCode, setSelectedPCode] = useState([]);
	const [forceUpdate, setForceUpdate] = useState(0);

	const animation = useRef(null);

	useEffect(() => {
		console.log("\n Inventory.js Focused");
		setInventorylist(null);
		setInvEmpty(false);
		getBasketDetails();
		setSelectedPCode([]);
	}, [focused]);

	function getBasketDetails() {
		// Hide navigation bar
		props.navigation.setOptions({ tabBarStyle: { display: "none" } });

		console.log(`Basket username: ${username}`);
		return fetch("https://scanlah.herokuapp.com/api/get_user_perish" + "?username=" + username).then((response) => {
			if (response.ok) {
				return response.json().then((data) => {
					// Bring back Navigation bar
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
					setInventorylist(data);
				});
			} else {
				// Bring back Navigation bar
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
				setInvEmpty(true);
			}
		});
	}

	function removeSelected() {
		console.log("Removing", selectedPCode.join(","), "....");
		const requestOptions = {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				p_code_array: selectedPCode,
			}),
		};
		fetch("https://scanlah.herokuapp.com/api/perish_delete_many", requestOptions)
			.then((response) => {
				response.json().then((data) => {
					if (response.ok) {
						console.log("response ok");
						setInventorylist(null);
						getBasketDetails();
						setSelectedPCode([]);
					} else {
						console.log("response !ok");
						setInventorylist(null);
						getBasketDetails();
						setSelectedPCode([]);
					}
				});
			})
			.catch((error) => {
				console.log(error);
			});
	}

	function cartAnimation() {
		return (
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
					Fetching Inventory
				</Text>
				<LottieView
					ref={animation}
					style={{
						position: "absolute",
						top: (Deviceheight / 100) * 3,
						width: Devicewidth / 1.2,
						elevation: 1,
						zIndex: 1,
						// height: 400,
						// backgroundColor: "black",
					}}
					loop={true}
					autoPlay={true}
					source={require("../../assets/lottie/73480-shopping-cart.json")}
				/>
				<Text
					style={{
						position: "absolute",
						fontSize: 30,
						fontFamily: "Caveat",
						top: (Deviceheight / 100) * 75,
						width: "70%",
						textAlign: "center",
						color: "rgba(0, 0, 0, 0.75)",
					}}>
					Loading..
				</Text>
			</View>
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

	function renderLoading() {
		return isInvEmpty ? emptyAnimation() : cartAnimation();
	}

	function renderInventory() {
		return (
			<View style={styles.container}>
				<StatusBar barStyle="light-content" />
				{/* <Text style={{ alignSelf: "center", fontSize: 20 }}>{selectedPCode.length}</Text> */}
				<ImageBackground
					source={require("../../assets/images/photo1.png")}
					imageStyle={{ opacity: 0.5 }}
					style={styles.bgImage}>
					<FlatList
						data={inventorylist}
						style={styles.InventoryBox}
						renderItem={({ item }) => {
							return (
								<Card
									info={item}
									style={styles.text}
									parent_selectedPCode={selectedPCode}
									parent_setSelectedPCode={setSelectedPCode}
									parent_forceUpdate={forceUpdate}
									parent_setForceUpdate={setForceUpdate}
								/>
							);
						}}
						keyExtractor={(inventorylist) => inventorylist.p_code.toString()}
					/>
					<View style={styles.menu}>
						{selectedPCode.length == 0 ? null : (
							<View style={{ position: "absolute", left: (Devicewidth / 100) * 5 }}>
								<Button
									color="black"
									title="Del"
									onPress={() => {
										Alert.alert("Delete from Inventory", "Are you sure?", [
											{
												text: "NO",
												style: "cancel",
												onPress: () => console.log("No PRESSED"),
											},
											{
												text: "",
											},
											{
												style: "destructive",
												text: "DELETE",
												onPress: () => removeSelected(),
											},
										]);
									}}
								/>
							</View>
						)}
						{selectedPCode.length == 0 ? null : (
							<Text
								style={{
									fontSize: 20,
									position: "absolute",
									right: (Devicewidth / 100) * 43,
									backgroundColor: "white",
									borderRadius: 90,
									width: 30,
									height: 30,
									elevation: 3,
									zIndex: 3,
									textAlign: "center",
									textAlignVertical: "center",
									color: "orange",
								}}>
								{`${selectedPCode.length}`}
							</Text>
						)}
						{selectedPCode.length == 0 ? (
							<Text style={styles.recipeText}> Select item(s) to check recipes </Text>
						) : (
							<TouchableOpacity
								style={{
									position: "absolute",
									right: (Devicewidth / 100) * 2,
									height: 40,
									// borderWidth: 2,
									borderRadius: 5,
									backgroundColor: "orange",
									flexDirection: "row",
									width: (Devicewidth / 100) * 50,
									// alignContent: "flex-start",
									alignItems: "center",
								}}
								onPress={() =>
									props.navigation.navigate("Recipes", {
										username: username,
										selectedPCode: selectedPCode,
									})
								}>
								<Text
									style={[
										styles.recipeText,
										{
											color: "white",
											fontSize: 15,
											right: -(Devicewidth / 100) * 3,
											paddingLeft: (Devicewidth / 100) * 5,
											alignContent: "flex-start",
											fontFamily: "AvenirNext",
										},
									]}>{`   Check Recipe   `}</Text>
								<AntDesign
									name="arrowright"
									size={24}
									color="white"
									style={{
										top: 2,
										right: -(Devicewidth / 100) * 3,
									}}
								/>
							</TouchableOpacity>
						)}
					</View>
				</ImageBackground>
			</View>
		);
	}

	return inventorylist == null ? renderLoading() : renderInventory();
}

const Devicewidth = Math.round(Dimensions.get("window").width);
const Deviceheight = Math.round(Dimensions.get("window").height);
const styles = StyleSheet.create({
	recipeText: {
		fontSize: 24,
		fontFamily: "Caveat",
		color: "black",
		// textShadowColor: "rgba(0, 0, 0, 0.75)",
		// textShadowOffset: { width: -1, height: 1 },
		// textShadowRadius: 10,
	},
	menu: {
		// backgroundColor: "#FF880D",
		position: "absolute",
		backgroundColor: "rgba(255, 255, 255, 1)",
		height: (Deviceheight / 100) * 8,
		width: Devicewidth,
		top: (Devicewidth / 100) * 3,
		borderWidth: 2,
		borderColor: "rgba(0, 0, 0, 0.1)",
		elevation: 1,
		// borderTopLeftRadius: 20,
		// borderTopRightRadius: 20,
		// borderBottomLeftRadius: 20,
		// borderBottomRightRadius: 20,

		justifyContent: "space-around",
		alignItems: "center",
		zIndex: 1,
		elevation: 1,
		flexDirection: "row",
	},
	bgImage: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "rgba(0, 0, 0, 1)",
	},
	container: {
		flex: 1,
	},
	InventoryBox: {
		// color: "black",
		height: (Deviceheight / 100) * 75,
		width: Devicewidth,
		position: "absolute",
		padding: 30,
		top: (Deviceheight / 100) * 10,
		// borderBottomLeftRadius: 40,
		// borderBottomRightRadius: 40,
		// borderTopLeftRadius: 40,
		// borderTopRightRadius: 40,
		// backgroundColor: "rgba(0, 0, 0, 0.2)",
	},
	text: {
		fontSize: 18,
	},
	mainText: {
		fontSize: 25,
		// margin: 20,
		position: "absolute",
		top: 150,
	},
	space: {
		paddingTop: 20,
	},
	animationContainer: {
		backgroundColor: "white",
		alignItems: "center",
		justifyContent: "center",
		flex: 1,
		width: Devicewidth,
		height: Deviceheight,
		elevation: 3,
		zIndex: 3,
	},
});

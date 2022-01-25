import React, { useState, useEffect } from "react";
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
} from "react-native";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import { NavigationContainer, useIsFocused } from "@react-navigation/native";
import Card from "../../src/InventoryItems";
import { AntDesign } from "@expo/vector-icons";

export default function InventoryScreen(props) {
	const username = props.route.params.username;
	// console.log(props);
	//check user code, and fetch his inventory list
	const [inventorylist, setInventorylist] = useState(null);
	const [bufferText, setBufferText] = useState("Loading your Inventory");
	const focused = useIsFocused();

	const [selectedPCode, setSelectedPCode] = useState([]);
	const [forceUpdate, setForceUpdate] = useState(0);

	useEffect(() => {
		console.log("\n Inventory.js Focused");
		setInventorylist(null);
		getBasketDetails();
		setSelectedPCode([]);
		// getBasketDetailsTest()
		// props.navigation.setOptions({ tabBarStyle: { display: "relative" } });
		// props.navigation.setOptions({ tabBarStyle: { display: "none" } });
	}, [focused]);

	function getBasketDetails() {
		console.log(`Basket username: ${username}`);
		return fetch("https://scanlah.herokuapp.com/api/get_user_perish" + "?username=" + username).then((response) => {
			if (response.ok) {
				return response.json().then((data) => {
					// console.log("Basket: ", data);
					setInventorylist(data);
				});
			} else {
				setBufferText("No items in Inventory");
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

	function renderInventory() {
		// console.log("Selected P_Codes:", selectedPCode);
		return (
			<View style={styles.container}>
				{/* <Text style={{ alignSelf: "center", fontSize: 20 }}>{selectedPCode.length}</Text> */}
				<ImageBackground
					source={require("../../assets/images/photo1.png")}
					imageStyle={{ opacity: 0.5 }}
					style={styles.bgImage}>
					{/* <Text
						style={{
							position: "absolute",
							top: Deviceheight / 15,
							fontFamily: "AvenirNext",
							fontSize: 30,
							// paddingTop: Deviceheight / 10,
							width: "50%",
							textAlign: "center",
							color: "rgba(255, 255, 255, 0.75)",
							// fontWeight: "bold",
							borderWidth: 2,
							borderStyle: "dashed",
							borderColor: "white",
							borderTopColor: "transparent",
							borderBottomColor: "transparent",
							// backgroundColor: "rgba(0, 0, 0, 0.25)",
						}}>
						Inventory
					</Text> */}
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

	function renderLoading() {
		return (
			<View style={styles.container}>
				<ImageBackground source={require("../../assets/images/photo1.png")} style={styles.bgImage}>
					<FlatList data={inventorylist} style={styles.InventoryBox} />
					<Text style={Object.assign({}, styles.whiteText, styles.mainText)}>{bufferText}</Text>
					<View style={styles.menu}></View>
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
});

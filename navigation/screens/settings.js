import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { Button, Image, StyleSheet, Text, View, TextInput, ImageBackground ,Dimensions} from "react-native";

import Ionicons from "react-native-vector-icons/Ionicons";

export default function SettingsScreen(props) {
	const username = props.route.params.username;
	// console.log(props.navigation);
	const [refreshPage, setRefreshPage] = useState("Logout");

	function logOut() {
		console.log(`Logout username: ${username}`);
		fetch(`https://scanlah.herokuapp.com/api/logout?username=${username}`)
			.then((response) => {
				response.json().then((data) => {
					if (response.ok) {
						console.log("response ok");
					} else {
						console.log("response !ok");
					}
				});
			})
			.catch((error) => {
				console.log(error);
			});
	}

	function renderLogOut() {
		return (
			<View style={styles.container}>
				<ImageBackground
					source={require("../../assets/images/photo1.png")}
					style={styles.backgroundImage}
					resizeMode="cover">
					{/* <Text style={Object.assign({}, styles.whiteText, styles.mainText)}>Login to CheckIt !</Text> */}
					<Text style={styles.usernameText}>{username}</Text>
					<Ionicons style={styles.profileLogo} name="person-circle-outline" size={120} color={"white"} />
					<View style={styles.button}>
						<Button
							title='Message'
						/>
					</View>
					<View style={styles.button}>
						<Button
							title={refreshPage}
							onPress={() => {
								logOut();
								setRefreshPage("Logging out, Please Wait.");
								setTimeout(() => {
									props.navigation.navigate("Scan");
								}, 1000);
							}}
						/>
					</View>
					<Ionicons style={styles.messageLogo} name="chatbox-ellipses-outline" size={48} color={"black"} />
					<Ionicons style={styles.exitLogo} name="exit-outline" size={48} color={"red"} />
				</ImageBackground>
			</View>
		);
	}

	return renderLogOut();
}

const Devicewidth = Math.round(Dimensions.get("window").width);
const Deviceheight = Math.round(Dimensions.get("window").height);
const styles = StyleSheet.create({
	container: {
		flex: 1,
		// backgroundColor: "white",
		// color: "#ffffff",
		// alignItems: "center",
		justifyContent: "center",
	},
	button: {
		height: 50,
		width: Devicewidth / 2,
		marginHorizontal: 20,
		marginVertical: 10,
		bottom: Deviceheight / 12,
		left : Devicewidth / 25,
		// marginBottom: 300,
	},
	backgroundImage: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		resizeMode: "stretch", // or 'stretch'
	},
	profileLogo:{		
		position: "absolute",
		top: Deviceheight / 10,
		right : Devicewidth / 1.5,
	},
	exitLogo:{		
		position: "absolute",
		top: Deviceheight / 2.4,
		left : Devicewidth / 8,
	},
	messageLogo:{		
		position: "absolute",
		top: Deviceheight / 3,
		left : Devicewidth / 8,
	},
	usernameText:{
		position: "absolute",
		top: Deviceheight / 6.5,
		right : Devicewidth / 2.4,
		fontSize: 28,
		color: 'white',
	}
});

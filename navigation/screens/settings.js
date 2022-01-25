import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { Button, Image, StyleSheet, Text, View, TextInput, ImageBackground } from "react-native";

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
				</ImageBackground>
			</View>
		);
	}

	return renderLogOut();
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		// backgroundColor: "white",
		// color: "#ffffff",
		// alignItems: "center",
		justifyContent: "center",
	},
	button: {
		marginHorizontal: 10,
		marginVertical: 1,
		// marginBottom: 300,
	},
	backgroundImage: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		resizeMode: "stretch", // or 'stretch'
	},
});

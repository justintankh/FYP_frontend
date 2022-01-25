import { data } from "cheerio/lib/api/attributes";
import React, { useState, useEffect } from "react";
import { Button, Image, StyleSheet, Text, View, TextInput, ImageBackground } from "react-native";
import { NavigationContainer, useIsFocused } from "@react-navigation/native";
import MainContainer from "../MainContainer";

export default function LoginScreen({ navigation, route }) {
	const [loggedIn, setLogin] = useState(false);
	const [username, setUsername] = useState(null);
	const [errorMsg, setErrorMsg] = useState(false);
	const [textField, setTextField] = useState("justintankh");

	passiveCheckLogin();
	console.log(`Passive login state: ${loggedIn}, ${username}`);

	function passiveCheckLogin() {
		fetch("http://scanlah.herokuapp.com/api/utilis/retrieve_username").then((response) => {
			if (response.ok) {
				return response.then((data) => {
					setLogin(true);
					setUsername(data.username);
					console.log("data.username:", data.username);
				});
			} else {
				setLogin(false);
				setUsername("");
				console.log("data.username: NULL");
			}
		});
	}

	function checkLogin() {
		const requestOptions = {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				username: textField,
			}),
		};
		fetch("http://scanlah.herokuapp.com/api/login", requestOptions)
			.then((response) => {
				response.json().then((data) => {
					if (response.ok) {
						console.log("response ok");
						console.log("data.username:", data.username);
						setUsername(data.username);
						setLogin(true);
					} else {
						console.log("response !ok");
						setLogin(false);
						setErrorMsg(true);
					}
				});
			})
			.catch((error) => {
				console.log(error);
			});
	}

	function renderLoginPage() {
		return (
			<View style={styles.container}>
				<ImageBackground
					source={require("../../assets/images/photo1.png")}
					style={styles.backgroundImage}
					resizeMode="cover">
					<Text style={Object.assign({}, styles.whiteText, styles.mainText)}>Login to CheckIt !</Text>
					<TextInput
						style={styles.input}
						onChangeText={(change) => {
							setTextField(change);
						}}
						value={textField}
						placeholder="Enter Username"
					/>
					{errorMsg ? <Text style={styles.error}>Incorrect username.</Text> : null}
					<View style={styles.button}>
						<Button
							title="Submit"
							onPress={() => {
								checkLogin();
							}}
						/>
					</View>
				</ImageBackground>
			</View>
		);
	}

	return loggedIn ? <MainContainer username={username} /> : renderLoginPage();
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
	input: {
		height: 40,
		margin: 12,
		borderWidth: 1,
		padding: 10,
		color: "black",
		fontSize: 16,
		margin: 20,

		backgroundColor: "white",
	},
	backgroundImage: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		resizeMode: "stretch", // or 'stretch'
	},
	mainText: {
		fontSize: 25,
		// margin: 20,
		position: "absolute",
		top: 150,
	},
	whiteText: {
		color: "#ffffff",
	},
	error: {
		color: "red",
		marginBottom: 20,
		fontSize: 14,
	},
});

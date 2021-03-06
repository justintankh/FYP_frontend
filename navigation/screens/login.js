import { data } from "cheerio/lib/api/attributes";
import React, { useState, useEffect } from "react";
import { Button, Image, StyleSheet, Text, View, TextInput, ImageBackground, Dimensions } from "react-native";
import { NavigationContainer, useIsFocused } from "@react-navigation/native";
import MainContainer from "../MainContainer";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function LoginScreen({ navigation, route }) {
	const [loggedIn, setLogin] = useState(false);
	const [username, setUsername] = useState(null);
	const [password, setPassword] = useState(null);
	const [errorMsg, setErrorMsg] = useState(false);
	const [textField, setTextField] = useState("DEMO1");
	const [signUp, setSignUp] = useState(false);

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
				password: password,
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
					<Text style={Object.assign({}, styles.whiteText, styles.mainText)}>Login to CheckIt ! </Text>
					<TextInput
						style={styles.input}
						onChangeText={(change) => {
							setTextField(change);
						}}
						value={textField}
						placeholder="Username"
					/>
					<Ionicons style={[styles.usernameLogo]} name="person-outline" size={32} color={"white"} />
					<TextInput
						style={styles.input2}
						onChangeText={(change) => {
							setPassword(change);
						}}
						placeholder="Password"
					/>
					<Ionicons style={styles.passwordLogo} name="key-outline" size={32} color={"white"} />
					<View style={styles.options}>
						<View style={styles.button}>
							<Button
								title="Signup"
								color="darkorange"
								onPress={() => {
									setSignUp(true);
									setErrorMsg(false);
								}}
							/>
						</View>
						<View style={styles.button}>
							<Button
								title="Login"
								// color="cyan"
								onPress={() => {
									checkLogin();
									setErrorMsg(false);
								}}
							/>
						</View>
					</View>
					{errorMsg ? <Text style={styles.error}>Incorrect username or password.</Text> : null}
				</ImageBackground>
			</View>
		);
	}

	function checkSignUp() {
		const requestOptions = {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				username: textField,
				password: password,
			}),
		};
		fetch("http://scanlah.herokuapp.com/api/signup", requestOptions)
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
						setErrorMsg(data["Bad request"]);
					}
				});
			})
			.catch((error) => {
				console.log(error);
			});
	}

	function renderSignUpPage() {
		return (
			<View style={styles.container}>
				<ImageBackground
					source={require("../../assets/images/photo1.png")}
					style={styles.backgroundImage}
					resizeMode="cover">
					<Text style={Object.assign({}, styles.whiteText, styles.mainText)}>New Sign-Up </Text>
					<TextInput
						style={styles.input}
						onChangeText={(change) => {
							setTextField(change);
						}}
						placeholder="New Username"
					/>
					<Ionicons style={styles.usernameLogo} name="person-outline" size={32} color={"white"} />
					<TextInput
						style={styles.input2}
						onChangeText={(change) => {
							setPassword(change);
						}}
						placeholder=" New Password"
					/>
					<Ionicons style={styles.passwordLogo} name="key-outline" size={32} color={"white"} />
					<View style={styles.options}>
						<View style={styles.button}>
							<Button
								title="Cancel"
								color="black"
								onPress={() => {
									setSignUp(false);
								}}
							/>
						</View>
						<View style={styles.button}>
							<Button
								title="Register"
								color="darkorange"
								onPress={() => {
									checkSignUp();
								}}
							/>
						</View>
					</View>
					{errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}
				</ImageBackground>
			</View>
		);
	}

	return loggedIn ? <MainContainer username={username} /> : signUp ? renderSignUpPage() : renderLoginPage();
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
		width: 120,
		marginHorizontal: 20,
		marginVertical: 10,
		top: 190,
		// marginBottom: 300,
	},
	input: {
		position: "absolute",
		height: 40,
		width: Devicewidth / 2,
		top: 240,
		margin: 12,
		borderWidth: 1,
		padding: 10,
		color: "black",
		fontSize: 16,
		margin: 20,
		backgroundColor: "white",
		borderRadius: 10,
	},
	backgroundImage: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		resizeMode: "stretch", // or 'stretch'
	},
	input2: {
		position: "absolute",
		height: 40,
		width: Devicewidth / 2,
		top: 300,
		margin: 12,
		borderWidth: 1,
		padding: 10,
		color: "black",
		fontSize: 16,
		margin: 20,
		backgroundColor: "white",
		borderRadius: 10,
	},
	usernameLogo: {
		position: "absolute",
		top: 265,
		left: Devicewidth / 7,
	},
	passwordLogo: {
		position: "absolute",
		top: 325,
		left: Devicewidth / 7,
	},
	mainText: {
		fontWeight: "bolder",
		fontSize: 50,
		fontFamily: "Caveat",
		position: "absolute",
		top: 150,
	},
	whiteText: {
		color: "#ffffff",
	},
	error: {
		top: 180,
		fontWeight: "bold",
		color: "black",
		backgroundColor: "red",
		borderRadius: 10,
		padding: 5,
		marginBottom: 20,
		fontSize: 15,
	},
	options: {
		flexDirection: "row",
		justifyContent: "space-between",
		// zIndex: 1,
		// elevation: 1,
	},
});

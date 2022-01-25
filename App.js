// import * as React from "react";
// import "expo-dev-client";
import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { NavigationContainer, useIsFocused } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./navigation/screens/login";
const loginName = "Login";
const Stack = createNativeStackNavigator();

import AppLoading from "expo-app-loading";
import * as Font from "expo-font";

import { LogBox } from "react-native";
LogBox.ignoreLogs(["Warning: ..."]); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications
console.warn = () => {};

function App() {
	const [fontLoaded, setfontLoaded] = useState(false);

	//FontLoader
	const fetchFont = () => {
		return Font.loadAsync({
			Caveat: require("./assets/fonts/Caveat-Bold.ttf"),
			AvenirNext: require("./assets/fonts/AvenirNext-Regular.ttf"),
		});
	};

	if (!fontLoaded) {
		return (
			<AppLoading
				startAsync={fetchFont}
				onError={() => console.log("ERROR")}
				onFinish={() => {
					setfontLoaded(true);
				}}
			/>
		);
	}

	return (
		<NavigationContainer>
			<Stack.Navigator
				screenOptions={{
					headerShown: false,
				}}>
				<Stack.Screen name={loginName} component={LoginScreen} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}

export default App;

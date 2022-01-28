import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import Ionicons from "react-native-vector-icons/Ionicons";

// Screens
import RecipeScreen from "./screens/recipe";
import InventoryScreen from "./screens/inventory";
import SearchScreen from "./screens/search";
import SettingsScreen from "./screens/settings";

import CartScreen from "./screens/cart";
import ShareScreen from "./screens/share";

const homeName = "Inventory";
const settingsName = "Setting";
const scanName = "Scan";
const recipeName = "Recipes";
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const cartName = "Coming Soon";
const shareName = "Donate";

const InventoryNavigator = (props) => {
	console.log("InventoryNavigator Username:", props.route.params.username);
	// console.log("Main props:", props.navigation.setOptions);
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen
				name="Home"
				component={InventoryScreen}
				initialParams={{ username: props.route.params.username }}
			/>
			<Stack.Screen
				name="Recipe"
				component={RecipeScreen}
				initialParams={{ username: props.route.params.username }}
			/>
		</Stack.Navigator>
	);
};
export default function MainContainer(props) {
	console.log(`MainContainer Username: ${props.username}`);
	console.log(`MainContainer Params:`, props);
	return (
		<Tab.Navigator
			initialRouteName={homeName}
			screenOptions={({ route }) => ({
				headerShown: false,
				tabBarStyle: {
					height: 70,
					position: "absolute",
					// display: "flex",
					bottom: 16,
					right: 16,
					left: 16,
					borderRadius: 10,
				},
				tabBarIcon: ({ focused, color, size }) => {
					let iconName;
					let rn = route.name;
					if (rn === homeName) {
						iconName = focused ? "home" : "home-outline";
					} else if (rn === recipeName) {
						iconName = focused ? "clipboard" : "clipboard-outline";
					} else if (rn === scanName) {
						iconName = focused ? "barcode-outline" : "barcode-sharp";
					} else if (rn === settingsName) {
						iconName = focused ? "settings" : "settings-outline";
					} else if (rn === cartName) {
						iconName = focused ? "build" : "build-outline";
					} else if (rn === shareName) {
						iconName = focused ? "basket" : "basket-outline";
					}
					return <Ionicons name={iconName} size={size} color={color} />;
				},
			})}
			tabBarOptions={{
				activeTintColor: "orange",
				inactiveTintColor: "grey",
				labelStyle: { paddingBottom: 10, fontSize: 10, fontWeight: "bold" },
				style: { padding: 10 },
			}}>
			<Tab.Screen name={scanName} initialParams={{ username: props.username }} component={SearchScreen} />
			<Tab.Screen name={homeName} initialParams={{ username: props.username }} component={InventoryScreen} />
			<Tab.Screen name={recipeName} initialParams={{ username: props.username }} component={RecipeScreen} />
			<Tab.Screen name={cartName} initialParams={{ username: props.username }} component={CartScreen} />
			{/* <Tab.Screen name={shareName} initialParams={{ username: props.username }} component={ShareScreen} /> */}
			<Tab.Screen name={settingsName} initialParams={{ username: props.username }} component={SettingsScreen} />
		</Tab.Navigator>
	);
}

import React, { useState, useEffect, useRef } from "react";
import {
	SafeAreaView,
	StatusBar,
	TouchableOpacity,
	StyleSheet,
	Dimensions,
	Linking,
	Alert,
	View,
	Text,
} from "react-native";
import { NavigationContainer, useIsFocused } from "@react-navigation/native";
import LottieView from "lottie-react-native";

export default function ShareScreen({ navigation, route }) {
	const animation = useRef(null);
	return (
		<View style={styles.animationContainer}>
			<Text
				style={{
					position: "absolute",
					top: (Deviceheight / 100) * 30,
					fontFamily: "Caveat",
					fontSize: 30,
					// paddingTop: Deviceheight / 10,
					width: "80%",
					textAlign: "center",
					color: "rgba(0, 0, 0, 0.75)",
					borderWidth: 2,
					borderStyle: "dashed",
					borderColor: "black",
					borderTopColor: "white",
					borderBottomColor: "white",
					// backgroundColor: "rgba(0, 0, 0, 0.25)",
				}}>
				Organisation Donation & Community Sharing
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
				source={require("../../assets/lottie/93628-coming-soon.json")}
				// source={require("../../assets/lottie/4887-book.json")}
				// OR find more Lottie files @ https://lottiefiles.com/featured
			/>
			{/* <Text
				style={{
					fontSize: 30,
					fontFamily: "Caveat",
					paddingTop: Deviceheight / 10,
					width: "70%",
					textAlign: "center",
					color: "rgba(0, 0, 0, 0.75)",
				}}>
				Loading machine...
			</Text> */}
		</View>
	);
}

const Devicewidth = Math.round(Dimensions.get("window").width);
const Deviceheight = Math.round(Dimensions.get("window").height);
const styles = StyleSheet.create({
	animationContainer: {
		backgroundColor: "white",
		alignItems: "center",
		justifyContent: "center",
		flex: 1,
	},
});

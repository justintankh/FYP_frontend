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

export default function CartScreen({ navigation, route }) {
	const animation = useRef(null);
	return (
		<View style={styles.animationContainer}>
			<Text
				style={{
					position: "absolute",
					top: (Deviceheight / 100) * 20,
					fontFamily: "AvenirNext",
					fontSize: 20,
					// paddingTop: Deviceheight / 10,
					width: "100%",
					textAlign: "center",
					color: "rgba(0, 0, 0, 0.75)",
					backgroundColor: "rgba(255, 240, 69, 0.5)",
					borderRadius: 10,
					paddingTop: 10,
					paddingBottom: 10,
					// borderWidth: 2,
					// borderStyle: "dashed",
					// borderColor: "black",
					// borderTopColor: "white",
					// borderBottomColor: "white",
					// backgroundColor: "rgba(0, 0, 0, 0.25)",
				}}>
				AI Shopping List
			</Text>
			<Text
				style={{
					position: "absolute",
					top: (Deviceheight / 100) * 30,
					fontFamily: "AvenirNext",
					fontSize: 20,
					// paddingTop: Deviceheight / 10,
					width: "100%",
					textAlign: "center",
					color: "rgba(0, 0, 0, 0.75)",
					backgroundColor: "rgba(255, 240, 69, 0.5)",
					borderRadius: 10,
					paddingTop: 10,
					paddingBottom: 10,
					// borderWidth: 2,
					// borderStyle: "dashed",
					// borderColor: "black",
					// borderTopColor: "white",
					// borderBottomColor: "white",
					// backgroundColor: "rgba(0, 0, 0, 0.25)",
				}}>
				Organisation Donation & {"\n"} Community Sharing
			</Text>
			<LottieView
				ref={animation}
				style={{
					position: "absolute",
					top: (Deviceheight / 100) * 20,
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

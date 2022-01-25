import React, { useState, useEffect } from "react";
import { Animated, View, Text, StyleSheet, Dimensions, Image, Button, Alert, TouchableOpacity } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { AntDesign } from "@expo/vector-icons";

const Card = ({ info, parent_selectedPCode, parent_setSelectedPCode, parent_forceUpdate, parent_setForceUpdate }) => {
	const { img_url, title, rtr_date, exp, p_code } = info;
	const [isRenderRemove, setIsRenderRemove] = useState(false);
	const [isRemoved, setIsRemoved] = useState(false);
	const [removeRenderFlag, setRemoveRenderFlag] = useState(false);

	const [isHighlighted, setIsHighlighted] = useState(false);
	const [isRenderMinus, setIsRenderMinus] = useState(true);

	const Devicewidth = Math.round(Dimensions.get("window").width);
	const Deviceheight = Math.round(Dimensions.get("window").height);
	const barWidth = React.useRef(new Animated.Value(0)).current;
	const finalWidth = Devicewidth / 2.3;

	const styles = StyleSheet.create({
		cardContainer: {
			// width: Devicewidth,
			height: Devicewidth / 3,
			shadowColor: "black",
			shadowOffset: {
				width: 20,
				height: 20,
			},
			shadowRadius: 5,
			shadowOpacity: 20,
			marginBottom: 20,
			// paddingBottom: 20,
			// paddingTop: 20,
			borderRadius: 20,
			backgroundColor: "rgba(255, 255, 255, 0.5)",
			borderWidth: 2,
			borderColor: "rgba(255, 255, 255, 0.6)",
			// justifyContent: "center",
			// alignContent: "center",
		},
		highlight: {
			backgroundColor: "rgba(125, 255, 118, 0.65)",
		},
		statusBar: {
			backgroundColor: "white",
			height: 10,
			left: Devicewidth / 3.8,
			bottom: Devicewidth / 25,
			width: Devicewidth / 2.3,
			justifyContent: "center",
			flex: 1,
			position: "absolute",
			borderRadius: 20,
			marginLeft: (Devicewidth / 100) * 4,
		},
		expireBar: {
			//display progress using width precentage
			width: Devicewidth / 2.3 - (Devicewidth / 2.3) * 0.2,
			//change color based on progress
			height: 10,
			left: Devicewidth / 3.8,
			bottom: Devicewidth / 25,
			justifyContent: "center",
			flex: 1,
			position: "absolute",
			borderRadius: 20,
			marginLeft: (Devicewidth / 100) * 4,
		},
		imageStyle: {
			marginTop: (Devicewidth / 100) * 4,
			marginLeft: (Devicewidth / 100) * 4,
			height: Devicewidth / 4,
			width: Devicewidth / 4,
		},
		titleStyle: {
			left: Devicewidth / 3.8,
			bottom: Devicewidth / 4.2,
			// flexWrap: "nowrap",
			fontSize: 18,
			// color: "white",
			marginLeft: (Devicewidth / 100) * 4,
		},
		detailsStyle: {
			left: Devicewidth / 3.8,
			bottom: Devicewidth / 4.2,
			fontSize: 13,
			fontWeight: "200",
			marginLeft: (Devicewidth / 100) * 4,
			// color: "white",
		},
		leftDays: {
			left: (Devicewidth / 100) * 0,
			bottom: Devicewidth / 2.25,
			fontSize: 13,
			fontWeight: "500",
			textAlign: "center",
			color: "white",
			// backgroundColor: "rgba(0, 0, 0, 1)",
			// backgroundColor: "rgba(0, 200, 0, 1)",
			// backgroundColor: "rgba(200, 0, 0, 1)",
			marginLeft: (Devicewidth / 100) * 4,
			borderRadius: 40,
			width: 70,
			// color: "white",
		},
		tickIcon: {
			// marginHorizontal: 10,
			// marginVertical: 1,
			// marginBottom: 300,
			position: "absolute",
			left: Devicewidth / 1.5,
			marginLeft: (Devicewidth / 100) * 4,

			top: Devicewidth / 8,
			width: 40,
			height: 40,
			zIndex: 1,
			elevation: 1,
		},
		mainText: {
			fontSize: 25,
			// margin: 20,
			// position: "absolute",
			// top: 150,
		},
		colorText: {
			color: "white",
			alignItems: "center",
		},
		container: {
			width: Devicewidth,
			height: Devicewidth / 3,
			shadowColor: "black",
			shadowOffset: {
				width: 20,
				height: 20,
			},
			shadowRadius: 5,
			shadowOpacity: 20,
			alignItems: "center",
			justifyContent: "center",
		},
		removeButton: {
			// alignItems: "center",
			// justifyContent: "flex-end",
			// marginHorizontal: 0,
			// marginVertical: 1,
			left: Devicewidth / 5,
			width: 50,
			height: 50,
		},
		renderTextContainer: {
			width: Devicewidth,
			height: Devicewidth / 3,
			// borderRaidus: 20,
			shadowColor: "black",
			shadowOffset: {
				width: 20,
				height: 20,
			},
			shadowRadius: 5,
			shadowOpacity: 20,
			paddingBottom: 20,
			paddingTop: 20,
			position: "absolute",
		},
	});

	useEffect(() => {
		Animated.spring(barWidth, {
			toValue: finalWidth,
			bonuciness: 10,
			speed: 2,
			useNativeDriver: false,
		}).start();
	}, []);

	const register_date = new Date(rtr_date);
	const expiry_date = new Date(exp);
	let current_date = new Date();
	const diffDays = Math.ceil(Math.abs(expiry_date - register_date) / (1000 * 60 * 60 * 24));
	const passedDays = Math.ceil(Math.abs(current_date - register_date) / (1000 * 60 * 60 * 24));
	const leftDays = Math.ceil((expiry_date - current_date) / (1000 * 60 * 60 * 24));

	let expiryProgress =
		(passedDays / diffDays) * 100 < Devicewidth / 2.3 ? (passedDays / diffDays) * 100 : Devicewidth / 2.3;
	let StatusDetails = leftDays <= 0 ? "Expired" : leftDays < 7 ? "Expiring Soon" : "Fresh";

	async function removePerishable() {
		console.log("Removing", title, "....");
		const requestOptions = {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				p_code: p_code,
			}),
		};
		fetch("https://scanlah.herokuapp.com/api/perish_delete", requestOptions)
			.then((response) => {
				response.json().then((data) => {
					if (response.ok) {
						console.log("response ok");
						setIsRemoved(true);
						setRemoveRenderFlag(true);
					} else {
						console.log("response !ok");
						setIsRemoved(false);
						setRemoveRenderFlag(true);
					}
				});
			})
			.catch((error) => {
				console.log(error);
			});
	}

	function renderRemove() {
		return removeRenderFlag ? (
			renderBeenRemoved()
		) : (
			<View style={styles.container}>
				<View style={styles.renderTextContainer}>
					<Text style={Object.assign({}, styles.colorText, styles.mainText)}>Confirm remove ?</Text>
				</View>
				<View style={styles.removeButton}>
					<Button
						title="Yes"
						onPress={() => {
							removePerishable();
						}}
						color={"red"}
					/>
				</View>
				<View style={styles.removeButton}>
					<Button
						title="No"
						onPress={() => {
							setIsRenderRemove(false);
						}}
					/>
				</View>
			</View>
		);
	}

	function renderBeenRemoved() {
		var removeReponse = isRemoved ? "Successfully deleted" : "Error deleting";
		return (
			<View style={styles.container}>
				<View style={styles.renderTextContainer}>
					<Text style={Object.assign({}, styles.colorText, styles.mainText)}> {removeReponse} </Text>
				</View>
			</View>
		);
	}
	// console.log("-------------------------------------------------------");
	// console.log(title);
	return isRenderRemove ? (
		renderRemove()
	) : (
		<TouchableOpacity
			onPress={() => {
				isHighlighted ? setIsHighlighted(false) : setIsHighlighted(true);
				isRenderMinus ? setIsRenderMinus(false) : setIsRenderMinus(true);
				console.log(isRenderMinus);
				if (!isHighlighted) {
					parent_selectedPCode.push(p_code);
					parent_setSelectedPCode(parent_selectedPCode);
					console.log(`added ${p_code}`);
					// console.log(parent_selectedPCode);
					parent_setForceUpdate(Math.random());
				} else {
					// parent_selectedPCode.splice(parent_selectedPCode.indexOf(p_code), 1);
					parent_selectedPCode = parent_selectedPCode.filter((n) => n != p_code);
					parent_setSelectedPCode(parent_selectedPCode);
					console.log(`removed ${p_code}`);
					// console.log(parent_selectedPCode);
					parent_setForceUpdate(Math.random());
				}
				Object.assign({}, styles.colorText, styles.mainText);
			}}>
			<View
				style={
					// isHighlighted ? Object.assign({}, styles.cardContainer, styles.highlight) : styles.cardContainer
					styles.cardContainer
				}>
				<Image source={{ uri: img_url }} style={styles.imageStyle} />
				<Text style={styles.titleStyle}>{title}</Text>
				{!isRenderMinus ? (
					<AntDesign style={styles.tickIcon} name="checkcircle" size={30} color="orange" />
				) : null}
				<Text style={styles.detailsStyle}>REG : {rtr_date}</Text>
				<Text style={styles.detailsStyle}>EXP : {exp}</Text>
				<Text
					style={[
						styles.leftDays,
						StatusDetails == "Fresh"
							? { backgroundColor: "rgba(0, 200, 0, 1)" }
							: StatusDetails == "Expiring Soon"
							? { backgroundColor: "rgba(200, 0, 0, 1)" }
							: { backgroundColor: "rgba(0, 0, 0, 1)" },
					]}>
					{leftDays} Days
				</Text>
				<View style={styles.statusBar}></View>
				<Animated.View
					style={[
						styles.expireBar,
						{ width: expiryProgress },
						StatusDetails == "Fresh"
							? { backgroundColor: "rgba(0, 200, 0, 1)" }
							: StatusDetails == "Expiring Soon"
							? { backgroundColor: "rgba(200, 0, 0, 1)" }
							: { backgroundColor: "rgba(0, 0, 0, 1)" },
					]}
				/>
			</View>
		</TouchableOpacity>
	);
};

export default Card;

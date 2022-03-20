import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect, useRef } from "react";
import {
	Button,
	Image,
	StyleSheet,
	Text,
	View,
	TextInput,
	ImageBackground,
	TouchableOpacity,
	Dimensions,
} from "react-native";
import { FlatList, ScrollView } from "react-native-gesture-handler";

import { BarCodeScanner } from "expo-barcode-scanner";
const cheerio = require("cheerio");
import { Camera } from "expo-camera";
import Ionicons from "react-native-vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";
import LottieView from "lottie-react-native";

// import * as ImageManipulator from "expo-image-manipulator";
import * as FileSystem from "expo-file-system";
import { Buffer } from "buffer";

// import MlkitOcr from "react-native-mlkit-ocr";
// import ImagePicker from "react-native-image-crop-picker";

export default function SearchScreen(props) {
	const [hasPermission, setHasPermission] = useState(null);
	const [barcodeScanned, setBarcodeScanned] = useState(false);
	const [isRenderCamera, setIsRenderCamera] = useState(false);
	// textField
	const [renderTextfield, setRenderTextField] = useState(false);
	const [barcodeResult, setBarcodeResult] = useState(false);
	const [titleResult, setTitleResult] = useState("");
	const [titleField, setTitleField] = useState("");
	const [errorMsg, setErrorMsg] = useState(false);

	// Text recognition
	const [renderOCR, setRenderOCR] = useState(false);
	const [isCaptured, setIsCaptured] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [imgSrc, setImgSrc] = useState(null);
	const [expiryDate, setExpiryDate] = useState("");
	const [arrayExpiryDate, setArrayExpiryDate] = useState([]);
	const [arrayRecognizedExpiryDate, setArrayRecognizedExpiryDate] = useState([]);
	// date
	const [date, setDate] = useState(new Date());
	const [mode, setMode] = useState("date");
	const [show, setShow] = useState(false);
	const [dateText, setDateText] = useState("Select the expiry date:\nDD/MM/YY");
	// lottie animation
	const animation = useRef(null);
	const [isRenderLoadingSuccess, setIsRenderLoadingSuccess] = useState(false);

	//Testing
	function useToggle(initialValue = false) {
		const [value, setValue] = React.useState(initialValue);
		const toggle = React.useCallback(() => {
			setValue((v) => !v);
		}, []);
		return [value, toggle];
	}
	const [activateBarcodeCam, setactivateBarcodeCam] = useToggle(false);

	// camera ref to access camera
	const cameraRef = useRef(null);

	const askForCameraPermission = () => {
		(async () => {
			const { status } = await Camera.requestCameraPermissionsAsync();
			setHasPermission(status == "granted"); // True given the following condition
		})();
		// ^ empty parentesis makes it a 'promise'
	};

	// Request for camera permission
	useEffect(() => {
		askForCameraPermission();
	}, []);

	// Check permissions and return the screens
	if (hasPermission === null) {
		return (
			<View style={styles.container}>
				<Text style={styles.whiteText}>Requesting for camera permission</Text>
			</View>
		);
	}

	if (hasPermission === false) {
		return (
			<View style={styles.container}>
				<Text style={(styles.whiteText, { margin: 10 })}>No access to camera</Text>
				<Button
					title={"Allow Camera"}
					onPress={() => {
						askForCameraPermission();
					}}></Button>
			</View>
		);
	}

	function toolKitButtons() {
		return (
			<View
				style={{
					position: "absolute",
					bottom: (Deviceheight / 100) * 12,
					alignItems: "center",
					justifyContent: "center",
					overflow: "hidden",
					height: (Devicewidth / 100) * 90,
					width: (Devicewidth / 100) * 90,
					borderRadius: 20,
				}}>
				<View
					style={{
						position: "absolute",
						height: (Devicewidth / 100) * 30,
						width: (Devicewidth / 100) * 13,
						right: (Devicewidth / 100) * 1.7,
						backgroundColor: "rgba(255,255,255,0.5)",
						borderRadius: 10,
						borderWidth: 2,
						borderColor: "rgba(255,255,255,0.8)",
					}}
				/>
				<TouchableOpacity
					style={{
						position: "absolute",
						top: (Devicewidth / 100) * 30,
						right: (Devicewidth / 100) * 2.5,
					}}
					onPress={() => {
						setIsRenderCamera(false);
						setactivateBarcodeCam(true);
					}}>
					<Ionicons name="barcode-outline" size={45} color={"black"} />
				</TouchableOpacity>
				<TouchableOpacity
					style={{
						position: "absolute",
						top: (Devicewidth / 100) * 49,
						right: (Devicewidth / 100) * 3,
					}}
					onPress={() => {
						isRenderCamera ? setIsRenderCamera(false) : setIsRenderCamera(true);
						activateBarcodeCam ? setactivateBarcodeCam(false) : null;
					}}>
					<Ionicons name="camera-outline" size={45} color={"black"} />
				</TouchableOpacity>
				<View
					style={{
						position: "absolute",
						top: (Devicewidth / 100) * 30,
						left: (Devicewidth / 100) * 15,
						width: (Devicewidth / 100) * 60,
						height: (Devicewidth / 100) * 30,
						// borderWidth: 2,
						// borderRadius: 20,
						// borderStyle: "dashed",
						// shadowColor: "transparent",
						// borderColor: "transparent",
						// borderBottomColor: "red",
						// borderTopColor: "red",
					}}
				/>
			</View>
		);
	}

	function renderBarcodeUI() {
		return (
			<View style={styles.barcodebox}>
				<TouchableOpacity
					style={{
						position: "absolute",
						top: (Devicewidth / 100) * 30,
						right: (Devicewidth / 100) * 2.5,
						elevation: 3,
						zIndex: 3,
					}}
					onPress={() => {
						setIsRenderCamera(false);
						setactivateBarcodeCam(true);
					}}>
					<Ionicons name="barcode-outline" size={45} color={"orange"} />
				</TouchableOpacity>
				<TouchableOpacity
					style={{
						position: "absolute",
						top: (Devicewidth / 100) * 49,
						right: (Devicewidth / 100) * 3,
						elevation: 3,
						zIndex: 3,
					}}
					onPress={() => {
						isRenderCamera ? setIsRenderCamera(false) : setIsRenderCamera(true);
						activateBarcodeCam ? setactivateBarcodeCam(false) : null;
					}}>
					<Ionicons name="camera-outline" size={45} color={"black"} />
				</TouchableOpacity>
				<View
					style={{
						position: "absolute",
						top: (Devicewidth / 100) * 30,
						left: (Devicewidth / 100) * 15,
						width: (Devicewidth / 100) * 60,
						height: (Devicewidth / 100) * 30,
						borderWidth: 2,
						borderRadius: 20,
						borderStyle: "dashed",
						shadowColor: "transparent",
						// backgroundColor: "transparent",
						borderColor: "transparent",
						borderBottomColor: "red",
						borderTopColor: "red",
						elevation: 2,
						zIndex: 2,
					}}
				/>
				<BarCodeScanner
					onBarCodeScanned={barcodeScanned ? undefined : handleBarCodeScanned}
					style={{ height: (Deviceheight / 100) * 90, width: "100%" }}
				/>
			</View>
		);
	}

	const takePhoto = async () => {
		if (cameraRef) {
			console.log("photo Taken:");
		}
		try {
			// console.log("getSupportedRatiosAsync()", await cameraRef.current.getSupportedRatiosAsync());
			let photo = await cameraRef.current.takePictureAsync({
				quality: 0.8,
				// ratio: [1, 1],
			});
			return photo;
		} catch (e) {
			console.log(e);
		}
	};

	const renderCameraUI = () => {
		return (
			<View style={styles.cameraView}>
				<Camera style={styles.cameraComponent} type={Camera.Constants.Type.back} ref={cameraRef} ratio="4:3">
					<TouchableOpacity
						style={{
							position: "absolute",
							top: (Devicewidth / 100) * 30,
							right: (Devicewidth / 100) * 2.5,
							elevation: 3,
							zIndex: 3,
						}}
						onPress={() => {
							setIsRenderCamera(false);
							setactivateBarcodeCam(true);
						}}>
						<Ionicons name="barcode-outline" size={45} color={"black"} />
					</TouchableOpacity>
					<View
						style={{
							position: "absolute",
							top: (Devicewidth / 100) * 30,
							left: (Devicewidth / 100) * 15,
							width: (Devicewidth / 100) * 60,
							height: (Devicewidth / 100) * 30,
							borderWidth: 2,
							borderRadius: 20,
							borderStyle: "dashed",
							shadowColor: "transparent",
							// backgroundColor: "transparent",
							borderColor: "transparent",
							borderBottomColor: "red",
							borderTopColor: "red",
							// elevation: 0,
							// zIndex: 0,
						}}
					/>
					<View style={styles.buttonContainer}>
						<TouchableOpacity
							style={{
								position: "absolute",
								bottom: 0,
								right: (Devicewidth / 100) * 1,
								width: (Devicewidth / 100) * 25,
								height: (Devicewidth / 100) * 8,
								alignContent: "center",
								alignItems: "center",
								justifyContent: "center",
								// borderRadius: 5,
								// borderWidth: 2,
								// backgroundColor: "rgba(255, 108, 0, 0.8)",
								// borderColor: "rgba(255,255,255,0.5)",
							}}
							onPress={async () => {
								const r = await takePhoto();
								setImgSrc({ uri: r.uri });
								setIsLoading(true);
								setIsRenderCamera(false);
								setIsCaptured(true);
								var textArray = await recognizeTextFromBin(r.uri);
								parseDatesFromTexts(textArray);
								setIsLoading(false);
							}}>
							<Text style={[styles.text, { color: "white" }]}>Capture</Text>
						</TouchableOpacity>
					</View>
					<TouchableOpacity
						style={{
							position: "absolute",
							top: (Devicewidth / 100) * 49,
							right: (Devicewidth / 100) * 3,
							elevation: 4,
							zIndex: 4,
						}}
						onPress={() => {
							isRenderCamera ? setIsRenderCamera(false) : setIsRenderCamera(true);
							activateBarcodeCam ? setactivateBarcodeCam(false) : null;
						}}>
						<Ionicons name="camera-outline" size={45} color={"orange"} />
					</TouchableOpacity>
				</Camera>
			</View>
		);
	};

	const onDateChange = (event, selectedDate) => {
		const currentDate = selectedDate || date;
		setShow(Platform.OS === "ios");
		setDate(currentDate);

		let tempDate = new Date(currentDate);
		let todayDate = new Date();
		let fDate = tempDate.getDate() + "/" + (tempDate.getMonth() + 1) + "/" + tempDate.getFullYear();
		let lTime = Math.ceil((tempDate - todayDate) / (1000 * 60 * 60 * 24));
		let perishDate = tempDate.getFullYear() + "-" + (tempDate.getMonth() + 1) + "-" + tempDate.getDate();
		setExpiryDate(perishDate);
		setDateText(fDate + "\n" + lTime + " DAYS LEFT");
		console.log(fDate + "\n" + lTime + " DAYS LEFT");
	};

	const showMode = (currentMode) => {
		setShow(true);
		setMode(currentMode);
	};

	// What happens when we scan the bar code
	const handleBarCodeScanned = async ({ type, data }) => {
		setTitleResult("Fetching product details..");
		setTitleField("Fetching product details..");
		setBarcodeScanned(true);
		var product = await retrieveBarcodeTitle(data);
		console.log("Type " + type + "\nData: " + data + "\nProduct: " + product);
		console.log(product.length);
		product.length == 0 ? setBarcodeResult(false) : setBarcodeResult(data);
		product.length == 0 ? setTitleResult("") : setTitleResult(product);
		product.length == 0 ? setTitleField("") : setTitleField(product);
		product.length == 0
			? setErrorMsg("Item not found in database.\nPlease enter the product title.")
			: setErrorMsg(false);
		//close barcode cam
		setactivateBarcodeCam(false);
		setBarcodeScanned(false);
	};

	// Web scraping / parsing
	async function retrieveBarcodeTitle(code) {
		var searchUrl = `https://world.openfoodfacts.org/product/${code}`;
		var response = await fetch(searchUrl); // fetch page
		var htmlString = await response.text(); // get response text
		var $ = cheerio.load(htmlString); // parse HTML string
		return $("h1[property=food:name]").text().trim();
	}

	const recognizeTextFromBin = async (path) => {
		console.log("loading Azure API...");
		// Converting image to Binary
		var img_64 = await FileSystem.readAsStringAsync(path, { encoding: "base64" });
		var img_bin = Buffer.from(img_64, "base64"); // Base-64 to Binary
		// Azure OCR API request
		const rawResponse = await fetch(
			"https://eastus.api.cognitive.microsoft.com/vision/v3.2/ocr?language=en&detectOrientation=true&model-version=latest",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/octet-stream",
					"Ocp-Apim-Subscription-Key": "82cd4a39af694f97bac4c3efb5d84e76",
				},
				body: img_bin,
			}
		);
		const content = await rawResponse.json();
		var text_detected_array = [];
		content.error
			? console.log(content)
			: content.regions.forEach((regions) => {
					regions.lines.forEach((lines) => {
						lines.words.forEach((words, index) => {
							text_detected_array.push(words.text);
						});
					});
			  });
		console.log("content.regions.length: ", content.regions.length);
		console.log("text_detected_array", text_detected_array);
		return parseDatesFromTexts(text_detected_array);
	};

	const parseDatesFromTexts = async (array) => {
		let recognizedNumbers = [];
		array.forEach((OCRText) => {
			OCRText = OCRText.replace(/[Oo]/g, "0");
			OCRText = OCRText.replace(/[\D]/g, " ");
			OCRText = OCRText.split(" ")
				.filter(Number)
				.filter((n) => (n.length == 2 && Number(n) < 32) || (n.length == 4 && n.substring(0, 2) == "20"));
			recognizedNumbers = recognizedNumbers.concat(OCRText);
		});
		console.log(`recognizedNumbers`, recognizedNumbers);
		let recognizedYearIndex = [];
		// index of Year = int value of recognizedYear
		for (let i = 0; i < recognizedNumbers.length; i++) {
			let e = recognizedNumbers[i];
			(e.length == 4 && e.substring(0, 2) == "20") ||
			(e.length == 2 && e.substring(0, 1) == "2" && parseInt(e.substring(1, 2)) > 1)
				? recognizedYearIndex.push(recognizedNumbers.indexOf(e))
				: recognizedYearIndex;
		}
		console.log(`recognizedYearIndex = ${recognizedYearIndex}`);
		// Identifying possible index of dates
		// XX XX YYYY, YYYY XX XX, YYYY ABC XX
		// TODO: Identify printed alphabetical Months
		// TODO: Formats like 07/21 or 07/22, or 07/2X (no day)
		var numbersBehindYear = false;
		var numbersInfrontYear = false;
		var expiryDates = recognizedYearIndex.length ? "" : "No expiry date found, Try Again ?";
		let recognizedDates = [];

		recognizedYearIndex.forEach((i, index) => {
			numbersBehindYear = recognizedNumbers.length >= i + 2 ? true : false;
			numbersInfrontYear = i - 2 >= 0 ? true : false;
			var e = recognizedNumbers;
			var Year = e[i];
			let fourDigitYear = Year.length == 4 ? true : false;

			console.log(
				`\nindex: ${index}\nnumbersBehindYear: ${numbersBehindYear}\nnumbersInfrontYear: ${fourDigitYear}\nYear: ${Year}\nfourDigitYear: ${fourDigitYear}`
			);

			if (numbersBehindYear) {
				if (fourDigitYear) {
					var hasLead = e[i - 2] && e[i - 2]?.length == 2 ? e[i - 2] : false;
					var hasTrail = e[i + 2] && e[i + 2]?.length == 2 ? e[i + 2] : false;
					var validLeadingMiddle = e[i - 1]?.length == 2 ? true : false;
					var validTrailingMiddle = e[i + 1]?.length == 2 ? true : false;
					hasLead && validLeadingMiddle ? (expiryDates += `${e[i - 2]}/${e[i - 1]}/${Year}\n`) : null;
					hasTrail && validTrailingMiddle ? (expiryDates += `${Year}/${e[i + 1]}/${e[i + 2]}\n`) : null;
					// For api input date formatting
					hasLead && validLeadingMiddle ? recognizedDates.push(`${Year}-${e[i - 1]}-${e[i - 2]}`) : null;
					hasTrail && validTrailingMiddle ? recognizedDates.push(`${Year}-${e[i + 1]}-${e[i + 2]}`) : null;
				}
			}
			if (numbersInfrontYear) {
				if (fourDigitYear) {
					var validMiddle = e[i - 1].length == 2 || e[i + 1].length == 2 ? true : false;
					var hasLead = e[i - 2] && e[i - 2].length == 2 ? e[i - 2] : false;
					hasLead && validMiddle ? (expiryDates += `${e[i - 2]}/${e[i - 1]}/${Year}\n`) : null;
					// For api input date formatting
					hasLead && validMiddle ? recognizedDates.push(`${Year}-${e[i - 1]}-${e[i - 2]}`) : null;
				} else {
					var validMiddle = e[i - 1].length == 2 || e[i + 1].length == 2 ? true : false;
					validMiddle ? (expiryDates += `${e[i - 1]}/${Year}\n`) : null;
					// For api input date formatting
					validMiddle ? recognizedDates.push(`20${Year}-${e[i - 1]}-01`) : null;
				}
			}
		});

		expiryDates = !expiryDates ? "No expiry date found, Try Again ?" : expiryDates;
		console.log("expiryDates: ", expiryDates);
		console.log(
			"expiry date array: ",
			expiryDates.split("\n").filter((n) => n)
		);
		setArrayExpiryDate(expiryDates.split("\n").filter((n) => n));
		// console.log("length: ", expiryDates.split("\n").filter((n) => n).length);

		console.log("recognized date array: ", recognizedDates);
		setArrayRecognizedExpiryDate(recognizedDates);
		// console.log("length: ", expiryDates.split("\n").filter((n) => n).length);
	};

	function renderRecognizedDates() {
		let dates = [];
		arrayExpiryDate.forEach((item, index) => {
			dates.push(
				<View style={styles.button} key={index}>
					<Button
						key={index}
						disabled={isLoading}
						title={item}
						onPress={() => {
							setExpiryDate(arrayRecognizedExpiryDate[index]);
							// Date formatting
							let tempDate = new Date(arrayRecognizedExpiryDate[index]);
							setDate(tempDate);
							let todayDate = new Date();
							let lTime = Math.ceil((tempDate - todayDate) / (1000 * 60 * 60 * 24));
							try {
								var tempArray = arrayRecognizedExpiryDate[index].split("-");
								tempArray.push(tempArray[1]);
								tempArray.push(tempArray[0]);
								delete tempArray[1];
								delete tempArray[0];
								tempArray = tempArray.filter((n) => n);
								setDateText(tempArray.join("/") + "\n" + lTime + " DAYS LEFT");
								console.log(
									`\narrayExpiryDate[${index}]: ${arrayExpiryDate[index]}\narrayRecognizedExpiryDate[${index}]: ${arrayRecognizedExpiryDate[index]}`
								);
							} catch (err) {
								isRenderCamera ? setIsRenderCamera(false) : setIsRenderCamera(true);
								activateBarcodeCam ? setactivateBarcodeCam(false) : null;
							}
						}}
					/>
				</View>
			);
		});
		return <View style={styles.options}>{dates}</View>;
	}

	function renderRecognizedDates2() {
		return (
			<FlatList
				data={arrayExpiryDate}
				style={[
					styles.options,
					{
						height: (Deviceheight / 100) * 10,
						width: (Devicewidth / 100) * 70,
						marginTop: (Deviceheight / 100) * 2,
						// elevation: 3,
						// zIndex: 3,
					},
				]}
				horizontal={true}
				renderItem={({ item, index }) => {
					return (
						<View style={[styles.button]} key={index}>
							<Button
								key={index}
								disabled={isLoading}
								title={item}
								onPress={() => {
									setExpiryDate(arrayRecognizedExpiryDate[index]);
									// Date formatting
									let tempDate = new Date(arrayRecognizedExpiryDate[index]);
									setDate(tempDate);
									let todayDate = new Date();
									let lTime = Math.ceil((tempDate - todayDate) / (1000 * 60 * 60 * 24));
									try {
										var tempArray = arrayRecognizedExpiryDate[index].split("-");
										tempArray.push(tempArray[1]);
										tempArray.push(tempArray[0]);
										delete tempArray[1];
										delete tempArray[0];
										tempArray = tempArray.filter((n) => n);
										setDateText(tempArray.join("/") + "\n" + lTime + " DAYS LEFT");
										console.log(
											`\narrayExpiryDate[${index}]: ${arrayExpiryDate[index]}\narrayRecognizedExpiryDate[${index}]: ${arrayRecognizedExpiryDate[index]}`
										);
									} catch (err) {
										isRenderCamera ? setIsRenderCamera(false) : setIsRenderCamera(true);
										activateBarcodeCam ? setactivateBarcodeCam(false) : null;
									}
								}}
							/>
						</View>
					);
				}}
			/>
		);
	}

	async function createPerishable() {
		var username = props.route.params.username;
		if (titleResult.length > 0 && expiryDate.length > 0) {
			setTitleField("");
			setTitleResult("");
			setExpiryDate("");
			setDateText("Select the expiry date:\nDD/MM/YY");
			setArrayExpiryDate([]);
			const requestOptions = {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					username: username,
					title: titleResult,
					b_code: barcodeResult ? barcodeResult : "EMPTY",
					exp: expiryDate,
				}),
			};
			fetch("https://scanlah.herokuapp.com/api/perish_create", requestOptions)
				.then((response) => {
					response.json().then((data) => {
						if (response.ok) {
							console.log("response ok");
						} else {
							console.log("response !ok");
							console.log(data);
							console.log(requestOptions.body);
							setTitleField({ error: data["Bad request"] });
						}
					});
				})
				.catch((error) => {
					console.log(error);
				});
		} else {
			console.log("One of the field is falsed, Did not send request.");
			console.log("titleResult.length > 0 :", titleResult.length > 0);
			console.log("expiryDate.length > 0 :", expiryDate.length > 0);
		}
	}

	function renderLoadingAnimation() {
		return (
			<View style={[styles.barcodebox]}>
				<Image
					style={[styles.barcodebox, { opacity: 0.75, bottom: 0, elevation: 3, zIndex: 3 }]}
					source={imgSrc}
				/>
				<LottieView
					ref={animation}
					style={{
						// position: "absolute",
						// top: Deviceheight / 8,
						// marginTop: Deviceheight / 30,
						width: "100%",
						// elevation: 3,
						// zIndex: 3,
						// height: 400,
						// backgroundColor: "black",
					}}
					loop={true}
					autoPlay={true}
					source={require("../../assets/lottie/35309-scan-qr-code.json")}
					// source={require("../../assets/lottie/4887-book.json")}
					// OR find more Lottie files @ https://lottiefiles.com/featured
				/>
				{/* <Text
					style={{
						position: "absolute",
						bottom: (Deviceheight / 100) * 10,
						fontSize: 30,
						fontFamily: "Caveat",
						width: "70%",
						textAlign: "center",
						color: "rgba(0, 0, 0, 0.75)",
						elevation: 4,
						zIndex: 4,
					}}>
					Loading machine..
				</Text> */}
			</View>
		);
	}

	function renderLoadingSuccess() {
		setTimeout(() => {
			setIsRenderLoadingSuccess(false);
		}, 4000);
		return (
			<View style={styles.animationContainer}>
				<Text
					style={{
						position: "absolute",
						top: (Deviceheight / 100) * 63,
						fontFamily: "Caveat",
						fontSize: 25,
						width: "50%",
						textAlign: "center",
						color: "rgba(0, 0, 0, 0.75)",
						elevation: 2,
						zIndex: 2,
					}}>
					Added Item
				</Text>
				<LottieView
					ref={animation}
					style={{
						position: "absolute",
						top: (Deviceheight / 100) * 14,
						width: Devicewidth / 1.2,
					}}
					loop={false}
					autoPlay={true}
					source={require("../../assets/lottie/69380-success-check.json")}
				/>
			</View>
		);
	}

	return (
		<ImageBackground
			source={require("../../assets/images/photo1.png")}
			imageStyle={{ opacity: 0.5 }}
			style={styles.container}
			resizeMode="cover">
			<View style={styles.menu}>
				<Text style={styles.mainText}>Register Product</Text>
			</View>
			<View style={styles.entryContainer1}>
				<TextInput
					style={styles.input}
					onChangeText={(change) => {
						setTitleField(change);
						setTitleResult(change);
						setErrorMsg(false);
					}}
					value={titleField}
					placeholder="Enter product title"
					placeholderTextColor="black"
				/>
				<TouchableOpacity
					style={styles.entryIcon}
					onPress={() => {
						setIsRenderCamera(false);
						setactivateBarcodeCam(true);
					}}>
					{activateBarcodeCam ? (
						<Ionicons name="barcode-outline" size={35} color={"orange"} />
					) : (
						<Ionicons name="barcode-outline" size={35} color={"black"} />
					)}
				</TouchableOpacity>
				{errorMsg ? <Text style={styles.error}>{errorMsg}.</Text> : null}
			</View>

			<View style={styles.entryContainer2}>
				<View style={styles.input}>
					<TouchableOpacity onPress={() => showMode("date")}>
						<Text style={{ fontSize: 14, fontWeight: "bold" }}>{dateText}</Text>
					</TouchableOpacity>
					{show && (
						<DateTimePicker
							testID="dateTimePicker"
							value={date}
							mode={mode}
							is24Hour={true}
							onChange={onDateChange}
						/>
					)}
				</View>
				<TouchableOpacity
					style={styles.entryIcon}
					onPress={() => {
						isRenderCamera ? setIsRenderCamera(false) : setIsRenderCamera(true);
						activateBarcodeCam ? setactivateBarcodeCam(false) : null;
					}}>
					{isRenderCamera ? (
						<Ionicons name="camera-outline" size={35} color={"orange"} />
					) : (
						<Ionicons name="camera-outline" size={35} color={"black"} />
					)}
				</TouchableOpacity>
			</View>

			{toolKitButtons()}

			{activateBarcodeCam ? renderBarcodeUI() : null}

			{isRenderCamera ? renderCameraUI() : null}

			{/* Loading animation for OCR fetching */}
			{isLoading ? renderLoadingAnimation() : null}

			<View style={styles.dateSelectionView}>
				{isCaptured ? <Text style={styles.dateSelectionText}>Select the correct date:</Text> : null}
				{isCaptured ? renderRecognizedDates2() : null}
			</View>

			<View style={styles.proceedButton}>
				<Button
					title={" Proceed "}
					disabled={titleResult.length > 0 && expiryDate.length > 0 ? false : true}
					onPress={() => {
						setIsRenderLoadingSuccess(true);
						createPerishable();
					}}
					color="tomato"
				/>
			</View>
			{isRenderLoadingSuccess ? renderLoadingSuccess() : null}
		</ImageBackground>
	);
}
const Devicewidth = Math.round(Dimensions.get("window").width);
const Deviceheight = Math.round(Dimensions.get("window").height);
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#272927",
		color: "#ffffff",
		alignItems: "center",
		justifyContent: "center",
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
		justifyContent: "center",
		alignItems: "center",
		zIndex: 1,
		elevation: 1,
		flexDirection: "row",
	},
	entryContainer1: {
		position: "absolute",
		alignItems: "center",
		justifyContent: "center",
		width: Devicewidth / 1.4,
		top: (Deviceheight / 100) * 20,
		elevation: 3,
		zIndex: 3,
		// borderColor: "red",
		// borderWidth: 2,
		// marginHorizontal: (Deviceheight / 100) * 10,
	},
	entryContainer2: {
		position: "absolute",
		alignItems: "center",
		justifyContent: "center",
		width: Devicewidth / 1.4,
		top: (Deviceheight / 100) * 30,
		elevation: 3,
		zIndex: 3,
		// borderColor: "red",
		// borderWidth: 2,
		// marginHorizontal: (Deviceheight / 100) * 10,
	},
	barcodebox: {
		position: "absolute",
		bottom: (Deviceheight / 100) * 12,
		zIndex: 3,
		elevation: 3,
		alignItems: "center",
		justifyContent: "center",
		overflow: "hidden",
		height: (Devicewidth / 100) * 90,
		width: (Devicewidth / 100) * 90,
		// height: 300,
		// width: 300,
		// borderWidth: 2,
		// borderColor: "black",
		borderRadius: 20,
	},
	error: {
		position: "absolute",
		backgroundColor: "rgba(255,255,255,1)",
		height: 46,
		borderRadius: 20,
		top: (Deviceheight / 100) * 2.7,
		left: (-Devicewidth / 100) * 3,
		color: "red",
		paddingBottom: 10,
		// marginBottom: 20,
		fontSize: 14,
	},
	mainText: {
		// position: "absolute",
		// top: (Deviceheight / 100) * 0,
		// left: (Devicewidth / 100) * 0,
		fontFamily: "Caveat",
		fontSize: 25,
		color: "black",
		elevation: 2,
		zIndex: 2,
		// borderWidth: 2,
		// borderColor: "red",
		// margin: 20,
	},
	whiteText: {
		color: "#ffffff",
	},
	button: {
		marginHorizontal: 10,
		marginVertical: 1,
	},
	barcodebutton: {
		marginHorizontal: 10,
		marginVertical: 1,
		bottom: Deviceheight / 50,
	},
	proceedButton: {
		position: "absolute",
		// marginHorizontal: 10,
		// marginVertical: 1,
		right: (Devicewidth / 100) * 5,
		bottom: (Deviceheight / 100) * 13,
	},
	input: {
		// height: 40,
		width: Deviceheight / 2.6,
		padding: 10,
		fontSize: 14,
		margin: 20,
		fontWeight: "bold",
		backgroundColor: "white",
		borderBottomLeftRadius: 20,
		borderTopLeftRadius: 20,
		borderBottomRightRadius: 20,
		borderTopRightRadius: 20,
		borderWidth: 2,
		borderColor: "orange",
		// right: Devicewidth / 30,
	},
	entryIcon: {
		// bottom: Deviceheight / 12,
		// left: Devicewidth / 3.2,
		right: 0,
		position: "absolute",
		borderBottomRightRadius: 20,
		borderTopRightRadius: 20,
		backgroundColor: "white",
		padding: 5,
	},
	datebutton: {
		height: 40,
		width: Deviceheight / 3,
		padding: 10,
		fontSize: 14,
		margin: 20,
		fontWeight: "bold",
		backgroundColor: "white",
		borderBottomLeftRadius: 20,
		borderTopLeftRadius: 20,
		right: Devicewidth / 30,
	},
	options: {
		// flexDirection: "row",
		// justifyContent: "space-between",
		// padding: 10,
		zIndex: 1,
		elevation: 1,
	},
	imageContainer: {
		justifyContent: "center",
		alignItems: "center",
	},
	image: {
		marginVertical: 15,
		height: 300,
		width: 400,
	},
	title: {
		fontSize: 20,
		textAlign: "center",
		color: "white",
		margin: 10,
	},
	cameraComponent: {
		// flex: 1,
		// bottom: Deviceheight / 7,
		height: (Devicewidth / 100) * 90,
		width: (Devicewidth / 100) * 90,
		zIndex: 2,
		elevation: 2,
		// borderRadius: 100,
	},
	buttonContainer: {
		flex: 1,
		backgroundColor: "transparent",
		flexDirection: "row",
		margin: 20,
	},
	text: {
		fontSize: 18,
		color: "white",
	},
	cameraView: {
		// flex: 1,
		position: "absolute",
		zIndex: 3,
		elevation: 3,
		bottom: (Deviceheight / 100) * 12,
		alignItems: "center",
		justifyContent: "center",
		overflow: "hidden",
		// borderWidth: 2,
		// borderColor: "black",
		borderRadius: 20,
	},
	dateSelectionView: { position: "absolute", top: (Deviceheight / 100) * 50 },
	dateSelectionText: {
		backgroundColor: "rgba(255,255,255,0.8)",
		borderRadius: 20,
		// borderWidth: 2,
		// borderColor: "rgba(0,0,255,0.5)",
		width: 180,
		paddingHorizontal: 8,
		alignSelf: "center",
	},
	animationContainer: {
		backgroundColor: "white",
		alignItems: "center",
		justifyContent: "center",
		flex: 1,
		width: Devicewidth,
		height: Deviceheight,
		elevation: 3,
		zIndex: 3,
	},
});

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
import { BarCodeScanner } from "expo-barcode-scanner";
const cheerio = require("cheerio");
import { Camera } from "expo-camera";
import DateTimePicker from "@react-native-community/datetimepicker";

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
	const [isLoading, setIsLoading] = useState(false);
	const [progress, setProgress] = useState(0);
	const [imgSrc, setImgSrc] = useState(null);
	const [expiryDate, setExpiryDate] = useState("");
	const [arrayExpiryDate, setArrayExpiryDate] = useState([]);
	const [arrayRecognizedExpiryDate, setArrayRecognizedExpiryDate] = useState([]);
	// date
	const [date, setDate] = useState(new Date());
	const [mode, setMode] = useState("date");
	const [show, setShow] = useState(false);
	const [dateText, setDateText] = useState("select date:\nDD/MM/YY");

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

	const takePhoto = async () => {
		if (cameraRef) {
			console.log("photo Taken:");
		}
		try {
			// console.log("getSupportedRatiosAsync()", await cameraRef.current.getSupportedRatiosAsync());
			let photo = await cameraRef.current.takePictureAsync({
				// quality: 0.1,
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
				<Camera style={styles.cameraComponent} type={Camera.Constants.Type.back} ref={cameraRef} ratio="1:1">
					<View style={styles.buttonContainer}>
						<TouchableOpacity
							style={styles.cameraButton}
							onPress={async () => {
								const r = await takePhoto();
								setImgSrc({ uri: r.uri });
								setIsRenderCamera(false);
								var textArray = await recognizeTextFromBin(r.uri);
								parseDatesFromTexts(textArray);
								// recognizeTextFromImage(r.uri);
								// Alert.alert("DEBUG", JSON.stringify(r));
							}}>
							<Text style={styles.text}> Capture </Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.cameraButton}
							onPress={() => {
								setIsRenderCamera(false);
							}}>
							<Text style={styles.text}> Cancel </Text>
						</TouchableOpacity>
					</View>
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
		let fDate = tempDate.getFullYear() + "/" + (tempDate.getMonth() + 1) + "/" + tempDate.getDate();
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
	};

	// Web scraping / parsing
	async function retrieveBarcodeTitle(code) {
		var searchUrl = `https://world.openfoodfacts.org/product/${code}`;
		var response = await fetch(searchUrl); // fetch page
		var htmlString = await response.text(); // get response text
		var $ = cheerio.load(htmlString); // parse HTML string
		return $("h1[property=food:name]").text().trim();
	}

	function handleRenderBarcodeField() {
		return (
			<TextInput
				style={styles.input}
				onChangeText={(change) => {
					setTitleField(change);
					setTitleResult(change);
					setErrorMsg(false);
				}}
				value={titleField}
				placeholder="Product title"
			/>
		);
	}

	function handleRenderBarcodeScan() {
		return (
			<ImageBackground
				source={require("../../assets/images/photo1.png")}
				style={styles.container}
				resizeMode="cover">
				<Text style={Object.assign({}, styles.whiteText, styles.mainText)}>Scan Product Barcode</Text>
				<View style={styles.barcodebox}>
					<BarCodeScanner
						onBarCodeScanned={barcodeScanned ? undefined : handleBarCodeScanned}
						style={{ height: 600, width: "100%" }}
					/>
				</View>
				<TextInput
					style={styles.input}
					onChangeText={(change) => {
						setTitleField(change);
						setTitleResult(change);
						setErrorMsg(false);
					}}
					value={titleField}
					placeholder="Click here to manually enter product title"
					placeholderTextColor="white"
				/>
				{errorMsg ? <Text style={styles.error}>{errorMsg}.</Text> : null}
				<View style={styles.options}>
					<View style={styles.button}>
						<Button
							title={"  <  "}
							onPress={() => {
								setRenderOCR(false);
								setBarcodeScanned(false);
								setTitleResult("");
								setTitleField("");
							}}
							color="tomato"
						/>
					</View>
					{barcodeScanned && <Button title={"Scan again?"} onPress={() => setBarcodeScanned(false)} />}
					<View style={styles.button}>
						<Button title={"  >  "} onPress={() => setRenderOCR(true)} color="tomato" />
					</View>
					{/* <View style={styles.button}>
				{renderTextfield ? (
					handleTextfield()
				) : (
					<Button title={"Manually Enter title"} onPress={() => setRenderTextField(true)} color="tomato" />
				)}
			</View> */}
				</View>
			</ImageBackground>
		);
	}

	const recognizeTextFromBin = async (path) => {
		console.log("loading Azure API...");
		var img_64 = await FileSystem.readAsStringAsync(path, { encoding: "base64" });
		var img_bin = Buffer.from(img_64, "base64"); // Base-64 to Binary
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
		var expiryDates = recognizedYearIndex.length ? "" : "No expiry date found.";
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

		expiryDates = !expiryDates ? "No expiry date found." : expiryDates;
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
							setDateText(
								arrayRecognizedExpiryDate[index].split("-").join("/") + "\n" + lTime + " DAYS LEFT"
							);

							console.log(
								`\narrayExpiryDate[${index}]: ${arrayExpiryDate[index]}\narrayRecognizedExpiryDate[${index}]: ${arrayRecognizedExpiryDate[index]}`
							);
						}}
					/>
				</View>
			);
		});
		return <View style={styles.options}>{dates}</View>;
	}

	function handleRenderOCR() {
		return isRenderCamera ? (
			renderCameraUI()
		) : (
			<ImageBackground
				source={require("../../assets/images/photo1.png")}
				style={styles.container}
				resizeMode="cover">
				<Text style={Object.assign({}, styles.whiteText, styles.mainText)}>Scan Expiry Date</Text>
				<View style={styles.button}>
					<Button
						title={dateText}
						onPress={() => {
							showMode("date");
						}}
						color={"black"}
					/>
				</View>
				<View style={styles.options}>
					<View style={styles.button}>
						<Button title={"  <  "} onPress={() => setRenderOCR(false)} color="tomato" />
					</View>
					<View style={styles.button}>
						<Button
							title="Camera"
							onPress={() => {
								// recognizeFromCamera();
								setIsRenderCamera(true);
							}}
						/>
					</View>
					{show && (
						<DateTimePicker
							testID="dateTimePicker"
							value={date}
							mode={mode}
							is24Hour={true}
							onChange={onDateChange}
						/>
					)}
					<View style={styles.button}>
						<Button
							title={"  >  "}
							onPress={() => {
								createPerishable();
							}}
							color="tomato"
						/>
					</View>
				</View>
				<View style={styles.imageContainer}>
					<Image style={styles.image} source={imgSrc} />
					{/* {isLoading ? null : <Text>{expiryDate}</Text>} */}
				</View>
				<View>
					<Text style={styles.instructions}>Please select the correct Date: </Text>
					{isLoading ? null : renderRecognizedDates()}
				</View>
			</ImageBackground>
		);
	}

	async function createPerishable() {
		var username = props.route.params.username;
		if (titleResult.length > 0 && expiryDate.length > 0) {
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

	return (
		// <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
		// <Image style={{ height: "100%", width: "100%" }} source={require("../../assets/images/photo1.png")}></Image>
		// </View>
		renderOCR ? handleRenderOCR() : handleRenderBarcodeScan()
	);
}
const { height, width } = Dimensions.get("window");
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#272927",
		color: "#ffffff",
		alignItems: "center",
		justifyContent: "center",
	},
	barcodebox: {
		backgroundColor: "white",
		alignItems: "center",
		justifyContent: "center",
		height: 300,
		width: 300,
		overflow: "hidden",
		borderRadius: 30,
	},
	mainText: {
		fontSize: 25,
		margin: 20,
	},
	whiteText: {
		color: "#ffffff",
	},
	button: {
		marginHorizontal: 10,
		marginVertical: 1,
	},
	input: {
		height: 40,
		margin: 12,
		borderWidth: 1,
		padding: 10,
		color: "#ffffff",
		fontSize: 16,
		margin: 20,
		backgroundColor: "black",
	},
	options: {
		flexDirection: "row",
		justifyContent: "space-between",
		padding: 10,
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
	instructions: {
		textAlign: "center",
		color: "white",
		marginBottom: 5,
	},
	cameraComponent: {
		// flex: 1,
		width: width,
		height: width,
	},
	buttonContainer: {
		flex: 1,
		backgroundColor: "transparent",
		flexDirection: "row",
		margin: 20,
	},
	cameraButton: {
		flex: 1,
		alignSelf: "flex-end",
		alignItems: "center",
	},
	text: {
		fontSize: 18,
		color: "white",
	},
	cameraView: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	error: {
		color: "red",
		marginBottom: 20,
		fontSize: 14,
	},
});

import React, { Component } from "react";
import { Image, View, StatusBar } from "react-native";

import { Container, Button, H3, Text, Header, Title, Body, Left, Right } from "native-base";

import styles from "./styles";

const launchscreenBg = require("../../../img/wallpaper.jpg");
const launchscreenLogo = require("../../../img/dollar.jpeg");

class Home extends Component {
	// eslint-disable-line

	render() {
		return (
			<Container>
				<StatusBar barStyle="light-content" />
				<Image source={launchscreenBg} style={styles.imageContainer}>
				<View style={styles.logoContainer}>
						<Text style={styles.title}>Party Bank</Text>
				</View>
				<View style={styles.botaoInferior}>
						<Button block primary onPress={() => this.props.navigation.navigate("DrawerOpen")}>
							<Text>Iniciar</Text>
						</Button>
				</View>
				</Image>
			</Container>
		);
	}
}

export default Home;

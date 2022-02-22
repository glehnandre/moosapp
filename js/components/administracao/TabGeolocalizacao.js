import React, { Component } from 'react';

import { Container, Content, Card, CardItem, Text, View, Body } from 'native-base';

import MapView from 'react-native-maps';

export default class TabGeolocalizacao extends Component {
	// eslint-disable-line

	render() {
		// eslint-disable-line
		return (
			<Content padder>
				<Text> Em breve </Text>
        <MapView
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
			</Content>
		);
	}
}

import React, { Component } from "react";
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Icon,
  Badge,
  Text,
  Left,
  Right,
  Body,
  Footer,
  FooterTab,
  Card,
  CardItem
} from "native-base";
import { Image, View, TouchableHighlight,AppRegistry } from "react-native";
import styles from "./styles";
import { StackNavigator } from "react-navigation";
import CaixaOutroValor from "./CaixaOutroValor";
import CaixaValorFixo from "./CaixaValorFixo";
import Credito from "./Credito";
import Caixa from "./Caixa";


const CaixaStack = StackNavigator({
  Caixa: {
    screen: Caixa,
  },
  CaixaOutroValor: {
    screen: CaixaOutroValor,
  },
  CaixaValorFixo: {
    screen: CaixaValorFixo,
  },
  Credito: {
    screen: Credito,
  },
},{
    initialRouteName: "Caixa",
    headerMode: "none",
  }
);

export default CaixaStack;

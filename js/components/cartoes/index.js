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
  Label,
  Input,
  Item,
  Form
} from "native-base";
import { Image, View, TouchableHighlight } from "react-native";


import { StackNavigator } from "react-navigation";
import Info from "./Info";
import GravaCartao from "./GravaCartao";
import Cartoes from "./Cartoes";

const CartoesStack = StackNavigator({
  Cartoes: {
    screen: Cartoes,
  },
  Info: {
    screen: Info,
  },
  GravaCartao: {
    screen: GravaCartao,
  },
},{
    initialRouteName: "Cartoes",
    headerMode: "none",
  });


export default CartoesStack;

import React, { Component } from "react";
import { Image, View, TouchableHighlight } from "react-native";
import styles from "../caixa/styles";
import { StackNavigator } from "react-navigation";
import Bar from "./Bar";
import Menu from "./Menu";
import Debito from "./Debito";

const BarStack = StackNavigator({
  Bar: {
    screen: Bar,
  },
  Menu: {
    screen: Menu,
  },
  Debito: {
    screen: Debito,
  },
},{
    initialRouteName: "Bar",
    headerMode: "none",
  }
);

export default BarStack;

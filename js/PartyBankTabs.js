import React, { Component } from "react";
import { BackAndroid, StatusBar, Platform } from "react-native";
import { variables, Drawer } from "native-base";

import getTheme from "../native-base-theme/components";
import material from "../native-base-theme/variables/material";
import platform from "../native-base-theme/variables/platform";

import constantes from "../util/constantes.js";
import DeviceInfo from 'react-native-device-info';

//Inicio do menu partycard
import Caixa from "./components/caixa";
import Bar from "./components/bar";
import Debito from "./components/bar/Debito";
import Administracao from  "./components/administracao";
import CaixaDetalhe from "./components/administracao/TabCaixaDetalhe";
import TabCaixa from "./components/administracao/TabCaixa";
import Cartoes from "./components/cartoes";
import GravaCartao from "./components/GravaCartao";
//Fim do menu partycard


class PartyBankTabs extends Component {



  render() {
    return <PartyBankTabs navigation={this.props.navigation}/> ;
  }
}

export default PartyBankTabs;
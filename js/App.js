/* @flow */

import React from "react";

import { Platform } from "react-native";
import { Root } from "native-base";
import { StackNavigator } from "react-navigation";

//Inicio dos imports particulares
import Caixa from "./components/caixa";
import CaixaOutroValor from "./components/caixa/CaixaOutroValor";
import Credito from "./components/caixa/Credito";
import Bar from "./components/bar";
import Menu from "./components/bar/Menu";
import Debito from "./components/bar/Debito";
import Administracao from "./components/administracao";
import CaixaDetalhe from "./components/administracao/TabCaixaDetalhe";
import TabCaixa from "./components/administracao/TabCaixa";
import Cartoes from "./components/cartoes";
import Info from "./components/cartoes/Info";
import GravaCartao from "./components/cartoes/GravaCartao";
//Fim dos imports particulares

const AppNavigator = StackNavigator(
    {

        //Inicio da navegação PartyBank
        Caixa: { screen: Caixa },
        CaixaOutroValor: { screen: CaixaOutroValor },
        Credito: { screen: Credito },
        Bar: {screen: Bar},
        Menu: {screen: Menu},
        Debito: {screen: Debito},
        Administracao: {screen: Administracao},
        CaixaDetalhe: {screen: CaixaDetalhe},
        TabCaixa: {screen: TabCaixa},
        Cartoes: {screen: Cartoes},
        Info: {screen: Info},
        GravaCartao: {screen: GravaCartao},
        //Fim da navegação Partybank
    },
    {
        initialRouteName: "Caixa",
        headerMode: "none",
    }
);

export default () =>
    <Root>
        <AppNavigator />
    </Root>;

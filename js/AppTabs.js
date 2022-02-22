/* @flow */

import React, { Component } from 'react';

import { Platform, Text } from "react-native";
import { Root } from "native-base";
import { TabNavigator } from "react-navigation";

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
import TabBar from "./components/administracao/TabBar";
import TabCartoes from "./components/administracao/TabCartoes";
import TabConfiguracoes from "./components/administracao/TabConfiguracoes";
import TabAdmin from "./components/administracao/TabAdmin";
import Cartoes from "./components/cartoes";
import Info from "./components/cartoes/Info";
import GravaCartao from "./components/cartoes/GravaCartao";
//Fim dos imports particulares


import constantes from "./components/util/constantes.js";
import DeviceInfo from 'react-native-device-info';


const PartyBankTabs = TabNavigator(
  {
    Caixa: {
      screen: Caixa,
      path: '',
    },
    Bar: {
      screen: Bar,
      path: 'Bar',
    },
    Cartoes: {
      screen: Cartoes,
      path: 'Cartoes',
    },
    Admin: {
      screen: Administracao,
      path: 'Administracao',
    },
  },
  {     tabBarPosition: 'bottom',
        animationEnabled: true,
        swipeEnabled: false,
        tabBarOptions: {
            activeTintColor: '#e91e63',
            indicatorStyle: {backgroundColor: '#19E243'},
            style: {backgroundColor: '#F4F4F4'},
            labelStyle: {color: 'black'},
            pressColor: '#19E243'
        }   

  }
);


class AppTabs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      //terminalBloqueado: true,
      terminalBloqueado: false,
    };

    let timerBloqueio = setInterval(() => this.checkBlock(), 30000);
    let timerCaixa = setInterval(() => new TabCaixa().syncServidor(), 10000);
    let timerBar = setInterval(() => new TabBar().syncServidor(), 15000);
    let timerCartoes = setInterval(() => new TabCartoes().syncServidor(), 15000);
    let timerMenu = setInterval(() => new TabAdmin().getStatusMenu(), 13000);
  }

  componentDidMount() {
    this.checkBlock();
  }

  checkBlock(){
    fetch(constantes.getAmbiente() + "/api/terminal/"+DeviceInfo.getSerialNumber()+"/status")
    .then((response) => response.json())
    .then((responseData) => {
        if(responseData == 404){
          this.setState({ terminalBloqueado: true });
        }else{
          if(responseData == 1){
             this.setState({ terminalBloqueado: true });
          }else{
             this.setState({ terminalBloqueado: false });
          } 
        };
    }).catch(function (err) {
     
    }).done();
  }

  render(){
    return(
      <Root>
      {this.state.terminalBloqueado?
        <Text>Terminal bloqueado</Text>
      :
       
            <PartyBankTabs />
       
      }
      </Root>
    );
  }

}


function navegacao(){
    if(true){
      return <Text>Terminal bloqueado</Text>;
    }else{
       return <Root>
                 <PartyBankTabs />
              </Root>;

    }
}


export default AppTabs;
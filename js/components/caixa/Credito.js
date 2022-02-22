import React, { Component } from "react";

import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Icon,
  Left,
  Right,
  Body,
  Item,
  Input,
  Label,
  Footer,
  FooterTab,
  Badge,
  Text
} from "native-base";

import { Image, TouchableHighlight,PermissionsAndroid, Alert, ToastAndroid} from "react-native";

import styles from "./styles";

import dataBase from "../database/DataBase";
import {getValorEmReal} from "../util/moeda.js";
import date from "../util/date.js";
import Rodape from "./Rodape";
import CartaoNFCWrite from "./CartaoNFCWrite";
import DeviceInfo from 'react-native-device-info';





class Credito extends Component {

  constructor(props){
    
    super(props);

    this.handler = this.handler.bind(this);

    var cartaoLocal = this.props.navigation.state.params.transacao.cartao;
    console.log('****ID****');
    console.log(DeviceInfo.getUniqueID());
    console.log(DeviceInfo.getSerialNumber());

    this.state = {
      cartao: cartaoLocal,
      transacao: this.props.navigation.state.params.transacao,
      totalVendas: 0,
      latitude: 0,
      longitude: 0
    };
  }

  componentDidMount(){
    console.log("Carregar a gelolocalizacao");
    this.getGeoLocation();
    this.getConfiguracao();
  }


  async getGeoLocation(){
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          'title': 'Permissão para Geolocation',
          'message': 'Gravar o geoposicionamento dos creditos e débitos dos cartões e pulseiras '
        }
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("You can use the GEO. LATITUDE e LONGITUDE:");
          navigator.geolocation.getCurrentPosition((position) => {
          console.log(position.coords.latitude);
          console.log(position.coords.longitude);
          this.setState({latitude: position.coords.latitude, longitude: position.coords.longitude});
          console.log("GEOLOCALIZACAO:");
          console.log(position);
          console.log("GEOLOCALIZACAO SALVA NO ESTADO:");
          console.log(this.state.latitude);
          console.log(this.state.longitude);
          }, (error) => {
              alert(JSON.stringify(error))
          });
      } else {
        console.log("Geolocation permission denied");
      }
    } catch (err) {
      console.warn(err)
    }

  }


getConfiguracao() {
      let db = new dataBase.criarDataBaseConfiguracoes();
      try {
          db.get('config').then((doc) => {
             console.log(doc);
             this.setState({config: doc});
          }).catch(function (err) {
            console.log('erro ao buscar a configuração');
            console.log(err);
            ToastAndroid.show('Salve sua configuração.', ToastAndroid.SHORT);
          });
      } catch (err) {
        console.log(err);
      }
}


handler() {
        console.log("Chamou o handler!!");
        this.setState({
            transacacoEfetuada: true,
        });
        this.registraTransacao();
}


async registraTransacao(){
    var data = new Date();
    let db = new dataBase.criarDataBaseCaixa();
    var dataPadrao = date.yyyymmddTempo(data);
    var cartaoOuDinheiro = this.state.transacao.isTipoVendaCartao? "Cartão" : "Dinheiro";
    console.log("@@@@ CARTAO @@@@@");
    console.log(this.state.cartao.id);
    console.log(dataPadrao);
    console.log(this.state.cartao.saldo - this.state.transacao.valorCredito);
    console.log(cartaoOuDinheiro);
    console.log(this.state.cartao.id);
    console.log(this.state.cartao.cpf);
    console.log(this.state.transacao.valorCredito);
    console.log(DeviceInfo.getSerialNumber());
    console.log(this.state.transacao.bandeiraCartao);
    console.log(this.state.latitude);
    console.log(this.state.longitude);
    console.log("@@@@ CARTAO @@@@@");
    if(this.state.cartao!=null && this.state.cartao.id!=null && !isNaN(this.state.cartao.id)){
      try {
        var response = await db.post({
          cartao: this.state.cartao.id,
          cpf: this.state.cartao.cpf,
          saldo: this.state.cartao.saldo,
          credito: this.state.transacao.valorCredito,
          terminal: DeviceInfo.getSerialNumber(),
          transacao: cartaoOuDinheiro,
          bandeira: this.state.transacao.bandeiraCartao,
          latitude: this.state.latitude,
          longitude: this.state.longitude,
          timestamp: dataPadrao,
          sync: false,
          evento: this.state.config.evento
        });
        console.log("************* CREDITADO COM SUCESSO ******************");
        console.log(response);
        console.log("************* CREDITADO COM SUCESSO ******************");
        ToastAndroid.show('Valor creditado com sucesso.', ToastAndroid.SHORT, ToastAndroid.CENTER);
        this.props.navigation.navigate("Caixa", { cartao: null });
      } catch (err) {
        console.log("##################### ERRO ########################");
        console.log(err);
        console.log("##################### ERRO ########################");
      }
    }else alert("ocorreu um erro ao processas sua solicitação, tente novamente.");
    this.props.navigation.navigate("Caixa", { cartao: null });
  }

  cancelar(){
    this.props.navigation.navigate("Caixa", { cartao: null });
  }

  // eslint-disable-line

  render() {

    const { params } = this.props.navigation.state;



    return (
      <Container style={styles.container}>
        <Header style={styles.containerHeader}>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title style={styles.titleHeader}>Sincronizar</Title>
          </Body>
          <Right>
          {this.state.cartao!=null?
            <Button transparent onPress={() => this.props.navigation.navigate("Caixa", { cartao: null })}>
              <Icon style={{fontSize: 35, color: '#555555'}} name="md-close" />
            </Button>
          : null}
          </Right>
        </Header>

        <Content padder>
          
          <CartaoNFCWrite action={this.handler} cartao={this.state.cartao}/>

        </Content>
        <Button style={{marginBottom: 10, marginRight: 5, marginLeft: 5}} full rounded danger onPress={() => this.cancelar()}>
           <Text>Cancelar valor final de R$ {getValorEmReal(this.state.transacao.valorCredito)}</Text>
        </Button>
      
      </Container>
    );
  }
}

export default Credito;

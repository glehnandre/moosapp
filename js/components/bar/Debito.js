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

import { Image, TouchableHighlight, PermissionsAndroid, Alert, ToastAndroid } from "react-native";

import styles from "../caixa/styles";

import dataBase from "../database/DataBase";
import {getValorEmReal} from "../util/moeda.js";
import date from "../util/date.js";
import CartaoNFCWrite from "../caixa/CartaoNFCWrite";
import Rodape from "../caixa/Rodape";
import DeviceInfo from 'react-native-device-info';

class Debito extends Component {

  constructor(props){
    super(props);

    this.handler = this.handler.bind(this);

    var cartaoLocal = this.props.navigation.state.params.transacao.cartao;
    cartaoLocal.terminal = this.getTerminal();

    this.state = {
      cartao: cartaoLocal,
      transacao: this.props.navigation.state.params.transacao,
      latitude: 0,
      longitude: 0
    };
  }

  handler() {
        console.log("Chamou o handler!!");
        this.setState({
            transacacoEfetuada: true,
        });
        this.registraTransacao();
  }

  
  getTerminal(){
    return DeviceInfo.getSerialNumber();
  }


    async getGeoLocation(){
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          'title': 'Cool Photo App Camera Permission',
          'message': 'Cool Photo App needs access to your camera ' +
                     'so you can take awesome pictures.'
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

componentDidMount(){
    console.log("Carregar a gelolocalizacao");
    this.getGeoLocation();
    this.getConfiguracao();
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

async registraTransacao(){
    var data = new Date();
    let db = new dataBase.criarDataBaseBar();
    var dataPadrao = date.yyyymmddTempo(data);
    console.log("&&&&& Saldo: " + this.state.cartao.saldo);
    console.log("&&&&& Vendas: " + this.state.transacao.valorDebito);
    console.log("&&&&& Saldo remanescente: " + (this.state.cartao.saldo - this.state.transacao.valorDebito));

    if(this.state.cartao.id!=null && !isNaN(this.state.cartao.id)){
      try {
        var response = await db.post({
          cartao: this.state.cartao.id,
          cpf: this.state.cartao.cpf,
          saldo: this.state.cartao.saldo - this.state.transacao.valorDebito,
          debito: this.state.transacao.valorDebito,
          pedido:this.state.transacao.pedido,
          terminal:DeviceInfo.getSerialNumber(),
          latitude: this.state.latitude,
          longitude: this.state.longitude,
          timestamp: dataPadrao,
          sync:false,
          evento: this.state.config.evento
        });
        console.log("************* CREDITADO COM SUCESSO ******************");
        console.log(response);
        this.indexaBase(db);
        console.log("************* CREDITADO COM SUCESSO ******************");
        ToastAndroid.show('Valor debitado com sucesso.', ToastAndroid.SHORT, ToastAndroid.CENTER);
        this.props.navigation.navigate("Bar", { cartao: null });
      } catch (err) {
        console.log("##################### ERRO ########################");
        console.log(err);
        console.log("##################### ERRO ########################");
      }
    }else alert("ocorreu um erro ao processas sua solicitação, tente novamente.");

  }

  indexaBase(db){
      db.createIndex({
        index: {
          fields: ['timestamp']
        }
      });
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
            <Button transparent onPress={() => this.props.navigation.navigate("Bar", { cartao: null })}>
              <Icon style={{fontSize: 35, color: '#555555'}} name="md-close" />
            </Button>
          : null}
          </Right>
        </Header>


        <Content padder>
          <CartaoNFCWrite action={this.handler} cartao={this.state.cartao}/>
          
          <Text style={styles.textBoldDestaqueCentro}>Saldo: {this.state.cartao.saldo}</Text>
          
        </Content>

        <Button style={{marginBottom: 10, marginRight: 5, marginLeft: 5}} full rounded danger onPress={() => this.props.navigation.navigate("Bar", { cartao: null })}>
           <Text>Cancelar débito de R$ {getValorEmReal(this.state.transacao.valorDebito)}</Text>
        </Button>

        
      </Container>
    );
  }
}

export default Debito;

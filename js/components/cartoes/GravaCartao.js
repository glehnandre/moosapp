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
  Body,
  Footer,
  FooterTab,
  Card,
  CardItem,
  Left,
  Right
} from "native-base";
import { Image, View, TouchableHighlight, PermissionsAndroid, Alert, ToastAndroid } from "react-native";
import styles from "../caixa/styles";
import date from "../util/date.js";
import dataBase from "../database/DataBase";
import LZString from "../util/lz-string.js";
import CartaoNFCWrite from "../caixa/CartaoNFCWrite";
import Rodape from "../caixa/Rodape";
import DeviceInfo from 'react-native-device-info';


class GravaCartao extends Component {


  constructor(props){
    super(props);
    this.handler = this.handler.bind(this);
    this.state = {cartao: this.props.navigation.state.params.cartao};
    console.log(this.state.cartao);
  }


  handler() {
          this.setState({
              transacacoEfetuada: true,
          });
          this.registraTransacao();
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
          
          navigator.geolocation.getCurrentPosition((position) => {
          this.setState({latitude: position.coords.latitude, longitude: position.coords.longitude});
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
    this.getGeoLocation();
    this.getConfiguracao();
  }

  getConfiguracao() {
      let db = new dataBase.criarDataBaseConfiguracoes();
      try {
          db.get('config').then((doc) => {
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
      var dataPadrao = date.yyyymmddTempo(data);
      let db = new dataBase.criarDataBaseCartoes();
      console.log("Gravando cartão no banco: ");
      console.log(this.state.cartao);
      if(this.state.cartao.id!=null && !isNaN(this.state.cartao.id)){

        try {
          var response = await db.post({
            cartao_id: this.state.cartao.id.toString(),
            cpf: this.state.cartao.cpf,
            saldo: this.state.cartao.saldo,
            nome: this.state.cartao.nome,
            email: this.state.cartao.email,
            telefone: this.state.cartao.telefone,
            terminal: DeviceInfo.getSerialNumber(),
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            timestamp: dataPadrao,
            sync:false,
            evento: this.state.config.evento
          });
        
          //this.indexaBase(db);
          ToastAndroid.show('Cartão criado com sucesso.', ToastAndroid.SHORT, ToastAndroid.CENTER);
          this.props.navigation.navigate("Cartoes", {  });
        } catch (err) {
          alert("Ocorreu um erro no seu processamento. Tente novamente ou contate a administração.");
          console.log("##################### ERRO ########################");
          console.log(err);
          console.log("##################### ERRO ########################");
        }
      }else alert("ocorreu um erro ao processar sua solicitação, tente novamente.");

    }

    indexaBase(db){
        db.createIndex({
          index: {
            fields: ['timestamp']
          }
        });
    }


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
            <Title style={styles.titleHeader}>Cartões</Title>
          </Body>
          <Right>
          {this.state.cartao!=null?
            <Button transparent onPress={() => this.props.navigation.navigate("Cartoes", { cartao: null })}>
              <Icon style={{fontSize: 35, color: '#555555'}} name="md-close" />
            </Button>
          : null}
          </Right>
        </Header>

        <Content padder>
          
          <CartaoNFCWrite action={this.handler} cartao={this.state.cartao}/>

        </Content>

        <Button style={{marginBottom: 10, marginRight: 5, marginLeft: 5}} full rounded danger onPress={() => this.props.navigation.navigate("Cartoes", {cartao: null})}>
           <Text>Cancelar</Text>
        </Button>

      </Container>
    );
  }
}

export default GravaCartao;

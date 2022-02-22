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
import { Image, View, ToastAndroid, TouchableHighlight } from "react-native";
import styles from "../caixa/styles";
import date from "../util/date.js";
import dataBase from "../database/DataBase";
import CartaoNFCRead from "../caixa/CartaoNFCRead";
import Rodape from "../caixa/Rodape";
import constantes from "../util/constantes.js";

import { StackNavigator } from "react-navigation";


class Cartoes extends Component {


  constructor(props){
    super(props);
    this.handler = this.handler.bind(this);
    this.state = {isCartaoCarregado: false, estadoBotaoNome : "Aproxime seu cartão NFC", isCartaoNovo:false, cartao_ativo: false };
  }


  handler(cartao, isCartaoNovo, isCartaoCarregado) {
        this.getStatusCartao(cartao);
        this.setState({
            isCartaoCarregado: isCartaoCarregado,
        });
        this.setState({
            cartao: cartao,
        });
        this.setState({
            isCartaoNovo: isCartaoNovo,
        });
  }

  async getStatusCartao(cartao){
    fetch(constantes.getAmbiente() + "/api/cartao/"+cartao.id.toString())
    .then((responseData) => {
        if(responseData.status == 404){
          this.setState({ cartao_ativo: true });
        }else{
          this.setState({ cartao_ativo: false });
        };
    }).catch(function (err) {
        ToastAndroid.show('Erro:' + err, ToastAndroid.LONG);
        console.log('ERRO AO PROCESSO CHAMADA AO SERVICO DE VALIDACAO DO CARTAO');
        console.log(err);
    }).done();
  }



  irParaInfo(){
    if(!this.state.cartao_ativo){
       ToastAndroid.show('Esse cartão já está ativo. Não pode ser associado a outra pessoa.', ToastAndroid.SHORT);
    } else if(this.state.isCartaoNovo){
        this.props.navigation.navigate("Info", { cartao: this.state.cartao });
    } else ToastAndroid.show('Por favor aproxime o dispositivo NFC para carregá-lo.', ToastAndroid.SHORT);
  }

  changeLabel(nome){
    this.setState({estadoBotaoNome : nome, isCartaoCarregado : true});
  }


  render() {

    return (
      <Container style={styles.container}>
        <Header style={styles.containerHeader}>
          <Body style={{alignContent: "center"}}>
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


        <CartaoNFCRead action={this.handler} tela={"Cartoes"}/>
          <Button style={{marginBottom: 10, marginRight: 5, marginLeft: 5}} full rounded primary onPress={() => this.irParaInfo()}>
             <Text>Próximo</Text>
          </Button>

        
      </Container>
    );
  }
}

export default Cartoes;

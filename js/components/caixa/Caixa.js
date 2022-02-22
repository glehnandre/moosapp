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
import { Image, View, TouchableHighlight,AppRegistry, Modal, Alert } from "react-native";
import styles from "./styles";
import LZString from "../util/lz-string.js";
import {getValorEmReal} from "../util/moeda.js";
import CartaoNFCRead from "./CartaoNFCRead";
import Rodape from "./Rodape";
import { StackNavigator } from "react-navigation";



class Caixa extends Component {


  constructor(props){
    super(props);
    this.handler = this.handler.bind(this);
    this.state = {
      isCartaoCarregado: false,
      isCartaoNovo: false,
      cartao: null
    };
  }

  handler(cartao, isCartaoNovo, isCartaoCarregado) {
        console.log("**** Chamou a leitura do cartão no caixa. Cartão: ");
        console.log(cartao);
        console.log("Carregou? " + isCartaoCarregado);
        console.log("Novo? " + isCartaoNovo);
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


  irParaInformarValor(){
    if(this.state.isCartaoCarregado){
      if(this.state.cartao.bloqueado){
        Alert.alert(
        '',
        'O cartão foi bloqueado.',
        [
          {text: 'OK', onPress: () => console.log('OK Pressed'), color: 'blue'},
        ],
        { cancelable: false }
      )
      }else{
        this.props.navigation.navigate("CaixaValorFixo", { cartao: this.state.cartao });
      }
    }else {
      Alert.alert(
        '',
        'Aproxime o cartão ou dispositivo NFC para carregá-lo.',
        [
          {text: 'OK', onPress: () => console.log('OK Pressed'), color: 'blue'},
        ],
        { cancelable: false }
      )
    }
  }


  render() {


    return (
      <Container style={styles.container}>
        <Header style={styles.containerHeader}>
          <Body>
            <Title style={styles.titleHeader}>Caixa</Title>
          </Body>
          <Right>
          {this.state.cartao!=null?
            <Button transparent onPress={() => this.props.navigation.navigate("Caixa", { cartao: null })}>
              <Icon style={{fontSize: 35, color: '#555555'}} name="md-close" />
            </Button>
          : null}
          </Right>
        </Header>

        <CartaoNFCRead action={this.handler} tela={"Caixa"}/>
        {this.state.isTipoVendaCartao ?
         <Button style={{marginBottom: 10, marginRight: 5, marginLeft: 5}} full rounded danger onPress={() =>  this.props.navigation.navigate("Caixa", { cartao: null })}>
             <Text>Cancelar</Text>
          </Button>
        :
          <Button style={{marginBottom: 10, marginRight: 5, marginLeft: 5}} full rounded primary onPress={() => this.irParaInformarValor()}>
             <Text>Próximo</Text>
          </Button>
        }
        
      </Container>
    );
  }
}


export default Caixa;

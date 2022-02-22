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
import { Image, View, TouchableHighlight } from "react-native";
import styles from "../caixa/styles";
import CartaoNFCRead from "../caixa/CartaoNFCRead";
import Rodape from "../caixa/Rodape";


class Bar extends Component {


  constructor(props){
    super(props);
    this.handler = this.handler.bind(this);
    this.state = {isCartaoCarregado: false,
      estadoBotaoNome : "Aproxime seu cartão NFC" };
  }

  handler(cartao, isCartaoNovo) {
        console.log("**** Chamou a leitura do cartão no bar. Cartão: ");
        console.log(cartao);
        this.setState({
            isCartaoCarregado: true,
        });
        this.setState({
            cartao: cartao,
        });
  }

  irParaMenu(){
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
        this.props.navigation.navigate("Menu", { cartao: this.state.cartao });
      }
    }else{
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

  changeLabel(nome){
    this.setState({estadoBotaoNome : nome, isCartaoCarregado : true});
  }


  render() {

    return (
      <Container style={styles.container}>
        <Header style={styles.containerHeader}>
          <Body>
            <Title style={styles.titleHeader}>Bar</Title>
          </Body>
          <Right>
          {this.state.cartao!=null?
            <Button transparent onPress={() => this.props.navigation.navigate("Bar", { cartao: null })}>
              <Icon style={{fontSize: 35, color: '#555555'}} name="md-close" />
            </Button>
          : null}
          </Right>
        </Header>

        <CartaoNFCRead action={this.handler} tela={"Bar"}/>
        {this.state.isTipoVendaCartao ?
          <Button style={{marginBottom: 10, marginRight: 5, marginLeft: 5}} full rounded danger onPress={() =>  this.props.navigation.navigate("Caixa", { cartao: null })}>
               <Text>Cancelar</Text>
          </Button>
        :
          <Button style={{marginBottom: 10, marginRight: 5, marginLeft: 5}} full rounded primary onPress={() => this.irParaMenu()}>
             <Text>Próximo</Text>
          </Button>
        }
        
      </Container>
    );
  }
}

export default Bar;

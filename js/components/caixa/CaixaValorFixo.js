import React, { Component } from "react";

import {
  Container,
  Header,
  Title,
  Content,
  Icon,
  IconNB,
  Left,
  Right,
  Body,
  Text,
  Item,
  Input,
  Label,
  Footer,
  FooterTab,
  Button,
  Badge,
  ActionSheet,
  Segment,
  Radio
} from "native-base";
import {
  View, Image, Dimensions, ToastAndroid
} from 'react-native';

import styles from "./styles";
import {getValorEmReal} from "../util/moeda.js";
import Rodape from "./Rodape";
import Switch from 'react-native-customisable-switch';

const deviceWidth = Dimensions.get("window").width;


const BANDEIRAS_ARTE = [
  { text: "Visa", icon: require('../../../img/cartoes/visa.jpg'), iconColor: "#2c8ef4" },
  { text: "Mastercard", icon: require('../../../img/cartoes/mastercard.gif'), iconColor: "#f42ced" },
  { text: "Elo", icon: require('../../../img/cartoes/elo.gif'), iconColor: "#ea943b" },
  { text: "American Express", icon: require('../../../img/cartoes/amex.png'), iconColor: "#fa213b" },
  { text: "Excluir", icon: require('../../../img/cartoes/cartao.png'), iconColor: "#25de5b" },
  { text: "Cancelar", icon: require('../../../img/cartoes/cartao.png'), iconColor: "#25de5b" }
];
const BANDEIRAS = ["Visa", "Mastercard", "Elo", "American Express", "Excluir", "Cancelar"];
var DESTRUCTIVE_INDEX = 4;
var CANCEL_INDEX = 5;
var SEM_BANDEIRA = { text: "Escolha a Bandeira", icon: require('../../../img/cartoes/cartao.png'), iconColor: "#25de5b" };



class ValorFixo extends Component {

  // eslint-disable-line
  constructor(props){
    super(props);
    this.state = {cartao: this.props.navigation.state.params.cartao,
       saldo: this.props.navigation.state.params.cartao.saldo,
       valorCreditoInteiro: 0, //Parte inteira do número
       valorCreditoDecimal: 0, //Parte decimal do número
       isDecimal: false, //Indica se é decimal
       isTipoVendaCartao: true,
       bandeiraCartao: null
     };
  }

  validaValor(valor){
    if(valor!= null){
      var cartaoAjustado = this.state.cartao;
      cartaoAjustado.saldo = cartaoAjustado.saldo + valor;
      this.setState({cartao: cartaoAjustado});
      this.props.navigation.navigate("Credito",
      { transacao: {cartao: cartaoAjustado, valorCredito:  valor, isTipoVendaCartao: this.state.isTipoVendaCartao, bandeiraCartao: this.state.bandeiraCartao}});
    }else{
      ToastAndroid.showWithGravity(
        'Informe um valor a ser creditado.',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    }
  }

  proximoPasso(valor){
    this.setState({valorCreditoInteiro: valor});
    if(this.state.isTipoVendaCartao){
      if(this.state.bandeiraCartao != null){
        this.validaValor(valor);
      }else{
         ToastAndroid.showWithGravity(
            'Informe a bandeira do cartão.',
            ToastAndroid.LONG,
            ToastAndroid.CENTER
         );
      }
    }else{
      this.validaValor(valor);
    }

  }


  //Retorna o texto tratado
  getBandeiraCartaoTexto(bandeira){
    if(bandeira == null){
      return SEM_BANDEIRA.text;
    }else{
      var objIndex = BANDEIRAS_ARTE.findIndex((BANDEIRAS_ARTE => BANDEIRAS_ARTE.text == bandeira));
      return BANDEIRAS_ARTE[objIndex].text;
    }
  };

  //Retorna a imagem tratada
  getBandeiraCartaoImagem(bandeira){
    if(bandeira == null){
      return SEM_BANDEIRA.icon;
    }else{
      var objIndex = BANDEIRAS_ARTE.findIndex((BANDEIRAS_ARTE => BANDEIRAS_ARTE.text == bandeira));
      return BANDEIRAS_ARTE[objIndex].icon;
    }
  }


  //Faz a lógica de seleção da bandeira
  setBandeiraCartao(bandeira){
    if(bandeira == "Excluir" || bandeira == null){
      this.setState({ bandeiraCartao: null});
    }else if(bandeira != "Cancelar"){
      this.setState({ bandeiraCartao: bandeira});
    }
  }

  //Remove os digitos
  apagaValor(){
        var valor;

        if(this.state.isDecimal){
          valor = parseFloat(this.state.valorCreditoDecimal.toString().slice(0, -1));
          if(isNaN(valor)){
            valor = 0;
            this.setState({isDecimal: false});
          }
          this.setState({valorCreditoDecimal: valor});
        }else {
          valor = parseFloat(this.state.valorCreditoInteiro.toString().slice(0, -1));
          if(isNaN(valor)) valor = 0;
          this.setState({valorCreditoInteiro: valor});
        }
        if(valor = 0 || isNaN(valor)){
          this.setState({isDecimal: false});
        }
  }

  //Mostra o valor com formato em moeda
  getValorFormatado(){
    var valor = this.state.valorCreditoInteiro + (this.state.valorCreditoDecimal / Math.pow(10,this.state.valorCreditoDecimal.toString().length));
    return getValorEmReal(valor);
  }

  getValorFormatadoTotal(){
    var valor =  this.state.saldo + this.state.valorCreditoInteiro + (this.state.valorCreditoDecimal / Math.pow(10,this.state.valorCreditoDecimal.toString().length));
    return getValorEmReal(valor);
  }

  addValor(valor){
    var valorAjustado = 0;
    var valorCorrente = 0;
    //Evita que o tamanho do input em tela estoure
    if((this.state.valorCreditoDecimal.toString().length + this.state.valorCreditoInteiro.toString().length)< 8){
      if(this.state.isDecimal){
        valorCorrente = this.state.valorCreditoDecimal;
      }else{
        valorCorrente = this.state.valorCreditoInteiro;
      }
      if(valor == "."){
          this.setState({isDecimal: true});
      }else{
        if(valorCorrente == "0"){
          valorAjustado = parseFloat(valor) + valorCorrente;
        }else{
          valorAjustado = parseFloat(valor) + (valorCorrente * 10);
        }
        if(this.state.isDecimal){
          this.setState({valorCreditoDecimal: valorAjustado});
        }else{
          this.setState({valorCreditoInteiro: valorAjustado});
        }
      }
    }
  }




  render() {

    return (
      <Container style={styles.container}>
        <Header style={styles.containerHeader}>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title style={styles.titleHeader}>{this.state.isTipoVendaCartao ? " Cartão" : "Dinheiro" }</Title>
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
           <View searchBar style={{marginTop: 5, flexDirection: 'row'}}>
            <Button
                onPress={(valor) => {this.setState({isTipoVendaCartao: true}); console.log('Cartão');}}
                accessibilityLabel="Um"
                style={this.state.isTipoVendaCartao ? styles.botaoCalculadoraSelecionado : styles.botaoCalculadora}
            >
              <Text style={styles.textBold}>Cartão</Text>
            </Button>
            <Button
                onPress={(valor) => {this.setState({isTipoVendaCartao: false}); console.log('Dinheiro');}}
                accessibilityLabel="Dois"
                style={this.state.isTipoVendaCartao ? styles.botaoCalculadora : styles.botaoCalculadoraSelecionado}
            >
             <Text style={styles.textBold}>Dinheiro</Text>
            </Button>
            </View>


            
          {this.state.isTipoVendaCartao ?
              <Button block light style={{marginTop: 10}}
                onPress={() =>
                ActionSheet.show(
                  {
                    options: BANDEIRAS,
                    cancelButtonIndex: CANCEL_INDEX,
                    destructiveButtonIndex: DESTRUCTIVE_INDEX,
                    title: "Escolha a bandeira do cartão"
                  },
                  buttonIndex => {
                    this.setBandeiraCartao(BANDEIRAS[buttonIndex]);
                  }
                )}
              >
                <Image style={{width: 40, height: 40}} source={this.getBandeiraCartaoImagem(this.state.bandeiraCartao)}/>
                <Text style={{fontWeight: "bold"}}>
                {this.getBandeiraCartaoTexto(this.state.bandeiraCartao)}
                </Text>

              </Button>
          : null}
          <Button block light style={{marginBottom: 10, marginTop: 10}} onPress={() => this.proximoPasso(10)}>
            <Text style={styles.textBold}>R$ 10,00</Text>
          </Button>
          <Button block light style={{marginBottom: 10}} onPress={() => this.proximoPasso(20)}>
            <Text style={styles.textBold}>R$ 20,00</Text>
          </Button>
          <Button block light style={{marginBottom: 10}} onPress={() => this.proximoPasso(50)}>
            <Text style={styles.textBold}>R$ 50,00</Text>
          </Button>
          <Button block light style={{marginBottom: 10}} onPress={() => this.proximoPasso(75)}>
            <Text style={styles.textBold}>R$ 75,00</Text>
          </Button>
          <Button block light style={{marginBottom: 10}} onPress={() => this.proximoPasso(100)}>
            <Text style={styles.textBold}>R$ 100,00</Text>
          </Button>
          <Button block info style={{marginBottom: 10}} onPress={() => this.props.navigation.navigate("CaixaOutroValor", { cartao: this.state.cartao })
}>
            <Text style={styles.textBold}>Outro valor</Text>
          </Button>
          


        </Content>

      </Container>
    );
  }
}

export default ValorFixo;

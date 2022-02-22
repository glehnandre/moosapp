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
  ActionSheet
} from "native-base";
import {
  View, Image, Switch, ToastAndroid
} from 'react-native';

import styles from "./styles";
import {getValorEmReal} from "../util/moeda.js";
import Rodape from "./Rodape";

const BANDEIRAS_ARTE = [
  { text: "Visa", icon: require('../../../img/cartoes/visa.jpg'), iconColor: "#2c8ef4" },
  { text: "Mastercard", icon: require('../../../img/cartoes/mastercard.gif'), iconColor: "#f42ced" },
  { text: "Elo", icon: require('../../../img/cartoes/elo.gif'), iconColor: "#ea943b" },
  { text: "American Express", icon: require('../../../img/cartoes/amex.png'), iconColor: "#fa213b" },
  { text: "Excluir", icon: require('../../../img/cartoes/cartao.png'), iconColor: "#25de5b" },
  { text: "Cancelar", icon: require('../../../img/cartoes/cartao.png'), iconColor: "#25de5b" }
];
const BANDEIRAS = ["Visa", "Mastercard", "Elo", "American Express", "Delete", "Cancel"];
var DESTRUCTIVE_INDEX = 4;
var CANCEL_INDEX = 5;
var SEM_BANDEIRA = { text: "Escolha a Bandeira", icon: require('../../../img/cartoes/cartao.png'), iconColor: "#25de5b" };



class CaixaOutroValor extends Component {

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

  validaValor(){
    if(this.state.valorCreditoInteiro != 0 || this.state.valorCreditoDecimal != 0){
      var valorCredito = this.state.valorCreditoInteiro + (this.state.valorCreditoDecimal / Math.pow(10,this.state.valorCreditoDecimal.toString().length));
      var cartaoAjustado = this.state.cartao;
      cartaoAjustado.saldo = cartaoAjustado.saldo + valorCredito;
      this.setState({cartao: cartaoAjustado});
      this.props.navigation.navigate("Credito",
      { transacao: {cartao: cartaoAjustado, valorCredito:  valorCredito, isTipoVendaCartao: this.state.isTipoVendaCartao, bandeiraCartao: this.state.bandeiraCartao}});
    }else{
            ToastAndroid.showWithGravity(
              'Informe um valor a ser creditado.',
              ToastAndroid.SHORT,
              ToastAndroid.CENTER
            );
    }
  }

  proximoPasso(){
    if(this.state.isTipoVendaCartao){
      if(this.state.bandeiraCartao != null){
        this.validaValor();
      }else{
              ToastAndroid.showWithGravity(
                'Informe a bandeira do cartão.',
                ToastAndroid.SHORT,
                ToastAndroid.CENTER
              );
      }
    }else{
      this.validaValor();
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
            <Switch
              style={{marginTop: 10}}
              onValueChange={ (value) => this.setState({ isTipoVendaCartao: value }) }
              value={ this.state.isTipoVendaCartao }
              onTintColor="#19E243"
            ></Switch>
            {this.state.cartao!=null?
            <Button transparent onPress={() => this.props.navigation.navigate("Caixa", { cartao: null })}>
              <Icon style={{fontSize: 35, color: '#555555'}} name="md-close" />
            </Button>
          : null}
          </Right>
        </Header>

        <Content padder>

          <Text style={styles.textBoldDestaque}>R$ {this.getValorFormatado()}</Text>
          <View searchBar style={{marginTop: 5, flexDirection: 'row'}}>
            <Button
                onPress={(valor) => {this.addValor("1")}}
                accessibilityLabel="Um"
                style={styles.botaoCalculadora}
            >
              <Text style={styles.botaoCalculadoraLetra}>1</Text>
            </Button>
            <Button
                onPress={(valor) => {this.addValor("2")}}
                accessibilityLabel="Dois"
                style={styles.botaoCalculadora}
            >
              <Text style={styles.botaoCalculadoraLetra}>2</Text>
            </Button>
            <Button
                onPress={(valor) => {this.addValor("3")}}
                accessibilityLabel="Três"
                style={styles.botaoCalculadora}
            >
              <Text style={styles.botaoCalculadoraLetra}>3</Text>
            </Button>
          </View>
          <View searchBar style={{flexDirection: 'row'}}>
            <Button block info
                onPress={(valor) => {this.addValor("4")}}
                accessibilityLabel="Quatro"
                style={styles.botaoCalculadora}
            >
              <Text style={styles.botaoCalculadoraLetra}>4</Text>
            </Button>
            <Button block info
                onPress={(valor) => {this.addValor("5")}}
                accessibilityLabel="Cinco"
                style={styles.botaoCalculadora}
            >
              <Text style={styles.botaoCalculadoraLetra}>5</Text>
            </Button>
            <Button block info
                onPress={(valor) => {this.addValor("6")}}
                accessibilityLabel="Seis"
                style={styles.botaoCalculadora}
            >
              <Text style={styles.botaoCalculadoraLetra}>6</Text>
            </Button>
          </View>
          <View searchBar style={{flexDirection: 'row'}}>
            <Button block info
                onPress={(valor) => {this.addValor("7")}}
                accessibilityLabel="Sete"
                style={styles.botaoCalculadora}
            >
              <Text style={styles.botaoCalculadoraLetra}>7</Text>
            </Button>
            <Button block info
                onPress={(valor) => {this.addValor("8")}}
                accessibilityLabel="Oito"
                style={styles.botaoCalculadora}
            >
              <Text style={styles.botaoCalculadoraLetra}>8</Text>
            </Button>
            <Button block info
                onPress={(valor) => {this.addValor("9")}}
                accessibilityLabel="Nove"
                style={styles.botaoCalculadora}
            >
              <Text style={styles.botaoCalculadoraLetra}>9</Text>
            </Button>
          </View>
          <View searchBar style={{flexDirection: 'row'}}>
            <Button block info
                onPress={(valor) => {this.addValor(".")}}
                accessibilityLabel="Centavos"
                style={styles.botaoCalculadora}
            >
              <Text style={styles.botaoCalculadoraLetra}>,</Text>
            </Button>
            <Button block info
                onPress={(valor) => {this.addValor("0")}}
                accessibilityLabel="Zero"
                style={styles.botaoCalculadora}
            >
              <Text style={styles.botaoCalculadoraLetra}>0</Text>
            </Button>
            <Button block info
                onPress={(valor) => {this.apagaValor()}}
                accessibilityLabel="Apagar"
                style={styles.botaoCalculadora}
            >
              <Icon name='trash' style={{fontSize: 45}}/>
            </Button>
          </View>
          {this.state.isTipoVendaCartao ?
            <View style={{flex: 1, flexDirection: 'row', alignItems: "center",  alignContent: 'center', marginBottom: 10}}>
              <Button bordered style={styles.botaoMetadeTela}
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

                <Text style={{fontWeight: "bold"}}>{this.getBandeiraCartaoTexto(this.state.bandeiraCartao)}</Text>
              </Button>
              <Image style={styles.imagemMetadeTela} source={this.getBandeiraCartaoImagem(this.state.bandeiraCartao)}/>
          </View>
          : null}


        </Content>

        <Button style={{marginBottom: 10, marginRight: 5, marginLeft: 5}} full rounded primary onPress={() => this.proximoPasso()}>
            <Text>Próximo</Text>
        </Button>

      </Container>
    );
  }
}

export default CaixaOutroValor;

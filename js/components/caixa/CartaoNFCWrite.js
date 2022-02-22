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
  CardItem,
  Form, 
  Item,
  Label,
  Input
} from "native-base";
import { Image, View, TouchableHighlight,AppRegistry,DeviceEventEmitter, Alert, Modal } from "react-native";
import styles from "./styles";
import date from "../util/date.js";
import { getTagId, readTag, writeTag } from 'nfc-ndef-react-native';
import LZString from "../util/lz-string.js";
import {getValorEmReal} from "../util/moeda.js";

const subscription = null;
const subscriptionError = null;

class CartaoNFCWrite extends Component {


  constructor(props){
    super(props);
    //var cartao = {id:123456, cpf: "90511549172", saldo:550.50, nome: "André von Glehn", terminal:345, timestamp: 1511795635760, ultimaTransacao: "Débito R$ 20.00 de cerveja premium" };
    this.state = {
      isCartaoCarregado: false,
      estadoBotaoNome : "Aproxime seu cartão NFC",
      cartaoLocal : this.props.cartao,
      isCartaoNovo: false,
      modalVisible: false};

      console.log("ENTROU EM ESCRITA!!!");
  }

  openModal() {
    this.setState({modalVisible:true});
    this.adicionaListener();
  }


  closeModal() {
    this.removeListener();
    this.setState({modalVisible:false});
   }


  writeTagData() {
    var data = new Date();
    var cartaoEscrita = {};
    cartaoEscrita.id = this.props.cartao.id;
    cartaoEscrita.cpf = this.props.cartao.cpf;
    cartaoEscrita.saldo = this.props.cartao.saldo;
    var json = JSON.stringify(cartaoEscrita);
    //console.log("******* GRANVANDO A TAG *******")
    //console.log(json);
    var compressed = LZString.compressToBase64(json);
    //console.log("******* Arquivo compressed *******");
    //console.log(compressed);
    //console.log("######## Tamanho antes de compactar: " + json.length);
    //console.log("######## Tamanho depois de compactar: " + compressed.length);
    //console.log("******* Arquivo compressed *******");
    writeTag(compressed); // Write these strings to individual NDEF records.
  }

  removeListener(){
      //console.log("******* Desativando o NFC *******");
      subscription.remove();
      subscriptionError.remove();
      //console.log("******* Removido o NFC *******");
  }


  adicionaListener() {

  subscription = DeviceEventEmitter.addListener('onTagWrite', (e) => {
       //console.log('*** cartão escrito:', e);
       this.closeModal();
       this.props.action();
   });

  subscriptionError = DeviceEventEmitter.addListener('onTagError', (e) => {
       console.log('***ERRO!!! Não escrito escrito:', e);
       Alert.alert('Ocorreu um erro ao gravar seu cartão', e);
       this.closeModal();
   });

  }

  render() {
    return (
        <Content padder>
              <Modal 
                     transparent={false}
                     visible={this.state.modalVisible}
                     animationType={'slide'}
                     onShow={() => this.writeTagData()}
                     onRequestClose={() => this.closeModal()}
                 >
                   <View style={styles.modalContainer}>
                     <View>
                       <Text style={styles.textDestaqueBranco}>Aproxime seu dispositivo NFC</Text>
                     </View>
                     <View>
                       <Image source={require("../../../img/nfc_logo_branco.png")} style={styles.logo}/>
                     </View>
                     <View>
                     </View>
                   </View>
                   <View>
                     <Button full bordered onPress={() => this.closeModal()} style={{backgroundColor: 'white'}}>
                        <Text style={{color: "black", fontWeight:"bold"}}>CANCELAR</Text>
                     </Button>
                   </View>
              </Modal>
              <View>
               <View style={styles.containerAlinhadoCentro}>
                <TouchableHighlight onPress={() => this.openModal()}>
                   <Image source={require("../../../img/nfc.png")}/>
                </TouchableHighlight>
                <Text>Clique na imagem para carregar</Text>
               </View>
              </View>
        </Content>
    );
  }44
}

export default CartaoNFCWrite;

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
import { getTagId, readTag, writeTag } from 'nfc-ndef-react-native';
import LZString from "../util/lz-string.js";
import {getValorEmReal} from "../util/moeda.js";
import constantes from "../util/constantes.js";

let registrado = false;
const subscription = null;

class CartaoNFCRead extends Component {


  constructor(props){
    super(props);
    this.state = {
      isCartaoCarregado: false,
      estadoBotaoNome : "Aproxime seu cartão NFC",
      cartaoLocal : this.props.cartao,
      isCartaoNovo: false,
      modalVisible: false};
    }

  isBloqueado(cartao){
    fetch(constantes.getAmbiente() + "/api/cartao/"+cartao.id+"/status")
    .then((responseData) => {
        if(responseData == 404){
          cartao.bloqueado = true;
        }else{
          responseData == 1?  cartao.bloqueado = true : cartao.bloqueado = false;
        };
        this.setState({cartaoLocal: cartao});
    }).catch(function (err) {
      alert("Houve um erro ao sincronizar o cartao");
      console.log(err);
      //Sem comunicação é bloqueado
    }).done();
  }

  openModal() {
    this.setState({modalVisible:true});
  }


  closeModal() {
    this.removeListener();
    this.setState({modalVisible:false});
   }


  readTagId() {
    //console.log("******* Id do NFC *******");
    getTagId();
  }

  readTagData() {
    this.addListener();
    //console.log("******* Lendo a tag NFC "+ this.props.tela +" *******");
    readTag(); // Read all records in the NDEF Message on the tag.
  }

 removeListener(){
    if(subscription!=null){
      subscription.remove();
    }
 }

 addListener(){
     subscription = DeviceEventEmitter.addListener('onTagRead', (e) => {
       this.closeModal(); 
       this.state.processando = true;
       
       var cartaoLido = JSON.parse(e);
       
       var decompressed = LZString.decompressFromBase64(cartaoLido.conteudo);
       var cartao={id:null, nome:"", cpf: "", timestamp:"", saldo:0};
       var cartaoNovo  = false;
       //Informa o ID do cartão
       cartao.id = cartaoLido.id;
       //Valida o status do bloqueio

       if(cartaoLido.conteudo!=null && cartaoLido.conteudo != "null" && cartaoLido.conteudo != ""){
         var decompressed = LZString.decompressFromBase64(cartaoLido.conteudo);
       
         cartao = JSON.parse(decompressed);
         cartao.id = cartaoLido.id; //Remover quando houver mais espaço no cartao
         
         if(cartao!=null && cartao.saldo != null){
           this.setState({saldo: cartao.saldo});
           this.setState({cartaoLocal: cartao}); //Deve rodar antes da promise. TODO: Refatorar o codigo
           this.setState({isCartaoCarregado: true});
           this.isBloqueado(cartao);
           this.props.action(cartao, false, true);
         }
       }else if(cartao.id !=null){
         this.setState({cartaoLocal: cartao});  //Deve rodar antes da promise. TODO: Refatorar o codigo
         this.setState({isCartaoCarregado: false});
         this.setState({isCartaoNovo:true});
         this.props.action(cartao, true, false); 
       } 
  })
 }

  render() {

    let dados = null;
       if (this.state.isCartaoCarregado) {
          if(this.state.cartaoLocal.bloqueado){
            dados =
                   <View style={styles.logoCentral}>
                      <View></View>
                      <View><Text style={styles.titleHeaderAlerta}>BLOQUEADO</Text></View>
                      <View></View>
                   </View>
                   ;
          }else{
            dados =
                   <View>
                     <Form>
                             <Text style={styles.textBoldGrande}>R$ {getValorEmReal(this.state.saldo)}</Text>
                             <Item floatingLabel style={{marginTop: 10}}>
                               <Label style={{ marginTop: 10, color: "#767676"}}>Número do cartão</Label>
                               <Input value={this.state.cartaoLocal.id.toString()} editable = {false} />
                             </Item>
                             <Item floatingLabel style={{marginTop: 10}}>
                                   <Label style={{ marginTop: 10, color: "#767676"}}>CPF</Label>
                                   <Input value={this.state.cartaoLocal.cpf}  editable = {false} />
                              </Item>                  
                    </Form>
                   </View>
                   ;
          }
       }else if(this.state.isCartaoNovo){
         dados =
         <View>
           <Form>
              <Item floatingLabel style={{marginTop: 10}}>
                     <Label style={{ marginTop: 10, color: "#767676"}}>Número do cartão</Label>
                     <Input value={this.state.cartaoLocal.id.toString()} editable = {false} />
              </Item>
              <Text>Cartão sem cliente associado. Por favor, associe um cliente informando em "Cartões" um e-mail e CPF válido</Text>
           </Form>
         </View>
       }else{
         dados =
           <View>
               <View style={styles.containerAlinhadoCentro}>
                <TouchableHighlight onPress={() => this.openModal()}>
                   <Image source={require("../../../img/nfc.png")}/>
                </TouchableHighlight>
                <Text>Clique na imagem para carregar</Text>
               </View>
           </View>
         ;
       }

    return (
        <Content padder>
              <Modal 
                     transparent={false}
                     visible={this.state.modalVisible}
                     animationType={'slide'}
                     onShow={() => this.readTagData()}
                     onDismiss={() => this.closeModal()}
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
              
                {dados}
              
        </Content>
    );
  }
}

export default CartaoNFCRead;

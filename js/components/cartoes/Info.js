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
  Form,
  Item,
  Input,
  Label,
  Left,
  Right
} from "native-base";
import { Image, View, TouchableHighlight,Keyboard } from "react-native";
import styles from "../caixa/styles";
import date from "../util/date.js";
import Rodape from "../caixa/Rodape";


class Info extends Component {


  constructor(props){
    super(props);
    this.state = {cartao: this.props.navigation.state.params.cartao, nome: "", cpf:"", email: "", telefone:""};
  }

  irParaSync(){
    Keyboard.dismiss();
    if(this.state.cpf==''){
      alert("CPF é obrigatório");
    }else if(this.state.nome==''){
      alert("Nome é obrigatório");
    }else {
      this.props.navigation.navigate("GravaCartao", { cartao: this.atualizaInfoCartao(this.state.cartao) });
    }

  }

  //Cria ou atualiza as informações básicas do cartão
  atualizaInfoCartao(cartao){
    cartao.cpf = this.state.cpf;
    cartao.nome = this.state.nome;
    cartao.telefone = this.state.telefone;
    cartao.email = this.state.email;
    if(cartao.saldo == null) cartao.saldo = 0;
    if(cartao.timestamp == null) cartao.timestamp = date.yyyymmdd(new Date());
    return cartao;
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
          <Body style={{alignContent: "center"}}>
            <Title style={styles.titleHeader}>Informações</Title>
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
              <View>
                <Form>
                 <Item floatingLabel style={{marginTop: 20}}>
                   <Label style={{ marginTop: 10, color: "#767676"}}>Nome</Label>
                   <Input keyboardType="default" onChangeText={(nome) => this.setState({nome})}  value={this.state.nome}/>
                 </Item>
                 <Item floatingLabel style={{marginTop: 20}}>
                  <Label style={{ marginTop: 10, color: "#767676"}}>CPF</Label>
                  <Input keyboardType="numeric" onChangeText={(cpf) => this.setState({cpf})} value={this.state.cpf}/>
                 </Item>
                 <Item floatingLabel style={{marginTop: 20}}>
                   <Label style={{ marginTop: 10, color: "#767676"}}>Telefone</Label>
                   <Input keyboardType="phone-pad" onChangeText={(telefone) => this.setState({telefone})} value={this.state.telefone}/>
                 </Item>
                 <Item floatingLabel style={{marginTop: 20}}>
                  <Label style={{ marginTop: 10, color: "#767676"}}>E-mail</Label>
                  <Input keyboardType="email-address" onChangeText={(email) => this.setState({email})} value={this.state.email}/>
                 </Item>
               </Form>
              </View>
        </Content>

        <Button style={{marginBottom: 10, marginRight: 5, marginLeft: 5}} full rounded primary onPress={() => this.irParaSync()}>
           <Text>Próximo</Text>
        </Button>
      </Container>
    );
  }
}

export default Info;

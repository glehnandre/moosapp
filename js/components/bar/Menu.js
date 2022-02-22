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
  List,
  ListItem,
  Thumbnail
} from "native-base";
import { Image, View, TouchableHighlight, ListView, Alert, ToastAndroid } from "react-native";
import styles from "../caixa/styles";
import date from "../util/date.js";
import {getValorEmReal} from "../util/moeda.js";
import Rodape from "../caixa/Rodape";
import dataBase from "../database/DataBase";


const MENU = [];

export

class Menu extends Component {


  constructor(props){
    super(props);
    this.getMenu();
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      basic: true,
      listViewData: MENU,
      cartao: this.props.navigation.state.params.cartao,
      totalPedido: 0,
      totalItensPedido: 0,
      pedido: []
    };
  }



   
   async getMenu() {
      let db = new dataBase.criarDataBaseMenu();
      try {
          var dbinfo = await db.info();
          if (dbinfo.doc_count > 0){
              var result = await db.get('menu',{
                include_docs: true,
                attachments: true,
                latest: true,
              });
              console.log("##### CARREGANDO O MENU DO EVENTO #####");
              console.log(result.data);
              this.setState({
                listViewData: result.data
              });
          }else{
              Alert.alert('Erro', 'Atualize o MENU na aba ADMINISTRAÇÃO do equipamento');
          } 
      } catch (err) {
        console.log(err);
      }
  }

  proximoPasso(){
    if(this.state.totalItensPedido > 0){
      if(this.state.totalPedido > this.state.cartao.saldo){
        var msg = "Saldo insuficiente! Faltam R$ " + getValorEmReal(this.state.totalPedido - this.state.cartao.saldo);
        ToastAndroid.showWithGravity(
            msg,
            ToastAndroid.LONG,
            ToastAndroid.CENTER
        );
      }else {
        var cartaoAjustado = this.state.cartao;
        cartaoAjustado.saldo =  cartaoAjustado.saldo - this.state.totalPedido;
        this.props.navigation.navigate("Debito",{ transacao: {cartao: cartaoAjustado ,pedido: this.state.pedido, valorDebito:  this.state.totalPedido}});
      }
    }else{
      ToastAndroid.showWithGravity(
            'Selecione um ou mais produtos.',
            ToastAndroid.LONG,
            ToastAndroid.CENTER
      );
    }
  }

  deleteProduto(menu) {
    var novoPedido = this.state.pedido;
    var item = novoPedido.filter(item => (item.menu_id === menu.id));
    if(item.length > 0){
      objIndex = novoPedido.findIndex((item => item.menu_id == menu.id));
      var novaQuantidade = novoPedido[objIndex].quantidade - 1;
      if(novaQuantidade == 0){
        novoPedido.splice(objIndex, 1);
      }else{
        novoPedido[objIndex].quantidade =novaQuantidade;
      }
      this.setState({totalItensPedido: this.state.totalItensPedido - 1});
      this.setState({totalPedido: this.state.totalPedido - menu.valor});
      this.setState({pedido: novoPedido});
    }else{
      ToastAndroid.showWithGravity(
            'Ainda não há produtos no seu carrinho de compras.',
            ToastAndroid.LONG,
            ToastAndroid.CENTER
      );
    }
  }

  getCategorias(){
    var itensDeMenu = this.state.listViewData;
    var categorias = [];
    for (var i in itensDeMenu) {
      categorias.indexOf(itensDeMenu[i].categoria) === -1 ? categorias.push(itensDeMenu[i].categoria) : console.log("This item already exists");
    }
    return categorias;
  }

  addProduto(menu){
    var novoPedido = this.state.pedido;
    var item = novoPedido.filter(item => (item.menu_id === menu.id));
    if(item.length > 0){
      objIndex = novoPedido.findIndex((item => item.menu_id == menu.id));
      novoPedido[objIndex].quantidade = novoPedido[objIndex].quantidade + 1;
      novoPedido[objIndex].valor = novoPedido[objIndex].valor + menu.valor;
    }else{
      var novoItem = {'menu_id': menu.id, 'quantidade': 1, 'valor': menu.valor, 'descricao': menu.nome};
      novoPedido.push(novoItem);
    }
    console.log(novoPedido);
    this.setState({totalItensPedido: this.state.totalItensPedido + 1});
    this.setState({totalPedido: this.state.totalPedido + menu.valor});
    this.setState({pedido: novoPedido});
  }

  getQuantidadeCarrinho(id){
    var pedido = this.state.pedido;
    var item = pedido.filter(item => (item.menu_id === id));
    if(item.length > 0){
      return item[0].quantidade;
    }else return 0;
  }

  getUri(menu){
    return 'data:image/'+menu.imagemType+';base64,'+menu.imagem;
  }


  render() {
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    return (
      <Container style={styles.container}>
        <Header style={styles.containerHeader}>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title style={styles.titleHeader}>Carrinho</Title>
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
          <List
            enableEmptySections={true}
            dataSource={this.ds.cloneWithRows(this.state.listViewData)}
            renderRow={menu =>
              <ListItem>
               <Thumbnail square size={80} source={{uri: this.getUri(menu)}} />
               <Body>
                 <Text style={styles.texto}>{menu.nome} </Text>
                 <Text note>Unidade R$ {menu.valor}</Text>
               </Body>
               <Right>
                <Badge info style={styles.mb}>
                   <Text>
                   {this.getQuantidadeCarrinho(menu.id)}
                   </Text>
                </Badge>
               </Right>
              </ListItem>}
            renderLeftHiddenRow={(menu) =>
              <Button full danger onPress={() => this.deleteProduto(menu)}>
                <Icon active name="remove" style={{fontSize: 50, color: 'white'}}/>
              </Button>
              }
            renderRightHiddenRow={(menu) =>
              <Button success onPress={() => this.addProduto(menu)}>
                <Icon active name="add" style={{fontSize: 50, color: 'white'}} />
              </Button>}
            leftOpenValue={75}
            rightOpenValue={-75}
          />
        </Content>
        {(this.state.totalPedido > this.state.cartao.saldo)?
            <Button style={{marginBottom: 10, marginRight: 5, marginLeft: 5}} full rounded danger onPress={() => this.proximoPasso()}>
              <Text>Faltam R$ {getValorEmReal(this.state.totalPedido - this.state.cartao.saldo)}</Text>
            </Button>
        :
            <Button style={{marginBottom: 10, marginRight: 5, marginLeft: 5}} full rounded primary onPress={() => this.proximoPasso()}>
                <Text>Pagar R$ {getValorEmReal(this.state.totalPedido)}</Text>
            </Button>
        }
        
        
      </Container>
    );
  }
}

export default Menu;

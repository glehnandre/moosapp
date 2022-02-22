import React, { Component } from "react";

import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Icon,
  Text,
  Left,
  Body,
  Right,
  List,
  ListItem,
  Card,
  CardItem,
  Badge,
  View
} from "native-base";

import {Alert,ToastAndroid} from "react-native";

import dataBase from "../database/DataBase";
import Accordion from 'react-native-collapsible/Accordion';
import Collapsible from 'react-native-collapsible';
import date from "../util/date.js";
import {getValorEmReal} from "../util/moeda.js";
import styles from "../caixa/styles";
import constantes from "../util/constantes.js";


class TabBar extends Component {

  constructor(props){
    super(props);

    this.state = {
      creditosCartao: [],
    }

  }

  async syncServidor(){
    console.log('##### SYNC DEBITOS SERVIDOR #####');
    var debitos = await this.getDebitosCartao();
    if (debitos !== undefined){
          debitos.forEach(async debito => {
            await this.setDebito(debito);
          });
          //ToastAndroid.show('Registros de bar atualizados com sucesso.', ToastAndroid.SHORT);
    }
  }

  async getDebitosCartao(){
    let db = new dataBase.criarDataBaseBar();
    var agora = date.yyyymmdd(new Date());
    try {
      var dbinfo = await db.info();
      if(dbinfo.doc_count > 0){
        var result = await db.find({
                selector: {_id: {$gte: null}, sync:{$eq: false}},
                sort: ['_id'],
        });
        return  result.docs;
      }
    } catch (err) {
      console.log(err);
    }
  }

  async updateRecord(id){
        var data = new Date();
        let db = new dataBase.criarDataBaseBar();
        try {
          var doc = await db.get(id);
          doc.sync = true;
          var response = await db.put(doc);
          console.log("Dados atualizados:");
          console.log(response);
          //ToastAndroid.show('Registro atualizado com sucesso.', ToastAndroid.SHORT);
        } catch (err) {
          console.log(err);
        }
  }


  async setDebito(section) {
      var pedidos = JSON.stringify({
            cpf: section.cpf,
            cartao: section.cartao,
            tipo_transacao: 'debito',
            saldo: section.saldo,
            valor: section.debito,
            terminal_id: section.terminal,
            latitude: section.latitude,
            longitude: section.longitude,
            transacao_id: section._id,
            evento_id: section.evento,
            data_transacao: section.timestamp,
            pedido: section.pedido
          });
      console.log("Sync...");
      console.log(pedidos); 
      try {
        let response = await fetch(
          constantes.getAmbiente() + '/api/transacao'
        , {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: pedidos,
        });
        console.log("Request...");
        console.log(response);
        if(response.ok){
          this.updateRecord(section._id);
        }else{
          Alert.alert(
            'Problema de conexão',
            'Houve um erro na sincronização dos dados do bar. Erro: ' +  response.status,
            [
              {text: 'OK', onPress: () => console.log('OK Pressed'), color: 'blue'},
            ],
            { cancelable: false }
          );
        }
      } catch (error) {
        console.error(error);
      }
  }

  async getDebitosCartaoAparelho(){
    let db = new dataBase.criarDataBaseBar();
    var agora = date.yyyymmdd(new Date());
    try {
      var dbinfo = await db.info();
      if(dbinfo.doc_count > 0){
        var result = await db.find({
          selector: {_id: {$gte: null}},
          sort: ['_id'],
        });
        console.log("##### INICIO RELATORIO VENDAS #####");
        console.log(result);
        console.log("##### FIM RELATORIO VENDAS #####");
        this.setState({
          creditosCartao: result.docs, totalVendasEmReais: this.getValorDebitos(result.docs), totalVendas: result.docs.length
        });
      } else this.setState({totalVendas: 0, totalVendasEmReais: 0});
    } catch (err) {
      console.log(err);
    }
  }

  getValorDebitos(creditos){
    var totalVendasEmReais = 0;
    for (var i in creditos) {
      totalVendasEmReais = totalVendasEmReais + creditos[i].debito;
    }
    return totalVendasEmReais;
  }
  // eslint-disable-line

  _renderHeader(section) {
   return (
          <Card>
            <CardItem>
              <Text style={{fontSize: 13}}>{section.cartao} - {section.timestamp}</Text>
              {section.sync?
                  <Right>
                    <Icon name="done-all" style={{fontSize: 35, color: 'green'}}/>
                  </Right>
                  : 
                  <Right>
                    <Icon name="checkmark" style={{fontSize: 35, color: 'blue'}}/>
                  </Right>
              }
             </CardItem>
          </Card>
   );
 }

 _renderContent(section) {

   return (
     <Card>
       <CardItem style={{backgroundColor: "#DBDBDB"}}>
          <Body>
           <Text style={styles.textBold}>Venda de R$ {getValorEmReal(section.debito)}</Text>
           <Text>Produtos:</Text>
          <View>
                     {
                         section.pedido.map((pedido) => {
                             return (
                               <View key={Math.random()} style={{flex: 0, flexDirection: 'row'}}>
                                 <Text key={Math.random()}>     </Text>
                                 <Text key={Math.random()}style={styles.textBold}>#{pedido.quantidade} </Text>
                                 <Text key={Math.random()}>{pedido.descricao}</Text>
                                 <Text key={Math.random()}> R$ {getValorEmReal(pedido.valor)}</Text>
                               </View>
                             );
                         })
                     }
           </View>
           <Text>CPF: {section.cpf}</Text>
           <Text>Cartão: {section.cartao}</Text>
           <Text>Saldo: R$ {getValorEmReal(section.saldo)}</Text>
           <Text>Hora:  {section.timestamp}</Text>
           <Text>Terminal de venda: {section.terminal}</Text>
           <Text>Latitude/Longitude: {section.latitude}/{section.longitude}</Text>
           <Text style={styles.textPequeno}>Id da transação: {section.id}</Text>
          </Body>
       </CardItem>
     </Card>
   );
 }

  render() {
    // eslint-disable-line

    return (
      <Content padder style={{ marginTop: 0 }}>
        <View style={{flex: 0, flexDirection: 'row', alignItems: "center",  alignContent: 'center'}}>
          <Badge style={{ backgroundColor: "green" }}>
            <Text>{this.state.totalVendas}</Text>
          </Badge>
          <Text style={styles.textTitulo}>Total de vendas: R$ {getValorEmReal(this.state.totalVendasEmReais)}</Text>
          <Button iconLeft transparent primary onPress={() => this.getDebitosCartaoAparelho()}>
            <Icon name='ios-sync' style={{fontSize: 25, fontWeight: 'bold'}}/>
          </Button>
        </View>
        <List>
        <Accordion
              sections={this.state.creditosCartao}
              renderHeader={this._renderHeader}
              renderContent={this._renderContent}
        />
        </List>
      </Content>
    );
  }
}

export default TabBar;

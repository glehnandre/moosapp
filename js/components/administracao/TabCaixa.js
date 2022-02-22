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

class TabCaixa extends Component {

  constructor(props){
    super(props);

    this.state = {
      creditosCartao: []
    }

  }


  async syncServidor(){
    console.log('##### SYNC CREDITOS SERVIDOR #####');
    var creditos = await this.getCartoes();
    if (creditos !== undefined){
          creditos.forEach(async credito => {
            await this.setCredito(credito);
          });
          //ToastAndroid.show('Registros de caixa atualizados com sucesso.', ToastAndroid.SHORT);
    }
  }

  async getCreditosAparelho(){
            let db = new dataBase.criarDataBaseCaixa();
            var agora = date.yyyymmddTempo(new Date());
            try {
                var dbinfo = await db.info();
                if (dbinfo.doc_count > 0){
                      var result = await db.find({
                        selector: {_id: {$gte: null}},
                        sort: ['_id'],
                      });
                      console.log(result.docs);
                      this.setState({
                        creditosCartao: result.docs, totalVendasEmReais: this.getValorCreditos(result.docs), totalVendas: result.docs.length
                      });
                }
            } catch (err) {
              console.log(err);
            }  
  }

  async getCartoes(){
    let db = new dataBase.criarDataBaseCaixa();
    var agora = date.yyyymmddTempo(new Date());
    try {
        var dbinfo = await db.info();
        console.log(dbinfo.doc_count);
        if (dbinfo.doc_count > 0){
              var resultNaoProcessado = await db.find({
                selector: {_id: {$gte: null}, sync:{$eq: false}},
                sort: ['_id'],
              });
              return resultNaoProcessado.docs;
        }
    } catch (err) {
      console.log(err);
    }
  }



  getValorCreditos(creditos){
    var totalVendasEmReais = 0;
    for (var i in creditos) {
      totalVendasEmReais = totalVendasEmReais + creditos[i].credito;
    }
    return totalVendasEmReais;
  }

  async updateRecord(id){
        var data = new Date();
        let db = new dataBase.criarDataBaseCaixa();
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


  async setCredito(section) {
      try {
        console.log("Sync...");
        let response = await fetch(
          constantes.getAmbiente() + '/api/transacao'
        , {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            cpf: section.cpf,
            cartao: section.cartao,
            transacao: section.transacao,
            tipo_transacao: "credito",
            bandeira: section.bandeira,
            saldo: section.saldo,
            valor: section.credito,
            terminal_id: section.terminal,
            latitude: section.latitude,
            longitude: section.longitude,
            transacao_id: section._id,
            data_transacao: section.timestamp,
            evento_id: section.evento
          }),
        });
        console.log("Request...");
        console.log(response);
        console.log("$$$$$$$$$$$$");
        if(response.ok){
          this.updateRecord(section._id);
        }else{
          Alert.alert(
            'Problema de conexão',
            'Houve um erro na sincronização dos dados do caixa. Erro: ' +  response.status,
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
           <Text style={styles.textBold}>Credito de R$ {getValorEmReal(section.credito)}</Text>
           <Text>CPF: {section.cpf}</Text>
           <Text>Cartão: {section.cartao}</Text>
           <Text>Saldo: R$ {getValorEmReal(section.saldo)}</Text>
           <Text>Hora:  {section.timestamp}</Text>
           <Text>Terminal: {section.terminal}</Text>
           {section.bandeira == null ? <Text>Pagamento em dinheiro</Text> : <Text>Bandeira: {section.bandeira}</Text>}
           <Text>Latitude/Longitude: {section.latitude}/{section.longitude}</Text>
           <Text style={styles.textPequeno}>Id da transação: {section._id}</Text>
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
          <Text style={styles.textTitulo}>Total de vendas: R$ {getValorEmReal(this.state.totalVendasEmReais)}</Text>
          <Button iconLeft transparent primary onPress={() => this.getCreditosAparelho()}>
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

export default TabCaixa;

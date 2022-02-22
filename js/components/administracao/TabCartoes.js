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

import {Alert,ToastAndroid, SectionList, FlatList,TouchableHighlight, Modal} from "react-native";

import dataBase from "../database/DataBase";
import Accordion from 'react-native-collapsible/Accordion';
import Collapsible from 'react-native-collapsible';
import date from "../util/date.js";
import {getValorEmReal} from "../util/moeda.js";
import styles from "../caixa/styles";
import constantes from "../util/constantes.js";

var options = {limit : 1};

class TabCartoes extends Component {

  constructor(props){
    super(props);

    this.state = {
      cartoes: [],
      lista: [],
      modalVisible: false
    }

  }

  async getCartoes(){
    let db = new dataBase.criarDataBaseCartoes();
    try {
      var dbinfo = await db.info();
      if(dbinfo.doc_count > 0){
        var result = await db.find({
                selector: {sync:{$eq: false}},
        });
        console.log(result);
        return result.docs;
      }
    } catch (err) {
      console.log(err);
    }
  }

  async updateRecord(id){
        var data = new Date();
        let db = new dataBase.criarDataBaseCartoes();
        try {
          var doc = await db.get(id);
          console.log("Atualizando registros de cartões após a sincronização...");
          console.log(doc);
          doc.sync = true;
          var response = await db.put(doc);
          console.log(response);
          console.log("Dados atualizados...");
          //ToastAndroid.show('Registro atualizado com sucesso.', ToastAndroid.SHORT);
        } catch (err) {
          console.log(err);
        }
    }

  async syncServidor(){
    console.log('##### SYNC CARTOES SERVIDOR #####');
    var cartoes = await this.getCartoes();
    if (cartoes !== undefined){
          console.log('**CARTOES**');
          console.log(cartoes);
          console.log('**FIM CARTOES**');
          cartoes.forEach(async cartao => {
            await this.setCartao(cartao);
          });
          //ToastAndroid.show('Registros de cartão atualizados com sucesso.', ToastAndroid.SHORT);
    }
  }

  async setCartao(section) {
      try {
        let response = await fetch(
          constantes.getAmbiente()  + '/api/cartao'
        , {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            cpf: section.cpf,
            nome: section.nome,
            cartao_id: section.cartao_id,
            timestamp: section.timestamp,
            evento_id: section.evento,
            email: section.email,
            telefone: section.telefone,
            terminal:section.terminal,
            latitude: section.latitude,
            longitude: section.longitude,
          }),
        });
        console.log('Resposta da sincronia do cartao;');
        console.log(response);
        if(response.ok){
          this.updateRecord(section._id);
        }else{
          /*Alert.alert(
            'Problema de conexão',
            'Houve um erro na sincronização dos cartões. Erro: ' +  response.status,
            [
              {text: 'OK', onPress: () => console.log('OK Pressed'), color: 'blue'},
            ],
            { cancelable: false }
          );*/
        }
      } catch (error) {
        console.error(error);
      }
    }

  fetchNextPage() {
      let db = new dataBase.criarDataBaseCartoes();
      var that = this;
      db.allDocs(options).then(function (result) {
          if (result && result.rows.length > 0) {
              options.startkey = result.rows[result.rows.length - 1].id;
              options.skip = 1;
          }
          console.log("Resultado paginado:");
          console.log(result.rows);
          console.log("Lista em memória:");
          console.log(that.state.lista);
          var listaAtualizada = that.state.lista.concat(result.rows);
          console.log("Lista em concatenada:");
          console.log(listaAtualizada);
          that.setState({lista: listaAtualizada});
          return result.rows;
      }).catch(function (err) {
        console.log(err);
      });
  }

  _renderItem = ({item}) => (
        
          <Card>
            <CardItem>
              <Text style={{fontSize: 13}}>{item.doc.cartao_id} - {item.doc.timestamp}</Text>
              {item.doc.sync?
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

  render() {


    return (
      <Content padder style={{ marginTop: 0 }}>
        <View style={{flex: 0, flexDirection: 'row', alignItems: "center",  alignContent: 'center'}}>
          <Text style={styles.textTitulo}>Total de cartoes: {this.state.totalCartoes}</Text>
          <Button iconLeft transparent primary onPress={() => this.fetchNextPage()}>
            <Icon name='ios-sync' style={{fontSize: 25, fontWeight: 'bold'}}/>
          </Button>
        </View>

         <FlatList
          data={this.state.lista}
          renderItem={this._renderItem}
        />
      </Content>
    );
  }
}

export default TabCartoes;

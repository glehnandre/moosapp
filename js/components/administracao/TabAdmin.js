import React, { Component } from "react";

import { Container, Content, Card, CardItem, Text, Body, Button } from "native-base";

import { Alert, ToastAndroid } from "react-native";

import dataBase from "../database/DataBase";

import TabCaixa from "./TabCaixa";
import TabCartoes from "./TabCartoes";
import TabBar from "./TabBar";
import constantes from "../util/constantes.js";
import DeviceInfo from 'react-native-device-info';

export default class TabAdmin extends Component {
  // eslint-disable-line
  constructor(props){
    super(props);

    this.state = {
      config: null
    };
  }

  componentDidMount(){
    
  }


  deleteDatabaseCaixa(){
    let db = new dataBase.criarDataBaseCaixa();
    this.promptAlerta(db);
  }

  deleteDatabaseBar(){
    let db = new dataBase.criarDataBaseBar();
    this.promptAlerta(db);
  }

  deleteDatabaseCartoes(){
    let db = new dataBase.criarDataBaseCartoes();
    this.promptAlerta(db);
  }

  deleteDatabaseMenu(){
    let db = new dataBase.criarDataBaseMenu();
    this.promptAlerta(db);
  }

  deleteDatabase(db){
      db.destroy().then(function (response) {
        console.log("limpando a base a cada salvamento para testes....");
        console.log(response);
        alert("Base de dados limpa.");
      }).catch(function (err) {
        console.log(err);
      });
  }

  promptAlerta(db){
    Alert.alert(
      'Alerta',
      'Você deseja limpar a base de dados?',
      [
        {text: 'Sim', onPress: () => this.deleteDatabase(db)},
        {text: 'Não', onPress: () => console.log('Remoção da base cancelada'), style: 'cancel'},
      ],
      { cancelable: false }
    )
  }


  syncCaixaGoogleSheets(){
      let db = new dataBase.criarDataBaseCaixa();
      db.allDocs({
        include_docs: true,
        attachments: true
      }).then(
        result => {
        const vendas = result.rows;
        console.log("##### INICIO RELATORIO #####");
        console.log(vendas);
        this.syncCaixaGoogleSheetsRegistros(vendas);
        console.log("###### FIM RELATORIO #######");
      }).catch(function (err) {
        console.log(err);
      });
    }

  syncCaixaGoogleSheetsRegistros(vendas) {
      for(var i in vendas){
        var formData  = new FormData();
        console.log("****variaveis***");
        console.log(vendas[i]);
        var venda = vendas[i].doc;
        console.log("****variaveis***");
        for(var name in venda) {
          formData.append(name, venda[name]);
        }
        this.syncGoogle(formData);
        alert("Registros sincronizados");
      }
  }

  //Sincroniza com o google
  syncGoogle(formData){
    fetch("https://script.google.com/macros/s/AKfycbzlQiewb14YV6HNVygN_0_kQcFIx85a0zQFS_UeVQiaeGa7vPs/exec", {method: "POST", redirect: 'follow', body: formData})
    .then((response) => response.json())
    .then((responseData) => {
        console.log("registro sincronizado: " + JSON.stringify(responseData.body));
    }).catch(function (err) {
      alert("Houve um erro ao sincronizar o registro com o google docs");
      console.log(err);
    }).done();
  }


  syncMenu(){
      let db = new dataBase.criarDataBaseConfiguracoes();
      db.get('config').then((doc) => {
            this.getMenu(doc.evento);
      })
      .catch(function (err) {
            console.log('Erro ao buscar a configuração');
            console.log(err);
            ToastAndroid.show('Configure o aparelho para a festa primeiro. Acesse CONFIG na área administrativa.', ToastAndroid.SHORT);
      });
  }


  getMenu(evento){
    fetch(constantes.getAmbiente() + "/api/evento/"+evento+"/terminal/"+DeviceInfo.getSerialNumber()+"/menu")
    .then((response) => response.json())
    .then((responseData) => {
        console.log("!!!Novo MENU!!!");
        console.log(responseData);
        this.salvaMenu(responseData);
    }).catch(function (err) {
      alert("Houve um erro ao sincronizar o menu.");
      console.log(err);
    }).done();
  }

  getStatusMenu(){
     fetch(constantes.getAmbiente() + "/api/terminal/"+DeviceInfo.getSerialNumber()+"/status_sync")
    .then((responseData) => {
        if(responseData == 404){
          console.log('Não há atualizações para o menu.');
        }else{
          if(responseData._bodyText == 'pendente'){
             this.syncMenu();
          }
        };
    }).catch(function (err) {
      alert("Houve um erro ao sincronizar o menu.");
      console.log(err);
    }).done();
  }

  async salvaMenu(menu){
        let db = new dataBase.criarDataBaseMenu();
        await db.get('menu')
              .then(function(doc){ 
                console.log("documento: ");
                console.log(doc);
                db.put({
                        _id: 'menu',
                        _rev: doc._rev,
                        data: menu
                });
                ToastAndroid.showWithGravity(
                    'Menu atualizado com sucesso.',
                    ToastAndroid.LONG,
                    ToastAndroid.BOTTOM
                );
              })
              .catch(function() { 
                var response = db.put({
                   _id: 'menu',
                   data: menu
                 });
                 console.log(response);
                 ToastAndroid.showWithGravity(
                    'Menu criado com sucesso.',
                    ToastAndroid.LONG,
                    ToastAndroid.BOTTOM
                );
              })

  }



  getQuantidadeRegistros(db){
    db.info().then(
      result => {
        const qtd = result.doc_count;
        this.setState({quantidadeRegistros: qtd});
      }
    ).catch(function (err) {
      console.log(err);
    });
  }

  forcarSincronizacaoCartoes(){
    new TabCartoes().syncServidor();
  }

  forcarSincronizacaoCaixa(){
    new TabCaixa().syncServidor();
  }

  forcarSincronizacaoBar(){
    new TabBar().syncServidor();
  }
  


  render() {
    // eslint-disable-line
    return (
      <Content padder style={{ marginTop: 0 }}>
        <Card style={{ flex: 0 }}>
          <CardItem>
            <Body>
              <Button style={{marginBottom: 10, marginRight: 5, marginLeft: 5}} full rounded warning onPress={() => this.syncMenu()}>
                 <Text>Sincronizar o MENU do bar</Text>
              </Button>
              <Button style={{marginBottom: 10, marginRight: 5, marginLeft: 5}} full rounded info onPress={() => alert("Em breve")}>
                 <Text>Sincronizar BAR com GDocs</Text>
              </Button>
              <Button style={{marginBottom: 10, marginRight: 5, marginLeft: 5}} full rounded info onPress={() => alert("Em breve")}>
                 <Text>Sincronizar CAIXA com GDocs</Text>
              </Button>
              <Button style={{marginBottom: 10, marginRight: 5, marginLeft: 5}} full rounded info onPress={() => alert("Em breve")}>
                 <Text>Sincronizar CARTOES com GDocs</Text>
              </Button>
              <Button style={{marginBottom: 10, marginRight: 5, marginLeft: 5}} full rounded success onPress={() => this.forcarSincronizacaoBar()}>
                 <Text>Forcar sincronização do BAR</Text>
              </Button>
              <Button style={{marginBottom: 10, marginRight: 5, marginLeft: 5}} full rounded success onPress={() => this.forcarSincronizacaoCaixa()}>
                 <Text>Forcar sincronização do CAIXA</Text>
              </Button>
              <Button style={{marginBottom: 10, marginRight: 5, marginLeft: 5}} full rounded success onPress={() => this.forcarSincronizacaoCartoes()}>
                 <Text>Forcar sincronização do CARTOES</Text>
              </Button>
              <Button style={{marginBottom: 10, marginRight: 5, marginLeft: 5}} full rounded danger onPress={() => this.deleteDatabaseBar()}>
                 <Text>Remover base de dados BAR</Text>
              </Button>
              <Button style={{marginBottom: 10, marginRight: 5, marginLeft: 5}} full rounded danger onPress={() => this.deleteDatabaseCaixa()}>
                 <Text>Remover base de dados CAIXA</Text>
              </Button>
              <Button style={{marginBottom: 10, marginRight: 5, marginLeft: 5}} full rounded danger onPress={() => this.deleteDatabaseCartoes()}>
                 <Text>Remover base de dados CARTOES</Text>
              </Button>
              <Button style={{marginBottom: 10, marginRight: 5, marginLeft: 5}} full rounded danger onPress={() => this.deleteDatabaseMenu()}>
                 <Text>Remover base de dados MENU</Text>
              </Button>
            </Body>
          </CardItem>
        </Card>
      </Content>
    );
  }
}

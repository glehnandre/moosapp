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
  Badge,
  View,
  Form,
  Item,
  Input,
  Label
} from "native-base";

import {Alert,ToastAndroid,Picker,Switch} from "react-native";

import dataBase from "../database/DataBase";
import date from "../util/date.js";
import styles from "../caixa/styles";
import constantes from "../util/constantes.js";
import DeviceInfo from 'react-native-device-info';


class TabConfiguracoes extends Component {

  constructor(props){
    super(props);

    const eventos= [];
    const usuarios= [];   

    this.state = {
      terminal: DeviceInfo.getSerialNumber(),
      eventos: eventos,
      evento: null,
      usuarios: usuarios,
      usuario: null,
      bloqueioAutomatico: false
    }

  }

  componentDidMount() {
    console.log('$$$ CARREGOU CONFIG $$$');
    this.getConfiguracao();
    this.getEventos();
    console.log('$$$ CARREGOU CONFIG $$$');
  }

  getEventos(){
    fetch(constantes.getAmbiente() + "/api/eventos")
    .then((response) => response.json())
    .then((responseData) => {
        console.log("!!!Eventos!!!");
        console.log(responseData);
        this.setState({eventos: responseData});
        return responseData;
    }).catch(function (err) {
      alert("Houve um erro ao recuperar os eventos.");
      console.log(err);
    }).done();
  }


  setEvento(event){
      this.setState({evento: event});
      this.setState({usuario: null});
      this.setState({usuarios: []});
      this.getUsuarios(event);

  }

  getUsuarios(evento){
    if(evento!=0){
          fetch(constantes.getAmbiente() + "/api/evento/" + evento + "/usuarios")
          .then((response) => response.json())
          .then((responseData) => {
              this.setState({usuarios: responseData});
              return responseData;
          }).catch(function (err) {
            ToastAndroid.show('Houve um erro ao recuperar os funcionarios do evento.', ToastAndroid.SHORT);
            console.log(err);
          }).done();
    }
  }

  getConfiguracao() {
      let db = new dataBase.criarDataBaseConfiguracoes();
      try {
          db.get('config').then((doc) => {
             console.log(doc);
             this.setState({evento: doc.evento, usuario: doc.usuario, bloqueioAutomatico: doc.bloqueioAutomatico});
             this.getUsuarios(doc.evento);
          }).catch(function (err) {
            console.log('erro ao buscar a configuração');
            console.log(err);
            ToastAndroid.show('Salve sua configuração.', ToastAndroid.SHORT);
          });
      } catch (err) {
        console.log(err);
      }
  }


  async salvaConfiguracao(){
        var data = new Date();
        let db = new dataBase.criarDataBaseConfiguracoes();
        var evento = this.state.evento;
        var usuario = this.state.usuario;
        var bloqueio = this.state.bloqueioAutomatico;  
        db.upsert('config', function (doc) {
          console.log(doc);
          doc.usuario = usuario;
          doc.evento = evento;
          doc.bloqueioAutomatico = bloqueio;
          return doc;
        }).then(function (res) {
          console.log("Configurações atualizadas: ");
          console.log(res);
         ToastAndroid.show('Atualizações na configuração salvas.', ToastAndroid.SHORT);
        }).catch(function (err) {
          console.log("Configurações com erro: " + err);
          ToastAndroid.show('Registro atualizado com sucesso.', ToastAndroid.SHORT);
        });
  }

  async setConfiguracao() {
      try {
        let response = await fetch(
          constantes.getAmbiente()  + '/api/terminal'
        , {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: this.state.usuario,
            evento_id: this.state.evento,
            terminal_id: this.state.terminal,
          }),
        });
        console.log("Request...");
        console.log(response);
        if(response.ok){
          this.salvaConfiguracao();
        }else{
          Alert.alert(
            'Problema de conexão',
            'Houve um erro na sincronização dos dados das configurações. Erro: ' +  response.status,
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


  render() {

    return (
      <Container style={styles.container}>
        <Content padder>
              <View>
                <Form>
                <Label style={{ marginTop: 10, color: "#767676"}}>Aparelho: {this.state.terminal}</Label>
                <View style={{flexDirection: 'row', marginTop:10}}>
                 <Label>Bloqueio automático de Terminal</Label>
                  <Switch
                    style={{marginLeft: 10}}
                    onValueChange={ (value) => this.setState({ bloqueioAutomatico: value }) }
                    value={ this.state.bloqueioAutomatico }
                    onTintColor="#19E243"
                  ></Switch>
                </View>
                <Picker
                  selectedValue={this.state.evento}
                  onValueChange={(event) =>  this.setEvento(event)}>
                  <Picker.Item label="Escolha um evento..." value="0" />
                    {   
                        this.state.eventos.map((evento) => {
                             return (
                               <Picker.Item key={evento.id} label={evento.nome} value={evento.id} />
                             );
                         })
                    }
                </Picker>
                <Picker
                  selectedValue={this.state.usuario}
                  onValueChange={(user) =>  this.setState({usuario: user})}>
                  <Picker.Item label="Escolha um usuário..." value="0" />
                    {   
                        this.state.usuarios.map((usuario) => {
                             return (
                               <Picker.Item key={usuario.id} label={usuario.nome} value={usuario.id} />
                             );
                         })
                    }
                </Picker>
               </Form>
              </View>
             
        </Content>
        <Button style={{marginBottom: 10, marginRight: 5, marginLeft: 5}} full rounded primary onPress={() => this.setConfiguracao()}>
                <Text>Salvar</Text>
        </Button>
        </Container>
    );
  }
}

export default TabConfiguracoes;

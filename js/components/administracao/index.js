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
  Tabs,
  Tab,
  TabHeading,
  ScrollableTab
} from "native-base";
import { Image, View, TouchableHighlight } from "react-native";
import styles from "../caixa/styles";
import date from "../util/date.js";
import TabAdmin from "./TabAdmin";
import TabGeolocalizacao from "./TabGeolocalizacao";
import TabCaixa from "./TabCaixa";
import TabBar from "./TabBar";
import TabCartoes from "./TabCartoes";
import TabConfiguracoes from "./TabConfiguracoes";
import Rodape from "../caixa/Rodape";


class Administracao extends Component {


  constructor(props){
    super(props);
    this.state = { };
    
  }

  checkBlock(){
    fetch("http://localhost:8000/api/terminal/d65fb8cc/status_sync")
    .then((response) => response.json())
    .then((responseData) => {
        console.log("###################CHECK BLOCK TERMINAL########################");
        console.log(responseData);
        if(responseData == 404){
          this.setState({ terminalBloqueado: true });
        }else{
          console.log()
          if(responseData == 1){
             this.setState({ terminalBloqueado: true });
          }else{
             this.setState({ terminalBloqueado: false });
          } 
        };
    }).catch(function (err) {
      alert("Houve um erro ao sincronizar o terminal");
    }).done();
  }


  render() {

    return (
      <Container style={styles.container}>
        <Header hasTabs style={styles.containerHeader}>
          <Body>
            <Title style={styles.titleHeader}>Administração</Title>
          </Body>
        </Header>
        <Tabs locked={true} tabBarUnderlineStyle={{backgroundColor: '#19E243'}} renderTabBar={() => <ScrollableTab />}>
          <Tab tabStyle={{backgroundColor: '#F4F4F4'}} textStyle={{color: '#878787'}} activeTextStyle={{ color: '#878787', fontWeight: "bold" }} activeTabStyle={{backgroundColor: '#D8D8D8'}}  heading="Ações">
            <TabAdmin />
          </Tab>
          <Tab tabStyle={{backgroundColor: '#F4F4F4'}} textStyle={{color: '#878787'}} activeTextStyle={{ color: '#878787', fontWeight: "bold" }} activeTabStyle={{backgroundColor: '#D8D8D8'}}  heading="Config">
            <TabConfiguracoes />
          </Tab>
          <Tab tabStyle={{backgroundColor: '#F4F4F4'}} textStyle={{color: '#878787'}} activeTextStyle={{ color: '#878787', fontWeight: "bold" }} activeTabStyle={{backgroundColor: '#D8D8D8'}}  heading="Bar">
            <TabBar />
          </Tab>
          <Tab tabStyle={{backgroundColor: '#F4F4F4'}} textStyle={{color: '#878787'}} activeTextStyle={{ color: '#878787', fontWeight: "bold" }} activeTextStyle={{ color: '#878787', fontWeight: "bold" }}activeTabStyle={{backgroundColor: '#D8D8D8'}}  heading="Caixa">
            <TabCaixa />
          </Tab>
          <Tab tabStyle={{backgroundColor: '#F4F4F4'}} textStyle={{color: '#878787'}} activeTextStyle={{ color: '#878787', fontWeight: "bold" }} activeTabStyle={{backgroundColor: '#D8D8D8'}}  heading="Cartões">
            <TabCartoes />
          </Tab>

          <Tab tabStyle={{backgroundColor: '#F4F4F4'}} textStyle={{color: '#878787'}} activeTextStyle={{ color: '#878787', fontWeight: "bold" }} activeTabStyle={{backgroundColor: '#D8D8D8'}}  heading="Geo">
            <TabGeolocalizacao />
          </Tab>
        </Tabs>


       
      </Container>
    );
  }
}

export default Administracao;

import React, { Component } from "react";
import {
  Footer,
  FooterTab,
  Icon,
  Button,
  Text
} from "native-base";
import { Image, View } from "react-native";
import styles from "./styles";
import { NavigationActions } from 'react-navigation';


class Rodape extends Component {



  constructor(props){
    super(props);
    this.state = {
       cartao: this.props.cartao,
       aba: this.props.aba,
       nav: this.props.navegacao
    };
  }


  reset = () => {
    console.log("reseta o stack de navegacao.");
    const { navigate } = this.state.nav;
    console.log(navigate);
    const resetAction = NavigationActions.reset({
      index: 1,
      actions: [
        NavigationActions.navigate({ routeName: this.props.aba })
      ],
      key: null
    });
    this.state.nav.dispatch(resetAction);
  }

  irParaAba(nome){
    this.reset();
    this.state.nav.navigate(nome); 
  }


  render() {
    return (
        <Footer>
          <FooterTab>
            <Button light disabled={this.props.aba == "Cartoes"} onPress={() => this.irParaAba("Cartoes")}>
              <Icon active={true} name="card" />
              <Text>Cartoes</Text>
            </Button>
            <Button light disabled={false} onPress={() => this.irParaAba("Caixa")}>
              <Icon active={true} name="keypad" />
              <Text>Caixa</Text>
            </Button>
            <Button light disabled={this.props.aba == "Bar"} onPress={() => this.irParaAba("Bar")}>
              <Icon active={false} name="beer" />
              <Text>Bar</Text>
            </Button>
            <Button light disabled={this.props.aba == "Administracao"} onPress={() => this.irParaAba("Administracao")}>
              <Icon active={true} name="trending-up" />
              <Text>Admin</Text>
            </Button>
          </FooterTab>
        </Footer>
    );
  }
}

export default Rodape;

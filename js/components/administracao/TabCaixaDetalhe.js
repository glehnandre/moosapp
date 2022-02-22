import React, { Component } from "react";

import {
  Container,
  Header,
  Title,
  Content,
  Text,
  H3,
  Button,
  Icon,
  Footer,
  FooterTab,
  Left,
  Right,
  Body,
  Segment
} from "native-base";


class CaixaDetalhe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transacaoCartao: this.props.navigation.state.params.transacaoCartao
    };
  }

  render() {

        return (
          <Container style={styles.container}>
            <Header>
              <Left>
                <Button transparent onPress={() => this.props.navigation.goBack()}>
                  <Icon name="arrow-back" />
                </Button>
              </Left>
              <Body>
                <Title>{this.state.transacaoCartao.id}</Title>
              </Body>
              <Right />
            </Header>

            <Content padder>
              <Text>{this.state.transacaoCartao.nome}</Text>
            </Content>

          </Container>
        );
  }
}

export default CaixaDetalhe;

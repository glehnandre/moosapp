import React from 'react'
import {
  AsyncStorage,
  ListView,
  Navigator,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View
} from 'react-native'

class Rodape extends Component {
    constructor(props){
      super(props);
    }

    render() {
      return (
        <Button active={true} onPress={() => this.props.navigation.navigate("Caixa", { cartao: this.state.cartao })}>
          <Icon active={true} name="card" />
          <Text>Caixa</Text>
        </Button>
        <Button active={false}>
          <Icon active={false} name="beer" />
          <Text>Bar</Text>
        </Button>
        <Button
          active={false}
          vertical
          badge
        >
          <Badge style={{ backgroundColor: "green" }}>
            <Text>0</Text>
          </Badge>
          <Icon active={false} name="logo-usd" />
          <Text>Relatórios</Text>
        </Button>
      );
    }

}


export default Rodape;

const React = require("react-native");

const { StyleSheet, Platform, Dimensions } = React;

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

export default {
  containerDestaque: {
   flex: 0.5,
   paddingTop: 5,
   backgroundColor: "#2D374B"
  },
  containerHeader: {
   //backgroundColor: "#CDE1F9",
   backgroundColor: "#F4F4F4",
  },
  titleHeader: {
    color: "#555555", 
    //color: "black", 
    fontSize: 25, 
    fontWeight: "bold"
  },
  titleHeaderAlerta: {
    color: "red", 
    fontSize: 25, 
    fontWeight: "bold",
  },
  container: {
    backgroundColor: "#FFF"
  },
  mb: {
    marginBottom: 10
  },
  botaoCalculadora: {
    flex: 0.5,
    width: deviceWidth / 6,
    height: deviceHeight / 10,
    backgroundColor: "#8A8A8A",
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    marginTop: 5,
    marginRight: 5
  },
  botaoCalculadoraSelecionado: {
    flex: 0.5,
    width: deviceWidth / 6,
    height: deviceHeight / 10,
    backgroundColor: "#64FF44",
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    marginTop: 5,
    marginRight: 5
  },
  botaoCalculadoraLetra: {
    fontSize: 40,
    paddingTop: 55,
    paddingBottom: 35,
    alignItems: 'center',
    alignContent: 'center',
    fontWeight: "bold",
    color: "white"
  },
  botaoMetadeTela: {
    width: deviceWidth / 2,
    height: 50,
    marginTop: 40,
    justifyContent: "center"
  },
  imagemMetadeTela:{
    marginLeft: ((deviceWidth / 2) - 50)/3,
    width: 50,
    height: 50,
    marginTop: 30,
    justifyContent: "center"
  },
  imagemCartao:{
    width: 10,
    height: 10,
    marginLeft: 60,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  logoCentral: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  textTitulo: {
      color: "#001742",
      alignItems: "center",
      justifyContent: "flex-start",
      fontSize: 20,
      fontWeight: "bold"
  },
  textBold: {
    fontSize: 15,
    fontWeight: "bold"
  },
  textBoldGrande: {
    fontSize: 40,
    fontWeight: "bold"
  },
  textPequeno: {
    fontSize: 10,
  },
  textBoldDestaqueCentro: {
    flex: 1,
    color: "#5E8D51",
    fontSize: 40,
    fontWeight: "bold",
    alignContent: "center",
    flexDirection: "row",
    textAlign: "center"
  },
  textBoldDestaque: {
    flex: 1,
    color: "#5E8D51",
    fontSize: 50,
    fontWeight: "bold",
    alignContent: "flex-end",
    flexDirection: "row",
    textAlign: "right"
  },
  title: {
      color: "#FFFFFF",
      bottom: 6,
      fontSize: 40,
      fontWeight: "bold"
  },
  alinharConteudoCentro:{
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: "center",
    backgroundColor: "transparent"
  },
  texto:{
    fontSize: 23,
    color: "#001642"
  },
  texto_destaque:{
    fontSize: 23,
    fontWeight: "bold"
  },
logo: {
   width: 300,
   height: 300,
   borderColor: 'white'
 },
 modalContainer: {
   flex: 1,
   justifyContent: 'space-between',
   flexDirection: 'column',
   backgroundColor: "#19E243",
   alignItems: 'center',
   height: 100
 },
 button: {
  marginLeft: 10,
  marginRight: 10
 },
 buttonForte: {
   backgroundColor: '#64FF44'
 },
 textNormal: {
   color: "white",
   fontSize: 14
 },
 labelWhite: {
   marginTop: 10,
   color: "#E2E2E2"
 },
 textDestaqueBranco: {
   fontWeight:"bold",
   color: "white",
   fontSize: 20
 },
 textDestaqueBrancoGrande: {
   fontWeight:"bold",
   color: "white",
   fontSize: 26
 },
 containerAlinhadoCentro: {
   flex: 1,
   justifyContent: 'space-between',
   flexDirection: 'column',
   marginBottom: 10,
   marginTop: 10,
   alignItems: 'center'
 },

};

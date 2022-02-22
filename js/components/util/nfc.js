const React = require("react-native");

import dataBase from "../database/DataBase";

async function carregaNFC() {
  /*var cartao = {id: new Date().valueOf()}
  console.log(cartao);
  return cartao;*/
  let db = new dataBase.criarDataBaseCartoes();
  try {
    var dbinfo = await db.info();
    if(dbinfo.doc_count > 0){
      var result = await db.find({
        selector: {'_id': '1516106395193'}
      });
      console.log("##### CARTAO #####");
      console.log(result.docs[0]);
      console.log("##### CARTAO #####");
      this.setState({
        cartao: result.docs[0]
      });
    }
  } catch (err) {
    console.log(err);
  }
}

async function carregaNFCTemp(){

}

async function gravaNFC(cartao) {
  let db = new dataBase.criarDataBaseCartoes();
  try {
    var doc = await db.get(cartao.id);
    if(doc.ok == true){
      console("##### ATUALIZANDO REGISTRO #####");
      var response = await db.put({
        _id: cartao.id,
        _rev: doc._rev,
        dados: cartao
      });
    }else{
      console("##### ENTROU A PRIMEIRA VEZ #####");
      var response = await db.put({
        _id: cartao.id,
        dados: cartao
      });
    }

  } catch (err) {
    console.log(err);
  }
}


export default { carregaNFC, gravaNFC }

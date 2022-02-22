import React, { Component } from "react";

import {
  AsyncStorage
} from 'react-native'

import PouchDB from 'pouchdb-react-native';





class DataBase extends Component {

  constructor(props){
    super(props);
  }

  static criarDataBaseCartoes(){
        const localDB = new PouchDB('cartoes');
        PouchDB.plugin(require('pouchdb-find'));
        localDB.info().then(function (info) {
          //console.log(info);
        })
        return localDB;
  }

  static criarDataBaseBar(){
        const localDB = new PouchDB('bar');
        PouchDB.plugin(require('pouchdb-find'));
        PouchDB.plugin(require('pouchdb-upsert'));
        localDB.info().then(function (info) {
          //console.log(info);
        })
        return localDB;
  }

  static criarDataBaseConfiguracoes(){
        const localDB = new PouchDB('config');
        PouchDB.plugin(require('pouchdb-find'));
        PouchDB.plugin(require('pouchdb-upsert'));
        localDB.info().then(function (info) {
          //console.log(info);
        })
        return localDB;
  }

  static criarDataBaseMenu(){
        const localDB = new PouchDB('menu');
        PouchDB.plugin(require('pouchdb-find'));
        PouchDB.plugin(require('pouchdb-upsert'));
        localDB.info().then(function (info) {
          //console.log(info);
        })
        return localDB;
  }

  static criarDataBaseCaixa(){
    const localDB = new PouchDB('caixa');
    PouchDB.plugin(require('pouchdb-find'));
    PouchDB.plugin(require('pouchdb-upsert'));
    localDB.info().then(function (info) {
      //console.log(info);
    }) 
    return localDB;
  }

}

export default DataBase;

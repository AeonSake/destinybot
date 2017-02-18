// ==============================
// ========== PREAMBLE ==========
// ==============================

'use strict';

var https = require('https');

var destiny_info_tue = {},
    destiny_info_we = {},
    destiny_activity_def = {},
    destiny_mission_def = {},
    destiny_skull_def = {};



// ============================
// ========== MODULE ==========
// ============================

module.exports = (app) => {
  let slapp = app.slapp;
  let kv = app.kv;
  let config = app.config;
  let func = app.func;
  let lang = app.lang;
  let user = app.user;
  
  var module = {};
  
  
  
// ===================================
// ========== LANGUAGE DATA ==========
// ===================================
  
  function getDestinyActivityDef () {
    var options = {
      host: 'bungie.net',
      port: 443,
      path: 'https://destiny.plumbing/de/raw/DestinyActivityModeDefinition.json',
      method: 'GET'
    };
    
    https.get('https://destiny.plumbing/de/raw/DestinyActivityModeDefinition.json', (res) => {
      console.log('statusCode:', res.statusCode);
      console.log('headers:', res.headers);
      
      res.on('data', (data) => {
        console.log(data);
      });
    }).on('error', (err) => {
      console.log(err);
    });
  }
  getDestinyActivityDef();
  
  function getDestinyMissionDef () {
    var options = {
      host: 'bungie.net',
      port: 443,
      path: 'https://destiny.plumbing/de/raw/DestinyActivityDefinition.json',
      method: 'GET'
    };
    
  }
  
  function getDestinySkullDef () {
    var options = {
      host: 'bungie.net',
      port: 443,
      path: 'https://destiny.plumbing/de/raw/DestinyScriptedSkullDefinition.json',
      method: 'GET'
    };
    
  }
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
};
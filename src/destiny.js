// ==============================
// ========== PREAMBLE ==========
// ==============================

'use strict';

var https = require('https');

var destiny_info = {},
    destiny_activity_def = {},
    destiny_skull_def = {};

// key 37e6325d088049b3aadf888d71fdab87

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
    
  function getActivityDef () {
    https.get('https://destiny.plumbing/' + config.lang + '/raw/DestinyActivityDefinition.json', function(res) {
      var body = "";
      res.on('data', function(d) {
        body += d;
      });
      res.on('end', function() {
        destiny_activity_def = JSON.parse(body);
      });
    });
  }
  getActivityDef(); 
  
  function getSkullDef () {
    https.get('https://destiny.plumbing/' + config.lang + '/raw/DestinyScriptedSkullDefinition.json', function(res) {
      var body = "";
      res.on('data', function(d) {
        body += d;
      });
      res.on('end', function() {
        destiny_skull_def = JSON.parse(body);
      });
    });
  }
  getSkullDef();
  
  
  
  function getTest () {
    var options = {
      host: 'www.bungie.net',
      path: '/Platform/Destiny/Advisors/V2/',
      headers: {'X-API-Key': config.destiny_key}
    };
    
    https.get(options, function(res) {
      var body = "";
      res.on('data', function(d) {
        body += d;
      });
      res.on('end', function() {
        destiny_info = JSON.parse(body).Response.data;
        user.sendDM(config.admin_id, {text: "TEST"});
      });
    });
  }
  getTest();
  
  
  
  
  
  
  
  
  
  
  
  
  
};
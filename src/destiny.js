// ==============================
// ========== PREAMBLE ==========
// ==============================

'use strict';

var https = require('https');

var destiny_info = {},
    destiny_activities = {},
    destiny_activity_def = {},
    destiny_skull_def = {},
    destiny_skull_ref_def = {},
    destiny_place_def = {};



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
  
  
  
// ================================
// ========== FETCH DATA ==========
// ================================
    
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
        destiny_skull_def.90 = {skullHash: 90, skullName: lang.msg.dest.heroic, description: lang.msg.dest.heroicdef};
        destiny_skull_def.91 = {skullHash: 91, skullName: lang.msg.dest.epic, description: lang.msg.dest.epicdef};
      });
    });
    https.get('https://destiny.plumbing/en/raw/DestinyScriptedSkullDefinition.json', function(res) {
      var body = "";
      res.on('data', function(d) {
        body += d;
      });
      res.on('end', function() {
        destiny_skull_ref_def = JSON.parse(body);
        destiny_skull_def.90 = {skullHash: 90, skullName: "Heroic"};
        destiny_skull_def.91 = {skullHash: 91, skullName: "Epic"};
      });
    });
  }
  getSkullDef();
  
  function getPlaceDef () {
    https.get('https://destiny.plumbing/' + config.lang + '/raw/DestinyPlaceDefinition.json', function(res) {
      var body = "";
      res.on('data', function(d) {
        body += d;
      });
      res.on('end', function() {
        destiny_place_def = JSON.parse(body);
      });
    });
  }
  getPlaceDef();
  
  function getActivities () {
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
        destiny_activities = JSON.parse(body).Response.data.activities;
        prepareData();
      });
    });
  }
  getActivities();
  
  
  
// ==================================
// ========== PREPARE DATA ==========
// ==================================
    
  function findSkull (name) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (obj[key].skullName == name) return obj[key].skullHash;
      }
    }
    return 0;
  }
  
  function getSkulls (arr) {
    var skulls = [];
    
    for (var i = 0; i < arr.length; i++) {
      var skullhash = findSkull(arr[i].displayName);
      if (skullhash != 0) skulls.push({
        name: destiny_skull_def[skullhash].skullName,
        desc: destiny_skull_def[skullhash].description
      });
    }
    
    return skulls;
  }
  
  function prepareData () {
    // pve
    destiny_info.prisonofelders = {
      //v1: destiny_activity_def[1404620600].activityName,
      //name: destiny_activity_def[destiny_activities.prisonofelders.display.activityHash].activityName,
      
    };
    
    destiny_info.elderchallenge = {
      title: destiny_activity_def[destiny_activities.elderchallenge.display.activityHash].activityName,
      skulls: getSkulls(destiny_activities.elderchallenge.extended.skullCategories[0].skulls)
    };
    
    
    destiny_info.dailychapter = {
      title: lang.msg.dest.dailyheroic,
      mission: destiny_activity_def[destiny_activities.dailychapter.display.activityHash].activityName,
      desc: destiny_activity_def[destiny_activities.dailychapter.display.activityHash].activityDescription,
      loc: destiny_place_def[destiny_activities.dailychapter.display.placeHash].placeName
    };
    
    destiny_info.heroicstrike = {
      title: lang.msg.dest.heroicstrikes,
      skulls: getSkulls(destiny_activities.heroicstrike.extended.skullCategories[0].skulls)
    };
    
    destiny_info.nightfall = {
      
    };
    
    // raid
    destiny_info.vaultofglass = {
      
    };
    
    destiny_info.crota = {
      
    };
    
    destiny_info.kingsfall = {
      
    };
    destiny_info.wrathofthemachine = {
      
    };
    
    // pvp
    destiny_info.dailycrucible = {
      
    };
    
    destiny_info.weeklycrucible = {
      
    };
    
    // special
    destiny_info.ironbanner = {
      
    };
    
    destiny_info.trials = {
      
    };
    
    destiny_info.xur = {
      
    };
    
    destiny_info.srl = {
      
    };
    
    destiny_info.armsday = {
      
    };
  }
  
  
  
// ==============================
// ========== MESSAGES ==========
// ==============================
  
  function destiny_main () {
    if (destiny_info == {}) prepareData();
    
    var msg_text = {
      text: lang.msg.dest.main,
      attachments: [],
      response_type: 'ephemeral',
      replace_original: true
    };
    
    msg_text.attachments[0] = {
      text: destiny_info.heroicstrike.skulls[0].name + " | " + destiny_info.heroicstrike.skulls[0].desc + ", " + destiny_info.heroicstrike.skulls[1].name + " | " + destiny_info.heroicstrike.skulls[1].desc,
      fallback: "",
      mrkdwn_in: ['text', 'pretext']
    };
    
    return msg_text;
  }
  
  
  
// ==============================
// ========== COMMANDS ==========
// ==============================
  
  slapp.command('destiny', (msg) => {
    destiny_info = {};
    msg.respond(destiny_main);
    return;
  });
  
  
  
  
  
  
  
  
  
};
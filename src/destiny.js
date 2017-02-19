// ==============================
// ========== PREAMBLE ==========
// ==============================

'use strict';

var https = require('https');

var destiny_info = {},
    destiny_activity_def = {},
    destiny_skull_def = {},
    destiny_skull_ref_def = {},
    destiny_place_def = {},
    destiny_item_def = {},
    destiny_activities = {},
    destiny_xur_items = [];



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
        addCustomSkulls();
      });
    });
    https.get('https://destiny.plumbing/en/raw/DestinyScriptedSkullDefinition.json', function(res) {
      var body = "";
      res.on('data', function(d) {
        body += d;
      });
      res.on('end', function() {
        destiny_skull_ref_def = JSON.parse(body);
        addCustomSkullsRef();
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
  
  function getItemDef () {
    https.get('https://destiny.plumbing/' + config.lang + '/items/All.json', function(res) {
      var body = "";
      res.on('data', function(d) {
        body += d;
      });
      res.on('end', function() {
        destiny_item_def = JSON.parse(body);
      });
    });
  }
  getItemDef();
  
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
        if (destiny_activities.xur.status.active) getXurItems();
      });
    });
  }
  getActivities();
  
  function getXurItems () {
    var options = {
      host: 'www.bungie.net',
      path: '/Platform/Destiny/Advisors/Xur/',
      headers: {'X-API-Key': config.destiny_key}
    };
    
    https.get(options, function(res) {
      var body = "";
      res.on('data', function(d) {
        body += d;
      });
      res.on('end', function() {
        destiny_xur_items = JSON.parse(body).Response.data.saleItemCategories[2].saleItems;
      });
    });
  }
  
  function addCustomSkulls () {
    destiny_skull_def[80] = {skullHash: 80, skullName: lang.msg.dest.skulls.heroic, description: lang.msg.dest.skulls.heroicdef};
    destiny_skull_def[81] = {skullHash: 81, skullName: lang.msg.dest.skulls.epic, description: lang.msg.dest.skulls.epicdef};
    destiny_skull_def[90] = {skullHash: 90, skullName: lang.msg.dest.skulls.precisionbonus, description: lang.msg.dest.skulls.precisionbonusdef};
    destiny_skull_def[100] = {skullHash: 100, skullName: lang.msg.dest.skulls.freshtroops, description: lang.msg.dest.skulls.freshtroopsdef};
    destiny_skull_def[101] = {skullHash: 101, skullName: lang.msg.dest.skulls.matchgame, description: lang.msg.dest.skulls.matchgamedef};
  }
  
  function addCustomSkullsRef () {
    destiny_skull_ref_def[80] = {skullHash: 80, skullName: "Heroic"};
    destiny_skull_ref_def[81] = {skullHash: 81, skullName: "Epic"};
    destiny_skull_ref_def[90] = {skullHash: 90, skullName: "Precision Kill Bonus"};
    destiny_skull_ref_def[100] = {skullHash: 100, skullName: "Fresh Troops"};
    destiny_skull_ref_def[101] = {skullHash: 101, skullName: "Match Game"};
  }
  
  
// ==================================
// ========== PREPARE DATA ==========
// ==================================
    
  function findSkull (name) {
    for (var key in destiny_skull_ref_def) {
      if (destiny_skull_ref_def.hasOwnProperty(key)) {
        if (destiny_skull_ref_def[key].skullName == name) return destiny_skull_ref_def[key].skullHash;
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
      else skulls.push({
        name: arr[i].displayName,
        desc: arr[i].description
      });
    }
    
    return skulls;
  }
  
  function getItems (arr) {
    var items = [];
    
    for (var i = 0; i < arr.length; i++) {
      var itemhash = arr[i].item.itemHash;
      if (itemhash != 0) items.push({
        name: destiny_item_def[itemhash].itemName
      });
    }
    
    return items;
  }
  
  function prepareData () {
    // pve
    /*destiny_info.prisonofelders = {
      //v1: destiny_activity_def[1404620600].activityName,
      //name: destiny_activity_def[destiny_activities.prisonofelders.display.activityHash].activityName,,
      active: destiny_activities.ironbanner.status.active
    };*/

    destiny_info.elderchallenge = {
      icon: 'https://bungie.net' + destiny_activities.elderchallenge.display.icon,
      title: destiny_activity_def[destiny_activities.elderchallenge.display.activityHash].activityName,
      skulls: getSkulls(destiny_activities.elderchallenge.extended.skullCategories[0].skulls),
      active: destiny_activities.elderchallenge.status.active,
      insummary: false,
      //color: "#333333"
    };

    destiny_info.dailychapter = {
      type: lang.msg.dest.dailyheroic,
      icon: 'https://bungie.net' + destiny_activities.dailychapter.display.icon,
      title: destiny_activity_def[destiny_activities.dailychapter.display.activityHash].activityName,
      desc: destiny_activity_def[destiny_activities.dailychapter.display.activityHash].activityDescription,
      loc: destiny_place_def[destiny_activities.dailychapter.display.placeHash].placeName,
      level: destiny_activities.dailychapter.activityTiers[0].activityData.displayLevel,
      light: destiny_activities.dailychapter.activityTiers[0].activityData.recommendedLight,
      active: destiny_activities.dailychapter.status.active,
      insummary: true,
      color: "#5941E0"
    };

    destiny_info.heroicstrike = {
      type: lang.msg.dest.weeklystrikes,
      icon: 'https://bungie.net' + destiny_activities.heroicstrike.display.icon,
      title: lang.msg.dest.heroicstrikes,
      desc: destiny_activity_def[destiny_activities.heroicstrike.display.activityHash].activityDescription,
      skulls: getSkulls(destiny_activities.heroicstrike.extended.skullCategories[0].skulls),
      level: destiny_activities.heroicstrike.activityTiers[0].activityData.displayLevel,
      light: destiny_activities.heroicstrike.activityTiers[0].activityData.recommendedLight,
      active: destiny_activities.heroicstrike.status.active,
      insummary: true,
      color: "#5941E0"
    };

    destiny_info.nightfall = {
      type: lang.msg.dest.nightfall,
      icon: 'https://bungie.net' + destiny_activities.nightfall.display.icon,
      title: destiny_activity_def[destiny_activities.nightfall.display.activityHash].activityName,
      desc: destiny_activity_def[destiny_activities.nightfall.display.activityHash].activityDescription,
      loc: destiny_place_def[destiny_activities.nightfall.display.placeHash].placeName,
      skulls: getSkulls(destiny_activities.nightfall.extended.skullCategories[0].skulls),
      level: destiny_activities.nightfall.activityTiers[0].activityData.displayLevel,
      light: destiny_activities.nightfall.activityTiers[0].activityData.recommendedLight,
      active: destiny_activities.nightfall.status.active,
      insummary: true,
      color: "#5941E0"
    };

    // raid
    destiny_info.vaultofglass = {
      type: lang.msg.dest.raid,
      icon: 'https://bungie.net' + destiny_activities.vaultofglass.display.icon,
      title: destiny_activity_def[destiny_activities.vaultofglass.display.activityHash].activityName,
      desc: destiny_activity_def[destiny_activities.vaultofglass.display.activityHash].activityDescription,
      loc: destiny_place_def[destiny_activities.vaultofglass.display.placeHash].placeName,
      normal: {
        level: destiny_activities.vaultofglass.activityTiers[0].activityData.displayLevel,
        light: destiny_activities.vaultofglass.activityTiers[0].activityData.recommendedLight
      },
      hard: {
        level: destiny_activities.vaultofglass.activityTiers[1].activityData.displayLevel,
        light: destiny_activities.vaultofglass.activityTiers[1].activityData.recommendedLight
      },
      active: destiny_activities.vaultofglass.status.active,
      insummary: false,
      //color: "#333333"
    };

    destiny_info.crota = {
      type: lang.msg.dest.raid,
      icon: 'https://bungie.net' + destiny_activities.crota.display.icon,
      title: destiny_activity_def[destiny_activities.crota.display.activityHash].activityName,
      desc: destiny_activity_def[destiny_activities.crota.display.activityHash].activityDescription,
      loc: destiny_place_def[destiny_activities.crota.display.placeHash].placeName,
      normal: {
        level: destiny_activities.crota.activityTiers[0].activityData.displayLevel,
        light: destiny_activities.crota.activityTiers[0].activityData.recommendedLight
      },
      hard: {
        level: destiny_activities.crota.activityTiers[1].activityData.displayLevel,
        light: destiny_activities.crota.activityTiers[1].activityData.recommendedLight
      },
      active: destiny_activities.crota.status.active,
      insummary: false,
      //color: "#333333"
    };

    destiny_info.kingsfall = {
      type: lang.msg.dest.raid,
      icon: 'https://bungie.net' + destiny_activities.kingsfall.display.icon,
      title: destiny_activity_def[destiny_activities.kingsfall.display.activityHash].activityName,
      desc: destiny_activity_def[destiny_activities.kingsfall.display.activityHash].activityDescription,
      loc: destiny_place_def[destiny_activities.kingsfall.display.placeHash].placeName,
      challenge: destiny_activities.kingsfall.activityTiers[0].skullCategories[0].skulls[0].displayName,
      normal: {
        level: destiny_activities.kingsfall.activityTiers[0].activityData.displayLevel,
        light: destiny_activities.kingsfall.activityTiers[0].activityData.recommendedLight
      },
      hard: {
        level: destiny_activities.kingsfall.activityTiers[1].activityData.displayLevel,
        light: destiny_activities.kingsfall.activityTiers[1].activityData.recommendedLight
      },
      active: destiny_activities.kingsfall.status.active,
      insummary: false,
      //color: "#333333"
    };
    destiny_info.wrathofthemachine = {
      type: lang.msg.dest.raid,
      icon: 'https://bungie.net' + destiny_activities.wrathofthemachine.display.icon,
      title: destiny_activity_def[destiny_activities.wrathofthemachine.display.activityHash].activityName,
      desc: destiny_activity_def[destiny_activities.wrathofthemachine.display.activityHash].activityDescription,
      loc: destiny_place_def[destiny_activities.wrathofthemachine.display.placeHash].placeName,
      challenge: destiny_activities.wrathofthemachine.activityTiers[0].skullCategories[0].skulls[0].displayName,
      normal: {
        level: destiny_activities.wrathofthemachine.activityTiers[0].activityData.displayLevel,
        light: destiny_activities.wrathofthemachine.activityTiers[0].activityData.recommendedLight
      },
      hard: {
        level: destiny_activities.wrathofthemachine.activityTiers[1].activityData.displayLevel,
        light: destiny_activities.wrathofthemachine.activityTiers[1].activityData.recommendedLight
      },
      active: destiny_activities.wrathofthemachine.status.active,
      insummary: true,
      //color: "#333333"
    };

    // pvp
    destiny_info.dailycrucible = {
      type: lang.msg.dest.dailycrucible,
      icon: 'https://bungie.net' + destiny_activities.dailycrucible.display.icon,
      title: destiny_activity_def[destiny_activities.dailycrucible.display.activityHash].activityName,
      loc: destiny_place_def[destiny_activities.dailycrucible.display.placeHash].placeName,
      active: destiny_activities.dailycrucible.status.active,
      insummary: true,
      color: "#9D3532"
    };

    destiny_info.weeklycrucible = {
      type: lang.msg.dest.weeklycrucible,
      icon: 'https://bungie.net' + destiny_activities.weeklycrucible.display.icon,
      title: destiny_activity_def[destiny_activities.weeklycrucible.display.activityHash].activityName,
      loc: destiny_place_def[destiny_activities.weeklycrucible.display.placeHash].placeName,
      active: destiny_activities.weeklycrucible.status.active,
      insummary: true,
      color: "#9D3532"
    };

    // special
    destiny_info.ironbanner = {
      type: lang.msg.dest.specialevent,
      icon: 'https://bungie.net' + destiny_activities.ironbanner.display.icon,
      title: destiny_activity_def[destiny_activities.ironbanner.display.activityHash].activityName,
      active: destiny_activities.ironbanner.status.active,
      insummary: true,
      color: "#C98855"
    };

    destiny_info.srl = {
      type: lang.msg.dest.specialevent,
      icon: 'https://bungie.net' + destiny_activities.srl.display.icon,
      title: lang.msg.dest.srl,
      active: destiny_activities.srl.status.active,
      insummary: true,
      color: "#E62836"
    };

    destiny_info.trials = {
      type: lang.msg.dest.trials,
      icon: 'https://bungie.net' + destiny_activities.trials.display.icon,
      title: destiny_activity_def[destiny_activities.trials.display.activityHash].activityName,
      active: destiny_activities.trials.status.active,
      insummary: true,
      color: "#F9DD58"
    };

    destiny_info.xur = {
      title: destiny_activities.xur.display.advisorTypeCategory,
      items: getItems(destiny_xur_items),
      active: destiny_activities.xur.status.active,
      insummary: true,
      color: "#000000"
    };

    destiny_info.armsday = {
      title: lang.msg.dest.armsday,
      active: destiny_activities.armsday.status.active,
      insummary: true,
      //color: "#333333"
    };
  }
  
  
  
// ==============================
// ========== MESSAGES ==========
// ==============================
  
  function listSkulls (arr) {
    var text = "";
    for (var i = 0; i < arr.length; i++) {
      text += arr[i].name;
      if (i < arr.length - 1) text += ", ";
    }
    return text;
  }
  
  function listFullSkulls (arr) {
    var text = "";
    for (var i = 0; i < arr.length; i++) {
      text += "*" + arr[i].name + "* : " + arr[i].desc;
      if (i < arr.length - 1) text += "\n";
    }
    return text;
  }
  
  function listItems (arr) {
    var text = "";
    for (var i = 0; i < arr.length; i++) {
      text += arr[i].name;
      if (i < arr.length - 1) text += ", ";
    }
    return text;
  }
  
  function getActivityAttachment (act) {
    var text = "";
    if ('skulls' in destiny_info[act]) text = listSkulls(destiny_info[act].skulls);
    else if ('challenge' in destiny_info[act]) text = destiny_info[act].challenge;
    else if ('items' in destiny_info[act]) text = listItems(destiny_info[act].items);
    else if ('loc' in destiny_info[act]) text = destiny_info[act].loc;
    
    return {
      author_name: destiny_info[act].type || "",
      author_icon: destiny_info[act].icon || "",
      title: destiny_info[act].title,
      text: text,
      fallback: destiny_info[act].title,
      //footer: "",
      color: destiny_info[act].color || "",
      mrkdwn_in: ['text', 'pretext', 'fields']
    };
  }
  
  function getFullActivityAttachment (act) {
    var text = "";
    if ('loc' in destiny_info[act]) text += destiny_info[act].loc + "\n";
    if ('desc' in destiny_info[act]) text += destiny_info[act].desc + "\n";
    
    var fields = [];
    if ('light' in destiny_info[act]) fields.push({
      title: lang.msg.dest.recom,
      value: "*" + lang.msg.dest.level + "* : " + destiny_info[act].level + "\n*" + lang.msg.dest.light + "* : " + destiny_info[act].light,
      short: false
    });
    if ('skulls' in destiny_info[act]) fields.push({
      title: lang.msg.dest.mods,
      value: listFullSkulls(destiny_info[act].skulls),
      short: false
    });
    if ('challenge' in destiny_info[act]) fields.push({
      title: destiny_info[act].challenge,
      short: false
    });
    if ('normal' in destiny_info[act]) fields.push({
      title: lang.msg.dest.normalmode,
      value: "*" + lang.msg.dest.level + "* : " + destiny_info[act].normal.level + "\n*" + lang.msg.dest.light + "* : " + destiny_info[act].normal.light,
      short: false
    });
    if ('hard' in destiny_info[act]) fields.push({
      title: lang.msg.dest.hardmode,
      value: "*" + lang.msg.dest.level + "* : " + destiny_info[act].hard.level + "\n*" + lang.msg.dest.light + "* : " + destiny_info[act].hard.light,
      short: false
    });
    if ('items' in destiny_info[act]) fields.push({
      value: listItems(destiny_info[act].items),
      short: false
    });
    
    return {
      author_name: destiny_info[act].type || "",
      author_icon: destiny_info[act].icon || "",
      title: destiny_info[act].title,
      text: text,
      fallback: destiny_info[act].title,
      fields: fields,
      //footer: "",
      color: destiny_info[act].color || "",
      mrkdwn_in: ['text', 'pretext', 'fields']
    };
  }
  
  function destiny_main () {
    var msg_text = {
      text: lang.msg.dest.main,
      attachments: [],
      response_type: 'ephemeral',
      replace_original: true
    };
    
    for (var key in destiny_info) {
      if (destiny_info[key].active && destiny_info[key].insummary) msg_text.attachments.push(getActivityAttachment(key));
    }
    
    return msg_text;
  }
  
  
  
// ==============================
// ========== COMMANDS ==========
// ==============================
  
  slapp.command('/destiny', "test (.*)", (msg, cmd) => {
    if (msg.body.user_id == config.admin_id) {
      var options = {
        host: 'www.bungie.net',
        path: '/Platform/Destiny/' + cmd.substring(5),
        headers: {'X-API-Key': config.destiny_key}
      }
      
      https.get(options, function(res) {
        var body = "";
        res.on('data', function(d) {
          body += d;
        });
        res.on('end', function() {
          msg.say({text: JSON.parse(body).Response});
        });
      });
    };
  });
  
  slapp.command('/destiny', (msg) => {
    if (msg.body.user_id == config.admin_id) {
      prepareData();
      msg.say(destiny_main()); 
    }
    return;
  });
  
  
  
};
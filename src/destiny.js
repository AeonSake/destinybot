// ==============================
// ========== PREAMBLE ==========
// ==============================

'use strict';

const https = require('https');
const needle = require('needle');

var destiny_info = {},
    destiny_def = {},
    destiny_activities = {},
    destiny_schedules = {
      daily: {
        name: "destiny_daily_update",
        schedule: "15 9 * * 0,1,3,4,5,6 *"
      },
      weekly: {
        name: "destiny_weekly_update",
        schedule: "15 9 * * 2 *"
      },
      armsday: {
        name: "destiny_armsday_update",
        schedule: "15 9 * * 3 *"
      },
      xur: {
        name: "destiny_xur_update",
        schedule: "15 9 * * 5 *"
      },
      ironbanner: {
        name: "destiny_ironbanner_update",
        schedule: "# # * * 2 *"
      },
      trials: {
        name: "destiny_trials_update",
        schedule: "# # * * 5 *"
      }
    };



// ============================
// ========== MODULE ==========
// ============================

module.exports = (app) => {
  let slapp = app.slapp;
  let kv = app.kv;
  let moment = app.moment;
  let config = app.config;
  let func = app.func;
  let lang = app.lang;
  
  var module = {};
  
  
  
// ================================
// ========== FETCH DATA ==========
// ================================
    
  function getActivityDef (callback) {
    https.get('https://destiny.plumbing/' + config.lang + '/raw/DestinyActivityDefinition.json', function(res) {
      var body = "";
      res.on('data', function(d) {
        body += d;
      });
      res.on('end', function() {
        destiny_def.activity = JSON.parse(body);
        console.log("INFO: Destiny | Activity definitions loaded");
        callback();
      });
    });
  }
  
  function getPlaceDef (callback) {
    https.get('https://destiny.plumbing/' + config.lang + '/raw/DestinyPlaceDefinition.json', function(res) {
      var body = "";
      res.on('data', function(d) {
        body += d;
      });
      res.on('end', function() {
        destiny_def.place = JSON.parse(body);
        console.log("INFO: Destiny | Place definitions loaded");
        callback();
      });
    });
  }
  
  function getItemDef (callback) {
    https.get('https://destiny.plumbing/' + config.lang + '/items/All.json', function(res) {
      var body = "";
      res.on('data', function(d) {
        body += d;
      });
      res.on('end', function() {
        destiny_def.item = JSON.parse(body);
        console.log("INFO: Destiny | Item definitions loaded");
        callback();
      });
    });
  }
  
  function getStatDef (callback) {
    https.get('https://destiny.plumbing/' + config.lang + '/raw/DestinyStatDefinition.json', function(res) {
      var body = "";
      res.on('data', function(d) {
        body += d;
      });
      res.on('end', function() {
        destiny_def.stat = JSON.parse(body);
        console.log("INFO: Destiny | Stat definitions loaded");
        callback();
      });
    });
  }
  
  function getPerkDef (callback) {
    https.get('https://destiny.plumbing/' + config.lang + '/raw/DestinySandboxPerkDefinition.json', function(res) {
      var body = "";
      res.on('data', function(d) {
        body += d;
      });
      res.on('end', function() {
        destiny_def.perk = JSON.parse(body);
        console.log("INFO: Destiny | Perk definitions loaded");
        callback();
      });
    });
  }
  
  function getDefinitions (callback) {
    getActivityDef(function(){
      getPlaceDef(function(){
        getItemDef(function(){
          getStatDef(function(){
            getPerkDef(function(){
              if (typeof callback === "function") callback();
            });
          });
        });
      });
    });
  }
  
  function getActivities (callback) {
    var options = {
      host: 'www.bungie.net',
      path: '/Platform/Destiny/Advisors/V2/?lc=' + config.lang,
      headers: {'X-API-Key': config.destiny_key}
    };
    
    https.get(options, function(res) {
      var body = "";
      res.on('data', function(d) {
        body += d;
      });
      res.on('end', function() {
        destiny_activities = JSON.parse(body).Response.data.activities;
        console.log("INFO: Destiny | Activities loaded");
        if (destiny_activities.xur.status.active) getXurItems(callback);
        else prepareData(callback);
      });
    });
  }
  
  function getXurItems (callback) {
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
        prepareData(function(){
          destiny_info.xur.items = getItems(JSON.parse(body).Response.data.saleItemCategories[2].saleItems);
          console.log("INFO: Destiny | Xûr items loaded");
          if (typeof callback === "function") callback();
        });
      });
    });
  }
  
  getDefinitions(getActivities);
  
  
  
// ================================
// ========== SCHEDULING ==========
// ================================
  
  function setSchedule (msg, event_id, schedule, callback) {
    let ts = Date.now() + '';
    var data = {
      schedule: schedule,
      url: 'https://beepboophq.com/proxy/' + config.bb_project_id + '/slack/event',
      method: 'POST',
      headers: {
        'BB-Enrich': 'slack_team_id='+ msg.meta.team_id
      },
      payload: {
        token: msg.body.token,
        team_id: msg.meta.team_id,
        type: 'event_callback',
        event: {
          ts: ts,
          event_ts: ts,
          type: 'destiny_' + event_id + '_update',
          payload: "destiny_" + event_id + "_update",
          user: msg.meta.user_id,
          channel: msg.meta.channel_id
        }
      }
    };
    var headers = {
      headers: {
        Authorization: 'Bearer ' + config.bb_token
      },
      json: true
    };
    
    needle.post('beepboophq.com/api/v1/chronos/tasks', data, headers, (err, resp) => {
      if (resp.statusCode !== 201) console.log(resp.statusCode);
      if (err) console.log(err);
      else {
        console.log(resp.body);
        callback(resp);
      }
    });
  }
  
  function deleteSchedule (msg, id, callback) {
    var headers = {
      headers: {
        Authorization: 'Bearer ' + config.bb_token
      },
      json: true
    };
    needle.delete('https://beepboophq.com/api/v1/chronos/tasks/' + id, null, headers, (err, resp) => {
      if (resp.statusCode !== 201) console.log(resp.statusCode);
      if (err) console.log(err);
      else {
        console.log(resp.body);
        callback(resp);
      }
    });
  }
  
  function listSchedules (msg, callback) {
    var headers = {
      headers: {
        Authorization: 'Bearer ' + config.bb_token
      },
      json: true
    };
    needle.get('https://beepboophq.com/api/v1/chronos/tasks?inactive=false', headers, (err, resp) => {
      if (resp.statusCode !== 201) console.log(resp.statusCode);
      if (err) console.log(err);
      else {
        console.log(resp.body);
        callback(resp);
      }
    });
  }
  
  function resetSchedules (msg) {
    listSchedules(msg, function(resp) {
      var data = JSON.parse(resp.body);
      for (var i in data.results) {
        if (/destiny_(.*)_update/.test(data.body.results[i].payload.type)) deleteSchedule(msg, data.body.results[i].id);
      }
      for (var key in destiny_schedules) {
        if (destiny_schedules.hasOwnProperty(key)) setSchedule(msg, destiny_schedules[key].name, destiny_schedules[key].schedule, function(data) {
          destiny_schedules[key].id = data.id;
        });
      }
    });
  }
  
  function setEventTime() {
    for (var key in destiny_schedules) {
      if (destiny_schedules.hasOwnProperty(key)) {
        destiny_schedules[key].schedule = destiny_schedules[key].schedule.replace("# #", moment("2000-1-1 18:00 +0000", 'YYYY-MM-DD HH:mm Z').add(15, 'm').format('mm HH'));
      }
    }
  }
  
  setEventTime();
  
  
  
// ==================================
// ========== PREPARE DATA ==========
// ==================================
  
  function getSkulls (arr) {
    var skulls = [];
    
    for (var i in arr) {
      for (var j in arr[i].skulls) {
        skulls.push({
          name: arr[i].skulls[j].displayName,
          desc: arr[i].skulls[j].description
        });
      }
    }
    
    return skulls;
  }
  
  function getItems (arr) {
    var items = [];
    
    for (var i in arr) {
      var itemhash = arr[i].item.itemHash;
      if (itemhash != 0) items.push({
        hash: itemhash,
        name: destiny_def.item[itemhash].itemName,
        tier: destiny_def.item[itemhash].tierTypeName,
        class: getClass(destiny_def.item[itemhash].itemCategoryHashes[0]),
        type: destiny_def.item[itemhash].itemTypeName,
        stats: getStats(arr[i].item.stats, destiny_def.item[itemhash].itemCategoryHashes[1]),
        perks: getPerks(arr[i].item.perks)
      });
    }
    
    return items;
  }
  
  function getClass (type) {
    var classes = {21: lang.msg.dest.warlock, 22: lang.msg.dest.titan, 23: lang.msg.dest.hunter};
    return classes[type] || 0;
  }
  
  function getStats (arr, type) {
    var stats = [];
    
    for (var i in arr) {
      var stathash = arr[i].statHash;
      if (stathash != 0) stats.push({
        name: destiny_def.stat[stathash].statName,
        value: arr[i].value,
        max: (arr[i].maximumValue != 0 ? arr[i].maximumValue : getMaxStat(type))
      });
    }
    
    return stats;
  }
  
  function getMaxStat (type) {
    var maxvalues = {38: '38', 39: '25', 45: '46', 46: '41', 47: '61', 48: '56', 49: '25'};
    return maxvalues[type] || '100';
  }
  
  function getPerks (arr) {
    var perks = [];
    
    for (var i in arr) {
      var perkhash = arr[i].perkHash;
      if (perkhash != 0) perks.push({
        name: destiny_def.perk[perkhash].displayName,
        desc: destiny_def.perk[perkhash].displayDescription
      });
    }
    
    return perks;
  }
  
  function prepareData (callback) {
    destiny_info = {};
    // pve
    /*destiny_info.prisonofelders = {
      //v1: destiny_def.activity[1404620600].activityName,
      //name: destiny_def.activity[destiny_activities.prisonofelders.display.activityHash].activityName,
      expirationDate: destiny_activities.prisonofelders.status.expirationDate || 0,
      active: destiny_activities.prisonofelders.status.active
    };*/
    
    destiny_info.elderchallenge = {
      icon: 'https://bungie.net' + destiny_activities.elderchallenge.display.icon,
      title: destiny_activities.elderchallenge.display.advisorTypeCategory,
      skulls: {
        title: destiny_activities.elderchallenge.extended.skullCategories[0].title,
        skulls: getSkulls(destiny_activities.elderchallenge.extended.skullCategories)
      },
      active: destiny_activities.elderchallenge.status.active,
      expirationDate: destiny_activities.elderchallenge.status.expirationDate || 0,
      insummary: false,
      //color: "#333333"
    };
    
    destiny_info.dailychapter = {
      type: destiny_activities.dailychapter.display.advisorTypeCategory,
      icon: 'https://bungie.net' + destiny_activities.dailychapter.display.icon,
      title: destiny_def.activity[destiny_activities.dailychapter.display.activityHash].activityName,
      desc: destiny_def.activity[destiny_activities.dailychapter.display.activityHash].activityDescription,
      loc: destiny_def.place[destiny_activities.dailychapter.display.placeHash].placeName,
      level: destiny_activities.dailychapter.activityTiers[0].activityData.displayLevel,
      light: destiny_activities.dailychapter.activityTiers[0].activityData.recommendedLight,
      active: destiny_activities.dailychapter.status.active,
      expirationDate: destiny_activities.dailychapter.status.expirationDate || 0,
      insummary: true,
      color: "#5941E0"
    };
    
    destiny_info.heroicstrike = {
      type: destiny_activities.heroicstrike.display.advisorTypeCategory,
      icon: 'https://bungie.net' + destiny_activities.heroicstrike.display.icon,
      title: destiny_def.activity[destiny_activities.heroicstrike.display.activityHash].activityName,
      desc: destiny_def.activity[destiny_activities.heroicstrike.display.activityHash].activityDescription,
      skulls: {
        title: destiny_activities.heroicstrike.extended.skullCategories[0].title,
        skulls: getSkulls(destiny_activities.heroicstrike.extended.skullCategories)
      },
      level: destiny_activities.heroicstrike.activityTiers[0].activityData.displayLevel,
      light: destiny_activities.heroicstrike.activityTiers[0].activityData.recommendedLight,
      active: destiny_activities.heroicstrike.status.active,
      expirationDate: destiny_activities.heroicstrike.status.expirationDate || 0,
      insummary: true,
      color: "#5941E0"
    };
    
    destiny_info.nightfall = {
      type: destiny_activities.nightfall.display.advisorTypeCategory,
      icon: 'https://bungie.net' + destiny_activities.nightfall.display.icon,
      title: destiny_def.activity[destiny_activities.nightfall.display.activityHash].activityName,
      desc: destiny_def.activity[destiny_activities.nightfall.display.activityHash].activityDescription,
      loc: destiny_def.place[destiny_activities.nightfall.display.placeHash].placeName,
      skulls: {
        title: destiny_activities.nightfall.extended.skullCategories[0].title,
        skulls: getSkulls(destiny_activities.nightfall.extended.skullCategories)
      },
      level: destiny_activities.nightfall.activityTiers[0].activityData.displayLevel,
      light: destiny_activities.nightfall.activityTiers[0].activityData.recommendedLight,
      active: destiny_activities.nightfall.status.active,
      expirationDate: destiny_activities.nightfall.status.expirationDate || 0,
      insummary: true,
      color: "#5941E0"
    };
    
    // raid
    destiny_info.vaultofglass = {
      type: lang.msg.dest.raid,
      icon: 'https://bungie.net' + destiny_activities.vaultofglass.display.icon,
      title: destiny_def.activity[destiny_activities.vaultofglass.display.activityHash].activityName,
      desc: destiny_def.activity[destiny_activities.vaultofglass.display.activityHash].activityDescription,
      loc: destiny_def.place[destiny_activities.vaultofglass.display.placeHash].placeName,
      challenge: lang.msg.dest.nochallenge,
      normal: {
        title: destiny_activities.vaultofglass.activityTiers[0].tierDisplayName,
        level: destiny_activities.vaultofglass.activityTiers[0].activityData.displayLevel,
        light: destiny_activities.vaultofglass.activityTiers[0].activityData.recommendedLight
      },
      hard: {
        title: destiny_activities.vaultofglass.activityTiers[1].tierDisplayName,
        level: destiny_activities.vaultofglass.activityTiers[1].activityData.displayLevel,
        light: destiny_activities.vaultofglass.activityTiers[1].activityData.recommendedLight
      },
      active: destiny_activities.vaultofglass.status.active,
      expirationDate: destiny_activities.vaultofglass.status.expirationDate || 0,
      insummary: false,
      //color: "#333333"
    };
    
    destiny_info.crota = {
      type: lang.msg.dest.raid,
      icon: 'https://bungie.net' + destiny_activities.crota.display.icon,
      title: destiny_def.activity[destiny_activities.crota.display.activityHash].activityName,
      desc: destiny_def.activity[destiny_activities.crota.display.activityHash].activityDescription,
      loc: destiny_def.place[destiny_activities.crota.display.placeHash].placeName,
      challenge: lang.msg.dest.nochallenge,
      normal: {
        title: destiny_activities.crota.activityTiers[0].tierDisplayName,
        level: destiny_activities.crota.activityTiers[0].activityData.displayLevel,
        light: destiny_activities.crota.activityTiers[0].activityData.recommendedLight
      },
      hard: {
        title: destiny_activities.crota.activityTiers[1].tierDisplayName,
        level: destiny_activities.crota.activityTiers[1].activityData.displayLevel,
        light: destiny_activities.crota.activityTiers[1].activityData.recommendedLight
      },
      active: destiny_activities.crota.status.active,
      expirationDate: destiny_activities.crota.status.expirationDate || 0,
      insummary: false,
      //color: "#333333"
    };
    
    destiny_info.kingsfall = {
      type: lang.msg.dest.raid,
      icon: 'https://bungie.net' + destiny_activities.kingsfall.display.icon,
      title: destiny_def.activity[destiny_activities.kingsfall.display.activityHash].activityName,
      desc: destiny_def.activity[destiny_activities.kingsfall.display.activityHash].activityDescription,
      loc: destiny_def.place[destiny_activities.kingsfall.display.placeHash].placeName,
      challenge: destiny_activities.kingsfall.activityTiers[0].skullCategories[0].skulls[0].displayName,
      normal: {
        title: destiny_activities.kingsfall.activityTiers[0].tierDisplayName,
        level: destiny_activities.kingsfall.activityTiers[0].activityData.displayLevel,
        light: destiny_activities.kingsfall.activityTiers[0].activityData.recommendedLight
      },
      hard: {
        title: destiny_activities.kingsfall.activityTiers[1].tierDisplayName,
        level: destiny_activities.kingsfall.activityTiers[1].activityData.displayLevel,
        light: destiny_activities.kingsfall.activityTiers[1].activityData.recommendedLight
      },
      active: destiny_activities.kingsfall.status.active,
      expirationDate: destiny_activities.kingsfall.status.expirationDate || 0,
      insummary: false,
      //color: "#333333"
    };
    
    destiny_info.wrathofthemachine = {
      type: lang.msg.dest.raid,
      icon: 'https://bungie.net' + destiny_activities.wrathofthemachine.display.icon,
      title: destiny_def.activity[destiny_activities.wrathofthemachine.display.activityHash].activityName,
      desc: destiny_def.activity[destiny_activities.wrathofthemachine.display.activityHash].activityDescription,
      loc: destiny_def.place[destiny_activities.wrathofthemachine.display.placeHash].placeName,
      challenge: destiny_activities.wrathofthemachine.activityTiers[0].skullCategories[0].skulls[0].displayName,
      normal: {
        title: destiny_activities.wrathofthemachine.activityTiers[0].tierDisplayName,
        level: destiny_activities.wrathofthemachine.activityTiers[0].activityData.displayLevel,
        light: destiny_activities.wrathofthemachine.activityTiers[0].activityData.recommendedLight
      },
      hard: {
        title: destiny_activities.wrathofthemachine.activityTiers[1].tierDisplayName,
        level: destiny_activities.wrathofthemachine.activityTiers[1].activityData.displayLevel,
        light: destiny_activities.wrathofthemachine.activityTiers[1].activityData.recommendedLight
      },
      active: destiny_activities.wrathofthemachine.status.active,
      expirationDate: destiny_activities.wrathofthemachine.status.expirationDate || 0,
      insummary: true,
      //color: "#333333"
    };
    
    // pvp
    destiny_info.dailycrucible = {
      type: destiny_activities.dailycrucible.display.advisorTypeCategory,
      icon: 'https://bungie.net' + destiny_activities.dailycrucible.display.icon,
      title: destiny_def.activity[destiny_activities.dailycrucible.display.activityHash].activityName,
      active: destiny_activities.dailycrucible.status.active,
      expirationDate: destiny_activities.dailycrucible.status.expirationDate || 0,
      insummary: true,
      color: "#9D3532"
    };
    
    destiny_info.weeklycrucible = {
      type: destiny_activities.weeklycrucible.display.advisorTypeCategory,
      icon: 'https://bungie.net' + destiny_activities.weeklycrucible.display.icon,
      title: destiny_def.activity[destiny_activities.weeklycrucible.display.activityHash].activityName,
      active: destiny_activities.weeklycrucible.status.active,
      expirationDate: destiny_activities.weeklycrucible.status.expirationDate || 0,
      insummary: true,
      color: "#9D3532"
    };
    
    // special
    destiny_info.ironbanner = {
      type: destiny_info.weeklycrucible.type,
      icon: 'https://bungie.net' + destiny_activities.ironbanner.display.icon,
      title: destiny_info.weeklycrucible.title,
      active: destiny_activities.ironbanner.status.active,
      expirationDate: destiny_activities.ironbanner.status.expirationDate || 0,
      insummary: false,
      color: "#C98855"
    };
    
    destiny_info.srl = {
      type: destiny_activities.srl.display.advisorTypeCategory,
      icon: 'https://bungie.net' + destiny_activities.srl.display.icon,
      title: lang.msg.dest.srl,
      active: destiny_activities.srl.status.active,
      expirationDate: destiny_activities.srl.status.expirationDate || 0,
      insummary: true,
      color: "#E62836"
    };
    
    destiny_info.trials = {
      type: destiny_activities.trials.display.advisorTypeCategory,
      icon: 'https://bungie.net' + destiny_activities.trials.display.icon,
      title: destiny_def.activity[destiny_activities.trials.display.activityHash].activityName,
      active: destiny_activities.trials.status.active,
      expirationDate: destiny_activities.trials.status.expirationDate || 0,
      insummary: true,
      color: "#F9DD58"
    };
    
    destiny_info.xur = {
      title: destiny_activities.xur.display.advisorTypeCategory,
      items: [],
      active: destiny_activities.xur.status.active,
      expirationDate: destiny_activities.xur.status.expirationDate || 0,
      insummary: true,
      color: "#000000"
    };
    
    destiny_info.armsday = {
      title: destiny_activities.armsday.display.advisorTypeCategory,
      items: [],
      active: destiny_activities.armsday.status.active,
      expirationDate: destiny_activities.armsday.status.expirationDate || 0,
      insummary: true,
      //color: "#333333"
    };
    if (destiny_info.armsday.active) destiny_info.armsday.items = getItems(destiny_activities.armsday.extended.orders);
    
    if (typeof callback === "function") callback();
  }
  
  
  
// ==============================
// ========== MESSAGES ==========
// ==============================
  
  function listSkulls (arr) {
    var text = "";
    for (var i in arr) {
      text += arr[i].name;
      if (i < arr.length - 1) text += ", ";
    }
    return text;
  }
  
  function listFullSkulls (arr) {
    var text = "";
    for (var i in arr) {
      text += "*" + arr[i].name + "* : " + arr[i].desc;
      if (i < arr.length - 1) text += "\n";
    }
    return text;
  }
  
  function listItems (arr) {
    var text = "";
    for (var i in arr) {
      text += "<https://www.bungie.net/de/Armory/Detail?item=" + arr[i].hash + "|" + arr[i].name + ">";
      if (i < arr.length - 1) text += "\n";
    }
    return text;
  }
  
  function listFullItems (arr) {
    var items = [];
    for (var i in arr) {
      items.push({
        title: arr[i].name,
        value: arr[i].tier + (arr[i].class == 0 ? "" : " | " + arr[i].class) + " | " + arr[i].type + " | <https://www.bungie.net/de/Armory/Detail?item=" + arr[i].hash + "|" + lang.msg.dest.link + ">",
        short: false
      });
      
      var stats = "";
      for (var j in arr[i].stats) {
        var percent = "";
        if (arr[i].stats.length == 3) percent = " (" + Math.round((arr[i].stats[j].value / arr[i].stats[j].max) * 100) + "%)";
        stats += arr[i].stats[j].name + " : " + arr[i].stats[j].value + percent + "\n";
      }
      if (stats.length != 0) items.push({title: lang.msg.dest.stats, value: stats, short: true});
      
      var perks = "";
      for (var j in arr[i].perks) {
        perks += arr[i].perks[j].name + "\n";
      }
      if (perks.length != 0) items.push({title: lang.msg.dest.perks, value: perks, short: true});
    }
    
    return items;
  }
  
  function destiny_moreinfo_att (mode) {
    var att = {
      text: lang.msg.dest.moreinfo,
      fallback: lang.msg.dest.moreinfo,
      callback_id: 'destiny_moreinfo_callback',
      actions: [],
      mrkdwn_in: ['text', 'pretext']
    };
    if (mode != 0) att.actions.push({
      name: 'summary',
      text: lang.btn.dest.summary,
      type: 'button'
    });
    if (mode != 1) att.actions.push({
      name: 'pve',
      text: lang.btn.dest.pve,
      type: 'button'
    });
    if (mode != 2) att.actions.push({
      name: 'raids',
      text: lang.btn.dest.raids,
      type: 'button'
    });
    if (mode != 3) att.actions.push({
      name: 'pvp',
      text: lang.btn.dest.pvp,
      type: 'button'
    });
    if (mode != 4) att.actions.push({
      name: 'special',
      text: lang.btn.dest.special,
      type: 'button'
    });
    /*if (mode != 5) att.actions.push({
      name: 'vendors',
      text: lang.btn.dest.vendors,
      type: 'button'
    });*/
    
    return att;
  }
  
  var destiny_dismiss_att = {
    text: "",
    fallback: "",
    callback_id: 'dismiss_callback',
    actions: [
      {
        name: 'dismiss',
        text: lang.btn.dismiss,
        type: 'button',
      }
    ],
    mrkdwn_in: ['text', 'pretext']
  };
  
  function getActivityAttachment (act) {
    var text = "";
    if ('skulls' in act) text = listSkulls(act.skulls.skulls);
    else if ('challenge' in act) text = act.challenge;
    else if ('items' in act) text = listItems(act.items);
    
    var time = "";
    if (act.expirationDate != 0) time = lang.msg.dest.activetill + " " + moment(act.expirationDate).format(lang.msg.dest.dateformat);
    
    return {
      author_name: act.type || "",
      //author_icon: act.icon || "",
      title: act.title,
      text: text,
      fallback: act.title,
      footer: time,
      color: act.color || "",
      mrkdwn_in: ['text', 'pretext', 'fields']
    };
  }
  
  function getFullActivityAttachment (act) {
    var text = "";
    if ('loc' in act) text += act.loc + "\n";
    if ('desc' in act) text += act.desc + "\n";
    
    var fields = [];
    if ('light' in act) fields.push({
      title: lang.msg.dest.recom,
      value: "*" + lang.msg.dest.level + "* : " + act.level + "\n*" + lang.msg.dest.light + "* : " + act.light,
      short: false
    });
    if ('skulls' in act) fields.push({
      title: act.skulls.title + ":",
      value: listFullSkulls(act.skulls.skulls),
      short: false
    });
    if ('normal' in act) fields.push({
      title: act.normal.title,
      value: "*" + lang.msg.dest.level + "* : " + act.normal.level + "\n*" + lang.msg.dest.light + "* : " + act.normal.light,
      short: true
    });
    if ('hard' in act) fields.push({
      title: act.hard.title,
      value: "*" + lang.msg.dest.level + "* : " + act.hard.level + "\n*" + lang.msg.dest.light + "* : " + act.hard.light,
      short: true
    });
    if ('challenge' in act) fields.push({
      title: act.challenge,
      short: false
    });
    if ('items' in act) {
      var temp = listFullItems(act.items);
      for (var i in temp) fields.push(temp[i]);
    }
    
    var time = "";
    if (act.expirationDate != 0) time = lang.msg.dest.activetill + " " + moment(act.expirationDate).format(lang.msg.dest.dateformat);
    
    return {
      author_name: act.type || "",
      //author_icon: act.icon || "",
      title: act.title,
      text: text,
      fallback: act.title,
      fields: fields,
      footer: time,
      color: act.color || "",
      mrkdwn_in: ['text', 'pretext', 'fields']
    };
  }
  
  function getItemAttachment (item) {
    var fields = [],
        stats = "",
        perks = "";
    
      for (var i in item.stats) {
        if (item.stats.length == 3 && item.stats[i].value != 0) {
          stats += item.stats[i].name + " : " + item.stats[i].value + " (" + Math.round((item.stats[i].value / item.stats[i].max) * 100) + "%)\n";
        } else stats += item.stats[i].name + " : " + item.stats[i].value + "\n";
      }
      if (stats.length != 0) fields.push({title: lang.msg.dest.stats, value: stats, short: true});
      
      for (var i in item.perks) {
        perks += item.perks[i].name + "\n";
      }
      if (perks.length != 0) fields.push({title: lang.msg.dest.perks, value: perks, short: true});
    
    
    return {
      title: item.name,
      title_link: "https://www.bungie.net/de/Armory/Detail?item=" + item.hash,
      text: item.tier + (item.class == 0 ? "" : " | " + item.class) + " | " + item.type,
      fallback: item.name,
      fields: fields,
      color: func.getRandomColor(),
      mrkdwn_in: ['text', 'pretext', 'fields']
    };
  }
  
  function destiny_summary_msg () {
    var msg_text = {
      text: lang.msg.dest.main,
      attachments: [],
      response_type: 'ephemeral',
      replace_original: true
    };
    
    for (var key in destiny_info) {
      if (destiny_info.hasOwnProperty(key)) {
        if (destiny_info[key].active && destiny_info[key].insummary) msg_text.attachments.push(getActivityAttachment(destiny_info[key]));
      }
    }
    if (msg_text.attachments.length < 1) msg_text.attachments.push({
      text: lang.msg.dest.noactivities,
      fallback: lang.msg.dest.noactivities,
      mrkdwn_in: ['text', 'pretext']
    });
    
    return msg_text;
  }
  
  function destiny_list_msg (text, keys) {
    var msg_text = {
      text: text,
      attachments: [],
      response_type: 'ephemeral',
      replace_original: true
    };
    
    if (keys.length != 0) {
      for (var i in keys) {
        if (destiny_info[keys[i]].active) msg_text.attachments.push(getActivityAttachment(destiny_info[keys[i]]));
      }
    } else {
      for (var key in destiny_info) {
        if (destiny_info.hasOwnProperty(key)) {
          if (destiny_info[key].active) msg_text.attachments.push(getActivityAttachment(destiny_info[key]));
        }
      }
    }
    
    return msg_text;
  }
  
  function destiny_public_msg (text, key) {
    var msg_text = {
      text: text,
      attachments: [],
      response_type: 'ephemeral',
      replace_original: true
    };
    
    if (destiny_info.hasOwnProperty(key) && destiny_info[key].active) msg_text.attachments.push(getActivityAttachment(destiny_info[key]));
    else return {text: "", replace_original: true};
    
    if ('items' in destiny_info[key]) {
      msg_text.attachments[0].callback_id = 'destiny_public_moreinfo_callback';
      msg_text.attachments[0].actions = [{
        name: key,
        text: lang.btn.dest.details,
        type: 'button'
      }];
    }
    
    return msg_text;
  }
  
  function destiny_full_msg (text, key, itemlist) {
    var msg_text = {
      text: text,
      attachments: [],
      response_type: 'ephemeral',
      replace_original: true
    };
    
    if (destiny_info.hasOwnProperty(key) && destiny_info[key].active) {
      if (itemlist && 'items' in destiny_info[key]) for (var i in destiny_info[key].items) msg_text.attachments.push(getItemAttachment(destiny_info[key].items[i]));
      else msg_text.attachments.push(getFullActivityAttachment(destiny_info[key]));
    } else return {text: "", replace_original: true};
    
    return msg_text;
  }
  
  
  
// ==============================
// ========== COMMANDS ==========
// ==============================
  
  // ===== /destiny schedule =====
  
  slapp.command('/destiny', "set-s (.*)", (msg, cmd) => {
    var temp = cmd.split(" ");
    if (msg.body.user_id == config.admin_id) setSchedule(msg, temp[1], cmd.substr(6 + temp[1].length));
    return;
  });
  
  slapp.command('/destiny', "del-s (.*)", (msg, cmd) => {
    if (msg.body.user_id == config.admin_id) deleteSchedule(msg, cmd.substr(6));
    return;
  });
  
  slapp.command('/destiny', "list-s", (msg, cmd) => {
    if (msg.body.user_id == config.admin_id) listSchedules(msg);
    return;
  });
  
  // ===== /destiny test =====
  
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
    
  // ===== /destiny update =====
  
  slapp.command('/destiny', "update", (msg, cmd) => {
    if (msg.body.user_id == config.admin_id) {
      setEventTime();
      getDefinitions(getActivities);
    }
    return;
  });
  
  // ===== /destiny post =====
  
  slapp.command('/destiny', "post(.*)", (msg, cmd) => {
    if (msg.body.user_id == config.admin_id) {
      var msg_text = {};
      switch (cmd.substr(5)) {
        case 'full':
        case 'all':
        case 'list':
          msg_text = destiny_list_msg(lang.msg.dest.main, []);
          msg_text.attachments.push(destiny_moreinfo_att(0));
          break;
        case 'daily':
          msg_text = destiny_list_msg(lang.msg.dest.dailyupdate, ['dailychapter', 'dailycrucible']);
          break;
        case 'pve':
          msg_text = destiny_list_msg(lang.msg.dest.main, ['elderchallenge', 'dailychapter', 'heroicstrike', 'nightfall']);
          msg_text.attachments.push(destiny_moreinfo_att(1));
          break;
        case 'raid':
        case 'raids':
          msg_text = destiny_list_msg(lang.msg.dest.main, ['vaultofglass', 'crota', 'kingsfall', 'wrathofthemachine']);
          msg_text.attachments.push(destiny_moreinfo_att(2));
          break;
        case 'pvp':
        case 'crucible':
          msg_text = destiny_list_msg(lang.msg.dest.main, ['dailycrucible', 'weeklycrucible', 'trials']);
          msg_text.attachments.push(destiny_moreinfo_att(3));
          break;
        case 'special':
        case 'events':
        case 'specialevents':
          msg_text = destiny_list_msg(lang.msg.dest.main, ['ironbanner', 'trials', 'srl', 'xur', 'armsday']);
          msg_text.attachments.push(destiny_moreinfo_att(4));
          break;
        case 'elder':
        case 'elderchallenge':
          msg_text = destiny_full_msg("", 'elderchallenge');
          break;
        case 'story':
        case 'dailystory':
        case 'mission':
        case 'dailymission':
        case 'dailychapter':
          msg_text = destiny_full_msg("", 'dailychapter');
          break;
        case 'strikes':
        case 'heroicstrike':
          msg_text = destiny_full_msg("", 'heroicstrike');
          break;
        case 'nightfall':
        case 'nf':
          msg_text = destiny_full_msg("", 'nightfall');
          break;
        case 'vaultofglass':
        case 'vog':
          msg_text = destiny_full_msg("", 'vaultofglass');
          break;
        case 'crota':
          msg_text = destiny_full_msg("", 'crota');
          break;
        case 'kingsfall':
        case 'kf':
          msg_text = destiny_full_msg("", 'kingsfall');
          break;
        case 'wrathofthemachine':
        case 'wotm':
          msg_text = destiny_full_msg("", 'wrathofthemachine');
          break;
        case 'dailycrucible':
          msg_text = destiny_full_msg("", 'dailycrucible');
          break;
        case 'weeklycrucible':
          msg_text = destiny_full_msg("", 'weeklycrucible');
          break;
        case 'ironbanner':
          msg_text = destiny_full_msg("", 'ironbanner');
          break;
        case 'trials':
          msg_text = destiny_full_msg("", 'trials');
          break;
        case 'srl':
          msg_text = destiny_full_msg("", 'srl');
          break;
        case 'xur':
          msg_text = destiny_public_msg("", 'xur');
          break;
        case 'xurfull':
          msg_text = destiny_full_msg("", 'xur', true);
          break;
        case 'armsday':
          msg_text = destiny_public_msg("", 'armsday');
          break;
        case 'armsdayfull':
          msg_text = destiny_full_msg("", 'armsday', true);
          break;
        default:
          msg_text = destiny_summary_msg(lang.msg.dest.main);
          msg_text.attachments.push(destiny_moreinfo_att(0));
          break;
      }

      if ('attachments' in msg_text) {
        msg_text.attachments[msg_text.attachments.length - 1].callback_id = 'destiny_public_moreinfo_callback';
        msg.say(msg_text);
      }
    }
    return;
  });
  
  // ===== /destiny help =====
  
  slapp.command('/destiny', "help", (msg, cmd) => {
    msg.respond(func.generateInfoMsg(lang.msg.dest.help));
    return;
  });
  
  // ===== /destiny <cmd> =====
  
  slapp.command('/destiny', "(.*)", (msg, cmd) => {
    var msg_text = {};
    switch (cmd) {
      case 'full':
      case 'all':
      case 'list':
        msg_text = destiny_list_msg(lang.msg.dest.main, []);
        msg_text.attachments.push(destiny_moreinfo_att(0));
        break;
      case 'daily':
        msg_text = destiny_list_msg(lang.msg.dest.dailyupdate, ['dailychapter', 'dailycrucible']);
        break;
      case 'pve':
        msg_text = destiny_list_msg(lang.msg.dest.main, ['elderchallenge', 'dailychapter', 'heroicstrike', 'nightfall']);
        msg_text.attachments.push(destiny_moreinfo_att(1));
        break;
      case 'raid':
      case 'raids':
        msg_text = destiny_list_msg(lang.msg.dest.main, ['vaultofglass', 'crota', 'kingsfall', 'wrathofthemachine']);
        msg_text.attachments.push(destiny_moreinfo_att(2));
        break;
      case 'pvp':
      case 'crucible':
        msg_text = destiny_list_msg(lang.msg.dest.main, ['dailycrucible', 'weeklycrucible', 'trials']);
        msg_text.attachments.push(destiny_moreinfo_att(3));
        break;
      case 'special':
      case 'events':
      case 'specialevents':
        msg_text = destiny_list_msg(lang.msg.dest.main, ['ironbanner', 'trials', 'srl', 'xur', 'armsday']);
        msg_text.attachments.push(destiny_moreinfo_att(4));
        break;
      case 'elder':
      case 'elderchallenge':
      case 'poe':
        msg_text = destiny_full_msg("", 'elderchallenge');
        break;
      case 'story':
      case 'dailystory':
      case 'mission':
      case 'dailymission':
      case 'dailychapter':
        msg_text = destiny_full_msg("", 'dailychapter');
        break;
      case 'strikes':
      case 'heroicstrike':
        msg_text = destiny_full_msg("", 'heroicstrike');
        break;
      case 'nightfall':
      case 'nf':
        msg_text = destiny_full_msg("", 'nightfall');
        break;
      case 'vaultofglass':
      case 'vog':
        msg_text = destiny_full_msg("", 'vaultofglass');
        break;
      case 'crota':
        msg_text = destiny_full_msg("", 'crota');
        break;
      case 'kingsfall':
      case 'kf':
        msg_text = destiny_full_msg("", 'kingsfall');
        break;
      case 'wrathofthemachine':
      case 'wotm':
        msg_text = destiny_full_msg("", 'wrathofthemachine');
        break;
      case 'dailycrucible':
        msg_text = destiny_full_msg("", 'dailycrucible');
        break;
      case 'weeklycrucible':
        msg_text = destiny_full_msg("", 'weeklycrucible');
        break;
      case 'ironbanner':
        msg_text = destiny_full_msg("", 'ironbanner');
        break;
      case 'trials':
        msg_text = destiny_full_msg("", 'trials');
        break;
      case 'srl':
        msg_text = destiny_full_msg("", 'srl');
        break;
      case 'xur':
        msg_text = destiny_full_msg("", 'xur', true);
        break;
      case 'armsday':
        msg_text = destiny_full_msg("", 'armsday', true);
        break;
      default:
        msg_text = destiny_summary_msg(lang.msg.dest.main);
        msg_text.attachments.push(destiny_moreinfo_att(0));
        break;
    }
    
    if ('attachments' in msg_text) msg_text.attachments.push(destiny_dismiss_att);
    else msg_text = func.generateInfoMsg(lang.msg.dest.notactive);
    msg.respond(msg_text);
    return;
  });
  
  // ===== button callbacks =====
  
  slapp.action('destiny_moreinfo_callback', (msg) => {
    var msg_text = {};
    switch (msg.body.actions[0].name) {
      case 'summary':
        msg_text = destiny_summary_msg(lang.msg.dest.main);
        msg_text.attachments.push(destiny_moreinfo_att(0));
        break;
      case 'pve':
        msg_text = destiny_list_msg(lang.msg.dest.main, ['elderchallenge', 'dailychapter', 'heroicstrike', 'nightfall']);
        msg_text.attachments.push(destiny_moreinfo_att(1));
        break;
      case 'raids':
        msg_text = destiny_list_msg(lang.msg.dest.main, ['vaultofglass', 'crota', 'kingsfall', 'wrathofthemachine']);
        msg_text.attachments.push(destiny_moreinfo_att(2));
        break;
      case 'pvp':
        msg_text = destiny_list_msg(lang.msg.dest.main, ['dailycrucible', 'weeklycrucible', 'ironbanner', 'trials']);
        msg_text.attachments.push(destiny_moreinfo_att(3));
        break;
      case 'special':
        msg_text = destiny_list_msg(lang.msg.dest.main, ['ironbanner', 'trials', 'srl', 'xur', 'armsday']);
        msg_text.attachments.push(destiny_moreinfo_att(4));
        break;
    }
    
    if (msg_text.attachments.length == 1) msg_text.attachments.unshift({text: lang.msg.dest.noactivities, fallback: lang.msg.dest.noactivities});
    msg_text.attachments.push(destiny_dismiss_att);
    msg.respond(msg_text);
    return;
  });
  
  slapp.action('destiny_public_moreinfo_callback', (msg) => {
    var msg_text = {};
    switch (msg.body.actions[0].name) {
      case 'summary':
        msg_text = destiny_summary_msg(lang.msg.dest.main);
        msg_text.attachments.push(destiny_moreinfo_att(0));
        break;
      case 'pve':
        msg_text = destiny_list_msg(lang.msg.dest.main, ['elderchallenge', 'dailychapter', 'heroicstrike', 'nightfall']);
        msg_text.attachments.push(destiny_moreinfo_att(1));
        break;
      case 'raids':
        msg_text = destiny_list_msg(lang.msg.dest.main, ['vaultofglass', 'crota', 'kingsfall', 'wrathofthemachine']);
        msg_text.attachments.push(destiny_moreinfo_att(2));
        break;
      case 'pvp':
        msg_text = destiny_list_msg(lang.msg.dest.main, ['dailycrucible', 'weeklycrucible', 'ironbanner', 'trials']);
        msg_text.attachments.push(destiny_moreinfo_att(3));
        break;
      case 'special':
        msg_text = destiny_list_msg(lang.msg.dest.main, ['ironbanner', 'trials', 'srl', 'xur', 'armsday']);
        msg_text.attachments.push(destiny_moreinfo_att(4));
        break;
      case 'xur':
        msg_text = destiny_full_msg("", 'xur', true);
        break;
      case 'armsday':
        msg_text = destiny_full_msg("", 'armsday', true);
        break;
      default:
        return;
    }
    
    if ('attachments' in msg_text) {
      if (msg_text.attachments.length <= 1) msg_text.attachments.unshift({text: lang.msg.dest.noactivities, fallback: lang.msg.dest.noactivities});
      msg_text.attachments.push(destiny_dismiss_att);
    } else msg_text = func.generateInfoMsg(lang.msg.dest.notactive);
    msg_text.replace_original = false;
    msg.respond(msg_text);
    return;
  });
  
  // ===== External update triggers =====
  
  slapp.event('destiny_daily_update', (msg) => {
    getActivities();
    return;
  });
  
  slapp.event('destiny_weekly_update', (msg) => {
    getActivities(function(){
      var msg_text = destiny_summary_msg(lang.msg.dest.weeklyreset);
      msg_text.attachments.push(destiny_moreinfo_att(0));
      msg_text.attachments[msg_text.attachments.length - 1].callback_id = 'destiny_public_moreinfo_callback';
      msg_text.channel = config.destiny_ch;
      msg.say(msg_text);
    });
    return;
  });
  
  slapp.event('destiny_ironbanner_update', (msg) => {
    getActivities(function(){
      var msg_text = destiny_full_msg(lang.msg.dest.ironbannerupdate, 'ironbanner');
      msg_text.channel = config.destiny_ch;
      msg.say(msg_text);
    });
    return;
  });
  
  slapp.event('destiny_armsday_update', (msg) => {
    var msg_text = destiny_public_msg(lang.msg.dest.armsdayupdate, 'armsday');
    msg_text.channel = config.destiny_ch;
    msg.say(msg_text);
    return;
  });
  
  slapp.event('destiny_xur_update', (msg) => {
    var msg_text = destiny_public_msg(lang.msg.dest.xurupdate, 'xur');
    msg_text.channel = config.destiny_ch;
    msg.say(msg_text);
    return;
  });
  
  slapp.event('destiny_trials_update', (msg) => {
    getActivities(function(){
      var msg_text = destiny_full_msg(lang.msg.dest.trialsupdate, 'trials', false);
      msg_text.channel = config.destiny_ch;
      msg.say(msg_text);
    });
    return;
  });
  
  return module;
};
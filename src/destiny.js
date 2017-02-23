// ==============================
// ========== PREAMBLE ==========
// ==============================

'use strict';

const https = require('https');
const needle = require('needle');

var destiny_info = {},
    destiny_def = {},
    destiny_activities = {};



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
        destiny_def.activity = JSON.parse(body);
      });
    });
  }
  
  function getPlaceDef () {
    https.get('https://destiny.plumbing/' + config.lang + '/raw/DestinyPlaceDefinition.json', function(res) {
      var body = "";
      res.on('data', function(d) {
        body += d;
      });
      res.on('end', function() {
        destiny_def.place = JSON.parse(body);
      });
    });
  }
  
  function getItemDef () {
    https.get('https://destiny.plumbing/' + config.lang + '/items/All.json', function(res) {
      var body = "";
      res.on('data', function(d) {
        body += d;
      });
      res.on('end', function() {
        destiny_def.item = JSON.parse(body);
      });
    });
  }
  
  function getPerkDef () {
    https.get('https://destiny.plumbing/' + config.lang + '/raw/DestinySandboxPerkDefinition.json', function(res) {
      var body = "";
      res.on('data', function(d) {
        body += d;
      });
      res.on('end', function() {
        destiny_def.perk = JSON.parse(body);
      });
    });
  }
  
  function getDefinitions () {
    getActivityDef();
    getPlaceDef();
    getItemDef();
    //getPerkDef();
  }
  getDefinitions();
  
  function getActivities () {
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
        if (destiny_activities.xur.status.active) getXurItems();
        else prepareData();
      });
    });
  }
  setTimeout(getActivities, 2000);
  
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
        prepareData();
        destiny_info.xur.items = JSON.parse(body).Response.data.saleItemCategories[2].saleItems;
      });
    });
  }
  
  
  
// ================================
// ========== SCHEDULING ==========
// ================================
  
  // destiny_daily_update YmRmMjYzM2RmMmVlNDlhYWEwMmZiYjYxODMyNGNjODN8MzAgOSAqICogMCwxLDMsNCw2ICo=
  // destiny_weekly_update OWE3ODVkYTYwNTVhNDY1ZTg2NTEwNzJhYTM5NDIzZjF8MzAgOSAqICogMiAq
  // destiny_weekend_update ZjVjNjUzNjQ3ZWY3NDk0ZGFjNDAzM2MzY2NlZjA5ZDh8MzAgOSAqICogNSAq
  
  function setSchedule (msg) {
    let ts = Date.now() + '';
    var data = {
      //schedule: "30 9 * * 0,1,3,4,6 *",
      //schedule: "30 9 * * 2 *",
      schedule: "30 18 * * 5 *",
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
          type: 'destiny_weekend_update',
          payload: "destiny_weekend_update",
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
      else console.log(resp.body);
    });
  }
  
  function deleteSchedule (msg, id) {
    var headers = {
      headers: {
        Authorization: 'Bearer ' + config.bb_token
      },
      json: true
    };
    needle.delete('https://beepboophq.com/api/v1/chronos/tasks/' + id, null, headers, (err, resp) => {
      if (resp.statusCode !== 201) console.log(resp.statusCode);
      if (err) console.log(err);
      else console.log(resp.body);
    });
  }
  
  function listSchedule (msg) {
    var headers = {
      headers: {
        Authorization: 'Bearer ' + config.bb_token
      },
      json: true
    };
    needle.get('https://beepboophq.com/api/v1/chronos/tasks', headers, (err, resp) => {
      if (resp.statusCode !== 201) console.log(resp.statusCode);
      if (err) console.log(err);
      else console.log(resp.body);
    });
  }
  
  
  
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
        name: destiny_def.item[itemhash].itemName
      });
    }
    
    return items;
  }
  
  function prepareData () {
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
      icon: 'https://bungie.net' + destiny_activities.ironbanner.display.icon,
      title: destiny_def.activity[destiny_activities.ironbanner.display.activityHash].activityName,
      active: destiny_activities.ironbanner.status.active,
      expirationDate: destiny_activities.ironbanner.status.expirationDate || 0,
      insummary: true,
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
      text += arr[i].name;
      if (i < arr.length - 1) text += ", ";
    }
    return text;
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
    else if ('loc' in act) text = act.loc;
    
    var time = "";
    if (act.expirationDate != 0) time = lang.msg.dest.activetill + " " + moment(act.expirationDate).format('dd, D.M.YYYY HH:mm');
    
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
      title: act.skulls.title,
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
    if ('items' in act) fields.push({
      value: listItems(act.items),
      short: false
    });
    
    var time = "";
    if (act.expirationDate != 0) time = lang.msg.dest.activetill + " " + moment(act.expirationDate).format('dd, D.M.YYYY HH:mm');
    
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
  
  function destiny_full_msg (text, key) {
    var msg_text = {
      text: text,
      attachments: [],
      response_type: 'ephemeral',
      replace_original: true
    };
    
    if (destiny_info.hasOwnProperty(key) && destiny_info[key].active) msg_text.attachments.push(getFullActivityAttachment(destiny_info[key]));
    else return {text: "", replace_original: true};
    
    return msg_text;
  }
  
  function postToChannel (msg) {
    slapp.client.chat.postMessage({
      token: config.bot_token,
      channel: config.destiny_ch,
      text: msg.text,
      attachments: msg.attachments,
      parse: 'full',
      as_user: true
    }, (err, data) => {
      if (err) console.log("ERROR: Unable to post to destiny channel (" + err + ")");
    });
  }
  
  
  
// ==============================
// ========== COMMANDS ==========
// ==============================
  
  // ===== /destiny post =====
  
  slapp.command('/destiny', "post", (msg, cmd) => {
    if (msg.body.user_id == config.admin_id) {
      var msg_text = destiny_summary_msg(lang.msg.dest.main);
      msg_text.attachments.push(destiny_moreinfo_att);
      msg.say(msg_text);
    }
    return;
  });
  
  // ===== /destiny update =====
  
  slapp.command('/destiny', "update", (msg, cmd) => {
    if (msg.body.user_id == config.admin_id) getActivities();
    return;
  });
  
  // ===== /destiny schedule =====
  
  slapp.command('/destiny', "set-s", (msg, cmd) => {
    if (msg.body.user_id == config.admin_id) setSchedule(msg);
    return;
  });
  
  slapp.command('/destiny', "del-s (.*)", (msg, cmd) => {
    if (msg.body.user_id == config.admin_id) deleteSchedule(msg, cmd.substr(6));
    return;
  });
  
  slapp.command('/destiny', "list-s", (msg, cmd) => {
    if (msg.body.user_id == config.admin_id) listSchedule(msg);
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
        msg_text = destiny_list_msg(lang.msg.dest.main, ['dailycrucible', 'weeklycrucible', 'ironbanner', 'trials']);
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
        msg_text = destiny_full_msg("", 'xur');
        break;
      case 'armsday':
        msg_text = destiny_full_msg("", 'armsday');
        break;
      default:
        return;
    }
    
    if ('attachments' in msg_text) msg_text.attachments.push(destiny_dismiss_att);
    msg.respond(msg_text);
    return;
  });
  
  // ===== /destiny =====
  
  slapp.command('/destiny', (msg) => {
    var msg_text = destiny_summary_msg(lang.msg.dest.main);
    msg_text.attachments.push(destiny_moreinfo_att(0));
    msg_text.attachments.push(destiny_dismiss_att);
    msg.respond(msg_text);
    return;
  });
  
  // ===== External update triggers =====
  
  slapp.event('destiny_daily_update', (msg) => {
    getActivities();
  });
  
  slapp.event('destiny_weekly_update', (msg) => {
    getActivities();
    setTimeout(function(){
      var msg_text = destiny_summary_msg(lang.msg.dest.weeklyreset);
      msg_text.attachments.push(destiny_moreinfo_att(0));
      postToChannel(msg_text);
    }, 2000);
  });
  
  slapp.event('destiny_weekend_update', (msg) => {
    getActivities();
    setTimeout(function(){
      var msg_text = destiny_list_msg(lang.msg.dest.weekendupdate, ['trials', 'xur']);
      msg_text.attachments.push(destiny_moreinfo_att(0));
      postToChannel(msg_text);
    }, 2000);
  });
  
  // ===== moreinfo callback =====
  
  slapp.action('destiny_moreinfo_callback', (msg) => {
    
    // TODO
    
    
    return;
  });
  
  return module;
};
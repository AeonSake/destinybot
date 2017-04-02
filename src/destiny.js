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
        schedule: "15 9 * * 0,1,4,6 *"
      },
      weekly: {
        name: "destiny_weekly_update",
        schedule: "15 9 * * 2 *"
      },
      special: {//DST dependent
        name: "destiny_special_update",
        schedule: "15 # * * 2 *"
      },
      armsday: {
        name: "destiny_armsday_update",
        schedule: "15 9 * * 3 *"
      },
      xur: {
        name: "destiny_xur_update",
        schedule: "15 9 * * 5 *"
      },
      trials: {//DST dependent
        name: "destiny_trials_update",
        schedule: "15 # * * 5 *"
      }
    },
    destiny_colors = {
      weeklystory: "#577DBC",
      heroicstrike: "#577DBC",
      nightfall: "#577DBC",
      elderchallenge: "#41584A",
      weeklyfeaturedraid: "#C3BCB4",
      vaultofglass: "#C3BCB4",
      crota: "#C3BCB4",
      kingsfall: "#C3BCB4",
      wrathofthemachine: "#C3BCB4",
      weeklycrucible: "#A53531",
      ironbanner: "#AC7E54",
      trials: "#F8DC63",
      armsday: "#727272",
      xur: "#333333"
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
        if (typeof callback === 'function') callback();
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
        if (typeof callback === 'function') callback();
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
        if (typeof callback === 'function') callback();
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
        if (typeof callback === 'function') callback();
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
        if (typeof callback === 'function') callback();
      });
    });
  }
  
  function getDefinitions (callback) {
    getActivityDef(function(){
      getPlaceDef(function(){
        getItemDef(function(){
          getStatDef(function(){
            getPerkDef(function(){
              if (typeof callback === 'function') callback();
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
        else generateAttachments(callback);
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
        generateAttachments(function(){
          destiny_info.xur.short.text = getItems(JSON.parse(body).Response.data.saleItemCategories[2].saleItems);
          destiny_info.xur.full = destiny_info.xur.full.concat(getItemsFull(JSON.parse(body).Response.data.saleItemCategories[2].saleItems));
          console.log("INFO: Destiny | Xûr items loaded");
          if (typeof callback === 'function') callback();
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
          type: event_id,
          payload: event_id,
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
      else if (typeof callback === 'function') callback(resp.body);
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
      if (resp.statusCode !== 200) console.log(resp.statusCode);
      if (err) console.log(err);
      else if (typeof callback === 'function') callback(resp.body);
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
      if (resp.statusCode !== 200) console.log(resp.statusCode);
      if (err) console.log(err);
      else if (typeof callback === 'function') callback(resp.body);
    });
  }
  
  function resetSchedules (msg) {
    listSchedules(msg, function(data) {
      for (var i in data.results) {
        if (/destiny_(.*)_update/.test(data.results[i].payload.event.type)) deleteSchedule(msg, data.results[i].id);
      }
      setScheduleTimes();
      for (var key in destiny_schedules) {
        if (destiny_schedules.hasOwnProperty(key)) setSchedule(msg, destiny_schedules[key].name, destiny_schedules[key].schedule, function(newdata) {
          destiny_schedules[key].id = JSON.parse(newdata).id;
        });
      }
    });
  }
  
  function setScheduleTimes () {
    for (var key in destiny_schedules) {
      destiny_schedules[key].schedule = destiny_schedules[key].schedule.replace("#", (moment().tz("America/Los_Angeles").isDST() ? "18" : "19"));
    }
  }
  
  setScheduleTimes();
  
  
  
// ==================================
// ========== PREPARE DATA ==========
// ==================================
  
  function getSkulls (arr) {
    var skulls = "";
    
    for (var i in arr) {
      for (var j in arr[i].skulls) skulls += arr[i].skulls[j].displayName + ", ";
    }
    if (skulls.length != 0) skulls = skulls.slice(0, -2);
    
    return skulls;
  }
  
  function getSkullsFull (arr) {
    var skulls = "";
    
    for (var i in arr) {
      for (var j in arr[i].skulls) {
        skulls += "*" + arr[i].skulls[j].displayName + "* : " + arr[i].skulls[j].description + "\n";
      }
    }
    
    return skulls;
  }
  
  function getItems (arr) {
    var items = "";
    
    for (var i in arr) {
      if ('item' in arr[i]) items += "<https://www.bungie.net/de/Armory/Detail?item=" + arr[i].item.itemHash + "|" + destiny_def.item[arr[i].item.itemHash].itemName + ">";
      if (i < arr.length - 1) items += "\n";
    }
    
    return items;
  }
  
  function getItemsFull (arr) {
    var items = [];
    
    for (var i in arr) {
      if ('item' in arr[i]) {
        var itemhash = arr[i].item.itemHash,
            statinfo = getStats(arr[i].item.stats, destiny_def.item[itemhash].itemCategoryHashes[1]),
            perkinfo = getPerks(arr[i].item.perks),
            fields = [],
            stats = "",
            perks = "";
        
        for (var j in statinfo) {
          if (statinfo.length == 3 && statinfo[j].value != 0) {
            var max = statinfo[j].max;
            if (statinfo.filter(function(k) { return k.value != 0 }).length == 1) max *= 2;
            stats += statinfo[j].name + " : " + statinfo[j].value + " (" + Math.round((statinfo[j].value / max) * 100) + "%)\n";
          } else stats += statinfo[j].name + " : " + statinfo[j].value + "\n";
        }
        if (stats.length != 0) fields.push({title: lang.msg.dest.stats, value: stats, short: true});

        for (var j in perkinfo) perks += perkinfo[j].name + "\n";
        if (perks.length != 0) fields.push({title: lang.msg.dest.perks, value: perks, short: true});
        
        fields.push({
          title: lang.msg.dest.price,
          value: getCosts(arr[i].costs),
          short: true
        });
        
        items.push({
          title: destiny_def.item[itemhash].itemName,
          title_link: "https://www.bungie.net/de/Armory/Detail?item=" + itemhash,
          text: destiny_def.item[itemhash].tierTypeName + (getClass(destiny_def.item[itemhash].itemCategoryHashes[0]) == 0 ? "" : " | " + getClass(destiny_def.item[itemhash].itemCategoryHashes[0])) + " | " + destiny_def.item[itemhash].itemTypeName,
          fallback: destiny_def.item[itemhash].itemName,
          fields: fields,
          color: func.getRandomColor(),
          mrkdwn_in: ['text', 'pretext', 'fields']
        });
      }
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
  
  function getRewards (arr) {
    var rewards = "";
    
    for (var i in arr) {
      for (var j in arr[i].rewardItems) {
        rewards += (arr[i].rewardItems[j].value > 0 ? arr[i].rewardItems[j].value + "x " : "") + destiny_def.item[arr[i].rewardItems[j].itemHash].itemName + "\n";
      }
    }
    
    return rewards;
  }
  
  function getCosts (arr) {
    var costs = "";
    
    for (var i in arr) {
      costs += (arr[i].value > 0 ? arr[i].value + "x " : "") + destiny_def.item[arr[i].itemHash].itemName + "\n";
    }
    
    return costs;
  }
  
  function generateAttachments (callback) {
    destiny_info = {};
    
    for (var key in destiny_activities) {
      if (destiny_activities.hasOwnProperty(key) && 'status' in destiny_activities[key] && destiny_activities[key].status.active) {
        var act = destiny_activities[key],
            author = "",
            title = "",
            text = "",
            text_full = "",
            fields = [],
            time = "",
            color = (destiny_colors.hasOwnProperty(key) ? destiny_colors[key] : "");
        
        if ('display' in act) {
          if ('activityHash' in act.display && act.display.advisorTypeCategory != destiny_def.activity[act.display.activityHash].activityName) {
            author = act.display.advisorTypeCategory;
            title = destiny_def.activity[act.display.activityHash].activityName;
          } else title = act.display.advisorTypeCategory;
          
          if ('placeHash' in act.display) text_full += destiny_def.place[act.display.placeHash].placeName + "\n";
          if ('activityHash' in act.display) text_full += destiny_def.activity[act.display.activityHash].activityDescription + "\n";
        }
        
        if ('extended' in act) {
          if ('skullCategories' in act.extended && act.extended.skullCategories.length != 0) {
            text += getSkulls(act.extended.skullCategories) + "\n";
            fields.push({
              title: act.extended.skullCategories[0].title,
              value: getSkullsFull(act.extended.skullCategories),
              short: false
            });
          }
          if ('orders' in act.extended && act.extended.orders.length != 0) text += getItems(act.extended.orders);
        }
        
        if ('activityTiers' in act) {
          if ('skullCategories' in act.activityTiers[act.activityTiers.length - 1]) text += getSkulls(act.activityTiers[act.activityTiers.length - 1].skullCategories) + "\n";
        }
        
        if (act.expirationDate != 0) time = lang.msg.dest.activetill + " " + moment(act.expirationDate).format(lang.msg.dest.dateformat);
        
        destiny_info[key] = {
          short: {
            author_name: author,
            title: title,
            text: text,
            fallback: title,
            footer: time,
            color: color,
            mrkdwn_in: ['text', 'pretext', 'fields']
          },
          full: [{
            author_name: author,
            title: title,
            text: text_full,
            fallback: title,
            fields: fields,
            footer: time,
            color: color,
            mrkdwn_in: ['text', 'pretext', 'fields']
          }]
        };
        
        if ('activityTiers' in act) {
          for (var i in act.activityTiers) {
            let fields = [];
            
            if ('skullCategories' in act.activityTiers[i] && act.activityTiers[i].skullCategories.length != 0) fields.push({
              title: act.activityTiers[i].skullCategories[0].title,
              value: getSkullsFull(act.activityTiers[i].skullCategories),
              short: false
            });
            if ('activityData' in act.activityTiers[i]) fields.push({
              title: lang.msg.dest.recom,
              value: lang.msg.dest.level + " " + act.activityTiers[i].activityData.displayLevel + "\n" + lang.msg.dest.light + " " + act.activityTiers[i].activityData.recommendedLight,
              short: true
            });
            if ('rewards' in act.activityTiers[i] && act.activityTiers[i].rewards.length != 0) fields.push({
              title: lang.msg.dest.rewards,
              value: getRewards(act.activityTiers[i].rewards),
              short: true
            });
            
            destiny_info[key].full.push({
              title: act.activityTiers[i].tierDisplayName || "",
              text: "",
              fallback: "",
              fields: fields,
              color: destiny_info[key].full[0].color,
              mrkdwn_in: ['text', 'pretext', 'fields']
            });
          }
        }
        
        if ('extended' in act && 'orders' in act.extended && act.extended.orders.length != 0) destiny_info[key].full = destiny_info[key].full.concat(getItemsFull(act.extended.orders));
      }
    }
    
    //assign colors
    
    if (typeof callback === 'function') callback();
  }
    
  
  
// ==============================
// ========== MESSAGES ==========
// ==============================
  
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
  
  function destiny_list_msg (text, keys) {
    var msg_text = {
      text: text,
      attachments: [],
      response_type: 'ephemeral',
      replace_original: true
    };
    
    if (keys.length != 0) {
      for (var i in keys) {
        if (destiny_info.hasOwnProperty(keys[i])) msg_text.attachments.push(destiny_info[keys[i]].short);
      }
    } else {
      for (var key in destiny_info) {
        if (destiny_info.hasOwnProperty(key)) msg_text.attachments.push(destiny_info[key].short);
      }
    }
    
    return msg_text;
  }
  
  function destiny_summary_msg () {    
    return destiny_list_msg(lang.msg.dest.main, ['weeklystory', 'heroicstrike', 'nightfall', 'elderchallenge', 'weeklyfeaturedraid', 'weeklycrucible', 'ironbanner', 'armsday', 'xur', 'trials']);
  }
  
  function destiny_single_msg (text, key, short) {
    var msg_text = {
      text: text,
      attachments: [],
      response_type: 'ephemeral',
      replace_original: true
    };
    
    if (destiny_info.hasOwnProperty(key)) {
      if (short) msg_text.attachments.push(destiny_info[key].short);
      else msg_text.attachments = destiny_info[key].full;
    }
    
    return msg_text;
  }
  
  
  
// ==============================
// ========== COMMANDS ==========
// ==============================
  
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
      resetSchedules(msg);
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
        case 'pve':
          msg_text = destiny_list_msg(lang.msg.dest.main, ['elderchallenge', 'weeklystory', 'heroicstrike', 'nightfall']);
          msg_text.attachments.push(destiny_moreinfo_att(1));
          break;
        case 'raid':
        case 'raids':
          msg_text = destiny_list_msg(lang.msg.dest.main, ['weeklyfeaturedraid', 'vaultofglass', 'crota', 'kingsfall', 'wrathofthemachine']);
          msg_text.attachments.push(destiny_moreinfo_att(2));
          break;
        case 'pvp':
        case 'crucible':
          msg_text = destiny_list_msg(lang.msg.dest.main, ['weeklycrucible', 'trials']);
          msg_text.attachments.push(destiny_moreinfo_att(3));
          break;
        case 'special':
        case 'events':
        case 'specialevents':
          msg_text = destiny_list_msg(lang.msg.dest.main, ['ironbanner', 'armsday', 'xur', 'trials']);
          msg_text.attachments.push(destiny_moreinfo_att(4));
          break;
        case 'elder':
        case 'elderchallenge':
          msg_text = destiny_single_msg("", 'elderchallenge');
          break;
        case 'story':
        case 'weeklystory':
        case 'mission':
        case 'weeklymission':
          msg_text = destiny_single_msg("", 'weeklystory');
          break;
        case 'strikes':
        case 'heroicstrike':
          msg_text = destiny_single_msg("", 'heroicstrike');
          break;
        case 'nightfall':
        case 'nf':
          msg_text = destiny_single_msg("", 'nightfall');
          break;
        case 'weeklyfeaturedraid':
        case 'weeklyraid':
          msg_text = destiny_single_msg("", 'weeklyfeaturedraid');
          break;
        case 'vaultofglass':
        case 'vog':
          msg_text = destiny_single_msg("", 'vaultofglass');
          break;
        case 'crota':
          msg_text = destiny_single_msg("", 'crota');
          break;
        case 'kingsfall':
        case 'kf':
          msg_text = destiny_single_msg("", 'kingsfall');
          break;
        case 'wrathofthemachine':
        case 'wotm':
          msg_text = destiny_single_msg("", 'wrathofthemachine');
          break;
        case 'weeklycrucible':
          msg_text = destiny_single_msg("", 'weeklycrucible');
          break;
        case 'ironbanner':
          msg_text = destiny_single_msg("", 'ironbanner');
          break;
        case 'trials':
          msg_text = destiny_single_msg("", 'trials');
          break;
        case 'srl':
          msg_text = destiny_single_msg("", 'srl');
          break;
        case 'xur':
          msg_text = destiny_single_msg("", 'xur', true);
          if ('attachments' in msg_text) {
            msg_text.attachments[0].callback_id = 'destiny_public_moreinfo_callback';
            msg_text.attachments[0].actions = [{
              name: 'xur',
              text: lang.btn.dest.details,
              type: 'button',
            }];
          }
          break;
        case 'armsday':
          msg_text = destiny_single_msg("", 'armsday', true);
          if ('attachments' in msg_text) {
            msg_text.attachments[0].callback_id = 'destiny_public_moreinfo_callback';
            msg_text.attachments[0].actions = [{
              name: 'armsday',
              text: lang.btn.dest.details,
              type: 'button',
            }];
          }
          break;
        default:
          msg_text = destiny_summary_msg();
          msg_text.attachments.push(destiny_moreinfo_att(0));
          break;
      }

      if ('attachments' in msg_text) msg.say(msg_text);
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
      case 'pve':
        msg_text = destiny_list_msg(lang.msg.dest.main, ['elderchallenge', 'weeklystory', 'heroicstrike', 'nightfall']);
        msg_text.attachments.push(destiny_moreinfo_att(1));
        break;
      case 'raid':
      case 'raids':
        msg_text = destiny_list_msg(lang.msg.dest.main, ['weeklyfeaturedraid', 'vaultofglass', 'crota', 'kingsfall', 'wrathofthemachine']);
        msg_text.attachments.push(destiny_moreinfo_att(2));
        break;
      case 'pvp':
      case 'crucible':
        msg_text = destiny_list_msg(lang.msg.dest.main, ['weeklycrucible', 'trials']);
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
        msg_text = destiny_single_msg("", 'elderchallenge');
        break;
      case 'story':
      case 'weeklystory':
      case 'mission':
      case 'weeklymission':
        msg_text = destiny_single_msg("", 'weeklystory');
        break;
      case 'strikes':
      case 'heroicstrike':
        msg_text = destiny_single_msg("", 'heroicstrike');
        break;
      case 'nightfall':
      case 'nf':
        msg_text = destiny_single_msg("", 'nightfall');
        break;
      case 'weeklyfeaturedraid':
      case 'weeklyraid':
        msg_text = destiny_single_msg("", 'weeklyfeaturedraid');
        break;
      case 'vaultofglass':
      case 'vog':
        msg_text = destiny_single_msg("", 'vaultofglass');
        break;
      case 'crota':
        msg_text = destiny_single_msg("", 'crota');
        break;
      case 'kingsfall':
      case 'kf':
        msg_text = destiny_single_msg("", 'kingsfall');
        break;
      case 'wrathofthemachine':
      case 'wotm':
        msg_text = destiny_single_msg("", 'wrathofthemachine');
        break;
      case 'dailycrucible':
        msg_text = destiny_single_msg("", 'dailycrucible');
        break;
      case 'weeklycrucible':
        msg_text = destiny_single_msg("", 'weeklycrucible');
        break;
      case 'ironbanner':
        msg_text = destiny_single_msg("", 'ironbanner');
        break;
      case 'trials':
        msg_text = destiny_single_msg("", 'trials');
        break;
      case 'srl':
        msg_text = destiny_single_msg("", 'srl');
        break;
      case 'xur':
        msg_text = destiny_single_msg("", 'xur');
        break;
      case 'armsday':
        msg_text = destiny_single_msg("", 'armsday');
        break;
      default:
        msg_text = destiny_summary_msg();
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
        msg_text = destiny_summary_msg();
        msg_text.attachments.push(destiny_moreinfo_att(0));
        break;
      case 'pve':
        msg_text = destiny_list_msg(lang.msg.dest.main, ['elderchallenge', 'weeklystory', 'heroicstrike', 'nightfall']);
        msg_text.attachments.push(destiny_moreinfo_att(1));
        break;
      case 'raids':
        msg_text = destiny_list_msg(lang.msg.dest.main, ['weeklyfeaturedraid', 'vaultofglass', 'crota', 'kingsfall', 'wrathofthemachine']);
        msg_text.attachments.push(destiny_moreinfo_att(2));
        break;
      case 'pvp':
        msg_text = destiny_list_msg(lang.msg.dest.main, ['weeklycrucible', 'ironbanner', 'trials']);
        msg_text.attachments.push(destiny_moreinfo_att(3));
        break;
      case 'special':
        msg_text = destiny_list_msg(lang.msg.dest.main, ['ironbanner', 'srl', 'armsday', 'xur', 'trials']);
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
        msg_text = destiny_summary_msg();
        msg_text.attachments.push(destiny_moreinfo_att(0));
        break;
      case 'pve':
        msg_text = destiny_list_msg(lang.msg.dest.main, ['elderchallenge', 'weeklystory', 'heroicstrike', 'nightfall']);
        msg_text.attachments.push(destiny_moreinfo_att(1));
        break;
      case 'raids':
        msg_text = destiny_list_msg(lang.msg.dest.main, ['weeklyfeaturedraid', 'vaultofglass', 'crota', 'kingsfall', 'wrathofthemachine']);
        msg_text.attachments.push(destiny_moreinfo_att(2));
        break;
      case 'pvp':
        msg_text = destiny_list_msg(lang.msg.dest.main, ['weeklycrucible', 'ironbanner', 'trials']);
        msg_text.attachments.push(destiny_moreinfo_att(3));
        break;
      case 'special':
        msg_text = destiny_list_msg(lang.msg.dest.main, ['ironbanner', 'srl', 'armsday', 'xur', 'trials']);
        msg_text.attachments.push(destiny_moreinfo_att(4));
        break;
      case 'xur':
        msg_text = destiny_single_msg("", 'xur');
        break;
      case 'armsday':
        msg_text = destiny_single_msg("", 'armsday');
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
  
  slapp.event('destiny_special_update', (msg) => {
    getActivities(function(){
      var msg_text = destiny_list_msg(lang.msg.dest.specialupdate, ['ironbanner', 'srl']);
      if ('attachments' in msg_text) {
        msg_text.channel = config.destiny_ch;
        msg.say(msg_text);
      }
    });
    return;
  });
  
  slapp.event('destiny_armsday_update', (msg) => {
    getActivities(function(){
      var msg_text = destiny_single_msg(lang.msg.dest.armsdayupdate, 'armsday', true);
      if ('attachments' in msg_text) {
        msg_text.attachments[0].callback_id = 'destiny_public_moreinfo_callback';
        msg_text.attachments[0].actions = [{
          name: 'armsday',
          text: lang.btn.dest.details,
          type: 'button',
        }];
        msg_text.channel = config.destiny_ch;
        msg.say(msg_text);
      }
    });
    return;
  });
  
  slapp.event('destiny_xur_update', (msg) => {
    getActivities(function(){
      var msg_text = destiny_single_msg(lang.msg.dest.xurupdate, 'xur', true);
      if ('attachments' in msg_text) {
        msg_text.attachments[0].callback_id = 'destiny_public_moreinfo_callback';
        msg_text.attachments[0].actions = [{
          name: 'xur',
          text: lang.btn.dest.details,
          type: 'button',
        }];
        msg_text.channel = config.destiny_ch;
        msg.say(msg_text);
      }
    });
    return;
  });
  
  slapp.event('destiny_trials_update', (msg) => {
    getActivities(function(){
      var msg_text = destiny_single_msg(lang.msg.dest.trialsupdate, 'trials');
      if ('attachments' in msg_text) {
        msg_text.channel = config.destiny_ch;
        msg.say(msg_text);
      }
    });
    return;
  });
  
  return module;
};
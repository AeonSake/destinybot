// ==============================
// ========== PREAMBLE ==========
// ==============================

'use strict';

const needle = require('needle');

var bday_db = {};



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
  let team = app.team;
  
  var module = {};
  
  
  
// ==============================
// ========== MESSAGES ==========
// ==============================

// ===== MAIN =====

  module.bday_main_msg = {
    text: "",
    attachments: [
      {
        text: "",
        fallback: "",
        callback_id: 'bday_main_callback',
        actions: [
          {
            name: 'soon',
            text: lang.btn.bday.soon,
            type: 'button'
          },
          {
            name: 'list',
            text: lang.btn.bday.list,
            type: 'button'
          },
          {
            name: 'edit',
            text: lang.btn.bday.edit,
            type: 'button'
          },
          {
            name: 'help',
            text: lang.btn.showhelp,
            type: 'button'
          }
        ],
        mrkdwn_in: ['text', 'pretext']
      },
      {
        text: "",
        fallback: "",
        callback_id: 'dismiss_callback',
        actions: [
          {
            name: 'dismiss',
            text: lang.btn.dismiss,
            type: 'button'
          }
        ],
        mrkdwn_in: ['text', 'pretext']
      }
    ],
    response_type: 'ephemeral',
    replace_original: true
  };
  
// ===== EDIT =====
  
  function bday_edit_msg (user_id) {
    var day_options = [],
        month_options = [],
        year_options = [],
        date = bday_db[user_id].date,
        day_max = 31;
    
    if ('month' in date) {
      if ('year' in date) day_max = parseInt(moment().set('day', 1).set('month', date.month).set('year', date.year).endOf('month').format("D"));
      else day_max = parseInt(moment().set('day', 1).set('month', date.month).endOf('month').format("D"));
      if (date.day > day_max) bday_db[user_id].date.day = day_max;
    }
    
    for (var i = 1; i <= day_max; i++) day_options.push({text: i, value: i});
    
    for (var i = 0; i <= 11; i++) month_options.push({text: i + 1, value: i});
    
    for (var i = parseInt(moment().format("YYYY")); i > 1900; i--) year_options.push({text: i, value: i});
    
    var actions = [
      {
        name: 'day',
        text: lang.wrd.day,
        type: 'select',
        options: day_options
      },
      {
        name: 'month',
        text: lang.wrd.month,
        type: 'select',
        options: month_options
      },
      {
        name: 'year',
        text: lang.wrd.year,
        type: 'select',
        options: year_options
      }
    ];
    if (('day' in date) && ('month' in date) && ('year' in date)) actions.push({
      name: 'done',
      text: lang.btn.done,
      type: 'button',
      style: 'primary'
    });
    
    if ('day' in date) actions[0].text = date.day;
    if ('month' in date) actions[1].text = date.month + 1;
    if ('year' in date) actions[2].text = date.year;
    
    return {
      text: "",
      attachments: [
        {
          text: lang.msg.bday.edit,
          fallback: lang.msg.bday.edit,
          callback_id: 'bday_edit_callback',
          actions: actions,
          mrkdwn_in: ['text', 'pretext']
        }
      ],
      response_type: 'ephemeral',
      replace_original: true
    }
  }
  
// ===== REMINDER =====
  
  function bday_reminder_msg (user_id) {
    var user = team.getUserInfo(user_id);
    
    return {
      text: "",
      attachments: [
        {
          text: lang.msg.bday.reminder.replace("###", user.real_name + " (<@" + user.id + ">)").replace("%%%", parseInt(moment().format("YYYY")) - parseInt(user.date.year)),
          fallback: lang.msg.bday.reminder.replace("###", user.real_name + " (<@" + user.id + ">)").replace("%%%", parseInt(moment().format("YYYY")) - parseInt(user.date.year)),
          footer: moment().format("dd, D.M.YYYY"),
          color: user.color,
          mrkdwn_in: ['text', 'pretext']
        }
      ],
      replace_original: true,
      channel: config.bday_ch
    }
  }
  
  // ===== MISC =====
  
  var bday_dismiss_att = {
    text: "",
    fallback: "",
    callback_id: 'dismiss_callback',
    actions: [
      {
        name: 'dismiss',
        text: lang.btn.dismiss,
        type: 'button'
      }
    ],
    mrkdwn_in: ['text', 'pretext']
  };
  
  
  
// ===================================
// ========== BDAY DATABASE ==========
// ===================================

  function saveBdayDB () {
    kv.set('bday_db', bday_db, function (err) {
      if (err) console.log("ERROR: Bdays | Unable to save birthday database (" + err + ")");
    });
  }

  function loadBdayDB () {
    kv.get('bday_db', function (err, val) {
      if (err) {
        console.log("ERROR: Bdays | Unable to load birthday database (" + err + ")");
      } else if (typeof val !== "undefined") {
        bday_db = val;
        console.log("INFO: Bdays | Birthday database loaded");
      }
    });
  }
  
  function deleteBdayDB () {
    kv.del('bday_db', function (err) {
      if (err) console.log("WARN: Bdays | Unable to delete birthday database (" + err + ")");
    });
  }
  
  loadBdayDB();
  
  
  
// ================================
// ========== SCHEDULING ==========
// ================================
  
  function setSchedule (msg, user_id) {
    var schedule = bday_db[user_id].date;
    let ts = Date.now() + '';
    var data = {
      //schedule: moment(schedule).add(config.bday_hour, 'h').format(),
      schedule: moment().add(1, 'm').format(),
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
          type: 'bday_schedule_reminder',
          payload: 'event_schedule_reminder',
          user: user_id,
          channel: config.bday_ch
        }
      }
    };
    var headers = {
      headers: {
        Authorization: 'Bearer ' + config.bb_token
      },
      json: true
    };
    
    console.log(data.schedule);
    
    /*needle.post('beepboophq.com/api/v1/chronos/tasks', data, headers, (err, resp) => {
      if (resp.statusCode !== 201) console.log(resp.statusCode);
      if (err) console.log(err);
      else {
        for (var i in bday_db) {
          if (bday_db[i].user_id == user_id) bday_db[i].schedule_id = JSON.parse(resp.body).id;
        }
      };
    });*/
  }
  
  function resetSchedule (msg, user_id) {
    var schedule_id = bday_db[user_id].schedule_id;
    if (schedule_id = "") setSchedule(msg, user_id);
    else {
      var headers = {
        headers: {
          Authorization: 'Bearer ' + config.bb_token
        },
        json: true
      };

      needle.delete('https://beepboophq.com/api/v1/chronos/tasks/' + schedule_id, null, headers, (err, resp) => {
          if (err) console.log(err);
          else if (resp.statusCode !== 200) console.log(resp.statusCode);
          else setSchedule(msg, user_id);
      });
    }
  }
  
  
  
// ==============================
// ========== COMMANDS ==========
// ==============================
  
  // ===== /bday list =====
  
  slapp.command('/bday', "list", (msg, cmd) => {
    
    
    //msg.respond(msg_text);
    return;
  });
  
  // ===== /bday soon =====
  
  slapp.command('/bday', "soon", (msg, cmd) => {
    
    
    //msg.respond(msg_text);
    return;
  });
  
  // ===== /bday edit =====
  
  slapp.command('/bday', "edit", (msg, cmd) => {
    msg.respond(bday_edit_msg(msg.body.user_id));
    return;
  });
  
  slapp.action('bday_edit_callback', (msg) => {
    var key = msg.body.actions[0].name;

    switch (key) {
      case 'day':
        bday_db[msg.body.user.id].date.day = parseInt(msg.body.actions[0].selected_options[0].value);
        break;
      case 'month':
        bday_db[msg.body.user.id].date.month = parseInt(msg.body.actions[0].selected_options[0].value);
        break;
      case 'year':
        bday_db[msg.body.user.id].date.year = parseInt(msg.body.actions[0].selected_options[0].value);
        break;
      case 'done':
        setSchedule(msg, msg.body.user.id);
        saveBdayDB();
        msg.respond({text: "", delete_original: true});
        return;
    }
    
    msg.respond(bday_edit_msg(msg.body.user.id));
    return;
  });
  
  // ===== /bday init =====
  
  slapp.command('/bday', "init", (msg, cmd) => {
    if (msg.body.user_id == config.admin_id) {
      var users = team.getUserList();
      for (var i in users) {
        if (users[i][0] != 'B' && team.isActive(users[i]) && !team.isBot(users[i])) {
          console.log(users[i] + " @" + team.getUserName(users[i]));
          //bday_db[users[i]] = {date: {}, schedule_id: ""};
          //team.sendDM(users[i], bday_edit_msg(users[i]));
        }
      }
      bday_db[config.admin_id] = {date: {}, schedule_id: ""};
      team.sendDM(config.admin_id, bday_edit_msg(config.admin_id));
      saveBdayDB();
    }
    return;
  });
  
  slapp.event('(team_join|user_change)', (msg) => {
  var users = team.getUserList();
    for (var i in users) {
      if (users[i][0] != 'B' && team.isActive(users[i]) && !bday_db.hasOwnProperty(users[i])) {
        console.log(team.getUserName(users[i]));
        //bday_db[users[i]] = {date: {}, schedule_id: ""};
        //team.sendDM(users[i], bday_edit_msg(users[i]));
      }
    }
    saveBdayDB();
    return;
  });
  
  // ===== /poll help =====
  
  slapp.command('/bday', "help", (msg, cmd) => {
    msg.respond(func.generateInfoMsg(lang.msg.bday.help));
    return;
  });
  
  // ===== /bday =====
  
  slapp.command('/bday', "(.*)", (msg, cmd) => {
    msg.respond(module.bday_main_msg);
    return;
  });
  
  slapp.action('bday_main_callback', (msg) => {
    var msg_text = "";
    
    switch (msg.body.actions[0].name) {
      case 'soon':
        break;
      case 'list':
        break;
      case 'edit':
        msg_text = bday_edit_msg(msg.body.user.id);
        break;
      case 'help':
        msg.respond({
          text: lang.msg.bday.help,
          attachments: [bday_dismiss_att],
          response_type: 'ephemeral',
          replace_original: true
        });
        break;
    }
    msg.respond(msg_text);
    return;
  });
  
  // ===== External event schedule trigger =====
  
  slapp.event('bday_schedule_reminder', (msg) => {
    msg.say(bday_reminder_msg(msg.body.event.user));
    return;
  });
  
  return module;
};
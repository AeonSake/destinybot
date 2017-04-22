// ==============================
// ========== PREAMBLE ==========
// ==============================

'use strict';

const needle = require('needle');

var bday_db = [];



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
  
  function bday_edit_msg (user_id, show_done) {
    var day_options = [],
        month_options = [],
        year_options = [],
        date = bday_db[user_id].date,
        day_max = 31;
    
    if ('month' in date) day_max = parseInt(moment().set('day', 1).set('month', date.month).endOf('month').format("M"));
    
    for (var i = 1; i <= day_max; i++) day_options.push({text: i, value: i});
    
    for (var i = 0; i <= 11; i++) month_options.push({text: i, value: i});
    
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
    if (show_done) actions.push({
      name: 'done',
      text: lang.btn.done,
      type: 'button',
      style: 'primary'
    });
    
    if ('day' in date) actions[0].selected_options = [{text: date.day, value: date.day}];
    if ('month' in date) actions[1].selected_options = [{text: date.month, value: date.month}];
    if ('year' in date) actions[2].selected_options = [{text: date.year, value: date.year}];
    
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
    var schedule = {};
    for (var i in bday_db) {
      if (bday_db[i].user_id == user_id) schedule = bday_db[i].date;
    }
    let ts = Date.now() + '';
    var data = {
      schedule: moment(schedule).add(config.bday_hour, 'h').format(),
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
    
    needle.post('beepboophq.com/api/v1/chronos/tasks', data, headers, (err, resp) => {
      if (resp.statusCode !== 201) console.log(resp.statusCode);
      if (err) console.log(err);
      else {
        for (var i in bday_db) {
          if (bday_db[i].user_id == user_id) bday_db[i].schedule_id = JSON.parse(resp.body).id;
        }
      };
    });
  }
  
  function resetSchedule (msg, user_id) {
    var schedule_id = "";
    for (var i in bday_db) {
      if (bday_db[i].user_id == user_id) schedule_id = bday_db[i].schedule_id;
    }
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
  
  // ===== /bday test =====
  
  slapp.command('/bday', "test", (msg, cmd) => {
    if (msg.body.user_id == config.admin_id) bday_db[msg.body.user_id] = {
      date: {},
      schedule_id: ""
    };
    return;
  });
  
  // ===== /bday edit =====
  
  slapp.command('/bday', "edit", (msg, cmd) => {
    var date = bday_db[msg.body.user_id].date;
    msg.respond(bday_edit_msg(msg.body.user_id, ('day' in date) && ('month' in date) && ('year' in date)));
    return;
  });
  
  slapp.action('bday_edit_callback', (msg) => {
    var key = msg.body.actions[0].name,
        date_before = bday_db[msg.body.user.id].date,
        done_before = ('day' in date_before) && ('month' in date_before) && ('year' in date_before);

    switch (key) {
      case 'day':
        bday_db[msg.body.user.id].date.day = parseInt(msg.body.actions[0].selected_options[0].value);
        break;
      case 'month':
        bday_db[msg.body.user.id].date.month = parseInt(msg.body.actions[0].selected_options[0].value) - 1;
        break;
      case 'year':
        bday_db[msg.body.user.id].date.year = parseInt(msg.body.actions[0].selected_options[0].value);
        break;
      case 'done':
        msg.respond({text: "", delete_original: true});
        return;
    }
    
    var date_after = bday_db[msg.body.user.id].date,
        done_after = ('day' in date_after) && ('month' in date_after) && ('year' in date_after);
    
    msg.respond(bday_edit_msg(msg.body.user.id, !done_before && done_after));
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
  
  return module;
};
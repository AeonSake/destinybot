// ==============================
// ========== PREAMBLE ==========
// ==============================

'use strict';
const os = require('os');
const express = require('express');
const Slapp = require('slapp');
const BeepBoopConvoStore = require('slapp-convo-beepboop');
const BeepBoopContext = require('slapp-context-beepboop');
const kv = require('beepboop-persist')();
if (!process.env.PORT) throw Error('PORT missing but required');

var slapp = Slapp({
  record: 'out.jsonl',
  convo_store: BeepBoopConvoStore(),
  context: BeepBoopContext(),
  verify_token: process.env.SLACK_VERIFY_TOKEN,
  log: true,
  colors: true
});

require('beepboop-slapp-presence-polyfill')(slapp, { debug: true });
var app = slapp.attachToExpress(express());

console.log('Listening on :' + process.env.PORT);
app.listen(process.env.PORT);

// ===== TODO =====
// Timezone independent event timing displayment

// ===============================
// ========== VARIABLES ==========
// ===============================

var version_nr = "v4.13.37";
var admin_id = process.env.admin;
var bot_id = process.env.bot_id;
var bot_token = process.env.bot_token;
var app_token = process.env.app_token;

var event_info = [];
var user_info = [];
var event_channel = process.env.event_channel;
var server_time_offset = parseInt(process.env.server_time_offset);

var event_types = ["Raid", "Nightfall", "Strike", "Osiris", "Iron Banner", "PvP", "PvE", "Farmen", "Chat"];
var event_max_members = [0, 2, 3, 6, 12];
var raid_types = ["Gläserne Kammer (Atheon)", "Crotas Ende (Crota)", "Skolas' Rache (Skolas)", "Königsfall (Oryx)", "Zorn der Maschine (SIVA)"];

loadEventInfo();
loadUserInfo();
//getUserInfo();

// Information about the bot on request
slapp.message("\\bwer (bist|bistn) du|who are you|wie (heißt|heisst|haßt|hasst|hast) du|stell (dich|di) (vor|voa)\\b", ['direct_message', 'direct_mention', 'mention'], (msg) => {
  msg.say("Mein Name ist EMBOT - kurz für Event Management Bot.\n© <@" + admin_id + "> // "+ version_nr);
});

// =============================
// ========== METHODS ==========
// =============================

// Method to randomize the border color
function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Container to store event data
function saveEventInfo (evt_id, evt_type, evt_title, evt_date, evt_time, evt_text, evt_members, evt_max_members, evt_creator, evt_ts_created) {
  event_info[event_info.length] = {
    id : evt_id,
    type : evt_type,
    title : evt_title,
    date : evt_date,
    time : evt_time,
    text : evt_text,
    members : evt_members,
    max : evt_max_members,
    creator : evt_creator,
    editor : "",
    ts_created : evt_ts_created,
    ts_edited : 0,
    ts_posted : [],
    ch_posted : [],
    state : 0, //0 = default, 1 = outdated, 2 = deleted, 3 = hidden
    color : getRandomColor()
  };
}

// Method to retrieve data from event container as complete message
function getEventInfo (slot) {
  var msg_text = {
    text : "",
    attachments : [],
    response_type : 'ephemeral',
    delete_original : true
  };
  msg_text.attachments[0] = getEventInfoAttachment(slot);
  return msg_text;
}

// Method to retrieve data from event container as attachment only
function getEventInfoAttachment (slot) {
  var evt_members = "";
  var evt_max_members = "";
  var evt_state_text = ["", "[Outdated]", "[Deleted]", "[Hidden]"];
  
  // List of all event members
  if (event_info[slot].members.length == 0) evt_members = "<none>";
  else {
    for (var i = 0; i < event_info[slot].members.length; i++) {
      evt_members += "<@" + event_info[slot].members[i] + ">";
      if (i + 1 < event_info[slot].members.length) evt_members += ", ";
    }
  }
  if (event_info[slot].max !== 0) evt_max_members = " (max " + event_info[slot].max + ")";
  
  // Build message container
  var msg_text = {
    text : "",
    fallback : "",
    author_name : event_info[slot].type,
    title : event_info[slot].title + " (#" + event_info[slot].id + ")" + evt_state_text[event_info[slot].state],
    text : event_info[slot].text,
    fields : [
      {
        title : "Am " + event_info[slot].date + " um " + event_info[slot].time,
        short : false
      },
      {
        title : "Teilnehmer" + evt_max_members + ":",
        value : evt_members,
        short : false
      }
    ],
    footer : "<@" + event_info[slot].creator + ">",
    ts : event_info[slot].ts_created,
    color : event_info[slot].color,
    mrkdwn_in : ["text", "pretext"]
  };
  return msg_text;
}

// Method to find an event in the container by id
function getSlotNr (evt_id) {
  for (var slot = 0; slot < event_info.length; slot++) {
    if (event_info[slot].id == evt_id) return slot;
  }
  return -1;
}

// Method to get debug info about an event
function getDebugInfo (slot) {
  var evt_members_ids = "";
  var evt_members_names = "";
  var evt_ts_posted = "";
  var evt_ts_posted_unix = "";
  var evt_ch_posted = "";
  
  if (event_info[slot].members.length == 0) evt_members_ids = "<none>";
  else {
    for (var i = 0; i < event_info[slot].members.length; i++) {
      evt_members_ids += event_info[slot].members[i];
      if (i + 1 < event_info[slot].members.length) evt_members_ids += ", ";
    }
  }
  if (event_info[slot].members.length == 0) evt_members_names = "<none>";
  else {
    for (var i = 0; i < event_info[slot].members.length; i++) {
      evt_members_names += "<@" + event_info[slot].members[i] + ">";
      if (i + 1 < event_info[slot].members.length) evt_members_names += ", ";
    }
  }
  
  for (var i = 0; i < event_info[slot].ts_posted.length; i++) {
    evt_ts_posted += event_info[slot].ts_posted[i];
    evt_ts_posted_unix += unixToDatetime(event_info[slot].ts_posted[i]);
    evt_ch_posted += event_info[slot].ch_posted[i];
    
    if (i + 1 < event_info[slot].ts_posted.length) {
      evt_ts_posted += ", ";
      evt_ts_posted_unix += ", ";
      evt_ch_posted += ", ";
    }
  }
  
  // Build message container
  var msg_text = {
    text : "Debug Info für Event #" + event_info[slot].id + ":",
    fallback : "Debug Info für Event #" + event_info[slot].id + ":",
    attachments : [
      {
        text : "",
        fallback : "",
        fields : [
          {
            title : "Slot Nummer:",
            value : slot,
            short : true
          },
          {
            title : "Event Nummer:",
            value : event_info[slot].id,
            short : true
          },
          {
            title : "Typ:",
            value : event_info[slot].type,
            short : true
          },
          {
            title : "Titel:",
            value : event_info[slot].title,
            short : true
          },
          {
            title : "Datum:",
            value : event_info[slot].date,
            short : true
          },
          {
            title : "Zeit:",
            value : event_info[slot].time,
            short : true
          },
          {
            title : "Text:",
            value : event_info[slot].text,
            short : false
          },
          {
            title : "Max. Teilnehmer:",
            value : event_info[slot].max,
            short : true
          },
          {
            title : "Zustand:",
            value : event_info[slot].state,
            short : true
          },
          {
            title : "Teilnehmer IDs:",
            value : evt_members_ids,
            short : false
          },
          {
            title : "Teilnehmer Namen:",
            value : evt_members_names,
            short : false
          },
          {
            title : "Ersteller ID:",
            value : event_info[slot].creator,
            short : true
          },
          {
            title : "Ersteller Name:",
            value : "<@" + event_info[slot].creator + ">",
            short : true
          },
          {
            title : "Erstellungs-TS:",
            value : event_info[slot].ts_created,
            short : true
          },
          {
            title : "Erstellungs-Datum/Zeit:",
            value : unixToDatetime(event_info[slot].ts_created),
            short : true
          },
          {
            title : "Bearbeiter ID:",
            value : event_info[slot].editor,
            short : true
          },
          {
            title : "Bearbeiter Name:",
            value : "<@" + event_info[slot].editor + ">",
            short : true
          },
          {
            title : "Bearbeitungs-TS:",
            value : event_info[slot].ts_edited,
            short : true
          },
          {
            title : "Bearbeitungs-Datum/Zeit:",
            value : unixToDatetime(event_info[slot].ts_edited),
            short : true
          },
          {
            title : "Post-TS:",
            value : evt_ts_posted,
            short : false
          },
          {
            title : "Post-Datum/Zeit:",
            value : evt_ts_posted_unix,
            short : false
          },
          {
            title : "Post-Channel:",
            value : evt_ch_posted,
            short : false
          },
          {
            title : "Post-Farbe:",
            value : event_info[slot].color,
            short : true
          },
        ],
        color : 'danger',
        mrkdwn_in : ["text", "pretext"]
      }
    ]
  };
  return msg_text;
}

// Method to update events
function updateEvent (slot) {
  if (event_info[slot].state == 0) {
    var ts_list = event_info[slot].ts_posted;
    var ch_list = event_info[slot].ch_posted;
    var msg_att = [];
    msg_att[0] = getEventInfoAttachment(slot);
  
    for (var i = 0; i < ts_list.length; i++) {
      slapp.client.chat.update({
        token : bot_token,
        ts : ts_list[i],
        channel : ch_list[i],
        text : "-- Updated --",
        attachments : msg_att,
        parse : "full",
        link_names : 1,
        as_user : true
      }, (err, data) => {
        if (err) console.log(err);
        //else event_info[slot].ts_posted[i] = data.ts;
      });
    }
  } else deleteEvent(slot);
}

//Method to delete events
function deleteEvent (slot) {
  var ts_list = event_info[slot].ts_posted;
  var ch_list = event_info[slot].ch_posted;
  
  for (var i = 0; i < ts_list.length; i++) {
    slapp.client.chat.delete({
      token : bot_token,
      ts : ts_list[i],
      channel : ch_list[i],
      as_user : true
    }, (err, data) => {
      if (err) console.log(err);
    }); 
  }
  
  event_info[slot].ts_posted = [];
  event_info[slot].ch_posted = [];
}

// Method to get the timestamp of a bot message
function getMessageTS (slot, ch_id) {
  var evt_id = event_info[slot].id;
  //var check_text = event_info[slot].title + " (#" + event_info[slot].id + ")";
  var check = new RegExp("^(.*) \\(#" + event_info[slot].id + "\\)$");
  
  slapp.client.channels.history({
    token : app_token,
    channel : ch_id
  }, (err, data) => {
    if (err) console.log(err);
    else {
      var msgs = data.messages;
      for (var i = 0; i < msgs.length; i++) {
        if (msgs[i].bot_id == bot_id && check.test(msgs[i].attachments[0].title)) {
          event_info[slot].ts_posted[event_info[slot].ts_posted.length] = msgs[i].ts;
          event_info[slot].ch_posted[event_info[slot].ch_posted.length] = ch_id;
          return;
        }
      }
    }
  });
}

// Method to save user id and user name
function saveUserInfo (user_id, user_name) {
  var temp = -1;
  for (var i = 0; i < user_info.length; i++) {
    if (user_info[i].id == user_id) {
      temp = i;
      break;
    }
  }
  if (temp == -1) {
    user_info[user_info.length] = {
      id : user_id,
      name : user_name,
      reminders : []
    }
  } else if (user_info[temp].name !== user_name) user_info[temp].name = user_name;
  
  storeUserInfo();
}

// Method to return user name from user id
function getUserNameFromID (user_id) {
  for (var i = 0; i < user_info.length; i++) {
    if (user_info[i].id == user_id) return user_info[i].name;
  }
  return "unknown";
}

// Method to check for valid date
function validateDate (input_date) {
  var date = input_date.split(".");
  if (date[2].length == 2) date[2] = "20" + date[2];
  var check_date = new Date(date[2], date[1] - 1, date[0]);
  
  var now_date = new Date();
  now_date = new Date(now_date.setTime(now_date.getTime() + server_time_offset * 3600000));
  
  if (now_date.setHours(0,0,0,0) <= check_date.getTime()) return true;
  else return false;
}

// Method to check for valid date/time
function validateDateTime (input_date, input_time) {
  var date = input_date.split(".");
  var time = input_time.split(":");
  if (date[2].length == 2) date[2] = "20" + date[2];
  var check_date = new Date(date[2], date[1] - 1, date[0], time[0], time[1], 0, 0);
  
  var now_datetime = new Date();
  now_datetime = now_datetime.setTime(now_datetime.getTime() + server_time_offset * 3600000);
  
  if (now_datetime <= check_date.getTime()) return true;
  else return false;
}

// Method to convert UNIX timestamp to dd.mm.yyyy/hh:mm
function unixToDatetime (unix_ts) {
  if (unix_ts !== 0) {
    var datetime = new Date(unix_ts * 1000);
    var temp1 = datetime.toISOString().split("T");
    var date = temp1[0].split("-");
    var time = temp1[1].split("Z")[0];
  
    return date[2] + "." + date[1] + "." + date[0] + " // " + time + " (UTC)";
  } else return 0;
}

// Method to convert dd.mm.yyyy/hh:mm to UNIX timestamp
function datetimeToUnix (input_date, input_time) {
  var date_list = input_date.split(".");
  if (date_list[2].length == 2) date_list[2] = "20" + date_list[2];
  var time_list = input_time.split(":");
  
  var unix_ts = new Date(date_list[2], date_list[1] - 1, date_list[0], time_list[0], time_list[1]).getTime() / 1000.0;
  return unix_ts;
}

// Method to set reminders
function setReminder (slot, user_id) {
  var msg_text = event_info[slot].type + ": " + event_info[slot].title + " [Mehr Info mit `/event info " + event_info[slot].id + "`]";
  var evt_ts = datetimeToUnix(event_info[slot].date, event_info[slot].time);
  evt_ts = evt_ts - server_time_offset * 3600;
  var user_slot = 0;
  for (var i = 0; i < user_info.length; i++) {
    if (user_info[i].id == user_id) user_slot = i;
  }
  
  slapp.client.reminders.add({
    token : app_token,
    text : msg_text,
    time : evt_ts,
    user : user_id
  }, (err, data) => {
    if (err) console.log(err);
    else {
      user_info[user_slot].reminders[slot] = data.reminder.id;
      storeUserInfo();
    }
  });
}

// Method to delete reminders
function deleteReminder (slot, user_id) {
  var user_slot = 0;
  for (var i = 0; i < user_info.length; i++) {
    if (user_info[i].id == user_id) user_slot = i;
  }
  
  if (user_info[user_slot].reminders[slot] !== null && user_info[user_slot].reminders[slot] !== "") {
    slapp.client.reminders.delete({
      token : app_token,
      reminder : user_info[user_slot].reminders[slot]
    }, (err, data) => {
      if (err) console.log(err);
      user_info[user_slot].reminders[slot] = "";
      storeUserInfo();
    });
  }
}

// Method to delete reminders (when event gets removed completely)
function removeReminder (slot, user_id) {
  var user_slot = 0;
  for (var i = 0; i < user_info.length; i++) {
    if (user_info[i].id == user_id) user_slot = i;
  }
  
  slapp.client.reminders.delete({
    token : app_token,
    reminder : user_info[user_slot].reminders[slot]
  }, (err, data) => {
    if (err) console.log(err);
    user_info[user_slot].reminders.splice(slot, 1);
    storeUserInfo();
  });
}
  
// Method to update reminders
function updateReminder (slot) {
  for (var i = 0; i < event_info[slot].members.length; i++) {
    deleteReminder(slot, event_info[slot].members[i]);
    setReminder(slot, event_info[slot].members[i]);
  }
}

// Method to save event_info
function storeEventInfo () {
  kv.set('event_info', event_info, function (err) {
    if (err) console.log(err);
  });
}

// Method to load event_info
function loadEventInfo () {
  kv.get('event_info', function (err, val) {
    if (err) console.log(err);
    else if (typeof val !== "undefined") event_info = val;
  });
}

// Method to reset event_info
function resetEventInfo () {
  kv.del('event_info', function (err) {
    if (err) console.log(err);
  });
}

// Method to save user_info
function storeUserInfo () {
  kv.set('user_info', user_info, function (err) {
    if (err) console.log(err);
  });
}

// Method to load user_info
function loadUserInfo () {
  kv.get('user_info', function (err, val) {
    if (err) console.log(err);
    else if (typeof val !== "undefined") user_info = val;
  });
}

// Method to reset user_info
function resetUserInfo () {
  kv.del('user_info', function (err) {
    if (err) console.log(err);
  });
}

// Method to clone objects
function cloneObject(input_object) {
  return JSON.parse(JSON.stringify(input_object));
}

// ==================================
// ========== MESSAGE TEXT ==========
// ==================================

var event_empty_text = {
  text : "",
  response_type : 'ephemeral',
  delete_original : true
};

var event_type_text_nb = {
  text : "",
  attachments : [],
  response_type : 'ephemeral',
  delete_original : true
};
var event_type_text = {
  text : "",
  attachments : [],
  response_type : 'ephemeral',
  delete_original : true
};
var event_type_btns_nb = {
  text : "",
  fallback : "",
  callback_id : 'event_type_callback',
  actions : [
    {
      name : "answer",
      text : "Abbrechen",
      type : 'button',
      value : "exit"
    }
  ],
  mrkdwn_in : ["text", "pretext"]
};
var event_type_btns = {
  text : "",
  fallback : "",
  callback_id : 'event_type_callback',
  actions : [
    {
      name : "answer",
      text : "Zurück",
      type : 'button',
      value : "back"
    },
    {
      name : "answer",
      text : "Abbrechen",
      type : 'button',
      value : "exit"
    }
  ],
  mrkdwn_in : ["text", "pretext"]
};
function setEventTypeList () {
  var temp = 0;
  var type_text = "Event-Typ auswählen: `/event <type>`";
  event_type_text_nb.attachments[temp] = {
    text : type_text,
    fallback : type_text,
    mrkdwn_in : ["text", "pretext"]
  }
  event_type_text.attachments[temp] = {
    text : type_text,
    fallback : type_text,
    mrkdwn_in : ["text", "pretext"]
  };
  
  for (var i = 0; i < event_types.length; i++) {
    if (i % 5 == 0) {
      temp++;
      event_type_text_nb.attachments[temp] = {
        text : "",
        fallback : "",
        callback_id : "event_type_callback" + temp,
        actions : []
      };
      event_type_text.attachments[temp] = {
        text : "",
        fallback : "",
        callback_id : "event_type_callback" + temp,
        actions : []
      };
    }
    
    event_type_text_nb.attachments[temp].actions[i % 5] = {
      name : "answer",
      text : event_types[i],
      type : 'button',
      value : event_types[i]
    }
    event_type_text.attachments[temp].actions[i % 5] = {
      name : "answer",
      text : event_types[i],
      type : 'button',
      value : event_types[i]
    }
  }
  event_type_text_nb.attachments[temp + 1] = event_type_btns_nb;
  event_type_text.attachments[temp + 1] = event_type_btns;
  
}
setEventTypeList();

var event_title_text = {
  text : "",
  attachments: [
    {
      text : "Bitte Event-Titel eingeben: `/event <title>`",
      fallback : "Bitte Event-Titel eingeben: `/event <title>`",
      callback_id : 'event_title_callback',
      actions : [
        {
          name : "answer",
          text : "Zurück",
          type : 'button',
          value : "back"
        },
        {
          name : "answer",
          text : "Abbrechen",
          type : 'button',
          value : "exit"
        }
      ],
      mrkdwn_in : ["text", "pretext"]
    }
  ],
  response_type : 'ephemeral',
  delete_original : true
};

var event_date_text = {
  text : "",
  attachments: [
    {
      text : "Bitte Event-Datum eingeben: `/event <date>`\nFormat: `DD.MM.YY` oder `DD.MM.YYYY`",
      fallback : "Bitte Event-Datum eingeben: `/event <date>`\nFormat: `DD.MM.YY` oder `DD.MM.YYYY`",
      callback_id : 'event_date_callback',
      actions : [
        {
          name : "answer",
          text : "Zurück",
          type : 'button',
          value : "back"
        },
        {
          name : "answer",
          text : "Abbrechen",
          type : 'button',
          value : "exit"
        }
      ],
      mrkdwn_in : ["text", "pretext"]
    }
  ],
  response_type : 'ephemeral',
  delete_original : true
};

var event_time_text = {
  text : "",
  attachments: [
    {
      text : "Bitte Event-Zeit eingeben: `/event <time>`\nFormat: `hh:mm`",
      fallback : "Bitte Event-Zeit eingeben: `/event <time>`\nFormat: `hh:mm`",
      callback_id : 'event_time_callback',
      actions : [
        {
          name : "answer",
          text : "Zurück",
          type : 'button',
          value : "back"
        },
        {
          name : "answer",
          text : "Abbrechen",
          type : 'button',
          value : "exit"
        }
      ],
      mrkdwn_in : ["text", "pretext"]
    }
  ],
  response_type : 'ephemeral',
  delete_original : true
};

var event_text_text = {
  text : "",
  attachments: [
    {
      text : "Bitte Event-Beschreibung eingeben: `/event <text>`",
      fallback : "Bitte Event-Beschreibung eingeben: `/event <text>`",
      callback_id : 'event_text_callback',
      actions : [
        {
          name : "answer",
          text : "Zurück",
          type : 'button',
          value : "back"
        },
        {
          name : "answer",
          text : "Abbrechen",
          type : 'button',
          value : "exit"
        }
      ],
      mrkdwn_in : ["text", "pretext"]
    }
  ],
  response_type : 'ephemeral',
  delete_original : true
};

var event_max_text = {
  text : "",
  attachments: [
    {
      text : "Bitte max. Teilnehmeranzahl eingeben: `/event <max>`\n0 : kein Maximum",
      fallback : "Bitte max. Teilnehmeranzahl eingeben: `/event <max>`\n0 : kein Maximum",
      callback_id : 'event_max_callback1',
      actions : [
        {
          name : "answer",
          text : "0",
          type : 'button',
          value : "0"
        },
        {
          name : "answer",
          text : "2",
          type : 'button',
          value : "2"
        },
        {
          name : "answer",
          text : "3",
          type : 'button',
          value : "3"
        },
        {
          name : "answer",
          text : "6",
          type : 'button',
          value : "6"
        },
        {
          name : "answer",
          text : "12",
          type : 'button',
          value : "12"
        }
      ],
      mrkdwn_in : ["text", "pretext"]
    },
    {
      text : "",
      fallback : "",
      callback_id : 'event_max_callback2',
      actions : [
        {
          name : "answer",
          text : "Zurück",
          type : 'button',
          value : "back"
        },
        {
          name : "answer",
          text : "Abbrechen",
          type : 'button',
          value : "exit"
        }
      ],
      mrkdwn_in : ["text", "pretext"]
    }
  ],
  response_type : 'ephemeral',
  delete_original : true
};

var event_remove_text = {
  text : "",
  attachments: [
    {
      text : "Bitte den zu entfernenen Teilnehmer auswählen:",
      fallback : "Bitte den zu entfernenen Teilnehmer auswählen:",
      callback_id : 'event_remove_callback',
      actions : [
        {
          name : "answer",
          text : "Zurück",
          type : 'button',
          value : "back"
        },
        {
          name : "answer",
          text : "Abbrechen",
          type : 'button',
          value : "exit"
        }
      ],
      mrkdwn_in : ["text", "pretext"]
    }
  ],
  response_type : 'ephemeral',
  delete_original : true
};

var event_edit_text = {
  text : "",
  attachments: [
    {},
    {
      text : "Welche Information soll bearbeitet werden?",
      fallback : "Welche Information soll bearbeitet werden?",
      callback_id : 'event_edit_callback1',
      actions : [
        {
          name : "answer",
          text : "Typ",
          type : 'button',
          value : "type"
        },
        {
          name : "answer",
          text : "Titel",
          type : 'button',
          value : "title"
        },
        {
          name : "answer",
          text : "Datum",
          type : 'button',
          value : "date"
        },
        {
          name : "answer",
          text : "Zeit",
          type : 'button',
          value : "time"
        },
        {
          name : "answer",
          text : "Text",
          type : 'button',
          value : "text"
        }
      ],
      mrkdwn_in : ["text", "pretext"]
    },
    {
      text : "",
      fallback : "",
      callback_id : 'event_edit_callback2',
      actions : [
        {
          name : "answer",
          text : "Max. Teilnehmer",
          type : 'button',
          value : "max"
        },
        {
          name : "answer",
          text : "Teilnehmer entfernen",
          type : 'button',
          value : "remove"
        },
        {
          name : "answer",
          text : "Fertig",
          type : 'button',
          style : 'primary',
          value : "exit"
        },
        {
          name : "answer",
          text : "Löschen",
          type : 'button',
          style : 'danger',
          value : "delete"
        }
      ]
    }
  ],
  response_type : 'ephemeral',
  delete_original : true
};

var event_edit_text_admin = {
  text : "Admin Tools:",
  fallback : "Admin Tools:",
  callback_id : 'event_edit_callback3',
  actions : [
    {
      name : "answer",
      text : "Reset",
      type : 'button',
      value : "reset"
    },
    {
      name : "answer",
      text : "Abgelaufen",
      type : 'button',
      value : "outdated"
    },
    {
      name : "answer",
      text : "Versteckt",
      type : 'button',
      value : "hidden"
    },
    {
      name : "answer",
      text : "Debug Info",
      type : 'button',
      value : "debug"
    }
  ],
  mrkdwn_in : ["text", "pretext"]
}

var event_create_final_btns = {
  text : "",
  fallback : "",
  callback_id : 'event_edit_confirm_callback',
  actions : [
    {
      name : "answer",
      text : "Bearbeiten",
      type : 'button',
      value : "edit"
    },
    {
      name : "answer",
      text : "Fertig",
      type : 'button',
      value : "exit"
    },
    {
      name : "answer",
      text : "Hier posten",
      type : 'button',
      value : "post_here"
    },
    {
      name : "answer",
      text : "In #events posten",
      type : 'button',
      style : 'primary',
      value : "post"
    }
  ],
  mrkdwn_in : ["text", "pretext"]
};

var event_delete_text = {
  text : "",
  attachments: [
    {
      text : "Soll der Event wirklich gelöscht werden?",
      fallback : "Soll der Event wirklich gelöscht werden?",
      callback_id : 'event_delete_callback',
      actions : [
        {
          name : "answer",
          text : "Abbrechen",
          type : 'button',
          value : "exit"
        },
        {
          name : "answer",
          text : "Löschen",
          type : 'button',
          style : 'danger',
          value : "delete"
        }
      ],
      mrkdwn_in : ["text", "pretext"]
    }
  ],
  response_type : 'ephemeral',
  delete_original : true
};

var event_hide_btn = {
  text : "",
  fallback : "",
  callback_id : 'event_hide_callback',
  actions : [
    {
      name : "answer",
      text : "Ausblenden",
      type : 'button',
      value : "hide"
    }
  ],
  mrkdwn_in : ["text", "pretext"]
};

// ==============================
// ========== COMMANDS ==========
// ==============================

// ----- /event create -----

slapp.command("/event", "create(.*)", (msg, cmd) => {
  var data = {id : 0, slot : 0, type : "", title : "", date : "", time : "", text : "", max : 0, user : "", create : true, edit : false};
  var check = new RegExp("create [^;]*(;|; )[^;]*(;|; )([0-3]?[0-9])\\.([0-3]?[0-9])\\.([2][0-9])?([0-9]{2})(;|; )([0-2]?[0-9])(\\:|\\.)([0-5]?[0-9])(;|; )[^;]*(;|; )\\d{1,3}(;)?");
    
  saveUserInfo(msg.body.user_id, msg.body.user_name);
  data.user = msg.body.user_id;
  
  if (check.test(cmd) && validateDateTime(cmd.substring(7).split(";")[2], cmd.substring(7).split(";")[3].replace(".", ":"))) {
    var res_text = cmd.substring(7).split(";");
    for (var i = 0; i < res_text.length; i++) {
      res_text[i] = res_text[i].trim();
    }
    
    var date_list = res_text[2].split(".");
    if (date_list[2].length == 2) date_list[2] = "20" + date_list[2];
    res_text[2] = date_list.join(".");
    
    var evt_members = [];
    evt_members[0] = data.user;
    data.id = 1;
    if (event_info.length > 0) data.id = event_info[event_info.length - 1].id + 1;
    saveEventInfo(data.id, res_text[0], res_text[1], res_text[2], res_text[3].replace(".", ":"), res_text[4], evt_members, parseInt(res_text[5]), data.user, msg.body.message_ts);
    
    setReminder(event_info.length - 1, data.user);
    
    var msg_text = getEventInfo(event_info.length - 1);
    msg_text.text = "Vorschau:";
    msg_text.attachments[1] = event_create_final_btns;
    msg_text.attachments[1].text = "`/event post " + data.id + "` benutzen um den Event in anderen Channel zu posten.";
    msg
      .respond(msg_text)
      .route('event_create_final_route', data, 60);
    return;
  } else {
    msg
      .respond(event_type_text_nb)
      .route('event_create_type_route', data, 60);
    return;
  }
});
// -----
slapp.route('event_create_type_route', (msg, data) => {
  if (msg.type == 'event') {
    msg.route('event_create_type_route', data, 60);
    return;
  }
  
  if (msg.type == 'action') {
    if (msg.body.actions[0].value == "exit") {
      msg.respond(msg.body.response_url, event_empty_text);
      return;
    }
    else data.type = msg.body.actions[0].value;
  } else data.type = msg.body.text;
  
  msg
    .respond(msg.body.response_url, event_title_text)
    .route('event_create_title_route', data, 60);
  return;
});
// -----
slapp.route('event_create_title_route', (msg, data) => {
  if (msg.type == 'event') {
    msg.route('event_create_title_route', data, 60);
    return;
  }
  
  data.title = msg.body.text;
  
  if (msg.type == 'action') {
    if (msg.body.actions[0].value == "back") {
      msg
        .respond(msg.body.response_url, event_type_text_nb)
        .route('event_create_type_route', data, 60);
      return;
    } else {
      msg.respond(msg.body.response_url, event_empty_text);
      return;
    }
  } else {
    msg
      .respond(msg.body.response_url, event_date_text)
      .route('event_create_date_route', data, 60);
    return;
  }
});
// -----
slapp.route('event_create_date_route', (msg, data) => {
  if (msg.type == 'event') {
    msg.route('event_create_date_route', data, 60);
    return;
  }
  
  data.date = msg.body.text;
  var check = new RegExp("([0-3]?[0-9])\\.([0-3]?[0-9])\\.([2][0-9])?([0-9]{2})");
  
  if (msg.type == 'action') {
    if (msg.body.actions[0].value == "back") {
      msg
        .respond(msg.body.response_url, event_title_text)
        .route('event_create_title_route', data, 60);
      return;
    } else {
      msg.respond(msg.body.response_url, event_empty_text);
      return;
    }
  } else {
    if (check.test(data.date)) {
      if (validateDate(data.date)) {
        var date_list = data.date.split(".");
        if (date_list[2].length == 2) date_list[2] = "20" + date_list[2];
        data.date = date_list.join(".");
      
        msg
          .respond(msg.body.response_url, event_time_text)
          .route('event_create_time_route', data, 60);
        return;
      } else {
        msg
          .respond(msg.body.response_url, {
            text : "Datum kann nicht in der Vergangenheit liegen. Eingabe wiederholen.",
            delete_original : true
          })
          .route('event_create_date_route', data, 60);
        return;
      }
    } else {
      msg
        .respond(msg.body.response_url, {
          text : "Format-Fehler, Eingabe wiederholen.",
          delete_original : true
        })
        .route('event_create_date_route', data, 60);
      return;
    }
  }
});
// -----
slapp.route('event_create_time_route', (msg, data) => {
  if (msg.type == 'event') {
    msg.route('event_create_time_route', data, 60);
    return;
  }
  
  data.time = msg.body.text.replace(".", ":");
  var check = new RegExp("([0-2]?[0-9])(\\:|\\.)([0-5]?[0-9])");
  
  if (msg.type == 'action') {
    if (msg.body.actions[0].value == "back") {
      msg
        .respond(msg.body.response_url, event_date_text)
        .route('event_create_date_route', data, 60);
      return;
    } else {
      msg.respond(msg.body.response_url, event_empty_text);
      return;
    }
  } else {
    if (check.test(data.time)) {
      if (validateDateTime(data.date, data.time)) {
        msg
          .respond(msg.body.response_url, event_text_text)
          .route('event_create_text_route', data, 60);
        return;
      } else {
        msg
          .respond(msg.body.response_url, {
          text : "Zeit kann nicht in der Vergangenheit liegen. Eingabe wiederholen.",
          delete_original : true
        })
          .route('event_create_time_route', data, 60);
        return;
      }
    } else {
      msg
        .respond(msg.body.response_url, {
          text : "Format-Fehler, Eingabe wiederholen.",
          delete_original : true
        })
        .route('event_create_time_route', data, 60);
      return;
    }
  }
});
// -----
slapp.route('event_create_text_route', (msg, data) => {
  if (msg.type == 'event') {
    msg.route('event_create_text_route', data, 60);
    return;
  }
  
  data.text = msg.body.text;
  
  if (msg.type == 'action') {
    if (msg.body.actions[0].value == "back") {
      msg
        .respond(msg.body.response_url, event_time_text)
        .route('event_create_time_route', data, 60);
      return;
    } else {
      msg.respond(msg.body.response_url, event_empty_text);
      return;
    }
  } else {
    msg
      .respond(msg.body.response_url, event_max_text)
      .route('event_create_max_route', data, 60);
    return;
  }
});
// -----
slapp.route('event_create_max_route', (msg, data) => {
  if (msg.type == 'event') {
    msg.route('event_create_max_route', data, 60);
    return;
  }
  
  if (msg.type == 'action') {
    if (msg.body.actions[0].value == "back") {
      msg
        .respond(msg.body.response_url, event_text_text)
        .route('event_create_text_route', data, 60);
      return;
    } else if (msg.body.actions[0].value !== "back") data.max = msg.body.actions[0].value;
    else {
      msg.respond(msg.body.response_url, event_empty_text);
      return;
    }
  } else {
    data.max = msg.body.text;
    var check = new RegExp("\\d{1,3}");

    if (!check.test(data.max)) {
      msg
        .respond(msg.body.response_url, {
          text : "Format-Fehler, Eingabe wiederholen.",
          delete_original : true
        })
        .route('event_create_max_route', data, 60);
      return;
    }
  }
  
  var evt_members = [];
  evt_members[0] = data.user;
  data.id = 1;
  if (event_info.length > 0) data.id = event_info[event_info.length - 1].id + 1;
  saveEventInfo(data.id, data.type, data.title, data.date, data.time, data.text, evt_members, parseInt(data.max), data.user, msg.body.message_ts);
      
  setReminder(event_info.length - 1, data.user);
  
  var msg_text = getEventInfo(event_info.length - 1);
  msg_text.text = "Vorschau:";
  msg_text.attachments[1] = event_create_final_btns;
  msg_text.attachments[1].text = "`/event post " + data.id + "` benutzen um den Event in anderen Channel zu posten.";
  msg
    .respond(msg.body.response_url, msg_text)
    .route('event_create_final_route', data, 60);
  return;
});
// -----
slapp.route('event_create_final_route', (msg, data) => {
  if (msg.type !== 'action') {
    msg.route('event_create_type_route', data, 60);
    return;
  }
  
  data.slot = getSlotNr(data.id);
  event_info[data.slot].ts_created = msg.body.action_ts;
  storeEventInfo();
  if (msg.body.actions[0].value == "edit") {
    var msg_text = cloneObject(event_edit_text);
    msg_text.attachments[0] = getEventInfoAttachment(data.slot);
    msg_text.attachments[0].text = "Vorschau:";
    if (admin_id == event_info[data.slot].creator) msg_text.attachments[3] = event_edit_text_admin;
    msg
      .respond(msg.body.response_url, msg_text)
      .route('event_edit_select_route', data, 60);
    return;
  } else if (msg.body.actions[0].value == "post") {
    msg.respond(msg.body.response_url, event_empty_text);
    var msg_text = getEventInfo(data.slot);
    msg_text.text = "<@" + event_info[data.slot].creator + "> hat einen neuen Event erstellt:";
    msg_text.channel = event_channel;
    msg.say(msg_text, (err, result) => {
      event_info[data.slot].ts_posted.push(result.ts);
      event_info[data.slot].ch_posted.push(result.channel);
      storeEventInfo();
    });
    return;
  } else if (msg.body.actions[0].value == "post_here") {
    msg.respond(msg.body.response_url, event_empty_text);
    var msg_text = getEventInfo(data.slot);
    msg_text.text = "<@" + event_info[data.slot].creator + "> hat einen neuen Event erstellt:";
    msg.say(msg_text, (err, result) => {
      event_info[data.slot].ts_posted.push(result.ts);
      event_info[data.slot].ch_posted.push(result.channel);
      storeEventInfo();
    });
    return;
  } else if (msg.body.actions[0].value == "exit") {
    msg.respond(msg.body.response_url, event_empty_text);
    return;
  }
});

// ----- /event edit -----

slapp.command("/event", "edit \\d{1,4}", (msg, cmd) => {
  var data = {slot : -1, id : 0, create : false, edit : false};
  data.id = cmd.substring(5);
  var check = new RegExp("\\d{1,4}");
  if (check.test(data.id)) {
    data.slot = getSlotNr(data.id);
    if (data.slot !== -1) {
      if (event_info[data.slot].creator == msg.body.user_id || admin_id == msg.body.user_id) {
        if (event_info[data.slot].state == 0 || admin_id == msg.body.user_id) {
          var msg_text = cloneObject(event_edit_text);
          msg_text.attachments[0] = getEventInfoAttachment(data.slot);
          msg_text.text = "Vorschau:";
          if (admin_id == msg.body.user_id) msg_text.attachments[3] = event_edit_text_admin;
          msg
            .respond(msg_text)
            .route('event_edit_select_route', data, 60);
          return;
        } else msg.respond("Dieser Event kann nicht mehr bearbeitet werden.");
      } else msg.respond("Nur der Ersteller kann diesen Event bearbeiten.");
    } else msg.respond("Ein Event mit dieser ID existiert nicht.");
  } else msg.respond("Bitte eine gültige Event-ID eingeben: `/event edit <id>`");
});
// -----
slapp.route('event_edit_select_route', (msg, data) => {
  if (msg.type !== 'action') msg.route('event_edit_select_route', data, 60);
  
  switch (msg.body.actions[0].value) {
    case "type" :
      msg
        .respond(msg.body.response_url, event_type_text)
        .route('event_edit_type_route', data, 60);
      return;
      break;
    case "title" :
      msg
        .respond(msg.body.response_url, event_title_text)
        .route('event_edit_title_route', data, 60);
      return;
      break;
    case "date" :
      msg
        .respond(msg.body.response_url, event_date_text)
        .route('event_edit_date_route', data, 60);
      return;
      break;
    case "time" :
      msg
        .respond(msg.body.response_url, event_time_text)
        .route('event_edit_time_route', data, 60);
      return;
      break;
    case "text" :
      msg
        .respond(msg.body.response_url, event_text_text)
        .route('event_edit_text_route', data, 60);
      return;
      break;
    case "max" :
      msg
        .respond(msg.body.response_url, event_max_text)
        .route('event_edit_max_route', data, 60);
      return;
      break;
    case "remove" :
      var msg_text = cloneObject(event_remove_text);
      var temp = 0;
      for (var i = 0; i < event_info[data.slot].members.length; i++) {
        if (i % 5 == 0) {
          temp++;
          msg_text.attachments[temp] = {
            text : "",
            fallback : "",
            callback_id : "event_remove_callback" + temp,
            actions : []
          }
        }

        msg_text.attachments[temp].actions[i % 5] = {
          name : "answer",
          text : getUserNameFromID(event_info[data.slot].members[i]),
          type : 'button',
          value : event_info[data.slot].members[i]
        }
      }
      
      msg
        .respond(msg.body.response_url, msg_text)
        .route('event_edit_remove_route', data, 60);
      return;
      break;
    case "delete" :
      msg
        .respond(msg.body.response_url, event_delete_text)
        .route('event_delete_final_route', data, 60);
      return;
      break;
    case "exit" :
      if (data.edit) {
        event_info[data.slot].editor = msg.body.user.id;
        event_info[data.slot].ts_edited = msg.body.action_ts;
        data.edit = false;
        storeEventInfo();
        updateEvent(data.slot);
        updateReminder(data.slot);
      }
      if (data.create) {
        var msg_text = getEventInfo(data.slot);
        msg_text.text = "Vorschau:";
        msg_text.attachments[1] = event_create_final_btns;
        msg_text.attachments[1].text = "`/event post " + data.id + "` benutzen um den Event in anderen Channel zu posten.";
        msg
          .respond(msg.body.response_url, msg_text)
          .route('event_create_final_route', data, 60);
        return;
      }
      msg.respond(msg.body.response_url, event_empty_text);
      return;
      break;
    case "reset" :
      data.edit = true;
      event_info[data.slot].state = 0;
      var msg_text = cloneObject(event_edit_text);
      msg_text.text = "Vorschau:";
      msg_text.attachments[0] = getEventInfoAttachment(data.slot);
      msg_text.attachments[3] = event_edit_text_admin;
      msg
        .respond(msg.body.response_url, msg_text)
        .route('event_edit_select_route', data, 60);
      return;
      break;
    case "outdated" :
      data.edit = true;
      event_info[data.slot].state = 1;
      var msg_text = cloneObject(event_edit_text);
      msg_text.text = "Vorschau:";
      msg_text.attachments[0] = getEventInfoAttachment(data.slot);
      msg_text.attachments[3] = event_edit_text_admin;
      msg
        .respond(msg.body.response_url, msg_text)
        .route('event_edit_select_route', data, 60);
      return;
      break;
    case "hidden" :
      data.edit = true;
      event_info[data.slot].state = 3;
      var msg_text = cloneObject(event_edit_text);
      msg_text.text = "Vorschau:";
      msg_text.attachments[0] = getEventInfoAttachment(data.slot);
      msg_text.attachments[3] = event_edit_text_admin;
      msg
        .respond(msg.body.response_url, msg_text)
        .route('event_edit_select_route', data, 60);
      return;
      break;
    case "debug" :
      var msg_text = getDebugInfo(data.slot);
      msg_text.attachments[1] = event_hide_btn;
      msg.respond(msg.body.response_url, msg_text);
      return;
      break;
    default :
      break;
  }
  return;
});
// -----
slapp.route('event_edit_type_route', (msg, data) => {
  if (msg.type == 'event') {
    msg.route('event_edit_type_route', data, 60);
    return;
  }
  
  if (msg.type == 'action') {
    if (msg.body.actions[0].value == "exit") {
      msg.respond(msg.body.response_url, event_empty_text);
      return;
    } else if (msg.body.actions[0].value !== "back") {
      data.type = msg.body.actions[0].value;
      event_info[data.slot].type = data.type;
      data.edit = true;
    }
  } else {
    data.type = msg.body.text;
    event_info[data.slot].type = data.type;
    data.edit = true;
  }
  
  var msg_text = cloneObject(event_edit_text);
  msg_text.text = "Vorschau:";
  msg_text.attachments[0] = getEventInfoAttachment(data.slot);
  console.log(admin_id);
  console.log(msg.body.user_id);
  if (admin_id == msg.body.user_id) msg_text.attachments[3] = event_edit_text_admin;
  msg
    .respond(msg.body.response_url, msg_text)
    .route('event_edit_select_route', data, 60);
  return;
});
// -----
slapp.route('event_edit_title_route', (msg, data) => {
  if (msg.type == 'event') {
    msg.route('event_edit_title_route', data, 60);
    return;
  }
  
  if (msg.type == 'action') {
    if (msg.body.actions[0].value == "exit") {
      msg.respond(msg.body.response_url, event_empty_text);
      return;
    }
  } else {
    data.title = msg.body.text;
    event_info[data.slot].title = data.title;
    data.edit = true;
  }
  
  var msg_text = cloneObject(event_edit_text);
  msg_text.text = "Vorschau:";
  msg_text.attachments[0] = getEventInfoAttachment(data.slot);
  if (admin_id == msg.body.user_id) msg_text.attachments[3] = event_edit_text_admin;
  msg
    .respond(msg.body.response_url, msg_text)
    .route('event_edit_select_route', data, 60);
  return;
});
// -----
slapp.route('event_edit_date_route', (msg, data) => {
  if (msg.type == 'event') {
    msg.route('event_edit_date_route', data, 60);
    return;
  }
  
  if (msg.type == 'action') {
    if (msg.body.actions[0].value == "exit") {
      msg.respond(msg.body.response_url, event_empty_text);
      return;
    }
  } else {
    var check = new RegExp("([0-3]?[0-9])\\.([0-3]?[0-9])\\.([2][0-9])?([0-9]{2})");
    if (check.test(msg.body.text)) {
      if (validateDate(msg.body.text)) {
        data.date = msg.body.text;
      
        var date_list = data.date.split(".");
        if (date_list[2].length == 2) date_list[2] = "20" + date_list[2];
        data.date = date_list.join(".");
      
        event_info[data.slot].date = data.date;
        data.edit = true;
      } else {
        msg
          .respond("Datum kann nicht in der Vergangenheit liegen. Eingabe wiederholen.")
          .route('event_edit_date_route', data, 60);
        return;
      }
    } else {
      msg
        .respond("Format-Fehler, Eingabe wiederholen.")
        .route('event_edit_date_route', data, 60);
      return;
    }
  }
  
  var msg_text = cloneObject(event_edit_text);
  msg_text.text = "Vorschau:";
  msg_text.attachments[0] = getEventInfoAttachment(data.slot);
  if (admin_id == msg.body.user_id) msg_text.attachments[3] = event_edit_text_admin;
  msg
    .respond(msg.body.response_url, msg_text)
    .route('event_edit_select_route', data, 60);
  return;
});
// -----
slapp.route('event_edit_time_route', (msg, data) => {
  if (msg.type == 'event') {
    msg.route('event_edit_time_route', data, 60);
    return;
  }
  
  if (msg.type == 'action') {
    if (msg.body.actions[0].value == "exit") {
      msg.respond(msg.body.response_url, event_empty_text);
      return;
    }
  } else {
    var check = new RegExp("([0-2]?[0-9])(\\:|\\.)([0-5]?[0-9])");
    if (check.test(msg.body.text)) {
      if (validateDateTime(event_info[data.slot].date, msg.body.text.replace(".", ":"))) {
        data.time = msg.body.text.replace(".", ":");
        event_info[data.slot].time = data.time;
        data.edit = true;
      } else {
        msg
          .respond("Zeit kann nicht in der Vergangenheit liegen. Eingabe wiederholen.")
          .route('event_edit_time_route', data, 60);
        return;
      }
    } else {
      msg
        .respond("Format-Fehler, Eingabe wiederholen.")
        .route('event_edit_time_route', data, 60);
      return;
    }
  }
  
  var msg_text = cloneObject(event_edit_text);
  msg_text.text = "Vorschau:";
  msg_text.attachments[0] = getEventInfoAttachment(data.slot);
  if (admin_id == msg.body.user_id) msg_text.attachments[3] = event_edit_text_admin;
  msg
    .respond(msg.body.response_url, msg_text)
    .route('event_edit_select_route', data, 60);
  return;
});
// -----
slapp.route('event_edit_text_route', (msg, data) => {
  if (msg.type == 'event') {
    msg.route('event_edit_text_route', data, 60);
    return;
  }
  
  if (msg.type == 'action') {
    if (msg.body.actions[0].value == "exit") {
      msg.respond(msg.body.response_url, event_empty_text);
      return;
    }
  } else {
    data.text = msg.body.text;
    event_info[data.slot].text = data.text;
    data.edit = true;
  }
  
  var msg_text = cloneObject(event_edit_text);
  msg_text.text = "Vorschau:";
  msg_text.attachments[0] = getEventInfoAttachment(data.slot);
  if (admin_id == msg.body.user_id) msg_text.attachments[3] = event_edit_text_admin;
  msg
    .respond(msg.body.response_url, msg_text)
    .route('event_edit_select_route', data, 60);
  return;
});
// -----
slapp.route('event_edit_max_route', (msg, data) => {
  if (msg.type == 'event') {
    msg.route('event_edit_max_route', data, 60);
    return;
  }
  
  if (msg.type == 'action') {
    if (msg.body.actions[0].value == "exit") {
      msg.respond(msg.body.response_url, event_empty_text);
      return;
    } else if (msg.body.actions[0].value !== "back") {
      data.max = msg.body.actions[0].value;
      event_info[data.slot].max = parseInt(data.max);
      data.edit = true;
    }
  } else {
    var check = new RegExp("\\d{1,4}");
    if (check.test(msg.body.text)) {
      data.max = msg.body.text;
      event_info[data.slot].max = parseInt(data.max);
      data.edit = true;
    } else {
      msg
        .respond("Format-Fehler, Eingabe wiederholen.")
        .route('event_edit_max_route', data, 60);
      return;
    }
  }
  
  var msg_text = cloneObject(event_edit_text);
  msg_text.text = "Vorschau:";
  msg_text.attachments[0] = getEventInfoAttachment(data.slot);
  if (admin_id == msg.body.user_id) msg_text.attachments[3] = event_edit_text_admin;
  msg
    .respond(msg.body.response_url, msg_text)
    .route('event_edit_select_route', data, 60);
  return;
});
// -----
slapp.route('event_edit_remove_route', (msg, data) => {
  if (msg.type !== 'action') {
    msg.route('event_edit_remove_route', data, 60);
    return;
  }
  
  if (msg.type == 'action') {
    if (msg.body.actions[0].value == "exit") {
      msg.respond(msg.body.response_url, event_empty_text);
      return;
    } else if (msg.body.actions[0].value !== "back") {
      var temp = 0;
      var evt_members = [];
      for (var i = 0; i < event_info[data.slot].members.length; i++) {
        if (event_info[data.slot].members[i] !== msg.body.actions[0].value) {
          evt_members[temp] = event_info[data.slot].members[i];
          temp++;
        }
      }
      
      deleteReminder(data.slot, msg.body.actions[0].value);
      
      data.members = evt_members;
      event_info[data.slot].members = data.members;
      data.edit = true;
    }
  }
  
  var msg_text = cloneObject(event_edit_text);
  msg_text.text = "Vorschau:";
  msg_text.attachments[0] = getEventInfoAttachment(data.slot);
  if (admin_id == msg.body.user_id) msg_text.attachments[3] = event_edit_text_admin;
  msg
    .respond(msg.body.response_url, msg_text)
    .route('event_edit_select_route', data, 60);
  return;
});

// ----- /event delete -----

slapp.command("/event", "delete \\d{1,4}", (msg, cmd) => {
  var data = {slot : -1, id : 0};
  data.id = cmd.substring(7);
  var check = new RegExp("\\d{1,4}");
  if (check.test(data.id)) {
    data.slot = getSlotNr(data.id);
    if ((data.slot !== -1 && event_info[data.slot].state == 0) || admin_id == msg.body.user_id) {
      if (event_info[data.slot].creator == msg.body.user_id || admin_id == msg.body.user_id) {
        msg
          .respond(event_delete_text)
          .route('event_delete_final_route', data, 60);
        return;
      } else msg.respond("Nur der Ersteller kann diesen Event löschen.");
    } else msg.respond("Ein Event mit dieser ID existiert nicht.");
  } else msg.respond("Bitte eine gültige Event-ID eingeben: `/event delete <id>`");
});
// -----
slapp.route('event_delete_final_route', (msg, data) => {
  if (msg.type !== 'action') {
    msg.route('event_delete_final_route', data, 60);
    return;
  }
  
  if (msg.body.actions[0].value == "delete") {
    event_info[data.slot].state = 2;
    event_info[data.slot].editor = msg.body.user.id;
    event_info[data.slot].ts_edited = msg.body.action_ts;
    deleteEvent(data.slot);
    storeEventInfo();
    
    for (var i = 0; i < event_info[data.slot].members.length; i++) {
      deleteReminder(data.slot, event_info[data.slot].members[i]);
    }
    
    var msg_text = {
      text : "Der Event mit der ID #" + data.id + " wurde erfolgreich gelöscht.",
      response_type : 'ephemeral',
      delete_original : true
    };
    msg.respond(msg.body.response_url, msg_text);
  } else msg.respond(msg.body.response_url, event_empty_text);
});

// ----- /event info -----

slapp.command("/event", "info \\d{1,4}", (msg, cmd) => {
  var evt_id = cmd.substring(5);
  var check = new RegExp("\\d{1,4}");
  if (check.test(evt_id)) {
    var slot = getSlotNr(evt_id);
    if (slot !== -1) {
      if (event_info[slot].state == 0 || admin_id == msg.body.user_id) {
        var msg_text = getEventInfo(slot);
        msg_text.attachments[1] = event_hide_btn;
        msg.respond(msg_text);
      } else msg.respond("Ein Event mit dieser ID existiert nicht.");
    } else msg.respond("Ein Event mit dieser ID existiert nicht.");
  } else msg.respond("Bitte eine gültige Event-ID eingeben: `/event info <id>`");
});

// ----- /event post -----

slapp.command("/event", "post \\d{1,4}", (msg, cmd) => {
  var evt_id = cmd.substring(5);
  var check = new RegExp("\\d{1,4}");
  if (check.test(evt_id)) {
    var slot = getSlotNr(evt_id);
    if (slot !== -1) {
      if (event_info[slot].state == 0 || admin_id == msg.body.user_id) {
        msg.say(getEventInfo(slot), (err, result) => {
          event_info[slot].ts_posted.push(result.ts);
          event_info[slot].ch_posted.push(result.channel);
          storeEventInfo();
        });
      } else msg.respond("Ein Event mit dieser ID existiert nicht.");
    } else msg.respond("Ein Event mit dieser ID existiert nicht.");
  } else msg.respond("Bitte eine gültige Event-ID eingeben: `/event post <id>`");
});

// ----- /event list -----

slapp.command("/event", "list(.*)", (msg, cmd) => {
  var check = new RegExp("list (outdated|deleted|hidden|all)");
  var msg_text = {
    text : "",
    attachments : [],
    response_type : 'ephemeral',
    delete_original : true
  };
  
  if (msg.body.user_id == admin_id && check.test(cmd)) {
    cmd = cmd.substring(5);
    
    switch (cmd) {
      case "outdated" :
        var temp = 0;
        for (var slot = 0; slot < event_info.length; slot++) {
          if (event_info[slot].state == 1) {
            msg_text.attachments[temp] = getEventInfoAttachment(slot);
            temp++;
          }
        }
        if (temp !== 0) {
          msg_text.attachments[temp] = event_hide_btn;
          msg.respond(msg_text);
        } else msg.respond("Es wurden noch keine Events eingetragen.");
        break;
      case "deleted" :
        var temp = 0;
        for (var slot = 0; slot < event_info.length; slot++) {
          if (event_info[slot].state == 2) {
            msg_text.attachments[temp] = getEventInfoAttachment(slot);
            temp++;
          }
        }
        if (temp !== 0) {
          msg_text.attachments[temp] = event_hide_btn;
          msg.respond(msg_text);
        } else msg.respond("Es wurden noch keine Events eingetragen.");
        break;
      case "hidden" :
        var temp = 0;
        for (var slot = 0; slot < event_info.length; slot++) {
          if (event_info[slot].state == 3) {
            msg_text.attachments[temp] = getEventInfoAttachment(slot);
            temp++;
          }
        }
        if (temp !== 0) {
          msg_text.attachments[temp] = event_hide_btn;
          msg.respond(msg_text);
        } else msg.respond("Es wurden noch keine Events eingetragen.");
        break;
      case "all" :
        for (var slot = 0; slot < event_info.length; slot++) {
          msg_text.attachments[slot] = getEventInfoAttachment(slot);
        }
        if (event_info.length !== 0) {
          msg_text.attachments[event_info.length + 1] = event_hide_btn;
          msg.respond(msg_text);
        } else msg.respond("Es wurden noch keine Events eingetragen.");
        break;
      default :
        break;
    }
  } else {
    var temp = 0;
    for (var slot = 0; slot < event_info.length; slot++) {
      if (event_info[slot].state == 0) {
        msg_text.attachments[temp] = getEventInfoAttachment(slot);
        temp++;
      }
    }
    if (temp !== 0) {
      msg_text.attachments[temp] = event_hide_btn;
      msg.respond(msg_text);
    } else msg.respond("Es wurden noch keine Events eingetragen.");
  }
});

// ----- /event join -----

slapp.command("/event", "join \\d{1,4}", (msg, cmd) => {
  var evt_id = cmd.substring(5);
  var check = new RegExp("\\d{1,4}");
  if (check.test(evt_id)) {
    var slot = getSlotNr(evt_id);
    saveUserInfo(msg.body.user_id, msg.body.user_name);
  
    if ((slot !== -1 && event_info[slot].state == 0) || msg.body.user_id == admin_id) {
      if (event_info[slot].members.indexOf(msg.body.user_id) !== -1) msg.respond("Event #" + evt_id + " bereits begetreten.");
      else if (event_info[slot].members.length < event_info[slot].max) {
        event_info[slot].members[event_info[slot].members.length] = msg.body.user_id;
        storeEventInfo();
        updateEvent(slot);
        setReminder(slot, msg.body.user_id);
        msg.respond("Event #" + evt_id +" beigetreten.");
      } else msg.respond("Event #" + evt_id + " ist bereits voll (max. " + event_info[slot].max + ").");
    } else msg.respond("Ein Event mit dieser ID existiert nicht.");
  } else msg.respond("Bitte eine gültige Event-ID eingeben: `/event join <id>`");
});

// ----- /event leave -----

slapp.command("/event", "leave \\d{1,4}", (msg, cmd) => {
  var evt_id = cmd.substring(6);
  var slot = getSlotNr(evt_id);
  var check = new RegExp("\\d{1,4}");
  if (check.test(evt_id)) {
    if ((slot !== -1 && event_info[slot].state == 0) || msg.body.user_id == admin_id) {
      if (event_info[slot].members.indexOf(msg.body.user_id) == -1) msg.respond("Event #" + evt_id + " bereits verlassen.");
      else {
        var evt_members = [];
        var temp = 0;
        for (var i = 0; i < event_info[slot].members.length; i++) {
          if (event_info[slot].members[i] !== msg.body.user_id) {
            evt_members[temp] = event_info[slot].members[i];
            temp++;
          }
        }
        event_info[slot].members = evt_members;
        storeEventInfo();
        updateEvent(slot);
        deleteReminder(slot, msg.body.user_id);
        msg.respond("Event #" + evt_id +" verlassen.");
      }
    } else msg.respond("Ein Event mit dieser ID existiert nicht.");
  } else msg.respond("Bitte eine gültige Event-ID eingeben: `/event leave <id>`");
});

// ----- Admin commands -----

slapp.command("/event", "debug \\d{1,4}", (msg, cmd) => {
  if (msg.body.user_id == admin_id) {
    var slot = getSlotNr(cmd.substring(6));
    if (slot !== -1) {
      var msg_text = getDebugInfo(slot);
      msg_text.attachments[1] = event_hide_btn;
      msg.respond(msg_text);
    } else msg.respond("Ein Event mit dieser ID existiert nicht.");
  }
});

slapp.command("/event", "userinfo", (msg, cmd) => {
  if (msg.body.user_id == admin_id) {
    var msg_text = {
      text : "# : user_id - user_name",
      attachments : []
    };
    for (var i = 0; i < user_info.length; i++) {
      msg_text.text += "\n" + i + " : " + user_info[i].id + " - " + user_info[i].name;
    }
    msg_text.attachments[0] = event_hide_btn;
    msg.respond(msg_text);
    console.log(user_info);
  }
});

slapp.command("/event", "update (.*)", (msg, cmd) => {
  if (msg.body.user_id == admin_id) {
    var evt_id = cmd.substring(7);
    if (evt_id == "all") {
      for (var i = 0; i < event_info.length; i++) {
        updateEvent(i);
      }
    } else {
      var slot = getSlotNr(evt_id);
      if (slot !== -1) updateEvent(slot);
    }
  }
});

slapp.command("/event", "reset ts \\d{1,4}", (msg, cmd) => {
  if (msg.body.user_id == admin_id) {
    var slot = getSlotNr(cmd.substring(9));
    if (slot !== -1) {
      event_info[slot].ts_posted = [];
      event_info[slot].ch_posted = [];
    }
  }
});

slapp.command("/event", "get ts \\d{1,4}", (msg, cmd) => {
  if (msg.body.user_id == admin_id) {
    var slot = getSlotNr(cmd.substring(7));
    if (slot !== -1) getMessageTS(slot, msg.body.channel_id);
  }
});

slapp.command("/event", "remove \\d{1,4}", (msg, cmd) => {
  if (msg.body.user_id == admin_id) {
    var slot = getSlotNr(cmd.substring(7));
    if (slot !== -1) {
      for (var i = 0; i < event_info[slot].members.length; i++) {
        removeReminder(slot, event_info[slot].members[i]);
      }
      event_info.splice(slot, 1);
    }
  }
});

slapp.command("/event", "db store", (msg, cmd) => {
  if (msg.body.user_id == admin_id) {
    storeEventInfo();
    storeUserInfo();
  }
});

slapp.command("/event", "db reload", (msg, cmd) => {
  if (msg.body.user_id == admin_id) {
    loadEventInfo();
    loadUserInfo();
  }
});

slapp.command("/event", "db reset", (msg, cmd) => {
  if (msg.body.user_id == admin_id) {
    resetEventInfo();
    resetUserInfo();
  }
});

// ----- /event help -----

slapp.command("/event", "help", (msg) => {
  var msg_text = { text : "`/event create` : Event erstellen\n`/event edit <id>` : Event bearbeiten\n`/event info <id>` : Event-Informationen abrufen\n`/event post <id>` : Event-Informationen im derzeitigen Channel posten\n`/event list` : Alle Events auflisten\n`/event delete <id>` : Event löschen\n`/event join <id>` : Event beitreten\n`/event leave <id>` : Event verlassen" , attachments : []};
  if (admin_id == msg.body.user_id) msg_text.text += "\n----- Admin Commands -----\n`/event debug <id>` : Debug-Informationen abrufen\n`/event userinfo` : Nutzer-ID/Namen abrufen\n`/event update <id>` : Event manuell aktualisieren\n`/event get ts <id>` : Event Post-TS suchen\n`/event reset ts <id>` : Event Post-TS zurücksetzen\n`/event remove <id>` : Event komplett löschen\n`/event db store` : Event-Info speichern\n`/event db reload` : Event-Info neu laden\n`/event db reset` : Event-Info löschen";
  msg_text.attachments[0] = event_hide_btn;
  msg.respond(msg_text);
});

// ----- /event test -----

slapp.command("/event", "test (.*)", (msg, cmd) => {
  if (msg.body.user_id == admin_id) {
    //var text = {text : "<!date^1478092357.000004^{date} at {date}|Test>", mrkdwn : true};
    //msg.say(text);
  }
});

// ----- /event * -----

slapp.command("/event", "(.*)", (msg, cmd) => {
  msg.respond("Ungültige Eingabe. Mehr Hilfe mit `/event help`.");
});

// Hide button callback
slapp.action('event_hide_callback', 'answer', (msg) => {
  msg.respond(msg.body.response_url, event_empty_text);
});
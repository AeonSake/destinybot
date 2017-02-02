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

//console.log('Listening on :' + process.env.PORT);
app.listen(process.env.PORT);

// ===== TODO =====
// ---

// ===============================
// ========== VARIABLES ==========
// ===============================

var admin_id = process.env.admin;
var bot_id = process.env.bot_id;
var bot_token = process.env.bot_token;
var app_token = process.env.app_token;

var poll_info = [];
var poll_channel = process.env.poll_channel;

loadPollInfo();

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

// Container to store poll data
function savePollInfo (pl_title, pl_text, pl_options, pl_mode, pl_creator, pl_ts_created) {
  poll_info[poll_info.length] = {
    title : pl_title,
    text : pl_text,
    options : pl_options,
    votes : [],
    mode : pl_mode, //0 = multi-vote, 1 = 1 vote, etc
    creator : pl_creator,
    ts_created : pl_ts_created,
    ts_edited : 0,
    ts_posted : [],
    ch_posted : [],
    state : 0, //0 = default, 1 = deleted
    color : getRandomColor()
  };
}

// Method to update polls
function updatePoll (slot) {
  if (poll_info[slot].state == 0) {
    var ts_list = poll_info[slot].ts_posted;
    var ch_list = poll_info[slot].ch_posted;
    var msg_att = [];
    msg_att[0] = getEventInfoAttachment(slot); //============================
  
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
      });
    }
  } else deletePoll(slot);
}

//Method to delete polls
function deletePoll (slot) {
  var ts_list = poll_info[slot].ts_posted;
  var ch_list = poll_info[slot].ch_posted;
  
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
  
  poll_info[slot].ts_posted = [];
  poll_info[slot].ch_posted = [];
}

// Method to get the timestamp of a bot message
function getMessageTS (slot, ch_id) {
  var pl_id = slot + 1;
  var check = new RegExp("^(.*) \\(#" + pl_id + "\\)$");
  
  slapp.client.channels.history({
    token : app_token,
    channel : ch_id
  }, (err, data) => {
    if (err) console.log(err);
    else {
      var msgs = data.messages;
      for (var i = 0; i < msgs.length; i++) {
        if (msgs[i].bot_id == bot_id && check.test(msgs[i].attachments[0].title)) {
          poll_info[slot].ts_posted[poll_info[slot].ts_posted.length] = msgs[i].ts;
          poll_info[slot].ch_posted[poll_info[slot].ch_posted.length] = ch_id;
          return;
        }
      }
    }
  });
}

// Method to save poll_info
function storePollInfo () {
  kv.set('poll_info', poll_info, function (err) {
    if (err) console.log(err);
  });
}

// Method to load poll_info
function loadPollInfo () {
  kv.get('poll_info', function (err, val) {
    if (err) console.log(err);
    else if (typeof val !== "undefined") poll_info = val;
  });
}

// Method to reset event_info
function resetPollInfo () {
  kv.del('poll_info', function (err) {
    if (err) console.log(err);
  });
}

// ==============================
// ========== COMMANDS ==========
// ==============================

// ----- /poll, /poll create -----

slapp.command("/poll", "(create)?(.*)", (msg, cmd) => {
  var data = {id : 0, title : "", text : "", options : [], creator : ""};
  var check1 = new RegExp("[^;]*(;|; )[^;]*(;|; )(.*)(;)?");
  var check2 = new RegExp("create [^;]*(;|; )[^;]*(;|; )(.*)(;)?");
  
  data.creator = msg.body.user_id;
  
  if (check2.test(cmd)) {
    var res_text = cmd.substring(7).split(";");
    var pl_options = [];
    for (var i = 0; i < res_text.length; i++) {
      if (i < 2) res_text[i] = res_text[i].trim();
      else pl_options[i - 2] = res_text[i].trim();
    }
    
    savePollInfo(res_text[0], res_text[1], pl_options, data.creator, msg.body.message_ts); //==============================
    
    
    var msg_text = getPollInfo(poll_info.length - 1);
    msg_text.text = "Vorschau:";
    //msg_text.attachments[1] = event_create_final_btns;
    msg
      .respond(msg_text)
      .route('poll_create_final_route', data, 60);
    return;
  } else {
    msg
      .respond(event_type_text_nb)
      .route('poll_create_title_route', data, 60);
    return;
  }
});
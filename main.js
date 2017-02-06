// ==============================
// ========== PREAMBLE ==========
// ==============================

'use strict';

const os = require('os');
const express = require('express');
const Slapp = require('slapp');
const BeepBoopConvoStore = require('slapp-convo-beepboop');
const BeepBoopContext = require('slapp-context-beepboop');
const BeepBoopPersist = require('beepboop-persist');
const config = require('./src/config').validate();
const func = require('./src/func');
const lang = require('./src/lang_de');
if (!process.env.PORT) throw Error('PORT missing but required');

var log = [];

var slapp = Slapp({
  record: config.slapp_record,
  convo_store: config.bb_convo_store,
  context: config.bb_context,
  verify_token: config.slack_verify_token,
  log: config.slapp_log,
  colors: config.slapp_colors
});

var server = slapp.attachToExpress(express());

var app = {
  slapp,
  server,
  kv: BeepBoopPersist({provider: config.bb_persist_provider}),
  config,
  func,
  lang,
  log
};

var user = require('./src/user')(app);
//require('./src/destiny')(app, user);
require('./src/polls')(app);
//require('./src/events')(app, user);

console.log("Running " + config.title + " on version " + config.version);
log.push("\n:information_source: Running " + config.title + " on version " + config.version);
console.log("Listening on port " + process.env.PORT);
server.listen(process.env.PORT);

function notifyAdmin () {
  slapp.client.im.open({
    token: config.bot_token,
    user: config.admin_id
  }, (err, data) => {
    if (err) console.log(err);
    else {
      config.admin_ch = data.channel.id;
      
      var msg_text = "";
      for (var i = 0; i < log.length; i++) msg_text += log[i] + "\n";
      
      slapp.client.chat.postMessage({
        token: config.bot_token,
        channel: config.admin_ch,
        text: msg_text,
        parse: 'full',
        as_user: true
      }, (err, data) => {
        if (err) console.log(err);
      });
    }
  })
}



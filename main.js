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
const func = require('./src/func')(slapp);
var user = require('./src/user')({slapp, kv: BeepBoopPersist({provider: config.bb_persist_provider})});

var app = {
  slapp,
  server,
  kv: BeepBoopPersist({provider: config.bb_persist_provider}),
  config,
  func,
  lang,
  user
};

//require('./src/destiny')(app);
require('./src/polls')(app);
//require('./src/events')(app);

//console.log("Running " + config.title + " on version " + config.version);
//log.push("\n:information_source: Running " + config.title + " on version " + config.version);

func.addLogEntry("Running " + config.title + " on version " + config.version, 0)

console.log("Listening on port " + process.env.PORT);
server.listen(process.env.PORT);
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
if (!process.env.PORT) throw Error('PORT missing but required');

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
  func
};

//require('./src/destiny')(app);
require('/src/polls')(app);
//require('/src/events')(app);

//require('beepboop-slapp-presence-polyfill')(slapp, { debug: true });
console.log('Running' + config.title + " on version " + config.version + ".");
console.log('Listening on :' + process.env.PORT);
server.listen(process.env.PORT);
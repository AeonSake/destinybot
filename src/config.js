// ==============================
// ========== PREAMBLE ==========
// ==============================

'use strict';

const BeepBoopConvoStore = require('slapp-convo-beepboop');
const BeepBoopContext = require('slapp-context-beepboop');

// ===============================
// ========== VARIABLES ==========
// ===============================

let baseUrl = process.env.BASE_URL || `https://beepboophq.com/proxy/${process.env.BEEPBOOP_PROJECT_ID}`;

let config = module.exports = {
  
  //HTTP port
  port: process.env.PORT || 4000,
  
  //Slack tokens
  slack_verify_token: process.env.SLACK_VERIFY_TOKEN,
  
  //Slapp config
  slapp_record: 'out.jsonl',
  slapp_log: true,
  slapp_colors: true,
  
  //BeepBoop config
  bb_project_id: process.env.BEEPBOOP_PROJECT_ID,
  bb_token: process.env.BEEPBOOP_TOKEN,
  bb_convo_store: BeepBoopConvoStore(),
  bb_context: BeepBoopContext(),
  bb_persist_provider: process.env.PERSIST_PROVIDER || 'beepboop',
  
  //Project config
  version: "5.0.21",
  title: "DestinyBot",
  admin_id: process.env.admin_id,
  bot_id: process.env.bot_id,
  bot_token: process.env.bot_token,
  app_token: process.env.app_token,
  server_time_offset: 1,
  
  //Destiny config
  //destiny_ch: process.env.destiny_ch,
  
  //Poll config
  poll_ch: process.env.poll_ch,
  
  //Events config
  event_ch: process.env.event_ch,
  
  
  
  //Validation function
  validate: () => {
    let required = ['bb_token'];

    required.forEach((prop) => {
      if (!config[prop]) {
        throw new Error(`${prop.toUpperCase()} required but missing`);
      }
    })
    return config;
  }
};



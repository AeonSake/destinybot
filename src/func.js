// ==============================
// ========== PREAMBLE ==========
// ==============================

'use strict';

const config = require('./config').validate();
var slapp;

// ===============================
// ========== FUNCTIONS ==========
// ===============================

module.exports = (slapp_in) => {
  slapp = slapp_in;
};


let func = module.exports = {
  
  // Method to get a random RGB color in hex
  getRandomColor: () => {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  },
  
  addLogEntry: (text, type) => {
    var type_text = ["INFO", "INFO", "WARNING", "ERROR"];
    var type_emoji = [":information_source:", ":white_check_mark:", ":warning:", ":x:"];
    
    console.log(type_text[type] + ": " + text);
    
    if (config.admin_ch == "") func.getAdminCh();
    else {
      slapp.client.chat.postMessage({
        token: config.bot_token,
        channel: config.admin_ch,
        text: type_emoji[type] + ": " + text,
        parse: 'full',
        as_user: true
      }, (err, data) => {
        if (err) console.log("ERROR: Unable to fetch send admin notification (" + err + ")");
      });
    }
  },
  
  getAdminCh: () => {
    slapp.client.im.open({
      token: config.bot_token,
      user: config.admin_id
    }, (err, data) => {
      if (err) console.log("ERROR: Unable to fetch admin channel ID (" + err + ")");
      else config.admin_ch = data.channel.id;
    });
  }
};
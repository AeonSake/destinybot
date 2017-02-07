// ==============================
// ========== PREAMBLE ==========
// ==============================

'use strict';

const config = require('./config').validate();



// ===============================
// ========== FUNCTIONS ==========
// ===============================

module.exports = (slapp, config) => {
  var module = {};
  module.ready = false;
  
  module.getRandomColor = () => {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };
  
  module.getAdminCh = () => {
    slapp.client.im.open({
      token: config.bot_token,
      user: config.admin_id
    }, (err, data) => {
      if (err) console.log("ERROR: Unable to fetch admin channel ID (" + err + ")");
      else {
        config.admin_ch = data.channel.id;
        module.ready = true;
      }
    });
  };
  module.getAdminCh();
  
  module.addLogEntry = (text, type) => {
    var type_text = ["INFO", "INFO", "WARNING", "ERROR"];
    var type_emoji = [":information_source:", ":white_check_mark:", ":warning:", ":x:"];
    
    console.log(type_text[type] + ": " + text);
    
    notifyAdmin(type_emoji[type] + ": " + text);
  };
  
  function notifyAdmin(text) {
    if (module.ready == true) {
      slapp.client.chat.postMessage({
        token: config.bot_token,
        channel: config.admin_ch,
        text: text,
        parse: 'full',
        as_user: true
      }, (err, data) => {
        if (err) console.log("ERROR: Unable to fetch send admin notification (" + err + ")");
      });
    } else {
      module.getAdminCh();
      setTimeout(function() {
        notifyAdmin(text);
      }, 1000)
    }
  }
  
  return module;
}
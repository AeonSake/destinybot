// ==============================
// ========== PREAMBLE ==========
// ==============================

'use strict';



// ===============================
// ========== FUNCTIONS ==========
// ===============================

module.exports = (slapp, config, lang) => {
  var module = {};
  
  // Function to generate a random RGB hex value
  module.getRandomColor = () => {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };
  
  // Function to clone objects
  module.cloneObject = (obj) => {
    return JSON.parse(JSON.stringify(obj));
  };
  
  // Function to add entries to console and admin chat
  module.addLogEntry = (text, type) => {
    var type_text = ["INFO", "INFO", "WARNING", "ERROR"];
    var type_emoji = [":information_source:", ":white_check_mark:", ":warning:", ":x:"];
    
    console.log(type_text[type] + ": " + text);
    notifyAdmin(type_emoji[type] + " " + text);
  };
  
  // Function to get admin channel id (DM)
  function getAdminCh () {
    if (config.admin_ch == "") {
      slapp.client.im.open({
        token: config.bot_token,
        user: config.admin_id
      }, (err, data) => {
        if (err) console.log("Unable to fetch admin channel (" + err + ")");
        else config.admin_ch = data.channel.id;
      });
    }
  }
  getAdminCh();
  
  // Function to notify admin on events
  function notifyAdmin (text) {
    if (config.admin_ch != "") {
      slapp.client.chat.postMessage({
        token: config.bot_token,
        channel: config.admin_ch,
        text: text,
        parse: 'full',
        as_user: true
      }, (err, data) => {
        if (err) console.log("ERROR: Unable to send admin notification (" + err + ")");
      });
    } else {
      getAdminCh();
      setTimeout(function() {
        notifyAdmin(text);
      }, 1000)
    }
  }
  
  // Function to create a message + dismiss button
  module.generateInfoMsg = (text) => {
    return {
      text: "",
      attachments: [{name: 'dismiss', text: lang.btn.dismiss, type: 'button'}],
      response_type: 'ephemeral',
      delete_original: true
    };
  };
  
  // Close button callback
  slapp.action('dismiss_callback', (msg) => {
    msg.respond({text: "", delete_original: true});
    return;
  });
  
  return module;
}
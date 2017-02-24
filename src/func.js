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
  
  // Function to create a message + dismiss button
  module.generateInfoMsg = (text) => {
    return {
      text: "",
      attachments: [{
        text: text,
        fallback: text,
        callback_id: 'dismiss_callback',
        actions: [{name: 'dismiss', text: lang.btn.dismiss, type: 'button'}],
        mrkdwn_in: ['text', 'pretext']
      }],
      response_type: 'ephemeral',
      replace_original: true
    };
  };
  
  // Close button callback
  slapp.action('dismiss_callback', (msg) => {
    msg.respond({text: "", delete_original: true});
    return;
  });
  
  return module;
}
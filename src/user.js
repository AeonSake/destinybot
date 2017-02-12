// ==============================
// ========== PREAMBLE ==========
// ==============================

'use strict';

var team_db = {};
var user_db = [];



// ==============================
// ========== DATABASE ==========
// ==============================

module.exports = (slapp, kv, config, func) => {
  var module = {};
  module.ready = false;
  
  module.getTeamInfo = () => {
    slapp.client.team.info({
      token: config.bot_token
    }, (err, data) => {
      if (err) {
        func.addLogEntry("Unable to load team info (" + err + ")", 3);
      }
      else {
        team_db = data.team;
        func.addLogEntry("Team info loaded", 1);
      }
    });
  };
  
  module.getUserInfo = () => {
    slapp.client.users.list({
      token: config.bot_token
    }, (err, data) => {
      if (err) {
        func.addLogEntry("Unable to load user info (" + err + "), using old data instead (if existing)", 2);
        
        kv.get('user_db', function (err, val) {
          if (err) {
            func.addLogEntry("Unable to load old user info (" + err + ")", 3);
          }
          else if (typeof val !== "undefined") user_db = val;
        });
      }
      else {
        for (var i = 0; i < data.members.length; i++) {
          user_db[i] = {
            id: data.members[i].id,
            name: data.members[i].name,
            real_name: data.members[i].real_name,
            tz_offset: data.members[i].tz_offset,
            avatar_24: data.members[i].profile.image_24,
            avatar_48: data.members[i].profile.image_48,
            avatar_192: data.members[i].profile.image_192,
            deleted: data.members[i].deleted,
            admin: data.members[i].is_admin,
            owner: data.members[i].is_owner
          };
        }
        
        func.addLogEntry("User info loaded", 1);
        
        kv.set('user_db', user_db, function (err) {
          if (err) func.addLogEntry("Unable to save user info (" + err + ")", 2);
        });
      }
    });
  };
  
  module.getUserDM = () => {
    for (var i = 0; i < user_db.length; i++) {
      slapp.client.im.open({
        token: config.bot_token,
        user: user_db[i].id
      }, (err, data) => {
        if (!err) user_db.dm_ch = data.channel.id;
      });
    }
  };
  
  module.sendDM = (user_id, msg) => {
    var user = user_db.getUser(user_id);
    
    if ('dm_ch' in user) {
      slapp.client.chat.postMessage({
        token: config.bot_token,
        channel: user.dm_ch,
        text: msg.text,
        attachments: msg.attachments,
        parse: 'full',
        as_user: true
      }, (err, data) => {
        if (err) console.log("ERROR: Unable to send user DM (" + err + ")");
      });
    }
  }
  
  module.getUser = (user_id) => {
    var output = {};
    for (var i = 0; i < user_db.length; i++) {
      if (user_db[i].id == user_id) output = user_db[i];
    }
    return output;
  };
   
  module.getTeamInfo();
  module.getUserInfo();
  module.getUserDM();
  module.ready = true;
  
  return module;
};
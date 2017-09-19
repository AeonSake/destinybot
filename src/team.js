// ==============================
// ========== PREAMBLE ==========
// ==============================

'use strict';

var team_db = {};
var user_db = {};



// ==============================
// ========== DATABASE ==========
// ==============================

module.exports = (slapp, kv, config, func) => {
  var module = {};
  
  // Function to fetch team info from slack
  function getTeamInfo () {
    slapp.client.team.info({
      token: config.bot_token
    }, (err, data) => {
      if (err) {
        console.log("ERROR: Team | Unable to load team info (" + err + ")");
      }
      else {
        team_db = data.team;
        console.log("INFO: Team | Team info loaded");
      }
    });
  }
  
  // Function to fetch user info from slack
  function getUserInfo () {
    slapp.client.users.list({
      token: config.bot_token
    }, (err, data) => {
      if (err) {
        console.log("WARN: Team | Unable to load user info (" + err + "), using old data instead (if existing)");
        
        kv.get('user_db', function (err, val) {
          if (err || typeof val == "undefined") {
            console.log("ERROR: Team | Unable to load old user info (" + err + ")");
          }
          else user_db = val;
        });
      }
      else {
        user_db = {};
        for (var i in data.members) {
          user_db[data.members[i].id] = {
            id: data.members[i].id,
            name: data.members[i].name,
            first_name: data.members[i].profile.first_name || "",
            last_name: data.members[i].profile.last_name || "",
            full_name: data.members[i].profile.real_name,
            display_name: data.members[i].profile.display_name,
            tz_offset: data.members[i].tz_offset,
            color: data.members[i].color,
            avatar_24: data.members[i].profile.image_24,
            avatar_48: data.members[i].profile.image_48,
            avatar_192: data.members[i].profile.image_192,
            deleted: data.members[i].deleted,
            is_admin: data.members[i].is_admin,
            is_owner: data.members[i].is_owner,
            is_bot: ata.members[i].is_bot
          };
        }
        
        console.log("INFO: Team | User info loaded");
        
        kv.set('user_db', user_db, function (err) {
          if (err) console.log("WARN: Team | Unable to save user info (" + err + ")");
        });
      }
    });
  }
  
  // Function to fetch user DM channel id
  function getUserDM (user_id) {
    slapp.client.im.open({
      token: config.bot_token,
      user: user_id
    }, (err, data) => {
      if (err) console.log("WARN: Team | Unable to fetch user channel (" + err + ")");
      else if (user_db.hasOwnProperty(user_id)) user_db[user_id].dm_ch = data.channel.id;
    });
  }
  
  // Function for sending DMs to users
  module.sendDM = (user_id, msg_text) => {
    if (user_db.hasOwnProperty(user_id)) {
      if ('dm_ch' in user_db[user_id]) {
        slapp.client.chat.postMessage({
          token: config.bot_token,
          channel: user_db[user_id].dm_ch,
          text: msg_text.text,
          attachments: msg_text.attachments
        }, (err, data) => {
          if (err) console.log("ERROR: Team | Unable to send user DM (" + err + ")");
        });
      } else {
        getUserDM(user_id);
        setTimeout(function() {
          module.sendDM(user_id, msg_text);
        }, 2000);
      } 
    }
  }
  
  // Function to retrieve user name
  module.getUserName = (user_id) => {
    if (user_db.hasOwnProperty(user_id)) return user_db[user_id].name;
    return "";
  };
  
  // Function to retrieve user info from database
  module.getUserInfo = (user_id) => {
    if (user_db.hasOwnProperty(user_id)) return user_db[user_id];
    return {};
  };
  
  // Function to retrieve all users as id list from database
  module.getUserList = () => {
    var arr = [];
    for (var key in user_db) arr.push(key);
    return arr;
  };
  
  // Function to retrieve the user id by username
  module.getUserIdByUsername = (user_name) => {
    var arr = [];
    for (var key in user_db) {
      if (user_db.hasOwnProperty(key) && user_db[key].name == user_name) return user_db[key].id;
    }
    return "";
  };
  
  // Function to check if user is active
  module.isActive = (user_id) => {
    if (user_db.hasOwnProperty(user_id)) return !user_db[user_id].deleted;
    return false;
  };
  
  // Function to check if user is admin
  module.isAdmin = (user_id) => {
    if (user_db.hasOwnProperty(user_id)) return user_db[user_id].is_admin;
    return false;
  };
  
  // Function to check if user is a bot
  module.isBot = (user_id) => {
    if (user_db.hasOwnProperty(user_id)) return user_db[user_id].is_bot;
    return false;
  };
  
  // Function to detect team changes
  slapp.event('team_profile_change', (msg) => {
    getTeamInfo();
  });
  
  // Function to detect user changes
  slapp.event('(team_join|user_change)', (msg) => {
    getUserInfo();
  });
   
  getTeamInfo();
  getUserInfo();
  
  return module;
};
// ==============================
// ========== PREAMBLE ==========
// ==============================

'use strict';

const config = require('./config').validate();
const func = require('./func');

var team_db = {};
var user_db = [];

// ===============================
// ========== FUNCTIONS ==========
// ===============================

let user = module.exports = {
  
  getUser: (user_id) => {
    var output = {};
    for (var i = 0; i < user_db.length; i++) {
      if (user_db[i].user_id == user_id) output = user_db[i];
    }
    return output;
  }
  
};



// ==============================
// ========== DATABASE ==========
// ==============================

module.exports = ({slapp, kv}) => {
  
  function getTeamInfo () {
    slapp.client.team.info({
      token: config.bot_token
    }, (err, data) => {
      if (err) {
        console.log("Unable to load team info (" + err + ")");
        log.push(":warning: Unable to load team info (" + err + ")");
      }
      else {
        team_db = data.team;
        console.log("Team info loaded");
        log.push(":white_check_mark: Team info loaded");
      }
    });
  }
  
  function getUserInfo () {
    slapp.client.users.list({
      token: config.bot_token
    }, (err, data) => {
      if (err) {
        console.log("Unable to load user info (" + err + "), using old data instead (if existing)");
        log.push(":warning: Unable to load user info (" + err + "), using old data instead (if existing)");
        
        kv.get('user_db', function (err, val) {
          if (err) {
            console.log("Unable to load old user info (" + err + ")");
            log.push(":warning: Unable to load old user info (" + err + ")");
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
        
        console.log("User info loaded");
        log.push(":white_check_mark: User info loaded");
        
        kv.set('user_db', user_db, function (err) {
          if (err) console.log(err);
        });
      }
    });
  }
   
  getTeamInfo();
  getUserInfo();
};
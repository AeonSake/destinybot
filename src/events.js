// ==============================
// ========== PREAMBLE ==========
// ==============================

'use strict';

const needle = require('needle');

var event_db = [];



// ============================
// ========== MODULE ==========
// ============================

module.exports = (app) => {
  let slapp = app.slapp;
  let kv = app.kv;
  let moment = app.moment;
  let config = app.config;
  let func = app.func;
  let lang = app.lang;
  let user = app.user;
  
  var module = {};
  
  
  
// ==============================
// ========== MESSAGES ==========
// ==============================
  
  
  
// ===========================
// ========== CLASS ==========
// ===========================
  
  class Event {
    constructor (data) {
      this.title = data.title;
      this.text = data.text || "";
      this.datetime = data.datetime || 0;
      this.members = data.members || [];
      this.creator = data.creator || "";
      this.ts = {
        created: data.ts.created || 0,
        edited: data.ts.edited || 0
      };
      this.posts = data.posts || [];
      this.state = data.state || 0; //0 = default, 1 = outdated, 2 = deleted
      if (!('options' in data)) data.options = {};
      this.options = {
        max: data.options.max || 6,
        color: data.options.color || func.getRandomColor()
      }; //max: 0 = all, etc;
      this.schedule_id = "";
    }
    
    setSchedule (msg, slot) {
      let ts = Date.now() + '';
      var data = {
        schedule: moment(this.datetime).subtract(10, 'm'),
        url: 'https://beepboophq.com/proxy/' + config.bb_project_id + '/slack/event',
        method: 'POST',
        headers: {
          'BB-Enrich': 'slack_team_id='+ msg.meta.team_id
        },
        payload: {
          token: msg.body.token,
          team_id: msg.meta.team_id,
          type: 'event_callback',
          event: {
            ts: ts,
            event_ts: ts,
            type: 'event_schedule',
            payload: slot,
            user: config.admin_id,
            channel: config.event_ch
          }
        }
      };
      var headers = {
        headers: {
          Authorization: 'Bearer ' + config.bb_token
        },
        json: true
      };

      needle.post('beepboophq.com/api/v1/chronos/tasks', data, headers, (err, resp) => {
        if (resp.statusCode !== 201) console.log(resp.statusCode);
        if (err) console.log(err);
        else console.log(resp.body);
      });
    }
    
    editSchedule (msg, slot) {
       var headers = {
        headers: {
          Authorization: 'Bearer ' + config.bb_token
        },
        json: true
      };
      
      needle.delete('https://beepboophq.com/api/v1/chronos/tasks/' + this.schedule_id, null, headers, (err, resp) => {
        if (err) console.log(err);
        if (resp.statusCode !== 200) console.log(resp.statusCode);
        else this.setSchedule(msg, slot);
      });
    }
    
    deleteSchedule () {
      var headers = {
        headers: {
          Authorization: 'Bearer ' + config.bb_token
        },
        json: true
      };
      
      needle.delete('https://beepboophq.com/api/v1/chronos/tasks/' + this.schedule_id, null, headers, (err, resp) => {
        if (err) console.log(err);
        if (resp.statusCode !== 200) console.log(resp.statusCode);
        else this.schedule_id = "";
      });
    }
    
    notifyMembers (slot) {
      var msg_text = {
        text: "",
        attachments: []
      };
      var btns = [
        {
          name: 'ok',
          value: slot,
          text: lang.btn.ok,
          type: 'button',
          style: 'primary'
        },
        {
          name: 'cancel',
          value: slot,
          text: lang.btn.cancel,
          type: 'button',
          style: 'danger',
          confirm: {
            title: lang.msg.confirm,
            text: lang.msg.evtl.confirmcancel,
            ok_text: lang.btn.yes,
            dismiss_text: lang.btn.no
          }
        }
      ];
      msg_text.attachments[0] = this.generateAttachment(slot);
      msg_text.attachments[0].callback_id = 'event_schedule_answer';
      msg_text.attachments[0].actions = btns;
      
      for (var i in this.members) user.sendDM(this.members[i], msg_text);
    }
    
    notifyCreator (user_id) {
      var msg_text = user.getUser(user_id).name + " " + lang.msg.evt.hascanceled + " *" + this.title + "*";
      user.sendDM(this.creator, func.generateInfoMsg(msg_text));
    }

    edit (data) {
      var temp = this.datetime;
      this.title = data.title;
      this.text = data.text;
      this.datetime = data.datetime;
      this.state = data.state;
      this.ts.edited = data.ts.edited;
      this.options.max = data.options.max;
      
      if (temp != data.datetime) this.editSchedule();
    }
    
    getData () {
      return {
        title: this.title,
        text: this.text,
        datetime: this.datetime,
        creator: this.creator,
        ts: {created: this.ts.created},
        state: this.state,
        options: {max: this.options.max, color: this.options.color}
      };
    }

    join (user_id) {
      if (this.members.length < this.options.max) {
        if (this.members.indexOf(user_id) == -1) {
          this.members.push(user_id);
          return 0;
        } else return 1;
      } else return 2;
    }

    leave (user_id) {
      var pos = this.members.indexOf(user_id);
      if (pos != -1) this.members.splice(pos, 1);
    }

    addPost (ch, ts) {
      this.posts.push({ch: ch, ts: ts});
    }

    generateAttachment (slot) {
      var temp_members = "";
      for (var i in this.members) {
        temp_members += user.getUser(this.members[i]);
        if (i < this.members.length - 1) temp_members += ", ";
      }
      
      var att_fields = [
        {
          value: moment(this.datetime).format(lang.msg.evt.dateformat),
          short: false
        },
        {
          name: lang.wrd.member + (this.options.max > 0 ? " (Max. " + this.options.max + ")" : ""),
          value: temp_members,
          short: false
        }
      ];
      
      return {
        author_name: lang.wrd.event + " #" + (slot + 1) + (this.state == 2 ? " [" + lang.wrd.deleted + "]" : ""),
        title: this.title,
        text: this.text,
        fallback: this.text,
        fields: att_fields,
        footer: "<@" + this.creator + ">",
        ts: this.ts.created,
        color: this.options.color,
        mrkdwn_in: ['text', 'pretext', 'fields']
      };
    }

    generateEvent (slot) {
      var btns = [];

      if (this.members.length < this.options.max) btns.push({
        name: 'join',
        value: slot,
        text: lang.btn.evt.join,
        value: slot, 
        type: 'button'
      });
      btns.push({
        name: 'leave',
        value: slot,
        text: lang.btn.evt.leave,
        type: 'button'
      });

      var msg_text = {
        text: lang.msg.evt.neweventcreated,
        attachments: [],
        delete_original: true
      }

      msg_text.attachments[0] = this.generateAttachment(slot);
      if (this.state == 0) {
        msg_text.attachments[0].callback_id = 'event_answer_callback';
        msg_text.attachments[0].actions = btns;
      }

      return msg_text;
    }
    
    static generateDummy (slot, data) {
      var temp_text = "<text>",
          temp_datetime = "<date>, <time>",
          temp_members = "user1, user2",
          temp_ts = 0,
          temp_max = 6,
          temp_color = "";
      if ('text' in data) temp_text = data.text;
      if ('datetime' in data) temp_datetime = moment(temp_datetime).format(lang.msg.evt.dateformat);
      if ('members' in data) {
        temp_members = "";
        for (var i in data.members) {
          temp_members += user.getUser(data.members[i]);
          if (i < data.members.length - 1) temp_members += ", ";
        }
      }
      if ('options' in data) {
        temp_max = data.options.max || 6;
        temp_color = data.options.color || "#00CCCC";
      }
      
      var att_fields = [
        {
          value: temp_datetime,
          short: false
        },
        {
          name: lang.wrd.member + (temp_max > 0 ? " (Max. " + temp_max + ")" : ""),
          value: temp_members,
          short: false
        }
      ];
      
      
      return {
        author_name: lang.wrd.event + " #" + (slot + 1) + (data.state == 2 ? " [" + lang.wrd.deleted + "]" : ""),
        title: data.title || "<title>",
        text: temp_text,
        fallback: temp_text,
        fields: att_fields,
        footer: "<@" + data.creator + ">",
        ts: temp_ts,
        color: temp_color,
        mrkdwn_in: ['text', 'pretext', 'fields']
      };
    }

    update (slot) {
      if (this.state == 0 || this.state == 1) {
        var msg_text = this.generateEvent(slot);

        for (var i = 0; i < this.posts.length; i++) {
          slapp.client.chat.update({
            token: config.bot_token,
            ts: this.posts[i].ts,
            channel: this.posts[i].ch,
            text: msg_text.text,
            attachments: msg_text.attachments,
            parse: 'full',
            link_names: 1,
            as_user: true
          }, (err, data) => {
            if (err && err.message != 'cant_update_message' && err.message != 'message_not_found' && err.message != 'channel_not_found' && err.message != 'edit_window_closed') console.log(err);
          });
        }
      }
      else this.delete();
    }

    delete () {
      for (var i = 0; i < this.posts.length; i++) {
        slapp.client.chat.delete({
          token: config.bot_token,
          ts: this.posts[i].ts,
          channel: this.posts[i].ch,
          as_user: true
        }, (err, data) => {
          if (err && err.message != 'cant_delete_message' && err.message != 'message_not_found' && err.message != 'channel_not_found') console.log(err);
        });
      }
      this.posts = [];
      this.state = 2;
      this.deleteSchedule();
    }
    
    undelete() {
      if (moment() > moment(this.datetime)) this.state = 1;
      else this.state = 0;
    }
    
    isAktive () {
      return (this.state == 0);
    }
    
    isVisible () {
      return (this.state == 0 || this.state == 1);
    }
    
    isOwner (user_id) {
      return (this.creator == user_id);
    }
  }



// ====================================
// ========== EVENT DATABASE ==========
// ====================================

  function saveEventDB () {
    kv.set('event_db', event_db, function (err) {
      if (err) console.log("ERROR: Events | Unable to save event database (" + err + ")");
    });
  }

  function loadEventDB () {
    kv.get('event_db', function (err, val) {
      if (err) {
        console.log("ERROR: Events | Unable to load event database (" + err + ")");
      } else if (typeof val !== "undefined") {
        for (var i in val.length) event_db[i] = new Event(val[i]);
        console.log("INFO: Events | Event database loaded");
      }
    });
  }
  
  function deleteEventDB () {
    kv.del('event_db', function (err) {
      if (err) console.log("WARN: Events | Unable to delete event database (" + err + ")");
    });
  }
  
  loadEventDB();
  
  
  
// ==============================
// ========== COMMANDS ==========
// ==============================  
  
  
  
  
  slapp.command('/dbevent', "test", (msg, cmd) => {
    if (msg.body.user_id == config.admin_id) {
      var data = {
        title: "test",
        datetime: moment().add(11, 'm'),
        members: [msg.body.user_id],
        creator: msg.body.user_id,
        ts: {created: 0}
      };
      event_db[0] = new Event(data);
      event_db[0].setSchedule(msg, 0);
    };
  });
  
  // ===== External event schedule trigger =====
  
  slapp.event('event_schedule', (msg) => {
    event_db[msg.body.event.payload].notifyMembers(msg.body.event.payload);
  });
  
  slapp.action('event_schedule_answer', (msg) => {
    if (msg.body.actions[0].name == 'cancel') event_db[msg.body.actions[0].value].notifyCreator(msg.body.user.id);
  });
  
  return module;
};
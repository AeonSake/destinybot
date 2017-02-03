// ==============================
// ========== PREAMBLE ==========
// ==============================

'use strict';

const os = require('os');
const config = require('./config');
const func = require('./func');

var emoji_num = [":one:", ":two:", ":three:", ":four:", ":five:", ":six:", ":seven:", ":eight:", ":nine:", ":keycap_ten:"];

// ===== LANGUAGE =====
var lang_poll = {
  poll: "Umfrage",
  user: "Nutzer",
  newpoll: "Eine neue Umfrage wurde erstellt:",
  preview: "Vorschau:",
  back: "< Zurück",
  next: "Weiter >",
  delete: "Löschen",
  title: "Titel",
  text: "Text",
  answers: "Antworten"
}

// ===== TODO =====
// ---

// ===========================
// ========== CLASS ==========
// ===========================
  
  class Poll {
    constructor (obj) {
      this.title = obj.title || "<title>";
      this.text = obj.text || "<text>";
      this.answers = obj.answers || [{text: "<answer>", votes: []}];
      this.creator = obj.creator || "";
      this.ts = obj.ts || {created: 0, edited: 0};
      this.posts = [];
      this.state = 0; //0 = default, 1 = vote closed, 2 = deleted
      this.options = obj.options || {max: 1, names: true, color: func.getRandomColor()}; //max: 0 = all, etc; names: true = show user names, false = don't show user names
    }
    
    edit(obj) {
      this.title = obj.title || this.title;
      this.text = obj.text || this.text;
      this.ts.edited = obj.ts || this.ts.edited;
      this.options.max = obj.max || this.options.max;
      this.options.names = obj.names || this.options.names;
    }
    
    close() {
      this.state = 1;
    }
    
    delete() {
      this.state = 2;
      this.posts = [];
    }
    
    addAnswer(text) {
      this.answers.push({text: text, votes: []});
    }
    
    removeAnswer(slot) {
      this.answers.splice(slot, 1);
    }
    
    editAnswer(slot, text) {
      this.answers[slot].text = text;
    }
    
    addPost(ch, ts) {
      this.posts.push({ch: ch, ts: ts});
    }
    
    generateAttachment(slot) {
      var att_fields = [];
      
      var max_votes = 0;
      for (var i = 0; i < this.answers.length; i++) {
        if (this.answers[i].votes.length > max_votes) max_votes = this.answers[i].votes.length;
      }
      
      for (var i = 0; i < this.answers.length; i++) {
        
        var votes = "";
        for (var j = 0; j < this.answers[i].votes.length; j++) {
          if (this.options.names) {
            votes += "<@" + this.answers[i].votes[j] + ">, ";
          } else {
            votes = (j + 1);
          }
        }
        
        if (this.options.names) votes = votes.slice(0, -2);
        else  votes += " " + lang_poll.user;
        votes += " *(" + Math.round((this.answers[i].votes.length / max_votes) * 100)+ "%)*";
        
        att_fields[i] = {
          title: emoji_num[i] + " " + this.answers[i].text,
          value: votes,
          short: false
        };
      }
      
      return {
        author_name: lang_poll.poll + " #" + (slot + 1),
        title: this.title,
        text: this.text,
        fallback: this.text,
        fields: att_fields,
        footer: "<@" + this.creator + ">",
        ts: this.ts.created,
        color: this.options.color,
        mrkdwn_in: ["text", "pretext", "fields"]
      };
    }
    
    generatePoll(slot) {
      var btn1 = {
        text: "",
        fallback: "",
        callback_id: 'poll_answer_callback',
        actions: [],
        color: "#CCCCCC",
        mrkdwn_in: ["text", "pretext"]
      };
      var btn2 = {
        text: "",
        fallback: "",
        callback_id: 'poll_answer_callback',
        actions: [],
        color: "#CCCCCC",
        mrkdwn_in: ["text", "pretext"]
      };
      
      for (var i = 0; i < this.answers.length; i++) {
        if (i < 5) btn1.actions[i] = {name: i, text: emoji_num[i], type: 'button'};
        else btn2.actions[i - 5] = {name: i, text: emoji_num[i], type: 'button'};
      }
      
      var msg = {
        text: lang_poll.newpoll,
        fallback: lang_poll.newpoll,
        attachments: [],
        //delete_original: true
      }
      
      msg.attachments[0] = this.generateAttachment(slot);
      if (this.state == 0) {
        msg.attachments[1] = btn1;
        if (btn2.actions.length > 0) msg.attachments[2] = btn2;
      }
      
      return msg;
    }
  }
  
// ==============================
// ========== COMMANDS ==========
// ==============================

module.exports = (app) => {
  let slapp = app.slapp;
  let kv = app.kv;
  
// ===== /poll, /poll create =====
  
  
  
// ===== /poll test =====
  
  
  slapp.command('/poll', "test (.*)", (msg, cmd) => {
    var data = {title: "TITEL", answers: [], creator: msg.body.user_id, options: {max: 1, names: false, color: func.getRandomColor()}};
    data.answers[0] = {text: lang_poll.answers, votes: [msg.body.user_id, config.bot_id]};
    data.answers[1] = {text: lang_poll.answers, votes: [msg.body.user_id]};
    data.answers[2] = {text: "Test", votes: [msg.body.user_id]};
    
    let poll = new Poll(data);
    
    msg.respond(msg.body.response_url, poll.generatePoll(0));
    return;
  });
  
  slapp.action('poll_answer_callback', (msg) => {
    var answer_id = parseInt(msg.body.actions[0].name);
    //var poll_title = msg.body.original_message.author_name.split("#").pop();
    
    console.log(answer_id);
    //console.log(poll_title);
    
    console.log(msg.body);
    
    
    /* - */
  });
  
  
  
  
  
  
  
  
  
  
  

  /* Method to randomize the border color
  function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  // Container to store poll data
  function savePollInfo (pl_title, pl_text, pl_options, pl_mode, pl_creator, pl_ts_created) {
    poll_info[poll_info.length] = {
      title : pl_title,
      text : pl_text,
      options : pl_options,
      votes : [],
      mode : pl_mode, //0 = multi-vote, 1 = 1 vote, etc
      creator : pl_creator,
      ts_created : pl_ts_created,
      ts_edited : 0,
      ts_posted : [],
      ch_posted : [],
      state : 0, //0 = default, 1 = deleted
      color : getRandomColor()
    };
  }

  // Method to update polls
  function updatePoll (slot) {
    if (poll_info[slot].state == 0) {
      var ts_list = poll_info[slot].ts_posted;
      var ch_list = poll_info[slot].ch_posted;
      var msg_att = [];
      msg_att[0] = getEventInfoAttachment(slot); //============================

      for (var i = 0; i < ts_list.length; i++) {
        slapp.client.chat.update({
          token : bot_token,
          ts : ts_list[i],
          channel : ch_list[i],
          text : "-- Updated --",
          attachments : msg_att,
          parse : "full",
          link_names : 1,
          as_user : true
        }, (err, data) => {
          if (err) console.log(err);
        });
      }
    } else deletePoll(slot);
  }

  //Method to delete polls
  function deletePoll (slot) {
    var ts_list = poll_info[slot].ts_posted;
    var ch_list = poll_info[slot].ch_posted;

    for (var i = 0; i < ts_list.length; i++) {
      slapp.client.chat.delete({
        token : bot_token,
        ts : ts_list[i],
        channel : ch_list[i],
        as_user : true
      }, (err, data) => {
        if (err) console.log(err);
      }); 
    }

    poll_info[slot].ts_posted = [];
    poll_info[slot].ch_posted = [];
  }

  // Method to get the timestamp of a bot message
  function getMessageTS (slot, ch_id) {
    var pl_id = slot + 1;
    var check = new RegExp("^(.*) \\(#" + pl_id + "\\)$");

    slapp.client.channels.history({
      token : app_token,
      channel : ch_id
    }, (err, data) => {
      if (err) console.log(err);
      else {
        var msgs = data.messages;
        for (var i = 0; i < msgs.length; i++) {
          if (msgs[i].bot_id == bot_id && check.test(msgs[i].attachments[0].title)) {
            poll_info[slot].ts_posted[poll_info[slot].ts_posted.length] = msgs[i].ts;
            poll_info[slot].ch_posted[poll_info[slot].ch_posted.length] = ch_id;
            return;
          }
        }
      }
    });
  }

  // Method to save poll_info
  function storePollInfo () {
    kv.set('poll_info', poll_info, function (err) {
      if (err) console.log(err);
    });
  }

  // Method to load poll_info
  function loadPollInfo () {
    kv.get('poll_info', function (err, val) {
      if (err) console.log(err);
      else if (typeof val !== "undefined") poll_info = val;
    });
  }

  // Method to reset event_info
  function resetPollInfo () {
    kv.del('poll_info', function (err) {
      if (err) console.log(err);
    });
  }

  // ==============================
  // ========== COMMANDS ==========
  // ==============================

  // ----- /poll, /poll create -----

  slapp.command("/poll", "(create)?(.*)", (msg, cmd) => {
    var data = {id : 0, title : "", text : "", options : [], creator : ""};
    var check1 = new RegExp("[^;]*(;|; )[^;]*(;|; )(.*)(;)?");
    var check2 = new RegExp("create [^;]*(;|; )[^;]*(;|; )(.*)(;)?");

    data.creator = msg.body.user_id;

    if (check2.test(cmd)) {
      var res_text = cmd.substring(7).split(";");
      var pl_options = [];
      for (var i = 0; i < res_text.length; i++) {
        if (i < 2) res_text[i] = res_text[i].trim();
        else pl_options[i - 2] = res_text[i].trim();
      }

      savePollInfo(res_text[0], res_text[1], pl_options, data.creator, msg.body.message_ts); //==============================


      var msg_text = getPollInfo(poll_info.length - 1);
      msg_text.text = "Vorschau:";
      //msg_text.attachments[1] = event_create_final_btns;
      msg
        .respond(msg_text)
        .route('poll_create_final_route', data, 60);
      return;
    } else {
      msg
        .respond(event_type_text_nb)
        .route('poll_create_title_route', data, 60);
      return;
    }
  });*/
};
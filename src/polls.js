// ==============================
// ========== PREAMBLE ==========
// ==============================

'use strict';

const os = require('os');
const config = require('./config');
const func = require('./func');

var emoji_num = [":one:", ":two:", ":three:", ":four:", ":five:", ":six:", ":seven:", ":eight:", ":nine:", ":keycap_ten:"];


// ===== TODO =====
// ---



// ==============================
// ========== LANGUAGE ==========
// ==============================
var lang_poll = {
  wrd: {
    poll: "Umfrage",
    user: "Nutzer",
    preview: "Vorschau",
    vote: "Stimme",
    votes: "Stimmen",
    allowed: "erlaubt"
  },
  btn: {
    back: "< Zurück",
    next: "Weiter >",
    edit: "Bearbeiten",
    open: "Öffnen",
    close: "Schließen",
    delete: "Löschen",
    cancel: "Abbrechen",
    dismiss: "Ausblenden",
    createpoll: "Umfrage erstellen",
    showpolls: "Umfragen anzeigen",
    editpoll: "Umfrage bearbeiten",
    showhelp: "Hilfe anzeigen"
  },
  msg: {
    novotes: "Keine Stimmen",
    pollclosed: "Umfrage wurde geschlossen.",
    newpollcreated: "Eine neue Umfrage wurde erstellt:",
    entertitle: "Umfragen-Titel eingeben: `/poll <title>`",
    entertext: "Umfragen-Text eingeben (optional): `/poll <text>`",
    enteranswer: "Umfragen-Antwort eingeben (mind. 2): `/poll <answer>`",
    entermax: "Wie viele Antworten sollen auswählbar sein?",
    shownames: "Sollen Nutzernamen angezeigt werden?",
    selectedit: "Welche Information soll bearbeitet werden?"
  }
}



// ==============================
// ========== MESSAGES ==========
// ==============================

var poll_main_msg = {
  text: "",
  attachments: [
    {
      text: "",
      fallback: "",
      callback_id: 'poll_main_callback',
      actions: [
        {
          name: 'createpoll',
          text: lang_poll.btn.createpoll
        },
        {
          name: 'showpoll',
          text: lang_poll.btn.showpolls
        },
        {
          name: 'editpoll',
          text: lang_poll.btn.editpoll
        },
        {
          name: 'showhelp',
          text: lang_poll.btn.showhelp
        }
      ],
      mrkdwn_in : ["text", "pretext"],
      color: config.att_color
    },
    {
      text: "",
      fallback: "",
      callback_id: 'poll_dismiss_callback',
      actions: [
        {
          name: 'dismiss',
          text: lang_poll.btn.dismiss
        }
      ],
      mrkdwn_in : ["text", "pretext"],
      color: config.att_color
    }
  ],
  response_type: 'ephemeral',
  delete_original: true
}



// ============================
// ========== MODULE ==========
// ============================

module.exports = (app) => {
  let slapp = app.slapp;
  let kv = app.kv;
  
  
  
// ===========================
// ========== CLASS ==========
// ===========================
  
  class Poll {
    constructor (obj) {
      this.title = obj.title || "<title>";
      this.text = obj.text || "<text>";
      this.answers = obj.answers || [{text: "<answer>", votes: []}];
      this.creator = obj.creator || "";
      this.ts = {created: 0, edited: 0};
      this.ts.created = obj.tscreated || 0;
      this.posts = [];
      this.state = 0; //0 = default, 1 = vote closed, 2 = deleted
      this.options = {max: 1, names: true, color: func.getRandomColor()}; //max: 0 = all, etc; names: true = show user names, false = don't show user names
      this.options.max = obj.max || 1;
      if ('names' in obj) this.options.names = obj.names;
    }

    edit (obj) {
      this.title = obj.title || this.title;
      this.text = obj.text || this.text;
      this.ts.edited = obj.ts || this.ts.edited;
      this.options.max = obj.max || this.options.max;
      this.options.names = obj.names || this.options.names;
    }

    addAnswer (text) {
      this.answers.push({text: text, votes: []});
    }

    removeAnswer (slot) {
      this.answers.splice(slot, 1);
    }

    editAnswer (slot, text) {
      this.answers[slot].text = text;
    }

    vote (slot, user) {
      var pos = this.answers[slot].votes.indexOf(user);
      if (pos == -1) {
        if (this.countVotes(user) < this.options.max) this.answers[slot].votes.push(user);
        else if (this.options.max == 1) {
          for (var i = 0; i < this.answers.length; i++) this.unvote(i, user);
          this.answers[slot].votes.push(user);
        }
      }
      else this.unvote(slot, user);
    }

    unvote (slot, user) {
      var pos = this.answers[slot].votes.indexOf(user);
      if (pos != -1) this.answers[slot].votes.splice(pos, 1);
    }

    countVotes (user) {
      var count = 0;
      for (var i = 0; i < this.answers.length; i++) {
        if (this.answers[i].votes.indexOf(user) != -1) count++;
      }

      return count;
    }

    addPost (ch, ts) {
      this.posts.push({ch: ch, ts: ts});
    }

    generateAttachment (slot) {
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
        else if (votes == 1) votes += " " + lang_poll.wrd.vote;
        else votes += " " + lang_poll.wrd.votes;
        if (this.answers[i].votes.length == 0) votes = lang_poll.msg.novotes + " *(0%)*";
        else votes += " *(" + Math.round((this.answers[i].votes.length / max_votes) * 100)+ "%)*";

        att_fields[i] = {
          title: emoji_num[i] + " " + this.answers[i].text,
          value: votes,
          short: false
        };
      }

      return {
        author_name: lang_poll.wrd.poll + " #" + (slot + 1),
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

    generatePoll (slot) {
      var prtxt = "";
      if (this.options.max != 0) {
        if (this.options.max == 1) prtxt = "Max " + this.options.max + " " + lang_poll.wrd.vote + " " + lang_poll.wrd.allowed + ".";
        else prtxt = "Max " + this.options.max + " " + lang_poll.wrd.votes + " " + lang_poll.wrd.allowed + ".";
      }
      
      var btn1 = {
        pretext: prtxt,
        text: "",
        fallback: "",
        callback_id: 'poll_answer_callback',
        actions: [],
        color: config.att_color,
        mrkdwn_in: ["text", "pretext"]
      };
      var btn2 = {
        text: "",
        fallback: "",
        callback_id: 'poll_answer_callback',
        actions: [],
        color: config.att_color,
        mrkdwn_in: ["text", "pretext"]
      };

      for (var i = 0; i < this.answers.length; i++) {
        if (i < 5) btn1.actions[i] = {name: i, text: emoji_num[i], type: 'button'};
        else btn2.actions[i - 5] = {name: i, text: emoji_num[i], type: 'button'};
      }

      var msg = {
        text: lang_poll.msg.newpollcreated,
        fallback: lang_poll.msg.newpollcreated,
        attachments: [],
        delete_original: true
      }

      msg.attachments[0] = this.generateAttachment(slot);
      if (this.state == 0) {
        msg.attachments[1] = btn1;
        if (btn2.actions.length > 0) msg.attachments[2] = btn2;
      } else if (this.state == 1) msg.attachments[1] = {text: lang_poll.msg.pollclosed, fallback: lang_poll.msg.pollclosed, color: config.att_color}

      return msg;
    }

    update (slot) {
      if (this.state == 0 || this.state == 1) {
        var msg = this.generatePoll(slot);

        for (var i = 0; i < this.posts.length; i++) {
          slapp.client.chat.update({
            token: config.bot_token,
            ts: this.posts[i].ts,
            channel: this.posts[i].ch,
            text: msg.text,
            attachments: msg.attachments,
            parse: 'full',
            link_names: 1,
            as_user: true
          }, (err, data) => {
            if (err) console.log(err);
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
          if (err) console.log(err);
        });
      }
    }

    close (slot) {
      this.state = 1;
      this.update(slot);
    }
  }



// ===================================
// ========== POLL DATABASE ==========
// ===================================
  
  var poll_db = [];

  function savePollDB () {
    kv.set('poll_db', poll_db, function (err) {
      if (err) console.log(err);
    });
  }

  function loadPollDB () {
    kv.get('poll_db', function (err, val) {
      if (err) console.log(err);
      else if (typeof val !== "undefined") poll_db = val;
    });
  }
  
  function deletePollDB () {
    kv.del('poll_info', function (err) {
      if (err) console.log(err);
    });
  }
  
  loadPollDB();
  console.log("Poll-Database loaded.");
  
  

// ==============================
// ========== COMMANDS ==========
// ==============================  
  
// ===== /poll create =====
  
  
  
// ===== /poll test =====
  
  
  slapp.command('/dbpoll', "create", (msg, cmd) => {
    var data = {title: "Poll title", text: "Poll text", answers: [], creator: msg.body.user_id, max: 1, names: false};
    data.answers[0] = {text: "Test 1", votes: []};
    data.answers[1] = {text: "Test 2", votes: []};
    data.answers[2] = {text: "Test 3", votes: []};
    
    //tscreated: msg.body.action_ts
    
    var slot = poll_db.length;
    poll_db[slot] = new Poll(data);
    
    msg.say(poll_db[slot].generatePoll(slot), (err, result) => {
      poll_db[slot].addPost(result.channel, result.ts);
      savePollDB();
    });
    return;
  });
  
  
// ===== /poll =====
  
  slapp.command('/dbpoll', "(.*)", (msg, cmd) => {
    var temp = cmd.split(";");
    
      console.log(msg.meta);
      console.log(msg);
    
    if (temp.length >= 3) {
      var data = {title: temp[0], answers: [], creator: msg.body.user_id};
      for (var i = 1; i < temp.length; i++) data.answers[i - 1] = temp[i];
      
      msg
        .respond(msg_text)
        .route('poll_create_final_route', data, 60);
      return;
    } else {
      msg
        .respond(poll_main_msg)
        .route('poll_main_route', 60);
      return;
    }
  });
  
  
// ===== Vote button callback =====
  
  slapp.action('poll_answer_callback', (msg) => {
    var answer = parseInt(msg.body.actions[0].name);
    var slot = parseInt(msg.body.original_message.attachments[0].author_name.split("#").pop()) - 1;
    var user = msg.body.user.id;
    
    poll_db[slot].vote(answer, user); //todo: show error text
    poll_db[slot].update(slot);
    return;
  });
  
// ===== Close button callback =====
  
  slapp.action('poll_dismiss_callback', (msg) => {
    var msg_text = {text: "", delete_original: true};
    msg.respond(msg.body.response_url, msg_text);
  });
  
  
  
  
  
  
  
  
  



  

  /*// Method to get the timestamp of a bot message
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
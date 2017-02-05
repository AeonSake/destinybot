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
    user: "User",
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
    showhelp: "Hilfe anzeigen",
    yes: "Ja",
    no: "Nein"
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
    selectedit: "Welche Information soll bearbeitet werden?",
    confirm: "Sind Sie sicher?",
    confirmcancel: "Sind Sie sicher, dass Sie den Vorgang abbrechen wollen?"
  }
}



// ==============================
// ========== MESSAGES ==========
// ==============================

// ===== MAIN =====

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
          text: lang_poll.btn.createpoll,
          type: 'button'
        },
        {
          name: 'showpoll',
          text: lang_poll.btn.showpolls,
          type: 'button'
        },
        {
          name: 'editpoll',
          text: lang_poll.btn.editpoll,
          type: 'button'
        },
        {
          name: 'showhelp',
          text: lang_poll.btn.showhelp,
          type: 'button'
        }
      ],
      mrkdwn_in : ["text", "pretext"]
    },
    {
      text: "",
      fallback: "",
      callback_id: 'poll_dismiss_callback',
      actions: [
        {
          name: 'dismiss',
          text: lang_poll.btn.dismiss,
          type: 'button'
        }
      ],
      mrkdwn_in : ["text", "pretext"]
    }
  ],
  response_type: 'ephemeral',
  delete_original: true
};

// ===== CREATE =====

var poll_create_title_msg = {
  text: lang_poll.wrd.preview + ":",
  attachments: [
    {},
    {
      text: lang_poll.msg.entertitle,
      fallback: lang_poll.msg.entertitle,
      mrkdwn_in : ["text", "pretext"]
    },
    {
      text: "",
      fallback: "",
      callback_id: 'poll_menu_callback',
      actions: [
        {
          name: 'cancel',
          text: lang_poll.btn.cancel,
          type: 'button',
          style: 'danger'
        }
      ],
      mrkdwn_in : ["text", "pretext"]
    }
  ],
  response_type: 'ephemeral',
  delete_original: true
};

var poll_create_text_msg = {
  text: lang_poll.wrd.preview + ":",
  attachments: [
    {},
    {
      text: lang_poll.msg.entertext,
      fallback: lang_poll.msg.entertext,
      mrkdwn_in : ["text", "pretext"]
    },
    {
      text: "",
      fallback: "",
      callback_id: 'poll_menu_callback',
      actions: [
        {
          name: 'back',
          text: lang_poll.btn.back,
          type: 'button'
        },
        {
          name: 'next',
          text: lang_poll.btn.next,
          type: 'button'
        },
        {
          name: 'cancel',
          text: lang_poll.btn.cancel,
          type: 'button',
          style: 'danger',
          confirm: {
            title: lang_poll.msg.confirm,
            text: lang_poll.msg.confirmcancel,
            ok_text: lang_poll.btn.yes,
            dismiss_text: lang_poll.btn.no
          }
        }
      ],
      mrkdwn_in : ["text", "pretext"]
    }
  ],
  response_type: 'ephemeral',
  delete_original: true
};

var poll_create_answers_msg = {
  text: lang_poll.wrd.preview + ":",
  attachments: [
    {},
    {
      text: lang_poll.msg.enteranswer,
      fallback: lang_poll.msg.enteranswer,
      mrkdwn_in : ["text", "pretext"]
    },
    {
      text: "",
      fallback: "",
      callback_id: 'poll_menu_callback',
      actions: [
        {
          name: 'back',
          text: lang_poll.btn.back,
          type: 'button'
        },
        {
          name: 'cancel',
          text: lang_poll.btn.cancel,
          type: 'button',
          style: 'danger',
          confirm: {
            title: lang_poll.msg.confirm,
            text: lang_poll.msg.confirmcancel,
            ok_text: lang_poll.btn.yes,
            dismiss_text: lang_poll.btn.no
          }
        }
      ],
      mrkdwn_in : ["text", "pretext"]
    }
  ],
  response_type: 'ephemeral',
  delete_original: true
};

var poll_create_answers2_msg = {
  text: lang_poll.wrd.preview + ":",
  attachments: [
    {},
    {
      text: lang_poll.msg.enteranswer,
      fallback: lang_poll.msg.enteranswer,
      mrkdwn_in : ["text", "pretext"]
    },
    {
      text: "",
      fallback: "",
      callback_id: 'poll_menu_callback',
      actions: [
        {
          name: 'back',
          text: lang_poll.btn.back,
          type: 'button'
        },
        {
          name: 'next',
          text: lang_poll.btn.next,
          type: 'button'
        },
        {
          name: 'cancel',
          text: lang_poll.btn.cancel,
          type: 'button',
          style: 'danger',
          confirm: {
            title: lang_poll.msg.confirm,
            text: lang_poll.msg.confirmcancel,
            ok_text: lang_poll.btn.yes,
            dismiss_text: lang_poll.btn.no
          }
        }
      ],
      mrkdwn_in : ["text", "pretext"]
    }
  ],
  response_type: 'ephemeral',
  delete_original: true
};

var poll_create_max1_msg = {
  text: lang_poll.wrd.preview + ":",
  attachments: [
    {},
    {
      text: lang_poll.msg.enteranswer,
      fallback: lang_poll.msg.enteranswer,
      mrkdwn_in : ["text", "pretext"]
    },
    {
      text: "",
      fallback: "",
      callback_id: 'poll_max_callback',
      actions: [],
      mrkdwn_in : ["text", "pretext"]
    },
    {
      text: "",
      fallback: "",
      callback_id: 'poll_menu_callback',
      actions: [
        {
          name: 'back',
          text: lang_poll.btn.back,
          type: 'button'
        },
        {
          name: 'cancel',
          text: lang_poll.btn.cancel,
          type: 'button',
          style: 'danger',
          confirm: {
            title: lang_poll.msg.confirm,
            text: lang_poll.msg.confirmcancel,
            ok_text: lang_poll.btn.yes,
            dismiss_text: lang_poll.btn.no
          }
        }
      ],
      mrkdwn_in : ["text", "pretext"]
    }
  ],
  response_type: 'ephemeral',
  delete_original: true
};

var poll_create_max2_msg = {
  text: lang_poll.wrd.preview + ":",
  attachments: [
    {},
    {
      text: lang_poll.msg.enteranswer,
      fallback: lang_poll.msg.enteranswer,
      mrkdwn_in : ["text", "pretext"]
    },
    {
      text: "",
      fallback: "",
      callback_id: 'poll_max_callback',
      actions: [],
      mrkdwn_in : ["text", "pretext"]
    },
    {
      text: "",
      fallback: "",
      callback_id: 'poll_max_callback',
      actions: [],
      mrkdwn_in : ["text", "pretext"]
    },
    {
      text: "",
      fallback: "",
      callback_id: 'poll_menu_callback',
      actions: [
        {
          name: 'back',
          text: lang_poll.btn.back,
          type: 'button'
        },
        {
          name: 'cancel',
          text: lang_poll.btn.cancel,
          type: 'button',
          style: 'danger',
          confirm: {
            title: lang_poll.msg.confirm,
            text: lang_poll.msg.confirmcancel,
            ok_text: lang_poll.btn.yes,
            dismiss_text: lang_poll.btn.no
          }
        }
      ],
      mrkdwn_in : ["text", "pretext"]
    }
  ],
  response_type: 'ephemeral',
  delete_original: true
};


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
    constructor (data) {
      this.title = data.title;
      this.text = data.text || "";
      this.answers = data.answers;
      this.creator = data.creator || "";
      this.ts = {created: 0, edited: 0};
      this.ts.created = data.tscreated || 0;
      this.posts = [];
      this.state = 0; //0 = default, 1 = vote closed, 2 = deleted
      this.options = {max: 1, names: true, color: func.getRandomColor()}; //max: 0 = all, etc; names: true = show user names, false = don't show user names
      this.options.max = data.max || 1;
      if ('names' in data) this.options.names = data.names;
    }

    edit (data) {
      this.title = data.title || this.title;
      this.text = data.text || this.text;
      this.ts.edited = data.ts || this.ts.edited;
      this.options.max = data.max || this.options.max;
      this.options.names = data.names || this.options.names;
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
        mrkdwn_in: ["text", "pretext"]
      };
      var btn2 = {
        text: "",
        fallback: "",
        callback_id: 'poll_answer_callback',
        actions: [],
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
      } else if (this.state == 1) msg.attachments[1] = {text: lang_poll.msg.pollclosed, fallback: lang_poll.msg.pollclosed}

      return msg;
    }
    
    static generateDummy (slot, data) {
      var att_fields = [];
      att_fields[0] = {
        title: emoji_num[0] + "<answer1>",
        value: "User1, User2 (100%)",
        short: false
      };
      att_fields[1] = {
        title: emoji_num[1] + "<answer2>",
        value: "User2 (50%)",
        short: false
      };
      if (!data.names) {
        att_fields[0].value = "2" + lang_poll.wrd.votes + " (100%)";
        att_fields[1].value = "1" + lang_poll.wrd.vote + " (50%)";
      }
      if ('answers' in data) {
        for (var i = 0; i < data.answers.length; i++) {
          att_fields[i].title = emoji_num[i] + "<answer" + (i + 1) + ">";
          att_fields[i].short = false;
          if (i > 1) att_fields[i].value = lang_poll.msg.novotes + " (0%)";
        }
      }
      
      return {
        author_name: lang_poll.wrd.poll + " #" + (slot + 1),
        title: data.title || "<title>",
        text: this.text || "<text>",
        fallback: this.text || "<text>",
        fields: att_fields,
        footer: "<@" + data.creator + ">",
        ts: 0,
        color: func.getRandomColor(),
        mrkdwn_in: ["text", "pretext", "fields"]
      };
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
  console.log("Poll-Database loaded");
  
  

// ==============================
// ========== COMMANDS ==========
// ==============================  
  
// ===== /poll create =====
  
  slapp.command('/dbpoll', "create", (msg, cmd) => {
    var data = {creator: msg.body.user_id};
    
    var msg_text = poll_create_title_msg;
    msg_text.attachments[0] = Poll.generateDummy(poll_db.length, data);
        
    msg
      .respond(msg_text)
      .route('poll_create_title_route', data, 60);
    return;
  });
  
  slapp.route('poll_create_title_route', (msg, data) => {
    if (msg.type == 'event') {
      msg.route('poll_create_title_route', data, 60);
      return;
    } else if (msg.type == 'action') {
      if (msg.body.actions[0].name == 'cancel') {
        msg.respond({text: "", delete_original: true});
        return;
      }
    } else {
      data.title = msg.body.text;
      var msg_text = poll_create_text_msg;
      msg_text.attachments[0] = Poll.generateDummy(poll_db.length, data);
      
      msg
        .respond(msg_text)
        .route('poll_create_text_route', data, 60);
      return;
    }
  });
  
  slapp.route('poll_create_text_route', (msg, data) => {
    if (msg.type == 'event') {
      msg.route('poll_create_text_route', data, 60);
      return;
    } else if (msg.type == 'action') {
      switch (msg.body.actions[0].name) {
        case 'back':
          var msg_text = poll_create_title_msg;
          msg_text.attachments[0] = Poll.generateDummy(poll_db.length, data);
          msg
            .respond(msg_text)
            .route('poll_create_title_route');
          break;
        case 'next':
          data.text = "";
          var msg_text = poll_create_answers_msg;
          msg_text.attachments[0] = Poll.generateDummy(poll_db.length, data);
          msg
            .respond(msg_text)
            .route('poll_create_answers_route');
          break;
        case 'cancel':
          msg.respond({text: "", delete_original: true});
          break;
      }
      return;
    } else {
      data.title = msg.body.text;
      var msg_text = poll_create_text_msg;
      msg_text.attachments[0] = Poll.generateDummy(poll_db.length, data);
      
      msg
        .respond(msg_text)
        .route('poll_create_text_route', data, 60);
      return;
    }
  });
  
  
// ===== /poll test =====
  
  
  slapp.command('/dbpoll', "test", (msg, cmd) => {
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
    
    if (temp.length >= 3) {
      var data = {title: temp[0], answers: [], creator: msg.body.user_id};
      for (var i = 1; i < temp.length; i++) data.answers[i - 1] = temp[i];
      
      msg
        .respond(msg_text)
        .route('poll_create_final_route', data, 60);
      return;
    } else {
      msg.respond(poll_main_msg);
      return;
    }
  });
  
  slapp.action('poll_main_callback', (msg) => {
    switch (msg.body.actions[0].name) {
      case 'createpoll':
        var data = {creator: msg.body.user.id};
        var msg_text = poll_create_title_msg;
        msg_text.attachments[0] = Poll.generateDummy(poll_db.length, data);
        
        msg
          .respond(msg_text)
          .route('poll_create_title_route', data, 60);
        break;
      case 'showpoll':
        msg.respond("showpoll");
        //do something
        break;
      case 'editpoll':
        msg.respond("editpoll");
        //do something
        break;
      case 'showhelp':
        msg.respond("showhelp");
        //do something
        break;
    }
    return;
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
    msg.respond({text: "", delete_original: true});
    return;
  });
  
};
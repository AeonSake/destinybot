// ==============================
// ========== PREAMBLE ==========
// ==============================

'use strict';

var emoji_num = [":one:", ":two:", ":three:", ":four:", ":five:", ":six:", ":seven:", ":eight:", ":nine:", ":keycap_ten:"];



// ============================
// ========== MODULE ==========
// ============================

module.exports = (app) => {
  let slapp = app.slapp;
  let kv = app.kv;
  let config = app.config;
  let func = app.func;
  let lang = app.lang;
  let user = app.user;
  
  var module = {};



// ==============================
// ========== MESSAGES ==========
// ==============================

// ===== MAIN =====

  module.poll_main_msg = {
    text: "",
    attachments: [
      {
        text: "",
        fallback: "",
        callback_id: 'poll_main_callback',
        actions: [
          {
            name: 'createpoll',
            text: lang.btn.poll.createpoll,
            type: 'button'
          },
          {
            name: 'showpoll',
            text: lang.btn.poll.showpolls,
            type: 'button'
          },
          {
            name: 'editpoll',
            text: lang.btn.poll.editpoll,
            type: 'button'
          },
          {
            name: 'showhelp',
            text: lang.btn.showhelp,
            type: 'button'
          }
        ],
        mrkdwn_in: ['text', 'pretext']
      },
      {
        text: "",
        fallback: "",
        callback_id: 'dismiss_callback',
        actions: [
          {
            name: 'dismiss',
            text: lang.btn.dismiss,
            type: 'button'
          }
        ],
        mrkdwn_in: ['text', 'pretext']
      }
    ],
    response_type: 'ephemeral',
    delete_original: true
  };

  // ===== CREATE =====

  var poll_create_title_msg = {
    text: lang.wrd.preview + ":",
    attachments: [
      {},
      {
        text: lang.msg.poll.entertitle,
        fallback: lang.msg.poll.entertitle,
        mrkdwn_in: ['text', 'pretext']
      },
      {
        text: "",
        fallback: "",
        callback_id: 'poll_create_menu_callback',
        actions: [
          {
            name: 'cancel',
            text: lang.btn.cancel,
            type: 'button',
            style: 'danger'
          }
        ],
        mrkdwn_in: ['text', 'pretext']
      }
    ],
    response_type: 'ephemeral',
    delete_original: true
  };

  var poll_create_title_n_msg = {
    text: lang.wrd.preview + ":",
    attachments: [
      {},
      {
        text: lang.msg.poll.entertitle,
        fallback: lang.msg.poll.entertitle,
        mrkdwn_in: ['text', 'pretext']
      },
      {
        text: "",
        fallback: "",
        callback_id: 'poll_create_menu_callback',
        actions: [
          {
            name: 'next',
            text: lang.btn.next,
            type: 'button'
          },
          {
            name: 'cancel',
            text: lang.btn.cancel,
            type: 'button',
            style: 'danger'
          }
        ],
        mrkdwn_in: ['text', 'pretext']
      }
    ],
    response_type: 'ephemeral',
    delete_original: true
  };

  var poll_create_text_msg = {
    text: lang.wrd.preview + ":",
    attachments: [
      {},
      {
        text: lang.msg.poll.entertext,
        fallback: lang.msg.poll.entertext,
        mrkdwn_in: ['text', 'pretext']
      },
      {
        text: "",
        fallback: "",
        callback_id: 'poll_create_menu_callback',
        actions: [
          {
            name: 'back',
            text: lang.btn.back,
            type: 'button'
          },
          {
            name: 'next',
            text: lang.btn.next,
            type: 'button'
          },
          {
            name: 'cancel',
            text: lang.btn.cancel,
            type: 'button',
            style: 'danger',
            confirm: {
              title: lang.msg.confirm,
              text: lang.msg.confirmcancel,
              ok_text: lang.btn.yes,
              dismiss_text: lang.btn.no
            }
          }
        ],
        mrkdwn_in: ['text', 'pretext']
      }
    ],
    response_type: 'ephemeral',
    delete_original: true
  };

  var poll_create_answers_msg = {
    text: lang.wrd.preview + ":",
    attachments: [
      {},
      {
        text: lang.msg.poll.enteranswer,
        fallback: lang.msg.poll.enteranswer,
        mrkdwn_in: ['text', 'pretext']
      },
      {
        text: "",
        fallback: "",
        callback_id: 'poll_create_menu_callback',
        actions: [
          {
            name: 'back',
            text: lang.btn.back,
            type: 'button'
          },
          {
            name: 'cancel',
            text: lang.btn.cancel,
            type: 'button',
            style: 'danger',
            confirm: {
              title: lang.msg.confirm,
              text: lang.msg.confirmcancel,
              ok_text: lang.btn.yes,
              dismiss_text: lang.btn.no
            }
          }
        ],
        mrkdwn_in: ['text', 'pretext']
      }
    ],
    response_type: 'ephemeral',
    delete_original: true
  };

  var poll_create_answers_n_msg = {
    text: lang.wrd.preview + ":",
    attachments: [
      {},
      {
        text: lang.msg.poll.enteranswer,
        fallback: lang.msg.poll.enteranswer,
        mrkdwn_in: ['text', 'pretext']
      },
      {
        text: "",
        fallback: "",
        callback_id: 'poll_create_menu_callback',
        actions: [
          {
            name: 'back',
            text: lang.btn.back,
            type: 'button'
          },
          {
            name: 'next',
            text: lang.btn.next,
            type: 'button'
          },
          {
            name: 'cancel',
            text: lang.btn.cancel,
            type: 'button',
            style: 'danger',
            confirm: {
              title: lang.msg.confirm,
              text: lang.msg.confirmcancel,
              ok_text: lang.btn.yes,
              dismiss_text: lang.btn.no
            }
          }
        ],
        mrkdwn_in: ['text', 'pretext']
      }
    ],
    response_type: 'ephemeral',
    delete_original: true
  };

  var poll_create_max_msg = {
    text: lang.wrd.preview + ":",
    attachments: [
      {},
      {
        text: lang.msg.poll.entermax,
        fallback: lang.msg.poll.entermax,
        mrkdwn_in: ['text', 'pretext']
      },
      {
        text: "",
        fallback: "",
        callback_id: 'poll_create_max_callback',
        actions: [],
        mrkdwn_in: ['text', 'pretext']
      },
      {
        text: "",
        fallback: "",
        callback_id: 'poll_create_max_callback',
        actions: [],
        mrkdwn_in: ['text', 'pretext']
      },
      {
        text: "",
        fallback: "",
        callback_id: 'poll_create_menu_callback',
        actions: [
          {
            name: 'back',
            text: lang.btn.back,
            type: 'button'
          },
          {
            name: 'next',
            text: lang.btn.next,
            type: 'button'
          },
          {
            name: 'cancel',
            text: lang.btn.cancel,
            type: 'button',
            style: 'danger',
            confirm: {
              title: lang.msg.confirm,
              text: lang.msg.confirmcancel,
              ok_text: lang.btn.yes,
              dismiss_text: lang.btn.no
            }
          }
        ],
        mrkdwn_in: ['text', 'pretext']
      }
    ],
    response_type: 'ephemeral',
    delete_original: true
  };

  var poll_create_names_msg = {
    text: lang.wrd.preview + ":",
    attachments: [
      {},
      {
        text: lang.msg.poll.shownames,
        fallback: lang.msg.poll.shownames,
        callback_id: 'poll_create_names_callback',
        actions: [
          {
            name: 'yes',
            text: lang.btn.yes,
            type: 'button'
          },
          {
            name: 'no',
            text: lang.btn.no,
            type: 'button'
          }
        ],
        mrkdwn_in: ['text', 'pretext']
      },
      {
        text: "",
        fallback: "",
        callback_id: 'poll_create_menu_callback',
        actions: [
          {
            name: 'back',
            text: lang.btn.back,
            type: 'button'
          },
          {
            name: 'next',
            text: lang.btn.next,
            type: 'button'
          },
          {
            name: 'cancel',
            text: lang.btn.cancel,
            type: 'button',
            style: 'danger',
            confirm: {
              title: lang.msg.confirm,
              text: lang.msg.confirmcancel,
              ok_text: lang.btn.yes,
              dismiss_text: lang.btn.no
            }
          }
        ],
        mrkdwn_in: ['text', 'pretext']
      }
    ],
    response_type: 'ephemeral',
    delete_original: true
  };

  var poll_create_final_msg = {
    text: lang.wrd.preview + ":",
    attachments: [
      {},
      {
        text: "",
        fallback: "",
        callback_id: 'poll_create_menu_callback',
        actions: [
          {
            name: 'edit',
            text: lang.btn.edit,
            type: 'button'
          },
          {
            name: 'done',
            text: lang.btn.done,
            type: 'button',
            style: 'primary'
          },
          {
            name: 'cancel',
            text: lang.btn.cancel,
            type: 'button',
            style: 'danger',
            confirm: {
              title: lang.msg.confirm,
              text: lang.msg.confirmcancel,
              ok_text: lang.btn.yes,
              dismiss_text: lang.btn.no
            }
          }
        ],
        mrkdwn_in: ['text', 'pretext']
      }
    ],
    response_type: 'ephemeral',
    delete_original: true
  };
  
  // ===== SHOW =====
  
  var poll_show_msg = {
    text: "",
    attachments: [],
    response_type: 'ephemeral',
    delete_original: true
  };
  
  function poll_show_pages_att (cur, count) {
    var btns = [];
    var max = Math.ceil(count / 5);
    
    if (cur != 1) btns.push({
      name: 'back',
      text: "<",
      type: 'button'
    });
    btns.push({
      name: 'page',
      text: lang.wrd.page + " " + cur + " / " + max,
      type: 'button'
    });
    if (cur == max) btns.push({
      name: 'next',
      text: ">",
      type: 'button'
    });
    btns.push({
      name: 'dismiss',
      text: lang.btn.dismiss,
      type: 'button'
    });
    
    return {
      text: count + " " + lang.msg.poll.openpolls,
      fallback: "",
      callback_id: 'poll_show_pages_callback',
      actions: btns,
      mrkdwn_in: ['text', 'pretext']
    };
  };
  
  
  
  
  
  
  
  
  
  
  var poll_dismiss_att = {
    text: "",
    fallback: "",
    callback_id: 'dismiss_callback',
    actions: [
      {
        name: 'dismiss',
        text: lang.btn.dismiss,
        type: 'button'
      }
    ],
    mrkdwn_in: ['text', 'pretext']
  };
  
  

// ===========================
// ========== CLASS ==========
// ===========================
  
  class Poll {
    constructor (data) {
      this.title = data.title;
      this.text = data.text || "";
      this.answers = data.answers || [];
      //for (var i = 0; i < data.answers.length; i++) this.answers[i] = {text: data.answers[i], votes: []};
      this.creator = data.creator || "";
      this.ts = {created: data.ts.created || 0, edited: data.ts.edited || 0};
      this.posts = data.posts || [];
      this.state = data.state || 0; //0 = default, 1 = vote closed, 2 = deleted
      this.options = {
        max: data.options.max || 1, 
        names: true,
        color: data.options.color || func.getRandomColor()
      }; //max: 0 = all, etc; names: true = show user names, false = don't show user names
      if ('names' in data.options) this.options.names = data.options.names;
    }

    edit (data) {
      this.title = data.title || this.title;
      this.text = data.text || this.text;
      this.ts.edited = data.ts.edited || this.ts.edited;
      this.options.max = data.options.max || this.options.max;
      this.options.names = data.options.names || this.options.names;
    }

    addAnswer (text) {
      this.answers.push({text: text, votes: []});
    }

    removeAnswer (answer) {
      this.answers.splice(answer, 1);
    }

    editAnswer (answer, text) {
      this.answers[answer].text = text;
    }

    vote (answer, user) {
      var pos = this.answers[answer].votes.indexOf(user);
      if (pos == -1) {
        if (this.countVotes(user) < this.options.max) this.answers[answer].votes.push(user);
        else if (this.options.max == 1) {
          for (var i = 0; i < this.answers.length; i++) this.unvote(i, user);
          this.answers[answer].votes.push(user);
        }
      }
      else this.unvote(answer, user);
    }

    unvote (answer, user) {
      var pos = this.answers[answer].votes.indexOf(user);
      if (pos != -1) this.answers[answer].votes.splice(pos, 1);
    }

    countVotes (user) {
      var count = 0;
      for (var i = 0; i < this.answers.length; i++) {
        if (this.answers[i].votes.indexOf(user) != -1) count++;
      }

      return count;
    }
    
    collectVoters () {
      var voters = [];
      
      for (var i = 0; i < this.answers.length; i++) {
        for (var j = 0; j < this.answers[i].votes.length; j++) {
          if (voters.indexOf(this.answers[i].votes[j]) == -1) voters.push(this.answers[i].votes[j]);
        }
      }
      
      return voters;
    }

    addPost (ch, ts) {
      this.posts.push({ch: ch, ts: ts});
    }

    generateAttachment (slot) {
      var att_fields = [];
      var voter_count = this.collectVoters().length;

      for (var i = 0; i < this.answers.length; i++) {
        var votes = "";
        for (var j = 0; j < this.answers[i].votes.length; j++) {
          if (this.options.names) {
            votes += user.getUser(this.answers[i].votes[j]).name + ", ";
          } else {
            votes = (j + 1);
          }
        }

        if (this.options.names) votes = votes.slice(0, -2);
        else if (votes == 1) votes += " " + lang.wrd.vote;
        else votes += " " + lang.wrd.votes;
        if (this.answers[i].votes.length == 0) votes = lang.msg.poll.novotes + " *(0%)*";
        else votes += " *(" + Math.round((this.answers[i].votes.length / voter_count) * 100)+ "%)*";

        att_fields[i] = {
          title: emoji_num[i] + " " + this.answers[i].text,
          value: votes,
          short: false
        };
      }

      return {
        author_name: lang.wrd.poll + " #" + (slot + 1),
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

    generatePoll (slot) {
      var prtxt = "";
      if (this.options.max != 0) {
        if (this.options.max == 1) prtxt = "Max. " + this.options.max + " " + lang.wrd.vote + " " + lang.wrd.allowed + ".";
        else prtxt = "Max. " + this.options.max + " " + lang.wrd.votes + " " + lang.wrd.allowed + ".";
      }
      
      var btn1 = {
        pretext: prtxt,
        text: "",
        fallback: "",
        callback_id: 'poll_answer_callback',
        actions: [],
        mrkdwn_in: ['text', 'pretext']
      };
      var btn2 = {
        text: "",
        fallback: "",
        callback_id: 'poll_answer_callback',
        actions: [],
        mrkdwn_in: ['text', 'pretext']
      };

      for (var i = 0; i < this.answers.length; i++) {
        if (i < 5) btn1.actions[i] = {name: i, text: emoji_num[i], value: slot, type: 'button'};
        else btn2.actions[i - 5] = {name: i, text: emoji_num[i], value: slot, type: 'button'};
      }

      var msg = {
        text: lang.msg.poll.newpollcreated,
        fallback: lang.msg.poll.newpollcreated,
        attachments: [],
        delete_original: true
      }

      msg.attachments[0] = this.generateAttachment(slot);
      if (this.state == 0) {
        msg.attachments[1] = btn1;
        if (btn2.actions.length > 0) msg.attachments[2] = btn2;
      } else if (this.state == 1) msg.attachments[1] = {text: lang.msg.poll.pollclosed, fallback: lang.msg.poll.pollclosed}

      return msg;
    }
    
    static generateDummy (slot, data) {
      var temp_text = "<text>";
      if ('text' in data) temp_text = data.text;
      
      var att_fields = [];
      att_fields[0] = {
        title: emoji_num[0] + " <answer1>",
        value: "user1, user2 (100%)",
        short: false
      };
      att_fields[1] = {
        title: emoji_num[1] + " <answer2>",
        value: "user2 (50%)",
        short: false
      };
      
      if ('answers' in data) {
        for (var i = 0; i < data.answers.length; i++) {
          att_fields[i] = {
            title: emoji_num[i] + " " + data.answers[i].title,
            value: lang.msg.poll.novotes + " (0%)",
            short: false
          }
        }
      }
      
      return {
        author_name: lang.wrd.poll + " #" + (slot + 1),
        title: data.title || "<title>",
        text: temp_text,
        fallback: temp_text,
        fields: att_fields,
        footer: "<@" + data.creator + ">",
        ts: 0,
        color: func.getRandomColor(),
        mrkdwn_in: ['text', 'pretext', 'fields']
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
    
    isOpen () {
      return (this.state == 0);
    }
    
    isOwner (user) {
      return (this.creator == user);
    }
  }



// ===================================
// ========== POLL DATABASE ==========
// ===================================
  
  var poll_db = [];

  function savePollDB () {
    kv.set('poll_db', poll_db, function (err) {
      if (err) func.addLogEntry("Unable to save poll database (" + err + ")", 3);
    });
  }

  function loadPollDB () {
    kv.get('poll_db', function (err, val) {
      if (err) {
        func.addLogEntry("Unable to load poll database (" + err + ")", 3);
      
      } else if (typeof val !== "undefined") {
        //poll_db = val;
        for (var i = 0; i < val.length; i++) poll_db[i] = new Poll(val[i]);
        
        func.addLogEntry("Poll database loaded", 1);
      }
    });
  }
  
  function deletePollDB () {
    kv.del('poll_info', function (err) {
      if (err) func.addLogEntry("Unable to delete poll database (" + err + ")", 2);
    });
  }
  
  loadPollDB();
  
  
  
// ==============================
// ========== COMMANDS ==========
// ==============================  
  
// ===== /poll create =====
  
  slapp.command('/dbpoll', "create", (msg, cmd) => {
    var data = {creator: msg.body.user_id};
    
    var msg_text = poll_create_title_msg;
    msg_text.attachments[0] = Poll.generateDummy(poll_db.length, data);
    
    msg.respond(msg_text);
    msg.route('poll_create_title_route', data, 60);
    return;
  });
  
  slapp.route('poll_create_title_route', (msg, data) => {
    if (msg.type == 'event') {
      msg.route('poll_create_title_route', data, 60);
      return;
    } else if (msg.type == 'action') {
      switch (msg.body.actions[0].name) {
        case 'next':
          var msg_text = poll_create_text_msg;
          msg_text.attachments[0] = Poll.generateDummy(poll_db.length, data);
          msg.respond(msg_text);
          msg.route('poll_create_text_route', data, 60);
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
      
      msg.respond(msg_text);
      msg.route('poll_create_text_route', data, 60);
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
          var msg_text = poll_create_title_n_msg;
          msg_text.attachments[0] = Poll.generateDummy(poll_db.length, data);
          msg.respond(msg_text);
          msg.route('poll_create_title_route', data, 60);
          break;
        case 'next':
          if (!('text' in data)) data.text = "";
          var msg_text = poll_create_answers_msg;
          msg_text.attachments[0] = Poll.generateDummy(poll_db.length, data);
          msg.respond(msg_text);
          msg.route('poll_create_answers_route', data, 60);
          break;
        case 'cancel':
          msg.respond({text: "", delete_original: true});
          break;
      }
      return;
    } else {
      data.text = msg.body.text;
      var msg_text = poll_create_text_msg;
      msg_text.attachments[0] = Poll.generateDummy(poll_db.length, data);
      
      msg.respond(msg_text);
      msg.route('poll_create_answers_route', data, 60);
      return;
    }
  });
  
  slapp.route('poll_create_answers_route', (msg, data) => {
    if (msg.type == 'event') {
      msg.route('poll_create_answers_route', data, 60);
      return;
    } else if (msg.type == 'action') {
      switch (msg.body.actions[0].name) {
        case 'back':
          var msg_text = poll_create_text_msg;
          msg_text.attachments[0] = Poll.generateDummy(poll_db.length, data);
          msg.respond(msg_text);
          msg.route('poll_create_text_route', data, 60);
          break;
        case 'next':
          if (data.answers.length >= 2) {
            var msg_text = poll_create_max_msg;
            msg_text.attachments[0] = Poll.generateDummy(poll_db.length, data);
            
            for (var i = 0; i < data.answers.length; i++) {
              var btn = {name: i, text: i, type: 'button'};
              if (i < 5) msg_text.attachments[2].actions[i] = btn;
              else msg_text.attachments[3].actions[i - 5] = btn;
            }
            msg_text.attachments[2].actions[0].text = lang.btn.all;
            if (data.answers.length <= 5) msg_text.attachments.splice(3, 1);
            
            msg.respond(msg_text);
            msg.route('poll_create_max_route', data, 60);
          } else {
            msg.route('poll_create_answers_route', data, 60);
          }
          break;
        case 'cancel':
          msg.respond({text: "", delete_original: true});
          break;
      }
      return;
    } else {
      var temp = msg.body.text.split(";");
      if (temp[temp.length - 1].trim() == "") temp = temp.slice(0, -1);
      
      if (!('answers' in data)) data.answers = [];
      for (var i = 0; i < Math.min(temp.length, 10); i++) data.answers.push({text: temp[i].trim(), votes: []});
      
      if (data.answers.length < 10) {
        if (data.answers.length >= 2) var msg_text = poll_create_answers_n_msg;
        else var msg_text = poll_create_answers_msg;
        msg_text.attachments[0] = Poll.generateDummy(poll_db.length, data);
        msg.respond(msg_text);
        msg.route('poll_create_answers_route', data, 60);
      } else {
        var msg_text = poll_create_max_msg;
        msg_text.attachments[0] = Poll.generateDummy(poll_db.length, data);
        
        for (var i = 0; i < data.answers.length; i++) {
          var btn = {name: i, text: i, type: 'button'};
          if (i < 5) msg_text.attachments[2].actions[i] = btn;
          else msg_text.attachments[3].actions[i - 5] = btn;
        }
        msg_text.attachments[2].actions[0].text = lang.btn.all;
        if (data.answers.length <= 5) msg_text.attachments.splice(3, 1);
        
        msg.respond(msg_text);
        msg.route('poll_create_max_route', data, 60);
      }
      return;
    }
  });
  
  slapp.route('poll_create_max_route', (msg, data) => {
    if (msg.type != 'action') {
      msg.route('poll_create_max_route', data, 60);
      return;
    } else {
      switch (msg.body.actions[0].name) {
        case 'back':
          var msg_text = poll_create_answers_msg;
          msg_text.attachments[0] = Poll.generateDummy(poll_db.length, data);
          msg.respond(msg_text);
          msg.route('poll_create_answers_route', data, 60);
          return;
        case 'next':
          var msg_text = poll_create_names_msg;
          msg_text.attachments[0] = Poll.generateDummy(poll_db.length, data);
          msg.respond(msg_text);
          msg.route('poll_create_names_route', data, 60);
          return;
        case 'cancel':
          msg.respond({text: "", delete_original: true});
          return;
      }
      
      var temp = parseInt(msg.body.actions[0].name) || -1;
      if (temp >= 0 && temp <= data.answers.length) {
        data.options.max = temp;
        var msg_text = poll_create_names_msg;
        msg_text.attachments[0] = Poll.generateDummy(poll_db.length, data);
        msg.respond(msg_text);
        msg.route('poll_create_names_route', data, 60);
      }
      return;
    }
  });
  
  slapp.route('poll_create_names_route', (msg, data) => {
    if (msg.type != 'action') {
      msg.route('poll_create_names_route', data, 60);
      return;
    } else {
      switch (msg.body.actions[0].name) {
        case 'yes':
          data.options.names = true;
          break;
        case 'no':
          data.options.names = false;
          break;
        case 'back':
          var msg_text = poll_create_max_msg;
          msg_text.attachments[0] = Poll.generateDummy(poll_db.length, data);
          msg.respond(msg_text);
          msg.route('poll_create_max_route', data, 60);
          return;
        case 'next':
          break;
        case 'cancel':
          msg.respond({text: "", delete_original: true});
          return;
      }
      
      var msg_text = poll_create_final_msg;
      msg_text.attachments[0] = Poll.generateDummy(poll_db.length, data);
      msg.respond(msg_text);
      msg.route('poll_create_final_route', data, 60);
      return;
    }
  });
  
  slapp.route('poll_create_final_route', (msg, data) => {
    if (msg.type != 'action') {
      msg.route('poll_create_final_route', data, 60);
      return;
    } else {
      switch (msg.body.actions[0].name) {
        case 'edit':
          var msg_text = poll_edit_msg;
          msg_text.attachments[0] = Poll.generateDummy(poll_db.length, data);
          msg.respond(msg_text);
          msg.route('poll_create_edit_route', data, 60);
          return;
        case 'done':
          break;
        case 'cancel':
          msg.respond({text: "", delete_original: true});
          return;
      }
      
      data.ts.created = msg.body.action_ts;
      var slot = poll_db.length;
      poll_db[slot] = new Poll(data);
      var msg_text = poll_db[slot].generatePoll(slot);
      msg_text.channel = config.poll_ch;
      
      msg.respond({text: "", delete_original: true});
      msg.say(msg_text, (err, result) => {
        poll_db[slot].addPost(result.channel, result.ts);
        savePollDB();
      });
    }
  });
  
// ===== /poll show =====
  
  slapp.command('/dbpoll', "(show|list)(.*)", (msg, cmd) => {
    var check = new RegExp("\\d{1,4}");
    var msg_text = {};
    
    if (cmd.substring(0,4) == "show" && check.test(cmd.substring(5))) {
      var slot = parseInt(cmd.substring(5)) - 1;
      
      if (slot < poll_db.length) {
        msg_text = poll_db[slot].generatePoll(slot);
        msg_text.text = "";
        msg_text.attachments.push(poll_dismiss_att);
      } else {
        msg_text = func.generateInfoMsg(lang.err.poll.notfound);
      }
    } else {
      msg_text = poll_show_msg;
      var openpolls = 0;
      
      for (var i = 0; i < poll_db.length; i++) {
        if (poll_db[i].isOpen() && openpolls < 5) {
          var temp = (poll_db[i].generatePoll(i)).attachments;
          msg_text.attachments.push(temp);
          openpolls++;
        }
      }
         
      if (openpolls > 5) msg_text.attachments.push(poll_show_pages_att(1,openpolls));
      else msg_text.attachments.push(poll_dismiss_att);
    }
    
    msg.respond(msg_text);
    return;
  });
  
  slapp.action('poll_show_pages_callback', (msg) => {
    switch (msg.body.actions[0].name) {
      case 'back':
        break;
      case 'next':
        break;
      case 'page':
        break;
      case 'dismiss':
        msg.respond({text: "", delete_original: true});
        break;
    }
    
    return;
  });
  
  // ===== /poll post =====
  
  slapp.command('/dbpoll', "post \\d{1,4}", (msg, cmd) => {
    var slot = parseInt(cmd.substring(5)) - 1;
    
    if (slot < poll_db.length) {
      msg.say(poll_db[slot].generatePoll(slot), (err, result) => {
        poll_db[slot].addPost(result.channel, result.ts);
        savePollDB();
      });
    }
    else msg.respond(func.generateInfoMsg(lang.err.poll.notfound));
    
    return;
  });
  
// ===== /poll test =====
  
  slapp.command('/dbpoll', "test", (msg, cmd) => {
    
    return;
  });
  
// ===== /poll =====
  
  slapp.command('/dbpoll', "(.*)", (msg, cmd) => {
    var temp = cmd.split(";");
    if (temp[temp.length - 1].trim() == "") temp = temp.slice(0, -1);
    
    if (temp.length >= 3) {
      var data = {title: temp[0], answers: [], creator: msg.body.user_id};
      for (var i = 1; i < temp.length; i++) data.answers[i - 1] = {text: temp[i].trim(), votes: []};
      
      msg.respond(msg_text);
      msg.route('poll_create_final_route', data, 60);
      return;
    } else {
      msg.respond(module.poll_main_msg);
      return;
    }
  });
  
  slapp.action('poll_main_callback', (msg) => {
    switch (msg.body.actions[0].name) {
      case 'createpoll':
        var data = {creator: msg.body.user.id};
        var msg_text = poll_create_title_msg;
        msg_text.attachments[0] = Poll.generateDummy(poll_db.length, data);
        
        msg.respond(msg_text);
        msg.route('poll_create_title_route', data, 60);
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
    var slot = parseInt(msg.body.actions[0].value);
    
    poll_db[slot].vote(answer, msg.body.user.id); //todo: show error text
    poll_db[slot].update(slot);
    savePollDB();
    
    if (!('original_message' in msg)) msg.respond({text: "", delete_original: true});
    return;
  });
  
  return module;
};
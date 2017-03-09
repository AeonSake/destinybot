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
  
  // ===== MAIN =====

  module.event_main_msg = {
    text: "",
    attachments: [
      {
        text: lang.msg.evt.main,
        fallback: lang.msg.evt.main,
        callback_id: 'event_main_callback',
        actions: [
          {
            name: 'create',
            text: lang.btn.create,
            type: 'button'
          },
          {
            name: 'show',
            text: lang.btn.show,
            type: 'button'
          },
          {
            name: 'edit',
            text: lang.btn.edit,
            type: 'button'
          },
          {
            name: 'help',
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
    replace_original: true
  };

  // ===== CREATE =====

  var event_create_title_msg = {
    text: lang.wrd.preview + ":",
    attachments: [
      {},
      {
        text: lang.msg.evt.entertitle,
        fallback: lang.msg.evt.entertitle,
        mrkdwn_in: ['text', 'pretext']
      },
      {
        text: "",
        fallback: "",
        callback_id: 'event_create_menu_callback',
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
    replace_original: true
  };

  var event_create_title_n_msg = {
    text: lang.wrd.preview + ":",
    attachments: [
      {},
      {
        text: lang.msg.evt.entertitle,
        fallback: lang.msg.evt.entertitle,
        mrkdwn_in: ['text', 'pretext']
      },
      {
        text: "",
        fallback: "",
        callback_id: 'event_create_menu_callback',
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
    replace_original: true
  };

  var event_create_text_msg = {
    text: lang.wrd.preview + ":",
    attachments: [
      {},
      {
        text: lang.msg.evt.entertext,
        fallback: lang.msg.evt.entertext,
        mrkdwn_in: ['text', 'pretext']
      },
      {
        text: "",
        fallback: "",
        callback_id: 'event_create_menu_callback',
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
    replace_original: true
  };
  
  var event_create_datetime_msg = {
    text: lang.wrd.preview + ":",
    attachments: [
      {},
      {
        text: lang.msg.evt.enterdatetime,
        fallback: lang.msg.evt.enterdatetime,
        mrkdwn_in: ['text', 'pretext']
      },
      {
        text: "",
        fallback: "",
        callback_id: 'event_create_menu_callback',
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
    replace_original: true
  };
  
  var event_create_datetime_n_msg = {
    text: lang.wrd.preview + ":",
    attachments: [
      {},
      {
        text: lang.msg.evt.enterdatetime,
        fallback: lang.msg.evt.enterdatetime,
        mrkdwn_in: ['text', 'pretext']
      },
      {
        text: "",
        fallback: "",
        callback_id: 'event_create_menu_callback',
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
    replace_original: true
  };

  var event_create_max_msg = {
    text: lang.wrd.preview + ":",
    attachments: [
      {},
      {
        text: lang.msg.evt.entermax,
        fallback: lang.msg.evt.entermax,
        mrkdwn_in: ['text', 'pretext']
      },
      {
        text: "",
        fallback: "",
        callback_id: 'event_create_max_callback',
        actions: [
          {
            name: '0',
            text: lang.btn.evt.nomax,
            type: 'button'
          },
          {
            name: '2',
            text: "2",
            type: 'button'
          },
          {
            name: '3',
            text: "3",
            type: 'button'
          },
          {
            name: '6',
            text: "6",
            type: 'button'
          },
          {
            name: '12',
            text: "12",
            type: 'button'
          },
        ],
        mrkdwn_in: ['text', 'pretext']
      },
      {
        text: "",
        fallback: "",
        callback_id: 'event_create_menu_callback',
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
    replace_original: true
  };

  var event_create_final_msg = {
    text: lang.wrd.preview + ":",
    attachments: [
      {},
      {
        text: "",
        fallback: "",
        callback_id: 'event_create_menu_callback',
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
    replace_original: true
  };
  
  // ===== SHOW =====
  
  function event_show_filter_att (mode, sort) {
    var btns = [];
    
    if (mode != 0) btns.push({
      name: "0-" + sort,
      text: lang.btn.evt.allevents,
      type: 'button'
    });
    if (mode != 1) btns.push({
      name: "1-" + sort,
      text: lang.btn.evt.comingevents,
      type: 'button'
    });
    if (mode != 2) btns.push({
      name: "2-" + sort,
      text: lang.btn.evt.outdatedevents,
      type: 'button'
    });
    if (mode != 3) btns.push({
      name: "3-" + sort,
      text: lang.btn.evt.myevents,
      type: 'button'
    });
    if (sort == 'asc') btns.push({
      name: mode + "-desc",
      text: lang.btn.desc,
      type: 'button'
    });
    if (sort == 'desc') btns.push({
      name: mode + "-asc",
      text: lang.btn.asc,
      type: 'button'
    });
    
    return {
      text: lang.wrd.filter + ":",
      fallback: "",
      callback_id: 'event_show_filter_callback',
      actions: btns,
      mrkdwn_in: ['text', 'pretext']
    };
  }
  
  function event_show_pages_att (page, count, mode, sort) {
    var btns = [],
        max = Math.ceil(count / 5);
    
    if (page != 0) btns.push({
      name: 'back-' + mode + "-" + sort,
      value: page - 1,
      text: "<",
      type: 'button'
    });
    btns.push({
      name: 'page',
      text: lang.wrd.page + " " + (page + 1) + " / " + max,
      type: 'button'
    });
    if (page + 1 < max) btns.push({
      name: 'next-' + mode + "-" + sort,
      value: page + 1,
      text: ">",
      type: 'button'
    });
    btns.push({
      name: 'dismiss',
      text: lang.btn.dismiss,
      type: 'button'
    });
    
    return {
      text: lang.wrd.total + ": " + count + " " + (count > 1 ? lang.wrd.events : lang.wrd.event),
      fallback: "",
      callback_id: 'event_show_pages_callback',
      actions: btns,
      mrkdwn_in: ['text', 'pretext']
    };
  }
  
  function event_list_msg (page, mode, sort, user_id) {
    var msg_text = {
      text: "",
      attachments: [],
      response_type: 'ephemeral',
      replace_original: true
    };
    var eventcount = 0;
    // options.mode: 0 = all, 1 = coming, 2 = outdated, 3 = own
    
    for (var i in event_db) {
      var j = (sort == 'asc' ? i : event_db.length - i - 1);
      
      switch(mode) {
        case 0:
          if (event_db[j].isVisible()) {
            if (eventcount >= page * 5 && eventcount < page * 5 + 5) msg_text.attachments = msg_text.attachments.concat(event_db[j].generateEvent().attachments);
            eventcount++;
          }
          break;
        case 1:
          if (event_db[j].isAktive()) {
            if (eventcount >= page * 5 && eventcount < page * 5 + 5) msg_text.attachments = msg_text.attachments.concat(event_db[j].generateEvent().attachments);
            eventcount++;
          }
          break;
        case 2:
          if (event_db[j].isVisible() && !event_db[j].isAktive()) {
            if (eventcount >= page * 5 && eventcount < page * 5 + 5) msg_text.attachments = msg_text.attachments.concat(event_db[j].generateEvent().attachments);
            eventcount++;
          }
          break;
        case 3:
          if (event_db[j].isVisible() && event_db[j].isOwner(user_id)) {
            if (eventcount >= page * 5 && eventcount < page * 5 + 5) {
              msg_text.attachments = msg_text.attachments.concat(event_db[j].generateEvent().attachments);
              msg_text.attachments.push(event_edit_del_att(event_db[j].getData().id));
            }
            eventcount++;
          }
          break;
      }
    }
    
    msg_text.attachments.push(event_show_filter_att(mode, sort));
    if (eventcount == 0) {
      msg_text.text = lang.msg.evt.noeventfound;
      msg_text.attachments.push(event_dismiss_att);
    } else msg_text.attachments.push(event_show_pages_att(page, eventcount, mode, sort));
    
    return msg_text;
  }
  
  // ===== EDIT =====
  
  function event_edit_del_att (id) {
    return {
      text: "",
      fallback: "",
      callback_id: 'event_edit_del_callback',
      actions: [
        {
          name: 'edit',
          value: id,
          text: lang.btn.edit,
          type: 'button'
        },
        {
          name: 'delete',
          value: id,
          text: lang.btn.delete,
          type: 'button',
          style: 'danger',
          confirm: {
            title: lang.msg.confirm,
            text: lang.msg.evt.confirmdelete,
            ok_text: lang.btn.yes,
            dismiss_text: lang.btn.no
          }
        }
      ],
      mrkdwn_in: ['text', 'pretext']
    };
  }
  
  function event_edit_pages_att (page, count, sort) {
    var btns = [],
        max = Math.ceil(count / 5);
    
    if (page != 0) btns.push({
      name: 'back-' + sort,
      value: page - 1,
      text: "<",
      type: 'button'
    });
    btns.push({
      name: 'page',
      text: lang.wrd.page + " " + (page + 1) + " / " + max,
      type: 'button'
    });
    if (page + 1 < max) btns.push({
      name: 'next-' + sort,
      value: page + 1,
      text: ">",
      type: 'button'
    });
    if (sort == 'asc') btns.push({
      name: 'desc',
      text: lang.btn.desc,
      type: 'button'
    });
    else btns.push({
      name: 'asc',
      text: lang.btn.asc,
      type: 'button'
    });
    btns.push({
      name: 'dismiss',
      text: lang.btn.dismiss,
      type: 'button'
    });
    
    return {
      text: lang.wrd.total + ": " + count + " " + (count > 1 ? lang.wrd.events : lang.wrd.event),
      fallback: "",
      callback_id: 'event_edit_pages_callback',
      actions: btns,
      mrkdwn_in: ['text', 'pretext']
    };
  }
  
  function event_edit_list_msg (user_id, page, sort) {
    var msg_text = {
      text: "",
      attachments: [],
      response_type: 'ephemeral',
      replace_original: true
    };
    var eventcount = 0;
    
    for (var i in event_db) {
      var j = (sort == 'asc' ? i : event_db.length - i - 1);
      
      if (event_db[j].isVisible() && event_db[j].isOwner(user_id)) {
        if (eventcount >= page * 5 && eventcount < page * 5 + 5) {
          msg_text.attachments.push(event_db[j].generateAttachment());
          msg_text.attachments.push(event_edit_del_att(event_db[j].getData().id));
        }
        eventcount++;
      }
    }
    
    if (eventcount == 0) {
      msg_text.text = lang.msg.evt.nopollfound;
      msg_text.attachments.push(event_dismiss_att);
    } else msg_text.attachments.push(event_edit_pages_att(page, eventcount, sort));
    
    return msg_text;
  }
  
  function event_edit_msg (state) {
    var btns = [];
    btns.push({
      name: 'done',
      text: lang.btn.done,
      type: 'button',
      style: 'primary'
    });
    btns.push({
      name: 'cancel',
      text: lang.btn.cancel,
      type: 'button',
      confirm: {
        title: lang.msg.confirm,
        text: lang.msg.confirmcancel,
        ok_text: lang.btn.yes,
        dismiss_text: lang.btn.no
      }
    });
    if (state == 2) btns.push({
      name: 'undelete',
      text: lang.btn.undelete,
      type: 'button'
    });
    if (state != 2) btns.push({
      name: 'delete',
      text: lang.btn.delete,
      type: 'button',
      style: 'danger',
      confirm: {
        title: lang.msg.confirm,
        text: lang.msg.evt.confirmdelete,
        ok_text: lang.btn.yes,
        dismiss_text: lang.btn.no
      }
    });
  
    return {
      text: lang.wrd.preview + ":",
      attachments: [
        {},
        {
          text: lang.msg.evt.selectedit,
          fallback: lang.msg.evt.selectedit,
          callback_id: 'event_edit_select_callback',
          actions: [
            {
              name: 'title',
              text: lang.btn.evt.title,
              type: 'button'
            },
            {
              name: 'text',
              text: lang.btn.evt.text,
              type: 'button'
            },
            {
              name: 'datetime',
              text: lang.btn.evt.datetime,
              type: 'button'
            },
            {
              name: 'members',
              text: lang.btn.evt.members,
              type: 'button'
            },
            {
              name: 'max',
              text: lang.btn.evt.max,
              type: 'button'
            }
          ],
          mrkdwn_in: ['text', 'pretext']
        },
        {
          text: "",
          fallback: "",
          callback_id: 'event_edit_menu_callback',
          actions: btns,
          mrkdwn_in: ['text', 'pretext']
        }
      ],
      response_type: 'ephemeral',
      replace_original: true
    }
  }
  
  var event_edit_menu_att = {
    text: "",
    fallback: "",
    callback_id: 'event_edit_menu_callback',
    actions: [
      {
        name: 'back',
        text: lang.btn.back,
        type: 'button',
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
  };
  
  var event_edit_title_msg = {
    text: "",
    attachments: [
      {
        text: lang.msg.evt.entertitle,
        fallback: lang.msg.evt.entertitle,
        mrkdwn_in: ['text', 'pretext']
      },
      event_edit_menu_att
    ],
    response_type: 'ephemeral',
    replace_original: true
  };
  
  var event_edit_text_msg = {
    text: "",
    attachments: [
      {
        text: lang.msg.evt.entertext,
        fallback: lang.msg.evt.entertext,
        mrkdwn_in: ['text', 'pretext']
      },
      event_edit_menu_att
    ],
    response_type: 'ephemeral',
    replace_original: true
  };
  
  var event_edit_text_del_msg = {
    text: "",
    attachments: [
      {
        text: lang.msg.evt.entertext,
        fallback: lang.msg.evt.entertext,
        mrkdwn_in: ['text', 'pretext']
      },
      {
        text: "",
        fallback: "",
        callback_id: 'event_edit_menu_callback',
        actions: [
          {
            name: 'back',
            text: lang.btn.back,
            type: 'button',
          },
          {
            name: 'delete',
            text: lang.btn.evt.deletetext,
            type: 'button',
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
    replace_original: true
  };
  
  var event_edit_datetime_msg = {
    text: "",
    attachments: [
      {
        text: lang.msg.evt.enterdatetime,
        fallback: lang.msg.evt.enterdatetime,
        mrkdwn_in: ['text', 'pretext']
      },
      event_edit_menu_att
    ],
    response_type: 'ephemeral',
    replace_original: true
  };
  
  function event_edit_members_msg (members) {
    var atts = [{
      text: lang.msg.evt.removemembers,
      fallback: lang.msg.evt.removemembers,
        mrkdwn_in: ['text', 'pretext']
    }];
    
    for (var i in members) {
      if (i % 5 == 0) atts.push({
        text: "",
        fallback: "",
        callback_id: 'event_edit_members_callback',
        actions:[]
      });
      atts[atts.length - 1].actions.push({
        name: members[i],
        text: user.getUser(members[i]).name,
        type: 'button'
      });
    }
    
    atts.push(event_edit_menu_att);
    
    return {
      text: lang.wrd.preview + ":",
      attachments: atts,
      response_type: 'ephemeral',
      replace_original: true
    }
  }
  
  var event_edit_max_msg = {
    text: "",
    attachments: [
      {
        text: lang.msg.evt.entermax,
        fallback: lang.msg.evt.entermax,
        mrkdwn_in: ['text', 'pretext']
      },
      {
        text: "",
        fallback: "",
        callback_id: 'event_edit_max_callback',
        actions: [
          {
            name: '0',
            text: lang.btn.evt.nomax,
            type: 'button'
          },
          {
            name: '2',
            text: "2",
            type: 'button'
          },
          {
            name: '3',
            text: "3",
            type: 'button'
          },
          {
            name: '6',
            text: "6",
            type: 'button'
          },
          {
            name: '12',
            text: "12",
            type: 'button'
          },
        ],
        mrkdwn_in: ['text', 'pretext']
      },
      event_edit_menu_att
    ],
    response_type: 'ephemeral',
    replace_original: true
  };
  
  // ===== MISC =====
  
  var event_dismiss_att = {
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
  
  class Event {
    constructor (data) {
      this.id = data.id;
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
        max: data.options.max || 6, //max: 0 = all, etc
        color: data.options.color || func.getRandomColor()
      };
      if (!('schedule' in data)) data.schedule = {};
      this.schedule = {
        reminder: data.schedule.reminder || "",
        start: data.schedule.start || ""
      };
    }

    edit (data) {
      var temp = this.datetime;
      this.title = data.title;
      this.text = data.text;
      this.datetime = data.datetime;
      this.state = data.state;
      this.ts.edited = data.ts.edited;
      this.options.max = data.options.max;
      
      for (var i in data.deletemembers) {
        var temp = this.members.indexOf(data.deletemembers[i]);
        if (temp != -1) this.members.splice(temp, 1);
      }
    }
    
    getData () {
      return {
        id: this.id,
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

    generateAttachment () {
      var temp_members = "";
      for (var i in this.members) {
        temp_members += user.getUser(this.members[i]).name;
        if (i < this.members.length - 1) temp_members += ", ";
      }
      
      var att_fields = [
        {
          value: moment(this.datetime).format(lang.msg.evt.dateformat),
          short: false
        },
        {
          title: lang.wrd.member + (this.options.max > 0 ? " (max. " + this.options.max + "):" : ":"),
          value: temp_members,
          short: false
        }
      ];
      
      return {
        author_name: lang.wrd.event + " #" + (this.id + 1) + (this.state == 2 ? " [" + lang.wrd.deleted + "]" : ""),
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

    generateEvent () {
      var btns = [];

      if (this.members.length < this.options.max) btns.push({
        name: 'join',
        value: this.id,
        text: lang.btn.evt.join,
        type: 'button'
      });
      btns.push({
        name: 'leave',
        value: this.id,
        text: lang.btn.evt.leave,
        type: 'button'
      });

      var msg_text = {
        text: lang.msg.evt.neweventcreated,
        attachments: [],
        delete_original: true
      }

      msg_text.attachments[0] = this.generateAttachment();
      if (this.state == 0) {
        msg_text.attachments[0].callback_id = 'event_answer_callback';
        msg_text.attachments[0].actions = btns;
      }

      return msg_text;
    }
    
    static generateDummy (data) {
      var temp_text = "<text>",
          temp_datetime = "<date>, <time>",
          temp_members = "user1, user2",
          temp_ts = 0,
          temp_max = 6,
          temp_color = "";
      if ('text' in data) temp_text = data.text;
      if ('datetime' in data) temp_datetime = moment(data.datetime).format(lang.msg.evt.dateformat);
      if ('members' in data) {
        temp_members = "";
        for (var i in data.members) {
          temp_members += user.getUser(data.members[i]);
          if (i < data.members.length - 1) temp_members += ", ";
        }
      }
      if ('options' in data) {
        temp_max = data.options.max;
        temp_color = data.options.color || "";
      }
      
      var att_fields = [
        {
          value: temp_datetime,
          short: false
        },
        {
          title: lang.wrd.member + (temp_max > 0 ? " (max. " + temp_max + "):" : ":"),
          value: temp_members,
          short: false
        }
      ];
      
      return {
        author_name: lang.wrd.event + " #" + (data.id + 1) + (data.state == 2 ? " [" + lang.wrd.deleted + "]" : ""),
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

    update () {
      if (this.state == 0 || this.state == 1) {
        var msg_text = this.generateEvent();
        
        for (var i in this.posts) {
          slapp.client.chat.update({
            token: config.bot_token,
            ts: this.posts[i].ts,
            channel: this.posts[i].ch,
            text: msg_text.text,
            attachments: msg_text.attachments,
            parse: 'full',
            as_user: true
          }, (err, data) => {
            if (err && err.message != 'cant_update_message' && err.message != 'message_not_found' && err.message != 'channel_not_found' && err.message != 'edit_window_closed') console.log(err);
          });
        }
      }
      else this.delete();
    }

    delete () {
      for (var i in this.posts.length) {
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
    
    start () {
      this.state = 1;
      this.update();
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
    
    setSchedules (msg) {
      let ts = Date.now() + '';
      var data_reminder = {
        schedule: moment(this.datetime).subtract(10, 'm').format(),
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
            type: 'event_schedule_reminder',
            payload: this.id,
            user: config.admin_id,
            channel: config.event_ch
          }
        }
      };
      var data_start = {
        schedule: moment(this.datetime).format(),
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
            type: 'event_schedule_start',
            payload: this.id,
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

      needle.post('beepboophq.com/api/v1/chronos/tasks', data_reminder, headers, (err, resp) => {
        if (resp.statusCode !== 201) console.log(resp.statusCode);
        if (err) console.log(err);
        else {
          this.schedule.reminder = JSON.parse(resp.body).id;
          needle.post('beepboophq.com/api/v1/chronos/tasks', data_start, headers, (err, resp) => {
            if (resp.statusCode !== 201) console.log(resp.statusCode);
            if (err) console.log(err);
            else this.schedule.start = JSON.parse(resp.body).id;
          });
        }
      });
    }
    
    editSchedules (msg) {
       var headers = {
        headers: {
          Authorization: 'Bearer ' + config.bb_token
        },
        json: true
      };
      
      needle.delete('https://beepboophq.com/api/v1/chronos/tasks/' + this.schedule.reminder, null, headers, (err, resp) => {
        if (err) console.log(err);
        if (resp.statusCode !== 200) console.log(resp.statusCode);
        else {
          needle.delete('https://beepboophq.com/api/v1/chronos/tasks/' + this.schedule.start, null, headers, (err, resp) => {
            if (err) console.log(err);
            if (resp.statusCode !== 200) console.log(resp.statusCode);
            else this.setSchedule(msg);
          });
        }
      });
    }
    
    deleteSchedules () {
      var headers = {
        headers: {
          Authorization: 'Bearer ' + config.bb_token
        },
        json: true
      };
      
      needle.delete('https://beepboophq.com/api/v1/chronos/tasks/' + this.schedule.reminder, null, headers, (err, resp) => {
        if (err) console.log(err);
        if (resp.statusCode !== 200) console.log(resp.statusCode);
        else {
          this.schedule.reminder = "";
          needle.delete('https://beepboophq.com/api/v1/chronos/tasks/' + this.schedule.start, null, headers, (err, resp) => {
            if (err) console.log(err);
            if (resp.statusCode !== 200) console.log(resp.statusCode);
            else this.schedule.start = "";
          });
        }
      });
    }
    
    notifyMembers () {
      var msg_text = {
        text: lang.msg.evt.startingsoon,
        attachments: []
      };
      var btns = [
        {
          name: 'ok',
          value: this.id,
          text: lang.btn.evt.ok,
          type: 'button',
          style: 'primary'
        },
        {
          name: 'cancel',
          value: this.id,
          text: lang.btn.evt.cancel,
          type: 'button',
          style: 'danger',
          confirm: {
            title: lang.msg.confirm,
            text: lang.msg.evt.confirmcancel,
            ok_text: lang.btn.yes,
            dismiss_text: lang.btn.no
          }
        }
      ];
      
      msg_text.attachments[0] = this.generateAttachment();
      msg_text.attachments[0].callback_id = 'event_schedule_answer';
      msg_text.attachments[0].actions = btns;
      
      for (var i in this.members) user.sendDM(this.members[i], msg_text);
    }
    
    notifyCreator (user_id) {
      var msg_text = user.getUser(user_id).name + " " + lang.msg.evt.hascanceled + " *" + this.title + "*";
      user.sendDM(this.creator, func.generateInfoMsg(msg_text));
    }
  }
  
  function findEvent (id) {
    for (var i in event_db) if (event_db[i].id == id) return i;
    return -1;
  }
  
  function getNextId () {
    if (event_db.length == 0) return 0;
    else return event_db[event_db.length - 1].getData.id + 1;
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
        for (var i in val) event_db[i] = new Event(val[i]);
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
   
  // ===== /event create =====
  
  slapp.command('/event', "create", (msg, cmd) => {
    var data = {id: getNextId(), creator: msg.body.user_id};
    
    var msg_text = event_create_title_msg;
    msg_text.attachments[0] = Event.generateDummy(data);
    
    msg.respond(msg_text);
    msg.route('event_create_title_route', data, 60);
    return;
  });
  
  slapp.route('event_create_title_route', (msg, data) => {
    if (msg.type == 'event') {
      msg.route('event_create_title_route', data, 60);
      return;
    } else if (msg.type == 'action') {
      switch (msg.body.actions[0].name) {
        case 'next':
          var msg_text = event_create_text_msg;
          msg_text.attachments[0] = Event.generateDummy(data);
          
          msg.respond(msg_text);
          msg.route('event_create_text_route', data, 60);
          break;
        case 'cancel':
          msg.respond({text: "", delete_original: true});
          break;
      }
      return;
    } else {
      data.title = msg.body.text;
      var msg_text = event_create_text_msg;
      msg_text.attachments[0] = Event.generateDummy(data);
      
      msg.respond(msg_text);
      msg.route('event_create_text_route', data, 60);
      return;
    }
  });
  
  slapp.route('event_create_text_route', (msg, data) => {
    if (msg.type == 'event') {
      msg.route('event_create_text_route', data, 60);
      return;
    } else if (msg.type == 'action') {
      switch (msg.body.actions[0].name) {
        case 'back':
          var msg_text = event_create_title_n_msg;
          msg_text.attachments[0] = Event.generateDummy(data);
          
          msg.respond(msg_text);
          msg.route('event_create_title_route', data, 60);
          break;
        case 'next':
          if (!('text' in data)) data.text = "";
          var msg_text = event_create_datetime_msg;
          if ('datetime' in data) msg_text = event_create_datetime_n_msg;
          msg_text.attachments[0] = Event.generateDummy(data);
          
          msg.respond(msg_text);
          msg.route('event_create_datetime_route', data, 60);
          break;
        case 'cancel':
          msg.respond({text: "", delete_original: true});
          break;
      }
      return;
    } else {
      data.text = msg.body.text;
      var msg_text = event_create_datetime_msg;
      if ('datetime' in data) msg_text = event_create_datetime_n_msg;
      msg_text.attachments[0] = Event.generateDummy(data);
      
      msg.respond(msg_text);
      msg.route('event_create_datetime_route', data, 60);
      return;
    }
  });
  
  slapp.route('event_create_datetime_route', (msg, data) => {
    if (msg.type == 'event') {
      msg.route('event_create_datetime_route', data, 60);
      return;
    } else if (msg.type == 'action') {
      switch (msg.body.actions[0].name) {
        case 'back':
          var msg_text = event_create_text_msg;
          msg_text.attachments[0] = Event.generateDummy(data);
          
          msg.respond(msg_text);
          msg.route('event_create_text_route', data, 60);
          break;
        case 'next':
          var msg_text = event_create_max_msg;
          msg_text.attachments[0] = Event.generateDummy(data);
          
          msg.respond(msg_text);
          msg.route('event_create_max_route', data, 60);
          break;
        case 'cancel':
          msg.respond({text: "", delete_original: true});
          break;
      }
      return;
    } else {
      var temp = msg.body.text.split(";");
      if (temp.length == 2) {
        var parsed = moment(temp[0].trim().replace(/[\.\:\,\/ ]/g, "-") + " " + temp[1].trim().replace(/[\.\:\,\/ ]/g, "-"), "DD-MM-YYYY HH-mm");
        if (moment().add(30, 'm') < parsed) {
          data.datetime = parsed.format();
          var msg_text = event_create_max_msg;
          msg_text.attachments[0] = Event.generateDummy(data);
          
          msg.respond(msg_text);
          msg.route('event_create_max_route', data, 60);
        } else {
          var msg_text = event_create_datetime_msg;
          if ('datetime' in data) msg_text = event_create_datetime_n_msg;
          msg_text = func.cloneObject(msg_text);
          msg_text.attachments[0] = Event.generateDummy(data);
          msg_text.attachments[1].text = lang.msg.evt.wrongdatetimestamp+ "\n" + msg_text.attachments[1].text;
          
          msg.respond(msg_text);
          msg.route('event_create_datetime_route', data, 60);
        }
      } else {
        var msg_text = event_create_datetime_msg;
        if ('datetime' in data) msg_text = event_create_datetime_n_msg;
        msg_text = func.cloneObject(msg_text);
        msg_text.attachments[0] = Event.generateDummy(data);
        msg_text.attachments[1].text = lang.msg.evt.wrongdatetimeinput+ "\n" + msg_text.attachments[1].text;

        msg.respond(msg_text);
        msg.route('event_create_datetime_route', data, 60);
      }
      return;
    }
  });
  
  slapp.route('event_create_max_route', (msg, data) => {
    if (msg.type == 'event') {
      msg.route('event_create_max_route', data, 60);
      return;
    } else if (msg.type == 'action') {
      switch (msg.body.actions[0].name) {
        case 'back':
          var msg_text = event_create_datetime_n_msg;
          msg_text.attachments[0] = Event.generateDummy(data);
          
          msg.respond(msg_text);
          msg.route('event_create_datetime_route', data, 60);
          return;
        case '0':
        case '2':
        case '3':
        case '6':
        case '12':
          data.options = {max: parseInt(msg.body.actions[0].name)};
        case 'next':
          var msg_text = event_create_final_msg;
          msg_text.attachments[0] = Event.generateDummy(data);
          
          msg.respond(msg_text);
          msg.route('event_create_final_route', data, 60);
          return;
        case 'cancel':
          msg.respond({text: "", delete_original: true});
          return;
      }
    } else {
      data.options = {max: parseInt(msg.body.text)};
      var msg_text = event_create_final_msg;
      msg_text.attachments[0] = Event.generateDummy(data);
      
      msg.respond(msg_text);
      msg.route('event_create_final_route', data, 60);
      return;
    }
  });
  
  slapp.route('event_create_final_route', (msg, data) => {
    if (msg.type != 'action') {
      msg.route('event_create_final_route', data, 60);
      return;
    } else {
      switch (msg.body.actions[0].name) {
        case 'edit':
          data.create = true;
          var msg_text = event_edit_msg(0);
          msg_text.attachments[0] = Event.generateDummy(data);
          
          msg.respond(msg_text);
          msg.route('event_edit_route', data, 60);
          return;
        case 'done':
          break;
        case 'cancel':
          msg.respond({text: "", delete_original: true});
          return;
      }
      
      data.ts = {created: msg.body.action_ts};
      data.id = getNextId();
      event_db.push(new Event(data));
      var slot = findEvent(data.id);
      event_db[slot].join(msg.body.user.id);
      event_db[slot].setSchedules(msg);
      var msg_text = event_db[slot].generateEvent();
      msg_text.channel = config.event_ch;
      
      msg.respond({text: "", delete_original: true});
      msg.say(msg_text, (err, result) => {
        event_db[slot].addPost(result.channel, result.ts);
        saveEventDB();
      });
    }
  });
  
  // ===== /event show =====
  
  slapp.command('/event', "(show|list)(.*)", (msg, cmd) => {
    var check = new RegExp("\\d{1,4}");
    
    if (cmd.substring(0,4) == "show" && check.test(cmd.substring(5))) {
      var slot = findEvent(parseInt(cmd.substring(5)) - 1);
      
      if (slot != -1) {
        var msg_text = event_db[slot].generateEvent();
        msg_text.text = "";
        msg_text.attachments.push(event_dismiss_att);
        msg.respond(msg_text);
      } else msg.respond(func.generateInfoMsg(lang.msg.evt.notfound));
    } else msg.respond(event_list_msg(0, 0, 'desc'));
    
    return;
  });
  
  slapp.action('event_show_filter_callback', (msg) => {
    var data = msg.body.actions[0].name.split("-");
    
    msg.respond(event_list_msg(0, parseInt(data[0]), data[1], msg.body.user.id));
    return;
  });
  
  slapp.action('poll_show_pages_callback', (msg) => {
    var data = msg.body.actions[0].name.split("-"),
        page = parseInt(msg.body.actions[0].value);
    
    switch (data[0]) {
      case 'back':
      case 'next':
        msg.respond(poll_list_msg(page, parseInt(data[1]), data[2], msg.body.user.id));
        return;
      case 'page':
        return;
      case 'dismiss':
        msg.respond({text: "", delete_original: true});
        return;
    }
  });
  
  // ===== /event edit =====
  
  slapp.command('/event', "edit(.*)", (msg, cmd) => {
    var check = new RegExp("\\d{1,4}");
    
    if (check.test(cmd.substring(5))) {
      var slot = findEvent(parseInt(cmd.substring(5)) - 1);
      
      if (slot != -1 && (event_db[slot].isVisible() || user.isAdmin(msg.body.user_id))) {
        if (event_db[slot].isOwner(msg.body.user_id) || user.isAdmin(msg.body.user_id)) {
          var data = event_db[slot].getData(),
              msg_text = event_edit_msg(data.state);
          msg_text.attachments[0] = Event.generateDummy(data);
          msg.respond(msg_text);
          msg.route('event_edit_route', data, 60);
          return;
        } else msg.respond(func.generateInfoMsg(lang.msg.evt.notowner));
      } else msg.respond(func.generateInfoMsg(lang.msg.evt.notfound));
    } else msg.respond(event_edit_list_msg(msg.body.user_id, 0, 'desc'));
    
    return;
  });
  
  slapp.action('event_edit_pages_callback', (msg) => {
    var data = msg.body.actions[0].name.split("-");
    
    switch (data[0]) {
      case 'back':
      case 'next':
        msg.respond(event_edit_list_msg(msg.body.user.id, parseInt(msg.body.actions[0].value), data[1]));
        return;
      case 'page':
        return;
      case 'asc':
      case 'desc':
        msg.respond(event_edit_list_msg(msg.body.user.id, 0, data[0]));
        return;
      case 'dismiss':
        msg.respond({text: "", delete_original: true});
        return;
    }
  });
  
  slapp.action('event_edit_del_callback', (msg) => {
    var slot = findEvent(parseInt(msg.body.actions[0].value));
    
    if (slot != -1) {
      switch (msg.body.actions[0].name) {
        case 'edit':
          var data = event_db[slot].getData(),
              msg_text = event_edit_msg(data.state);
          msg_text.attachments[0] = Event.generateDummy(data);
          msg.respond(msg_text);
          msg.route('event_edit_route', data, 60);
          break;
        case 'delete':
          event_db[slot].delete();
          saveEventDB();
          msg.respond(func.generateInfoMsg(lang.msg.evt.deleted));
          break;
      }
    } else msg.respond(func.generateInfoMsg(lang.msg.evt.notfound));
    return;
  });
  
  slapp.route('event_edit_route', (msg, data) => {
    if (msg.type != 'action') {
      msg.route('event_edit_route', data, 60);
      return;
    } else {
      switch (msg.body.actions[0].name) {
        case 'title':
          msg.respond(event_edit_title_msg);
          msg.route('event_edit_title_route', data, 60);
          return;
        case 'text':
          if (data.text == "") msg.respond(event_edit_text_msg);
          else msg.respond(event_edit_text_del_msg);
          msg.route('event_edit_text_route', data, 60);
          return;
        case 'datetime':
          msg.respond(event_edit_datetime_msg);
          msg.route('event_edit_datetime_route', data, 60);
          return;
        case 'members':
          msg.respond(event_edit_members_msg(data.members));
          msg.route('event_edit_members_route', data, 60);
          return;
        case 'max':
          msg.respond(event_edit_max_msg);
          msg.route('event_edit_max_route', data, 60);
          return;
        case 'done':
          break;
        case 'cancel':
          msg.respond({text: "", delete_original: true});
          return;
        case 'undelete':
          data.state = 0;
          data.edited = true;
          var msg_text = event_edit_msg(data.state);
          msg_text.attachments[0] = Event.generateDummy(data);
          msg.respond(msg_text);
          msg.route('event_edit_route', data, 60);
          return;
        case 'delete':
          var slot = findEvent(data.id);
          if (slot != -1) {
            event_db[slot].delete();
            saveEventDB();
            msg.respond(func.generateInfoMsg(lang.msg.evt.deleted));
          } else msg.respond(func.generateInfoMsg(lang.msg.evt.notfound));
          return;
      }
      
      if (data.create) {
        var msg_text = event_create_final_msg;
        msg_text.attachments[0] = Event.generateDummy(data);
        msg.respond(msg_text);
        msg.route('event_create_final_route', data, 60);
      } else if (data.edited) {
        var slot = findEvent(data.id);
        if (slot != -1) {
          data.ts.edited = msg.body.action_ts;
          event_db[slot].edit(data);
          event_db[slot].update();
          saveEventDB();
          msg.respond({text: "", delete_original: true});
        } else msg.respond(func.generateInfoMsg(lang.msg.evt.notfound));
      } else msg.respond({text: "", delete_original: true});
      return;
    }
  });
  
  slapp.route('event_edit_title_route', (msg, data) => {
    if (msg.type == 'event') {
      msg.route('event_edit_title_route', data, 60);
      return;
    } else if (msg.type == 'action') {
      switch (msg.body.actions[0].name) {
        case 'back':
          var msg_text = event_edit_msg(data.state);
          msg_text.attachments[0] = Event.generateDummy(data);
          msg.respond(msg_text);
          msg.route('event_edit_route', data, 60);
          break;
        case 'cancel':
          msg.respond({text: "", delete_original: true});
          break;
      }
      return;
    } else {
      data.title = msg.body.text;
      data.edited = true;
      
      var msg_text = event_edit_msg(data.state);
      msg_text.attachments[0] = Event.generateDummy(data);
      msg.respond(msg_text);
      msg.route('event_edit_route', data, 60);
      return;
    }
  });
  
  slapp.route('event_edit_text_route', (msg, data) => {
    if (msg.type == 'event') {
      msg.route('event_edit_text_route', data, 60);
      return;
    } else if (msg.type == 'action') {
      switch (msg.body.actions[0].name) {
        case 'back':
          var msg_text = event_edit_msg(data.state);
          msg_text.attachments[0] = Event.generateDummy(data);
          msg.respond(msg_text);
          msg.route('event_edit_route', data, 60);
          break;
        case 'delete':
          data.text = "";
          data.edited = true;
          var msg_text = event_edit_msg(data.state);
          msg_text.attachments[0] = Event.generateDummy(data);
          msg.respond(msg_text);
          msg.route('event_edit_route', data, 60);
          break;
        case 'cancel':
          msg.respond({text: "", delete_original: true});
          break;
      }
      return;
    } else {
      data.text = msg.body.text;
      data.edited = true;
      
      var msg_text = event_edit_msg(data.state);
      msg_text.attachments[0] = Event.generateDummy(data);
      msg.respond(msg_text);
      msg.route('event_edit_route', data, 60);
      return;
    }
  });
  
  slapp.route('event_edit_datetime_route', (msg, data) => {
    if (msg.type == 'event') {
      msg.route('event_edit_datetime_route', data, 60);
      return;
    } else if (msg.type == 'action') {
      switch (msg.body.actions[0].name) {
        case 'back':
          var msg_text = event_edit_msg(data.state);
          msg_text.attachments[0] = Event.generateDummy(data);
          msg.respond(msg_text);
          msg.route('event_edit_route', data, 60);
          break;
        case 'cancel':
          msg.respond({text: "", delete_original: true});
          break;
      }
      return;
    } else {
      var temp = msg.body.text.split(";");
      
      if (temp.length == 2) {
        var parsed = moment(temp[0].trim().replace(/[\.\:\,\/ ]/g, "-") + " " + temp[1].trim().replace(/[\.\:\,\/ ]/g, "-"), "DD-MM-YYYY HH-mm");
        if (moment().add(30, 'm') < parsed) {
          data.datetime = parsed.format();
          data.edited = true;

          var msg_text = event_edit_msg(data.state);
          msg_text.attachments[0] = Event.generateDummy(data);
          msg.respond(msg_text);
          msg.route('event_edit_route', data, 60);
        } else {
          var msg_text = event_edit_datetime_msg;
          msg_text.attachments[0] = Event.generateDummy(data);
          msg_text.attachments[1].text = lang.msg.evt.wrongdatetimestamp+ "\n" + msg_text.attachments[1].text;
          msg.respond(msg_text);
          msg.route('event_edit_datetime_route', data, 60);
        }
      } else {
        var msg_text = event_edit_datetime_msg;
        msg_text.attachments[0] = Event.generateDummy(data);
        msg_text.attachments[1].text = lang.msg.evt.wrongdatetimeinput+ "\n" + msg_text.attachments[1].text;
        msg.respond(msg_text);
        msg.route('event_edit_datetime_route', data, 60);
      }
      return;
    }
  });
  
  slapp.route('event_edit_members_route', (msg, data) => {
    if (msg.type != 'action') {
      msg.route('event_edit_members_route', data, 60);
      return;
    } else {
      switch (msg.body.actions[0].name) {
        case 'delete':
          data.edited = true;
          var slot = parseInt(msg.body.actions[0].value);
          if (data.answers[slot].state == 2) data.answers.splice(slot, 1);
          else data.answers[slot].state = 3;
          msg.respond(poll_edit_answers_msg(data.answers));
          msg.route('poll_edit_answers_route', data, 60);
          return;
        case 'back':
          var msg_text = poll_edit_msg(data.state);
          msg_text.attachments[0] = Poll.generateDummy(data);
          msg.respond(msg_text);
          msg.route('poll_edit_route', data, 60);
          return;
        case 'cancel':
          msg.respond({text: "", delete_original: true});
          return;
      }
      
      data.members.splice(data.members.indexOf(msg.body.actions[0].name), 1);
      if (!('deletemembers' in data)) data.deletemembers = [];
      data.deletemembers.push(msg.body.actions[0].name);
      data.edited = true;
      
      var msg_text = event_edit_msg(data.state);
      msg_text.attachments[0] = Event.generateDummy(data);
      msg.respond(msg_text);
      msg.route('event_edit_route', data, 60);
      return;
    }
  });
  
  slapp.route('event_edit_max_route', (msg, data) => {
    if (msg.type == 'event') {
      msg.route('event_edit_max_route', data, 60);
      return;
    } else if (msg.type == 'action') {
      switch (msg.body.actions[0].name) {
        case 'back':
          var msg_text = event_edit_msg(data.state);
          msg_text.attachments[0] = Event.generateDummy(data);
          msg.respond(msg_text);
          msg.route('event_edit_route', data, 60);
          return;
        case 'cancel':
          msg.respond({text: "", delete_original: true});
          return;
        case '0':
        case '2':
        case '3':
        case '6':
        case '12':
          data.options.max = parseInt(msg.body.text);
          data.edited = true;
          
          var msg_text = event_edit_msg(data.state);
          msg_text.attachments[0] = Event.generateDummy(data);
          msg.respond(msg_text);
          msg.route('event_edit_route', data, 60);
          return;
      }
    } else {
      data.options.max = parseInt(msg.body.actions[0].name);
      data.edited = true;
      
      var msg_text = event_edit_msg(data.state);
      msg_text.attachments[0] = Event.generateDummy(data);
      msg.respond(msg_text);
      msg.route('event_edit_route', data, 60);
      return; 
    }
  });
  
  // ===== /event post =====
  
  slapp.command('/event', "post \\d{1,4}", (msg, cmd) => {
    var slot = findEvent(parseInt(cmd.substring(5)) - 1);
    
    if (slot != -1) {
      msg.say(event_db[slot].generateEvent(), (err, result) => {
        if (err) console.log("Unable to post in channel (" + err + ")");
        else {
          event_db[slot].addPost(result.channel, result.ts);
          saveEventDB();
        }
      });
    }
    else msg.respond(func.generateInfoMsg(lang.msg.evt.notfound));
    
    return;
  });
  
  // ===== /event help =====
  
  slapp.command('/event', "help", (msg, cmd) => {
    msg.respond(func.generateInfoMsg(lang.msg.evt.help));
    return;
  });
  
  // ===== /event =====
  
  slapp.command('/event', "(.*)", (msg, cmd) => {
    var temp = cmd.split(";");
    if (temp[temp.length - 1].trim() == "") temp = temp.slice(0, -1);
    
    if (temp.length == 3) {
      var parsed = moment(temp[1].trim().replace(/[\.\:\,\/ ]/g, "-") + " " + temp[2].trim().replace(/[\.\:\,\/ ]/g, "-"), "DD-MM-YYYY HH-mm");
      
      if (moment().add(30, 'm') < parsed) {
        var data = {id: getNextId(), title: temp[0], text: "", datetime: parsed.format(), creator: msg.body.user_id};
      
        var msg_text = event_create_final_msg;
        msg_text.attachments[0] = Event.generateDummy(data);
        msg.respond(msg_text);
        msg.route('event_create_final_route', data, 60);
        return;
      } else {
        msg.respond(module.event_main_msg);
        return;
      }
    } else {
      msg.respond(module.event_main_msg);
      return;
    }
  });
  
  slapp.action('event_main_callback', (msg) => {
    switch (msg.body.actions[0].name) {
      case 'create':
        var data = {id: getNextId(), creator: msg.body.user.id};
        
        var msg_text = event_create_title_msg;
        msg_text.attachments[0] = Event.generateDummy(data);
        msg.respond(msg_text);
        msg.route('event_create_title_route', data, 60);
        break;
      case 'show':
        msg.respond(event_list_msg(0, 0, 'desc'));
        break;
      case 'edit':
        msg.respond(event_edit_list_msg(msg.body.user_id, 0, 'desc'));
        break;
      case 'help':
        msg.respond({
          text: lang.msg.evt.help,
          attachments: [event_dismiss_att],
          response_type: 'ephemeral',
          replace_original: true
        });
        break;
    }
    return;
  });
  
  // ===== answer callback =====
  
  slapp.action('event_answer_callback', (msg) => {
    var slot = findEvent(msg.body.actions[0].value);
    switch (msg.body.actions[0].name) {
      case 'join':
        event_db[slot].join(msg.body.user.id);
        break;
      case 'leave':
        event_db[slot].leave(msg.body.user.id);
        break;
    }
    event_db[slot].update();
    saveEventDB();
  });
  
  // ===== External event schedule trigger =====
  
  slapp.event('event_schedule_reminder', (msg) => {
    var slot = findEvent(msg.body.event.payload);
    if (slot != -1) event_db[slot].notifyMembers();
    return;
  });
  
  slapp.event('event_schedule_start', (msg) => {
    var slot = findEvent(msg.body.event.payload);
    if (slot != -1) {
      event_db[slot].start();
      saveEventDB();
    }
    return;
  });
  
  slapp.action('event_schedule_answer', (msg) => {
    msg.respond({text: "", delete_original: true});
    if (msg.body.actions[0].name == 'cancel') {
      var slot = findEvent(msg.body.actions[0].value);
      if (slot != -1) event_db[slot].notifyCreator(msg.body.user.id);
    }
    return;
  });
  
  return module;
};
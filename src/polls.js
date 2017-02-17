// ==============================
// ========== PREAMBLE ==========
// ==============================

'use strict';

var poll_db = [];

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
  
  // TODO:
  // poll_edit_answers_route
  // poll_edit_answer_edit_route



// ==============================
// ========== MESSAGES ==========
// ==============================

// ===== MAIN =====

  module.poll_main_msg = {
    text: "",
    attachments: [
      {
        text: lang.msg.poll.main,
        fallback: lang.msg.poll.main,
        callback_id: 'poll_main_callback',
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
    replace_original: true
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
    replace_original: true
  };

  var poll_create_answers_msg = {
    text: lang.wrd.preview + ":",
    attachments: [
      {},
      {
        text: lang.msg.poll.enteranswers,
        fallback: lang.msg.poll.enteranswers,
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
    replace_original: true
  };

  var poll_create_answers_n_msg = {
    text: lang.wrd.preview + ":",
    attachments: [
      {},
      {
        text: lang.msg.poll.enteranswers,
        fallback: lang.msg.poll.enteranswers,
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
    replace_original: true
  };

  function poll_create_max_msg (max) {
    var msg_text = {
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
      replace_original: true
    };
    
    for (var i = 0; i < max; i++) {
      var btn = {name: i, text: i, type: 'button'};
      if (i < 5) msg_text.attachments[2].actions[i] = btn;
      else msg_text.attachments[3].actions[i - 5] = btn;
    }
    msg_text.attachments[2].actions[0].text = lang.btn.all;
    if (max.length <= 5) msg_text.attachments.splice(3, 1);
    
    return msg_text;
  }

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
    replace_original: true
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
    replace_original: true
  };
  
  // ===== SHOW =====
  
  function poll_show_filter_att (mode, sort) {
    var btns = [];
    
    if (mode != 0) btns.push({
      name: "0-" + sort,
      text: lang.btn.poll.allpolls,
      type: 'button'
    });
    if (mode != 1) btns.push({
      name: "1-" + sort,
      text: lang.btn.poll.openpolls,
      type: 'button'
    });
    if (mode != 2) btns.push({
      name: "2-" + sort,
      text: lang.btn.poll.closedpolls,
      type: 'button'
    });
    if (mode != 3) btns.push({
      name: "3-" + sort,
      text: lang.btn.poll.mypolls,
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
      callback_id: 'poll_show_filter_callback',
      actions: btns,
      mrkdwn_in: ['text', 'pretext']
    };
  }
  
  function poll_show_pages_att (page, count, mode, sort) {
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
      text: lang.wrd.total + ": " + count + " " + (count > 1 ? lang.wrd.polls : lang.wrd.poll),
      fallback: "",
      callback_id: 'poll_show_pages_callback',
      actions: btns,
      mrkdwn_in: ['text', 'pretext']
    };
  }
  
  function poll_list_msg (page, options) {
    var msg_text = {
      text: "",
      attachments: [],
      response_type: 'ephemeral',
      replace_original: true
    };
    var pollcount = 0;
    // options.mode: 0 = all, 1 = open, 2 = closed, 3 = own
    
    for (var i = 0; i < poll_db.length; i++) {
      var j = (options.sort == 'asc' ? i : poll_db.length - i - 1);
      
      switch(options.mode) {
        case 0:
          if (poll_db[j].isVisible()) {
            if (pollcount >= page * 5 && pollcount < page * 5 + 5) msg_text.attachments = msg_text.attachments.concat(poll_db[j].generatePoll(j).attachments);
            pollcount++;
          }
          break;
        case 1:
          if (poll_db[j].isOpen()) {
            if (pollcount >= page * 5 && pollcount < page * 5 + 5) msg_text.attachments = msg_text.attachments.concat(poll_db[j].generatePoll(j).attachments);
            pollcount++;
          }
          break;
        case 2:
          if (poll_db[j].isClosed()) {
            if (pollcount >= page * 5 && pollcount < page * 5 + 5) mmsg_textsg.attachments = msg_text.attachments.concat(poll_db[j].generatePoll(j).attachments);
            pollcount++;
          }
          break;
        case 3:
          if (poll_db[j].isVisible() && poll_db[j].isOwner(options.user_id)) {
            if (pollcount >= page * 5 && pollcount < page * 5 + 5) {
              msg_text.attachments = msg_text.attachments.concat(poll_db[j].generatePoll(j).attachments);
              msg_text.attachments.push(poll_edit_del_att(j));
            }
            pollcount++;
          }
          break;
      }
    }
    
    msg_text.attachments.push(poll_show_filter_att(options.mode, options.sort));
    if (pollcount == 0) {
      msg_text.text = lang.msg.poll.nopollfound;
      msg_text.attachments.push(poll_dismiss_att);
    } else msg_text.attachments.push(poll_show_pages_att(page, pollcount, options.mode, options.sort));
    
    return msg_text;
  }
  
  // ===== EDIT =====
  
  function poll_edit_del_att (slot) {
    return {
      text: "",
      fallback: "",
      callback_id: 'poll_edit_del_callback',
      actions: [
        {
          name: 'edit',
          value: slot,
          text: lang.btn.edit,
          type: 'button'
        },
        {
          name: 'delete',
          value: slot,
          text: lang.btn.delete,
          type: 'button',
          style: 'danger',
          confirm: {
            title: lang.msg.confirm,
            text: lang.msg.poll.confirmdelete,
            ok_text: lang.btn.yes,
            dismiss_text: lang.btn.no
          }
        }
      ],
      mrkdwn_in: ['text', 'pretext']
    };
  }
  
  function poll_edit_pages_att (page, count, sort) {
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
      text: lang.wrd.total + ": " + count + " " + (count > 1 ? lang.wrd.polls : lang.wrd.poll),
      fallback: "",
      callback_id: 'poll_edit_pages_callback',
      actions: btns,
      mrkdwn_in: ['text', 'pretext']
    };
  }
  
  function poll_edit_list_msg (user_id, page, sort) {
    var msg_text = {
      text: "",
      attachments: [],
      response_type: 'ephemeral',
      replace_original: true
    };
    var pollcount = 0;
    
    for (var i = 0; i < poll_db.length; i++) {
      var j = (sort == 'asc' ? i : poll_db.length - i - 1);
      
      if (poll_db[j].isVisible() && poll_db[j].isOwner(user_id)) {
        if (pollcount >= page * 5 && pollcount < page * 5 + 5) {
          msg_text.attachments.push(poll_db[j].generateAttachment(j));
          msg_text.attachments.push(poll_edit_del_att(j));
        }
        pollcount++;
      }
    }
    
    if (pollcount == 0) {
      msg_text.text = lang.msg.poll.nopollfound;
      msg_text.attachments.push(poll_dismiss_att);
    } else msg_text.attachments.push(poll_edit_pages_att(page, pollcount, sort));
    
    return msg_text;
  }
  
  function poll_edit_msg (state) {
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
    if (state == 0) btns.push({
      name: 'close',
      text: lang.btn.poll.close,
      type: 'button'
    });
    if (state == 1) btns.push({
      name: 'open',
      text: lang.btn.poll.open,
      type: 'button'
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
        text: lang.msg.confirmdelete,
        ok_text: lang.btn.yes,
        dismiss_text: lang.btn.no
      }
    });
  
    return {
      text: lang.wrd.preview + ":",
      attachments: [
        {},
        {
          text: lang.msg.poll.selectedit,
          fallback: lang.msg.poll.selectedit,
          callback_id: 'poll_edit_select_callback',
          actions: [
            {
              name: 'title',
              text: lang.btn.poll.title,
              type: 'button'
            },
            {
              name: 'text',
              text: lang.btn.poll.text,
              type: 'button'
            },
            {
              name: 'answers',
              text: lang.btn.poll.answers,
              type: 'button'
            },
            {
              name: 'max',
              text: lang.btn.poll.max,
              type: 'button'
            },
            {
              name: 'names',
              text: lang.btn.poll.names,
              type: 'button'
            }
          ],
          mrkdwn_in: ['text', 'pretext']
        },
        {
          text: "",
          fallback: "",
          callback_id: 'poll_edit_menu_callback',
          actions: btns,
          mrkdwn_in: ['text', 'pretext']
        }
      ],
      response_type: 'ephemeral',
      replace_original: true
    }
  };
  
  var poll_edit_menu_att = {
    text: "",
    fallback: "",
    callback_id: 'poll_edit_menu_callback',
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
  
  var poll_edit_title_msg = {
    text: "",
    attachments: [
      {
        text: lang.msg.poll.entertitle,
        fallback: lang.msg.poll.entertitle,
        mrkdwn_in: ['text', 'pretext']
      },
      poll_edit_menu_att
    ],
    response_type: 'ephemeral',
    replace_original: true
  };
  
  var poll_edit_text_msg = {
    text: "",
    attachments: [
      {
        text: lang.msg.poll.entertext,
        fallback: lang.msg.poll.entertext,
        mrkdwn_in: ['text', 'pretext']
      },
      poll_edit_menu_att
    ],
    response_type: 'ephemeral',
    replace_original: true
  };
  
    var poll_edit_text_del_msg = {
    text: "",
    attachments: [
      {
        text: lang.msg.poll.entertext,
        fallback: lang.msg.poll.entertext,
        mrkdwn_in: ['text', 'pretext']
      },
      {
        text: "",
        fallback: "",
        callback_id: 'poll_edit_menu_callback',
        actions: [
          {
            name: 'back',
            text: lang.btn.back,
            type: 'button',
          },
          {
            name: 'delete',
            text: lang.btn.poll.deletetext,
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
  
  function poll_edit_answers_msg (answers) {
    var msg_text = {
      text: lang.msg.poll.selectansweredit,
      attachments: [],
      response_type: 'ephemeral',
      replace_original: true
    };
    
    for (var i = 0; i < answers.length; i++) {
      if (answers[i].state != 3) {
        msg_text.attachments.push({
          text: answers[i].text,
          fallback: answers[i].text,
          callback_id: 'poll_edit_answers_callback',
          actions: [
            {
              name: 'edit',
              value: i,
              text: lang.btn.edit,
              type: 'button'
            }
          ],
          mrkdwn_in: ['text', 'pretext']
        });
        if (answers.length > 2) msg_text.attachments[msg_text.attachments.length - 1].actions.push({
          name: 'delete',
          value: i,
          text: lang.btn.delete,
          type: 'button',
          style: 'danger',
          confirm: {
            title: lang.msg.confirm,
            text: lang.msg.poll.confirmdeleteanswer,
            ok_text: lang.btn.yes,
            dismiss_text: lang.btn.no
          }
        });
      }
    }
    
    msg_text.attachments.push(poll_edit_menu_att);
    return msg_text;
  }
  
  var poll_edit_answer_edit_msg = {
    text: "",
    attachments: [
      {
        text: lang.msg.poll.enteranswer,
        fallback: lang.msg.poll.enteranswer,
        mrkdwn_in: ['text', 'pretext']
      },
      poll_edit_menu_att
    ],
    response_type: 'ephemeral',
    replace_original: true
  };
  
  function poll_edit_max_msg (max) {
    var msg_text = {
      text: "",
      attachments: [
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
      ],
      response_type: 'ephemeral',
      replace_original: true
    };
    
    for (var i = 0; i < max; i++) {
      var btn = {name: i, text: i, type: 'button'};
      if (i < 5) msg_text.attachments[1].actions[i] = btn;
      else msg_text.attachments[2].actions[i - 5] = btn;
    }
    msg_text.attachments[1].actions[0].text = lang.btn.all;
    if (max <= 5) msg_text.attachments.splice(2, 1);
    
    msg_text.attachments.push(poll_edit_menu_att);
    return msg_text;
  }

  var poll_edit_names_msg = {
    text: lang.wrd.preview + ":",
    attachments: [
      {},
      {
        text: lang.msg.poll.shownames,
        fallback: lang.msg.poll.shownames,
        callback_id: 'poll_edit_names_callback',
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
      poll_edit_menu_att
    ],
    response_type: 'ephemeral',
    replace_original: true
  };
  
  // ===== MISC =====
  
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
      this.creator = data.creator || "";
      this.ts = {
        created: data.ts.created || 0,
        edited: data.ts.edited || 0
      };
      this.posts = data.posts || [];
      this.state = data.state || 0; //0 = default, 1 = vote closed, 2 = deleted
      if (!('options' in data)) data.options = {};
      this.options = {
        max: data.options.max || 1, 
        names: true,
        color: data.options.color || func.getRandomColor()
      }; //max: 0 = all, etc; names: true = show user names, false = don't show user names
      if ('names' in data.options) this.options.names = data.options.names;
    }

    edit (data) {
      this.title = data.title;
      this.text = data.text;
      this.state = data.state;
      this.ts.edited = data.ts.edited;
      this.options.names = data.options.names;
      
      //0 = not changed, 1 = edited, 2 = added, 3 = deleted
      var deleted = 0;
      for (var i = 0; i < data.answers.length; i++) {
        switch (data.answers[i].state) {
          case 0:
            break;
          case 1:
            this.answers[i - deleted].text = data.ansers[i].text;
            break;
          case 2:
            this.answers.push({text: data.ansers[i].text, votes: []});
            break;
          case 3:
            this.answers.splice(i - deleted, 1);
            deleted++;
            break;
        }
      }
      
      if (this.answers.length > data.options.max) this.options.max = this.answers.length;
      else this.options.max = data.options.max;
    }
    
    getData () {
      var temp = [];
      for (var i = 0; i < this.answers.length; i++) {
        temp[i] = {text: this.answers[i].text, votes: this.answers[i].votes, state: 0};
      }
      
      return {
        title: this.title,
        text: this.text,
        answers: temp,
        creator: this.creator,
        ts: {created: this.ts.created},
        state: this.state,
        options: {max: this.options.max, names: this.options.names, color: this.options.color}
      };
    }

    vote (answer, user_id) {
      var pos = this.answers[answer].votes.indexOf(user_id);
      if (pos == -1) {
        if (this.countVotes(user_id) < this.options.max || (this.countVotes(user_id) < this.answers.length && this.options.max == 0)) this.answers[answer].votes.push(user_id);
        else if (this.options.max == 1) {
          for (var i = 0; i < this.answers.length; i++) this.unvote(i, user_id);
          this.answers[answer].votes.push(user_id);
        }
      }
      else this.unvote(answer, user_id);
    }

    unvote (answer, user_id) {
      var pos = this.answers[answer].votes.indexOf(user_id);
      if (pos != -1) this.answers[answer].votes.splice(pos, 1);
    }

    countVotes (user_id) {
      var count = 0;
      for (var i = 0; i < this.answers.length; i++) {
        if (this.answers[i].votes.indexOf(user_id) != -1) count++;
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
        var percent = 0;
        
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
        if (this.answers[i].votes.length == 0) votes = lang.msg.poll.novotes;
        else percent = Math.round((this.answers[i].votes.length / voter_count) * 100);

        att_fields[i] = {
          value: emoji_num[i] + " *" + this.answers[i].text + " (" + percent + "%)*\n" + votes,
          short: false
        };
      }
      
      return {
        author_name: lang.wrd.poll + " #" + (slot + 1) + (this.state == 2 ? " [" + lang.wrd.deleted + "]" : ""),
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
        text: prtxt,
        fallback: prtxt,
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
      var temp_text = "<text>",
          temp_ts = 0,
          temp_color = "";
      if ('text' in data) temp_text = data.text;
      if ('options' in data) temp_color = data.options.color || "#00CCCC";
      
      var att_fields = [];
      att_fields[0] = {
        value: emoji_num[0] + " *<answer1> (100%)*\n" + "user1, user2",
        short: false
      };
      att_fields[1] = {
        value: emoji_num[1] + " *<answer2> (50%)*\n" + "user2",
        short: false
      };
      
      if ('answers' in data) {
        if ('ts' in data) {
          temp_ts = data.ts.edited;
          var voter_count = poll_db[slot].collectVoters().length;
          
          for (var i = 0; i < data.answers.length; i++) {
            var votes = "";
            var percent = 0;
            
            if (data.answers[i].state != 3) {
              for (var j = 0; j < data.answers[i].votes.length; j++) {
                if (data.options.names) {
                  votes += user.getUser(data.answers[i].votes[j]).name + ", ";
                } else {
                  votes = (j + 1);
                }
              }

              if (data.options.names) votes = votes.slice(0, -2);
              else if (votes == 1) votes += " " + lang.wrd.vote;
              else votes += " " + lang.wrd.votes;
              if (data.answers[i].votes.length == 0) votes = lang.msg.poll.novotes;
              else percent = Math.round((data.answers[i].votes.length / voter_count) * 100);

              att_fields[i] = {
                value: emoji_num[i] + " *" + data.answers[i].text + " (" + percent + "%)*\n" + votes,
                short: false
              };
            }
          }
        } else {
          for (var i = 0; i < data.answers.length; i++) {
            att_fields[i] = {
              value: emoji_num[i] + " *" + data.answers[i].text + " (0%)*\n" + lang.msg.poll.novotes,
              short: false
            }
          }
        }
      }
      
      return {
        author_name: lang.wrd.poll + " #" + (slot + 1) + (data.state == 2 ? " [" + lang.wrd.deleted + "]" : ""),
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
    }
    
    open (slot) {
      this.state = 0;
      this.update(slot);
    }

    close (slot) {
      this.state = 1;
      this.update(slot);
    }
    
    isOpen () {
      return (this.state == 0);
    }
    
    isClosed () {
      return (this.state == 1);
    }
    
    isVisible () {
      return (this.state == 0 || this.state == 1);
    }
    
    isOwner (user_id) {
      return (this.creator == user_id);
    }
  }



// ===================================
// ========== POLL DATABASE ==========
// ===================================

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
            var msg_text = poll_create_max_msg(data.answers.length);
            msg_text.attachments[0] = Poll.generateDummy(poll_db.length, data);
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
      for (var i = 0; i < temp.length && data.answers.length < 10; i++) data.answers.push({text: temp[i].trim(), votes: [], state: 0});
      
      if (data.answers.length < 10) {
        if (data.answers.length >= 2) var msg_text = poll_create_answers_n_msg;
        else var msg_text = poll_create_answers_msg;
        msg_text.attachments[0] = Poll.generateDummy(poll_db.length, data);
        msg.respond(msg_text);
        msg.route('poll_create_answers_route', data, 60);
      } else {
        var msg_text = poll_create_max_msg(data.answers.length);
        msg_text.attachments[0] = Poll.generateDummy(poll_db.length, data);
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
      
      data.options = {max: parseInt(msg.body.actions[0].name)};
      var msg_text = poll_create_names_msg;
      msg_text.attachments[0] = Poll.generateDummy(poll_db.length, data);
      msg.respond(msg_text);
      msg.route('poll_create_names_route', data, 60);
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
          data.create = true;
          var msg_text = poll_edit_msg(0);
          msg_text.attachments[0] = Poll.generateDummy(poll_db.length, data);
          msg.respond(msg_text);
          msg.route('poll_edit_route', data, 60);
          return;
        case 'done':
          break;
        case 'cancel':
          msg.respond({text: "", delete_original: true});
          return;
      }
      
      data.ts = {created: msg.body.action_ts};
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
    
    if (cmd.substring(0,4) == "show" && check.test(cmd.substring(5))) {
      var slot = parseInt(cmd.substring(5)) - 1;
      
      if (slot < poll_db.length) {
        var msg_text = poll_db[slot].generatePoll(slot);
        msg_text.text = "";
        msg_text.attachments.push(poll_dismiss_att);
        msg.respond(msg_text);
      } else msg.respond(func.generateInfoMsg(lang.err.poll.notfound));
    } else msg.respond(poll_list_msg(0, {mode: 0, sort: 'desc'}));
    
    return;
  });
  
  slapp.action('poll_show_filter_callback', (msg) => {
    var data = msg.body.actions[0].name.split("-");
    
    msg.respond(poll_list_msg(0, {mode: parseInt(data[0]), sort: data[1], user_id: msg.body.user.id}));
    return;
  });
  
  slapp.action('poll_show_pages_callback', (msg) => {
    var data = msg.body.actions[0].name.split("-"),
        page = parseInt(msg.body.actions[0].value);
    
    switch (data[0]) {
      case 'back':
      case 'next':
        msg.respond(poll_list_msg(page, {mode: parseInt(data[1]), sort: data[2], user_id: msg.body.user.id}));
        return;
      case 'page':
        return;
      case 'dismiss':
        msg.respond({text: "", delete_original: true});
        return;
    }
  });
  
  // ===== /poll post =====
  
  slapp.command('/dbpoll', "post \\d{1,4}", (msg, cmd) => {
    var slot = parseInt(cmd.substring(5)) - 1;
    
    if (slot < poll_db.length) {
      msg.say(poll_db[slot].generatePoll(slot), (err, result) => {
        if (err) console.log("Unable to post in channel (" + err + ")");
        else {
          poll_db[slot].addPost(result.channel, result.ts);
          savePollDB();
        }
      });
    }
    else msg.respond(func.generateInfoMsg(lang.err.poll.notfound));
    
    return;
  });
  
// ===== /poll edit =====
  
  slapp.command('/dbpoll', "edit(.*)", (msg, cmd) => {
    var check = new RegExp("\\d{1,4}");
    
    if (check.test(cmd.substring(5))) {
      var slot = parseInt(cmd.substring(5)) - 1;
      
      if (slot < poll_db.length && (poll_db[slot].isVisible() || user.isAdmin(msg.body.user_id))) {
        if (poll_db[slot].isOwner(msg.body.user_id) || user.isAdmin(msg.body.user_id)) {
          var data = {slot: slot, info: poll_db[slot].getData()},
              msg_text = poll_edit_msg(data.info.state);
          msg_text.attachments[0] = Poll.generateDummy(data.slot, data.info);
          msg.respond(msg_text);
          msg.route('poll_edit_route', data, 60);
          return;
        } else msg.respond(func.generateInfoMsg(lang.err.poll.notowner));
      } else msg.respond(func.generateInfoMsg(lang.err.poll.notfound));
    } else msg.respond(poll_edit_list_msg(msg.body.user_id, 0, 'desc'));
    
    return;
  });
  
  slapp.action('poll_edit_pages_callback', (msg) => {
    var data = msg.body.actions[0].name.split("-");
    
    switch (data[0]) {
      case 'back':
      case 'next':
        msg.respond(poll_edit_list_msg(msg.body.user.id, parseInt(msg.body.actions[0].value), data[1]));
        return;
      case 'page':
        return;
      case 'asc':
      case 'desc':
        msg.respond(poll_edit_list_msg(msg.body.user.id, 0, data[0]));
        return;
      case 'dismiss':
        msg.respond({text: "", delete_original: true});
        return;
    }
  });
  
  slapp.action('poll_edit_del_callback', (msg) => {
    var slot = parseInt(msg.body.actions[0].value);
    
    switch (msg.body.actions[0].name) {
      case 'edit':
        var data = {slot: slot, info: poll_db[slot].getData()},
            msg_text = poll_edit_msg(data.info.state);
        msg_text.attachments[0] = Poll.generateDummy(data.slot, data.info);
        msg.respond(msg_text);
        msg.route('poll_edit_route', data, 60);
        break;
      case 'delete':
        poll_db[slot].delete();
        savePollDB();
        msg.respond(func.generateInfoMsg(lang.msg.poll.deleted));
        break;
    }
    return;
  });
  
  slapp.route('poll_edit_route', (msg, data) => {
    if (msg.type != 'action') {
      msg.route('poll_edit_route', data, 60);
      return;
    } else {
      switch (msg.body.actions[0].name) {
        case 'title':
          msg.respond(poll_edit_title_msg);
          msg.route('poll_edit_title_route', data, 60);
          return;
        case 'text':
          if (data.info.text == "") msg.respond(poll_edit_text_msg);
          else msg.respond(poll_edit_text_del_msg);
          msg.route('poll_edit_text_route', data, 60);
          return;
        case 'answers':
          msg.respond(poll_edit_answers_msg(data.info.answers));
          msg.route('poll_edit_answers_route', data, 60);
          return;
        case 'max':
          msg.respond(poll_edit_max_msg(data.info.answers.length));
          msg.route('poll_edit_max_route', data, 60);
          return;
        case 'names':
          msg.respond(poll_edit_names_msg);
          msg.route('poll_edit_names_route', data, 60);
          return;
        case 'done':
          break;
        case 'cancel':
          msg.respond({text: "", delete_original: true});
          return;
        case 'open':
        case 'undelete':
          data.info.state = 0;
          data.edited = true;
          var msg_text = poll_edit_msg(data.info.state);
          msg_text.attachments[0] = Poll.generateDummy(data.slot, data.info);
          msg.respond(msg_text);
          msg.route('poll_edit_route', data, 60);
          return;
        case 'close':
          data.info.state = 1;
          data.edited = true;
          var msg_text = poll_edit_msg(data.info.state);
          msg_text.attachments[0] = Poll.generateDummy(data.slot, data.info);
          msg.respond(msg_text);
          msg.route('poll_edit_route', data, 60);
          return;
        case 'delete':
          poll_db[data.slot].delete();
          savePollDB();
          msg.respond(func.generateInfoMsg(lang.msg.poll.deleted));
          return;
      }
      
      
      if (data.create) {
        var msg_text = poll_create_final_msg;
        msg_text.attachments[0] = Poll.generateDummy(poll_db.length, data);
        msg.respond(msg_text);
        msg.route('poll_create_final_route', data, 60);
      } else if (data.edited) {
        data.info.ts.edited = msg.body.action_ts;
        poll_db[data.slot].edit(data.info);
        poll_db[data.slot].update(data.slot);
        savePollDB();
        msg.respond({text: "", delete_original: true});
      } else msg.respond({text: "", delete_original: true});
      return;
    }
  });
  
  slapp.route('poll_edit_title_route', (msg, data) => {
    if (msg.type == 'event') {
      msg.route('poll_edit_title_route', data, 60);
      return;
    } else if (msg.type == 'action') {
      switch (msg.body.actions[0].name) {
        case 'back':
          var msg_text = poll_edit_msg(data.info.state);
          msg_text.attachments[0] = Poll.generateDummy(data.slot, data.info);
          msg.respond(msg_text);
          msg.route('poll_edit_route', data, 60);
          break;
        case 'cancel':
          msg.respond({text: "", delete_original: true});
          break;
      }
      return;
    } else {
      data.info.title = msg.body.text;
      data.edited = true;
      
      var msg_text = poll_edit_msg(data.info.state);
      msg_text.attachments[0] = Poll.generateDummy(data.slot, data.info);
      msg.respond(msg_text);
      msg.route('poll_edit_route', data, 60);
      return;
    }
  });
  
  slapp.route('poll_edit_text_route', (msg, data) => {
    if (msg.type == 'event') {
      msg.route('poll_edit_text_route', data, 60);
      return;
    } else if (msg.type == 'action') {
      switch (msg.body.actions[0].name) {
        case 'back':
          var msg_text = poll_edit_msg(data.info.state);
          msg_text.attachments[0] = Poll.generateDummy(data.slot, data.info);
          msg.respond(msg_text);
          msg.route('poll_edit_route', data, 60);
          break;
        case 'delete':
          data.info.text = "";
          data.edited = true;
          var msg_text = poll_edit_msg(data.info.state);
          msg_text.attachments[0] = Poll.generateDummy(data.slot, data.info);
          msg.respond(msg_text);
          msg.route('poll_edit_route', data, 60);
          break;
        case 'cancel':
          msg.respond({text: "", delete_original: true});
          break;
      }
      return;
    } else {
      data.info.text = msg.body.text;
      data.edited = true;
      
      var msg_text = poll_edit_msg(data.info.state);
      msg_text.attachments[0] = Poll.generateDummy(data.slot, data.info);
      msg.respond(msg_text);
      msg.route('poll_edit_route', data, 60);
      return;
    }
  });
  
  slapp.route('poll_edit_answers_route', (msg, data) => {
    if (msg.type == 'event') {
      msg.route('poll_edit_answers_route', data, 60);
      return;
    } else if (msg.type == 'action') {
      switch (msg.body.actions[0].name) {
        case 'edit':
          data.curanswer = parseInt(msg.body.actions[0].value);
          msg.respond(poll_edit_answer_edit_msg);
          msg.route('poll_edit_answer_edit_route', data, 60);
          return;
        case 'delete':
          var slot = parseInt(msg.body.actions[0].value);
          if (data.info.answers[slot].state == 2) data.info.answers.splice(slot, 1);
          else data.info.answers[slot].state = 3;
          msg.respond(poll_edit_answers_msg(data.info.answers));
          msg.route('poll_edit_answers_route', data, 60);
          return;
        case 'back':
          var msg_text = poll_edit_msg(data.info.state);
          msg_text.attachments[0] = Poll.generateDummy(data.slot, data.info);
          msg.respond(msg_text);
          msg.route('poll_edit_route', data, 60);
          return;
        case 'cancel':
          msg.respond({text: "", delete_original: true});
          return;
      }
    } else {
      var temp = msg.body.text.split(";");
      if (temp[temp.length - 1].trim() == "") temp = temp.slice(0, -1);
      
      var active = 0;
      for (var i = 0; i < data.info.answers.length; i++) {
        if (data.info.answers[i].state != 3) active++;
      }
      
      for (var i = 0; i < temp.length && i + active < 10; i++) {
        data.info.answers.push({
          text: data.info.text = temp[i],
          votes: [],
          state: 2
        });
      }
      
      msg.respond(poll_edit_answers_msg(data.info.answers));
      msg.route('poll_edit_answers_route', data, 60);
      return;
    }
  });
  
  slapp.route('poll_edit_answer_edit_route', (msg, data) => {
    if (msg.type == 'event') {
      msg.route('poll_edit_answer_edit_route', data, 60);
      return;
    } else if (msg.type == 'action') {
      switch (msg.body.actions[0].name) {
        case 'back':
          msg.respond(poll_edit_answers_msg(data.info.answers));
          msg.route('poll_edit_answers_route', data, 60);
          return;
        case 'cancel':
          msg.respond({text: "", delete_original: true});
          return;
      }
    } else {
      data.info.answers[data.curanswer].text = msg.body.text;
      if (data.info.answers[data.curanswer].state == 0) data.info.answers[data.curanswer].state = 1;
      
      msg.respond(poll_edit_answers_msg(data.info.answers));
      msg.route('poll_edit_answers_route', data, 60);
      return;
    }
  });
  
  slapp.route('poll_edit_max_route', (msg, data) => {
    if (msg.type != 'action') {
      msg.route('poll_edit_max_route', data, 60);
      return;
    } else {
      switch (msg.body.actions[0].name) {
        case 'back':
          var msg_text = poll_edit_msg(data.info.state);
          msg_text.attachments[0] = Poll.generateDummy(data.slot, data.info);
          msg.respond(msg_text);
          msg.route('poll_edit_route', data, 60);
          return;
        case 'cancel':
          msg.respond({text: "", delete_original: true});
          return;
      }
      
      data.info.options.max = parseInt(msg.body.actions[0].name);
      data.edited = true;
      
      var msg_text = poll_edit_msg(data.info.state);
      msg_text.attachments[0] = Poll.generateDummy(data.slot, data.info);
      msg.respond(msg_text);
      msg.route('poll_edit_route', data, 60);
      return;
    }
  });
  
  slapp.route('poll_edit_names_route', (msg, data) => {
    if (msg.type != 'action') {
      msg.route('poll_edit_names_route', data, 60);
      return;
    } else {
      switch (msg.body.actions[0].name) {
        case 'yes':
          data.info.options.names = true;
          break;
        case 'no':
          data.info.options.names = false;
          break;
        case 'back':
          var msg_text = poll_edit_msg(data.info.state);
          msg_text.attachments[0] = Poll.generateDummy(data.slot, data.info);
          msg.respond(msg_text);
          msg.route('poll_edit_route', data, 60);
          return;
        case 'cancel':
          msg.respond({text: "", delete_original: true});
          return;
      }
      
      data.edited = true;
      
      var msg_text = poll_edit_msg(data.info.state);
      msg_text.attachments[0] = Poll.generateDummy(data.slot, data.info);
      msg.respond(msg_text);
      msg.route('poll_edit_route', data, 60);
      return;
    }
  });
  
// ===== /poll help =====
  
  slapp.command('/dbpoll', "help", (msg, cmd) => {
    msg.respond(func.generateInfoMsg(lang.msg.poll.help));
    return;
  });
  
// ===== /poll debug =====
  
  /*slapp.command('/dbpoll', "debug \\d{1,4}", (msg, cmd) => {
    var slot = parseInt(cmd.substring(5)) - 1;
    
    if (slot < poll_db.length && msg.body.user_id == config.admin_id) msg.respond(poll_db[slot].generateDebugInfo(slot));
    
    return;
  });*/
  
// ===== /poll =====
  
  slapp.command('/dbpoll', "(.*)", (msg, cmd) => {
    var temp = cmd.split(";");
    if (temp[temp.length - 1].trim() == "") temp = temp.slice(0, -1);
    
    if (temp.length >= 3) {
      var data = {title: temp[0], text: "", answers: [], creator: msg.body.user_id};
      for (var i = 1; i < temp.length && data.answers.length < 10; i++) data.answers.push({text: temp[i].trim(), votes: []});
      
      var msg_text = poll_create_final_msg;
      msg_text.attachments[0] = Poll.generateDummy(poll_db.length, data);
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
      case 'create':
        var data = {creator: msg.body.user.id};
        var msg_text = poll_create_title_msg;
        msg_text.attachments[0] = Poll.generateDummy(poll_db.length, data);
        
        msg.respond(msg_text);
        msg.route('poll_create_title_route', data, 60);
        break;
      case 'show':
        msg.respond(poll_list_msg(0, {mode: 0, sort: 'desc'}));
        break;
      case 'edit':
        msg.respond(poll_edit_list_msg(msg.body.user_id, 0, 'desc'));
        break;
      case 'help':
        msg.respond({
          text: lang.msg.poll.help,
          attachments: [poll_dismiss_att],
          response_type: 'ephemeral',
          replace_original: true
        });
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
    
    if (!('original_message' in msg.body)) msg.respond(func.generateInfoMsg(lang.msg.poll.success));
    return;
  });
  
  return module;
};
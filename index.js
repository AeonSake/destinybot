// ==============================
// ========== SETTINGS ==========
// ==============================

var Botkit = require('botkit');
var os = require('os');

var token = process.env.SLACK_TOKEN;

var controller = Botkit.slackbot({
  // reconnect to Slack RTM when connection goes bad
  //json_file_store: 'path_to_json_database',
  retry: Infinity,
  debug: false
})

// Assume single team mode if we have a SLACK_TOKEN
if (token) {
  console.log('Starting in single-team mode')
  controller.spawn({
    token: token
  }).startRTM(function (err, bot, payload) {
    if (err) {
      throw new Error(err)
    }

    console.log('Connected to Slack RTM')
  })
// Otherwise assume multi-team mode - setup beep boop resourcer connection
} else {
  console.log('Starting in Beep Boop multi-team mode')
  require('beepboop-botkit').start(controller, { debug: true })
}

controller.setupWebserver(3000, function(err, webserver) {
    controller.createWebhookEndpoints(webserver);
});

// ===============================
// ========== Responses ==========
// ===============================

// ===== General stuff =====

var muted = false;

function multi_res(res) {
  return res[Math.floor(Math.random() * res.length)];
}

controller.hears(["(\\bwer (bist|bistn) du\\b)", "(\\bwho are you\\b)", "(\\bwie (heißt|heisst|haßt|hasst|hast) du\\b)"], ['direct_message', 'direct_mention', 'mention'], function(bot, message) {

  bot.reply(message, "Mein Name ist B.O.B. - kurz für Brainless Operating Bot.")
})

controller.on('bot_channel_join', function (bot, message) {
  bot.reply(message, "Hello world!")
})

controller.on('user_channel_join', function (bot, message) {
  if (muted == false) bot.reply(message, "Hallo und willkommen in unserer Selbsthilfegruppe.")
})

// ===== Testing =====
// Syntax:
/*
controller.hears(["(\\b\\b)"], ['ambient', 'direct_message', 'direct_mention', 'mention'], function (bot, message) {
  var responses = [""];
    
  if (muted == false) bot.reply(message, multi_res(responses))
})
*/

/*
controller.hears(["(\\bbobtest\\b)"], ['ambient', 'direct_message', 'direct_mention', 'mention'], function (bot, message) {
  bot.reply(message,{
      text: "A more complex response",
      username: "ReplyBot",
      icon_emoji: ":dash:",
    });
})

controller.hears(["(\\bbobtest2\\b)"], ['ambient', 'direct_message', 'direct_mention', 'mention'], function (bot, message) {
  var reply_with_attachments = {
    'username': 'My bot' ,
    'text': 'This is a pre-text',
    'attachments': [
      {
        'fallback': 'To be useful, I need you to invite me in a channel.',
        'title': 'How can I help you?',
        'text': 'To be useful, I need you to invite me in a channel ',
        'color': '#7CD197'
      }
    ],
    'icon_url': 'http://lorempixel.com/48/48'
    }

  bot.reply(message, reply_with_attachments);
})

controller.hears(["(\\bbobtest3\\b)"], ['ambient', 'direct_message', 'direct_mention', 'mention'], function (bot, message) {
  bot.reply(message, message.user);
})

controller.hears(["(\\bbobtest4\\b)"], ['ambient', 'direct_message', 'direct_mention', 'mention'], function (bot, message) {
  if (message.user = "U2G081BBQ") {
      bot.reply(message, "success");
  }
})
*/

controller.hears(["(\\braid (setup|planung)\\b)", "(\\brambo raid\\b)"],['ambient', 'direct_message', 'direct_mention', 'mention'],function(bot, message) {
  bot.startConversation(message, askRaidType);
});

askRaidType = function(response, convo) {
  convo.ask("Um welchen Raid handelt es sich?", function(response, convo) {
    var raid_type = response.text;
    if (response.text !== "exit") askRaidDate(response, convo, raid_type);
    convo.next();
  });
}
askRaidDate = function(response, convo, raid_type) {
  convo.ask("Wann findet der Raid statt (DD.MM.YY)?", function(response, convo) {
    var raid_date = response.text;
    if (response.text !== "exit") askRaidDate(response, convo, raid_type, raid_date);
    convo.next();
  });
}
askRaidTime = function(response, convo, raid_type, raid_date) {
  convo.ask("Um welche Uhrzeit (hh:mm)?", function(response, convo) {
    var raid_time = response.text;
    var raid_info = {
      'attachments': [
        {
          'fallback': raid_type + ", am " + raid_date + " um " + raid_time + ".",
          'title': raid_type + " #1",
          'text': raid_type + ", am " + raid_date + " um " + raid_time + ".",
          'color': '#7CD197'
        }
      ]
    }
    
    convo.say(raid_info);
    convo.next();
  });
}





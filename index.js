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

// ===== Raid Managing =====

var raid_info = [];
var raid_types = ["Gläserne Kammer (Atheon)", "Crotas Ende (Crota)", "Skolas' Rache (Skolas)", "Königsfall (Oryx)", "Zorn der Maschine (SIVA)"];
var raid_marker = 0;

//raid_info contains:
//type - raid type
//date - event date dd.mm.yy
//time - event time hh:mm
//creator - event creator

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

controller.hears(["(\\braid test\\b)"],['ambient', 'direct_message', 'direct_mention', 'mention'],function(bot, message) {
  raid_info[raid_marker] = {
    type : 1,
    date : "03.10.16",
    time : "15:00",
    creator : message.user
  };
  var raid_info = {
    'attachments': [
      {
        'fallback': raid_types[raid_info[raid_marker].type] + ", am " + raid_info[raid_marker].date + " um " + raid_info[raid_marker].time + ".",
        'title': "Raid Info #" + (raid_marker+1).toString,
        'text': raid_types[raid_info[raid_marker].type] + ", am " + raid_info[raid_marker].date + " um " + raid_info[raid_marker].time + ".\nErstellt von <@" + response.user + ">.",
        'color': '#7CD197'
      }
    ]
  }
  raid_marker++;
  bot.reply(message, raid_info);
});



controller.hears(["(\\braid (setup|planung)\\b)", "(\\brambo raid\\b)"],['ambient', 'direct_message', 'direct_mention', 'mention'],function(bot, message) {
  bot.startConversation(message, startRaidSetup);
});

startRaidSetup = function(response, convo) {
  convo.ask("Um welchen Raid handelt es sich?\n1 : "+raid_types[0]+"\n2 : "+raid_types[1]+"\n3 : "+raid_types[2]+"\n4 : "+raid_types[3]+"\n5 : "+raid_types[4], function(response, convo) {
    var raid_type = response.text;
    if (raid_type !== "exit") {
      if (raid_type >= 1 && raid_type <= raid_types.length) askRaidDate(response, convo, raid_type);
      else {
        convo.say("Falsche Eingabe, bitte wiederholen oder mit 'exit' abbrechen.");
        startRaidSetup(message, convo);
      }
    }
    convo.next();
  });
}
askRaidDate = function(response, convo, raid_type) {
  convo.ask("Wann findet der Raid statt (DD.MM.YY)?", function(response, convo) {
    var raid_date = response.text;
    if (raid_date !== "exit") {
      if (raid_date == "test") askRaidTime(response, convo, raid_type, raid_date);
      else {
        convo.say("Falsche Eingabe, bitte wiederholen oder mit 'exit' abbrechen.");
        askRaidDate(response, convo, raid_type);
      }
    }
    convo.next();
  });
}
askRaidTime = function(response, convo, raid_type, raid_date) {
  convo.ask("Um welche Uhrzeit (hh:mm)?", function(response, convo) {
    var raid_time = response.text;
    if (raid_date !== "exit") {
      if (raid_date == "test") {
        raid_info[raid_marker] = {
          type : raid_type,
          date : raid_date,
          time : raid_time,
          creator : response.user
        };
        var raid_info = {
          'attachments': [
            {
              'fallback': raid_types[raid_info[raid_marker].type] + ", am " + raid_info[raid_marker].date + " um " + raid_info[raid_marker].time + ".",
              'title': "Raid Info #" + (raid_marker+1).toString,
              'text': raid_types[raid_info[raid_marker].type] + ", am " + raid_info[raid_marker].date + " um " + raid_info[raid_marker].time + ".\nErstellt von <@" + response.user + ">.",
              'color': '#7CD197'
            }
          ]
        }
        raid_marker++;
        convo.say(raid_info);
      }
      else {
        convo.say("Falsche Eingabe, bitte wiederholen oder mit 'exit' abbrechen.");
        askRaidTime(response, convo, raid_type, raid_date);
      }
    }
    convo.next();
  });
}





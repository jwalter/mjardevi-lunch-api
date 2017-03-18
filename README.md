# mjardevi-lunch-api

How to use in a Botkit Slack bot

    var https = require('https') // Or http if host is not on https

    module.exports = function (controller) {
        const colors = ['f00', 'f4a460', '7F7FFF'];
        controller.hears(['.*', 'Lunch 12.30?'], 'direct_message,direct_mention,message_received', function (bot, message) {
            bot.reply(message, 'Hämtar...');
            bot.createConversation(message, function (err, convo) {

                var url = '<HOST>';

                https.get(url, function (res) {
                    var body = '';

                    res.on('data', function (chunk) {
                        body += chunk;
                    });

                    res.on('end', function () {
                        try {
                            var botResponse = JSON.parse(body);
                            var attArr = [];
                            botResponse.forEach(function (item, i) {
                                attArr.push({
                                    'title': item.restaurant,
                                    'text': item.dishes.reduce(function (t, s) { return t + '● ' + s + '\n' }, ""),
                                    'color': colors[i]
                                });
                            });
                            convo.say({
                                'text': 'Här är dagens menyer:',
                                'attachments': attArr
                            });

                        } catch (e) {
                            console.log('Got an error: ', e);
                            convo.say({
                                text: 'Ajdå, nåt gick alldeles fel',
                                attachments: [{ text: e.toString() }]
                            });

                        }
                        convo.activate();
                    });
                }).on('error', function (e) {
                    console.log('Got an error: ', e);
                    convo.say({
                        text: 'Ajdå, nåt gick alldeles fel',
                        attachments: [{ text: e.toString() }]
                    });
                    convo.activate();
                });

            });

        });
    }

'use strict';
const Alexa = require('alexa-sdk');
const request = require('request');

const APP_ID = 'amzn1.ask.skill.e70223a5-fbb7-4117-aaf0-de127ecdbce1';
const SKILL_NAME = 'Cryptocurreny India';
const HELP_MESSAGE = 'You can say tell me price of bitcoin or litecoin or ethereum or ripple or bitcoin cash... What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye!';
const cryptocurreny = JSON.parse('{"XRP":"xrp" , "BTC":"btc" ,"BCH":"bch", "LTC" : "ltc", "ETH":"eth"}');
var jsonData = {};
var crypto;

//=========================================================================================================================================
//Editing anything below this line might break your skill.
//=========================================================================================================================================

const myNewPromise = (crypto) => {
    return new Promise((resolve, reject) => {
        var https = require('https');
        var uri = 'https://www.zebapi.com/api/v1/market/ticker-new/'+crypto+'/inr';
        uri = encodeURI(uri);
        request(uri, { json: true }, (err, res, body) => {
            if (err) { 
                console.log(err);
                reject(err);
            }
            try{
                console.log(body.market);
                resolve(body.market);

            }
            catch(err){
                reject(err);
            }

        });

    }
                      );
}





const handlers = {
    'LaunchRequest': function() {
        this.response
            .speak('Welcome to Cryptocurrency India. I can tell you latest price of Cryptocurrencies in Indian Market. You can say tell me price of bitcoin or litecoin or ethereum or ripple or bitcoin-cash. Which cryptocurreny price would you like to know? ').listen();
        this.emit(':responseReady');
    },

    'AnswerIntent': function() {
        var userAnswer = this.event.request.intent.slots.crypto.resolutions.resolutionsPerAuthority["0"].values["0"].value.name;

        console.log(userAnswer);
        crypto = cryptocurreny[userAnswer];
        //console.log('hello'+crypto);

        if (crypto === 'xrp' || crypto === 'btc' || crypto === 'bch' || crypto === 'ltc' || crypto === 'eth') {
            //console.log("Yay!");
            myNewPromise(crypto).then((successMessage) => {
                //console.log("Yay! " + successMessage);
                this.response.speak('Price of ' + this.event.request.intent.slots.crypto.value + ' is INR ' + successMessage).listen();
                this.emit(':responseReady');
            }).catch((err) => {
                this.response.speak('Error Occured while fetching price! Please Try Again! '+err);
                this.emit(':responseReady');
            });



        } else {
            this.response
                .speak('Sorry ' + userAnswer + ' currency is not supported currently').listen();
            this.emit(':responseReady');
        }

    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = HELP_MESSAGE;
        const reprompt = HELP_REPROMPT;

        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
   
};

exports.handler = function(event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
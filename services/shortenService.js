'use strict';

const tinyUrl = require('tinyurl');

class ShortenService {

  constructor(){}

  shorten(url) {
    let p = new Promise((resolve, reject) =>  {
      tinyUrl.shorten(url, function (response, err) {
           if ( err ){
             console.log("this is supposed to be an error");
             console.log(err);
             reject(err);
           } else{
             console.log("got the tinyurl -->");
             console.log("Response:  " + response);
             resolve(response);
           }
        });
     });
     return p;
   }

}

module.exports = ShortenService;

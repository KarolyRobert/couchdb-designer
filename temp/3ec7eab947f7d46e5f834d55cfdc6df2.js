const environment = require('../build/testing/testEnvironment').testEnvironment("896525087cd46aa1af312c061e33114a");
require = environment.require;
const emit = environment.emit;
const log = environment.log;
const isArray = Array.isArray;
const sum = environment.sum;
const toJSON = environment.toJSON;
//Original content 


function expires(doc){
    if(doc){
        var newExpires;
        if(doc.user_type === 'user'){
            if(doc.eternal){
                newExpires = new Date(Date.now() + (1000*60*60*24*365)).valueOf();
            }else{
                newExpires = new Date(Date.now() + (1000*60*60*24*1)).valueOf();
            }
        }else{
            newExpires = new Date(Date.now() + (1000*60*60*24*1)).valueOf();
        }
        doc.expires = newExpires;
        return [doc,toJSON({ user_type: doc.user_type , uid: doc.uid, expires: newExpires})]
    }
    return [null,'missing']
}

module.exports = { expires }

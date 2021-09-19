const environment = require('../build/testing/testEnvironment').testEnvironment("e8a285790e3eb51fc6a7e198b57fd5ea");
require = environment.require;
const emit = environment.emit;
const log = environment.log;
const isArray = Array.isArray;
const sum = environment.sum;
const toJSON = environment.toJSON;
//Original content 


    function map (doc){
        const myfuncts = function(){
            emit(doc.parent,1);
        }
        if(doc.parent){
            myfuncts();
        }else{
            emit('helo',1);
        }
    }

    function reduce(keys,values,rereduce){
        if(doc.parent){
            
        }
    }

module.exports = { map, reduce }

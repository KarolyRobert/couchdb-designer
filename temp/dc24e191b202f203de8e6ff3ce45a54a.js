const environment = require('../build/testing/testEnvironment').testEnvironment("e8a285790e3eb51fc6a7e198b57fd5ea");
require = environment.require;
const emit = environment.emit//original


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
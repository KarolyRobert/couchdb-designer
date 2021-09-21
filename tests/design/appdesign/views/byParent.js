

    function map (doc){
        log('log from views/byParent/map');
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
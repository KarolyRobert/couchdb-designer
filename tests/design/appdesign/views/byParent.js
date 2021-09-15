
    function map (doc){
        const myfuncts = function(){
            console.log('Helo');
        }
        if(doc.parent){
            myfuncts();
        }
    }

    function reduce(keys,values,rereduce){
        if(doc.parent){
            emit();
        }
    }

module.exports = { map, reduce }
import compileSelector from './compileSelector';

const fullSelector = {
    foo:'bar',
    bar:{
        foo:'bar',
        bar:{
            baz:{
                "$lte":'bar',
                "$gte":'foo',
            },
            foo:{
                "$exists":false
            },
            bar:{
                "$type":'array'
            }
        }
    },
    baz:{
        "$lt": 2010,
        "$gt": 1000,
        "$ne": 1500
    },
    foobar:{
        "$in":[1,2],
        "$nin":[3,4],
        "$size":5,
        "$all":[6,7],
        "$elemMatch":{"$eq":10},
        "$allMatch":{"$lt":20,"$gt":0}
    },
    barbaz:{
        "$mod":[11,3],
        "$regex":"^foo"
    },
    foobaz:{
        "$and":[
            {foo:'bar'},
            {bar:{
                "$or":[
                    {foo:'bar'},
                    {bar:'baz'},
                    {"$not":{baz:'foo'}},
                ]
            }}
        ]
    },
    bazbar:{
        "$keyMapMatch":{
            "$eq":'bar'
        }
    }
}

const error1 = {
    foo:{
        "$exists": "true"
    }
}

const error2 = {
    foo:{
        "$in": "array"
    }
}

const error3 = {
    foo:{
        "$size": 12.34
    }
}


const error4 = {
    foo:{
        "$regex": 12.34
    }
}


const error5 = {
    foo:{
        "$type": 'integer'
    }
}


const error6 = {
    foo:{
        "$mod": 'integer'
    }
}



const error7 = {
    foo:{
        "$not": 'integer'
    }
}



const error8 = {
    foo:{
        "$nor": ['integer']
    }
}


describe('compileSelector',() => {
    test('all case',() => {
        expect(compileSelector(fullSelector,'file','index')).toMatchSnapshot();
    })
    test('errors',() => {
        expect(() => compileSelector(error1,'file','index')).toThrow("$exists's argument must be boolean!");
        expect(() => compileSelector(error2,'file','index')).toThrow("$in's argument must be array!");
        expect(() => compileSelector(error3,'file','index')).toThrow("$size's argument must be integer!");
        expect(() => compileSelector(error4,'file','index')).toThrow("$regex's argument must be a regular expression!");
        expect(() => compileSelector(error5,'file','index')).toThrow("$type's argument must be one of the null,boolean,number,string,array,object values!");
        expect(() => compileSelector(error6,'file','index')).toThrow("$mod argument must be an two element array of integers!");
        expect(() => compileSelector(error7,'file','index')).toThrow("$not's argument must be selector!");
        expect(() => compileSelector(error8,'file','index')).toThrow("$nor's argument must be an array of selectors!");
    })
});
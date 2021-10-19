import createMangoFilter from "./createMangoFilter";


describe("createMangoFilter",() =>{
    test('$eq',() => {

        const eqfilter = {
            a:'a'
        }
        const doc1 = {a:'a'}
        const doc2 = {a:'b'}

        let filter = createMangoFilter(eqfilter);
        expect(filter(doc1)).toBeTruthy();
        expect(filter(doc2)).toBeFalsy();
    })
    test('$and',() => {

        const andfilter = {
            a:'a',
            b:'b'
        }
        const doc1 = {a:'a', b:'b'}
        const doc2 = {a:'a', b:1}

        let filter = createMangoFilter(andfilter);
        expect(filter(doc1)).toBeTruthy();
        expect(filter(doc2)).toBeFalsy();
    })

    test('$lt',() => {

        const ltfilter = {
            a:{'$lt':10},
        }
        const doc1 = {a:9}
        const doc2 = {a:11}

        let filter = createMangoFilter(ltfilter);
        expect(filter(doc1)).toBeTruthy();
        expect(filter(doc2)).toBeFalsy();
    })

    test('$gt',() => {

        const gtfilter = {
            a:{'$gt':10},
        }
        const doc1 = {a:9}
        const doc2 = {a:11}

        let filter = createMangoFilter(gtfilter);
        expect(filter(doc2)).toBeTruthy();
        expect(filter(doc1)).toBeFalsy();
    })

    test('$lte',() => {

        const ltefilter = {
            a:{'$lte':10},
        }
        const doc1 = {a:9}
        const doc2 = {a:10}
        const doc3 = {a:11}

        let filter = createMangoFilter(ltefilter);
        expect(filter(doc1)).toBeTruthy();
        expect(filter(doc2)).toBeTruthy();
        expect(filter(doc3)).toBeFalsy();
    })

    test('$gte',() => {

        const gtefilter = {
            a:{'$gte':10},
        }
        const doc1 = {a:9}
        const doc2 = {a:10}
        const doc3 = {a:11}

        let filter = createMangoFilter(gtefilter);
        expect(filter(doc3)).toBeTruthy();
        expect(filter(doc2)).toBeTruthy();
        expect(filter(doc1)).toBeFalsy();
    })
    test('$ne',() => {

        const nefilter = {
            a:{'$ne':10},
        }
        const doc1 = {a:9}
        const doc2 = {a:10}
        const doc3 = {a:11}

        let filter = createMangoFilter(nefilter);
        expect(filter(doc3)).toBeTruthy();
        expect(filter(doc2)).toBeFalsy();
        expect(filter(doc1)).toBeTruthy();
    })

    test('$exists',() => {

        const existsfilter = {
            a:{'$exists':false},
        }
        const doc1 = {b:9}
        const doc2 = {a:10}
        const doc3 = {b:11}

        let filter = createMangoFilter(existsfilter);
        expect(filter(doc3)).toBeTruthy();
        expect(filter(doc2)).toBeFalsy();
        expect(filter(doc1)).toBeTruthy();
    })

    test('branch $exists',() => {

        const existsfilter = {
            'a.b':{'$exists':true},
        }
        const doc1 = {a:{b:'foo'}}
        const doc2 = {a:{a:'bar'}}
        const doc3 = {b:{b:'baz'}}

        let filter = createMangoFilter(existsfilter);
        expect(filter(doc1)).toBeTruthy();
        expect(filter(doc2)).toBeFalsy();
        expect(filter(doc3)).toBeFalsy();
        
       
    })

    test('$type',() => {

        const typefilter = {
            a:{'$type':'array'}
        }
        const doc1 = {a:[1,2]}
        const doc2 = {a:{a:'bar'}}
        const doc3 = {b:{b:'baz'}}

        let filter = createMangoFilter(typefilter);
        expect(filter(doc1)).toBeTruthy();
        expect(filter(doc2)).toBeFalsy();
        expect(filter(doc3)).toBeFalsy();
        
       
    })

    test('$in',() => {

        const infilter = {
            a:{'$in':[{a:'foo'},10]}
        }
        const doc1 = {a:10}
        const doc2 = {a:{a:'foo'}}
        const doc3 = {b:{b:'baz'}}

        let filter = createMangoFilter(infilter);
        expect(filter(doc1)).toBeTruthy();
        expect(filter(doc2)).toBeTruthy();
        expect(filter(doc3)).toBeFalsy();
        
       
    })
    test('$nin',() => {

        const ninfilter = {
            a:{'$nin':[{a:'foo'},10]}
        }
        const doc1 = {b:10}
        const doc2 = {a:{a:'foo'}}
        const doc3 = {a:{b:'baz'}}

        let filter = createMangoFilter(ninfilter);
        expect(filter(doc1)).toBeTruthy();
        expect(filter(doc2)).toBeFalsy();
        expect(filter(doc3)).toBeTruthy();
    })
    test('$size',() => {

        const sizefilter = {
            a:{'$size':2}
        }
        const doc1 = {b:[1,2]}
        const doc2 = {a:[1,2,3]}
        const doc3 = {a:[1,2]}

        let filter = createMangoFilter(sizefilter);
        expect(filter(doc1)).toBeFalsy();
        expect(filter(doc2)).toBeFalsy();
        expect(filter(doc3)).toBeTruthy();
    })

    test('$mod',() => {

        const modfilter = {
            a:{'$mod':[3,1]}
        }
        const doc1 = {a:10}
        const doc2 = {a:11}
        const doc3 = {a:12}

        let filter = createMangoFilter(modfilter);
        expect(filter(doc1)).toBeTruthy();
        expect(filter(doc2)).toBeFalsy();
        expect(filter(doc3)).toBeFalsy();
    })

    test('$or',() => {

        const orfilter = {
            '$or':[
                {a:10},
                {b:12}
            ]
        }
        const doc1 = {a:10}
        const doc2 = {a:11}
        const doc3 = {b:12}

        let filter = createMangoFilter(orfilter);
        expect(filter(doc1)).toBeTruthy();
        expect(filter(doc2)).toBeFalsy();
        expect(filter(doc3)).toBeTruthy();
    })
    test('$not',() => {

        const orfilter = {
            '$not':{
                a:11
            }
        }
        const doc1 = {a:10}
        const doc2 = {a:11}
        const doc3 = {a:12}

        let filter = createMangoFilter(orfilter);
        expect(filter(doc1)).toBeTruthy();
        expect(filter(doc2)).toBeFalsy();
        expect(filter(doc3)).toBeTruthy();
    })

    test('$all',() => {

        const allfilter = {
            a:{
                "$all":[{a:10},10,"a"]
            }
        }
        const doc1 = {a:[10,{a:10},"a","s"]}
        const doc2 = {a:[20,{a:10},"a","s",{b:23},10]}
        const doc3 = {a:[10,{a:10},"b","s"]}

        let filter = createMangoFilter(allfilter);
        expect(filter(doc1)).toBeTruthy();
        expect(filter(doc2)).toBeTruthy();
        expect(filter(doc3)).toBeFalsy();
    })

    test('$elemMatch',() => {

        const elemMatchfilter = {
            a:{
                "$elemMatch":{
                    "$type":"number",
                    "$gt":15
                }
            }
        }
        const doc1 = {a:[10,{a:10},"a","s"]}
        const doc2 = {a:[20,{a:10},"a","s",{b:23},10]}
        const doc3 = {a:[10,{a:10},"b","s"]}

        let filter = createMangoFilter(elemMatchfilter);
        expect(filter(doc1)).toBeFalsy();
        expect(filter(doc2)).toBeTruthy();
        expect(filter(doc3)).toBeFalsy();
    })

    test('$allMatch',() => {

        const allMatchfilter = {
            a:{
                "$allMatch":{
                    "$type":"number",
                    "$lt":30,
                    "$gt":15
                }
            }
        }
        const doc1 = {a:[16,20,24,"s"]}
        const doc2 = {a:[20,50,19,18,29,19]}
        const doc3 = {a:[16,17,18,19]}

        let filter = createMangoFilter(allMatchfilter);
        expect(filter(doc1)).toBeFalsy();
        expect(filter(doc2)).toBeFalsy();
        expect(filter(doc3)).toBeTruthy();
    })

    test('$keyMapMatch',() => {

        const keyMapMatchfilter = {
            a:{
                "$keyMapMatch":{
                    "$type":"number",
                    "$lt":30,
                    "$gt":15
                }
            }
        }
        const doc1 = {a:{a:10,b:40,c:80}};
        const doc2 = {a:{a:10,b:20,c:"a"}}
        const doc3 = {a:[16,17,18,19]}

        let filter = createMangoFilter(keyMapMatchfilter);
        expect(filter(doc1)).toBeFalsy();
        expect(filter(doc2)).toBeTruthy();
        expect(filter(doc3)).toBeFalsy();
    })

})
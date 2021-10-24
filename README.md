# couchdb-designer

With this package you can easily manage and [testing](#Testing) your couchdb design documents and Mango indexes by storing them in directory structure and by create javascript object or testing context from them. Chouchdb-designer provide two functions for ddoc generation: The first `designer` wait for a path of root directory of multiple design documents and Magno indexes and gives back the array of design document objects. The second `createDesignDocument` do the same but only with one javascript design document. Another feature is the `createTestContext`  and `createTestServer` which allows you to testing your design document with jest testing framework.

### Contents:
 - [Generating javascript design documents](#Generating_javascript_design_documents)
 - [Generating Mango indexes](#Generating_Mango_indexes)
 - [Generating exapmles](#Generating_exapmles);
 - [Testing](#Testing)
 - [Map/reduce testing](#Map_reduce)
 - [Update testing](#Update_testing)
 - [Changes and Filters](#Changes_and_Filters)
 - [Mango indexes and queries](#Mango_indexes_and_queries)
 - [Automatic request supplementing](#Automatic_request_supplementing)
 - [All context function parameters](#All_context_function_parameters)
 - [Examples](#Examples)



>#### Warnings
>The design document generation doesn't check if the directory structure matching to the rules of couchdb design document syntax, although able to generate any type of them without attachmented. For proper use you need to know this rules. By [testing](#Testing) you can discover many case of different missable usage.

### Generating_javascript_design_documents ###

It is work the way. if a directory then becomes to object type field and a file becomes to string or object field depend on rules belove:
1. If the file is json file then becomes field contain the json file content. (you can use this to specify ddoc options.)
2. If the file not json or js file then becomes to String field. (you can use this to specify a built-in reducer for a view.)
3. If the file is shape name.lib.js, then becomes String field named as the filename name part and containing the js file content and becomes to available as a common js library in testing case.
4. If the file is a js file contain a function or functions for example view map function and reduce function then additional rules apply.
     - These functions must be named. (This is a benefit because the syntax check doesn't indicated as wrong.)
     - The functions must be exported with `module.exports = { functionName, otherFunction }`
     - If the file contain only one function with the same name as file itself then becomes to String field containing the proper function implementation. Otherwise if it contain more then one function or different named function then becomes to object type field with the proper content.
     - You can export constans as well for example a `reduce` constat for a `view` to use built-in coucdb reducer.

>By the feature: js file contain only one function with the same name as file itself then becomes to String field. You can create more sophisticated structure. For example if you have several update functions writen in a single `updates.js` file you can even create an `updates` directory with additional files followed rules of same name function. This way the result will be an updates object containing the updates.js and the updates directory content.


#### Example directory structure for a javascript design document

```bash

design
└── appdesign
    ├── lib
    │   └── couchdb.lib.js
    ├── options.json
    ├── updates
    │   └── updateFomDir.js
    ├── updates.js
    ├── validate_doc_update.js
    └── views
        ├── byDate
        │   ├── map.js
        │   └── reduce.js
        ├── byName
        │   └── map.js
        └── byParent.js


```
#### Exapmle files:

view by file:
//ddocName/views/viewname.js
```javascript

function map (doc){
    emit(doc.name,1);
}

function reduce (keys,values,rereduce){
    if(rereduce){
        return sum(values);
    }else{
        return values.length;
    }
}
// or
const reduce = "_count";

module.exports = { map, reduce }

```
view by directory:
ddocName/views/viewname/map.js
```javascript

function map (doc){
    emit(doc.name,1);
}

module.exports = { map }

```
ddocName/views/viewname/reduce.js
```javascript

function reduce (keys,values,rereduce){
    if(rereduce){
        return sum(values);
    }else{
        return values.length;
    }
}
module.exports = { reduce }

```

Common js library:
designName/path/tolib.lib.js (view map function can only require library under path views/libname )
```javascript

function libfunc1 (){
    ...
}
function libfunc2 (){
    ...
}
module.exports = { libfunc1, libfunc2 }

```

>To generate a javascript design document its structure always must be specifyed in a directory, but you can generating design documents for Mango indexes by specify them in a single json file. This feature only available by `designer`, the `createDesignDocument` able generate only javascript type ddoc.

### Generating_Mango_indexes ###

The mango indexes storing too is in design documents but its laguage field is `query`. You can generate indexes by specify them in a json file with the rules below:
 1. The json file name will becomes to ddoc name. (you can generate multiple index ddocs with multiple json.)
 2. The given content's `partitioned` boolean field specify if the generated ddoc's indexes is partotioned or not. 
 3. Every further field in json will becomes an index by its name and by its value what follow the rules of couchdb index endpoint's index field.

 #### Example json for Mango indexes:

 ```json
 design/mangoddoc.json
{
    "partitioned":true,
    "parent-index":{
        "partial_filter_selector": {
            "type":{"$ne":"orphan"}
        },
        "fields": [
           "parent"
        ]
    } 
}
 ```


### Generating_exapmles ###

Create multiple design documents from root directory of them. 

```javascript

import {designer,createDesignDocument} from '@zargu/couchdb-designer';

designer('./design').then(documents => {
    /* documents here [
        {_id:"_design/appdesign",language:"javascript",lib:{couchdb:{...}} ...},
        {_id:"_design/mangoddoc",language:"query",views:{"parent-index":{...}}...}
    ]*/
},err => console.log(err));

```

Create single design document.

```javascript

createDesignDocument('./design/appdesign').then(document => {
    // documents here: {_id:"_design/appdesign",language:"javascript",lib:{couchdb:{...}} ...}
},err => console.log(err));

```
>You can only generate javascript ddocs with this function!

### Testing ###

With `createTestContext` you can create a `context` represented by directory by the same way like at `createDesignDocument` but you can here declare a testDatabase, userCtx, secObj in parameters. This context object has the same structure as design ducument has but with invokeable functions. These functions in the context object have the near same environment as in a real couchdb. Some of these functions by them nature return result which you can use testing with jest easily. But what if you want to test something like a view's map function which doesn't return the result directly, only call the couchdb built-in `emit` and maybe `log` functions. In these cases you can call the context as a function with the `emitted` or `logged` string parameter for get the indirect result of previously called functions. After calling the previously gathered data will be deleted but among two calling of them gathering every indirect data. The rest built-in couchdb functions is mockFunctions and available in the same way by calling the context as a function and give their name as a string parameter, for example `context("registerType")` will give you the given built-in mockFunction. When calling the available functions under the context object, they will verify their own implementation then throws error if something wrong happen, for example when calling irrelevant built in function inside your ddoc function.

```javascript
    createTestContext(directory,testDatabase[,userCtx, secObj])
```
 - `directory`        : The root directory of the design document directory structure.
 - `testDatabase`     : An object representing the test database.
    - `name`          : The name of the test database.
    - `data`          : An array of objects representing th test database's data.
    - `partitioned`   : Optional boolean value to indicate if database is partitioned. 
 - `userCtx`          : Default userCtx object if not declared the userCtx will be:
```javascript
    {db:'testdatabase',name:null,roles:["_admin"]}
```

 - `secObj`           : Default security object if not declared will be:
 ```javascript
    {members:{roles:["_admin"]},admins:{roles:["_admin"]}}
```


Another available function is `createTestServer` which you can use to test multiple ddocs by create a context acting like a real couchdb. It is work the same way like createTestContext but you have to supplement of path the given ddoc name to call functions. The benifit of use this capability is that when you test updateFunctions then the result is depend on all ddocs validate_doc_update and you can testing your mango indexes by calling them map function or run a mango query by `find` endpoint.


```javascript
    createTestServer(directory,testDatabase[,userCtx, secObj])
```
 - `directory`    : The directory which containing the design document directory structures.


### Map_reduce ###

An other but much better way of view testing instead of **emitted** is the calling the context with **server** or **_design** parameter which give back an object what you can use as emulator of couchdb. For example **context("server").view.viewname()** insted of **context.views.viewname.map()**. For this opportunity you have to set the **testDatabase** with the createTestContext second parameter. With server object you can testing the given view in context of **map/reduce,grouping** and the previously setted testDatabase. The server object's functions result the same as if you get by the given function's result from a real couchdb.It is waiting for an optional object parameter with **reduce** (boolean), **group** (boolean), **group_level** (integer) field with same meaning like the couchdb's viewFunction query parameters.  These functions return the correct result even if you set one of built-in couchdb reducers instead of self implemented. Additionally if the test database is partitioned, and the design document as well wich containing the given view, you must pass the partition name as second parameter.


### Update_testing ###

Similar to map/reduce testing you can test updateFunctions for example:
```javascript
    context("_design").update.updateName(request[,doc_id]);
    // or 
    server("_design").ddocname.update.updateName(request[,doc_id]);
```
 - **request**      : The request object. whitch will be supplement by previously given or default userCtx, secObj an other fields. if you specify userCtx in this then that won't be overwritten with the default.
 - **doc_id**       : Optional document id. If it is an existed id in testDatabase then the invocation will get the given doc Otherwise it only will be appear in supplemented request.id.

The result will be the original updateFunction result's second element depending on the updated testDatabase or an error message from validate_doc_update or another error if your functions do something dirty. You can verify the updated testDatabase by calling context as function with **database** string or can get a particular document by specify them id in second parameter. Note that if it is the only way to make impact of testDatabases and _changes state. Any other direct calling of your functions will non impact.

### Changes_and_Filters ###

Both of in context function you can pass the **_changes** string parameter for get the changes of testdatabase. If you pass a second parameter then its must be an "object" with the field "**filter**" contain the path of your filterFunction and an optional field **request** which will be give to your filterFunction at its invocation. This request object will be supplemented similar as at updateFunction's.

for example: /database/_changes?filter=ddocname/filtername
```javascript
    context('_changes',{filter:'ddocname/filtername'})
```

### Mango_indexes_and_queries ###

The Mango indexes in a couchdb database is working the same way like views. For tesing them you have to define them by json file as describe in [earlyer](#Generating_Mango_indexes) and you have to create the test context with `createTestServer` function. ( The createTestContext dosen't support Mango indexes and find endpoint ) The index themself you can testing by calling its map function as if it is a view, or you can use the map/reduce testing the same way like views. ( remember the reducer of the mango indexes is the built in _count reducer which you can disable by view parameter ) Additionally you can testing mango queries with `find` endpoint. The result will be depend on the defined indexes and on test database and on the given partition name. In a query you can give the `selector`,`sort`,`fields`,`use_index` fields and get the waited results or errors if the query or indexes was defined wrong. You can specify the partition name in find function second parameter.

```javascript
    createTestServer('./design',testDatabase).then(context => {
            // calling index map function.
            expect(context.mangoddoc.views.indexName.map(doc)).toEqual({_id:...});
            // 
            expect(context('_design').mangoddoc.view.indexName({reduce:false},'partition')).toEqual({_id:...});
            // run a mango query.
            expect(server('server').find({
                selector:{
                    parent:{
                        "$gt":"aoger"
                    }
                },
                sort:['parent'],
                fields:['parent','type'],
                use_index:['mangoddoc','parent-index']
            },
            'partition'
            )).toEqual({docs:{parent:"..."...}});
    })
```


### Automatic_request_supplementing ###

The supplementing of request object not only even valid the case of particular context functions like "_changes -> filter" or "_design -> update" testing but in case of direct calling of "**update,show,list,filter**" functions. The content of supplemented request object depend on "testDatabase,userCtx,secObj" parameters. By specify the request's "**headers,body,form,query,cookie,method,peer,uuid,userCtx**" fields you can overwrite the default values.

Deafult request object:
```javascript
const request = {
    body: "undefined",
    cookie: {},
    form: {},
    headers: {
        Accept: "*/*",
        Host: "localhost:5984",
        "User-Agent": "couchdb-designer/testing environment"
    },
    id: null, //The case of direct calling of functions on context object is always null. Otherwise the processed doc id.
    info: {
        db_name: "testdatabase",
        doc_count: 0,  // depend on testDatabase.
        doc_del_count: 0,
        update_seq: 0, // depend on testDatabase and updates.
        purge_seq: 0,
        compact_running: false,
        sizes: {
          active: 0,
          disk: 0,
          external: 0
        },
        instance_start_time: "1347601025628957",
        disk_format_version: 6,
        committed_update_seq: 0, // same as update_seq
    },
    method: "POST",
    path: [], // depend on called function
    peer: "127.0.0.1",
    query: {},
    raw_path: "",
    requested_path: [],
    secObj: {}, // default or given seCobj
    userCtx: {}, // default or given or overwrited userCtx
    uuid: "3184f9d1ea934e1f81a24c71bde5c168" // generated by Date.now() or pre specifyed by you.
}
```


### All_context_function_parameters ###

- `server`:                  It is Gives an object with you can test `views`,`updates`,`allDocs` and `find` the context of environment
    - `view.viewName`:       map/reduce testing.
        - `optoins`:         object to define view parameters.
            - `reduce`:        boolean field to define the view useing reduce or not.
            - `group`:         boolean field to define the reduce is grouped or not.
            - `group_level`:   integer field to define the level of grouping.
        - `partition`        Partition name for partitioned view.  
    - `update.updateName`:   "updates" with "validators" even multiple design documents by "createTestSetrver". Impact to testdatabase and _changes.
    - `allDocs`:             _all_docs endpoint.
        - `partition`:       The name of partition in a partitioned test database.
    - `find`:                _find endpoint.
        - `query`            A simplifyed mango query with supporting the significant fields in point of testing.
            - `selector`:    Selector.(The $regex selector is unsupported yet it will be supported in  the future by plugin.)
            - `sort`:        Array in sort-sintax.
            - `fields`:      Array of needed fields of result.
            - `use_index`:   The used index ( String or Array of strings)
        - `partition`:       The name of partition in a partitioned query.
- `_design`:                 Alias of "server".
- `emitted`:                 Collection of Result of map functions when its was called directly on context object.
- `logged` :                 Collection of built-in log invocations result.
- `database`,`document_id`:  The testDatabase current state, or the given document by document_id given.
- `_changes`,`filter`:     The current changes or the filtered changes by filter given.
    - `filter`:              The optional filter parameter. If it is given it's must have a `filter` field.
        - `filter`:              The required filter path "ddocName/filtername",
        - `request`:             The pre specifyed request object.
- `send`:                    mockFunction of built-in send.
- `getRow`:                  mockFunction of built-in getRow.
- `provides`:                mockFunction of built-in provides.
- `registerType`:            mockFunction of built-in registerType.
- `start`:                   mockFunction of built-in start.
- `index`:                   mockFunction of built-in index.



### Examples ###
```javascript

import { createTestContext,createTestServer } from '@zargu/couchdb-designer';

const testDatabase = [
    {_id:'doc1'...},
    {_id:'doc2'...}
    ...
]

describe('couchdb',() => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('appdesign',() => {
        return createTestContext('./design/appdesign',testDatabase).then(context => {

            // simple testing
            let somedocument = {_id:'some',mail:'foo@bar.com'};
            expect(context.views.byMail.map(somedocument)).toBeUndefined(); //have only indirect result in proper case.
            expect(context.views.byMail.map.mock.calls.length).toBe(1) // sure! byMail.map itself a mockFunction as well.
            expect(context.views.lib.someLibfunction.mock.calls.length).toBe(1); // byMail.map may invoke someLibfunction by require built-in.
            expect(context('emitted').rows).toEqual([{id:'some',key:'foo@bar.com',value:1}]);
            expect(context('logged')).toMatchSnapshot(); // logResult return multiline String of expected couchdb log.
            // The next assertion is useless here because calling map function will throw an exception if it's try to call registerType.
            expect(context('registerType')).not.toHaveBeenCalled(); // built-in mockFunction

            // Map/reduce view testing
            expect(context('server').view.byPeriod({group_level:1},'partitionName')).toEqual({rows:[{key:[2021],value:234}]}) // the result depend on map,reduce,testDatabase


        });
    });

    test('all design and mango indexes',() => {
        return createTestServer('./design').then(server => {
            let validCtx = {...};
            let invalidCtx = {...};
            //update testing
            expect(server('_design').appdesign.update.updateName({userCtx:validCtx},'doc1')).toBe("doc1 updated succesfully");

            expect(server('_design').appdesign.update.updateName({userCtx:invalidCtx},'doc1')).toEqual({error:'forbidden',reason:"Guru meditation error!"});
            //verify database
            expect(server('database')[0]).toEqual({_id:'doc1',... });
            expect(server('database','doc1')).toEqual({_id:'doc1',... });
            //changes and filter
            expect(server("_changes")).toMatchSnapshot();
            expect(server("_changes",{filter:'appdesign/mailbox',request:{query:{type:'spam'}}}).results.length).toBe(2);

            //mango indexes
            // you can call the index map function or map/reduce the same way as at the javascript ddocs.
            expect(server.mangoddoc.views['parent-index'].map(doc)).toEqual({_id:...});
            expect(server('_design').mangoddoc.view['parent-index'] ({reduce:false},'partition')).toEqual({_id:...});
            // run a mango query.
            expect(server('server').find({
                selector:{
                    parent:{
                        "$gt":"aoger"
                    }
                },
                sort:['parent'],
                fields:['parent','type'],
                use_index:['mangoddoc','parent-index']
            },
            'partition'
            )).toEqual({docs:{parent:"..."...}});
        });
    });
});

```

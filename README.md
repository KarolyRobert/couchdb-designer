# couchdb-designer

### Release notes:
The new feature is that supporting partitioned test Database. From last release you need to specify test Database as an object as i show you here.
```javascript
    const testDatabase = {
        name:'DBname',
        data:[{_id:'users:1254252'...},...],
        partitioned:true
    }
```
You can testing partitioned [map/reduce](#Map/reduce) by give the partition name in second parameter.

With this package you can easily manage and [testing](#Testing) your couchdb design documents by storing them in directory structure and by create javascript object or testing context from them. Chouchdb-designer provide two functions for that purpose: The first **"designer"** wait for a path of root directory of multiple design documents and gives back the array of design document objects. The second **"createDesignDocument"** do the same but only with one design document. Another feature is the **"createTestContext"**  and **createTestServer** which allows you to testing your design document with jest testing framework.

>#### Warnings
>The design document generation doesn't check if the directory structure matching to the rules of couchdb design document syntax, although able to generate any type of them without attachmented. For proper use you need to know this rules. By testing you can discover many case of different missable usage.

### generating design documents

It is work the way. if a directory then becomes to object type field and a file becomes to string or object field depend on rules belove:
1. If the file is json file then becomes field contain the json file content.
2. If the file not json or js file then becomes to String field.
3. If the file is in shape name.lib.js then becomes to String field named as the filename name part and containing the js file content and becomes to available as a common js library in testing case.
4. If the file is a js file contain a function or functions for example view map function and reduce function then additional rules apply.
     - These functions must be named. (This is a benefit because the syntax check doesn't indicated as wrong.)
     - The functions must be exported with **module.exports = { functionName, otherFunction }**
     - If the file contain only one function with the same name as file itself then becomes to String field containing the proper function implementation. Otherwise if it contain more then one function or different named function then becomes to object type field with the proper content.
     - You can export constans as well for example a **reduce** constat for a "view" to use built-in coucdb reducer.

>By the feature: js file contain only one function with the same name as file itself then becomes to String field. You can create more sophisticated structure. For example if you have several update functions writen in a single **updates.js** file you can even create an **updates** directory with additional files followed rules of same name function. This way the result will be an updates object containing the updates.js and the updates directory content.


##### Example directory structure for two design documents:

```bash

design
├── appdesign
│   ├── lib
│   │   └── couchdb.lib.js
│   ├── options.json
│   ├── updates
│   │   └── updateFomDir.js
│   ├── updates.js
│   ├── validate_doc_update.js
│   └── views
│       ├── byDate
│       │   ├── map.js
│       │   └── reduce.js
│       ├── byName
│       │   └── map.js
│       └── byParent.js
└── querys
    ├── language.txt
    └── views
        ├── bar-index.json
        └── foo-index
            ├── map.json
            ├── options.json
            └── reduce.txt

```
##### Exapmle files:

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

Create multiple design documents from root directory of them.

```javascript

import {designer,createDesignDocument} from '@zargu/couchdb-designer';

designer('./design').then(documents => {
    /* documents here [
        {_id:'_design/appdesign',lib:{couchdb:{...}} ...},
        {_id:'_design/querys',views:{"bar-index":{...}}...}
    ]*/
},err => console.log(err));

```

Create single design document.

```javascript

createDesignDocument('./design/appdesign').then(document => {
    // documents here: {_id:'_design/appdesign',lib:{couchdb:{...}} ...}
},err => console.log(err));

```

### Testing ###

With **createTestContext** you can create a **context** represented by directory by the same way like at **createDesignDocument** but you can here declare a testDatabase, userCtx, secObj in parameters. This context object has the same structure as design ducument has but with invokeable functions. These functions in the context object have the near same environment as in a real couchdb. Some of these functions by them nature return result which you can use testing with jest easily. But what if you want to test something like a view's map function which doesn't return the result directly, only call the couchdb built-in **emit** and maybe **log** functions. In these cases you can call the context as a function with the **"emitted"** or **"logged"** string parameter for get the indirect result of previously called functions. After calling the previously gathered data will be deleted but among two calling of them gathering every indirect data. The rest built-in couchdb functions is mockFunctions and available in the same way by calling the context as a function and give their name as a string parameter, for example **context("registerType")** will give you the given built-in mockFunction. When calling the available functions under the context object, they will verify their own implementation then throws error if something wrong happen, for example when calling irrelevant built in function inside your ddoc function.

```javascript
    createTestContext(directory,testDatabase[,userCtx, secObj])
```
 - **directory**        : The root directory of the design document directory structure.
 - **testDatabase**     : An object representing the test database.
    - **name**          : The name of the test database.
    - **data**          : An array of objects representing th test database's data.
    - **partitioned**   : Optional boolean value to indicate if database is partitioned. 
 - **userCtx**          : Default userCtx object if not declared the userCtx will be:
```javascript
    {db:'testdatabase',name:null,roles:["_admin"]}
```

 - **secObj**           : Default security object if not declared will be:
 ```javascript
    {members:{roles:["_admin"]},admins:{roles:["_admin"]}}
```


Another available function is **createTestServer** which you can use to test multiple ddocs by create a context acting like a real couchdb. It is work the same way like createTestContext but you have to supplement of path the given ddoc name to call functions. The benifit of use this capability is that when you test updateFunctions then the result is depend on all ddocs validate_doc_update.


```javascript
    createTestServer(directory,testDatabase[,userCtx, secObj])
```
 - **directory**    : The directory which containing the design document directory structures.


### Map/reduce ###

An other but much better way of view testing instead of **emitted** is the calling the context with **server** or **_design** parameter which give back an object what you can use as emulator of couchdb. For example **context("server").view.viewname()** insted of **context.views.viewname.map()**. For this opportunity you have to set the **testDatabase** with the createTestContext second parameter. With server object you can testing the given view in context of **map/reduce,grouping** and the previously setted testDatabase. The server object's functions result the same as if you get by the given function's result from a real couchdb.It is waiting for an optional object parameter with **reduce** (boolean), **group** (boolean), **group_level** (integer) field with same meaning like the couchdb's viewFunction query parameters.  These functions return the correct result even if you set one of built-in couchdb reducers instead of self implemented. Additionally if the test database is partitioned, and the design document as well wich containing the given view, you must pass the partition name as second parameter.


#### Update testing.

Similar to map/reduce testing you can test updateFunctions for example:
```javascript
    context("_design").update.updateName(request[,doc_id]);
    // or 
    server("_design").ddocname.update.updateName(request[,doc_id]);
```
 - **request**      : The request object. whitch will be supplement by previously given or default userCtx, secObj an other fields. if you specify userCtx in this then that won't be overwritten with the default.
 - **doc_id**       : Optional document id. If it is an existed id in testDatabase then the invocation will get the given doc Otherwise it only will be appear in supplemented request.id.

The result will be the original updateFunction result's second element depending on the updated testDatabase or an error message from validate_doc_update or another error if your functions do something dirty. You can verify the updated testDatabase by calling context as function with **database** string or can get a particular document by specify them id in second parameter. Note that if it is the only way to make impact of testDatabases and _changes state. Any other direct calling of your functions will non impact.

#### Changes and Filters.

Both of in context function you can pass the **_changes** string parameter for get the changes of testdatabase. If you pass a second parameter then its must be an "object" with the field "**filter**" contain the path of your filterFunction and an optional field **request** which will be give to your filterFunction at its invocation. This request object will be supplemented similar as at updateFunction's.

for example: /database/_changes?filter=ddocname/filtername
```javascript
    context('_changes',{filter:'ddocname/filtername'})
```

#### Automatic "request" supplementing.

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


#### All context function's parameters:

- **server**:                  It is Gives an object with you can test "**views**" and "**updates**" the context of environment
    - **view.viewName**:       map/reduce testing.
        - **{reduce:boolean,group:boolean,group_level:integer}** Available map/reduce parameter fields.
        - **partition**        Partition name for partitioned view.  
    - **update.updateName**:   "updates" with "validators" even multiple design documents by "createTestSetrver". Impact to testdatabase and _changes.
- **_design**:                 Alias of "server".
- **emitted**:                 Collection of Result of map functions when its was called directly on context object.
- **logged** :                 Collection of built-in log invocations result.
- **database**,**document_id**:The testDatabase current state, or the given document by document_id given.
- **_changes**,**filter**:     The current changes or the filtered changes by filter given.
    - **filter**:              The optional filter parameter. If it is given it's must have a **filter** field.
        - **filter**:              The required filter path "ddocName/filtername",
        - **request**:             The pre specifyed request object.
- **send**:                    mockFunction of built-in send.
- **getRow**:                  mockFunction of built-in getRow.
- **provides**:                mockFunction of built-in provides.
- **registerType**:            mockFunction of built-in registerType.
- **start**:                   mockFunction of built-in start.
- **index**:                   mockFunction of built-in index.



### Examples:
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

    test('all_ddoc',() => {
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
        });
    });
});

```

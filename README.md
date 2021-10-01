# couchdb-designer

With this package you can easily manage your couchdb design documents by storing them in directory structure and create javascript object from them. Chouchdb-designer provide two functions for that purpose: The first **"designer"** wait for a path of root directory of multiple design documents and gives back the array of design document objects. The second **"createDesignDocument"** do the same but only with one design document. Another feature is the **"createTestContext"**  and **createTestServer** which allows you to [testing](#Testing) your design document with jest testing framework.

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

```javascript
//ddocName/views/viewname.js

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

module.exports = { map, reduce}

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
    createTestContext(directory,testDatabase\[,userCtx, secObj\])
```
 - **directory**    : The root directory of the design document directory structure.
 - **testDatabase** : An array of objects representing the test database.
 - **userCtx**      : Default userCtx object if not declared the userCtx will be:
                        {db:'testdatabase',name:null,roles:\["_admin"\]}

 - **secObj**       : Default security object if not declared will be:
                        {members:{roles:\["_admin"\]},admins:{roles:\["_admin"\]}}



A new feature of current version is **createTestServer** which you can use to test multiple ddocs by create a context acting like a real couchdb. It is work the same way like createTestContext but you have to call with path the given ddoc name your functions. The benifit of use this capability is that when you test updateFunctions then the result is depend on all ddocs validate_doc_update.

```javascript
    createTestServer(directory,testDatabase\[,userCtx, secObj\])
```
 - **directory**    : The directory which containing the design document directory structures.


#### Map/reduce testing.

An other but much better way of view testing instead of **emitted** is the calling the context with **server** or **_design** parameter which give back an object what you can use as emulator of couchdb. For example **context("server").view.viewname()** insted of **context.views.viewname.map()**. For this opportunity you have to set the **testDatabase** with the createTestContext second parameter.The testDatabase is an array of objects. With server object you can testing the given view in context of **map/reduce,grouping** and the previously setted testDatabase. The server object's functions result the same as if you get by the given function's result from a real couchdb.It is waiting for an optional object parameter with **reduce** (boolean), **group** (boolean), **group_level** (integer) field with same meaning like the couchdb's viewFunction query parameters. These functions return the correct result even if you set one of built-in couchdb reducers instead of self implemented.


#### Update testing.

Similar to map/reduce testing you can test updateFunctions for example:
```javascript
    context("_design").update.updateName(request[,doc_id]);
    // or 
    server("_design").ddocname.update.updateName(request[,doc_id]);
```
 - **request**      : The request object. whitch will be supplement by previously given or default userCtx, secObj an other fields. if you specify userCtx in this then that won't be overwritten with the default.
 - **doc_id**       : Optional document id. If it is an existed id in testDatabase then the invocation will get the given doc.

The result will be the original updateFunction result's second element depending on the updated testDatabase or an error message from validate_doc_update or another error if your functions do something dirty. You can verify the updated testDatabase by calling context as function with **database** string or can get a particular document by specify them id in second parameter.


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
        return createTestContext('./design/adddesign',testDatabase).then(context => {

            // simple testing
            let somedocument = {_id:'some',mail:'foo@bar.com'};
            expect(context.views.byMail.map(somedocument)).toBeUndefined(); //have only indirect result in proper case.
            expect(context.views.byMail.map.mock.calls.length).toBe(1) // sure! byMail.map itself a mockFunction as well.
            expect(context.views.lib.someLibfunction.mock.calls.length).toBe(1); // byMail.map may invoke someLibfunction by require built-in.
            expect(context('emitted').rows).toEqual([{id:'some',key:'foo@bar.com',value:1}]);
            expect(context('logged')).toMatchSnapshot(); // logResult return multiline String of expected couchdb log.
            expect(context('registerType')).not.toHaveBeenCalled(); // built-in mockFunction

            // Map/reduce view testing
            expect(context('server').view.byPeriod({group_level:1})).toEqual({rows:[{key:[2021],value:234}]}) // the result depend on map,reduce,testDatabase

        }).catch(err => expect(err).toBe('something wrong in directory structure'));
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
        })
    });
});

```

>#### Release note:
>I hope all work properly, if you need something or have an idea please tell me.

I hope i don't causing too much torment with my english. 
# couchdb-designer

With this package you can easily manage your couchdb design documents by storing them in directory structure and create javascript object from them. Chouchdb-designer provide two functions for that purpose: The first "designer" wait for a path of root directory of multiple design documents and gives back the array of design document objects. The second "createDesignDocument" do the same but only with one design document. Another feature is the "createTestContext" which allows you to testing your design document with jest testing framework.

>### Warnings
>The design document generation doesn't check if the directory structure matching to the rules of couchdb design document syntax, although able to generate almost any of type of them. For proper use you need to know this rules. 

It is work the way. if a directory then becomes to object type field and a file becomes to string or object field depend on rules belove:
1. If the file is json file then becomes field contain the json file content.
2. If the file not json or js file then becomes to String field.
3. If the file is js file like **name.lib.js** then becomes to String field by the name containing the js file content.
4. If the file is a js file contain a function or functions for example view map function and reduce function then additional rules apply.
     - These functions must be named. (This is a benefit because the syntax check doesn't indicated as wrong.)
     - The functions must be exported with **module.exports = { functionName, otherFunction }**
     - If the file contain only one function with the same name as file itself then becomes to String field containing the proper function implementation. Otherwise if it contain more then one function or different named function then becomes to object type field with the proper content.

>By the feature: js file contain only one function with the same name as file itself then becomes to String field. You can create more sophisticated structure. For example if you have several updates function writen in a single **updates.js** file you can even create an **updates** directory with additional files followed rules of same name function. This way the result will be an updates object containing the updates.js and the updates directory content.

Example directory structure for two design documents:

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

### Create design documents:

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

### Testing:

With **createTestContext** you can create a **context** represented by directory by the same way like at **createDesignDocument**. This context object has the same structure as design ducument has but with invokeable functions. These functions in the context object have the near same environment as in a real couchdb. Some of these functions by them nature return result which you can use testing with jest easily. But what if you want to test something like a view's map function which doesn't return the result directly, only call the couchdb built-in **emit** and maybe **log** functions. In these cases you can call the context as a function with the **"emitted"** or **"logged"** string parameter for get the indirect result of previously called functions. After calling the previously gathered data will be deleted but among two calling of them gathering every indirect data.

#### map/reduce testing.

An other but much better way of view testing instead of **emitted** is the calling the given named view function directly under the context.views. For example **context.views.viewname()** insted of **context.views.viewname.map()**. Let's call this as **viewNameFunction**! For this opportunity you have to set the **testDatabase** wich is an array of object with the createTestContext second parameter. With viewNameFunctions you can testing the given view in context of **map/reduce,grouping** and the previously setted testDatabase. The viewNameFunction result the same as if you get by the given viewFunction's result from a couchdb and waiting for an optional object parameter with **reduce** (boolean), **group** (boolean), **group_level** (integer) field with same meaning like the couchdb's viewFunction query parameters.

```javascript

import { createTestContext } from '@zargu/couchdb-designer';

describe('couchdb',() => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('appdesign',() => {
        return createTestContext('design/adddesign').then(context => {

            context.views.byMail.map(somedocument);
            expect(context.views.byMail.map.mock.calls.length).toBe(1) // sure! byMail.map itself a mockFunction as well.
            expect(context.views.lib.someLibfunction.mock.calls.length).toBe(1); // byMail.map invoke someLibfunction
            expect(viewResult().rows.length).toBe(1); // not sure! byMail.map maybe invoke builtin emit function more than once.
            expect(logResult()).toMatchSnapshot(); // logResult return multiline String of expected couchdb log.
            
        }).catch(err => expect(err).toBe('something wrong in directory structure'));
    });
});

```

I hope i don't causing too much torment with my english.
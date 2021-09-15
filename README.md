# couchdb-designer

With this package you can easily manage your couchdb design documents by storing them in directory structure and create javascript object from them. Chouchdb-designer provide two functions for that purpose: The first "designer" wait for a path of root directory of multiple design documents and gives back the array of design document objects. The second "createDesignDocument" do the same but only with one design document. 

>### Warnings
>This package doesn't check if the directory structure matching to the rules of couchdb design document syntax, although able to generate any of type of them. For proper use you need to know this rules.

It is work the way. if a directory then becomes to object type field and a file becomes to string or object field depend on rules belove:
- If the file is json file then becomes field contain the json file content.
- If the file is js file like **name.lib.js** then becomes to String field by the name containing the js file content.
- If the file is a js file contain a function or functions for example view map function and reduce function then additional rules apply.
 - These functions must be named. (This is a benefit because the syntax check doesn't indicated as wrong.)
 - The functions must be exported with **module.exports = { functionName, otherFunction }**
 - If the file conatin only one function with the same name as file itself then becomes to String field containing the proper function implementation. Otherwise if it contain more then one function or different named function then becomes to object type field with the proper content.

Example directory structure for two design documents;

```bash

design
├── appdesign
│   ├── lib
│   │   └── couchdb.lib.js
│   │    
│   ├── options.json
│   ├── validate_doc_update.js
│   └── views
│       ├── byDate
│       │   ├── map.js
│       │   └── reducer.js
│       ├── byName
│       │   └── map.js
│       └── pyParent.js
└── querys
    ├── language.txt
    └── views
        ├── bar-index.json
        └── foo-index
            ├── map.json
            ├── options.json
            └── reduce.txt

```

### Examples:

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
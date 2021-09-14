# couchdb-designer

With this package you can easily manage your couchdb design documents by storing them in directory structure and create javascript object from them. Chouchdb-designer provide two functions for that purpose: The first "designer" wait for a path of root directory of multiple design documents and gives back the array of design document objects. The second "createDesignDocument" do the same but only with one design document. 

>### Warnings
>This package doesn't check if the directory structure matching to the rules of couchdb design document syntax, although able to generate any of type of them. For proper use you need to know this rules.

It is work the way. if a directory... becomes to object type field and a file becomes to string field except if it a json file then becomes field contain the json file content.

Example directory structure for two design documents;

```bash

design
├── appdesign
│   ├── lib
│   │   └── couchdb
│   │       └── lib.js
│   ├── options.json
│   ├── validate_doc_update.djs
│   └── views
│       ├── byDate
│       │   ├── map.djs
│       │   └── reducer.djs
│       └── byName
│           └── map.djs
└── querys
    ├── language
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
    /*  document here
    {
        _id: '_design/appdesign',
        language: 'javascript',
        lib: {
        couchdb: {
            lib: 'exports.libfunction = function (){\n'// https://docs.couchdb.org/en/stable/query-server javascript.html?highlight=commonJS%20modules#commonjs-modules\n}'
        }
    },
    options: { partitioned: true },
    validate_doc_update: 'function(newDoc, oldDoc, userCtx, secObj) {\n ... 
    */
},err => console.log(err));
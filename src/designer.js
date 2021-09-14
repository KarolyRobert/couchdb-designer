import fs from 'fs/promises';

import createDesignDocument from './createDeisgnDocument';

export default function designer(root){
    return new Promise((resolve,reject) => {

        fs.readdir(root).then(names => {

            Promise.all(names.map(name => createDesignDocument(root,name)))
                .then(documents => resolve(documents))
                .catch(err => reject(err));
                
        },err => reject(err));

    });
}
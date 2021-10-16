import fs from 'fs/promises';
import createDesignDocument from './createDeisgnDocument';
import createMangoDocument from './createMangoDocument';
import path from 'path';

export default function designer(root){
    return new Promise((resolve,reject) => {

        fs.readdir(root).then(names => {
            
            Promise.all(names.map(name => {
                    if(/.*\.json$/.test(name.toLowerCase())){
                        return createMangoDocument(root, name);
                    }else{
                        return createDesignDocument(path.join(root,name));
                    }
                
            }))
            .then(resolve,reject);
                
        },err => reject(err));

    });
}
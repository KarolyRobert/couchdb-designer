import fs from 'fs/promises';
import createTestContext from './createTestContext';
import { registerContext } from '../build/testing/testEnvironment';
import contextFunction from './util/contextFunction';
import defaults from './testing/defaults';
import {registerDatabase} from './testing/changes/updateDocument';
import crypto from 'crypto';
import path from 'path';

const createTestServer = (directoryName,testDatabase,userCtx = defaults.userCtx,secObj = defaults.secObj) => {
    return new Promise((resolve,reject) => {
        let root = path.join(directoryName);
        let fullPath = path.resolve(process.env.PWD,root);
        let contextId = crypto.createHash('md5').update(fullPath).digest('hex');
       
      
        fs.readdir(root).then(names => {
            Promise.all(names.map(name => createTestContext(path.join(directoryName,name),null,null,null,contextId)))
                .then(designContexts => {

                    let serverContext = contextFunction(contextId);
                  
                    for(let designContext of designContexts){
                        if(designContext){
                            let designName = designContext.id.split('/')[1];
                       
                            serverContext[designName] = designContext;
                           
                        }
                    }
                    registerContext(contextId, serverContext,'server', userCtx, secObj);
                    registerDatabase(contextId,testDatabase,userCtx);
                    resolve(serverContext);
                },err => reject(err));
               
                
        },err => reject(err));

    });
}

export default createTestServer;
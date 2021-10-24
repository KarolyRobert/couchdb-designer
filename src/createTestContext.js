import createSectionFromDirectory from './section/createSectionFromDirectory';
import { registerContext,addValidator } from '../build/testing/testEnvironment';
import {registerDatabase} from './testing/changes/updateDocument';
import createCouchDBFunctions from './testing/createCouchDBFunctions';
import defaults from './testing/defaults';
import contextFunction from './util/contextFunction';
import crypto from 'crypto';
import path from 'path';

export default function createTestContext(directoryName,testDatabase,userCtx = defaults.userCtx,secObj = defaults.secObj,parentContext = false){
    return new Promise((resolve,reject) => {
        let testContext;
        let contextProps;
        let root = path.join(directoryName);
        let name = root.split(path.sep).pop();
        let directory = path.join(root, '..');
        if(parentContext){
            contextProps = {root,name,contextId:parentContext};  
            testContext = {};
        }else{
            let fullPath = path.resolve(process.env.PWD,root);
            let contextId = crypto.createHash('md5').update(fullPath).digest('hex');
         
            contextProps = {root,contextId}
            testContext = contextFunction(contextId); 
        }

        testContext.id = `_design/${name}`;
        testContext.language = 'javascript';
        

        createSectionFromDirectory(directory, name, contextProps).then(section => {
            
            testContext = Object.assign(testContext, section[name]);
            if(!testDatabase.partitioned && testContext.options && testContext.options.partitioned ){
                reject('partitioned option cannot be true in a non-partitioned database.');
            }else{
                if(testContext.language.toLowerCase() === 'javascript'){
                    if(testContext.validate_doc_update){
                        addValidator(contextProps.contextId,testContext.id,testContext.validate_doc_update);
                    }
                
                    if(!parentContext){
                        createCouchDBFunctions(contextProps.contextId, testContext);
                        registerContext(contextProps.contextId, testContext,'context', userCtx, secObj);
                        registerDatabase(contextProps.contextId,testDatabase,userCtx);
                    }else{
                        createCouchDBFunctions(contextProps.contextId, testContext,name);
                    }
                    resolve(testContext);
                }else if(!parentContext){
                    if(testContext.language.toLowerCase() === 'qurey'){
                        reject('Warning! You can testing Mango index with createTestServer by defining them in a json file under its root directory.');
                    }else{
                        reject(`Only "javascript" type design document testing is supported yet. This directory structure defining one "${testContext.language}" type design document!`);
                    }
                }else{
                    resolve(testContext);
                }
            }
        },err => {
            reject(err);    
        });
        
    });
}
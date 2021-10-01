import createSectionFromDirectory from './section/createSectionFromDirectory';
import { registerContext } from '../build/testing/testEnvironment';
import createCouchDBFunctions from './testing/createCouchDBFunctions';
import testBuiltIns from './testing/testBuiltIns';
import crypto from 'crypto';
import path from 'path';

export default function createTestContext(directoryName,testDatabase,userCtx,secObj,parentContext = false){
    if(process.env.JEST_WORKER_ID === undefined){
        throw new Error('createTestContext can only be used inside Jest Framework!');
    }
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
            testContext = (need,params) => {
                if(need in testBuiltIns){
                    return testBuiltIns[need](contextId,params);
                }else{
                    throw(`${need} is not supported! Try "server","emitted","logged" or the needed built-in mockFunction!`);
                }
            }
        }
        testContext.id = `_design/${name}`;
        testContext.language = 'javascript';
        

        createSectionFromDirectory(directory, name, contextProps).then(section => {
            
            testContext = Object.assign(testContext, section[name]);
         
            if(testContext.language.toLowerCase() === 'javascript'){
               
                if(!parentContext){
                    createCouchDBFunctions(contextProps.contextId, testContext);
                    let database = {_validators: [],database: testDatabase};
                    if(testContext.validate_doc_update){
                        database._validators.push({parentName:testContext.id,validator:testContext.validate_doc_update});
                    }
                    registerContext(contextProps.contextId, testContext, database, userCtx, secObj);
                }
                resolve(testContext);
            }else if(!parentContext){
                reject(`Only "javascript" type design document testing is supported yet. This directory structure defining one "${testContext.language}" type design document!`);
            }else{
                resolve(testContext);
            }
        },err => {
            reject(err)
        });
    });
}
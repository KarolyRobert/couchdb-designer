import createSectionFromDirectory from './section/createSectionFromDirectory';
import { registerContext } from '../build/testing/testEnvironment';
import createCouchDBFunctions from './testing/createCouchDBFunctions';
import testBuiltIns from './testing/testBuiltIns';
import crypto from 'crypto';
import path from 'path';

export default function createTestContext(directoryName,testDatabase){
    if(process.env.JEST_WORKER_ID === undefined){
        throw new Error('createTestContext can only be used inside Jest Framework!');
    }
    return new Promise((resolve,reject) => {
        let root = path.join(directoryName);
        let fullPath = path.resolve(process.env.PWD,root);
        let contextName = crypto.createHash('md5').update(fullPath).digest('hex');
        let name = root.split(path.sep).pop();
        let directory = path.join(root, '..');

        let testContext = need => {
            if(need in testBuiltIns){
                return testBuiltIns[need](contextName);
            }else{
                throw(`${need} is not supported! Try "server","emitted","logged" or the needed built-in mockFunction!`);
            }
        }
        
        testContext.id = `_design/${name}`;
        
        const controller = new AbortController();
        const { signal } = controller;

        createSectionFromDirectory(directory, name, {root,contextName}, signal).then(section => {

            testContext = Object.assign(testContext, section[name]);
            createCouchDBFunctions(contextName, testContext);
            registerContext(testContext, testDatabase, contextName);
            resolve(testContext);

        },err => {
            controller.abort();
            reject(err)
        });
    });
}
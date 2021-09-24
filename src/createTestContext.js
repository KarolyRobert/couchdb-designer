import createSectionFromDirectory from './section/createSectionFromDirectory';
import { registerContext } from '../build/testing/testEnvironment';
import testByPath from './testing/url/testByPath';
import crypto from 'crypto';
import path from 'path';

export default function createTestContext(directoryName,testDatabase){
    if(process.env.JEST_WORKER_ID === undefined){
        throw new Error('createTestContext can only be used inside Jest Framework!');
    }
    return new Promise((resolve,reject) => {
        let fullPath = path.join(process.env.PWD,directoryName);
        let contextName = crypto.createHash('md5').update(fullPath).digest('hex');
        let name = directoryName.split(path.sep).pop();
        let root = path.join(directoryName, '..');

        let testContext = testURL => {
            return testByPath(contextName, testDatabase, testURL);
        };

        testContext.id = `_design/${name}`
        const controller = new AbortController();
        const { signal } = controller;

        createSectionFromDirectory(root, name, contextName, signal).then(section => {

            testContext = Object.assign(testContext, section[name]);
            registerContext(testContext, contextName);
            resolve(testContext);

        },err => {
            controller.abort();
            reject(err)
        });
    });
}
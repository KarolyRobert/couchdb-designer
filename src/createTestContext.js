import createSectionFromDirectory from './section/createSectionFromDirectory';
import { registerContext } from '../build/testing/testEnvironment';
import crypto from 'crypto';
import path from 'path';

export default function createTestContext(directoryName){
    return new Promise((resolve,reject) => {
        let contextName = crypto.createHash('md5').update(directoryName).digest('hex');
        let name = directoryName.split(path.sep).pop();
        let root = path.join(directoryName,'..');
        let testContext = {
            id:`_design/${name}`
        };
        const controller = new AbortController();
        const { signal } = controller;
        createSectionFromDirectory(root, name, contextName,signal).then(section => {
            testContext = Object.assign(testContext,section[name]);
            registerContext(testContext,contextName);
            resolve(testContext);
        },err => {
            controller.abort();
            reject(err)
        });        
    });
}
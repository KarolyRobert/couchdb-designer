import createSectionFromDirectory from './createSectionFromDirectory';
import { registerContext } from './testing/testEnvironment';
import path from './path';

export default function createTestContext(directoryName){
    return new Promise((resolve,reject) => {
        let name = directoryName.split(path.sep).pop();
        let root = path.join(directoryName,'..');
        let testContext = {
            id:`_design/${name}`
        };
        createSectionFromDirectory(root, name, name).then(section => {
            testContext = Object.assign(testContext,section[name]);
            registerContext(testContext,name);
            resolve(testContext);
        },err => reject(err));        
    });
}
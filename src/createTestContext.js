import createSectionFromDirectory from './section/createSectionFromDirectory';
import { addValidator } from '../build/testing/testEnvironment';
import createCouchDBFunctions from './testing/createCouchDBFunctions';
import defaults from './testing/defaults';
import path from 'path';

export default function createTestContext(directory,name,isDatabasePatritioned,contextId){
    return new Promise((resolve,reject) => {
        
        let root = path.join(directory,name);
       // let name = root.split(path.sep).pop();
       // let directory = path.join(root, '..');
        let contextProps = {root,name,contextId};
    
        let testContext = {
            id : `_design/${name}`,
            language:'javascript'
        }
     
        

        createSectionFromDirectory(directory, name, contextProps).then(section => {
            
            testContext = Object.assign(testContext, section[name]);
            if(!isDatabasePatritioned && testContext.options && testContext.options.partitioned ){
                reject('partitioned option cannot be true in a non-partitioned database.');
            }else{
                if(testContext.language.toLowerCase() === 'javascript'){
                    if(testContext.validate_doc_update){
                        addValidator(contextId,testContext.id,testContext.validate_doc_update);
                    }
                    createCouchDBFunctions(contextId, testContext,name);
                    resolve(testContext);
                }else{
                    if(testContext.language.toLowerCase() === 'query'){
                        reject('Warning! You can testing Mango index with createTestServer by defining them in a json file under its root directory.');
                    }else{
                        reject(`Only "javascript" type design document testing is supported yet. This directory structure defining one "${testContext.language}" type design document!`);
                    }
                }
            }
        },err => {
            reject(err);    
        });
        
    });
}

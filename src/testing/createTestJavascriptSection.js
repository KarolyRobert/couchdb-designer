import {testEnvironment} from '../../build/testing/testEnvironment';
import createMockFunction from './createMockFunction';


const createTestJavascriptModule = (contextId,fileContent) => {
    const {require,emit,log,sum,getRow,provides,registerType,start,send,index} = testEnvironment(contextId);
    const toJSON = JSON.stringify;
    const isArray = Array.isArray;
    return eval(fileContent); 
}


const createTestJavascriptSection = (fileStats, contextProps, fileContent) => {
    return new Promise((resolve, reject) => {
        try{
            const testModule = createTestJavascriptModule(contextProps.contextId, fileContent);
            if(testModule && Object.keys(testModule).length > 0){
                let testModuleKeys = Object.keys(testModule);
                if(!fileStats.isLib && testModuleKeys.length === 1 && testModuleKeys[0] === fileStats.name){
                    
                    const mockFunction = createMockFunction(fileStats, contextProps, testModuleKeys[0], testModule[testModuleKeys[0]]);
                    resolve({[fileStats.name]:mockFunction});
                }else{
                    let testElementsObject = {__sourceProperties__:fileStats};
                    for(let moduleElementName of testModuleKeys){
                        if(typeof testModule[moduleElementName] === 'function'){
                            const mockFunction = createMockFunction(fileStats,contextProps,moduleElementName,testModule[moduleElementName]);
                            testElementsObject[moduleElementName] = mockFunction;
                        }else{
                            testElementsObject[moduleElementName] = testModule[moduleElementName];
                        }
                    }
                    resolve({[fileStats.name]:testElementsObject});
                }   
            }else{
                reject(`The module ${fileStats.filePath} does not exist't export anything! You must export function/s with module.exports = {...}`);
            }
        }catch(moduleError){
            reject(`Can not evaluate ${fileStats.filePath}\n ${moduleError.message}`);
        }
    });
}

export default createTestJavascriptSection;
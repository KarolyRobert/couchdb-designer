import loadTestModule from './loadTestModule';
import createMockFunction from './createMockFunction';

const creteTestSectionFromModule = (fileStats,contextName) => {

    return new Promise((resolve, reject) => {
        loadTestModule(fileStats).then(testModule => {
            let testModuleKeys = Object.keys(testModule);
            if(!fileStats.isLib && testModuleKeys.length === 1 && testModuleKeys[0] === fileStats.name){
                
                const mockFunction = createMockFunction(fileStats, contextName, testModuleKeys[0], testModule[testModuleKeys[0]]);
                resolve({[fileStats.name]:mockFunction});
            }else{
                let testElementsObject = {__sourceProperties__:fileStats};
                for(let moduleElementName of testModuleKeys){
                    if(typeof testModule[moduleElementName] === 'function'){
                        const mockFunction = createMockFunction(fileStats,contextName,moduleElementName,testModule[moduleElementName]);
                        testElementsObject[moduleElementName] = mockFunction;
                    }else{
                        testElementsObject[moduleElementName] = testModule[moduleElementName];
                    }
                }
                resolve({[fileStats.name]:testElementsObject});
            }        
        }, err => reject(err));
    });
}

export default creteTestSectionFromModule;
import jest from 'jest';
import loadTestModule from './loadTestModule';


const creteTestSectionFromModule = fileStats => {
    return new Promise((resolve, reject) => {
        loadTestModule(fileStats).then(testModule => {
            let testModuleKeys = Object.keys(testModule);
            if(!fileStats.isLib && testModuleKeys.length === 1 && testModuleKeys[0] === fileStats.name){
                resolve({[fileStats.name]:jest.fn(function(){
                    return testModule[0](...arguments);
                })});
            }else{
                let testElementsObject = {};
                testModuleKeys.forEach(moduleElementName => {
                    if(typeof testModule[moduleElementName] === 'function'){
                        testElementsObject[moduleElementName] = jest.fn(function(){
                            return testModule[moduleElementName](...arguments);
                        });
                    }else{
                        testElementsObject[moduleElementName] = testModule[moduleElementName];
                    }
                });
                resolve({[fileStats.name]:testElementsObject});
            }        
        }, err => reject(err));
    });
}

export default creteTestSectionFromModule;
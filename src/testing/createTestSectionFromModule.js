import {jest} from '@jest/globals';
import loadTestModule from './loadTestModule';
import { emitMock, mockEmit } from '../../build/testing/testEnvironment';


const creteTestSectionFromModule = fileStats => {
    return new Promise((resolve, reject) => {
        loadTestModule(fileStats).then(testModule => {
            let testModuleKeys = Object.keys(testModule);
            if(!fileStats.isLib && testModuleKeys.length === 1 && testModuleKeys[0] === fileStats.name){
                //resolve({[fileStats.name]:testModule[testModuleKeys[0]]});
                resolve({[fileStats.name]:jest.fn((...args) => {
                    if(testModuleKeys[0] === 'map'){
                        emitMock.mockImplementation((...emitargs) => {
                            mockEmit(args[0],...emitargs);
                        });
                    }else{
                        emitMock.mockImplementation(() => {
                            throw new Error('Calling emit allows only views map function!');
                        });
                    }
                    return testModule[testModuleKeys[0]](...args);
                })});
            }else{
                let testElementsObject = {};
                testModuleKeys.forEach(moduleElementName => {
                   // testElementsObject[moduleElementName] = testModule[moduleElementName];
                    
                    if(typeof testModule[moduleElementName] === 'function'){
                        testElementsObject[moduleElementName] = jest.fn((...args) => {
                            if(moduleElementName === 'map'){
                                emitMock.mockImplementation((...emitargs) => {
                                    mockEmit(args[0],...emitargs);
                                });
                            }else{
                                emitMock.mockImplementation(() => {
                                    throw new Error('Call emit allows only views map function!');
                                });
                            }
                            return testModule[moduleElementName](...args)
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
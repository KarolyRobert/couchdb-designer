//import {jest} from '@jest/globals';

const contexts = {}

const registerContext = (testContext,testContextName) => {
    contexts[testContextName] = testContext;
}

let emitMock, mockEmit,logMock;

if(process.env.JEST_WORKER_ID !== undefined){
    emitMock = jest.fn();
    mockEmit = jest.fn();
    logMock = jest.fn();
}

const viewResult = () => {
    if(process.env.JEST_WORKER_ID === undefined){
        throw new Error('viewResult can only be used inside Jest Framework!');
    }
    return {
        total_rows:mockEmit.mock.calls.length,
        offset:0,
        rows:mockEmit.mock.calls.map(params => ({id:params[0]._id,key:params[1],value:params[2]}))
    }
}
const logResult = () => {
    if(process.env.JEST_WORKER_ID === undefined){
        throw new Error('logResult can only be used inside Jest Framework!');
    }
    let log = '';
    logMock.mock.calls.forEach(params => {
        log += `Log :: ${params[0]}\n`;
    });
    return log;
}

const testEnvironment = contextName => ({
    require: requirePath => {
        let pathSegments = requirePath.split('/');
        let required = contexts[contextName];
    
        for(let segment of pathSegments) {
            if(segment in required){
                required = required[segment];
            }else{
                throw new Error(`Invalid require ${requirePath} is not in the environment ${contexts[contextName].id}`);
            }
        }
        if(required.__sourceProperties__ && required.__sourceProperties__.isLib){
            return required;
        }
        throw new Error(`Invalid require ${requirePath}. You can only import which declared by "name.lib.js" rule as a library.`);
    },
    sum: arr => {
        if(Array.isArray(arr)){
            let result = 0;
            for(let value of arr){
                if(typeof value === 'number'){
                    result += value;
                }else{
                    throw new Error('The parameter of "sum()" must be an array of numbers!');
                }
            }
            return result;
        }
        throw new Error('The parameter of "sum()" must be an array of numbers!');
    },
    toJSON: p => JSON.stringify(p),
    emit:emitMock,
    log:logMock,
})


module.exports = { registerContext, testEnvironment, emitMock ,mockEmit, viewResult, logResult };
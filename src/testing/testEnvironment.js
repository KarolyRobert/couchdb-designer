import {jest} from '@jest/globals';

const contexts = {}

const registerContext = (testContext,testContextName) => {
    contexts[testContextName] = testContext;
}

const emitMock = jest.fn();
const mockEmit = jest.fn();

const viewResult = () => {
    return {
        total_rows:mockEmit.mock.calls.length,
        offset:0,
        rows:mockEmit.mock.calls.map(params => ({id:params[0]._id,key:params[1],value:params[2]}))
    }
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
        return required;
    },
    emit:emitMock
})


module.exports = { registerContext, testEnvironment, emitMock ,mockEmit, viewResult };
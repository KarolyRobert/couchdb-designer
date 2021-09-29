
const contexts = {}


const environmentSum = arr => {
    if(Array.isArray(arr)){
        let result = 0;
        for(let index in arr){
          //  if(typeof value === 'number'){
                result += arr[index];
          /*  }else{
                throw new Error('The parameter of "sum()" must be an array of numbers!');
            }*/
        }
        return result;
    }
    throw new Error('The parameter of "sum()" must be an array!');
}


const registerContext = (testContext,testDatabase,testContextName) => {
    if(testDatabase !== undefined && !Array.isArray(testDatabase)){
        throw new Error('createTestContext second parameter must be an array of document object to represent the data of testing database or an array of arrays of document object for represent the nodes of the test database!');
    }
    contexts[testContextName] = Object.assign(contexts[testContextName],{context:testContext,database:testDatabase});
}

const getTestContext = (testContextName) => {
    return contexts[testContextName];
}

const testEnvironment = contextName => {

    if(contexts[contextName]){

        return contexts[contextName].environment;

    }else{

        const environmentRequire = jest.fn();
        const environmentEmit = jest.fn();
        const environmentLog = jest.fn();

        const environmentGetRow = jest.fn();
        const environmentProvides = jest.fn();
        const environmentRegisterType = jest.fn();
        const environmentStart = jest.fn();
        const environmentSend = jest.fn();
        const environmentIndex = jest.fn();

        const contextedGetRow = jest.fn();
        const contextedProvides = jest.fn();
        const contextedRegisterType = jest.fn();
        const contextedStart = jest.fn();
        const contextedSend = jest.fn();
        const contextedIndex = jest.fn();

        const contextedEmit = jest.fn();

        const contextedRequire = requirePath => {
            let pathSegments = requirePath.split('/');
            let required = contexts[contextName].context;
        
            for(let segment of pathSegments) {
                if(segment in required){
                    required = required[segment];
                }else{
                    throw new Error(`Invalid require ${requirePath} is not in the environment ${contexts[contextName].context.id}`);
                }
            }
            if(required.__sourceProperties__ && required.__sourceProperties__.isLib){
                return required;
            }
            throw new Error(`Invalid require ${requirePath}. You can only import which declared by "name.lib.js" rule as a library.`);
        };

        contexts[contextName] = { 
            buildIns:{
                environmentRequire,
                environmentEmit,
                environmentLog,
                environmentGetRow,
                environmentProvides,
                environmentRegisterType,
                environmentStart,
                environmentSend,
                environmentIndex,
                contextedEmit,
                contextedRequire,
                contextedGetRow,
                contextedProvides,
                contextedRegisterType,
                contextedStart,
                contextedSend,
                contextedIndex
            },
            environment:{
                require:environmentRequire,
                emit:environmentEmit,
                log:environmentLog,
                sum:environmentSum,
                getRow:environmentGetRow,
                provides:environmentProvides,
                registerType:environmentRegisterType,
                start:environmentStart,
                send:environmentSend,
                index:environmentIndex
            },
            server:{}
        }

        return contexts[contextName].environment;
    }
}


module.exports = { registerContext, testEnvironment, getTestContext};
import createTestViewFunction from './views/createTestViewFunction';
import testBuiltIns from './testBuiltIns';

let couchdbSections = {
    views:'view'
}

const createCouchDBFunctions = (contextName,context) => {
    const relatedFunctions = {
        views:createTestViewFunction
    }
    const server = testBuiltIns.server(contextName);
    const sectionKeys = Object.keys(couchdbSections);
    for(let section of sectionKeys){
        let functionNames = Object.keys(context[section]);
        for(let functionName of functionNames) {

            let functionSection = relatedFunctions[section](contextName,functionName);
            if(!server[couchdbSections[section]]){
                server[couchdbSections[section]] = {};
            }
            server[couchdbSections[section]][functionName] = functionSection;
        }
    }
}

export default createCouchDBFunctions;
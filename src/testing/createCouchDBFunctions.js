import createTestViewFunction from './views/createTestViewFunction';
import createTestUpdateFunction from './updates/createTestUpdateFunction';
import testBuiltIns from './testBuiltIns';

let couchdbSections = {
    views:'view',
    updates:'update'
}

const createCouchDBFunctions = (contextId,context,parent = false) => {
    let server = testBuiltIns.server(contextId);
    if(server){
        
        const relatedFunctions = {
            views:createTestViewFunction,
            updates:createTestUpdateFunction,
        }
       
        if(parent){
            if(!server[parent]){
                server[parent] = {};
            }
        }
        
        const sectionKeys = Object.keys(couchdbSections);

        for(let section of sectionKeys){
            if(context[section]){
                let functionNames = Object.keys(context[section]);
                for(let functionName of functionNames) {

                    let functionSection = relatedFunctions[section](contextId,functionName,context);
                    if(parent){
                        if(!server[parent][couchdbSections[section]]){
                            server[parent][couchdbSections[section]] = {};
                        }
                        server[parent][couchdbSections[section]][functionName] = functionSection;
                    }else{
                        if(!server[couchdbSections[section]]){
                            server[couchdbSections[section]] = {};
                        }
                        server[couchdbSections[section]][functionName] = functionSection;
                    }
                }
            }
        }
    }
}

export default createCouchDBFunctions;
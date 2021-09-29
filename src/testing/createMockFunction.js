import { getTestContext } from '../../build/testing/testEnvironment';

const getBuiltInPolicy = (fileStats,name) => {
    let typePath = fileStats.typePath[fileStats.typePath.length - 1] === name ? fileStats.typePath : [...fileStats.typePath, name];
    let functionType;
    switch(typePath[0]){
        case 'views':
            if(typePath.length === 3 && name === 'map') functionType = 'map';
            if(typePath.length === 3 && name === 'reduce') functionType = 'reduce';
            break;
        case 'updates':
            if(typePath.length === 2) functionType = 'update';
            break;
        case 'shows':
            if(typePath.length === 2) functionType = 'show';
            break;
        case 'lists':
            if(typePath.length === 2) functionType = 'list';
            break;
        case 'filters':
            if(typePath.length === 2) functionType = 'filter';
            break;
        case 'indexes':
            if(typePath.length === 3 && name === 'index') functionType = 'index';
            break;
        case 'validate_doc_update':
            if(typePath.length === 1) functionType = 'validate';
            break;
        default:
            functionType = 'library';
    }
   if(functionType === 'library' && fileStats.isLib){
       return {allowed:[],denied:['Require']}
   }else if(functionType === 'library'){
       throw(`Your function ${name} doesn't match to rules of couchdb design document! If ${fileStats.filePath} is a common js library please follow the rule the filename in shape name.lib.js for proper ddoc generation.`);
   }

    switch(functionType){
        case 'map':
            return {allowed:['Emit','Require'],denied:['GetRow','Provides','RegisterType','Start','Send','Index']}
        case 'reduce':
            return {allowed:[],denied:['Emit','Require','GetRow','Provides','RegisterType','Start','Send','Index']}
        case 'update': 
        case 'validate':
        case 'filter':
            return {allowed:['Require'],denied:['Emit','GetRow','Provides','RegisterType','Start','Send','Index']}
        case 'show':
            return {allowed:['Require','Provides','RegisterType'],denied:['Emit','GetRow','Start','Send','Index']}
        case 'list':
            return {allowed:['Require','Provides','RegisterType','GetRow','Start','Send'],denied:['Emit','Index']}
        case 'index':
            return {allowed:['Index'],denied:['Emit','Require','Provides','RegisterType','GetRow','Start','Send']}
    }
}

const callingErrors = {
    Emit:"Calling 'emit' allows only in view's map function!",
    Require:"Calling 'require' from reduce function in is not allowed and useless from library!",
    GetRow:"Calling 'getRow' allows only in list functions!",
    Provides:"Calling 'provides' allows only in list and show functions!",
    RegisterType:"Calling 'registerType' allows only in list and show functions!",
    Start:"Calling 'start' allows only in list functions!",
    Send:"Calling 'send' allows only in list functions!",
    Index:"Calling 'index' allows only in index functions!"
}

const createMockFunction = (fileStats,contextName,name,designFunction) => {
    const buildIns = getTestContext(contextName).buildIns;
    let builtInPolicy = getBuiltInPolicy(fileStats,name);
    return jest.fn((...args) => {

        for(let allowed of builtInPolicy.allowed){
            if(allowed === 'Emit'){
                buildIns.environmentEmit.mockImplementation((...emitargs) => buildIns.contextedEmit(args[0],...emitargs));
            }else{
                buildIns[`environment${allowed}`].mockImplementation((...builtInArgs) => buildIns[`contexted${allowed}`](...builtInArgs));
            }
        }
        for(let denied of builtInPolicy.denied){

            buildIns[`environment${denied}`].mockImplementation(() => {
                throw(`${callingErrors[denied]} You can fix it in ${fileStats.filePath}`);
            });

        }
        let result = designFunction(...args);
        if(fileStats.isLib){
            buildIns.environmentRequire.mockImplementation(requirePath => buildIns.contextedRequire(requirePath));
        }
        return result;
    })
}


export default createMockFunction;
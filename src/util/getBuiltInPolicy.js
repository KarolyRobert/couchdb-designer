

const getBuiltInPolicy = (fileStats,name) => {
    let typePath = fileStats.typePath[fileStats.typePath.length - 1] === name ? fileStats.typePath : [...fileStats.typePath, name];
    let functionType = 'library';
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
        case 'rewrites':
            if(typePath.length === 1) functionType = 'rewrite';
    }

    if(functionType === 'library' && fileStats.isLib){
        return {allowed:[],denied:['Require']}
    }else if(functionType === 'library'){
        throw(`Your function ${name} doesn't match to rules of couchdb design document generation! If ${fileStats.filePath} is a common js library please follow the rule the filename in shape name.lib.js for proper ddoc generation.`);
    }

    switch(functionType){
        case 'map':
            return {allowed:['Emit','Require'],denied:['GetRow','Provides','RegisterType','Start','Send','Index']}
        case 'reduce':
            return {allowed:[],denied:['Emit','Require','GetRow','Provides','RegisterType','Start','Send','Index']}
        case 'update': 
        case 'validate':
        case 'filter':
        case 'rewrite':
            return {allowed:['Require'],denied:['Emit','GetRow','Provides','RegisterType','Start','Send','Index']}
        case 'show':
            return {allowed:['Require','Provides','RegisterType'],denied:['Emit','GetRow','Start','Send','Index']}
        case 'list':
            return {allowed:['Require','Provides','RegisterType','GetRow','Start','Send'],denied:['Emit','Index']}
        case 'index':
            return {allowed:['Index'],denied:['Emit','Require','Provides','RegisterType','GetRow','Start','Send']}
    }
}

export default getBuiltInPolicy;
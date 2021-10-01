import { getTestContext } from '../../build/testing/testEnvironment';
import getBuiltInPolicy from '../util/getBuiltInPolicy';


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

const createMockFunction = (fileStats,contextProps,name,designFunction) => {
    let builtInPolicy = getBuiltInPolicy(fileStats,name);
    const {buildIns} = getTestContext(contextProps.contextId);
    return jest.fn((...args) => {
        for(let allowed of builtInPolicy.allowed){
            if(allowed === 'Emit'){
                buildIns.environmentEmit.mockImplementation((...emitargs) => buildIns.contextedEmit(args[0],...emitargs));
            }else if(allowed === 'Require'){
                buildIns.environmentRequire.mockImplementation(requirePath => {
                    if(builtInPolicy.allowed.includes('Emit') && requirePath.indexOf('views') !== 0){
                       throw(`The map function can only require library from under views section! You can fix it in ${fileStats.filePath}`);
                    }
                    if(contextProps.name){
                        return buildIns.contextedRequire(`${contextProps.name}/${requirePath}`);
                    }else{
                        return buildIns.contextedRequire(requirePath);
                    }
                    
                });
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
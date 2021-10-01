import viewSort from './views/viewSort';
import { getTestContext } from '../../build/testing/testEnvironment';


const emitted = (contextName) => {
    let buildIns = getTestContext(contextName).buildIns;
    let rows = buildIns.contextedEmit.mock.calls.map(params => ({id:params[0]._id,key:params[1],value:params[2]}))
    let count = buildIns.contextedEmit.mock.calls.length;
    if(rows.length){
        rows.sort(viewSort);
    }
    buildIns.contextedEmit.mockClear();
    return {
        total_rows:count,
        offset:0,
        rows:rows
    }
}

const logged = (contextName) => {
    let buildIns = getTestContext(contextName).buildIns;
    let log = "";
    buildIns.environmentLog.mock.calls.forEach(params => {
        log += `[info] Log :: ${params[0]}\n`;
    });
    buildIns.environmentLog.mockClear();
    return log;
}

const getRow = (contextName) => {
    return getTestContext(contextName).buildIns.contextedGetRow;
}

const provides = (contextName) => {
    return getTestContext(contextName).buildIns.contextedProvides;
}

const registerType = (contextName) => {
    return getTestContext(contextName).buildIns.contextedRegisterType;
}

const start = (contextName) => {
    return getTestContext(contextName).buildIns.contextedStart;
}

const send = (contextName) => {
    return getTestContext(contextName).buildIns.contextedSend;
}

const index = (contextName) => {
    return getTestContext(contextName).buildIns.contextedIndex;
}

const server = (contextName) => {
    return getTestContext(contextName).server;
}
const _design = (contextName) => {
    return getTestContext(contextName).server;
}

const database = (contextName,id) => {
    if(id){
        let database = getTestContext(contextName).database.database;
        let result = {error:"not_found",reason:"missing"}
        for(let doc of database){
            if(doc._id === id){
                result = {...doc};
            }
        }
        return result;
    }else{
        return [...getTestContext(contextName).database.database];
    }
}


module.exports = { emitted, logged, getRow, provides, registerType, start, send, index, server, _design, database }
import viewSort from './views/viewSort';
import { getTestContext } from '../../build/testing/testEnvironment';
import filter from './changes/filter';


const emitted = (contextId) => {
    let buildIns = getTestContext(contextId).buildIns;
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

const logged = (contextId) => {
    let buildIns = getTestContext(contextId).buildIns;
    let log = "";
    buildIns.environmentLog.mock.calls.forEach(params => {
        log += `[info] Log :: ${params[0]}\n`;
    });
    buildIns.environmentLog.mockClear();
    return log;
}

const getRow = (contextId) => {
    return getTestContext(contextId).buildIns.contextedGetRow;
}

const provides = (contextId) => {
    return getTestContext(contextId).buildIns.contextedProvides;
}

const registerType = (contextId) => {
    return getTestContext(contextId).buildIns.contextedRegisterType;
}

const start = (contextId) => {
    return getTestContext(contextId).buildIns.contextedStart;
}

const send = (contextId) => {
    return getTestContext(contextId).buildIns.contextedSend;
}

const index = (contextId) => {
    return getTestContext(contextId).buildIns.contextedIndex;
}

const server = (contextId) => {
    if(getTestContext(contextId) && getTestContext(contextId).server){
        return getTestContext(contextId).server;
    }
    return false;
}
const _design = (contextId) => {
    return getTestContext(contextId).server;
}

const database = (contextId,id) => {
    if(id){
        let {database} = getTestContext(contextId);
        let result = {error:"not_found",reason:"missing"}
        for(let doc of database){
            if(doc._id === id){
                result = {...doc};
            }
        }
        return result;
    }else{
        return [...getTestContext(contextId).database];
    }
}

const _changes = (contextId,request) => {
    if(request){
        return filter(contextId,request);
    }else{
        let {changes} = getTestContext(contextId);
        return {results:[...changes],
            last_seq:changes[changes.length - 1].seq,
            pending:0
        }
    }
}




module.exports = { emitted, logged, getRow, provides, registerType, start, send, index, server, _design, database, _changes }
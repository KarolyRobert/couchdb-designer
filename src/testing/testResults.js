import viewSort from '../util/viewSort';
import { getTestContext } from '../../build/testing/testEnvironment';


const emitted = (contextName) => {
    let buildIns = getTestContext(contextName).buildIns;
    let rows = buildIns.contextedEmit.mock.calls.map(params => ({id:params[0]._id,key:params[1],value:params[2]}))
    let count = buildIns.contextedEmit.mock.calls.length;
    if(rows.length){
        let keyType = Array.isArray(rows[0].key) ? 'array' : typeof rows[0].key;
        rows.sort(viewSort[keyType]);
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


module.exports = { emitted, logged }
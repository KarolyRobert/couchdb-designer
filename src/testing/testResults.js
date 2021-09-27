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


module.exports = { emitted, logged }
import createViewResult from './createViewResult';
import { emitted, logged } from '../testResults';


const testByPath = (contextName,testDatabase,url) => {
    let query = new URL(`http://${url}`);
    switch (query.host) {
        case '_view':
            return createViewResult(contextName,testDatabase,query.pathname.substr(1),query.searchParams);
        case '_all_docs':
            return testDatabase;
        case 'logged':
            return logged(contextName);
        case 'emitted':
            return emitted(contextName);
        default:
            throw new Error(`The ${query.host} url is not supported yet! Please write an issue if you need this type of testing.`);
    }
}

export default testByPath;

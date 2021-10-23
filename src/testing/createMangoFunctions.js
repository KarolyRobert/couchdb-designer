import { getTestContext} from '../../build/testing/testEnvironment';
import createMangoFind from './mango/createMangoFind';


const createMangoFunctions = contextId => {
    let {server} = getTestContext(contextId);
    server['find'] = createMangoFind(contextId);
}

export default createMangoFunctions;
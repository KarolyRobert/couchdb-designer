import createTestContext from "../src/createTestContext";
import createTestServer from "../src/createTestServer";


const testDatabase = {name:'proba1',partitioned:true,data:[
    {_id:'p:doc1',name:[[10,10],9,13],parent:'roger'},
    {_id:'p:doc2',name:[[10,10],9,10],parent:'zargu'}
]}

describe('viewErrors',() => {

    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('by context',() => {
        test('all case', () => {
            return createTestContext('./tests/design/errors',testDatabase).then(context => {
                expect(() => context('server').view.require({},'p')).toThrow('The map function can only require library from under views section! You can fix it in tests/design/errors/views/require.js');
                expect(() => context('server').view.getrow({},'p')).toThrow("Calling 'getRow' allows only in list functions! You can fix it in tests/design/errors/views/getrow.js");
                expect(() => context('server').view.provides({},'p')).toThrow("Your function map from tests/design/errors/views/provides.js throw error: Calling 'provides' allows only in list and show functions! You can fix it in tests/design/errors/views/lib.lib.js");
            })
        })
    })
    describe('by server',() => {
        test('all case', () => {
            return createTestServer('./tests/design',testDatabase).then(server => {
                expect(() => server('server').errors.view.require({},'p')).toThrow('The map function can only require library from under views section! You can fix it in tests/design/errors/views/require.js');
                expect(() => server('server').errors.view.getrow({},'p')).toThrow("Calling 'getRow' allows only in list functions! You can fix it in tests/design/errors/views/getrow.js");
                expect(() => server('server').errors.view.provides({},'p')).toThrow("Your function map from tests/design/errors/views/provides.js throw error: Calling 'provides' allows only in list and show functions! You can fix it in tests/design/errors/views/lib.lib.js");
            })
        })
    })
})


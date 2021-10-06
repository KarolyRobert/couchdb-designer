import createTestContext from "../src/createTestContext";
import createTestServer from "../src/createTestServer";


const testDatabase = [
    {_id:'doc1',name:[[10,10],9,13],parent:'roger'},
    {_id:'doc2',name:[[10,10],9,10],parent:'zargu'}
]

describe('viewErrors',() => {

    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('by context',() => {
        test('all case', () => {
            return createTestContext('./tests/design/errors',testDatabase).then(context => {
                expect(() => context('server').view.require()).toThrow('The map function can only require library from under views section! You can fix it in tests/design/errors/views/require.js');
                expect(() => context('server').view.getrow()).toThrow("Calling 'getRow' allows only in list functions! You can fix it in tests/design/errors/views/getrow.js");
                expect(() => context('server').view.provides()).toThrow("Your function map from tests/design/errors/views/provides.js throw error: Calling 'provides' allows only in list and show functions! You can fix it in tests/design/errors/views/lib.lib.js");
            })
        })
    })
    describe('by server',() => {
        test('all case', () => {
            return createTestServer('./tests/design',testDatabase).then(server => {
                expect(() => server('server').errors.view.require()).toThrow('The map function can only require library from under views section! You can fix it in tests/design/errors/views/require.js');
                expect(() => server('server').errors.view.getrow()).toThrow("Calling 'getRow' allows only in list functions! You can fix it in tests/design/errors/views/getrow.js");
                expect(() => server('server').errors.view.provides()).toThrow("Your function map from tests/design/errors/views/provides.js throw error: Calling 'provides' allows only in list and show functions! You can fix it in tests/design/errors/views/lib.lib.js");
            })
        })
    })
})


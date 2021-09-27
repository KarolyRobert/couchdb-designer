import createTestContext from "../src/createTestContext";

const testDatabase = [
    {_id:'doc1',name:[[10,10],9,13],parent:'roger'},
    {_id:'doc2',name:[[10,10],9,10],parent:'zargu'}
]

const testDatabase2 = [
    {_id:'doc1',name:'zargu',parent:'roger'},
    {_id:'doc2',name:'roger',parent:'zargu'}
]

    describe("createTestContext",() => {
        beforeEach(() => {
            jest.clearAllMocks();
        });
        test("all case",() => {
            return createTestContext('./tests/design/appdesign',testDatabase).then(context => {
                let update = context.updates.updateFromDir('doc','req');
                expect(update).toEqual(['doc','libfunction call updated']);
                expect(context.lib.couchdb.libfunction.mock.calls.length).toBe(1);
                expect(() => context.views.byDate.reduce(['keys'],['values'],false)).toThrow('Calling require from reduce function in is not allowed! You can fix it in tests/design/appdesign/views/byDate/reduce.js');
                context.views.byName.map(testDatabase[1]);
                expect(context('emitted')).toEqual({offset:0,total_rows:1,rows:[{id:'doc2',key:[[10,10],9,10],value:1}]});
                expect(context('logged')).toBe('[info] Log :: log from updateFromDir\n[info] Log :: log from views/byName/map\n');
              //  expect(context.views.byName()).toEqual({"offset": 0, "rows": [{"id": "doc2", "key": [[10, 10], 9, 10], "value": 1}, {"id": "doc1", "key": [[10, 10], 9, 13], "value": 1}], "total_rows": 2});
            })//.catch(err => expect(err).toBe('nincs'));
        });
        
        test("concurent",() => {
            return createTestContext('./tests/design/appdesign',testDatabase2).then(context => {
                let update = context.updates.updateFromDir('doc','req');
                expect(update).toEqual(['doc','libfunction call updated']);
                expect(context.lib.couchdb.libfunction.mock.calls.length).toBe(1);
                expect(() => context.views.byDate.reduce(['keys'],['values'],false)).toThrow('Calling require from reduce function in is not allowed! You can fix it in tests/design/appdesign/views/byDate/reduce.js');
             //   expect(() => context.views.byName({group:true})).toThrow();
            })
        });
    });

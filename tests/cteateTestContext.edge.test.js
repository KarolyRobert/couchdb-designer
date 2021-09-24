import createTestContext from "../src/createTestContext";
//import {mockEmit,viewResult,logResult} from "../build/testing/testEnvironment";
/*
const testDatabase = [
    {_id:'doc1',name:[[10,10],9,1]},
    {_id:'doc2',name:[[10,10],9,10]}
]*/

const testDatabase = [
    {_id:'doc1',name:[[10,10],9,1],parent:'roger'},
    {_id:'doc2',name:[[10,10],9,10],parent:'zargu'}
]

    describe("createTestContext",() => {
        beforeEach(() => {
            jest.clearAllMocks();
        });
        test("all case",() => {
            return createTestContext('./tests/design/appdesign',testDatabase).then(context => {
                let update = context.updates.updateFromDir('doc','req');
                context.views.byName.map({_id:'jhawgqwj',name:'roger'});
                context.views.byName.map({_id:'jhawgqwj',name:'roger'});
                context.views.byName.map({_id:'jhawgqwj',name:'roger'});
                context.views.byParent.map({_id:'parent',parent:'torpedó'});
                context.views.byParent.map({_id:'parent',parent:'torpedó'});
                context.views.byParent.map({_id:'parent',parent:'torpedó'});
                context.views.byParent.map({_id:'parent',parent:'torpedó'});
                // expect(viewResult()).toMatchSnapshot();
                // expect(logResult()).toMatchSnapshot();
               // expect(mockEmit.mock.calls.length).toBe(2);
              //  expect(mockEmit.mock.calls[0][0]).toStrictEqual({_id:'jhawgqwj',name:'roger'});
              //  expect(mockEmit.mock.calls[1][1]).toBe('torpedó');
                expect(update).toEqual(['doc','libfunction call updated']);
                expect(context.lib.couchdb.libfunction.mock.calls.length).toBe(1);
                expect(() => context.views.byDate.reduce(['keys'],['values'],false)).toThrow('Calling require from reduce function in is not allowed! You can fix it in tests/design/appdesign/views/byDate/reduce.js');
                expect(context('_all_docs')).toEqual({helo:'szia'});
            })//.catch(err => expect(err).toBe('nincs'));
        });
    });

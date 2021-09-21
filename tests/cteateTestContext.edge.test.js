import createTestContext from "../src/createTestContext";
import {mockEmit,viewResult,logResult} from "../build/testing/testEnvironment";



    describe("createTestContext",() => {
        beforeEach(() => {
            jest.clearAllMocks();
        });
        test("require",() => {
            return createTestContext('./tests/design/appdesign').then(context => {
                let update = context.updates.updateFromDir('doc','req');
                context.views.byName.map({_id:'jhawgqwj',name:'roger'});
                context.views.byParent.map({_id:'parent',parent:'torpedó'});
                expect(viewResult()).toMatchSnapshot();
                expect(logResult()).toMatchSnapshot();
                expect(mockEmit.mock.calls.length).toBe(2);
                expect(mockEmit.mock.calls[0][0]).toStrictEqual({_id:'jhawgqwj',name:'roger'});
                expect(mockEmit.mock.calls[1][1]).toBe('torpedó');
                expect(update).toEqual(['doc','libfunction call updated']);
                expect(context.lib.couchdb.libfunction.mock.calls.length).toBe(1);
            })//.catch(err => expect(err).toBe('nincs'));
        });
    });

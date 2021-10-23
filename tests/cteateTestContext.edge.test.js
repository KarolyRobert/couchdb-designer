import createTestContext from "../src/createTestContext";
import createTestServer from "../src/createTestServer";

const testDatabase = {name:'proba1',partitioned:true,data:[
    {_id:'p:doc1',name:[[10,10],9,13],parent:'roger'},
    {_id:'p:doc2',name:[[10,10],9,10],parent:{name:"zargu"}},
    {_id:'s:doc1',name:[[10,10],9,13],parent:'roger'},
    {_id:'s:doc2',name:[[10,10],9,10],parent:'zargu'}
    
]}

const testDatabase2 = {name:'proba2',partitioned:true,data:[
    {_id:'p:doc1',name:'zargu',parent:'roger'},
    {_id:'p:doc2',name:'roger',parent:'zargu'}
]}

    describe("createTestContext",() => {
        beforeEach(() => {
            jest.clearAllMocks();
        });
        test("all case",() => {
            return createTestContext('./tests/design/appdesign',testDatabase).then(context => {
                let update = context.updates.updateFromDir({},{});
                expect(update[0]).toEqual({updateByUpdateFromDir:'libfunction call updated'});
                expect(context.lib.couchdb.libfunction.mock.calls.length).toBe(1);
                expect(() => context.views.byDate.reduce(['keys'],['values'],false)).toThrow("Calling 'require' from reduce function in is not allowed and useless from library! You can fix it in tests/design/appdesign/views/byDate/reduce.js");
                context.views.byName.map(testDatabase.data[1]);
                expect(context('emitted')).toEqual({offset:0,total_rows:1,rows:[{id:'p:doc2',key:[[10,10],9,10],value:1}]});
                expect(context('logged')).toBe('[info] Log :: log from updateFromDir\n[info] Log :: log from views/byName/map\n');
            })//.catch(err => expect(err).toBe('nincs'));
        });
        
        test("concurent",() => {
            return createTestContext('./tests/design/appdesign',testDatabase2).then(context => {
                let update = context.updates.updateFromDir({},{});
                expect(update[0]).toEqual({updateByUpdateFromDir:'libfunction call updated'});
                expect(context.lib.couchdb.libfunction.mock.calls.length).toBe(1);
                expect(() => context.views.byDate.reduce(['keys'],['values'],false)).toThrow("Calling 'require' from reduce function in is not allowed and useless from library! You can fix it in tests/design/appdesign/views/byDate/reduce.js");
                expect(() => context('server').view.byName({group_level:1})).toThrow();
                expect(context('_design').update.updateFromDir({uuid:'uid1'},'p:doc1').__supplemented).toBeUndefined();
                expect(context('database')[0].updateByUpdateFromDir).toBe("libfunction call updated");
                expect(context('_changes',{filter:'appdesign/all'}).results.length).toBe(4);
            })
        });

        test('querys', () => {
            return createTestContext('./tests/design/querys',testDatabase).catch(err => {
                expect(err).toBe('Only "javascript" type design document testing is supported yet. This directory structure defining one "query" type design document!');
            });
        });
        test('server', () => {
            return createTestServer('./tests/design',testDatabase).then(server => {
                expect(server('server').appdesign.update.updateFromDir({uuid:'uid1'},'p:doc2').info.update_seq).toBe(4);
                expect(server('database')[1].updateByUpdateFromDir).toBe("libfunction call updated");
                expect(server('database','p:doc2').updateByUpdateFromDir).toBe("libfunction call updated");
                expect(server('database','p:doc1').parent).toBe("roger");
                expect(server('_changes',{filter:'appdesign/nothing'}).last_seq).toBe("4-AbRomqy2vFXcd0Yf4RijLw==");
                expect(() => server('_changes',{filter:'appdesig/nothing'})).toThrow('It is not appdesig design document in testdatabase!');
                expect(server('server').allDocs('p')).toMatchSnapshot();
                expect(server('server').find({selector:{parent:{"$gt":"aoger"}},sort:['parent'],use_index:['mango','mongo'],fields:['parent.name']},'s')).toEqual({docs:[{}]});
            });
        });
    });

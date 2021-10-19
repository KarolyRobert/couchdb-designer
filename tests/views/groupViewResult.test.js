import groupViewResult from '../../src/testing/views/groupViewResult';
import compareAny from '../../src/util/compareAny';


describe('groupViewResult',() => {
    test('all case',() => {
        let rows = [
            {id: 1, key:[1,2,5], value:1},
            {id: 2, key:[1,2,6], value:2},
            {id: 3, key:[1,2,7], value:3},
            {id: 4, key:["a",1,2], value:4},
            {id: 5, key:["a",1,3], value:5},
            {id: 6, key:"a", value:6},
            {id: 7, key:"a", value:7},
            {id: 8, key:10, value:8},
            {id: 9, key:12, value:9},
            {id: 10, key:10, value:10},
            {id: 11, key:[[10],9,8], value:11},
            {id: 12, key:[[10],9,7], value:12},
            {id: 13, key:[[10],9], value:13},
            {id: 14, key:[[10],5], value:14},
            {id: 15, key:[1,2,5], value:15},
            {id: 16, key:false, value:16},
            {id: 17, key:[1,2,false], value:17},
            {id: 18, key:null, value:18},
            {id: 19, key:["a",2,false], value:19},
            {id: 20, key:["a",1,3], value:20},
        ]
        let vResult = {total_rows:20,offset:0,rows};
        vResult.rows.sort((a,b) => compareAny(a.key, b.key));
        expect(groupViewResult(vResult.rows,1)).toMatchSnapshot();
        expect(groupViewResult(vResult.rows,2)).toMatchSnapshot();
        expect(groupViewResult(vResult.rows,3)).toMatchSnapshot();
        expect(groupViewResult(vResult.rows,'max')).toMatchSnapshot();
    })
});
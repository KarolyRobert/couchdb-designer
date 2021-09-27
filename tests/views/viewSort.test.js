import viewSort from '../../src/testing/views/viewSort';



describe('viewSort',() => {
    test('sort',() => {
        let rows = [
            {key:{b:10,a:1}},
            {key:{b:10}},
            {key:{b:10}},
            {key:{a:false, b:true}},
            {key:{a:10}},
            {key:{a:null}},
            {key:[1,false,true]},
            {key:[1,null,23]},
            {key:[0,20,30]},
            {key:[null,0,'zebra']},
            {key:[0,20,10]},
            {key:'zebra'},
            {key:'alma'},
            {key:10},
            {key:0},
            {key:true},
            {key:false},
            {key:null}
        ]
        rows.sort(viewSort);
        expect(rows).toMatchSnapshot();
    })
})
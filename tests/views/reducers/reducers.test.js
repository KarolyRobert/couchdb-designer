import {_sum} from '../../../src/testing/views/reducers/builtInReducers';



describe('reducers',() => {
    test('sum',() => {
        expect(() => _sum(null,[{f:1},{f:[1,3]},{f:1,x:10}])).toThrow();
        expect(_sum(null,[1,1,1,1])).toBe(4);
        expect(_sum(null,[[1,1],1,1])).toEqual([3,1]);
        expect(_sum(null,[1,1,[1,1,1]])).toEqual([3,1,1]);
        expect(_sum(null,[{f:1},{f:1},{f:1}])).toEqual({f:3});
        expect(_sum(null,[{f:1},{f:[1,3]},{f:1}])).toEqual({f:[3,3]});
        expect(() => _sum(null,[{f:1},{f:[1,3]},{f:[1,'helo']}])).toThrow();
    });
});
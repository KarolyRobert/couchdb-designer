import { validateViewOptions,jokerEquals } from '../../src/testing/views/viewUtils';

describe('viewUtils',() => {
    test('validateViewOptions', () => {
        expect(validateViewOptions(false)).toEqual({reduce:false,group:false,group_level:0});
        expect(validateViewOptions(true)).toEqual({reduce:true,group:false,group_level:0});
        expect(validateViewOptions(true,{reduce:false})).toEqual({reduce:false,group:false,group_level:0});
        expect(() => validateViewOptions(false,{reduce:true})).toThrow('Missing reduce function!');
        expect(validateViewOptions(false,{reduce:false,group:false,group_level:0})).toEqual({reduce:false,group:false,group_level:0});
        expect(validateViewOptions(true,{group_level:1})).toEqual({reduce:true,group:true,group_level:1});
        expect(() => validateViewOptions(false,{group_level:1})).toThrow('Invalid use of grouping on a map view.');
        expect(() => validateViewOptions(true,{group_level:1,group:false})).toThrow('Can\'t specify group=false and group_level>0 at the same time');
    })
    test('jokerEquals',() => {
        expect(jokerEquals(null,0)).toBe(false);
        expect(jokerEquals([10,[10,[10]]],[10,[10,[10]]])).toBe(true);
        expect(jokerEquals({a:{b:[10,[10]]}},{a:{b:[10,[10]]}})).toBe(true);
    })
});
import getSelectorBase from "./getSelectorBase";


describe("getSelectorBase",() => {

    test('simple',() => {
        let selector = {
            'name':'foo'
        }
        expect(getSelectorBase(selector)).toEqual(['name']);
    })

    test('and',() => {
        let selector = {
            'name':'foo',
            'address':'bar'
        }
        expect(getSelectorBase(selector)).toEqual(['name','address']);
    })

    test('empty',() => {
        let selector = {
            '$or':[{foo:'bar'},{bar:'foo'}]
        }
        expect(getSelectorBase(selector)).toEqual([]);
    })

})